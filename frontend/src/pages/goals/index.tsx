import { NextSeo } from 'next-seo'

import { ConnectButton } from '@/components/ConnectButton'
import { Container, Layout } from '@/components/templates'

export default function Page() {
  return (
    <>
      <NextSeo title="Profile" />
      <Layout>
        <header />
        <Container as="main" $variant="flexVerticalCenter">
          <h1>generic goals</h1>
          <ConnectButton />
        </Container>
        <footer />
      </Layout>
    </>
  )
}
