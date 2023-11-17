import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { Typography, Button, LeftArrowSVG } from '@ensdomains/thorin'
import { ConnectButton } from '@/components/ConnectButton'
import { Container, Layout } from '@/components/templates'
import { NavTop, MainContent } from '@/components/Goal';

export default function Page() {
  const router = useRouter()

  return (
    <>
      <NextSeo title={"Upload"} />
      <Layout>
        <Container as="main" $variant="flexVerticalCenter">
          <NavTop>
            <Button colorStyle='transparent' shape="square" onClick={() => router.back()}>
              <LeftArrowSVG />
            </Button>
            <ConnectButton />
          </NavTop>
          <MainContent>
            <Typography>UPLOAD</Typography>
          </MainContent>
        </Container>
        <footer />
      </Layout>
    </>
  )
}
