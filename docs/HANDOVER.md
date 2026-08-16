# Cognoscene Waitlist — Agent Handover

**Audience:** agents or devs working in this repo (`gencogno/cognoscene-waitlist`).  
**Author context:** founder `cogno` · Singapore · pre-revenue Chrome extension · pre-incorporation.  
**Last updated:** 16 Aug 2026 (ChatGPT session) · current production changes through commit `1cc5f4f`.

**Extension repo (separate):** `gencogno/cognoscene-statics-roadmap` — do not confuse. Changes here do not require a `manifest.json` bump.  
**Master launch docs (extension repo):** `docs/agent-context/AGENT_HANDOVER.md` · `docs/agent-context/launch-sdd.md` · `docs/agent-context/waitlist-launch-spec.md` — those are the source of truth for GTM logic; `docs/WAITLIST-PLAN.md` in this repo is the distilled, waitlist-scoped version.

---

## 1. Live site

| Item | Value |
|------|-------|
| URL | `https://gencogno.github.io/cognoscene-waitlist/` |
| Host | **GitHub Pages** — auto-deploy on push to `main` |
| Privacy | Repo is **public** — GitHub Pages (Netlify removed 14 Aug 2026) |
| Form backend | **Formspree** client POST — `FORMSPREE_FORM_ID` in `index.html` |
| Form fields | Email (required) · Platform (required: Chrome / Mobile / Both) · Legal consent (required) |

---

## 2. File structure

```
cognoscene-waitlist/
├── index.html              ← production site
├── css/
│   └── layers.css          ← extracted layer-index, layer hero, solution hero, and waitlist form styles
├── js/
│   └── waitlist-form.js    ← platform-intent + mobile caveat + Formspree payload enhancement
├── founding-terms.html     ← founding offer terms
├── privacy.html
├── terms.html
├── DEPLOY.md               ← GitHub Pages deploy + DNS guide
├── MOBILE.md               ← mobile layout decisions
├── assets/
├── mockups/
├── docs/
│   ├── HANDOVER.md
│   └── WAITLIST-PLAN.md
└── scripts/
```

---

## 3. Production site — current state (16 Aug 2026)

| Section | Status |
|---------|--------|
| Hero | Copy locked — lowercase, Buffer-style brand voice |
| Problem band | SVG loop diagram (1.25× scale) — see-you-buy-regret cards with hub chevrons; faint shadow on cards (no border) |
| `solution-details` | 3-layer showcase with video lightbox and mobile swipe behavior |
| `solution-bridge` layers-index | Desktop remains a 3-column index. Mobile cards use centered text; Observer/Growth move toward the right endpoint; Rationalisation moves toward the left endpoint. Growth uses a darker/more apparent green treatment. |
| Layer gradient | Extracted to `css/layers.css`. Current implementation uses a shared right-edge gradient treatment synchronized with card movement timing. Rationalisation reverses the animation phase with its card rather than using a separate mirrored gradient system. **Visual result is not considered final by founder and may need another pass.** |
| Layer hero headings | `.step-title` increased by 25% from previous desktop/mobile sizes. |
| Kicker alignment | `.layers-index-label` centered. `.solution-bridge-sub` centered and should remain centered. |
| `solution-details` showcase videos | Mobile max-width current = 84.375%. |
| Video lightbox | Cross-layer navigation across all 5 clips; mobile swipe via Pointer Events; rounded video corners. |
| `founding-band` | Uses first 250 spots / 30-day urgency framing. |
| OG/meta | Production canonical/OG URLs use GitHub Pages. |
| Founding terms | Canonical = `https://gencogno.github.io/cognoscene-waitlist/founding-terms.html`. |
| Form | Email + required Platform selector (Chrome / Mobile / Both) + required legal consent. Formspree POST includes `platform`. Old readiness checkbox removed. |
| Footer | Privacy + Terms linked |

### Founding offer — current strategic position

The founding offer remains:

- 2 months of premium free after install/activation during the founding beta;
- then US$10 one-time for lifetime premium;
- no payment at waitlist signup;
- 250 founding spots;
- waitlist closes 30 days after public launch or when the cap is reached, whichever comes first.

This is intentional: the user can experience the product before paying. Do not convert the waitlist into an upfront-payment funnel without explicit founder approval.

### Mobile demand — now implemented as validation

The waitlist now captures platform intent in one form:

- `chrome`
- `mobile`
- `both`

There is **not** a separate mobile waitlist.

When `mobile` or `both` is selected, the form shows this qualification copy:

> if you ticked this, that means you believe a mobile version that disrupts shopping impulses would help you immensely to prevent shopping-centric financial vulnerabilities & purchase regret.

This is intentionally a user-validation / pre-seed demand signal, not a promise that mobile is already available.

The selected platform is added to the Formspree payload as `platform`. The old `ready` field is removed from the payload.

---

## 4. Brand constants

| Token | Value |
|-------|-------|
| Cream | `#F5F0E8` |
| Lime | `#C8E88A` |
| Black | `#111111` |
| Typography | Be Vietnam Pro |
| Voice | all-lowercase, Buffer-style |
| Logo mark | `assets/cognoscene-mark.png` |
| Wordmark | `assets/cognoscene-wordmark.png` |

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
- Founder prefers focused CSS/JS files over repeatedly expanding the monolithic `index.html`.

---

## 6. Key constraints (do not violate)

1. Never add a Telegram field or reference back.
2. Never add a public Stripe payment link — founding checkout is gated via edge function + allowlist.
3. Never describe Cognoscene as Pte Ltd (pre-incorporation).
4. Never use retired SVG logo placeholders — PNG assets only.
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

## 8. ChatGPT commit log — 15–16 Aug 2026

**Purpose:** distinguish changes made by ChatGPT from changes made by Claude/Cursor/other agents. The commits below were made in this repository by the ChatGPT GitHub session. Earlier attempts are historical and may be superseded; current files on `main` are the source of truth.

| Commit | Change |
|---|---|
| `1c11d9d` | Extracted layer-index CSS into `css/layers.css` |
| `9aa19d7` | Wired layer styling refactor into production CSS structure |
| `2916dd8` | Reversed Rationalisation gradient direction |
| `a62479a` | Synced Rationalisation gradient with card movement |
| `2101de9` | Increased layer hero headings by 25% |
| `63e4353` | Added pendulum-style gradient opacity keyframes |
| `d586577` | Synced gradient pendulum timing with card movement |
| `706441d` | Corrected `founding-terms.html` canonical from Netlify to GitHub Pages |
| `92b7ec5` | Centered kicker + gradient endpoint attempt |
| `2212a31` | Centered / enlarged solution hero and highlighted `friction.` in lime |
| `5015cd2` | Added `js/waitlist-form.js` for platform intent and mobile qualification |
| `190f41e` | Added waitlist platform/caveat styling to `css/layers.css` |
| `a2bdb10` | Created separate ChatGPT handover; **superseded and removed** |
| `dc5142c` | Removed duplicate ChatGPT handover; consolidated into this `docs/HANDOVER.md` |
| `1cc5f4f` | Simplified all layer gradients into shared right-edge behavior synchronized with card movement |

**Historical note:** Earlier ChatGPT gradient workflow commits (`02b56b6`, `e0619a2`, `1606c56`, `178958d`, `3df847b`, `c91920b`, `a7bf572`, `ae738e8`, `2ae875c`, `d39e7b7`, `2261a21`) are superseded experiments. Do not reconstruct current behavior from them.

---

## 9. Current founder preferences established in this work

- Prefer **small, isolated changes**.
- Reduce conversion friction wherever possible.
- Keep the founding offer pay-later model.
- Mobile should be validated through demand capture before being treated as a committed product promise.
- Preserve the `platform` field because platform interest is strategically valuable for pre-seed fundraising.
- Keep one waitlist / one backend.
- Keep lowercase / Buffer-style brand voice.
- Add a **Next steps** section after substantive recommendations.
- Gradient should be treated as a visual detail that must follow motion geometry, not as an independent decorative animation.

---

## 10. Immediate next steps

1. Verify the live waitlist form visually and confirm Formspree receives `platform` correctly.
2. Leave the founding economics unchanged unless founder explicitly revises them.
3. Revisit the layer gradient only when ready for another visual pass. Test actual card position against gradient opacity at both endpoints; do not stack additional keyframes on top of the current logic without understanding the motion phase first.
4. Use Chrome / Mobile / Both demand as an input into the mobile product and pre-seed narrative.
