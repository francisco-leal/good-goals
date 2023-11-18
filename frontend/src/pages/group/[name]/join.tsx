import { useRouter } from 'next/router'
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import { useContractWrite } from "wagmi";
import GoalsABI from "@/lib/abi/Goals.json";
import { toast } from "react-toastify";
import { useState, FormEvent } from "react";
import { Typography, Button, Input, Textarea } from '@ensdomains/thorin';
import { NextSeo } from 'next-seo';

export default function CreateGroup() {
  const router = useRouter()
  const { name } = router.query
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {
    writeAsync: joinGroupWriteTX,
    isLoading: isLoadingJoinGroup
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "joinGroup",
    onSuccess: () => {
      toast("Transaction submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const isFormValid = title !== "" && description !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await joinGroupWriteTX({args: [name, title, description]});
    // router.replace(`/group/${name}`);
  }

  return (
    <div className="w-full h-[100vh] flex justify-center flex-col items-center px-8">
        <NextSeo title={"Grow or Gamble | Set Goal"} />
        <Typography asProp='h1' weight='bold' fontVariant="headingOne" className='mb-4'>Commit to Goal</Typography>
        <form className="mx-8 mt-8 w-full" onSubmit={handleSubmit}>
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
              label="Group Description"
              placeholder="The goal of this group is to..."
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
  );
}
