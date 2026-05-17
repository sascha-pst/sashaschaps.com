import Link from 'next/link'
import Layout from '../../components/Layout'
import { getBlogSlugs, getBlogPost } from '../../lib/content'

export default function BlogPost({ post }) {
  const { title, date, tags, excerpt_text, contentHtml } = post
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <Layout title={title} description={excerpt_text}>
      <article className="post wrap">
        <header className="post-header">
          <h1>{title}</h1>
          <p className="post-meta">
            {formattedDate && <time dateTime={date}>{formattedDate}</time>}
            {tags && tags.length > 0 && (
              <>
                <span>·</span>
                {tags.map(t => <span key={t} className="tag">{t}</span>)}
              </>
            )}
          </p>
          {excerpt_text && <p className="lead">{excerpt_text}</p>}
        </header>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <footer className="post-footer">
          <Link href="/blog/">← Back to all posts</Link>
        </footer>
      </article>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: getBlogSlugs().map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const post = getBlogPost(params.slug)
  if (!post) return { notFound: true }
  return { props: { post } }
}
