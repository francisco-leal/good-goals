import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useState,useEffect } from 'react'

import { Typography, Button, DocumentSVG } from '@ensdomains/thorin'
import { Container } from '@/components/templates'
import { MainContent } from '@/components/Goal';
import { NFTStorage, File, TokenType } from 'nft.storage';
// @ts-ignore
import mime from 'mime';

import { toast } from 'react-toastify';
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import GoalsABI from "@/lib/abi/Goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";

import { PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers'

const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "" });

export const ipfsToURL = (ipfsAddress: string) => {
  if (ipfsAddress.includes("http")) {
    return ipfsAddress;
  }
  return "https://ipfs.io/" + ipfsAddress.replace("://", "/");
};

export default function Page() {
  const router = useRouter()
  const { name } = router.query
  const [metadata, setMetadata] = useState<TokenType<{ image: File; name: string; description: string; }>>();
  const {
    data: submitProofTx,
    writeAsync: submitProof,
    isLoading: isLoadingSubmitProof
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "submitProof",
    onSuccess: () => {
      toast("Proof submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const { status: submitStatus } = useWaitForTransaction({
    hash: submitProofTx?.hash,
  });

  useEffect(() => {
    if (submitStatus === "success") {
      router.push(`/group/${name}`);
    }
  }, [submitStatus])

  const fileToNFTStorageFormat = async (file: any) => {
    const buffer = await file.arrayBuffer();
    const type = mime.getType(file.name) || undefined;
    return new File([buffer], file.name, { type });
  };

  const linkToImage = async (uploadedImageMetadata: { url: string }) => {
    if (!uploadedImageMetadata) return;

    const url = ipfsToURL(uploadedImageMetadata.url);
    const result = await fetch(url);
    const content = await result.json();

    if (content.image) {
      return ipfsToURL(content.image);
    } else {
      return;
    }
  }

  const sendPushNotification = async() => {
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/02e235213a214a77b7ac2030e86c0e1a");
    const PK = "d8a10def7d17e73605e1f69c0f6ecbe3181412817ed4cd8c0339be2bc44d036a"
    const wallet = new ethers.Wallet(PK, provider);

    const userAlice = await PushAPI.initialize(wallet, {
      // @ts-ignore
      env: "staging",
    });

    console.log({userAlice})
    const aliceInfo = await  userAlice.notification.list();
    console.log({aliceInfo})
    const aliceChats = await userAlice.chat.latest("0x7Dd39fc27537D14bE67250b79E594e71b8C2f4d2");
    console.log({aliceChats})
    // const channelInfo = await userAlice.channel.info();
    // console.log({channelInfo})
    const sendNotifRes = await userAlice.channel.send(['0x7Dd39fc27537D14bE67250b79E594e71b8C2f4d2'], {notification: {title:  'code test',body:  'much code test',},});
    // const aliceChats = await userAlice.chat.latest("0x33041027dd8F4dC82B6e825FB37ADf8f15d44053");
    console.log({sendNotifRes})
  }

  const handleUpload = async (event:any) => {
    event.preventDefault();
    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) return;

    try {
      // Convert the file to the format expected by NFT.Storage
      const newFile = await fileToNFTStorageFormat(file);

      // Store the file and metadata
      const uploadedImageMetadata = await nftstorage.store({
        image: newFile,
        name: 'Your NFT Name', // Replace with dynamic data as needed
        description: 'Your NFT Description' // Replace with dynamic data as needed
      });

      setMetadata(uploadedImageMetadata);
      console.log('NFT metadata:', uploadedImageMetadata);

      const link = await linkToImage(uploadedImageMetadata)
      await submitProof({args: [name, link]})
      sendPushNotification();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <NextSeo title={"Upload"} />
      <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
        <Container as="main" $variant="flexVerticalCenter">
          <MainContent>
            <Typography>Upload Proof</Typography>
            <div className="flex justify-center items-center border border-gray-300 bg-white p-4 rounded-lg my-4">
              <DocumentSVG style={{ width: "100%", height: "200px" }} />
            </div>
            <form onSubmit={handleUpload} className="flex flex-col items-center justify-center space-y-4 p-6 rounded-md">
              <label className="block w-full">
                <span className="sr-only">Choose proof to upload</span>
                <input type="file" accept="image/*" className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100
                "/>
              </label>
              <Button type="submit" disabled={!!metadata || isLoadingSubmitProof}>Upload</Button>
            </form>
          </MainContent>
        </Container>
      </div>
    </>
  )
}
