import { useState, FormEvent } from "react";
import Link from "next/link";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [duration, setDuration] = useState("");

  const isFormValid =
    groupName !== "" &&
    groupDescription !== "" &&
    buyIn !== "" &&
    duration !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log({
        groupName,
        groupDescription,
        buyIn,
        duration,
      });
    }
  };

  return (
    <div>
      <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
        <div>
          <Link href="/">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="absolute left-8 mt-2"
          >
            <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
          </svg>
          </Link>
          <h1 className="text-4xl font-bold">Create Group</h1>
        </div>
        <div className="mx-8">
          <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700"
              >
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                className="mt-1 p-2 w-full border rounded-md"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="groupDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Group Description
              </label>
              <input
                type="text"
                id="groupDescription"
                className="mt-1 p-2 h-32 w-full border rounded-md"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            <div className="flex ">
              <div className="mr-2">
                <label
                  htmlFor="buyIn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buy In
                </label>
                <input
                  type="text"
                  id="buyIn"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={buyIn}
                  placeholder="Currency"
                  onChange={(e) => setBuyIn(e.target.value)}
                />
              </div>
              <div className="ml-2">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={duration}
                  placeholder="Days"
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-ourPurple text-white rounded-md h-10 font-semibold"
              disabled={!isFormValid}
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
