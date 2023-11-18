import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import {
  Typography,
  Button,
  Tag,
  Avatar,
  CheckSVG,
  CrossSVG,
  MagnifyingGlassSVG
} from '@ensdomains/thorin'
import { Container } from '@/components/templates'
import {
  MainContent,
  TagRow,
  CreatorRow,
  Divider,
  MemberList,
  MemberRow,
  MemberDescription
} from '@/components/Goal';
import { toast } from 'react-toastify';
import { useAccount, useContractRead, useContractWrite, useEnsName, useEnsAvatar } from 'wagmi'
import GoalsABI from "@/lib/abi/Goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import { arrayToOnchainObject } from "@/lib/utils";
import { formatEther } from 'viem'

const TOKEN_ADDRESS = "0x7d91e51c8f218f7140188a155f5c75388630b6a8"
const DEFAULT_IMAGE = "https://ipfs.io/ipfs/bafybeigauplro2r3fyn5443z55dp2ze5mc5twl5jqeiurulyrnociqynkq/male-2-8-15-10-8-2-11-9.png";

type Step = "join" | "wait" | "submit" | "start" | "distribute" | "";
type StepComponent = (props: { submitStep: () => void, isLoading?: boolean }) => JSX.Element;

const JoinStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Join</Button>
  )
};

const WaitStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Waiting to start...</Button>
  )
};

const SubmitStep: StepComponent = ({submitStep}) => {
  return (
    <Button className='mt-4' onClick={submitStep}>Submit</Button>
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
  const { address } = useAccount();
  const { data: groupExists, isLoading: groupLoading } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "groupExists",
    args: [name],
    enabled: !!name
  });

  const { data: groupInformation, isLoading: groupInformationLoading } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "groups",
    args: [name],
    enabled: (!!name && !!groupExists)
  });

  const groupData = useMemo(() => {
    // @ts-ignore
    return arrayToOnchainObject(groupInformation || []);
  }, [groupInformation])

  const { data: ownerName, } = useEnsName({
    address: groupData?.groupOwner,
  })
  const { data: ownerAvatar, } = useEnsAvatar({
    name: ownerName,
  })

  useEffect(() => {
    if(groupData.exists) {
      if (groupData.endTime == 0) {
        if (groupData.groupOwner === address && groupData.numberMembers > 0) {
          setStep("wait")
        } else {
          setStep("join")
        }
      } else {
        setStep("submit")
      }
    }
  }, [groupData]);

  // component state
  const [step, setStep] = useState<Step>("wait");

  console.log({
    step,
    groupData,
    ownerName,
    ownerAvatar
  })

  const title = () => {
    if( name ) return name.toString();
    else return "Group";
  }

  const joinGroup = async () => {
    // joinGroupWriteTX({args: [name]})
  };

  const renderActionButton = () => {
    switch(step) {
      case "wait":
        return <WaitStep submitStep={() => null}/>
      case "join":
        return <JoinStep submitStep={() => router.push(`/group/${name}/join`)}/>
      case "submit":
        return <SubmitStep submitStep={() => setStep("distribute")}/>
      case "start":
        return <StartStep submitStep={() => setStep("submit")}/>
      case "distribute":
        return <DistributeStep submitStep={() => setStep("start")}/>
      default:
        return <LoadingStep submitStep={() => null}/>
    }
  }

  const renderListActions = () => {
    switch(step) {
      case "submit":
        return <Tag colorStyle="blueSecondary">Waiting for proof</Tag>
      case "distribute":
        return <>
          <Button colorStyle='transparent' shape="square" className='ml-auto'>
            <MagnifyingGlassSVG />
          </Button>
          <Button colorStyle='greenSecondary' shape="square" onClick={() => approve()}>
            <CheckSVG />
          </Button>
          <Button colorStyle='redSecondary' shape="square" onClick={() => approve()}>
            <CrossSVG />
          </Button>
        </>
      default:
        return null;
    }
  }

  const approve = () => {
    toast.success("Approved!");
  }

  const reject = () => {
    toast.error("Approved!");
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
          <Typography asProp='p' fontVariant='body'>Created by {ownerName || groupData.groupOwner}</Typography>
        </CreatorRow>
        <Divider/>
        {groupData.numberMembers > 0 ?
          <MemberList>
            <MemberRow>
              <div style={{ minWidth: '50px' }}>
                <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
              </div>
              <MemberDescription>
                <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
                <Typography asProp='p' fontVariant='small'>Reach 10k followers on twitter</Typography>
              </MemberDescription>
              {renderListActions()}
            </MemberRow>
            <MemberRow>
              <div style={{ minWidth: '50px' }}>
                <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
              </div>
              <MemberDescription>
                <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
                <Typography asProp='p' fontVariant='small'>Reach 10k followers on twitter</Typography>
              </MemberDescription>
              {renderListActions()}
            </MemberRow>
            <MemberRow>
              <div style={{ minWidth: '50px' }}>
                <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
              </div>
              <MemberDescription>
                <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
                <Typography asProp='p' fontVariant='small'>Reach 10k followers on twitter</Typography>
              </MemberDescription>
              {renderListActions()}
            </MemberRow>
          </MemberList> : <Typography className="mt-2">Be the first to join the group!</Typography>
        }
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
