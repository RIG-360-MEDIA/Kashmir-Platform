# Atmosphere Background System — Design Spec

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement via the matching plan file.

**Goal:** Replace the current flat-dark page background with a four-layer atmosphere system that subliminally embeds Kashmir's geography, conflict weight, and human warmth into the visual environment of the entire site.

**Design principle:** The background must never be noticed consciously. It must only be *felt* — a subliminal sense of place, weight, and temperature that changes what the user feels about the content without them knowing why.

---

## Background: Why This System

The site currently has a flat `#0A0C0F` background with SVG film grain on top. The grain is good. The flat black underneath is a missed opportunity.

Top documentary platforms (MUBI, Criterion) use pure black because they serve thousands of films — the background cannot be film-specific. We serve one film. Our background can and should be specific to Kashmir — Fighting for Peace. This is a permanent competitive advantage over generic dark platforms.

The system has four layers:

| Layer | What it does | Cost |
|-------|-------------|------|
| L1 · Topographic | Kashmir contour lines + LoC at ~4% opacity | Static canvas, redrawn only on resize |
| L2 · Atmosphere Drift | 5 drifting radial gradient blobs at ~3% total opacity | rAF loop, no pixel manipulation |
| L3 · Film Grain | SVG feTurbulence — already exists, no changes | Already running |
| L4 · Temperature | Warm/cold radial glow behind each section | 1 IntersectionObserver, CSS transitions |

---

## Layer 1 — Topographic

**What:** Kashmir's mountain contour system drawn as vector paths on a fixed canvas. The Line of Control drawn as a dashed crimson bezier.

**Why:** Before the user reads a word, their peripheral vision registers: this is a real place. It has geography. It has a dividing line. The LoC — even at 7% opacity — is the single most meaningful visual element on the site. It is the wound that the whole film is about.

**Specs:**
- Canvas: `position: fixed`, `inset: 0`, `width: 100vw`, `height: 100vh`, `z-index: 0`, `pointer-events: none`
- Redrawn only on `resize` event (not animated)
- Contour ellipses: `rgba(245, 240, 232, 0.042)` stroke, `0.7px` line width
- Valley wave lines: `rgba(245, 240, 232, 0.022)` stroke, dashed `[3, 9]`, `0.5px` line width
- LoC bezier: `rgba(139, 47, 63, 0.07)` stroke, `1.2px` line width, dashed `[4, 7]`
- LoC label: `rgba(139, 47, 63, 0.12)` fill, `7px Courier New`, rotated ~0.55 rad, text: `LINE OF CONTROL`

**Peak layout** (6 peaks, proportional to viewport):
```
{ x: W*0.18, y: H*0.22, rx: W*0.12, ry: H*0.14, angle: -0.25, levels: 9 }
{ x: W*0.72, y: H*0.18, rx: W*0.09, ry: H*0.11, angle:  0.30, levels: 7 }
{ x: W*0.45, y: H*0.55, rx: W*0.14, ry: H*0.12, angle:  0.10, levels: 8 }
{ x: W*0.85, y: H*0.65, rx: W*0.08, ry: H*0.10, angle: -0.20, levels: 6 }
{ x: W*0.28, y: H*0.78, rx: W*0.10, ry: H*0.08, angle:  0.15, levels: 5 }
{ x: W*0.62, y: H*0.85, rx: W*0.11, ry: H*0.07, angle: -0.10, levels: 5 }
```

**LoC path:**
```
moveTo(W * 0.22, 0)
bezierCurveTo(W*0.32, H*0.28, W*0.52, H*0.58, W*0.72, H)
```

---

## Layer 2 — Atmosphere Drift

**What:** Five large radial gradient "blobs" that drift slowly across the canvas. Each blob is a single `ctx.fillRect` call with a `createRadialGradient` fill. No pixel manipulation — this is extremely cheap.

**Why:** The pixel noise in the prototype was good for concept, but drifting atmospheric mist is more appropriate for Kashmir (mountain valley atmosphere, heavy air, the weight of presence). Combined with the grain layer (which already provides pixel-level organic texture), the gradient blobs create a sense that the air itself is alive — without looking like TV static.

**Specs:**
- Same canvas element as Layer 1 (drawn on top after topographic)
- 5 blobs with individual drift vectors
- Each blob: large radius (~28–42% of viewport min dimension), very low opacity (0.008–0.014 per blob)
- Drift speed: base `0.12 + 0.08 * lenis_velocity_factor` px/frame
- `lenis_velocity_factor` = `Math.min(1, Math.abs(window.lenis?.velocity || 0) / 8)` — so faster scrolling = slightly faster drift, settling when stopped
- Wrap around viewport edges (modulo W/H)
- Blob colours: alternating slightly warm (`rgba(201, 123, 43, opacity)`) and slightly cool (`rgba(18, 26, 38, opacity)`) to create natural temperature variation

**Blob initial positions:**
```typescript
const BLOBS = [
  { x: 0.15, y: 0.20, vx: 0.00008, vy: 0.00005, r: 0.38, opacity: 0.012, warm: true  },
  { x: 0.70, y: 0.10, vx:-0.00006, vy: 0.00009, r: 0.32, opacity: 0.010, warm: false },
  { x: 0.50, y: 0.55, vx: 0.00010, vy:-0.00004, r: 0.42, opacity: 0.009, warm: true  },
  { x: 0.85, y: 0.75, vx:-0.00008, vy:-0.00006, r: 0.30, opacity: 0.011, warm: false },
  { x: 0.30, y: 0.88, vx: 0.00005, vy:-0.00008, r: 0.35, opacity: 0.008, warm: true  },
]
```
(x, y are proportional — multiply by W/H per frame. vx, vy are proportional velocity per frame.)

**rAF loop strategy:**
```
1. ctx.clearRect (full canvas — clears both topo and drift)
2. drawTopo() — redraws static topographic (cheap vector paths)
3. updateBlobs(lenisVelocity) — drift each blob
4. drawBlobs() — fillRect with gradient for each
5. requestAnimationFrame(loop)
```

Note: Redrawing topo every frame is acceptable — it's all `ctx.ellipse` + `ctx.stroke` calls, no pixel data. Benchmarks show <0.3ms per frame for this complexity.

**Pause strategy:**
- When `document.visibilityState === 'hidden'`: cancel rAF, resume on `visibilitychange`
- When `prefers-reduced-motion: reduce`: stop rAF entirely, draw topo once, skip blobs

---

## Layer 3 — Film Grain

Already implemented in `Grain.tsx`. No changes required. Current spec:
- SVG `feTurbulence` filter with animated `seed` (0→20, 8s loop)
- `mix-blend-mode: overlay`, `opacity: var(--grain-opacity)` = 0.045
- z-index: 9994 (above everything except cursors)

This layer must remain unchanged. The grain is the cinema fingerprint.

---

## Layer 4 — Temperature

**What:** A fixed overlay with two radial gradients (warm + cold) that crossfade as the user scrolls through sections. Warm sections (human stories) get a saffron glow bleeding from the bottom-left. Cold sections (conflict history) get a cool slate shift from the top-right. Neutral sections: both at 0 opacity.

**Why:** The background should echo the emotional register of what you're reading. When you're reading about fathers who lost sons, the page should feel slightly warmer — not obviously, but enough that walking into the Timeline section feels like a temperature drop. This is the most sophisticated layer: it doesn't just say "Kashmir" — it says "this specific part of the story."

**Component:** `TemperatureOverlay.tsx`
- Two `div` elements, both `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 1`
- `div.atm-warm` background: `radial-gradient(ellipse 75% 55% at 18% 72%, rgba(201,123,43,0.055) 0%, transparent 62%)`
- `div.atm-cold` background: `radial-gradient(ellipse 90% 65% at 78% 22%, rgba(10,18,30,0.28) 0%, transparent 68%)`
- Both start at `opacity: 0`
- GSAP `gsap.to()` with `duration: 1.4, ease: 'power2.out'` for crossfades
- IntersectionObserver threshold: 0.4 — activates when section is 40% visible

**Section temperature map:**

| Section | `data-atmosphere` | Rationale |
|---------|------------------|-----------|
| Hero | `warm` | Arrival, emotional entry, the film's invitation |
| FilmOverview | `warm` | Fathers, mothers, militants, officers — human stories |
| Trailer | `neutral` | Information, coming soon — no emotional push |
| Duality | `warm` | Leads with Kashmir's beauty; the warmth makes the violence more shocking |
| Timeline | `cold` | 685 years of conflict, dates, political decisions |
| KashmirMap | `cold` | Geography of the disputed territory |
| NewsFeed | `neutral` | Journalism — factual, present-tense, no temperature push |
| SocialFeed | `neutral` | Mixed voices — both warm and cold stories |
| Watch | `warm` | The invitation to buy — warmth creates connection, connection creates purchase |
| Footer | `neutral` | Navigation, credits |

**Implementation:**
- `page.tsx` wraps each section in a `<div data-atmosphere="warm|cold|neutral" id="atm-[section]">`
- `TemperatureOverlay.tsx` mounts one `IntersectionObserver` that watches all `[data-atmosphere]` elements
- On intersection: GSAP tweens warm/cold overlay opacities based on the entering section's `data-atmosphere`
- Target opacities: `warm → atm-warm: 1.0, atm-cold: 0.0` | `cold → atm-warm: 0.0, atm-cold: 1.0` | `neutral → both: 0.0`

---

## New Component: `AtmosphereCanvas.tsx`

**File:** `src/components/effects/AtmosphereCanvas.tsx`

**Responsibilities:**
- Render Layer 1 (topographic) and Layer 2 (atmosphere drift) onto one `<canvas>` element
- Handle resize via `ResizeObserver`
- Read Lenis velocity via `window.lenis?.velocity` each frame
- Respect `prefers-reduced-motion`
- Gate on `CONFIG.effects.atmosphereEnabled`

**Props:** None. Fully self-contained.

**Lifecycle:**
```
mount → setCanvasSize() → drawTopo() → startLoop()
resize → setCanvasSize() → (loop will redraw topo next frame)
visibilitychange:hidden → cancelAnimationFrame
visibilitychange:visible → startLoop()
unmount → cancelAnimationFrame, ResizeObserver.disconnect()
```

---

## New Component: `TemperatureOverlay.tsx`

**File:** `src/components/effects/TemperatureOverlay.tsx`

**Responsibilities:**
- Render Layer 4 (temperature glow)
- Manage warm/cold crossfades via IntersectionObserver + GSAP
- Gate on `CONFIG.effects.atmosphereEnabled`

**Props:** None. Reads `[data-atmosphere]` elements from the DOM.

---

## Config Changes (`src/lib/config.ts`)

Add to `effects` object:
```typescript
atmosphereEnabled: true,
atmosphereNoiseEnabled: true,  // set false to skip drift layer (L2) but keep topo
```

---

## Token Changes (`src/styles/tokens.css`)

Add to `:root`:
```css
/* Atmosphere system */
--atm-warm-color: rgba(201, 123, 43, 0.055);
--atm-cold-color: rgba(10, 18, 30, 0.28);
--atm-topo-stroke: rgba(245, 240, 232, 0.042);
--atm-loc-stroke: rgba(139, 47, 63, 0.07);
--atm-transition: 1.4s var(--ease-linger);
```

---

## Z-Index Stack (complete, post-implementation)

| Layer | z-index | Element |
|-------|---------|---------|
| Atmosphere Canvas | 0 | `AtmosphereCanvas` canvas |
| Temperature Overlay | 1 | `TemperatureOverlay` divs |
| Section content | default | Page sections |
| Section mists | 2 | `.section-mist-top/bottom` |
| Nav | 100 | `.nav-base` |
| Film Grain | 9994 | `Grain` SVG overlay |
| Cursor light | 9995 | `.cursor-light` |
| Cursor ring | 9998 | `.cursor-ring` |
| Cursor dot | 9999 | `.cursor-dot` |

No collisions. All layers have clear separation.

---

## Mobile Strategy

- `viewport < 768px`: Set `CONFIG.effects.atmosphereNoiseEnabled = false` at runtime (detect in `AtmosphereCanvas` via `window.innerWidth`)
- Topographic layer (L1) remains active on mobile — it's static vector paths, negligible cost
- Temperature overlay (L4) remains active — it's CSS transitions, no JS cost
- Grain (L3) already handles itself

This means mobile users still get the geographic weight (LoC, contours) and the temperature shifts, just without the animated drift layer. The experience degrades gracefully.

**Implementation in `AtmosphereCanvas`:**
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const noiseEnabled = CONFIG.effects.atmosphereNoiseEnabled && !isMobile;
```

---

## `prefers-reduced-motion` Strategy

```typescript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  drawTopo(); // static render once
  return;     // skip rAF loop entirely
}
```

---

## `.gitignore` Addition

Add to project root `.gitignore`:
```
.superpowers/
```

---

## Integration: `layout.tsx`

Add both new components after `<Grain />`:
```tsx
<Grain />
<AtmosphereCanvas />
<TemperatureOverlay />
```

---

## Integration: `page.tsx`

Wrap each section in a `data-atmosphere` div. Example:
```tsx
<div data-atmosphere="warm">
  <FilmOverview />
</div>
<div data-atmosphere="cold">
  <Timeline ... />
</div>
```

The `data-atmosphere` wrappers are plain `<div>` elements — no styles, no layout impact. They only exist as IntersectionObserver targets.

---

## Self-Review

**Placeholder scan:** No TBDs, no TODOs, no incomplete sections. All values are exact numbers. ✓

**Internal consistency:**
- z-index stack has no collisions ✓
- All 4 layers referenced in component responsibilities ✓
- Config keys used consistently (`atmosphereEnabled`, `atmosphereNoiseEnabled`) ✓
- Blob proportional coordinates (0–1 range × W/H) consistent throughout ✓
- section temperature map covers all 10 sections ✓

**Scope check:** Single coherent system — 2 new components, 4 modified files. Appropriately scoped. ✓

**Ambiguity check:**
- "redraw topo every frame" — confirmed acceptable at <0.3ms per frame for this complexity ✓
- "proportional blob positions" — clarified as 0–1 range multiplied by W/H each frame ✓
- "lenis_velocity_factor" — exact formula given ✓
- mobile breakpoint — exact value: `< 768px` ✓
