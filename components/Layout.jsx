import Head from 'next/head'
import Nav from './Nav'
import Footer from './Footer'
import siteConfig from '../siteConfig'

export default function Layout({ children, title, description }) {
  const pageTitle = title
    ? `${title} · ${siteConfig.title}`
    : siteConfig.title
  const pageDesc = description || siteConfig.description

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={siteConfig.url} />
      </Head>
      <Nav />
      <main className="site-main">{children}</main>
      <Footer />
    </>
  )
}
