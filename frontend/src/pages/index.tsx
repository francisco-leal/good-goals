import { NextSeo } from "next-seo";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Button } from "@ensdomains/thorin";
import { useWeb3Modal } from "@web3modal/wagmi/react";

 
export default function Home() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  return (
    <div className="w-full h-[100vh] flex justify-center flex-col items-center px-4">
      <NextSeo title={"Grow or Gamble"} />
      {isConnected ? (
        <div className="w-full h-[100vh] flex flex-col items-center justify-around">
          <h1 className="mb-4 text-5xl text-center font-bold">Gamble</h1>
          <div className="flex flex-col items-center gap-4">
            <Link href={"/group/TurkishDilemma"} className="w-full">
              <Button>
                Play Turkish Dilemma 🇹🇷
              </Button>
            </Link>
            <Link href={"/group/joinGroup"} className="w-full">
              <Button colorStyle="accentSecondary">
                Join ApeCoin Chat
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex h-screen bg-split">
          <div className="m-auto text-center">
            <Button>
              Grow
            </Button>
            <div className="text-9xl font-bold text-split my-12">GG</div>
            <Button colorStyle="blueSecondary" onClick={() => open()}>
              Gamble
            </Button>
          </div>

          <style jsx global>{`
            .bg-split {
              background: linear-gradient(to bottom, #fff 50%, #3888ff 50%);
              width: calc(100% + 2rem);
              margin-left: -1rem;
              margin-right: -1rem;
            }
            .text-split {
              background: linear-gradient(to top, #fff 50%, #3888ff 50%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
