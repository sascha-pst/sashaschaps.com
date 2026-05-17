import Link from 'next/link'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout title="Not found">
      <article className="page wrap">
        <header className="page-header"><h1>404 — not found</h1></header>
        <div className="page-content">
          <p>The page you requested does not exist or has been moved.</p>
          <p><Link href="/">← Back to home</Link></p>
        </div>
      </article>
    </Layout>
  )
}
