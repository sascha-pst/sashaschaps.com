import Link from 'next/link'
import Layout from '../../../components/Layout'
import { getProjectSlugs, getProject } from '../../../lib/content'

export default function ProjectItem({ item }) {
  const { title, summary, year, role, tools, tags, link, contentHtml } = item

  return (
    <Layout title={title} description={summary}>
      <article className="portfolio-item wrap">
        <header className="portfolio-header">
          <p className="kicker">Project{role && ` · ${role}`}</p>
          <h1>{title}</h1>
          {summary && <p className="lead">{summary}</p>}
          <dl className="portfolio-meta">
            {year  && <><dt>Year</dt><dd>{year}</dd></>}
            {tools && tools.length > 0 && <><dt>Tools</dt><dd>{tools.join(', ')}</dd></>}
            {tags  && tags.length > 0  && <><dt>Tags</dt><dd>{tags.join(', ')}</dd></>}
            {link  && <><dt>Link</dt><dd><a href={link} rel="noopener noreferrer">{link}</a></dd></>}
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
    paths: getProjectSlugs().map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const item = getProject(params.slug)
  if (!item) return { notFound: true }
  return { props: { item } }
}
