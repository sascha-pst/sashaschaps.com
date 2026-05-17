import Link from 'next/link'
import Image from 'next/image'

export default function PortfolioCard({ item }) {
  const { slug, kind, title, year, summary, tags, cover, cover_alt } = item
  const href = kind === 'brand'
    ? `/portfolio/brands/${slug}/`
    : `/portfolio/projects/${slug}/`

  return (
    <article className="card portfolio-card">
      {cover && (
        <Link href={href} className="card-image">
          <Image src={cover} alt={cover_alt || title} fill style={{ objectFit: 'cover' }} />
        </Link>
      )}
      <div className="card-body">
        {kind && (
          <p className="kicker">
            {kind.charAt(0).toUpperCase() + kind.slice(1)}
            {year && ` · ${year}`}
          </p>
        )}
        <h3><Link href={href}>{title}</Link></h3>
        {summary && <p>{summary}</p>}
        {tags && tags.length > 0 && (
          <p className="card-tags">
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </p>
        )}
      </div>
    </article>
  )
}
