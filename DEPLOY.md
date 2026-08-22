# Deploying

The live site is served by **Cloudflare Workers** (project `sashaschapsportfolio`),
which builds from this repo on every push.

`npm run build` encrypts every `.html` file with
[staticrypt](https://github.com/robinmoisson/staticrypt) into `dist/`, and
Cloudflare serves `dist/`. The origin only ever holds ciphertext plus the gate
page, so the site cannot be read without the password.

## Required Cloudflare settings

The build fails closed without these — that is deliberate.

| Setting | Value |
| --- | --- |
| Deploy command | `npm run build && npx wrangler deploy` |
| `STATICRYPT_PASSWORD` | the shared password, stored as a **Secret** |

Set both in the Cloudflare dashboard under the Worker's **Settings → Build**
and **Settings → Variables and Secrets**. Store the password as a *Secret*,
not a plaintext variable, so it is write-only once saved.

Folding the build into the deploy command means there is only one field to
change; a separate `npm run build` build command works equally well.

Until these are set the build **fails**, and a failed build deploys nothing —
the previously deployed version keeps serving. That is intentional: it is
better to keep serving the old site than to publish an unprotected one.

To change the password, edit that secret and redeploy. It is never stored in
this repo.

## Local check

```sh
STATICRYPT_PASSWORD='something' npm run build
open dist/index.html
```

`dist/` and `.staticrypt.json` are gitignored; only source is committed.

## Notes

- The salt in `.staticrypt.json` is regenerated per build. It is not secret (it
  ships inside the gate page), but it does mean the "remember me" cookie resets
  on each deploy.
- `.github/workflows/deploy.yml` publishes a **separate** copy to GitHub Pages.
  It is not what serves sashaschaps.com. Delete it if Pages is switched off.
- staticrypt is client-side encryption behind one shared password. It keeps the
  site out of search results and away from casual visitors. It is not
  per-person access control — anyone with the password can share it, and the
  ciphertext is public. Cloudflare Access is the stronger option if that matters.
