# Showcase videos — feature map

Source folder: `pre-launch/wix - waitlist/for wix showcase/final`

| File | Product feature | Waitlist use |
|------|-----------------|--------------|
| `rationalisation - final.mp4` | **Decision mode / checkout hold** — 48h hard friction overlay when user hits pay | **Hero `demo.mp4`** — primary hook |
| `observer - 1st pop up - final.mp4` | **Soft interception · pulse 1** — first browse-time lookout / shockwave on tracked shop | How it works · step “browse friction” |
| `observer - every 1st and 2nd pop-up - final.mp4` | **Soft interception · pulses 1–2** — lighter nudges before escalation | Optional — shows escalation path |
| `observer - every 3rd pop up - final.mp4` | **Decline overlay** — every 3rd pulse (`disrupt + prudent`) | How it works · “every 3rd pulse” |
| `growth - smol view - final.mp4` | **Growth strip / popup tease** — rationalised count, entry to Growth tab | Founding section · free vs premium tease |
| `growth - full dashboard view - final.mp4` | **Premium dashboard** — prudence streak, purchases rationalised, analytics | Founding section · what $10 unlocks |

## Copy into deploy folder

```text
waitlist-deploy/assets/videos/
  demo.mp4          ← copy from rationalisation - final.mp4
  hold.mp4          ← optional alias
  observer-1.mp4
  observer-3rd.mp4
  growth-smol.mp4
  growth-full.mp4
  poster.jpg        ← optional thumbnail
```

Files are ~9–23 MB each. Compress before deploy if mobile load is slow, or host on YouTube and set `DEMO_VIDEO_URL` in `index.html`.
