# sashaschaps.com

Personal site built with [Jekyll](https://jekyllrb.com/). Modular blog and
portfolio — every piece of content is its own file (or folder), so adding a
post or a portfolio item never requires touching the templates.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000
```

## Structure

```
.
├── _config.yml          # site config + nav + collections
├── _layouts/            # default, page, post, portfolio-item
├── _includes/           # nav, footer, post-card, portfolio-card
├── _sass/               # base, layout, components
├── assets/css/main.scss # entry stylesheet
├── _blog/               # blog posts (folder per post)
├── _brands/             # brand collaborations (one file each)
├── _projects/           # data / research projects (one file each)
├── index.html           # homepage
├── about.md             # about page
├── blog.html            # blog index
├── portfolio.html       # portfolio index with brand/project filter
├── resume.md            # resume page
└── contact.md           # contact page
```

## Add a blog post

Each post is a folder under `_blog/` with an `index.md` inside. Drop images
into the same folder and reference them with absolute paths.

```bash
mkdir _blog/my-new-post
$EDITOR _blog/my-new-post/index.md
```

```yaml
---
title: "My new post"
date: 2026-05-04
slug: my-new-post
tags: [essays]
excerpt_text: "One-sentence teaser shown on the index and homepage."
cover: /_blog/my-new-post/cover.jpg   # optional
---

Post body in Markdown…
```

The post will be published at `/blog/my-new-post/`.

## Add a portfolio item

The portfolio is split in two collections:

- `_brands/` — brands you've collaborated with
- `_projects/` — data analysis and research projects

Each item is a single Markdown file. Copy one of the examples and edit the
front matter:

```yaml
---
title: "Project or brand name"
client: "Client name"            # brands
year: 2025
role: "Your role"
summary: "One- or two-sentence description shown on cards."
tools: ["Tool A", "Tool B"]
tags: ["research", "brand"]
featured: true                    # surfaces on homepage
cover: /_projects/my-item/cover.jpg
link: https://example.com         # optional external link
---
```

The portfolio index has an All / Brands / Projects filter and pulls from both
collections automatically.
