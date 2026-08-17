# cognoscene waitlist — handover doc
repo: gencogno/cognoscene-waitlist · branch: main · file: index.html
last commit this session: 81540a6 — founding card highlight rebuild, confirmed working

---

## PASTE THIS TO START THE NEW CHAT

```
continuing work on gencogno/cognoscene-waitlist (index.html). full context below —
read it, then ask me your one clarifying question for the mobile batch before
starting anything.
```

then paste everything below this line.

---

## how to work with Cogno

- casual shorthand, all-lowercase, direct, no padding — match his tone, skip preamble
- confirm scope before touching code if ANYTHING is ambiguous — he corrects fast and firmly when a read is wrong, so lock interpretation first
- he tests live on desktop AND mobile — always ask which, if a fix could behave differently per viewport
- push changes yourself via GitHub API (see workflow below) — don't hand him diffs to paste into ChatGPT, that workflow failed (ChatGPT's connector only does full-file PUT, couldn't do partial patches cleanly, wasted several rounds)
- verify structurally before pushing: brace balance, script tag balance, no duplicate CSS rule definitions — this file has had real bugs from silent duplicate rules and orphaned braces (see "known landmines" below). don't trust a single grep match — grep exhaustively for ALL instances of a class/rule before editing
- Cogno will send screenshots when something looks broken — use them, don't just re-read code and declare it correct. if code review says "looks fine" but he says it's still broken, the bug is real; keep digging (CDN cache, JS execution order, closest() ancestor mismatches all turned out to be real culprits this session)
- GitHub Pages CDN can lag several minutes behind pushes, especially with rapid consecutive commits. `raw.githubusercontent.com` reflects pushes near-instantly (use this to verify your own push landed) but the live Pages site (`gencogno.github.io/cognoscene-waitlist/`) can be stale. suggest `?nocache=1` query param or hard refresh / incognito if he reports "not there" right after a push

## GitHub push workflow (proven, use this exactly)

```python
import json, base64, urllib.request

PAT = "<Cogno will need to provide a fresh PAT — the old one used this session should be revoked>"
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
```

Network egress in this sandbox allows `api.github.com` and `raw.githubusercontent.com` but NOT `gencogno.github.io` — you cannot fetch the live rendered site directly. Verify pushes via `raw.githubusercontent.com/gencogno/cognoscene-waitlist/main/index.html`, not the Pages URL.

---

## known landmines already found + fixed this session

1. **duplicate CSS rules silently override each other.** `.founding-card .highlight` existed twice in the file — the later one used the `background` shorthand, which resets `background-image`/`background-position`/`background-size` to defaults, silently killing a gradient defined in the earlier rule. **Always grep for ALL instances of a selector before assuming a single edit covers it.**

2. **a pre-existing stray `}` bug (predates this session's work, was already in the original file)** closed `@media (max-width: 760px)` one level early, leaking mobile-only rules (`.solution-bridge`, `.field-row { flex-direction: column }`, `.step-row { grid-template-columns: 1fr }`, and others) out as global unscoped CSS on desktop too. Fixed by removing the stray brace. **If something looks like it's stuck in "mobile layout" on desktop, check for scope leaks like this.**

3. **CSS gradient-reveal technique used for swipe animations**: a solid `background: var(--lime)` shorthand was left sitting underneath a later-added `background-image` gradient. The gradient's "transparent" half rendered on top of the solid color, so it never looked transparent — defeating the whole reveal mechanism. **Any time you build a "hidden until revealed" background effect, make sure there's no earlier/later shorthand `background:` declaration setting a solid color.**

4. **JS placed in a shared `<script>` block can be silently killed by an unrelated error earlier in that same block** — script execution stops at the first uncaught error, and everything after it in that block just never runs, with no visible symptom. **Isolate independent features (like scroll-triggered animations) into their own `<script>` tags so one bug can't take down unrelated functionality.**

5. **`el.closest()` ancestor-matching for toggling animation classes is fragile** when elements sit in different DOM structures (h1 vs p vs nested inside an `<a>` wrapper). When something's not working and you can't find why, consider ripping out shared/clever logic and writing a fresh, dedicated, minimal observer for just that one component instead of debugging indefinitely.

6. **screenshots of animations can look "broken" when they're actually just in the pre-trigger resting state** — a static image can't prove an animation doesn't work. Ask for a live scroll test before assuming a bug, but also don't over-rely on this — sometimes it really is broken (see #1–5).

---

## current state of the site (as of commit 81540a6)

### confirmed working, tested by Cogno:
- hero `98%` — bold, lime, glow, scroll-triggered swipe-in animation (re-triggers every time it re-enters viewport)
- founding card 4 highlights (`2 months free`, `us$10`, `250`, `no charge today`) — bold, lime swipe, dedicated isolated observer (`.fc-swipe` class, own script tag)
- `"unexpected impulses"` — highlighted, swipe (no glow)
- `"hence, we built an extension..."` — folded into problem section as plain last paragraph (not a heading), highlighted + glow
- CTA buttons — "yeah" removed, now "i need this!"
- problem section eyebrow (`"the problem · how it begins"`) restored
- drop cap — on the `"you end up buying..."` paragraph (the Y), lime, 3-line
- red infinity loop graphic — replaces the old red circle hub inside the loop diagram, correctly cropped (see landmine-adjacent note below), positioned at exact old SVG coordinates (124px, 104.2px within the 248×268 circle-inner), sized 54px (0.75x scale-down from initial 72px estimate)
- solution bridge — sub-line centred (desktop AND mobile, the media-query leak was overriding this — now fixed), left space tightened
- anchor nav — REMOVED entirely (was added then reverted per Cogno's explicit request — do not re-add unless asked)
- three layer cards (observer / rationalisation / growth) in solution bridge — now `<a>` tags, clicking scrolls to `#observer` / `#rationalisation` / `#growth` sections (these IDs exist on the `.step-row` divs in `.solution-details`)
- glow effect — ONLY on the `"hence..."` paragraph. Was briefly added to hero + founding card, then explicitly reverted per Cogno — do not re-add to those unless asked.

### image asset
`assets/canva-loop.png` — Cogno uploaded a raw stock graphic (`infinite-recycle-sign.zip`, green infinity/recycle symbol with arrows). Processed: cropped to the graphic's TRUE bounding box (not a naive square crop from center — the first attempt cut off both edges because the source image was a wide rectangle, 8000×5331, and the graphic itself spanned 6415×3056; a square crop using height as the side sliced off ~1500px on each side). Padded to square instead of cropping further, background made transparent, recolored from green to red (`#E03030`) per Cogno's request ("make it red"). **If Cogno sends a new source image for this asset in future, redo the crop using the true-bounding-box method — do not blindly square-crop from center.**

---

## OUTSTANDING WORK — batches B, C, and a new mobile batch

### batch B (typography + problem section — verify these landed correctly, some may need follow-up)
1. drop cap `Y` position — confirm still correct after all subsequent edits
2. eyebrow + `"unexpected impulses"` highlight — confirm still correct
3. anchor nav mobile — N/A now, anchor nav was fully reverted (see above) — skip this, it's resolved by removal

### batch C (interactions + form)
4. layer card scroll-links (observer/rationalisation/growth) — confirmed added, but Cogno has not yet explicitly confirmed they work when clicked. Verify with him.
5. **item #10 from the original 10-point list — still flagged UNRESOLVED.** Original ask: change the form's "interest" field from a mobile/web dropdown to three options — web (all browsers) / mobile (android & ios) / both. This was implemented (see form HTML, `.platform-options` radio group). Cogno said: *"works but l'm gonna change it up, hence flag as unresolved."* He has not yet said what the change is. **Ask him directly what he wants changed about this field before touching it.**

### NEW batch — mobile
Cogno wants a mobile-specific pass. He has NOT yet specified what's in scope. **Before doing anything, ask him:**
- what specifically needs mobile attention — is this about checking parity with the desktop changes made this session (highlights, drop cap, loop graphic, solution bridge alignment, layer card links), or new mobile-only issues he's spotted separately?
- does he have screenshots of the current mobile state to share?
- Remember: the hero section has a COMPLETELY SEPARATE mobile HTML block (`.mobile-h1`, `.mobile-sub`, both `mobile-only` class, shown via `@media (max-width: 760px)` while `#hero-heading` and `#hero-sub-desktop` are hidden). The `98%` stat does NOT currently exist anywhere in the mobile copy — if Cogno wants that stat/highlight visible on mobile, it requires a copy decision (what to add, where), not just a CSS tweak. Do not assume — ask.

---

## reference: full 10-point original brief (for context, mostly resolved)

1. `98%` bolded + highlighted — ✅ done, swipe animation added
2. main stats highlighted in general — ✅ done (hero + founding card)
3. drop caps for contrast — ✅ done, scoped to one paragraph only (problem section) after Mode 2 research showed drop caps are an editorial device that looks broken if overused on a conversion page
4. remove "yeah" from CTA — ✅ done
5. remove hero title, make kicker bigger — ⚠️ reinterpreted per Cogno's correction: NOT the hero h1, it was the PROBLEM SECTION h2 title that got removed/restored/modified through several rounds. Final state: eyebrow kept, no separate title-heading, "hence..." folded in as prose. Consider this resolved unless Cogno reopens it.
6. shorten "tri loop" cards to one word each, replace Canva graphic — ✅ done (cards say "see"/"buy"/"regret", red infinity graphic in the hub)
7. move solution bridge title to end of problem — ✅ done, folded in as plain last paragraph of problem section (not a heading)
8. button link nav to all sections — ⚠️ REVERTED. Cogno initially asked for a sticky anchor nav bar, it was built, then he said "I didn't ask for this, please revert" — what he actually wanted was the three layer cards to be clickable scroll-links (done, see above). Anchor nav is fully removed from the codebase now.
9. founding member bolded + highlighted — ✅ done
10. mobile form field (web/mobile/both) — ⚠️ UNRESOLVED, see batch C above

---

## style/brand reference (for any new copy or visual decisions)

- colors: cream `#F5F0E8`, lime `#C8E88A` (brand highlight color, referenced as `var(--lime)`), black `#111111`
- fonts: Instrument Serif (headings), DM Sans (body)
- voice: all-lowercase, casual, direct
- red used for the loop/cycle graphic specifically: `#E03030` (Cogno's explicit choice, not the brand lime — this is intentional for that one element only)
