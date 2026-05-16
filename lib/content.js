import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const BLOG_DIR     = path.join(process.cwd(), '_blog')
const BRANDS_DIR   = path.join(process.cwd(), '_brands')
const PROJECTS_DIR = path.join(process.cwd(), '_projects')

function parseFile(filePath) {
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: data, content }
}

function toHtml(markdown) {
  return marked.parse(markdown || '')
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
// Each post lives at _blog/<slug>/index.md

export function getBlogSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter(name =>
    fs.statSync(path.join(BLOG_DIR, name)).isDirectory()
  )
}

export function getBlogPosts() {
  const slugs = getBlogSlugs()
  const posts = slugs.map(slug => {
    const file = parseFile(path.join(BLOG_DIR, slug, 'index.md'))
    if (!file || !file.frontmatter.title) return null
    return { slug, ...file.frontmatter }
  }).filter(Boolean)

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getBlogPost(slug) {
  const file = parseFile(path.join(BLOG_DIR, slug, 'index.md'))
  if (!file) return null
  return { slug, ...file.frontmatter, contentHtml: toHtml(file.content) }
}

// ─── Brands ───────────────────────────────────────────────────────────────────
// Each brand lives at _brands/<slug>.md

export function getBrandSlugs() {
  if (!fs.existsSync(BRANDS_DIR)) return []
  return fs.readdirSync(BRANDS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

export function getBrands() {
  return getBrandSlugs().map(slug => {
    const file = parseFile(path.join(BRANDS_DIR, `${slug}.md`))
    if (!file || !file.frontmatter.title) return null
    return { slug, kind: 'brand', ...file.frontmatter }
  }).filter(Boolean)
}

export function getBrand(slug) {
  const file = parseFile(path.join(BRANDS_DIR, `${slug}.md`))
  if (!file) return null
  return { slug, kind: 'brand', ...file.frontmatter, contentHtml: toHtml(file.content) }
}

// ─── Projects ─────────────────────────────────────────────────────────────────
// Each project lives at _projects/<slug>.md

export function getProjectSlugs() {
  if (!fs.existsSync(PROJECTS_DIR)) return []
  return fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

export function getProjects() {
  return getProjectSlugs().map(slug => {
    const file = parseFile(path.join(PROJECTS_DIR, `${slug}.md`))
    if (!file || !file.frontmatter.title) return null
    return { slug, kind: 'project', ...file.frontmatter }
  }).filter(Boolean)
}

export function getProject(slug) {
  const file = parseFile(path.join(PROJECTS_DIR, `${slug}.md`))
  if (!file) return null
  return { slug, kind: 'project', ...file.frontmatter, contentHtml: toHtml(file.content) }
}
