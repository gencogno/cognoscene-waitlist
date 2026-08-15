# Cognoscene Waitlist — Agent Handover

**Audience:** agents or devs working in this repo (`gencogno/cognoscene-waitlist`).  
**Author context:** founder `cogno` · Singapore · pre-revenue Chrome extension · pre-incorporation.  
**Last updated:** 15 Aug 2026 (ChatGPT session) · current production changes through commit `92b7ec5`.

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
| Form fields | Email (required) · Chrome on desktop y/n (required) — current form remains desktop-first; mobile interest is a planned addition, not yet implemented |

---

## 2. File structure

```
cognoscene-waitlist/
├── index.html              ← production site
├── css/
│   └── layers.css          ← extracted layer-index + layer hero heading styles
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
│   │   └── icon-regret-bag.png
│   └── ...
├── mockups/
│   ├── mobile-iphone14-alternate.html
│   ├── waitlist.html
│   ├── waitlist-short.html
│   ├── mockup-artboard.css
│   └── mockup-artboard.js
├── docs/
│   ├── HANDOVER.md
│   └── WAITLIST-PLAN.md
└── scripts/
```

---

## 3. Production site — current state (15 Aug 2026)

| Section | Status |
|---------|--------|
| Hero | Copy locked — lowercase, Buffer-style brand voice |
| Problem band | SVG loop diagram (1.25× scale) — see-you-buy-regret cards with hub chevrons; faint shadow on cards (no border) |
| Problem copy | Lead-in in header; body = trap beat → regret quote → pivot (bold close) |
| `solution-details` | Layer showcase remains 3 layers with video lightbox and mobile swipe behavior |
| `solution-bridge` layers-index | Desktop remains a 3-column index. Mobile cards use centered text; Observer/Growth move toward the right endpoint; Rationalisation moves toward the left endpoint. Growth has a darker/more apparent green treatment. |
| Layer gradient | Extracted to `css/layers.css`. Gradient opacity is pendulum-style and synchronized to the card's motion timing. Rationalisation uses the inverse travel direction. Current implementation uses endpoint/return opacity timing; verify visual orientation on both halves if another agent changes the animation. |
| Layer hero headings | `.step-title` increased by 25% from previous desktop/mobile sizes. |
| Kicker alignment | `.layers-index-label` is centered. `.solution-bridge-sub` is also intended to be centered above the layer index and should remain centered. |
| `solution-details` showcase videos | Mobile max-width current = 84.375%. |
| Video lightbox | Cross-layer navigation across all 5 clips; mobile swipe via Pointer Events; rounded video corners. |
| `founding-band` | Uses urgency framing around first 250 spots / 30-day window. |
| OG/meta | Production canonical/OG URLs use GitHub Pages. |
| Founding terms | Canonical updated to `https://gencogno.github.io/cognoscene-waitlist/founding-terms.html`. |
| Form | Email + Chrome y/n; Formspree POST. **Mobile platform interest is not yet implemented.** |
| Footer | Privacy + Terms linked |

### Founding offer — current strategic position

The founding offer remains:

- 2 months of premium free after install/activation during the founding beta;
- then US$10 one-time for lifetime premium;
- no payment at waitlist signup;
- 250 founding spots;
- waitlist closes 30 days after public launch or when the cap is reached, whichever comes first.

This is intentional: the user can experience the product before paying. Do not convert the waitlist into an upfront-payment funnel without explicit founder approval.

### Mobile demand — planned, not yet actioned

Recommended next funnel change:

- Keep **one waitlist**, not a separate mobile waitlist.
- Add a lightweight platform-intent field: **Chrome / Mobile / Both**.
- Add a small mobile-interest CTA near the form, framed as **exploring mobile**, not “coming soon”.
- Use platform selection as a demand signal before committing engineering resources to a mobile build.

Do not implement these changes unless the founder asks; they are recommendations, not current production behavior.

---

## 4. Brand constants

| Token | Value |
|-------|-------|
| Cream | `#F5F0E8` |
| Lime | `#C8E88A` |
| Black | `#111111` |
| Typography | Be Vietnam Pro |
| Voice | all-lowercase, Buffer-style |
| Logo mark | `assets/cognoscene-mark.png` (concentric-ring ∅) |
| Wordmark | `assets/cognoscene-wordmark.png` (lowercase cogn∅scene) |

---

## 5. Agent scope + rules

- **Waitlist edits = this repo only.** Do not spill into the extension repo unless founder explicitly asks.
- **Do not bump `manifest.json`** — that lives in the extension repo; waitlist changes do not touch it.
- **Smallest diff only** — one ask = one surface. Do not touch adjacent sections, copy, or assets not named in the prompt.
- **Mobile-scoped by default** unless founder explicitly says desktop or both. Confirm scope when ambiguous.
- **Mockup-first for major layout changes** — use the mockup files before production when appropriate.
- **Comms channel: email only.** Telegram is retired.
- **No Telegram, no clinical/shopping-addiction language, no unsupported stats** in any copy or docs.
- **Do not use temporary Actions workflows as a routine editing mechanism.** Prefer direct repository file updates for small component files.

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

---

## 8. ChatGPT commit log — 15 Aug 2026

**Purpose:** distinguish changes made by ChatGPT from changes made by Claude/Cursor/other agents. The commits below were made in this repository by the ChatGPT GitHub session.

| Commit | Date (UTC) | Change |
|---|---|---|
| `02b56b6` | 13:54 | Initial layer-index gradient fix |
| `e0619a2` | 13:54 | Improve layer-index gradient |
| `1606c56` | 13:56 | Reverse Rationalisation gradient pathway (workflow-based; later superseded) |
| `178958d` / `3df847b` | 13:57 | Darken Growth gradient (workflow/direct patch; superseded by component CSS) |
| `c91920b` / `a7bf572` | 13:59 | Gradient direction attempts (superseded) |
| `ae738e8` / `2ae875c` / `d39e7b7` | 14:01–14:03 | Layer-gradient direction/timing attempts; earlier workflow attempts were superseded |
| `2261a21` | 14:09 | Removed failed temporary gradient workflow |
| `1c11d9d` | 14:15 | Extracted layer-index CSS into `css/layers.css` |
| `9aa19d7` | 14:28 | Wired layer styling refactor into production CSS structure |
| `2916dd8` | 14:32 | Reversed Rationalisation gradient direction |
| `a62479a` | 14:34 | Synced Rationalisation gradient with card movement |
| `2101de9` | 14:36 | Increased layer hero headings by 25% |
| `63e4353` | 14:38 | Added pendulum-style gradient opacity keyframes |
| `d586577` | 14:42 | Synced gradient pendulum timing with card movement |
| `706441d` | 14:45 | Corrected `founding-terms.html` canonical from Netlify to GitHub Pages |
| `92b7ec5` | 14:48 | Aligned gradient pendulum to both card endpoints; centered layer kicker |

**Important:** Some earlier workflow commits in the list are historical attempts and were superseded. The current production state should be read from the latest files on `main`, not inferred from those intermediate commits.
