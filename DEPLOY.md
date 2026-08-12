# Cognoscene waitlist — deploy

Live site: [wondrous-horse-8d0cb0.netlify.app](https://wondrous-horse-8d0cb0.netlify.app)

Repo: **`gencogno/cognoscene-waitlist`** (waitlist only — separate from extension code).

Publish config: `netlify.toml` at repo root (`publish = "."`).

---

## Recommended — Git auto-deploy (iterate without re-uploading)

After this one-time setup, every **`git push`** to `main` updates the live site in ~30 seconds.

### A. One-time: push waitlist to GitHub

From this repo root:

```bash
git add .
git commit -m "waitlist: your change"
git push origin main
```

(`demo.mp4` is ~10MB — OK for GitHub. Avoid committing many 20MB+ videos; use YouTube + `DEMO_VIDEO_URL` instead.)

### B. One-time: link Netlify to GitHub

1. [app.netlify.com](https://app.netlify.com) → open site **wondrous-horse-8d0cb0** (your existing Drop site).
2. **Project configuration** → **Build & deploy** → **Link repository**.
3. Authorize **GitHub** → choose **`gencogno/cognoscene-waitlist`** → branch **`main`**.
4. Netlify should detect **`netlify.toml`**:
   - **Publish directory:** `.` (repo root)
   - **Build command:** *(leave empty)*
5. **Deploy site**.

Your URL stays **`wondrous-horse-8d0cb0.netlify.app`**.

### C. Day-to-day workflow

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
