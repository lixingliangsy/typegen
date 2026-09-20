import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TypeGen" />
        <meta property="og:description" content="Paste JSON or CSV and TypeGen infers clean TypeScript interfaces (or a Zod schema), explains its assumptions, and flags ambiguous fields you should double-check." />
        <meta property="og:url" content="https://typegen.lxsaihub.com/" />
        <meta property="og:image" content="https://typegen.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TypeGen" />
        <meta name="twitter:description" content="Paste JSON or CSV and TypeGen infers clean TypeScript interfaces (or a Zod schema), explains its assumptions, and flags ambiguous fields you should double-check." />
        <meta name="twitter:image" content="https://typegen.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"TypeGen","url":"https://typegen.lxsaihub.com/","description":"Paste JSON or CSV and TypeGen infers clean TypeScript interfaces (or a Zod schema), explains its assumptions, and flags ambiguous fields you should double-check.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
