import {bundlerActions, getSenderAddress, signUserOperationHashWithECDSA, UserOperation} from "permissionless"
import {pimlicoBundlerActions, pimlicoPaymasterActions} from "permissionless/actions/pimlico"
import {concat, createClient, encodeFunctionData, Hex, http} from "viem"
import {celoAlfajores} from "viem/chains"
import {SMART_CONTRACT_ADDRESS} from "@/lib/constants";
import {useAccount, usePublicClient} from "wagmi";


export default class SponsoredTransaction {
    private readonly abi;
    private readonly senderAddress: `0x${string}`;
    private readonly initCode: `0x${string}`;
    private readonly owner: `0x${string}`;

    constructor(abi: any, senderAddress: `0x${string}`, initCode: `0x${string}`, owner: `0x${string}`) {
        this.abi = abi;
        this.senderAddress = senderAddress;
        this.initCode = initCode;
        this.owner = owner;
    }

    async submit(functionToCall: string, ...args: any[]) {
        console.log('Trying to create sponsored tx');

        const chain = "celo-alfajores-testnet" // find the list of chain names on the Pimlico verifying paymaster reference page
        const apiKey = "744faeec-99aa-4aad-9cee-adb551928252" // REPLACE THIS

        let client = createClient({
            transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
            chain: celoAlfajores
        });
        const bundlerClient = client.extend(bundlerActions).extend(pimlicoBundlerActions)

        const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"


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

        const gasPrice = await bundlerClient.getUserOperationGasPrice()

        const paymasterClient = createClient({
            // ⚠️ using v2 of the API ⚠️
            transport: http(`https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`),
            chain: celoAlfajores
        }).extend(pimlicoPaymasterActions)


        const userOperation = {
            sender: this.senderAddress,
            nonce: BigInt(0),
            initCode: this.initCode,
            callData,
            maxFeePerGas: gasPrice.fast.maxFeePerGas,
            maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
            // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
            signature: "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex
        }
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

        sponsoredUserOperation.signature = await signUserOperationHashWithECDSA({
            account:  {
                address: this.owner,
                type: 'json-rpc'
            },
            userOperation: sponsoredUserOperation,
            chainId: celoAlfajores.id,
            entryPoint: ENTRY_POINT_ADDRESS
        })

        const userOperationHash = await bundlerClient.sendUserOperation({
            userOperation: sponsoredUserOperation,
            entryPoint: ENTRY_POINT_ADDRESS
        })

        const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOperationHash })
        const txHash = receipt.receipt.transactionHash

        console.log(`UserOperation included: https://alfajores.celoscan.io//tx/${txHash}`)
    }

}

export type SimpleAccountResult = {
    initCode: `0x${string}`
    getSenderAddress: () => Promise<`0x${string}`>
}

export const useSimpleAccount = () : SimpleAccountResult => {

    const publicClient = usePublicClient();
    const { address } = useAccount();

    const chain = "celo-alfajores-testnet" // find the list of chain names on the Pimlico verifying paymaster reference page
    const apiKey = "744faeec-99aa-4aad-9cee-adb551928252" // REPLACE THIS

    let client = createClient({
        transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
        chain: celoAlfajores
    });

    const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"

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
            args: [address!!, BigInt('0')]
        })
    ]);

    const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

    return {
        initCode: initCode,
        getSenderAddress: () => getSenderAddress(publicClient, {
            initCode,
            entryPoint: ENTRY_POINT_ADDRESS
        })
    };
}
