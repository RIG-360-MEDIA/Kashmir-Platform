# Atmosphere Background System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-layer atmosphere background system — topographic Kashmir contours, drifting gradient atmosphere, film grain (existing), and section-aware temperature shifts.

**Architecture:** `AtmosphereCanvas.tsx` renders L1 (Kashmir topographic + LoC) and L2 (5 drifting radial-gradient blobs) on one fixed canvas. `TemperatureOverlay.tsx` renders two fixed divs (warm saffron glow / cold slate shift) crossfaded by IntersectionObserver as sections scroll into view. Both gated behind `CONFIG.effects.atmosphereEnabled`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Canvas 2D API, GSAP, Lenis (velocity read via `window.lenis`), CSS custom properties.

---

## File Map

| Action | File |
|--------|------|
| Create | `src/components/effects/AtmosphereCanvas.tsx` |
| Create | `src/components/effects/TemperatureOverlay.tsx` |
| Modify | `src/lib/config.ts` — add `atmosphereEnabled`, `atmosphereNoiseEnabled` to `effects` |
| Modify | `src/styles/tokens.css` — add `--atm-*` tokens |
| Modify | `src/app/layout.tsx` — import + render both new components |
| Modify | `src/app/page.tsx` — wrap sections in `data-atmosphere` divs |

---

## Task 1 — Config flags + CSS tokens

**Files:**
- Modify: `src/lib/config.ts`
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Add feature flags to config.ts**

Open `src/lib/config.ts`. Locate the `effects` object. Add two keys:

```typescript
effects: {
  grainEnabled: true,
  cursorEnabled: true,
  cursorLightEnabled: true,
  smoothScrollEnabled: true,
  webglHeroEnabled: false,
  webglDualityEnabled: false,
  atmosphereEnabled: true,
  atmosphereNoiseEnabled: true,
},
```

- [ ] **Step 2: Add atmosphere tokens to tokens.css**

Open `src/styles/tokens.css`. After the existing `--grain-opacity` line, add:

```css
  --atm-warm-color:   rgba(201, 123, 43, 0.055);
  --atm-cold-color:   rgba(10, 18, 30, 0.28);
  --atm-topo-stroke:  rgba(245, 240, 232, 0.042);
  --atm-loc-stroke:   rgba(139, 47, 63, 0.07);
  --atm-transition:   1.4s var(--ease-linger);
```

- [ ] **Step 3: TypeScript check**

```bash
cd "C:\Internship\Project Kashmir\Kashmir-Documentary-v2\kashmir-frontend"
npx tsc --noEmit
```
Expected: no output (zero errors).

- [ ] **Step 4: Commit**

```bash
git add src/lib/config.ts src/styles/tokens.css
git commit -m "feat(atmosphere): add config flags and CSS tokens"
```

---

## Task 2 — AtmosphereCanvas component

**Files:**
- Create: `src/components/effects/AtmosphereCanvas.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/effects/AtmosphereCanvas.tsx` with the full implementation:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { CONFIG } from '@/lib/config';

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  warm: boolean;
}

const BLOB_DEFS: Blob[] = [
  { x: 0.15, y: 0.20, vx:  0.00008, vy:  0.00005, r: 0.38, opacity: 0.012, warm: true  },
  { x: 0.70, y: 0.10, vx: -0.00006, vy:  0.00009, r: 0.32, opacity: 0.010, warm: false },
  { x: 0.50, y: 0.55, vx:  0.00010, vy: -0.00004, r: 0.42, opacity: 0.009, warm: true  },
  { x: 0.85, y: 0.75, vx: -0.00008, vy: -0.00006, r: 0.30, opacity: 0.011, warm: false },
  { x: 0.30, y: 0.88, vx:  0.00005, vy: -0.00008, r: 0.35, opacity: 0.008, warm: true  },
];

function drawTopo(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const peaks = [
    { x: W*0.18, y: H*0.22, rx: W*0.12, ry: H*0.14, angle: -0.25, levels: 9 },
    { x: W*0.72, y: H*0.18, rx: W*0.09, ry: H*0.11, angle:  0.30, levels: 7 },
    { x: W*0.45, y: H*0.55, rx: W*0.14, ry: H*0.12, angle:  0.10, levels: 8 },
    { x: W*0.85, y: H*0.65, rx: W*0.08, ry: H*0.10, angle: -0.20, levels: 6 },
    { x: W*0.28, y: H*0.78, rx: W*0.10, ry: H*0.08, angle:  0.15, levels: 5 },
    { x: W*0.62, y: H*0.85, rx: W*0.11, ry: H*0.07, angle: -0.10, levels: 5 },
  ];

  ctx.strokeStyle = 'rgba(245,240,232,0.042)';
  ctx.lineWidth = 0.7;
  ctx.setLineDash([]);

  peaks.forEach(p => {
    for (let lv = 1; lv <= p.levels; lv++) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const sc = lv * 0.72 + Math.sin(lv * 0.6) * 0.15;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx * sc, p.ry * sc, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  });

  ctx.strokeStyle = 'rgba(245,240,232,0.022)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 9]);
  for (let i = 0; i < 16; i++) {
    const y = (H / 17) * (i + 0.5);
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 3) {
      ctx.lineTo(x, y + Math.sin(x * 0.018 + i * 0.7) * 5);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.strokeStyle = 'rgba(139,47,63,0.07)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 7]);
  ctx.beginPath();
  ctx.moveTo(W * 0.22, 0);
  ctx.bezierCurveTo(W * 0.32, H * 0.28, W * 0.52, H * 0.58, W * 0.72, H);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.save();
  ctx.translate(W * 0.26, H * 0.12);
  ctx.rotate(0.55);
  ctx.fillStyle = 'rgba(139,47,63,0.12)';
  ctx.font = '7px Courier New';
  ctx.fillText('LINE OF CONTROL', 0, 0);
  ctx.restore();
}

export default function AtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const blobsRef  = useRef<Blob[]>(BLOB_DEFS.map(b => ({ ...b })));

  useEffect(() => {
    if (!CONFIG.effects.atmosphereEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile     = window.innerWidth < 768;
    const noiseEnabled = CONFIG.effects.atmosphereNoiseEnabled && !isMobile && !reduceMotion;

    function setSize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawBlobs(W: number, H: number) {
      const lenis = (window as Window & { lenis?: { velocity: number } }).lenis;
      const vel   = Math.abs(lenis?.velocity ?? 0);
      const speedMul = 1 + Math.min(1, vel / 8) * 1.5;

      blobsRef.current.forEach(blob => {
        blob.x += blob.vx * speedMul;
        blob.y += blob.vy * speedMul;
        if (blob.x < -0.5) blob.x = 1.5;
        if (blob.x >  1.5) blob.x = -0.5;
        if (blob.y < -0.5) blob.y = 1.5;
        if (blob.y >  1.5) blob.y = -0.5;

        const cx = blob.x * W;
        const cy = blob.y * H;
        const r  = blob.r * Math.min(W, H);
        const color = blob.warm
          ? `rgba(201,123,43,${blob.opacity})`
          : `rgba(18,26,38,${blob.opacity})`;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });
    }

    function loop() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      drawTopo(ctx, W, H);
      if (noiseEnabled) drawBlobs(W, H);
      rafRef.current = requestAnimationFrame(loop);
    }

    setSize();

    if (reduceMotion) {
      drawTopo(ctx, canvas.width, canvas.height);
      return;
    }

    rafRef.current = requestAnimationFrame(loop);

    const onResize     = () => setSize();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!CONFIG.effects.atmosphereEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        0,
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd "C:\Internship\Project Kashmir\Kashmir-Documentary-v2\kashmir-frontend"
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/effects/AtmosphereCanvas.tsx
git commit -m "feat(atmosphere): add AtmosphereCanvas — topo + drift layers"
```

---

## Task 3 — TemperatureOverlay component

**Files:**
- Create: `src/components/effects/TemperatureOverlay.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/effects/TemperatureOverlay.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '@/lib/config';

type Atmosphere = 'warm' | 'cold' | 'neutral';

export default function TemperatureOverlay() {
  const warmRef = useRef<HTMLDivElement>(null);
  const coldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CONFIG.effects.atmosphereEnabled) return;

    const warm = warmRef.current;
    const cold = coldRef.current;
    if (!warm || !cold) return;

    function crossfade(atm: Atmosphere) {
      if (atm === 'warm') {
        gsap.to(warm, { opacity: 1, duration: 1.4, ease: 'power2.out' });
        gsap.to(cold, { opacity: 0, duration: 1.4, ease: 'power2.out' });
      } else if (atm === 'cold') {
        gsap.to(warm, { opacity: 0, duration: 1.4, ease: 'power2.out' });
        gsap.to(cold, { opacity: 1, duration: 1.4, ease: 'power2.out' });
      } else {
        gsap.to(warm, { opacity: 0, duration: 1.4, ease: 'power2.out' });
        gsap.to(cold, { opacity: 0, duration: 1.4, ease: 'power2.out' });
      }
    }

    const sections = document.querySelectorAll<HTMLElement>('[data-atmosphere]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            crossfade((entry.target as HTMLElement).dataset.atmosphere as Atmosphere);
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!CONFIG.effects.atmosphereEnabled) return null;

  return (
    <>
      <div
        ref={warmRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        1,
          opacity:       0,
          background:    'radial-gradient(ellipse 75% 55% at 18% 72%, rgba(201,123,43,0.055) 0%, transparent 62%)',
        }}
      />
      <div
        ref={coldRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        1,
          opacity:       0,
          background:    'radial-gradient(ellipse 90% 65% at 78% 22%, rgba(10,18,30,0.28) 0%, transparent 68%)',
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/effects/TemperatureOverlay.tsx
git commit -m "feat(atmosphere): add TemperatureOverlay — section-aware warm/cold crossfade"
```

---

## Task 4 — Wire into layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add imports**

In `src/app/layout.tsx`, add after the existing effect imports:

```typescript
import AtmosphereCanvas   from '@/components/effects/AtmosphereCanvas';
import TemperatureOverlay from '@/components/effects/TemperatureOverlay';
```

- [ ] **Step 2: Render in body**

In the `<body>` element, add both components directly after `<Grain />`:

```tsx
<body>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
  <SmoothScroll>
    <Grain />
    <AtmosphereCanvas />
    <TemperatureOverlay />
    <CursorGlow />
    <Nav />
    <main>
      {children}
    </main>
  </SmoothScroll>
</body>
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(atmosphere): mount AtmosphereCanvas and TemperatureOverlay in root layout"
```

---

## Task 5 — Add data-atmosphere to page sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx with atmosphere-wrapped version**

Open `src/app/page.tsx`. Wrap each section in a `<div data-atmosphere="...">`. The wrappers are plain `<div>` — no styles, no layout impact.

Full replacement:

```tsx
'use client';

import { useState, useCallback } from 'react';
import Hero        from '@/components/sections/Hero';
import FilmOverview from '@/components/sections/FilmOverview';
import Trailer     from '@/components/sections/Trailer';
import Duality     from '@/components/sections/Duality';
import Timeline    from '@/components/sections/Timeline';
import KashmirMap  from '@/components/sections/KashmirMap';
import NewsFeed    from '@/components/sections/NewsFeed';
import SocialFeed  from '@/components/sections/SocialFeed';
import Watch       from '@/components/sections/Watch';
import Footer      from '@/components/layout/Footer';

export default function Home() {
  const [mapSelectedEvent, setMapSelectedEvent] = useState<string | null>(null);

  const handleTimelineEventSelect = useCallback((eventId: string) => {
    setMapSelectedEvent(eventId);
    const mapEl = document.getElementById('map');
    if (mapEl) {
      const lenis = (window as Window & { lenis?: { scrollTo: (el: Element, opts: object) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(mapEl, { offset: -72, duration: 1.6 });
      } else {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
      <div data-atmosphere="warm">
        <Hero />
      </div>
      <div data-atmosphere="warm">
        <FilmOverview />
      </div>
      <div data-atmosphere="neutral">
        <Trailer />
      </div>
      <div data-atmosphere="warm">
        <Duality />
      </div>
      <div data-atmosphere="cold">
        <Timeline onEventSelect={handleTimelineEventSelect} />
      </div>
      <div data-atmosphere="cold">
        <KashmirMap selectedEvent={mapSelectedEvent} />
      </div>
      <div data-atmosphere="neutral">
        <NewsFeed />
      </div>
      <div data-atmosphere="neutral">
        <SocialFeed />
      </div>
      <div data-atmosphere="warm">
        <Watch />
      </div>
      <div data-atmosphere="neutral">
        <Footer />
      </div>
    </>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 3: Visual check in browser**

Navigate to `http://localhost:3000`. Verify:
- Background is no longer pure flat black — faint contour lines visible
- LoC dashed crimson line crosses the viewport diagonally
- No console errors related to AtmosphereCanvas or TemperatureOverlay
- Scrolling to Timeline section: background feels cooler/harder
- Scrolling to FilmOverview or Watch: background feels warmer

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(atmosphere): add data-atmosphere section markers to page"
```

---

## Task 6 — Final verification + tag

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 2: Check browser console for errors**

Navigate to `http://localhost:3000`. Open DevTools console. Verify:
- No errors from AtmosphereCanvas or TemperatureOverlay
- No `canvas is null` errors
- Existing errors (backend 8000, Leaflet hot-reload) are unchanged pre-existing issues

- [ ] **Step 3: Scroll test**

Scroll slowly through the full page. Verify:
- Temperature crossfades happen smoothly as sections enter/exit
- Canvas grain + topographic + drift all coexist
- No performance issues (smooth 60fps scroll)

- [ ] **Step 4: Git tag**

```bash
git tag atmosphere-v1
```

---

## Self-Review

**Spec coverage:**
- L1 Topographic: ✓ Task 2 (drawTopo function)
- L2 Atmosphere drift: ✓ Task 2 (drawBlobs, BLOB_DEFS)
- L3 Film grain: ✓ unchanged, already exists
- L4 Temperature: ✓ Task 3 (TemperatureOverlay)
- Config flags: ✓ Task 1
- CSS tokens: ✓ Task 1
- layout.tsx: ✓ Task 4
- page.tsx data-atmosphere: ✓ Task 5
- Mobile disable noise: ✓ Task 2 (isMobile check)
- prefers-reduced-motion: ✓ Task 2 (reduceMotion check)
- z-index stack: ✓ canvas z:0, temp z:1, nav z:100, grain z:9994
- Lenis velocity: ✓ Task 2 (speedMul calculation)
- Blob wrap-around: ✓ Task 2

**Placeholder scan:** None found. All code complete.

**Type consistency:**
- `Blob` interface defined in Task 2, used in `BLOB_DEFS`, `blobsRef`, `drawBlobs` — consistent ✓
- `Atmosphere` type defined in Task 3, used in `crossfade` + observer — consistent ✓
- `CONFIG.effects.atmosphereEnabled` — added in Task 1, read in Tasks 2 + 3 — consistent ✓
- `CONFIG.effects.atmosphereNoiseEnabled` — added in Task 1, read in Task 2 — consistent ✓
