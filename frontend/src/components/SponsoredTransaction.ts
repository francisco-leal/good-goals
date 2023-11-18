import { UserOperation, bundlerActions, getSenderAddress, signUserOperationHashWithECDSA } from "permissionless"
import { pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico"
import {concat, createClient, createPublicClient, encodeFunctionData, http, Hex} from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { celoAlfajores } from "viem/chains"
import {SMART_CONTRACT_ADDRESS} from "@/lib/constants";


class SponsoredTransaction {

    private readonly abi;

    constructor(abi: any) {
        this.abi = abi;
    }

    async submit(functionToCall: string, ...args: any[]) {
        console.log('Trying to create sponsored tx');

        // CREATE THE CLIENTS
        const publicClient = createPublicClient({
            transport: http("https://alfajores-forno.celo-testnet.org"),
            chain: celoAlfajores
        })

        const chain = "celo-alfajores-testnet" // find the list of chain names on the Pimlico verifying paymaster reference page
        const apiKey = "744faeec-99aa-4aad-9cee-adb551928252" // REPLACE THIS

        let client = createClient({
            transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
            chain: celoAlfajores
        });
        console.log(client);
        const bundlerClient = client.extend(bundlerActions).extend(pimlicoBundlerActions)

        const paymasterClient = createClient({
            // ⚠️ using v2 of the API ⚠️
            transport: http(`https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`),
            chain: celoAlfajores
        }).extend(pimlicoPaymasterActions)

        // GENERATE THE INITCODE
        const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"

        const ownerPrivateKey = generatePrivateKey()
        const owner = privateKeyToAccount(ownerPrivateKey)

        console.log("Generated wallet with private key:", ownerPrivateKey)

        const initCode = concat([
            SIMPLE_ACCOUNT_FACTORY_ADDRESS,
            encodeFunctionData({
                abi: [{
                    inputs: [{ name: "owner", type: "address" }, { name: "salt", type: "uint256" }],
                    name: "createAccount",
                    outputs: [{ name: "ret", type: "address" }],
                    stateMutability: "nonpayable",
                    type: "function",
                }],
                args: [owner.address, BigInt('0')]
            })
        ]);

        console.log("Generated initCode:", initCode)

        const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

        const senderAddress = await getSenderAddress(publicClient, {
            initCode,
            entryPoint: ENTRY_POINT_ADDRESS
        })
        console.log("Calculated sender address:", senderAddress)

        // GENERATE THE CALLDATA
        const to = SMART_CONTRACT_ADDRESS // vitalik
        const value = BigInt(0)

        const functionAbi = this.abi.filter((fn1: any) => fn1.name === functionToCall);
        const createGroupData = encodeFunctionData({
            abi: functionAbi,
            args: args
        })

        const callData = encodeFunctionData({
            abi: [
                {
                    inputs: [
                        { name: "dest", type: "address" },
                        { name: "value", type: "uint256" },
                        { name: "func", type: "bytes" }
                    ],
                    name: "execute",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function"
                }
            ],
            args: [to, value, createGroupData]
        })

        console.log("Generated callData:", callData)

        // FILL OUT REMAINING USER OPERATION VALUES
        const gasPrice = await bundlerClient.getUserOperationGasPrice()

        // console.log("Gas Price:", gasPrice)
        const userOperation = {
            sender: senderAddress,
            nonce: BigInt(0),
            initCode,
            callData,
            maxFeePerGas: gasPrice.fast.maxFeePerGas,
            maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
            // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
            signature: "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex
        }

        // REQUEST PIMLICO VERIFYING PAYMASTER SPONSORSHIP
        const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
            userOperation,
            entryPoint: ENTRY_POINT_ADDRESS
        })

        const sponsoredUserOperation: UserOperation = {
            ...userOperation,
            preVerificationGas: sponsorUserOperationResult.preVerificationGas,
            verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
            callGasLimit: sponsorUserOperationResult.callGasLimit,
            paymasterAndData: sponsorUserOperationResult.paymasterAndData
        }

        // SIGN THE USER OPERATION
        const signature = await signUserOperationHashWithECDSA({
            account: owner,
            userOperation: sponsoredUserOperation,
            chainId: celoAlfajores.id,
            entryPoint: ENTRY_POINT_ADDRESS
        })
        sponsoredUserOperation.signature = signature

        console.log("Generated signature:", signature)

        // SUBMIT THE USER OPERATION TO BE BUNDLED
        const userOperationHash = await bundlerClient.sendUserOperation({
            userOperation: sponsoredUserOperation,
            entryPoint: ENTRY_POINT_ADDRESS
        })

        console.log("Received User Operation hash:", userOperationHash)

        // let's also wait for the userOperation to be included, by continually querying for the receipts
        console.log("Querying for receipts...")
        const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOperationHash })
        const txHash = receipt.receipt.transactionHash

        console.log(`UserOperation included: https://alfajores.celoscan.io//tx/${txHash}`)
    }

}

export default SponsoredTransaction;
