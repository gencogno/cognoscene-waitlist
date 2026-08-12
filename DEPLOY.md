# Cognoscene waitlist — deploy

Live site: [wondrous-horse-8d0cb0.netlify.app](https://wondrous-horse-8d0cb0.netlify.app)

Repo: **`gencogno/cognoscene-waitlist`** (waitlist only — separate from extension code).

Publish config: `netlify.toml` at repo root (`publish = "."`).

---

## Recommended — auto-deploy on push

Pick **one** path.

### Path A — GitHub Actions (no Netlify Git link)

Repo includes `.github/workflows/deploy.yml`. After you add two secrets, every push to `main` deploys.

1. **Netlify token** — [app.netlify.com/user/applications#personal-access-tokens](https://app.netlify.com/user/applications#personal-access-tokens) → **New access token** → copy it.
2. **Site ID** — Netlify → your site → **Project configuration** → **General** → **Site ID** → copy (for `wondrous-horse-8d0cb0`).
3. **GitHub secrets** — [github.com/gencogno/cognoscene-waitlist/settings/secrets/actions](https://github.com/gencogno/cognoscene-waitlist/settings/secrets/actions):
   - `NETLIFY_AUTH_TOKEN` = token from step 1
   - `NETLIFY_SITE_ID` = site ID from step 2
4. **Trigger deploy** — push any commit to `main`, or GitHub → **Actions** → **Deploy to Netlify** → **Run workflow**.

### Path B — Netlify Git link

1. [app.netlify.com](https://app.netlify.com) → site **wondrous-horse-8d0cb0**.
2. **Project configuration** → **Build & deploy** → **Link repository**.
3. GitHub → **`gencogno/cognoscene-waitlist`** → branch **`main`** → publish **`.`** → **Deploy**.

If the site 404s, the Drop site may have been removed — create a new site from Git import, then update `SITE_URL` / `og:image` in `index.html`.

### Path C — Netlify CLI (one-off)

```bash
npx netlify-cli login
npx netlify-cli link
npx netlify-cli deploy --prod --dir=.
```

---

## Day-to-day workflow

```bash
# edit index.html (or assets) in Cursor
git add .
git commit -m "waitlist: your change"
git push origin main
```

Netlify → **Deploys** tab shows the build. No drag-and-drop.

### If Git link fails

| Problem | Fix |
|---------|-----|
| Wrong folder deployed | Confirm root `netlify.toml` has `publish = "."` |
| Site not updating | Check Deploys log; confirm you pushed to `main` |
| 404 on legal pages | Paths are relative — ensure files live at repo root |
| Large video push rejected | GitHub file limit 100MB; compress or host externally |

---

## Legacy — Netlify Drop (manual)

1. [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this repo folder (must contain `index.html` at root).

Use only if Git link is not set up yet.

---

## Formspree

1. [formspree.io](https://formspree.io) → form ID in URL `…/f/abcxyz`.
2. In `index.html`: `var FORMSPREE_FORM_ID = 'mbgropvn';` *(already set)*.

---

## Videos

| File | Purpose |
|------|---------|
| `assets/videos/demo.mp4` | Hero — auto-replaces CSS mock when present |
| `assets/videos/VIDEO-MAP.md` | Which showcase clip maps to which feature |

Add `poster.jpg` optional. Large files: set `DEMO_VIDEO_URL` in `index.html` instead.

---

## Analytics

**GA4** is in `<head>` — measurement ID `G-RJN8BXMBN3`. Verify in GA4 → **Realtime** after deploy.

Optional Plausible: set `PLAUSIBLE_DOMAIN` in `index.html` site config.

---

## Telegram footer

When channel exists:

```javascript
var TELEGRAM_URL = 'https://t.me/your_channel';
```

Footer link appears automatically.

---

## Legal

- `privacy.html` · `terms.html` · `founding-terms.html` — template; counsel review before ads.

---

## After launch checklist

- [ ] Git linked + test push deploys
- [ ] Test signup from phone
- [ ] GA4 Realtime hit
- [ ] `TELEGRAM_URL` when ready
- [ ] Formspree email notifications on

---

## Custom domain (later)

Netlify → Domain management → Add domain → DNS at registrar.
