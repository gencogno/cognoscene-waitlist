# Cognoscene Waitlist Launch Plan

**Scope:** founding cohort only · email-only comms · Singapore-first signups.  
**Last updated:** 14 Aug 2026.  
**Full spec (canonical):** `docs/agent-context/waitlist-launch-spec.md` in `gencogno/cognoscene-statics-roadmap`.

---

## Changelog

- 14 Aug 2026 — distilled from statics roadmap `waitlist-launch-spec.md`. Telegram removed; email-only.
- 1 Aug 2026 — original spec authored (Cursor).

---

## 1. Offers (locked for founding cohort)

### Free (everyone at install)

- 1 tracked website
- Full 48h hold + 24h decision window on that site
- Dashboard blocked

### Premium lifetime (waitlist founding only)

- **us$10 · one-time · USD**
- Unlimited tracked sites
- Dashboard unlocked
- Same entitlement flag as premium: `userTier === 'premium'`
- Backend: `plan_type: lifetime` in Supabase (not in extension today)

### Public pricing (post-founder window)

- Defer on Wix until founder window closes
- Direction: s$12/yr geo — **not part of this launch**

---

## 2. Pre-launch blockers (must be green before paid invites)

> Payment architecture: **server allowlist + Stripe Checkout Session** — see `stripe-webhook-spec.md`. Do **not** use a shareable public Payment Link.

| # | Blocker | Owner | Verify |
|---|---------|-------|--------|
| 1 | Stripe one-time us$10 product + Checkout Session via edge fn (not public link) | Daniella | Ineligible email → 403 |
| 2 | Webhook `checkout.session.completed` → `users.tier = premium`, `plan_type = lifetime` | Daniella | Pay → reopen extension → premium |
| 3 | Email match: Stripe email = Chrome Google account | Daniella | Mismatch fails gracefully + manual fix path |
| 4 | Extension `verifySubscription` reads server tier | Daniella | Not stuck on local `free` |
| 5 | Manual override runbook (receipt + email → flip tier) | Founder + Daniella | One test user |
| 6 | Waitlist form live + autoresponder | Founder | Submit test email |

**Do not open founding upsell until rows 1–4 pass in test mode.**

---

## 3. Form (locked)

**Live in:** `index.html` · backend: Formspree (`FORMSPREE_FORM_ID`).

| Field | Required |
|-------|----------|
| Email | Yes |
| Chrome on desktop (y/n) | Yes |

### Autoresponder (on submit)

> you're on the cognoscene waitlist. we'll contact you when your batch opens. founding offer: us$10 once for lifetime premium — details when you get install access. no charge today.

---

## 4. Launch sequence (T-0 → T+14)

### Phase A — Waitlist open (T-0)

- [ ] Form live, autoresponder tested
- [ ] Community post: what cognoscene is + waitlist link
- [ ] Internal tracker sheet ready (see §7)
- [ ] **No install link mass-dropped yet** unless build is QA'd

### Phase B — Batch 1 invite (T+0 to T+3)

**Audience:** first `[20–50]` waitlist emails (or all if <50).

**Email — install**

```
your cognoscene beta slot is open.

install: [LINK]
start free — 1 site, full hold works.

try a real checkout on a site you track, then reply here (or note bugs).
```

- [ ] Send only to people who said Chrome desktop = yes (or warn if no)
- [ ] Log: invited_at, install_confirmed (y/n)

### Phase C — Use free (T+3 to T+7)

- [ ] No payment link in this phase
- [ ] Light check-in email (see §5 message 3)
- [ ] Support: install issues, hold not firing, which sites

**Success signal before upsell:** user completes ≥1 checkout hold OR explicitly asks for 2nd site / dashboard.

### Phase D — Founding upsell (T+5 to T+14, or on wall hit)

**Trigger:** user hits 1-site cap, clicks dashboard, or asks to upgrade.

```
founding member offer (waitlist only):

us$10 · pay once · lifetime premium
→ unlimited tracked sites
→ dashboard unlocked

pay with the same email as in the extension:
open the extension → settings → upgrade to founding member (waitlist only).

reopen extension after pay. if still free, send receipt + email here.

closes [DATE] or at [X] spots left.
```

- [ ] Track: upgrade_sent, paid, unlocked (y/n)

### Phase E — Post-launch window close (T+14 or cap)

- [ ] Disable founding checkout (edge fn / Stripe product) when window closes
- [ ] Site copy: waitlist closed / thank you (or "batch 2 waitlist" if continuing)
- [ ] Email: founding window closed; thank early users
- [ ] Export metrics (§7) → decide batch 2 or public pricing

---

## 5. Email message index

| # | When | Purpose |
|---|------|---------|
| 1 | Signup confirm | Set expectations, mention us$10 later |
| 2 | Batch invite | Install link, free tier |
| 3 | Day 3–5 check-in | Did they hit checkout hold? |
| 4 | Wall / upgrade | Founding upgrade via extension (not raw Stripe link) |
| 5 | Paid but stuck | Email match + manual fix |
| 6 | Day 7 nudge | Soft reminder + link |

Comms channel: **email only** (no Telegram).

### Copy blocks (paste-ready)

**1 · Signup confirm**

```
hey — you're on the cognoscene waitlist.

we're testing a chrome extension that adds a pause before checkout on shopping sites you choose.

founding members (waitlist only): us$10 once · lifetime access. you'll get the install link when your batch opens — no charge today.
```

**4 · Upgrade (wall)**

```
founding member offer (waitlist only):

us$10 · pay once · lifetime premium
→ unlimited tracked sites
→ dashboard unlocked

pay with the same email you use in the extension:
open the extension → settings → upgrade to founding member.

after payment, reopen the extension. if it still says free, send your receipt + email here.

founding window closes [DATE] or at [X] spots — whichever first.
```

---

## 6. When to open batch 2

- Webhook unlock ≥95% without manual fix **and**
- Hold fires on target sites (shein / uniqlo / etc.) **and**
- Founder has NS-capacity for email support

---

## 7. Tracker sheet (columns)

| email | signed_up | batch | invited | installed | 1st_hold | dropped | upgrade_sent | paid | unlocked | notes |
|-------|-----------|-------|---------|-----------|----------|---------|--------------|------|----------|-------|

**Primary beta metrics**

1. Hold → drop rate (among users who triggered hold)
2. Upgrade sent → paid → unlocked (funnel integrity)
3. Bypass / urgente usage (secondary)

---

## 8. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Pay doesn't unlock | Webhook before paid wave; manual flip runbook |
| Email mismatch | Wix + Stripe both say "same email" |
| Lifetime ARPU collapse | Cap spots; never reopen silently |
| Overpromising on Wix | "Pay when batch opens" · "features may change" |
| Support overload | Batch size limit; pin FAQ in autoresponder |

---

## 9. Open decisions (founder fill)

- [ ] Founding cap: `___`
- [ ] Window end date: `___`
- [ ] Batch 1 size: `___`
- [ ] Install delivery: unpacked zip vs private link vs CWS unlisted

---

## 10. Agent / dev notes

- Do not add a second `userTier` value for lifetime in v1 — use `premium` + server `plan_type`.
- The founding checkout edge function is not yet deployed — do not open upsell until it is.
- Formspree form ID is in `index.html` — replace placeholder before going live.
