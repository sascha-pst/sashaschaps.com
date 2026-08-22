// Builds the password-protected site into dist/.
//
// Cloudflare Workers serves dist/ (see wrangler.jsonc). Every .html file is
// encrypted with staticrypt, so the origin only ever holds ciphertext and a
// gate page. Requires STATICRYPT_PASSWORD in the build environment.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const OUT = 'dist';

if (!process.env.STATICRYPT_PASSWORD) {
  console.error(
    '\nSTATICRYPT_PASSWORD is not set — refusing to build.\n\n' +
    'Without it staticrypt invents a random password and prints it, which would\n' +
    'publish a site nobody can open. Set it as a build-time environment variable\n' +
    'in the Cloudflare dashboard (Settings -> Variables and Secrets).\n'
  );
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });

const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
if (pages.length === 0) {
  console.error('No .html files found to encrypt — refusing to publish an empty site.');
  process.exit(1);
}

// Flags mirror .github/workflows/deploy.yml, which is a known-good invocation.
execFileSync('npx', [
  '--yes', 'staticrypt', ...pages,
  '-d', OUT,
  '--short',
  '--remember', '7',
  '--template-title', 'sashaschaps.com',
  '--template-instructions', 'This studio is password protected. Enter the password to come in.',
  '--template-button', 'Come in',
  '--template-placeholder', 'Password',
  '--template-color-primary', '#5C7268',
  '--template-color-secondary', '#F1EFE9',
], { stdio: 'inherit' });

// The gate page is what link previews and crawlers see, so it carries the
// site's metadata rather than staticrypt's bare template.
const gate = `${OUT}/index.html`;
const meta = [
  `<meta name="description" content="Sasha Schaps — data science and program enablement.">`,
  `<meta property="og:title" content="Sasha Schaps — Data Science &amp; Program Enablement">`,
  `<meta property="og:description" content="Python, SQL · regression, EDA and data visualization">`,
  `<meta name="twitter:card" content="summary">`,
  `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F1EFE9'/%3E%3Cg fill='none' stroke-width='4' stroke-linecap='round'%3E%3Cpath d='M4 12 C 8 8, 12 16, 16 12 S 24 8, 28 12' stroke='%235C7268'/%3E%3Cpath d='M4 21 C 8 17, 12 25, 16 21 S 24 17, 28 21' stroke='%238FA9AC'/%3E%3C/g%3E%3C/svg%3E">`,
  '</head>',
].join('\n');

const html = fs.readFileSync(gate, 'utf8');
if (!html.includes('</head>')) {
  console.error(`${gate} has no </head> — staticrypt output changed shape, not injecting metadata.`);
  process.exit(1);
}
fs.writeFileSync(gate, html.replace('</head>', meta));

// Static assets sit outside the encrypted pages and are copied verbatim.
for (const f of fs.readdirSync('.')) {
  if (/\.(jpe?g|png|webp|svg|mp4|ico)$/i.test(f)) fs.copyFileSync(f, `${OUT}/${f}`);
}
if (fs.existsSync('CNAME')) fs.copyFileSync('CNAME', `${OUT}/CNAME`);

console.log(`\nEncrypted ${pages.length} pages into ${OUT}/`);
