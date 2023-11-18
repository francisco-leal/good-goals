import { configureChains, createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { goerli, celoAlfajores, baseGoerli, arbitrumGoerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID

if (!WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID')
}


export const chains = [celoAlfajores, goerli, baseGoerli, arbitrumGoerli]

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'ENS Frontend Template',
  projectId: WALLETCONNECT_ID,
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
