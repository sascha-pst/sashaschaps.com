import siteConfig from '../siteConfig'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <p>&copy; {year} {siteConfig.author}.</p>
        <ul className="social">
          {siteConfig.email && <li><a href={`mailto:${siteConfig.email}`}>Email</a></li>}
          {siteConfig.github && <li><a href={`https://github.com/${siteConfig.github}`} rel="noopener noreferrer">GitHub</a></li>}
          {siteConfig.linkedin && <li><a href={`https://linkedin.com/in/${siteConfig.linkedin}`} rel="noopener noreferrer">LinkedIn</a></li>}
        </ul>
      </div>
    </footer>
  )
}
