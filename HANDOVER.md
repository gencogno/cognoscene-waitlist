# cognoscene waitlist — handover doc
repo: gencogno/cognoscene-waitlist · branch: main · file: index.html
last commit this session: 63af9e6ee756cf9e6e645709699a214cfe0b0be4 — layer card hover: lime outline, 375ms

---

## PASTE THIS TO START THE NEW CHAT

```
continuing work on gencogno/cognoscene-waitlist (index.html). full context below —
read it, then ask me your one clarifying question for item #10 (platform field
redesign) before starting anything.
```

then paste everything below this line.

---

## how to work with Cogno

- casual shorthand, all-lowercase, direct, no padding — match his tone, skip preamble
- confirm scope before touching code if ANYTHING is ambiguous — he corrects fast and firmly when a read is wrong, so lock interpretation first. when he gives a one-word confirmation like "sure" to a multi-part question, pick the sensible default, state the assumption briefly, and proceed rather than re-asking
- he tests live on desktop AND mobile — always ask which, if a fix could behave differently per viewport
- push changes yourself via GitHub API (see workflow below) — don't hand him diffs to paste into ChatGPT, that workflow failed (ChatGPT's connector only does full-file PUT, couldn't do partial patches cleanly, wasted several rounds)
- verify structurally before pushing: brace balance, script tag balance, no duplicate CSS rule definitions — this file has had real bugs from silent duplicate rules and orphaned braces (see "known landmines" below). don't trust a single grep match — grep exhaustively for ALL instances of a class/rule before editing
- Cogno will send screenshots when something looks broken — use them, don't just re-read code and declare it correct. if code review says "looks fine" but he says it's still broken, the bug is real; keep digging (CDN cache, JS execution order, closest() ancestor mismatches all turned out to be real culprits in past sessions)
- GitHub Pages CDN can lag several minutes behind pushes, especially with rapid consecutive commits. `raw.githubusercontent.com` reflects pushes near-instantly (use this to verify your own push landed) but the live Pages site (`gencogno.github.io/cognoscene-waitlist/`) can be stale — and even `raw.githubusercontent.com` occasionally shows a brief lag. **if raw looks stale right after a push, verify via the Contents API (`GET /repos/.../contents/index.html?ref=main`) instead — it reads the same data source as the PUT and won't be cache-stale.** suggest `?nocache=1` query param or hard refresh / incognito to Cogno if he reports "not there" right after a push
- **PAT hygiene: if Cogno pastes a token in chat that was already pasted earlier in the same session, do not use it — it's the same exposed credential, re-pasting doesn't create a new one.** ask him to actually revoke and generate a fresh one. only proceed once the token value is visibly different from any previous paste this session. Cogno may push back hard on this ("just use it") — hold the line anyway, it costs him ~30 seconds to fix properly and the risk is real regardless of when it's revoked.
- **update THIS FILE (HANDOVER.md) at the end of any session with real changes** — it drifted out of sync with actual repo state before (was last updated at an older commit while a newer handover doc was only ever pasted into chat, never committed back). push HANDOVER.md alongside index.html so the repo stays the single source of truth.

## GitHub push workflow (proven, use this exactly)

```python
import json, base64, urllib.request

PAT = "<Cogno provides a fresh PAT each session — never reuse one already pasted earlier in the conversation>"
URL = "https://api.github.com/repos/gencogno/cognoscene-waitlist/contents/index.html"

# 1. GET current SHA
req = urllib.request.Request(URL)
req.add_header("Authorization", f"token {PAT}")
with urllib.request.urlopen(req) as resp:
    sha = json.loads(resp.read())["sha"]

# 2. read/edit file locally first (bash_tool + python str replace), verify brace balance:
#    python3 -c "c=open('index.html').read(); print(c.count('{'), c.count('}'))"
#    python3 -c "c=open('index.html').read(); print(c.count('<script'), c.count('</script>'))"

# 3. PUT the full updated file
with open("index.html", "rb") as f:
    content = base64.b64encode(f.read()).decode("utf-8")

payload = json.dumps({
    "message": "descriptive commit message",
    "content": content,
    "sha": sha,
    "branch": "main"
}).encode()

req2 = urllib.request.Request(URL, data=payload, method="PUT")
req2.add_header("Authorization", f"token {PAT}")
req2.add_header("Content-Type", "application/json")
with urllib.request.urlopen(req2) as resp:
    print(json.loads(resp.read())["commit"]["sha"])

# 4. VERIFY via Contents API (not raw.githubusercontent.com — can lag)
req3 = urllib.request.Request(URL + "?ref=main")
req3.add_header("Authorization", f"token {PAT}")
with urllib.request.urlopen(req3) as resp:
    verify = json.loads(resp.read())
    verify_content = base64.b64decode(verify["content"]).decode("utf-8")
    # search verify_content for the change you just made
```

Network egress in this sandbox allows `api.github.com` and `raw.githubusercontent.com` but NOT `gencogno.github.io` — you cannot fetch the live rendered site directly.

---

## known landmines (cumulative, all sessions)

1. **duplicate CSS rules silently override each other.** `.founding-card .highlight` existed twice — the later one used the `background` shorthand, which resets `background-image`/`background-position`/`background-size` to defaults, silently killing a gradient defined earlier. **Always grep for ALL instances of a selector before assuming a single edit covers it.**

2. **a pre-existing stray `}` bug** closed `@media (max-width: 760px)` one level early, leaking mobile-only rules out as global unscoped CSS on desktop too. **If something looks stuck in "mobile layout" on desktop, check for scope leaks like this.**

3. **CSS gradient-reveal technique for swipe animations**: a solid `background: var(--lime)` shorthand left underneath a later `background-image` gradient defeats the transparent-reveal effect. **Check for earlier/later shorthand `background:` declarations any time you build a "hidden until revealed" effect.**

4. **JS in a shared `<script>` block can be silently killed by an unrelated error earlier in that block** — execution stops at the first uncaught error, everything after just never runs, no visible symptom. **Isolate independent features into their own `<script>` tags.** (this pattern is now used consistently: swipe-highlight animation, founding-card highlights, and the new post-signup modal all live in their own dedicated script tags.)

5. **`el.closest()` ancestor-matching for toggling animation classes is fragile** across different DOM structures. When debugging stalls, consider ripping out shared/clever logic for a fresh, dedicated, minimal observer instead.

6. **screenshots of animations can look "broken" when they're actually in the pre-trigger resting state.** Ask for a live test before assuming a bug, but don't over-rely on this either — sometimes it's real.

7. **the custom workflow `.github/workflows/relocate-problem-copy.yml` fires on every push to main and always fails** — expected/known, not a code issue. `pages build and deployment` is the workflow that matters. Re-run manually if Pages build fails with 429/internal server error (GitHub infra, not your code).

8. **always do an exhaustive search before declaring a sweep complete** — e.g. the white-color audit needed regex covering `#ffffff`, `#fff`, `white` keyword, `rgb(255,255,255)`, `rgba(255,255,255,...)`, `var(--white)`, and exclusion of `white-space: nowrap` noise. First pass missed 10+ instances.

9. **hover effects should be scoped with `@media (hover: hover) and (min-width: ...)`, not just a viewport-width media query alone** — plain `:hover` on touch devices can get "stuck" after a tap since there's no mouse-leave event. This combo correctly excludes touch/mobile entirely regardless of screen width.

10. **when a client wants a demand-signal survey with more than ~2 questions, don't cram it into the primary conversion form or a single static block — build a stepper.** One question per screen, skippable per-question (not skip-the-whole-thing), with per-question sample sizes reported honestly rather than assuming full-form completion. Reduces both friction and reporting bias.

11. **Formspree: use a separate form ID for secondary/optional data collection (e.g. post-signup surveys) rather than reusing the primary signup form ID.** Keeps the two data streams cleanly separable for export later, at zero extra cost now.

---

## current state of the site (as of commit 63af9e6)

### brand palette (locked — updated from original)
- `--cream: #edeade` (cooler beige, updated from `#f5f0e8`)
- `--lime: #b8d878` (softer green, updated from `#c8e88a`)
- `--black: #111111`
- fonts: Instrument Serif (headings), DM Sans (body) — Be Vietnam Pro in some older rules
- voice: all-lowercase, casual, direct
- red `#E03030` for loop/cycle graphic only (Cogno's explicit choice, not part of the lime accent system)

### white handling (resolved, batch B2)
- `--white: #ffffff` CSS variable retained in `:root` for explicit white needs
- cream bg + black border (intentional lift/interactivity): `.founding-card`, `.loop-icon-card`, `.field`, `.radio-pill`
- cream bg, existing border unchanged (blend in): `.hero-sheet-dialog`, `.hero-info-btn`, `.slider-pill`, `.mock-url`, `.mock-soft-btn`, `.problem-quote`, `.waitlist-closed`, `.form-success`, lightbox close btn
- retained as-is: `rgba(255,255,255,0.08)` navbar border on black bg, `rgba(255,255,255,0.7)` image caption overlay

### confirmed working, tested by Cogno:
- hero `98%` — bold, lime, glow, scroll-triggered swipe-in animation
- founding card 4 highlights — bold, lime swipe, dedicated isolated observer (`.fc-swipe`, own script tag)
- `"unexpected impulses — mostly from social feeds."` — swipe highlight
- `"hence, we built an extension..."` — folded into problem section as plain last paragraph, highlighted + glow
- CTA buttons — "i need this!"
- problem section eyebrow — left-aligned, top of problem copy
- drop cap — REMOVED entirely (brand voice conflict)
- red infinity loop graphic — true-bounding-box crop, positioned at (124px, 104.2px) in 248×268 circle-inner, sized 54px
- solution bridge — sub-line centred desktop + mobile
- anchor nav — REMOVED, do not re-add unless asked
- **three layer cards (observer / rationalisation / growth)** — `<a>` tags scrolling to `#observer` / `#rationalisation` / `#growth`. **Cogno has now confirmed these work when clicked (this session).**
- **layer card hover state (NEW this session)** — desktop only (`@media (hover: hover) and (min-width: 761px)`), whole card flips: cream/transparent → black background, text → lime, border → lime outline, 375ms ease transition. Padding `24px 28px` + `16px` border-radius added to give the previously-bare text links an actual card shape.
- glow effect — ONLY on the `"hence..."` paragraph
- chrome-band — REMOVED from HTML, CSS still present as dead code (lines ~161–176, ~1928) — flagged for cleanup, not yet done
- **post-signup micro-survey modal (NEW this session)** — see dedicated section below

### image asset
`assets/canva-loop.png` — red `#E03030` infinity/recycle symbol, true-bounding-box crop method. If Cogno sends a new source image, redo using that method, not a naive square crop.

---

## post-signup micro-survey modal (built + shipped this session)

**trigger:** fires automatically right after successful waitlist form submission, via `openPostSignupModal(payload.email)` called inside the existing Formspree `.then()` success handler.

**structure:** 4-step modal — intro → Q1 (country) → Q2 (referral source) → Q3 (platform interest, merged from original separate chromium-browser + mobile-app-demand questions) → closing/thanks screen.

**copy (locked):**
- intro: *"you're on the list! we'll reach out to you within 1–2 weeks, just three quick things first."*
- Q1: *"where are you based?"* — dropdown, singapore/malaysia/united states pinned to top (SAM/SOM markets), rest alphabetical, "other" at bottom
- Q2: *"how'd you find us?"* — single-select chips: reddit / tiktok / instagram / friend/word of mouth / search / other (other reveals a freetext input)
- Q3: *"besides chrome, where do you want us?"* — multi-select chips: edge / firefox / opera / brave / mobile app (ios) / mobile app (android) / none of these yet ("none" is exclusive — selecting it clears other selections and vice versa)
- closing: *"thanks — see you soon."*

**mechanics:** progress dots per step, `×` dismiss anytime, each question individually skippable (not all-or-nothing), confirmation message shown upfront on intro regardless of downstream answers, mobile renders as a bottom-sheet (slides up) vs. centered modal on desktop.

**data handling:** answers POST to a **separate Formspree endpoint** (`formspree.io/f/mwleweea`) from the main signup form (`mbgropvn`), correlated by email. Fires on reaching the "done" step (via finish or skip-through) OR on early dismiss if any answer was given. Best-effort — no retry logic, no UI error state (acceptable for optional secondary data).

**important scope note — mobile app demand ≠ browser porting:** Cogno's intent for the platform-interest question is gauging demand for a native mobile app, NOT porting the Chrome extension itself. These are different products — Decision Mode's checkout-intercept mechanic relies on browser extension APIs that don't exist the same way on iOS/Android at the OS level. A mobile app would need a different technical approach entirely (e.g. Safari content blocker, Android accessibility service, or shopping-app-specific integrations) if ever built. Currently this is demand-signal only — no build commitment implied by the copy, and none should be added without Cogno explicitly scoping it.

**pre-existing gap noticed while building this (not yet fixed, flag to Cogno):** the *original* waitlist form's Formspree payload (`mbgropvn`, in the main submit handler) does not currently include the `platform` radio value (`web`/`mobile`/`both`) in the fields it sends — only `email`, `ready`, `legal_agreed`. That field has existed in the HTML but may not actually be captured in submissions. Worth confirming with Cogno whether this is intentional or a bug to fix.

---

## SEO (audited this session — researched, not yet actioned)

**already in place (checked live `<head>`):** title, meta description, canonical tag, full OG set (`og:type`/`url`/`title`/`description`/`image`), `twitter:card`. Core basics are covered.

**gaps — independent of the Cloudflare move, cheap, not yet done:**
- no `robots.txt` in repo root
- no `sitemap.xml` in repo root
- `twitter:card` set but `twitter:title`/`twitter:description`/`twitter:image` not explicit (most crawlers fall back to `og:` tags, but not guaranteed everywhere)

**tied to the Cloudflare Pages migration specifically:** 301 redirects from `gencogno.github.io` to the new domain, via Cloudflare's `_redirects` file — standard practice so search engines transfer ranking rather than treating it as a new site. Low urgency for Cogno specifically since the site is pre-launch with minimal existing search traffic to protect — there's little ranking to lose, unlike a migration guide written for an established site.

**verdict:** don't bundle SEO into the Cloudflare migration as a blocking reason to wait — robots.txt/sitemap/explicit twitter tags are zero-risk, zero-dependency, can ship any time. Given the locked distribution strategy (Reddit organic / micro-creator / TikTok, not search-driven), on-site SEO is a supporting lever, not a priority one. Redirects are the one item that genuinely needs to wait for the new domain to exist.

---

## OUTSTANDING WORK

### item #10 — platform interest field on the MAIN signup form — still UNRESOLVED
Current live copy: label *"i'm joining for"*, radio pills `web (all browsers)` / `mobile (android & ios)` / `both`. Cogno has said multiple times he wants to change this but scope has shifted across the conversation — he does NOT want browser-porting language, he wants **mobile app demand** framing (see the post-signup Q3 above, which now handles a version of this). Ask him directly: does he still want the *main form's* field changed too, now that the post-signup survey covers a fuller mobile-interest question? Or is the main form field fine as-is and only the post-signup survey needed the fix?

### formspree payload gap
See "pre-existing gap" note above — confirm with Cogno whether the main form's `platform` field needs to be added to its Formspree payload.

### chrome-band dead CSS cleanup
Lines ~161–176 and ~1928 (line numbers approximate, re-grep before touching) — HTML already removed, CSS rules still present unused. Low priority, flagged for whenever there's a cleanup pass.

### font-size:0 / ::after CTA hack
Open cleanup note from earlier sessions — a redundant hack in `layers.css`-equivalent inline styles should be removed. Not yet located/actioned this session — re-grep for it.

### mobile-specific batch
Not yet scoped in detail. Before touching: ask Cogno whether this is a parity check against desktop-only changes made recently (layer card hover is desktop-only by design, so nothing to port there) or new mobile-only issues. Remember the hero has a **completely separate mobile HTML block** (`.mobile-h1`, `.mobile-sub`, `.mobile-only` class) — the `98%` stat does not exist in mobile copy; adding it requires a copy decision, not just CSS.

### GitHub Pages → Cloudflare Pages migration
Flagged in earlier sessions as a planned move once the site is finalized. Steps to be documented in `docs/WAITLIST-PLAN.md` when it's time — not started.

---

## reference: full 10-point original brief (status)

1. `98%` bolded + highlighted — ✅ done
2. main stats highlighted — ✅ done
3. drop caps — ✅ REMOVED (brand voice conflict, Cogno's decision)
4. remove "yeah" from CTA — ✅ done
5. problem section restructure — ✅ done
6. shorten tri-loop cards, replace graphic — ✅ done
7. move solution bridge title — ✅ done
8. button link nav — ✅ REVERTED, replaced with layer card scroll-links (now also has hover state)
9. founding member highlighted — ✅ done
10. mobile form field (web/mobile/both) — ⚠️ still unresolved, see "OUTSTANDING WORK" above — scope has evolved into the post-signup survey covering most of the original intent, but the main-form field itself hasn't been touched

---

## style/brand reference (for any new copy or visual decisions)

- colors: cream `var(--cream)` `#edeade`, lime `var(--lime)` `#b8d878`, black `var(--black)` `#111111`, white `var(--white)` `#ffffff` (retained for explicit use only)
- red `#E03030` — loop/cycle graphic only, not part of the general accent system
- fonts: Instrument Serif (headings), DM Sans (body), Be Vietnam Pro in some older rules
- voice: all-lowercase, casual, direct
- card convention: `16px` border-radius, `24px 28px` padding, `1px solid black` border — used by `.founding-card` and now `.layer-index-item`
- hover convention (desktop only): scope with `@media (hover: hover) and (min-width: 761px)` to avoid touch-device "stuck hover" states
