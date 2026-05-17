import { useState } from 'react'
import Layout from '../../components/Layout'
import PortfolioCard from '../../components/PortfolioCard'
import { getBrands, getProjects } from '../../lib/content'

export default function Portfolio({ items }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? items : items.filter(i => i.kind === filter)

  return (
    <Layout title="Portfolio" description="A library of brand collaborations and research projects.">
      <article className="page wrap">
        <header className="page-header">
          <h1>Portfolio</h1>
          <p className="subtitle">A library of brand collaborations and research projects.</p>
        </header>

        <div className="filter" role="tablist" aria-label="Filter portfolio">
          {['all', 'brand', 'project'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
              role="tab"
              aria-selected={filter === f}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid">
            {filtered.map(item => (
              <PortfolioCard key={`${item.kind}-${item.slug}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="placeholder-note">
            Portfolio entries will appear here. Add Markdown files under <code>_brands/</code> or <code>_projects/</code>.
          </p>
        )}
      </article>
    </Layout>
  )
}

export function getStaticProps() {
  const brands   = getBrands()
  const projects = getProjects()
  const items    = [...brands, ...projects].sort((a, b) => (b.year || 0) - (a.year || 0))
  return { props: { items } }
}
