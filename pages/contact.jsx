import Layout from '../components/Layout'
import siteConfig from '../siteConfig'

export default function Contact() {
  return (
    <Layout title="Contact">
      <article className="page wrap">
        <header className="page-header">
          <h1>Contact</h1>
          <p className="subtitle">Let&rsquo;s work together.</p>
        </header>
        <div className="page-content">
          <p>
            The best way to reach me is by email:{' '}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </article>
    </Layout>
  )
}
