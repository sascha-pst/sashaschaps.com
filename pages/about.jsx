import Layout from '../components/Layout'
import Link from 'next/link'

export default function About() {
  return (
    <Layout title="About" description="About Sasha Schaps — writer, researcher, and creative collaborator.">
      <article className="page wrap">
        <header className="page-header">
          <h1>About</h1>
          <p className="subtitle">Writer, researcher, and creative collaborator.</p>
        </header>
        <div className="page-content">
          <p>
            I&rsquo;m Sasha Schaps — I work at the intersection of writing, research, and brand
            storytelling. My background is in qualitative and quantitative research, and I
            bring that same rigor to creative projects: I want to know who an audience is,
            what they care about, and what story will actually land.
          </p>
          <h2>What I do</h2>
          <ul>
            <li><strong>Writing &amp; essays.</strong> Long- and short-form pieces on culture, technology, and the way people make meaning.</li>
            <li><strong>Research &amp; data analysis.</strong> Mixed-methods projects, audience studies, qualitative coding, and visual reporting.</li>
            <li><strong>Brand collaboration.</strong> Partnering with companies on positioning, content strategy, and editorial direction.</li>
          </ul>
          <h2>How I work</h2>
          <p>
            Curious first, opinionated second. I like to start every project by asking
            better questions, then build outward from there. If you&rsquo;d like to work
            together, <Link href="/contact/">send me a note</Link>.
          </p>
        </div>
      </article>
    </Layout>
  )
}
