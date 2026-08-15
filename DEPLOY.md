# Cognoscene waitlist — deploy

**Live site:** [cognoscene.github.io/cognoscene-waitlist](https://gencogno.github.io/cognoscene-waitlist/)

Repo: **`gencogno/cognoscene-waitlist`** (waitlist only — separate from extension code).

Publish config: `netlify.toml` at repo root (`publish = "."`).

---

## Recommended — GitHub Pages

The canonical production site is **GitHub Pages**:

`https://gencogno.github.io/cognoscene-waitlist/`

Pushes to `main` are deployed through the repository's GitHub Pages configuration.

### Day-to-day workflow

```bash
# edit index.html (or assets) in Cursor
git add .
git commit -m "waitlist: your change"
git push origin main
```

After the push, GitHub Pages publishes the updated site. Allow a short propagation period before checking the live URL.

---

## Site config (`index.html` script block)

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | `https://gencogno.github.io/cognoscene-waitlist/` — keep in sync with canonical / OG tags |
| `FORMSPREE_FORM_ID` | Waitlist form submissions (`mbgropvn`) |
| `PLAUSIBLE_DOMAIN` | Optional — e.g. `gencogno.github.io` |
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
- Head tags use `https://gencogno.github.io/cognoscene-waitlist/assets/og-share.png`

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

- [ ] GitHub Pages enabled and publishing from the intended branch/folder
- [ ] `WAITLIST_DEADLINE` set to launch + 30 days (SGT)
- [ ] `WAITLIST_SIGNUPS` matches Formspree count
- [ ] Test signup from phone
- [ ] GA4 Realtime hit
- [ ] Formspree email notifications on
- [ ] Share preview test (paste URL in iMessage / X)

## Custom domain (later)

If a custom domain is added later, update `SITE_URL`, canonical, and OG tags to match.
