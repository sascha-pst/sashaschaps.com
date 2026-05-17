import Link from 'next/link'
import Image from 'next/image'

export default function PostCard({ post }) {
  const { slug, title, date, excerpt_text, cover, cover_alt } = post
  const href = `/blog/${slug}/`
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <article className="card post-card">
      {cover && (
        <Link href={href} className="card-image">
          <Image src={cover} alt={cover_alt || title} fill style={{ objectFit: 'cover' }} />
        </Link>
      )}
      <div className="card-body">
        <h3><Link href={href}>{title}</Link></h3>
        {formattedDate && (
          <p className="card-meta">
            <time dateTime={date}>{formattedDate}</time>
          </p>
        )}
        {excerpt_text && <p>{excerpt_text}</p>}
      </div>
    </article>
  )
}
