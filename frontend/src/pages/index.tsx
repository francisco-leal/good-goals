import { Button, Card, EnsSVG, Heading, Typography } from '@ensdomains/thorin'
import { ConnectButton } from '@/components/ConnectButton'
import { NextSeo } from 'next-seo'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Container, Layout } from '@/components/templates'

export default function Home() {

  const { address, isConnected} = useAccount()

  return (
    <div className='w-full h-full'>
      <h1 className='text-5xl'>Group Goals</h1>
      <ConnectButton />
    </div>
  )
}

