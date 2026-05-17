import Link from 'next/link'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import PortfolioCard from '../components/PortfolioCard'
import { getBlogPosts, getBrands, getProjects } from '../lib/content'

export default function Home({ recentPosts, featuredItems }) {
  return (
    <Layout>
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-eyebrow">Writer · Researcher · Creative</div>
          <h1 className="hero-name">Sasha<br />Schaps</h1>
          <p className="hero-lead">
            I work at the intersection of writing, research, and brand
            storytelling — asking better questions, then building outward from there.
          </p>
          <div className="hero-actions">
            <Link href="/about/" className="btn btn--primary">About me</Link>
            <Link href="/portfolio/" className="btn btn--ghost">View work</Link>
          </div>
        </div>
        <div className="hero-rule" />
      </section>

      <section className="home-section">
        <div className="wrap">
          <header className="section-header">
            <h2 className="section-title">Latest writing</h2>
            <Link href="/blog/" className="section-link">All posts →</Link>
          </header>
          {recentPosts.length > 0 ? (
            <div className="stack">
              {recentPosts.map(post => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p className="placeholder-note">Essays and notes will appear here.</p>
          )}
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="wrap">
          <header className="section-header">
            <h2 className="section-title">Selected work</h2>
            <Link href="/portfolio/" className="section-link">Full portfolio →</Link>
          </header>
          {featuredItems.length > 0 ? (
            <div className="grid">
              {featuredItems.map(item => (
                <PortfolioCard key={`${item.kind}-${item.slug}`} item={item} />
              ))}
            </div>
          ) : (
            <p className="placeholder-note">
              Portfolio items will appear here. Add files under <code>_brands/</code> or{' '}
              <code>_projects/</code> with <code>featured: true</code>.
            </p>
          )}
        </div>
      </section>

      <section className="home-cta">
        <div className="wrap home-cta-inner">
          <p className="home-cta-text">Have a project in mind?</p>
          <Link href="/contact/" className="btn btn--primary">Get in touch</Link>
        </div>
      </section>
    </Layout>
  )
}

export function getStaticProps() {
  const recentPosts  = getBlogPosts().slice(0, 3)
  const brands       = getBrands().filter(b => b.featured)
  const projects     = getProjects().filter(p => p.featured)
  const featuredItems = [...brands, ...projects]
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 3)

  return { props: { recentPosts, featuredItems } }
}
