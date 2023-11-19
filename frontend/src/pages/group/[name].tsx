import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import {
  Typography,
  Button,
  Tag,
  Avatar,
} from '@ensdomains/thorin'
import { Container } from '@/components/templates'
import {
  MainContent,
  TagRow,
  CreatorRow,
  Divider,
} from '@/components/Goal';
import { toast } from 'react-toastify';
import { useAccount, useContractRead, useEnsName, useEnsAvatar, useContractWrite, useWaitForTransaction, erc20ABI } from 'wagmi'
// import GoalsABI from "@/lib/abi/Goals.json";
import GoalsABI from "@/lib/abi/full-goals.json";
import { SMART_CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from "@/lib/constants";
import { arrayToOnchainObject } from "@/lib/utils";
import { formatEther, parseEther } from 'viem'
import { OnchainUserItem } from '@/components/OnchainUserItem'
import { shortAddress } from '@/lib/utils';

const DEFAULT_IMAGE = "https://i.seadn.io/gae/tKTl6AmyJgf4gKOCgQmE5zd4iRQ0G8YsAsxXzOAqcgGCFx9jV3PKz6ajOQiKmarBUmAPIwBdGI-amV03A955-hJAFvKl8eXvO4B4qQ";

type Step = "join" | "wait" | "submit" | "start" | "distribute" | "vote" | "done" | "";
type StepComponent = (props: { submitStep: () => void, isLoading?: boolean }) => JSX.Element;

const JoinStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Pay to Join Game</Button>
  )
};

const VoteStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Confirm Votes</Button>
  )
};

const DoneStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>All settled!</Button>
  )
};

const WaitStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep} disabled>Waiting to start...</Button>
  )
};

const SubmitStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Ape in</Button>
  )
};

const LoadingStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep} loading={true}>Loading</Button>
  )
};

const DistributeStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Claim NFT</Button>
  )
};

const StartStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Start</Button>
  )
}

export default function Page() {
  // routing
  const router = useRouter()
  const { name } = router.query

  // onchain
  const { address } = useAccount();
  const { data: groupExists, isLoading: groupLoading } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "groupExists",
    args: ["TurkishDilemma"],
    enabled: !!name
  });

  const { data: groupInformation } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "groups",
    args: [name],
    enabled: (!!name && !!groupExists)
  });

  const groupData = useMemo(() => {
    // @ts-ignore
    return arrayToOnchainObject(groupInformation || []);
  }, [groupInformation])

  const { data: memberInfo }: {data?: `0x${string}`[], isLoading: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "getMembers",
    args: [name],
    enabled: (!!name && !!groupExists && groupData?.numberMembers > 0)
  });

  console.log({memberInfo, groupData});

  const { data: allProofs }: {data?: string[], isLoading: boolean, isError: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "getProofs",
    args: [name],
    enabled: (!!name && !!groupExists)
  });

  const { data: ownerName, } = useEnsName({
    address: groupData?.groupOwner,
    enabled: !!groupData?.groupOwner && (groupData?.groupOwner != "0x0")
  })
  const { data: ownerAvatar, } = useEnsAvatar({
    name: ownerName,
    enabled: !!ownerName
  })

  useEffect(() => {
    if(groupData.exists) {
      if (groupData.endTime == 0) {
        if (groupData.groupOwner === address && groupData?.numberMembers > 0) {
          setStep("start")
        } else {
          if (memberInfo && address && memberInfo.includes(address)) {
            setStep("wait")
          } else {
            setStep("join")
          }
        }
      } else {
        if (memberInfo && address && memberInfo.includes(address)) {
          setStep("submit")
        } else {
          setStep("join")
        }
      }
    }
  }, [groupData, memberInfo]);

  const {
    data: startTxData,
    writeAsync: startWrite,
    isLoading: isLoadingStart
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "start",
    onSuccess: () => {
      toast("Transaction submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const {
    data: voteTX,
    writeAsync: voteWrite,
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "submitVetos",
    onSuccess: () => {
      toast("Transaction submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const {status: voteStatus} = useWaitForTransaction({
    hash: voteTX?.hash
  });

  useEffect(() => {
    if (voteStatus == "success") {
      setStep("distribute")
    }
  }, [voteStatus])

  const {
    data: distributeTx,
    writeAsync: distributeWrite,
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "distribute",
    onSuccess: () => {
      toast("Transaction submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    },
  });

  const {status: distributeStatus} = useWaitForTransaction({
    hash: distributeTx?.hash
  });

  useEffect(() => {
    if (distributeStatus == "success") {
      setStep("done")
    }
  }, [distributeStatus])

  const { status: startStatus } = useWaitForTransaction({
    hash: startTxData?.hash,
  });

  // component state
  const [step, setStep] = useState<Step>("wait");
  const [approvalStates, setApprovalStates] = useState({first: true, second: true, third: true})

  useEffect(() => {
    if (groupData.numberMembers > 2 && (groupData.numberMembers == groupData.numberVotes)) {
      setStep("distribute")
      return;
    }
    if(allProofs && allProofs?.includes(address || "0x0")) {
      setStep("vote")
    }
    //@ts-ignore
  }, [allProofs, groupInformation?.numberMembers, groupInformation?.numberVotes]);

  const start = async () => {
    await startWrite({args: [name]})
  }

  const vote = async () => {
    const addressToReject = []
    if(!approvalStates.first) addressToReject.push(memberInfo?.[0])
    if(!approvalStates.second) addressToReject.push(memberInfo?.[1])
    if(!approvalStates.third) addressToReject.push(memberInfo?.[2])
    await voteWrite({args: [name, addressToReject]})
  }

  const distribute = async () => {
    await distributeWrite({args: [name]})
  }

  const title = () => {
    if( name ) return name.toString();
    else return "Group";
  }

  const {
    data: joinGroupTXData,
    writeAsync: joinGroupWriteTX,
    isLoading: isLoadingJoinGroup,
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
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

  const { status: joinStatus } = useWaitForTransaction({
    hash: joinGroupTXData?.hash,
  });

  useEffect(() => {
    if(joinStatus && joinStatus == "success") {
      setStep("submit")
    }
  });

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

  const joinApe = async () => {
    await approveTX({args: [SMART_CONTRACT_ADDRESS, parseEther("1000")]});
    await joinGroupWriteTX({args: [name, "APE IN", "LET'S APE FRENS"]});
  };

  const renderActionButton = () => {
    switch(step) {
      case "wait":
        return <WaitStep submitStep={() => null}/>
      case "join":
        return <JoinStep submitStep={() => joinApe()} isLoading={isLoadingJoinGroup || isApproving}/>
      case "submit":
        return <SubmitStep submitStep={() => router.push(`/group/${name}/submit`)}/>
      case "vote":
        return <VoteStep submitStep={() => vote()}/>
      case "start":
        return <StartStep submitStep={() => start()}/>
      case "distribute":
        return <DistributeStep submitStep={() => distribute()}/>
      case "done":
        return <DoneStep submitStep={() => null}/>
      default:
        return <LoadingStep submitStep={() => null}/>
    }
  }

  const groupContent = () => {
    return (
      <MainContent>
        <Typography asProp='h1' weight='bold' className='mb-4'>Turkish Dilemma 🇹🇷</Typography>
        <Typography asProp='p' fontVariant='body'> In "Turkish Dilemma," each friend stakes an equal amount of ApeCoin. The winner is the player who presses the “Ape In” button at the median turn order. The suspense builds over 7 days, culminating in a surprise reveal of the winner.</Typography>
        <TagRow>
          {/* @ts-ignore */ }
          {!!groupData.baseAmount && <Tag colorStyle='bluePrimary'>{formatEther(groupData.baseAmount)} $APE</Tag>}
          {(!!groupData.durationDays && !groupData.endTime) && <Tag colorStyle='blueSecondary'>{6} days</Tag>}
          {(!!groupData.durationDays && !!groupData.endTime && step != "distribute") && <Tag colorStyle='blueSecondary'>{2} days left</Tag>}
          {(step == "distribute" || step == "done") && <Tag colorStyle='purplePrimary'>Game Over</Tag>}
        </TagRow>
        <CreatorRow>
          <div style={{ minWidth: '50px' }}>
            <Avatar label='profile_picture' src={ownerAvatar || DEFAULT_IMAGE}/>
          </div>
          <Typography asProp='p' fontVariant='body'>Created by {ownerName || shortAddress(groupData.groupOwner)}</Typography>
        </CreatorRow>
        <Divider/>
        {groupData.numberMembers > 0 ?
          <OnchainUserItem
            key={`${name}-${0}`}
            name={name?.toString() || ""}
            numberOfMembers={groupData.numberMembers}
            step={step}
            groupExists={!!groupExists}
            index={0}
            address={memberInfo?.[0] || "0x0"}
            approvalState={approvalStates.first}
            setApprovalState={(state) => setApprovalStates({...approvalStates, first: state})}
            allProofs={allProofs}
          /> :
          <Typography className="mt-2">Be the first to join the game!</Typography>}
        {groupData.numberMembers > 1 &&
          <OnchainUserItem
            key={`${name}-${1}`}
            name={name?.toString() || ""}
            numberOfMembers={groupData.numberMembers}
            step={step}
            groupExists={!!groupExists}
            index={1}
            address={memberInfo?.[1] || "0x0"}
            approvalState={approvalStates.second}
            setApprovalState={(state) => setApprovalStates({...approvalStates, second: state})}
            allProofs={allProofs}
          />}
        {groupData.numberMembers > 2 &&
          <OnchainUserItem
            key={`${name}-${2}`}
            name={name?.toString() || ""}
            numberOfMembers={groupData.numberMembers}
            step={step}
            groupExists={!!groupExists}
            index={2}
            address={memberInfo?.[2] || "0x0"}
            approvalState={approvalStates.third}
            setApprovalState={(state) => setApprovalStates({...approvalStates, third: state})}
          />}
        {renderActionButton()}
      </MainContent>
    )
  }

  const noGroupContent = () => {
    return (
      <MainContent>
        <Typography asProp='h1' weight='bold' className='mb-4'>{name}</Typography>
        <Typography asProp='p' fontVariant='body'>This group does not exist yet. You must create it first.</Typography>
      </MainContent>
    )
  }

  if (groupLoading) return <div>Loading...</div>;

  return (
    <>
      <NextSeo title={title()} />
      <div className="w-full h-[100vh] flex justify-center flex-col items-center ">
        <Container as="main" $variant="flexVerticalCenter">
          {groupExists ? groupContent() : noGroupContent()}
        </Container>
        <footer />
      </div>
    </>
  )
}
