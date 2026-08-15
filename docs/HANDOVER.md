# Cognoscene Waitlist — Agent Handover

**Audience:** agents or devs working in this repo (`gencogno/cognoscene-waitlist`).  
**Author context:** founder `cogno` · Singapore · pre-revenue Chrome extension · pre-incorporation.  
**Last updated:** 14 Aug 2026 (Claude session, cont'd) · production commit `5f2ba10` (layers-index redesign, lightbox cross-layer swipe).

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

## 3. Production site — current state (14 Aug 2026, updated post-Claude session)

| Section | Status |
|---------|--------|
| Hero | Copy locked — lowercase, Buffer-style brand voice |
| Problem band | **SVG loop diagram** (1.25× scale) — see-you-buy-regret cards with hub chevrons; faint shadow on cards (no border) |
| Problem copy | Lead-in in header; body = trap beat → regret quote → pivot (bold close) |
| `solution-details` (formerly `how-band`) | Renamed. Eyebrow + intro + footnote removed — flows straight from `solution-bridge`. Layer copy rewritten; tier notes replaced with identity-level outcome lines (bolded emotional pivots): "you start noticing **the urge**...", "...whether you **wanted it**, or just **felt it**", "...**someone who overspends**." Reverse layout removed — all 3 layers same direction. Layer gap 40px → 64px (desktop). Decorative video frame (border/padding/shadow) removed. |
| `solution-bridge` layers-index | Layer 1 action line updated ("nudges before the cart snowballs"). **Mobile redesign (superseding earlier alternating-tint version):** cards centered text, Be Vietnam Pro font at 19.6875px / -0.25px letter-spacing (matches brand sans, not the earlier Times New Roman iteration), white bg for observer/rationalisation with black text, black bg for growth with white text. Continuous 4s `layerSlide` (margin-left 0→18%, clamped to container edges, opposite phase odd/even via `alternate`/`alternate-reverse`). Animated green gradient overlay (`layerGradientFade`) fades in as each card reaches its slide endpoint, fades out on return — synced direction to match each card's own slide phase. Growth card additionally pulses opacity (`layerPulse`). All respect `prefers-reduced-motion`. |
| `solution-details` showcase videos | Mobile max-width iterated: 75% → 93.75% → **84.375%** (current, ×0.9 from previous). |
| Video lightbox (enlarged view) | **New: cross-layer navigation.** Previously each layer's enlarge button only cycled clips within its own layer (2 clips max). Now `MASTER_CLIPS` array combines all 5 clips (observer×2, rationalisation×1, growth×2) into one continuous sequence — prev/next arrows, keyboard arrows, and pills all traverse the full set regardless of which layer's button opened the lightbox. Inline per-card small previews are unchanged and still layer-scoped. **Mobile-only swipe gesture** added via Pointer Events (`pointerdown`/`pointerup`, not touch events — more reliable for Chrome DevTools mobile emulation and real touch), gated by `matchMedia('(max-width: 760px)')`. Lightbox video corners rounded (`border-radius: 24px`) to match the frame, fixing a sharp-corner visual clash. |
| `founding-band` | Trimmed — removed redundant feature list (already covered in solution-details), replaced with urgency framing ("closes when the first 250 spots fill or in 30 days — whichever comes first"). |
| OG/meta tags | Updated from stale Netlify URLs to `gencogno.github.io/cognoscene-waitlist` (canonical, og:url, og:image, SITE_URL var). |
| Mobile layout | Loop `order: -1` above copy; solution details left-aligned to match hero; 'tap to enlarge' replaces 'click' for touch. |
| Form | Email + Chrome y/n; Formspree POST; autoresponder copy in `docs/WAITLIST-PLAN.md` §4 |
| Footer | Privacy + Terms linked |

**Open items flagged, not yet actioned:**
- `layerSlide` animation still animates `margin-left`, not `transform` — flagged for reflow cost, not urgent, cosmetically identical either way.
- Video slot 1 still empty on both observer and growth sliders (3rd-pulse clip, dashboard clip) — outstanding from earlier session, unrelated to the new cross-layer lightbox nav (nav logic is ready, just needs the actual video files).
- No social proof element near form submit — still outstanding.
- `WAITLIST_SIGNUPS` is hardcoded, requires manual updates from Formspree dashboard as signups roll in.
- No analytics configured — `PLAUSIBLE_DOMAIN` empty in `index.html`.
- **Planned hosting migration:** GitHub Pages → **Cloudflare Pages** once site is finalized (Netlify credits running low; Cloudflare has no bandwidth ceiling on free tier and instant cache invalidation, unlike GitHub Pages' CDN lag). Migration steps documented in `docs/WAITLIST-PLAN.md`.
- If mobile swipe is still unreliable in testing, check whether swipes starting directly on the native video `controls` bar are being intercepted by the browser for seeking before reaching the pointer handler.

**Committed version to preserve:** `b0f169a` on `main` (pre-Claude-session baseline). This session's changes are additive on top, not a revert of that baseline.

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
- **Mobile-scoped by default** — as of 14 Aug 2026, active work is scoped to mobile CSS (`@media (max-width: 760px)`) only unless founder explicitly says "desktop" or "both." Confirm scope before editing if ambiguous. Do not let desktop and mobile silently drift — full-file reverts have previously wiped concurrent mobile work from other agents; always diff against the live repo state immediately before editing, not a stale local copy.
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
