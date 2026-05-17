import Link from 'next/link'
import Layout from '../../../components/Layout'
import { getBrandSlugs, getBrand } from '../../../lib/content'

export default function BrandItem({ item }) {
  const { title, summary, client, year, role, tools, tags, link, contentHtml } = item

  return (
    <Layout title={title} description={summary}>
      <article className="portfolio-item wrap">
        <header className="portfolio-header">
          <p className="kicker">Brand collaboration{role && ` · ${role}`}</p>
          <h1>{title}</h1>
          {summary && <p className="lead">{summary}</p>}
          <dl className="portfolio-meta">
            {client && <><dt>Client</dt><dd>{client}</dd></>}
            {year   && <><dt>Year</dt><dd>{year}</dd></>}
            {tools  && tools.length > 0 && <><dt>Tools</dt><dd>{tools.join(', ')}</dd></>}
            {tags   && tags.length > 0  && <><dt>Tags</dt><dd>{tags.join(', ')}</dd></>}
            {link   && <><dt>Link</dt><dd><a href={link} rel="noopener noreferrer">{link}</a></dd></>}
          </dl>
        </header>
        <div className="portfolio-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <footer className="portfolio-footer">
          <Link href="/portfolio/">← Back to portfolio</Link>
        </footer>
      </article>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: getBrandSlugs().map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const item = getBrand(params.slug)
  if (!item) return { notFound: true }
  return { props: { item } }
}
