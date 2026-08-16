# Cognoscene Waitlist — ChatGPT Session Handover

**Audience:** ChatGPT or another AI continuing work from this specific ChatGPT session.
**Repository:** `gencogno/cognoscene-waitlist`
**Production host:** GitHub Pages
**Production URL:** `https://gencogno.github.io/cognoscene-waitlist/`
**Session date:** 15–16 Aug 2026 (SGT)

---

## 1. Current product / positioning context

Cognoscene is a pre-revenue product focused on preventing impulse purchases through behavioral friction.

Current public waitlist positioning:

- Desktop Chrome is the current product surface.
- Mobile is **not yet a shipped product**.
- Mobile interest is being captured as validation / pre-seed demand signal, not as a promise that mobile is already available.
- Founding offer remains deliberately low-friction: no payment at signup.

### Founding offer — DO NOT CHANGE unless founder asks

- 2 months premium free after install/activation during the founding beta.
- Then US$10 one-time for lifetime premium.
- No charge at waitlist signup.
- First 250 founding spots.
- Offer closes after 30 days or when 250 spots fill, whichever comes first.

The founder explicitly prefers users to **try the product first and pay later**.

---

## 2. Current waitlist form

The form was changed during this session to reduce conversion friction.

### Current desired flow

```text
email address *

where would you want cognoscene?
[ chrome ] [ mobile ] [ both ]

(if mobile or both is selected)
if you ticked this, that means you believe a mobile version that disrupts shopping impulses would help you immensely to prevent shopping-centric financial vulnerabilities & purchase regret.

[legal consent checkbox]

[join the waitlist]
```

### Important decisions

- Removed the old **"i'm ready to try a pause before checkout"** checkbox because the founder felt multiple checkboxes created conversion friction.
- Legal consent checkbox remains required.
- Platform selection is required.
- Platform values are:
  - `chrome`
  - `mobile`
  - `both`
- The selected value is submitted to Formspree as `platform`.
- Mobile caveat appears only when `mobile` or `both` is selected.
- Keep one waitlist / one backend. Do **not** create a separate mobile waitlist.

### Current implementation

- `js/waitlist-form.js` dynamically adds the platform selector and conditional caveat.
- It removes the legacy `ready` checkbox if present.
- It patches the existing Formspree JSON payload to add `platform` and remove `ready`.
- `index.html` now loads `js/waitlist-form.js`.
- `css/layers.css` contains the platform selector / caveat styling.

This implementation was intentionally separated into a small JS module because `index.html` is a large monolithic file.

---

## 3. Layer index / gradient work

The three layer index cards are:

1. Observer
2. Rationalisation
3. Growth

### Motion intent

- Observer moves toward the **right** endpoint.
- Rationalisation moves toward the **left** endpoint.
- Growth follows Observer's motion.

### Founder’s desired gradient behavior

The founder's latest explicit requirement is:

- Gradient must be tied directly to the card's movement animation.
- The green treatment should appear at the intended container-edge contact rather than drifting independently.
- Rationalisation should use the **same literal right-side green gradient treatment as Observer**, while its card travels in the opposite direction.
- Growth should follow Observer's gradient behavior exactly, but use a **darker / more apparent green**.

### Current state / caution

The gradient has been iterated several times and the founder has repeatedly said the visual result was not quite right. The current CSS was simplified to a shared right-edge gradient system with Rationalisation reversing the animation phase together with its card.

**Do not assume the gradient is visually final.** The founder explicitly said it is still bothering them and may be revisited later.

When changing it next:

- Do not add another independent opacity animation unrelated to card movement.
- Do not create separate mirrored gradient systems unless the founder explicitly asks for a mirrored visual.
- Preserve Growth as the Observer behavior with darker green.
- Test both endpoints and the exact relationship between card position and gradient opacity.

### Layer CSS location

`css/layers.css`

It contains:

- `.layers-index`
- `.layer-index-item`
- mobile motion / gradient keyframes
- `.step-title` 25% size increase
- solution hero heading styling
- waitlist platform styling

---

## 4. Solution bridge / hero text changes

### Main solution hero

Existing text:

> hence, we built an extension to prevent you from shopping destructively using friction.

Current visual requirement:

- centered
- 1.25× previous size
- `friction.` bold
- `friction.` in Cognoscene signature lime `#C8E88A`

Current implementation uses CSS pseudo-elements on `.solution-bridge h2` to style the phrase without rewriting the existing semantic HTML.

### Layer hero headings

The individual `.step-title` headings in `solution-details` were increased by 25% on desktop and mobile.

### Kicker alignment

The supporting kicker below `3 layers` (`.solution-bridge-sub`) should remain centered.
The `3 layers` label (`.layers-index-label`) is also centered.

---

## 5. Hosting / canonical cleanup

Production is GitHub Pages.

The stale Netlify canonical in `founding-terms.html` was corrected to:

`https://gencogno.github.io/cognoscene-waitlist/founding-terms.html`

Do not reintroduce Netlify URLs as production canonicals unless the founder explicitly changes hosting again.

---

## 6. Architecture / file structure changes relevant to this session

- `index.html` remains the main production page.
- `css/layers.css` is the extracted layer-index / layer-specific stylesheet.
- `js/waitlist-form.js` is the dedicated waitlist-form enhancement module.

The founder specifically prefers creating focused CSS/JS files rather than continually stuffing more code into `index.html`.

Avoid rewriting the full `index.html` for a small isolated change when a separate file can safely handle the behavior.

---

## 7. ChatGPT commit log

These commits were made by ChatGPT in this session. Some earlier attempts were intermediate / superseded; use the current files on `main` as the source of truth.

| Commit | Change |
|---|---|
| `706441d` | Fix `founding-terms.html` canonical from Netlify to GitHub Pages |
| `92b7ec5` | Gradient / layer endpoint attempt + kicker centering |
| `2212a31` | Center / 1.25× solution hero and highlight `friction.` in lime |
| `5015cd2` | Add `js/waitlist-form.js` for platform intent + mobile caveat |
| `190f41e` | Add / wire supporting waitlist form styling in `css/layers.css` |
| `1cc5f4f` | Simplify layer gradients into shared right-edge gradient behavior synchronized with card motion |

### Important historical gradient commits

Earlier ChatGPT work included multiple gradient-direction / timing experiments. These are **not** reliable specifications for the current UI. The current files on `main` are the source of truth.

---

## 8. Founder preferences established in this session

- Prefer **small, isolated changes**.
- Reduce conversion friction wherever possible.
- Keep the founding offer pay-later model.
- Mobile should be validated through demand capture before being treated as a committed roadmap promise.
- Platform-interest data is strategically valuable for pre-seed fundraising, so preserve the `platform` field.
- Do not use separate mobile and desktop waitlists.
- Keep lowercase / Buffer-style brand voice.
- User wants a **Next steps** section after substantive recommendations.

---

## 9. Immediate next steps

1. Verify the live waitlist form visually and confirm Formspree receives `platform` correctly.
2. Leave the founding economics unchanged.
3. Revisit the layer gradient only when ready for another visual pass; rebuild from movement geometry instead of layering more keyframes onto the existing system.
4. Once platform-interest data exists, use Chrome / Mobile / Both demand as an input into the mobile product / pre-seed narrative.
