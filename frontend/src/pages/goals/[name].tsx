import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useState } from 'react'

import {
  Typography,
  Button,
  LeftArrowSVG,
  Tag,
  Avatar,
  CheckSVG,
  CrossSVG,
  MagnifyingGlassSVG
} from '@ensdomains/thorin'
import { ConnectButton } from '@/components/ConnectButton'
import { Container, Layout } from '@/components/templates'
import {
  NavTop,
  MainContent,
  TagRow,
  CreatorRow,
  Divider,
  MemberList,
  MemberRow,
  MemberDescription
} from '@/components/Goal';
import { toast } from 'react-toastify';
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import GoalsABI from "@/lib/abi/Goals.json";

const SMART_CONTRACT_ADDRESS = "0xfd24AEE56367A827f4f730180dd8E3060c6021dE"
const TOKEN_ADDRESS = "0x7d91e51c8f218f7140188a155f5c75388630b6a8"
const DEFAULT_IMAGE = "https://ipfs.io/ipfs/bafybeigauplro2r3fyn5443z55dp2ze5mc5twl5jqeiurulyrnociqynkq/male-2-8-15-10-8-2-11-9.png";

type Step = "join" | "wait" | "submit" | "start" | "distribute" | "";
type StepComponent = (props: { submitStep: () => void }) => JSX.Element;

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
  const { data: groupExists } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "groupExists",
    args: [name],
    enabled: !!name
  });

  const { data: members } = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "getMembers",
    args: [name],
    enabled: !!name
  });

  const {
    data: joinTX,
    writeAsync: joinGroup,
    isLoading: isLoadingJoin
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "joinGroup",
    onSuccess: () => {
      toast("Group joined!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    }
  });

  const {
    data: vetoTx,
    writeAsync: vetoProof,
    isLoading: isLoadingVeto
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "submitVetos",
    onSuccess: () => {
      toast("vetos submitted!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    }
  });

  const {
    data: distributeTx,
    writeAsync: distribute,
    isLoading: isLoadingDistribute
  } = useContractWrite({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "distribute",
    onSuccess: () => {
      toast("fund distributed!");
    },
    onError: (err: any) => {
      if (err?.shortMessage !== "User rejected the request.") {
        toast.error("There was an error processing your transaction.");
      }
    }
  });

  // component state
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<Step>("distribute");


  console.log("ADDRESS: ", address);

  const title = () => {
    if( name ) return name.toString();
    else return "Goal";
  }

  const renderActionButton = () => {
    switch(step) {
      case "wait":
        return <WaitStep submitStep={() => null}/>
      case "join":
        return <JoinStep submitStep={() => setStep("wait")}/>
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

  return (
    <>
      <NextSeo title={title()} />
      <Layout>
        <Container as="main" $variant="flexVerticalCenter">
          <NavTop>
            <Button colorStyle='transparent' shape="square" onClick={() => router.back()}>
              <LeftArrowSVG />
            </Button>
            <ConnectButton />
          </NavTop>
          <MainContent>
            <Typography asProp='h1' weight='bold' className='mb-4'>{name}</Typography>
            <Typography asProp='p' fontVariant='body'>This group is for the true Apes, the holders of Ape Coin to hit their goals</Typography>
            <TagRow>
              <Tag colorStyle='bluePrimary'>$100 Buy in</Tag>
              <Tag colorStyle='blueSecondary'>16 days left</Tag>
            </TagRow>
            <CreatorRow>
              <div style={{ minWidth: '50px' }}>
                <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
              </div>
              <Typography asProp='p' fontVariant='body'>Created by leal.eth</Typography>
            </CreatorRow>
            <Divider/>
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
            </MemberList>
            {renderActionButton()}
          </MainContent>
        </Container>
        <footer />
      </Layout>
    </>
  )
}
