import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Typography, Button, LeftArrowSVG, Tag, Avatar } from '@ensdomains/thorin'
import { ConnectButton } from '@/components/ConnectButton'
import { Container, Layout } from '@/components/templates'
import { NavTop, MainContent, TagRow, CreatorRow, Divider, MemberList, MemberRow, MemberDescription } from '@/components/Goal';

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
  const router = useRouter()
  const { name } = router.query
  const [step, setStep] = useState<Step>("");

  const title = () => {
    if( name ) return name.toString();
    else return "Goal";
  }

  const renderStep = () => {
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

  return (
    <>
      <NextSeo title={title()} />
      <Layout>
        <Container as="main" $variant="flexVerticalCenter">
          <NavTop>
            <Button as='a' colorStyle='transparent' shape="square" onClick={() => router.back()}>
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
              </MemberRow>
              <MemberRow>
                <div style={{ minWidth: '50px' }}>
                  <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
                </div>
                <MemberDescription>
                  <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
                  <Typography asProp='p' fontVariant='small'>Reach 10k followers on twitter</Typography>
                </MemberDescription>
              </MemberRow>
              <MemberRow>
                <div style={{ minWidth: '50px' }}>
                  <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
                </div>
                <MemberDescription>
                  <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
                  <Typography asProp='p' fontVariant='small'>Reach 10k followers on twitter</Typography>
                </MemberDescription>
              </MemberRow>
            </MemberList>
            {renderStep()}
          </MainContent>
        </Container>
        <footer />
      </Layout>
    </>
  )
}
