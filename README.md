# sashaschaps.com

Personal portfolio for Sasha Schaps.

## Production architecture

The production site is dependency-free static HTML and CSS in `public/`. It does not require Jekyll, Liquid, Ruby, Node, or a framework build. Keeping the published assets in one dedicated directory prevents source templates or application files from leaking into production.

## Pages

- `/` — homepage and featured work
- `/about/` — biography and professional through line
- `/work/` — selected projects and program work
- `/contact/` — contact details
- `/404.html` — fallback page

## Cloudflare Pages configuration

Use these exact settings:

- Git repository: `sascha-pst/sashaschaps.com`
- Production branch: `main`
- Framework preset: `None`
- Root directory: leave blank
- Build command: `exit 0`
- Build output directory: `public`

Attach `sashaschaps.com` under Custom domains after the first successful deployment. Every push to `main` should then create a new production deployment.

## Local preview

```bash
cd public
python3 -m http.server 8000
```

Visit `http://localhost:8000`.
