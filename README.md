# sashaschaps.com

Personal portfolio for Sasha Schaps.

## Architecture

This site is intentionally dependency-free static HTML and CSS. It does not require Jekyll, Liquid, Ruby, Node, or a build step. This prevents template source from leaking into production when a host publishes the repository root.

## Pages

- `/` — homepage and featured work
- `/about/` — biography and professional through line
- `/work/` — selected projects and program work
- `/contact/` — contact details
- `/404.html` — fallback page

## Deploy

### Cloudflare Pages

- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/` (repository root)

The custom domain should be `sashaschaps.com`.

### GitHub Pages

The included `CNAME` and `.nojekyll` files also support publishing directly from the root of `main`.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.
