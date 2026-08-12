# Cognoscene waitlist — deploy

**Live site:** [cognoscenewaitlist.netlify.app](https://cognoscenewaitlist.netlify.app)

Repo: **`gencogno/cognoscene-waitlist`** (waitlist only — separate from extension code).

Publish config: `netlify.toml` at repo root (`publish = "."`).

---

## Recommended — auto-deploy on push

Pick **one** path.

### Path A — GitHub Actions (no Netlify Git link)

Repo includes `.github/workflows/deploy.yml`. After you add two secrets, every push to `main` deploys.

1. **Netlify token** — [app.netlify.com/user/applications#personal-access-tokens](https://app.netlify.com/user/applications#personal-access-tokens) → **New access token** → copy it.
2. **Site ID** — Netlify → site **cognoscenewaitlist** → **Project configuration** → **General** → **Site ID** → copy.
3. **GitHub secrets** — [github.com/gencogno/cognoscene-waitlist/settings/secrets/actions](https://github.com/gencogno/cognoscene-waitlist/settings/secrets/actions):
   - `NETLIFY_AUTH_TOKEN` = token from step 1
   - `NETLIFY_SITE_ID` = site ID from step 2
4. **Trigger deploy** — push any commit to `main`, or GitHub → **Actions** → **Deploy to Netlify** → **Run workflow**.

### Path B — Netlify Git link

1. [app.netlify.com](https://app.netlify.com) → site **cognoscenewaitlist**.
2. **Project configuration** → **Build & deploy** → **Link repository**.
3. GitHub → **`gencogno/cognoscene-waitlist`** → branch **`main`** → publish **`.`** → **Deploy**.

If the site 404s, confirm the linked site is **cognoscenewaitlist** and `publish = "."` in `netlify.toml`.

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

## Site config (`index.html` script block)

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | `https://cognoscenewaitlist.netlify.app` — keep in sync with canonical / OG tags |
| `FORMSPREE_FORM_ID` | Waitlist form submissions (`mbgropvn`) |
| `PLAUSIBLE_DOMAIN` | Optional — e.g. `cognoscenewaitlist.netlify.app` |
| `WAITLIST_DEADLINE` | ISO date — waitlist auto-closes (launch + 30 days, SGT) |
| `WAITLIST_SIGNUPS` | Manual count from Formspree — drives spots remaining + cap lock |
| `WAITLIST_CAP` | `250` |

**After go-live:** set `WAITLIST_DEADLINE` to exactly 30 days from launch (SGT midnight). Update `WAITLIST_SIGNUPS` whenever you check Formspree, then redeploy.

---

## Formspree

1. [formspree.io](https://formspree.io) → form ID in URL `…/f/abcxyz`.
2. In `index.html`: `var FORMSPREE_FORM_ID = 'mbgropvn';` *(already set)*.

Payload fields: `email`, `ready`, `legal_agreed`.

Beta comms: mass email to the address submitted on the form.

---

## Videos

| File | Purpose |
|------|---------|
| `assets/videos/demo.mp4` | Layer 2 rationalisation showcase |
| `assets/videos/observer-*.mp4` | Layer 1 observer slider |
| `assets/videos/growth-*.mp4` | Layer 3 growth slider |
| `assets/videos/VIDEO-MAP.md` | Clip → feature mapping |

Add `poster.jpg` optional. Large files: host externally and update `<source src>` in `index.html`.

---

## Open Graph

- `assets/og-share.png` — 1200×630 PNG (required for X/LinkedIn previews)
- Head tags use `https://cognoscenewaitlist.netlify.app/assets/og-share.png`

---

## Mobile view

Mobile-specific funnel plan, phased changes, and guardrails: **[MOBILE.md](./MOBILE.md)**.

All mobile layout edits stay in `index.html` `@media (max-width: 760px)` unless using `.mobile-only` markup blocks. Desktop band alignment must not regress.

---

## Analytics

**GA4** is in `<head>` — measurement ID `G-RJN8BXMBN3`. Verify in GA4 → **Realtime** after deploy.

Optional Plausible: set `PLAUSIBLE_DOMAIN` in `index.html` site config.

---

## Legal

- `privacy.html` · `terms.html` · `founding-terms.html` — pre-incorporation; counsel review before ads.

---

## After launch checklist

- [ ] Git linked + test push deploys
- [ ] `WAITLIST_DEADLINE` set to launch + 30 days (SGT)
- [ ] `WAITLIST_SIGNUPS` matches Formspree count
- [ ] Test signup from phone
- [ ] GA4 Realtime hit
- [ ] Formspree email notifications on
- [ ] Share preview test (paste URL in iMessage / X)

---

## Custom domain (later)

Netlify → Domain management → Add domain → DNS at registrar. Update `SITE_URL`, canonical, and OG tags to match.
