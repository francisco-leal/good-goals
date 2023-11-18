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
import {useContractRead, useEnsName, useEnsAvatar, useAccount} from 'wagmi'
// import GoalsABI from "@/lib/abi/Goals.json";
import GoalsABI from "@/lib/abi/full-goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import { arrayToOnchainObject } from "@/lib/utils";
import { formatEther } from 'viem'
import { OnchainUserItem } from '@/components/OnchainUserItem'
import { shortAddress } from '@/lib/utils';
import SponsoredTransaction, {useSimpleAccount} from "@/components/SponsoredTransaction";

const DEFAULT_IMAGE = "https://ipfs.io/ipfs/bafybeigauplro2r3fyn5443z55dp2ze5mc5twl5jqeiurulyrnociqynkq/male-2-8-15-10-8-2-11-9.png";

type Step = "join" | "wait" | "submit" | "start" | "distribute" | "vote" | "done" | "";
type StepComponent = (props: { submitStep: () => void, isLoading?: boolean }) => JSX.Element;

const JoinStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Join</Button>
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
    <Button className='mt-4' onClick={submitStep}>Submit proof</Button>
  )
};

const LoadingStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep} loading={true}>Loading</Button>
  )
};

const DistributeStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Distribute</Button>
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
  const { getSenderAddress, initCode } = useSimpleAccount();
  const [ address, setAddress ] = useState<`0x${string}`>();
  const { address: owner} = useAccount();
  const { data: groupExists, isLoading: groupLoading } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "groupExists",
    args: [name],
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
    enabled: (!!name && !!groupExists && groupData.numberMembers > 0)
  });

  const { data: allProofs }: {data?: string[], isLoading: boolean, isError: boolean} =  useContractRead({
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

  const [isLoadingStart, setLoadingStart] = useState(false);

  useEffect(() => {
    if(groupData.exists) {
      if (groupData.endTime == 0) {
        if (groupData.groupOwner === address && groupData.numberMembers > 0) {
          setStep("start")
        } else {
          if (memberInfo && address && memberInfo.includes(address)) {
            setStep("wait")
          } else {
            setStep("join")
          }
        }
      } else {
        setStep("submit")
      }
    }
  }, [groupData, memberInfo]);

  useEffect(() => {
    const fetchSenderAddress = async() => {
      const address = await getSenderAddress();
      setAddress(address);
    }
    fetchSenderAddress();
  }, []);


  // component state
  const [step, setStep] = useState<Step>("wait");
  const [approvalStates, setApprovalStates] = useState({first: true, second: true, third: true})

  useEffect(() => {
    if (groupData.numberMembers == groupData.numberVotes) {
      setStep("distribute")
      return;
    }
    if(allProofs && allProofs?.includes(address || "0x0")) {
      setStep("vote")
    }
    //@ts-ignore
  }, [allProofs, groupInformation.numberMembers, groupInformation.numberVotes]);

  const start = async () => {
    setLoadingStart(true);
    new SponsoredTransaction(GoalsABI, address!!, initCode, owner!!).submit('start', name).then(() => {
      setStep("submit");
      toast("Transaction submitted!");
      router.push(`/group/${name}`);
    }).catch((error) => {
      console.log(error);
      toast.error("There was an error processing your transaction.");
    }).finally(() => {
      setLoadingStart(false);
    })
  }

  const vote = async () => {
    const addressToReject = []
    if(!approvalStates.first) addressToReject.push(memberInfo?.[0])
    if(!approvalStates.second) addressToReject.push(memberInfo?.[1])
    if(!approvalStates.third) addressToReject.push(memberInfo?.[2])
    new SponsoredTransaction(GoalsABI, address!!, initCode, owner!!).submit('vote', name, addressToReject).then(() => {
      setStep("distribute")
      toast("Transaction submitted!");
      router.push(`/group/${name}`);
    }).catch((error) => {
      console.log(error);
      toast.error("There was an error processing your transaction.");
    }).finally(() => {
    })

  }

  const distribute = async () => {
    new SponsoredTransaction(GoalsABI, address!!, initCode, owner!!).submit('distribute', name).then(() => {
      setStep("done");
      toast("Transaction submitted!");
      router.push(`/group/${name}`);
    }).catch((error) => {
      console.log(error);
      toast.error("There was an error processing your transaction.");
    }).finally(() => {
    })
  }

  const title = () => {
    if( name ) return name.toString();
    else return "Group";
  }

  const renderActionButton = () => {
    switch(step) {
      case "wait":
        return <WaitStep submitStep={() => null}/>
      case "join":
        return <JoinStep submitStep={() => router.push(`/group/${name}/join`)}/>
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
        <Typography asProp='h1' weight='bold' className='mb-4'>{name}</Typography>
        <Typography asProp='p' fontVariant='body'>This group is for the true Apes, the holders of Ape Coin to hit their goals</Typography>
        <TagRow>
          {/* @ts-ignore */ }
          {!!groupData.baseAmount && <Tag colorStyle='bluePrimary'>{formatEther(groupData.baseAmount)} ETH Buy in</Tag>}
          {(!!groupData.durationDays && !groupData.endTime) && <Tag colorStyle='blueSecondary'>{Number(groupData.durationDays)} days</Tag>}
          {(!!groupData.durationDays && !!groupData.endTime) && <Tag colorStyle='blueSecondary'>{groupData.durationDays} days left</Tag>}
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
          <Typography className="mt-2">Be the first to join the group!</Typography>}
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
            index={1}
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
