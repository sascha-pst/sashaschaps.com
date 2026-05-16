import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import siteConfig from '../siteConfig'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => { setOpen(false) }, [router.asPath])

  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href="/" className="site-title">{siteConfig.title}</Link>
        <nav className="site-nav" aria-label="Primary">
          <button
            className={`nav-toggle-btn${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
          </button>
          <ul className={open ? 'nav-open' : ''}>
            {siteConfig.nav.map(item => {
              const active =
                router.asPath === item.url ||
                (item.url !== '/' && router.asPath.startsWith(item.url))
              return (
                <li key={item.url} className={active ? 'active' : ''}>
                  <Link href={item.url}>{item.title}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
