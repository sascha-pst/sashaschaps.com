#!/usr/bin/env bash
# Builds the password-protected site into dist/ for Cloudflare.
#
# Cloudflare dashboard settings this expects:
#   Build command:  bash build.sh
#   Build variable: SITE_PASSWORD = <the password visitors type>
#
# Pages listed in PUBLIC_PAGES stay open to everyone; every other .html
# page gets the "Come in" password screen.
set -euo pipefail

PUBLIC_PAGES=""   # e.g. "shop.html" to leave the shop open to everyone

if [ -z "${SITE_PASSWORD:-}" ]; then
  echo "ERROR: SITE_PASSWORD is not set. Add it under Settings > Build > Variables and secrets in Cloudflare." >&2
  echo "Refusing to build an unlocked site." >&2
  exit 1
fi

rm -rf dist
mkdir -p dist

# 1. Sort pages into locked and public
locked=()
for f in *.html; do
  if [[ " $PUBLIC_PAGES " == *" $f "* ]]; then
    cp "$f" dist/
    echo "public: $f"
  else
    locked+=("$f")
  fi
done

# 2. Encrypt the locked pages
STATICRYPT_PASSWORD="$SITE_PASSWORD" npx --yes staticrypt@3 "${locked[@]}" -d dist --short --remember 7 \
  --template-title "sashaschaps.com" \
  --template-instructions "This studio is password protected. Enter the password to come in." \
  --template-button "Come in" \
  --template-placeholder "Password" \
  --template-color-primary "#5C7268" \
  --template-color-secondary "#F1EFE9"

# 3. Keep link previews and the favicon working on the password page
node -e '
  const fs = require("fs");
  const p = "dist/index.html";
  if (!fs.existsSync(p)) process.exit(0);
  const inject = [
    `<meta name="description" content="Sasha Schaps — data scientist in training at UC Berkeley MIDS.">`,
    `<meta property="og:title" content="Sasha Schaps — Data Science">`,
    `<meta property="og:description" content="Berkeley MIDS · Python, SQL · program execution · marbled clay">`,
    `<meta property="og:image" content="https://sashaschaps.com/ogcard.jpg">`,
    `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\x27http://www.w3.org/2000/svg\x27 viewBox=\x270 0 64 64\x27%3E%3Ccircle cx=\x2745\x27 cy=\x2718\x27 r=\x276\x27 fill=\x27%238FBFE0\x27/%3E%3Cpath d=\x27M6 41c8-9 17-9 25-2s17 7 27-2\x27 fill=\x27none\x27 stroke=\x27%232D6BD8\x27 stroke-width=\x275\x27 stroke-linecap=\x27round\x27/%3E%3C/svg%3E">`,
    `</head>`
  ].join("\n");
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("</head>", inject));
'

# 4. Copy images and other files the pages load
shopt -s nullglob
[ -d assets ] && cp -r assets dist/
for f in *.jpg *.jpeg *.png *.webp *.svg *.mp4; do cp "$f" dist/; done

echo "Built dist/:"
ls -1 dist
