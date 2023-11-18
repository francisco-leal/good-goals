import { useRouter } from 'next/router'
import { SMART_CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from "@/lib/constants";
import {useContractWrite, erc20ABI, useWaitForTransaction, useAccount} from "wagmi";
import GoalsABI from "@/lib/abi/Goals.json";
import { toast } from "react-toastify";
import { useState, FormEvent, useEffect } from "react";
import { Typography, Button, Input, Textarea } from '@ensdomains/thorin';
import { NextSeo } from 'next-seo';
import { parseEther } from 'viem';
import SponsoredTransaction, {useSimpleAccount} from "@/components/SponsoredTransaction";

export default function CreateGroup() {
  const router = useRouter()
  const { getSenderAddress, initCode } = useSimpleAccount();
  const [ address, setAddress ] = useState<`0x${string}`>();

  const { address: owner } = useAccount();
  const { name } = router.query
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadingJoinGroup, setLoadingJoinGroup] = useState(false);

  useEffect(() => {
    const fetchSenderAddress = async() => {
      const address = await getSenderAddress();
      setAddress(address);
    }
    fetchSenderAddress();
  }, []);

  const {
    data: approveTXData,
    writeAsync: approveTX,
    isLoading: isApproving
  } = useContractWrite({
    address: ERC20_TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    onSuccess: () => {
      toast("Transaction submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const { status: approvalStatus } = useWaitForTransaction({
    hash: approveTXData?.hash,
  });

  useEffect(() => {
    if (approvalStatus == "success") {
      setLoadingJoinGroup(true);
      new SponsoredTransaction(GoalsABI, address!!, initCode, owner!!).submit('joinGroup', name, title, description).then(() => {
        toast("Transaction submitted!");
        router.replace(`/group/${name}`);
      }).catch((error) => {
        console.log(error);
        toast.error("There was an error processing your transaction.");
      }).finally(() => {
        setLoadingJoinGroup(false);
      })
    }
  }, [approvalStatus])

  const isFormValid = title !== "" && description !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await approveTX({args: [SMART_CONTRACT_ADDRESS, parseEther("0.1")]});
  }

  return (
    <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
      <NextSeo title={"Grow or Gamble | Set Goal"} />
      <Typography asProp='h1' weight='bold' fontVariant="headingOne" className='mb-4'>Set Goal</Typography>
      <div className="mx-8 min-w-full">
        <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
            <Input
              label="Title"
              placeholder="Be the best ape"
              inputMode="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Textarea
              label="Goal Description"
              placeholder="Your goal is..."
              inputMode="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" loading={isLoadingJoinGroup} disabled={!isFormValid || isLoadingJoinGroup} className="mt-4">
            Commit to Goal
          </Button>
        </form>
      </div>
    </div>
  );
}
