import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { getBlogPosts } from '../../lib/content'

export default function Blog({ posts }) {
  return (
    <Layout title="Blog" description="Essays, notes, and updates.">
      <article className="page wrap">
        <header className="page-header">
          <h1>Blog</h1>
          <p className="subtitle">Essays, notes, and updates.</p>
        </header>
        <div className="stack">
          {posts.length > 0
            ? posts.map(post => <PostCard key={post.slug} post={post} />)
            : <p className="placeholder-note">No posts yet. Add folders under <code>_blog/</code> with an <code>index.md</code> file.</p>
          }
        </div>
      </article>
    </Layout>
  )
}

export function getStaticProps() {
  return { props: { posts: getBlogPosts() } }
}
