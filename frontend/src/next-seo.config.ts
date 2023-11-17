import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  titleTemplate: '%s | ENS Frontend Template',
  defaultTitle: 'Good Goal',
  description: 'Starter web app for web3 developers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
}

export default config
