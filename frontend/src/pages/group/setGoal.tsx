// joinGroup.tsx
import { NextSeo } from "next-seo";
import Header from "@/components/Header";
import { useState, FormEvent } from "react";
import Link from "next/link";

interface JoinGroupProps {
  goalName: string;
  goalDescription: string;
}

const JoinGroup: React.FC<JoinGroupProps> = () => {
  const [buyIn] = useState("100");
  const [duration] = useState("30");
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");

  const isFormValid = buyIn !== "" && duration !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log({
        buyIn,
        duration,
        goalName,
        goalDescription,
      });
    }
  };

  return (
    <div>
      <NextSeo title="Join Group" />
      <Header />
      <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
        <div>
          <Link href="/">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="absolute left-8 mt-2 cursor-pointer"
            >
              <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
            </svg>
          </Link>
          <h1 className="text-4xl">Set Goal</h1>
        </div>
        <div className="w-full ">
          <form className="mx-8 mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="goalName"
                className="block text-sm font-medium text-gray-700"
              >
                Goal Name
              </label>
              <input
                type="text"
                id="goalName"
                className="mt-1 p-2 h-32 w-full border rounded-md"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)} // onChange handler
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="goalDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Goal Description
              </label>
              <input
                type="text"
                id="goalDescription"
                className="mt-1 p-2 h-32 w-full border rounded-md"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)} // onChange handler
              />
            </div>
            <div className="mb-4 flex">
              <div className="mr-2 w-1/2">
                <label
                  htmlFor="buyIn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buy In
                </label>
                <p className="mt-1">
                  {buyIn}
                </p>
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration
                </label>
                <p className="mt-1">
                  {duration}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-ourPurple text-white rounded-md h-10 font-semibold"
              disabled={!isFormValid}
            >
              Join Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
