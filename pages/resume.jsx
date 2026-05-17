import Layout from '../components/Layout'
import Link from 'next/link'

export function Resume() {
  return (
    <Layout title="Resume">
      <article className="page wrap">
        <header className="page-header"><h1>Resume</h1></header>
        <div className="page-content">
          <p className="placeholder-note">Resume content coming soon.</p>
        </div>
      </article>
    </Layout>
  )
}

export default Resume
