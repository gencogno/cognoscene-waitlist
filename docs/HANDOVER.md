# Cognoscene Waitlist — Agent Handover

**Audience:** agents or devs working in this repo (`gencogno/cognoscene-waitlist`).  
**Author context:** founder `cogno` · Singapore · pre-revenue Chrome extension · pre-incorporation.  
**Last updated:** 14 Aug 2026 · production commit `b0f169a` (SVG loop, problem section).

**Extension repo (separate):** `gencogno/cognoscene-statics-roadmap` — do not confuse. Changes here do not require a `manifest.json` bump.  
**Master launch docs (extension repo):** `docs/agent-context/AGENT_HANDOVER.md` · `docs/agent-context/launch-sdd.md` · `docs/agent-context/waitlist-launch-spec.md` — those are the source of truth for GTM logic; `docs/WAITLIST-PLAN.md` in this repo is the distilled, waitlist-scoped version.

---

## 1. Live site

| Item | Value |
|------|-------|
| URL | `https://gencogno.github.io/cognoscene-waitlist/` (custom domain — founder to set) |
| Host | **GitHub Pages** — auto-deploy on push to `main` |
| Privacy | Repo is **public** — GitHub Pages (Netlify removed 14 Aug 2026) |
| Form backend | **Formspree** client POST — `FORMSPREE_FORM_ID` in `index.html` |
| Form fields | Email (required) · Chrome on desktop y/n (required) — **no Telegram, no comment box** |

---

## 2. File structure

```
cognoscene-waitlist/
├── index.html              ← production site (do not edit without explicit auth)
├── founding-terms.html     ← founding offer terms
├── privacy.html
├── terms.html
├── DEPLOY.md               ← GitHub Pages deploy + DNS guide
├── MOBILE.md               ← mobile layout decisions
├── assets/
│   ├── cognoscene-mark.png
│   ├── cognoscene-wordmark.png
│   ├── icons/
│   │   ├── icon-trap-cart.png
│   │   └── icon-regret-bag.png   ← grey circle removed (14 Aug 2026)
│   └── ...
├── mockups/
│   ├── mobile-iphone14-alternate.html  ← iterate here first before prod
│   ├── waitlist.html                   ← full-page mockup (1920 artboard)
│   ├── waitlist-short.html             ← short-form mobile mockup
│   ├── mockup-artboard.css             ← required by waitlist.html
│   └── mockup-artboard.js              ← required by waitlist.html
├── docs/
│   ├── HANDOVER.md         ← this file
│   └── WAITLIST-PLAN.md    ← launch phases, offers, tracker (email-only)
└── scripts/                ← utility scripts (not deployed)
```

---

## 3. Production site — current state (14 Aug 2026)

| Section | Status |
|---------|--------|
| Hero | Copy locked — lowercase, Buffer-style brand voice |
| Problem band | **SVG loop diagram** (1.25× scale) — see-you-buy-regret cards with hub chevrons; faint shadow on cards (no border) |
| Problem copy | Lead-in in header; body = trap beat → regret quote → pivot (bold close) |
| Mobile layout | Loop `order: -1` above copy; spacing 0.5cm above / 0.25cm below loop wrapper |
| Form | Email + Chrome y/n; Formspree POST; autoresponder copy in `docs/WAITLIST-PLAN.md` §4 |
| Footer | Privacy + Terms linked |

**Committed version to preserve:** `b0f169a` on `main`. Do not revert or destructively overwrite this baseline without founder sign-off.

---

## 4. Brand constants

| Token | Value |
|-------|-------|
| Cream | `#F5F0E8` |
| Lime | `#C8E88A` |
| Black | `#111111` |
| Typography | Be Vietnam Pro |
| Voice | all-lowercase, Buffer-style |
| Logo mark | `assets/cognoscene-mark.png` (concentric-ring ∅) — **do not substitute SVG placeholder** |
| Wordmark | `assets/cognoscene-wordmark.png` (lowercase cogn∅scene) |

---

## 5. Agent scope + rules

- **Waitlist edits = this repo only.** Do not spill into the extension repo unless founder explicitly asks.
- **Do not bump `manifest.json`** — that lives in the extension repo; waitlist changes do not touch it.
- **Smallest diff only** — one ask = one surface. Do not touch adjacent sections, copy, or assets not named in the prompt.
- **Mockup-first for layout changes** — iterate in `mockups/mobile-iphone14-alternate.html` or `mockups/waitlist-short.html` before editing `index.html` production.
- **Comms channel: email only.** Telegram has been fully removed from this project.
- **No Telegram, no clinical/shopping-addiction language, no unsupported stats** in any copy or docs.

---

## 6. Key constraints (do not violate)

1. Never add a Telegram field or reference back.
2. Never add a public Stripe payment link — founding checkout is gated via edge function + allowlist.
3. Never describe Cognoscene as Pte Ltd (pre-incorporation).
4. Never use the retired `cognoscene-mark.svg` or `cognoscene-wordmark.svg` placeholder — PNG assets only.
5. No emojis in commits, docs, or code comments.

---

## 7. Related docs (extension repo)

| Doc | Path in `cognoscene-statics-roadmap` |
|-----|---------------------------------------|
| Master handover | `docs/agent-context/AGENT_HANDOVER.md` |
| Master launch SDD | `docs/agent-context/launch-sdd.md` |
| Waitlist launch spec (full) | `docs/agent-context/waitlist-launch-spec.md` |
| Stripe webhook spec | `docs/agent-context/stripe-webhook-spec.md` |
