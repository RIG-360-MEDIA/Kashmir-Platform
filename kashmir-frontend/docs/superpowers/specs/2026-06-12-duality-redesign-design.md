# Duality Section Redesign — Design Spec

**Date:** 2026-06-12
**Section:** `src/components/sections/Duality.tsx`
**Goal:** Replace the existing 600vh sticky scroll section with a cinematic, scroll-snapped witness experience that leaves users shaken, curious, and with a strong desire to watch the documentary.

---

## 1. Overview

The Duality section presents 7 real witnesses from the Kashmir conflict — each with a portrait and personal testimony. The section is the emotional centrepiece of the documentary website. Its job is not to inform. Its job is to make the user feel the weight of individual lives, leave their story deliberately incomplete, and create the desire to watch the full film.

**Emotional destination:** Shaken. Curious. Wants to watch.

**Design language:** Cinematic Journalism — dark, editorial, documentary. Connected to the existing atmospheric background system throughout the site.

---

## 2. Layout

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  [atmospheric background — visible as thin inset border]         │
│  ┌────────────────────────┬─┬──────────────────────────────┐    │
│  │                        │L│                              │    │
│  │     PORTRAIT (55%)     │O│   TESTIMONY (45%)            │    │
│  │     full height        │C│   translucent dark panel     │    │
│  │     fully bleed        │ │   text lives here            │    │
│  │                        │ │                              │    │
│  └────────────────────────┴─┴──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

- **Section container:** `margin: 16px` on all sides — the atmospheric canvas background is visible as a thin border. The section is a framed panel within the documentary world, not a full-bleed replacement of it.
- **Portrait panel:** 55% width, full section height, `overflow: hidden`. Solid — no transparency. The face must be unobstructed.
- **Line of Control:** 1px vertical divider between panels. Label `LINE OF CONTROL` in 8px Space Mono, rotated 90°, saffron at 35% opacity. Label fades in once during the entry of Witness 1 and persists for the entire section.
- **Testimony panel:** 45% width. `background: rgba(6, 8, 10, 0.88)` — dark enough to read on, transparent enough to feel the atmospheric background behind it.

### Mobile (< 768px)

Lower-third positioning — documentary lower-third text overlay technique.

- Portrait fills full viewport width and height (100vw × 100vh).
- Portrait is positioned so the face occupies the upper 55–60% of the frame.
- A vertical gradient overlay runs from `transparent` at the top to `rgba(6, 8, 10, 0.92)` at the bottom, beginning the fade at 45% height downward.
- Testimony text lives in the lower 40% — entirely within the dark gradient zone. Face and words are simultaneously visible.
- No Line of Control divider (single column layout).
- Editorial numeral sits behind testimony text in the lower zone.
- Progress dots at the very bottom edge.

---

## 3. Section Entry

When the user first scrolls into the Duality section (before Witness 1 activates):

- Section background fades in from the atmospheric canvas.
- Centered at top: `TWO TRUTHS · SAME SKY · SAME SOIL` in 9px Space Mono, saffron, letter-spacing 0.38em, fades in over 600ms and holds for 1.5 seconds, then fades out over 400ms.
- After the fade-out completes, Witness 1 automatically activates (portrait bloom begins). The title does not reappear during the section.

This signals to the user they are entering something different before the first face appears.

---

## 4. Scroll Mechanics

**Architecture:** GSAP-driven snap behaviour — NOT CSS `scroll-snap`. CSS scroll-snap conflicts with Lenis smooth scroll which is active site-wide. Instead, GSAP ScrollTrigger detects scroll direction and velocity; when a threshold is crossed, GSAP programmatically animates to the next/previous witness position.

**Structure:**
- Section total height: `7 × 100vh = 700vh`
- Each witness occupies exactly one 100vh snap point
- Within each witness's 100vh zone: content reveals are **time-based**, not scroll-position-based. Once the user snaps to a witness, the content auto-plays to completion regardless of whether the user continues scrolling.

**Snap threshold:** If the user has scrolled more than 40% of the distance toward the next witness, snap forward. If less than 40%, snap back. GSAP handles the animation.

**Content auto-play timing (per witness, from snap landing):**
- `0ms` — Portrait bloom begins (diagonal light sweep + brightness 12% → 100%)
- `600ms` — Witness label appears: `WITNESS 0N / 07 — ROLE`
- `1200ms` — First testimony line slides in from right
- `1900ms` — Second testimony line
- `2700ms` — Interpretive note (dimmer, smaller)
- `3200ms` — Saffron ember fires from Line of Control
- `3200ms` — Line of Control pulses to crimson, returns to saffron
- After note arrives: section holds. User reads at their own pace. No further animation until they scroll.

**Hash navigation escape:** If a hash navigation event fires (e.g., clicking `#timeline` in the nav) while inside the Duality section, the snap mechanism releases immediately. GSAP scrolls the page to the target section. The Duality section does not trap the user.

**Backward navigation:** Scrolling back through witnesses works identically to forward — GSAP snaps to the previous witness and replays the portrait bloom + testimony auto-reveal for that witness from the beginning. Content does not "remember" a half-revealed state.

---

## 5. Portrait Reveal — Per Witness

**Starting state:** `filter: brightness(0.12) contrast(1.05) saturate(0.15)` — near black, desaturated.

**Revealed state:** `filter: brightness(1.0) contrast(1.05) saturate(1.0)` — full color, slight contrast lift.

**The diagonal light sweep:** A `div` overlay positioned `inset: 0`, with a `linear-gradient` running at 135° from `rgba(255,255,255,0.06)` to `transparent`. On reveal, this overlay animates its `transform: translateX(-110%) translateY(110%)` to `translateX(110%) translateY(-110%)` over the portrait bloom duration. Creates the effect of dawn light sweeping across a mountain face. The overlay is removed after the animation completes.

**Ken Burns during dwell:** After full reveal, portrait `transform: scale(1.0)` transitions to `scale(1.015)` over 12 seconds. Barely perceptible, but the portrait breathes toward the viewer. 12 seconds ensures the zoom never completes before the user finishes reading even the longest testimony. If dwell time exceeds 12s, the portrait simply holds at `scale(1.015)` with no visual jump.

**Portrait vignette breathing:** A `radial-gradient` overlay (dark at edges, transparent at center) on the portrait subtly scales between `scale(1.0)` and `scale(1.04)` on a 6-second CSS animation cycle.

### Emotional timing differentiation

Each witness has their own reveal duration and easing curve matching their emotional register:

| # | Witness | Reveal Duration | Easing | Why |
|---|---------|----------------|--------|-----|
| 1 | Father (The Last Call) | 1400ms | `cubic-bezier(0.1, 0, 0.05, 1)` | Grief is slow |
| 2 | Soldier (What They Told Me) | 900ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Measured realisation |
| 3 | Soldier (We Count Victories) | 1000ms | `cubic-bezier(0.3, 0, 0.2, 1)` | Weighted deliberateness |
| 4 | Widow (The Morning After) | 1600ms | `cubic-bezier(0.08, 0, 0.05, 1)` | Slowest — absence |
| 5 | Officer (Enemy's Face) | 700ms | `cubic-bezier(0.5, 0, 0.18, 1)` | Sharp, tactical precision |
| 6 | Mother (She Asks Every Morning) | 1300ms | `cubic-bezier(0.12, 0, 0.08, 1)` | Quiet, unrelenting |
| 7 | Girl (All We Want Is Ordinary) | 950ms | `cubic-bezier(0.35, 0, 0.2, 1)` | Young, direct, clear |

---

## 6. Testimony Content — All 7 Witnesses

### Witness 1 — Father
**Label:** `WITNESS 01 / 07 — FATHER`
**Line 1:** *"He called once. Said he cannot return.*
**Line 2:** *I still keep the phone close."*
**Note:** This is what it looks like when love has no answer and no end.

### Witness 2 — Soldier
**Label:** `WITNESS 02 / 07 — SOLDIER`
**Line 1:** *"They said Muslims here were forbidden from their faith.*
**Line 2:** *Then I saw who was protecting them."*
**Note:** He came carrying someone else's beliefs. What he found here changed them.

### Witness 3 — Officer
**Label:** `WITNESS 03 / 07 — OFFICER`
**Line 1:** *"Killing a militant is not the hardest part.*
**Line 2:** *Saving the boy before he becomes one — that is the real war."*
**Note:** He chose to count a different thing. That choice cost him something too.

### Witness 4 — Widow
**Label:** `WITNESS 04 / 07 — WIDOW`
**Line 1:** *"He left for duty as he always did.*
**Line 2:** *He did not come back as he always did."*
**Note:** Some losses don't announce themselves. They just quietly take everything.

### Witness 5 — Officer
**Label:** `WITNESS 05 / 07 — OFFICER`
**Line 1:** *"You cannot mark who the enemy is.*
**Line 2:** *Not here. Not where everyone knows everyone."*
**Note:** To protect a place is also to know it — and that knowing is its own burden.

### Witness 6 — Mother
**Label:** `WITNESS 06 / 07 — MOTHER`
**Line 1:** *"He was her favourite child. She doesn't understand why he left.*
**Line 2:** *I have stopped having an answer for her."*
**Note:** A mother's love doesn't know how to stop. Not even when the person is gone.

### Witness 7 — Girl
**Label:** `WITNESS 07 / 07 — GIRL`
**Line 1:** *"In other cities, girls my age worry about exams.*
**Line 2:** *Here, we just want to come home."*
**Note:** To insist on ordinary things — school, a bicycle, coming home — is its own kind of courage.

---

## 7. Testimony Typography and Layout

- **Witness label:** Space Mono, 9px, letter-spacing 0.36em, uppercase, `color: var(--color-saffron)`. Positioned top-right of testimony panel, 8% from top, 9% from right.
- **Quote lines:** Playfair Display italic, `clamp(15px, 2.2vw, 22px)`, line-height 1.6, `color: var(--color-snow)`. Left-aligned, positioned vertically centered in the testimony panel.
- **Note:** DM Sans, 300 weight, 12px, line-height 1.75, `color: rgba(245, 240, 232, 0.32)`. Sits 24px below Line 2.
- **Editorial numeral:** `0N` (e.g., `01`, `07`) in Playfair Display italic, `font-size: clamp(120px, 18vw, 220px)`, `color: rgba(245, 240, 232, 0.045)`, positioned bottom-right of testimony panel, partially clipped. Non-interactive background layer.
- **Testimony breathing:** Once fully revealed, the quote lines and note have a CSS animation: `opacity` oscillates between `0.95` and `1.0` on a 4-second ease-in-out cycle. Invisible as "animation" — text simply feels present.

**Reveal animation per line:** Each line slides in from `translateX(18px)` to `translateX(0)` and `opacity: 0` to `opacity: 1` over 500ms `cubic-bezier(0.25, 0, 0.1, 1)`.

---

## 8. Atmospheric Effects

### Film grain
The existing `Grain.tsx` component is active throughout the site. No additional grain layer needed — the site-level grain covers the Duality section automatically.

### Saffron embers
Canvas-based. A dedicated `<canvas>` element positioned `absolute, inset: 0, z-index: 5, pointer-events: none` sits over the full section container.

Triggered once per witness at the interpretive note moment (`3200ms` after snap landing):
- **Particle count:** 4 particles
- **Size:** 2px filled circles
- **Color:** `rgba(201, 123, 43, alpha)` — starting at `alpha: 0.9`, fading to `0` over lifetime
- **Origin:** Spawned from the Line of Control at a random vertical point between 30% and 70% of section height
- **Drift:** Upward with a slight sinusoidal horizontal curve (amplitude ±8px over lifetime)
- **Lifetime:** 1600ms per particle
- **Stagger:** Each of 4 particles spawns 120ms after the previous

For the exit sequence: 16 particles across the full bottom edge of all 7 portrait positions simultaneously.

### Line of Control
- **Default state:** `rgba(245, 240, 232, 0.07)` — nearly invisible
- **During testimony reveal:** Linearly warms toward `rgba(201, 123, 43, 0.35)` as each line arrives (4 steps across 4 content beats)
- **At note moment:** Single pulse to `rgba(139, 47, 63, 0.7)` (crimson), returns to saffron `rgba(201, 123, 43, 0.35)` over 600ms
- **Between witnesses:** Resets to near-invisible during the documentary cut transition

---

## 9. Transition Between Witnesses — Documentary Cut

When the user scrolls to advance to the next witness:

1. **Dim (400ms):** Current portrait transitions `filter: brightness(1.0) → brightness(0)`. Testimony fades `opacity: 1 → 0`. Line of Control fades to transparent. Duration: 400ms `ease-in`.
2. **Black (200ms):** Pure black. No content visible. This is intentional — the breath between lives.
3. **Bloom (600ms):** New portrait begins diagonal light sweep. Brightness blooms from 0.12 upward. Total bloom follows the witness-specific timing from Section 5.

Testimony text position resets during the 200ms black: lines return to `translateX(18px), opacity: 0` ready to animate in.

Total cut duration before new content begins arriving: **1.2 seconds.**

---

## 10. Exit Sequence

Triggered when the user scrolls past Witness 7.

**Phase 1 — The Gathering (2000ms)**
Screen transitions to pure black (400ms fade). Grain intensifies by 30% (CSS filter on grain layer). All 7 portraits materialise simultaneously across full width as a horizontal strip — each portrait `60px × 80px`, slightly rounded corners (`border-radius: 2px`), dimly lit (`brightness: 0.7`). Saffron embers fire from beneath all 7 portraits simultaneously (16 total particles, same mechanics as per-witness embers).

**Phase 2 — The Fade (2000ms)**
The 7 portraits fade to `opacity: 0.12` — ghosted. Still present, still visible. Not gone.

**Phase 3 — The Statement (1500ms)**
One line appears centered in Space Mono, 9px, letter-spacing 0.42em, saffron:
```
SEVEN VOICES — ONE VALLEY
```

**Phase 4 — The Title (2000ms)**
Statement fades. Documentary title materialises word by word with a horizontal blur clearing on each word (each word starts `filter: blur(8px)`, clears to `blur(0)` over 400ms, staggered 300ms per word):

*Kashmir — Fighting for Peace*

Playfair Display italic, `clamp(28px, 4vw, 52px)`, centered, `color: var(--color-snow)`.

**Phase 5 — The Invitation (1500ms)**
Title settles. CTA button fades in below it — 1200ms delay after title completes:

```
[ Watch the Film ]
```

- Border: `1px solid rgba(201, 123, 43, 0.4)`
- Background: `transparent`
- Ambient glow: `box-shadow: 0 0 24px rgba(201, 123, 43, 0.08), 0 0 48px rgba(201, 123, 43, 0.04)`
- Font: Space Mono, 9px, letter-spacing 0.42em, uppercase, `color: var(--color-saffron)`
- Hover: border brightens to `rgba(201, 123, 43, 0.85)`, glow deepens to `box-shadow: 0 0 32px rgba(201, 123, 43, 0.18)`
- Navigation destination: `CONFIG.dualityCtaHref` (configurable, defaults to `#watch`)

Total exit duration: approximately **9 seconds** of auto-play.

---

## 11. Progress Indicator

7 dots positioned below the testimony panel (desktop) or bottom edge (mobile).

- Inactive dots: `4px × 4px`, `border-radius: 50%`, `background: rgba(245, 240, 232, 0.12)`
- Past witnesses: `background: rgba(245, 240, 232, 0.28)`
- Active witness: `background: var(--color-saffron)`, `transform: scale(1.5)`
- Transitions: 400ms ease
- Not interactive — display only. Scroll handles navigation.

---

## 12. Assets

**Portrait photos:** Located in `The People` folder. Must be copied to `kashmir-frontend/public/people/` during implementation. 12 photos available; 7 will be used.

**Photo-to-witness matching** is an implementation-time decision. During implementation, review all 12 photos and assign each witness a photo based on approximate match to their role and emotional register. This cannot be decided in the spec without viewing the photos.

**Naming convention:** `witness-01.jpg` through `witness-07.jpg` in `public/people/`.

---

## 13. Config Values (no hardcoding)

The following values must be sourced from `CONFIG` in `src/lib/config.ts`:

```typescript
duality: {
  enabled: true,
  ctaHref: '#watch',          // destination for Watch the Film button
  ctaLabel: 'Watch the Film', // button text
}
```

---

## 14. What This Replaces

The existing `Duality.tsx` is **completely replaced**. No code is preserved. The existing implementation uses:
- 600vh sticky wrapper causing hash navigation blocking for all subsequent sections
- Placeholder images from `CONFIG.heroImages` (not real portrait photos)
- Scroll-scrubbed GSAP animations (content tied to exact scroll position)
- No interactive elements

All of this is discarded.

---

## 15. Technical Constraints

- **No CSS `scroll-snap`** — conflicts with Lenis smooth scroll. Use GSAP-driven programmatic snap.
- **No WebGL or Three.js** — saffron embers are Canvas 2D only.
- **No autoplay audio** — section is silent.
- **`prefers-reduced-motion`:** If set, stop all CSS animation cycles (breathing, Ken Burns, ember canvas). Portrait still blooms on snap but instantly (0ms duration). Diagonal light sweep skipped.
- **Canvas resize:** The ember canvas `width` and `height` attributes must match the section container's pixel dimensions. Attach a `ResizeObserver` to the section container and update canvas dimensions on resize. Particle coordinates are stored as percentages and converted to pixels at paint time.
- **Mobile portrait orientation:** On mobile, if the device is in landscape orientation, fall back to the desktop split layout (portrait left, testimony right) since sufficient width is available.

---

## 16. Z-Index

Consistent with the site-wide z-index architecture:

| Layer | Z-index |
|-------|---------|
| Atmospheric canvas (site bg) | 0 |
| Duality section container | 1 |
| Portrait panel | 1 |
| Testimony panel | 1 |
| Line of Control | 3 |
| Ember canvas | 5 |
| Testimony text | 6 |
| Progress dots | 7 |
| Diagonal light sweep overlay | 8 (removed after animation) |
| Site nav | 100 |
| Grain layer | 9994 |
| Cursor | 9995–9999 |
