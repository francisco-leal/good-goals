import { useState, FormEvent } from "react";
import { Typography, Input, Button, Textarea } from "@ensdomains/thorin";
import { NextSeo } from "next-seo";
import GoalsABI from "@/lib/abi/Goals.json";
import { toast } from "react-toastify";
import { parseEther } from "viem";
import { useRouter } from "next/router";
import SponsoredTransaction from "@/components/SponsoredTransaction";

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoadingCreateGoal, setLoadingCreateGoal] = useState(false);

  const isFormValid =
    groupName !== "" &&
    groupDescription !== "" &&
    buyIn !== "" &&
    duration !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const buyInInEther = parseEther(buyIn);
      const durationInDays = parseInt(duration);

      setLoadingCreateGoal(true);
      new SponsoredTransaction(GoalsABI).submit('createGroup', groupName, buyInInEther, durationInDays).then(() => {
        toast("Transaction submitted!");
        router.push(`/group/${groupName}`);
      }).catch((error) => {
        console.log(error);
        toast.error("There was an error processing your transaction.");
      }).finally(() => {
        setLoadingCreateGoal(false);
      })
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
      <NextSeo title={"Grow or Gamble | Create Group"} />
      <Typography asProp='h1' weight='bold' fontVariant="headingOne" className='mb-4'>Create Group</Typography>
      <div className="mx-8">
        <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Group Name"
              placeholder="Apes Together Strong"
              inputMode="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Textarea
              label="Group Description"
              placeholder="The goal of this group is to..."
              inputMode="text"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
          </div>
          <div className="flex ">
            <div className="mr-2">
              <Input
                label="Buy In"
                placeholder="100"
                inputMode="numeric"
                value={buyIn}
                onChange={(e) => setBuyIn(e.target.value)}
              />
            </div>
            <div className="ml-2">
              <Input
                label="Duration"
                placeholder="days"
                inputMode="numeric"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" loading={isLoadingCreateGoal} disabled={!isFormValid || isLoadingCreateGoal} className="mt-4">
            Create Group
          </Button>
        </form>
      </div>
    </div>
  );
}
