import CustomConnect from "@/components/CustomConnect";
import { NextSeo } from "next-seo";
import { useAccount } from "wagmi";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="w-full h-[100vh] flex justify-center flex-col items-center">
      <Header />
      {isConnected ? (
        <div className="w-full h-[100vh] flex  flex-col items-center justify-around">
          <h1 className="mb-4 text-5xl text-center">Group Goals</h1>
          <div className="flex  flex-col items-center">
            <Link href={"/createGroup"}>
              <button
                className="w-80 bg-ourPurple text-white rounded-md h-10 "
                type="button"
              >
                Create Group
              </button>
            </Link>
            <button
              className="w-80 bg-white h-10 text-ourPurple rounded-md border-2 border-ourPurple mt-4"
              type="button"
            >
              Join Group
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-[100vh] flex  flex-col items-center justify-around">
          <h1 className="mb-4 text-5xl text-center">Group Goals</h1>
          <div>
            <CustomConnect />
            <button
              className="w-80 bg-white h-10 text-ourPurple rounded-md border-2 border-ourPurple mt-4"
              type="button"
            >
              Create Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
