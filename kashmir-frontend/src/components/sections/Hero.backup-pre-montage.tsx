'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { FILM } from '@/content/film';

// ─── Beauty slideshow images ───────────────────────────────────────────────────
const BEAUTY_IMAGES = [
  '/beauty/kashmir-landscape-01.png',
  '/beauty/kashmir-landscape-04.png',
  '/beauty/kashmir-landscape-07.png',
  '/beauty/kashmir-landscape-10.png',
  '/beauty/kashmir-landscape-13.png',
  '/beauty/kashmir-landscape-16.png',
  '/beauty/kashmir-landscape-19.png',
  '/beauty/kashmir-landscape-22.png',
];

// ─── Montage images ────────────────────────────────────────────────────────────
const MONTAGE_IMAGES = [
  '/montage/montage-01.png',
  '/montage/montage-02.png',
  '/montage/montage-03.png',
  '/montage/montage-04.png',
  '/montage/montage-05.png',
  '/montage/montage-06.png',
  '/montage/montage-07.png',
  '/montage/montage-08.png',
  '/montage/montage-09.png',
  '/montage/montage-10.png',
  '/montage/montage-11.png',
  '/montage/montage-12.png',
  '/montage/montage-13.png',
  '/montage/montage-14.png',
  '/montage/montage-15.png',
  '/montage/montage-16.png',
  '/montage/montage-17.png',
  '/montage/montage-18.png',
  '/montage/montage-19.png',
  '/montage/montage-20.png',
  '/montage/montage-21.png',
  '/montage/montage-22.png',
  '/montage/montage-23.png',
  '/montage/montage-24.png',
  '/montage/montage-25.png',
  '/montage/montage-26.png',
  '/montage/montage-27.png',
  '/montage/montage-28.png',
  '/montage/montage-29.png',
  '/montage/montage-30.png',
  '/montage/montage-31.png',
  '/montage/montage-32.png',
];

// ─── Three-panel text (replace with final copy) ───────────────────────────────
const PANEL_LEFT = {
  label: 'THE GRIEF OF ONE SIDE',
  heading: 'Mothers of the Misguided',
  body: 'They raised sons in a valley that promised them nothing. Boys who were handed a gun and a cause they barely understood. Families who spent decades not knowing whether their child chose a path — or had one forced upon them. Their grief is not celebrated. Their loss is not counted.',
};

const PANEL_CENTER = {
  label: 'THE VALLEY IN BETWEEN',
  heading: 'Kashmir',
  body: 'Dal Lake at dusk. Chinar trees turning gold in October. Saffron fields blooming in Pampore. Houseboats reflected in still water at dawn. A place of extraordinary, heartbreaking beauty — held in an extraordinary, heartbreaking wound.',
};

const PANEL_RIGHT = {
  label: 'THE GRIEF OF THE OTHER',
  heading: 'Fathers of the Fallen',
  body: 'Sons who wore a uniform and believed in something. Who came home draped in a flag their families were told to be proud of. Parents who wake each morning to a photograph that will never age. The state called it duty. They call it loss. Both are true.',
};

type Phase = 'idle' | 'montage' | 'text' | 'post_click';

export default function Hero() {
  // ─── DOM refs ─────────────────────────────────────────────────────────────
  const sectionRef       = useRef<HTMLElement>(null);
  const beautyWrapRef    = useRef<HTMLDivElement>(null);   // mask applied here
  const sceneRef         = useRef<HTMLDivElement>(null);
  const bgLayerRef       = useRef<HTMLDivElement>(null);
  const mistLayerRef     = useRef<HTMLDivElement>(null);
  const topContentRef    = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const creditRef        = useRef<HTMLDivElement>(null);
  const titleRef         = useRef<HTMLDivElement>(null);
  const subtitleRef      = useRef<HTMLDivElement>(null);
  const dividerRef       = useRef<HTMLDivElement>(null);
  const taglineRef       = useRef<HTMLDivElement>(null);
  const ctaGroupRef      = useRef<HTMLDivElement>(null);
  const metaRef          = useRef<HTMLDivElement>(null);
  const watchBtnRef      = useRef<HTMLButtonElement>(null);
  const exploreBtnRef    = useRef<HTMLButtonElement>(null);
  const witnessButtonRef = useRef<HTMLButtonElement>(null);
  const witnessDotRef    = useRef<HTMLSpanElement>(null);
  const textOverlayRef   = useRef<HTMLDivElement>(null);

  // ─── Motion refs ──────────────────────────────────────────────────────────
  const mouse           = useRef({ x: 0, y: 0 });
  const tilt            = useRef({ x: 0, y: 0 });
  const raf             = useRef<number>(0);
  const proximityRef    = useRef(0);
  const maskRadiusRef   = useRef(3000);   // target mask radius (px)
  const currMaskRef     = useRef(3000);   // lerped mask radius
  const minMaskRef      = useRef(320);    // minimum radius — beauty always visible at this size
  const glowRef         = useRef(0);
  const btnYPctRef      = useRef(50);   // button is now at center (50%)
  const proxRef         = useRef(0);
  const beautyOpRef     = useRef(1);    // lerped opacity for beauty layer
  const borderAuraRef   = useRef<SVGCircleElement>(null);
  const borderRingRef   = useRef<SVGCircleElement>(null);
  const borderShimRef   = useRef<SVGCircleElement>(null);
  const borderOrbitRef  = useRef<SVGCircleElement>(null);
  const fireCanvasRef   = useRef<HTMLCanvasElement>(null);
  const fireParticles   = useRef<{x:number;y:number;vx:number;vy:number;life:number;size:number;hue:number}[]>([]);
  const fireRingR       = useRef(36);
  const fireBurstRef    = useRef<HTMLDivElement>(null);
  const leftGlowRef     = useRef<HTMLDivElement>(null);
  const rightGlowRef    = useRef<HTMLDivElement>(null);
  const ringCircleRef   = useRef<SVGCircleElement>(null);

  // ─── React state ──────────────────────────────────────────────────────────
  const [phase, setPhase]               = useState<Phase>('idle');
  const [slideshowIdx, setSlideshowIdx] = useState(0);
  const [montageIdx, setMontageIdx]     = useState(0);
  const [slowIdx, setSlowIdx]           = useState(0);

  const phaseRef      = useRef<Phase>('idle');
  phaseRef.current    = phase;
  const hasClickedRef = useRef(false);
  const textTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Scroll helper ────────────────────────────────────────────────────────
  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Beauty slideshow ─────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setSlideshowIdx(i => (i + 1) % BEAUTY_IMAGES.length), 4500);
    return () => clearInterval(id);
  }, []);

  // ─── Minimum mask radius (17% viewport width) — smaller = more edge space ──
  useEffect(() => {
    const update = () => {
      minMaskRef.current = Math.max(150, window.innerWidth * 0.17);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // ─── Entrance GSAP timeline ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('split-type').then(({ default: SplitType }) => {
      const titleEl = titleRef.current;
      if (!titleEl) return;

      const split = new SplitType(titleEl, { types: 'chars' });
      const chars = split.chars ?? [];

      gsap.set([creditRef.current, subtitleRef.current], { opacity: 0, y: -14 });
      gsap.set(chars, { opacity: 0, y: 40, rotationX: -40, transformOrigin: '50% 50% -20px' });
      gsap.set(bgLayerRef.current, { opacity: 0, scale: 1.08 });
      gsap.set(
        [dividerRef.current, taglineRef.current, ctaGroupRef.current,
         metaRef.current, witnessButtonRef.current],
        { opacity: 0, y: 18 },
      );

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .to(bgLayerRef.current,       { opacity: 1, scale: 1, duration: 2.0, ease: 'power2.out' }, 0.4)
        .to(creditRef.current,        { opacity: 1, y: 0, duration: 0.7 }, 1.0)
        .to(chars, { opacity: 1, y: 0, rotationX: 0, stagger: 0.055, duration: 0.9, ease: 'power4.out' }, 1.45)
        .to(subtitleRef.current,      { opacity: 1, y: 0, duration: 0.65 }, 2.05)
        .to(dividerRef.current,       { opacity: 0.6, y: 0, duration: 0.5 }, 2.5)
        .to(taglineRef.current,       { opacity: 1, y: 0, duration: 0.7 }, 2.65)
        .to(ctaGroupRef.current,      { opacity: 1, y: 0, duration: 0.6 }, 2.95)
        .to(metaRef.current,          { opacity: 0.4, y: 0, duration: 0.5 }, 3.25)
        .to(witnessButtonRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 3.55);

      tl.add(() => {
        gsap.to(bgLayerRef.current, {
          scale: 1.025, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }, 3.0);

      return () => { tl.kill(); split.revert(); };
    });
  }, []);

  // ─── Track button Y % for mask centering ──────────────────────────────────
  useEffect(() => {
    const update = () => {
      const btn = witnessButtonRef.current;
      const sec = sectionRef.current;
      if (!btn || !sec) return;
      const sR = sec.getBoundingClientRect();
      const bR = btn.getBoundingClientRect();
      btnYPctRef.current = ((bR.top + bR.height / 2 - sR.top) / sR.height) * 100;
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // ─── Main RAF: tilt + parallax + mask + glow ──────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;

      const btn = witnessButtonRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ratio = Math.max(0, 1 - dist / 300);
        proximityRef.current = ratio;
        proxRef.current = ratio;
        // Minimum radius enforced — beauty always visible at center
        const MIN = minMaskRef.current;
        maskRadiusRef.current = 3000 - ratio * (3000 - MIN);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      const p = phaseRef.current;
      const interactive = p === 'idle' || p === 'post_click';

      // Tilt lerp
      tilt.current.x += (mouse.current.y * -3 - tilt.current.x) * 0.06;
      tilt.current.y += (mouse.current.x *  4 - tilt.current.y) * 0.06;

      // Scene tilt (only when interactive)
      if (interactive && sceneRef.current) {
        sceneRef.current.style.transform =
          `perspective(1200px) rotateX(${tilt.current.x}deg) rotateY(${tilt.current.y}deg)`;
      }

      // Depth parallax
      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform =
          `translate(${mouse.current.x * -14}px, ${mouse.current.y * -10}px)`;
      }
      if (mistLayerRef.current) {
        mistLayerRef.current.style.transform =
          `translate(${mouse.current.x * 6}px, ${mouse.current.y * 4}px)`;
      }
      if (interactive) {
        const tx = `translate(${mouse.current.x * 8}px, ${mouse.current.y * 5}px)`;
        if (topContentRef.current)    topContentRef.current.style.transform    = tx;
        if (bottomContentRef.current) bottomContentRef.current.style.transform = tx;
      }

      // Mask radius lerp + apply
      currMaskRef.current += (maskRadiusRef.current - currMaskRef.current) * 0.09;
      const r   = currMaskRef.current;
      const yPc = btnYPctRef.current;

      if (beautyWrapRef.current) {
        if (r < 2990) {
          // Large feather (90px) makes the circle edge soft and organic — not a hard cutout
          const feather = Math.min(90, r * 0.25);
          const inner   = Math.max(0, r - feather);
          const grad    = `radial-gradient(circle ${r}px at 50% ${yPc}%, black 0, black ${inner}px, transparent ${r}px)`;
          beautyWrapRef.current.style.maskImage = grad;
          beautyWrapRef.current.style.webkitMaskImage = grad;
        } else {
          beautyWrapRef.current.style.maskImage = '';
          beautyWrapRef.current.style.webkitMaskImage = '';
        }
      }

      // Beauty layer opacity — semi-transparent when cursor is near button (circle converged)
      // Restores to fully opaque quickly when cursor leaves, fades slowly when approaching
      {
        const targetOp = proxRef.current > 0.15 ? 0.5 : 1;
        const speed = targetOp > beautyOpRef.current ? 0.14 : 0.07;
        beautyOpRef.current += (targetOp - beautyOpRef.current) * speed;
        if (beautyWrapRef.current) {
          beautyWrapRef.current.style.opacity = String(beautyOpRef.current);
        }
      }

      // Fade main content as cursor approaches button (only pre-click)
      if (!hasClickedRef.current) {
        const contentOpacity = String(Math.max(0, 1 - proximityRef.current * 1.1));
        if (topContentRef.current)    topContentRef.current.style.opacity    = contentOpacity;
        if (bottomContentRef.current) bottomContentRef.current.style.opacity = contentOpacity;
      }

      // Bomb countdown — only active in idle phase (pre-click)
      const now  = performance.now();
      const prox = proxRef.current;
      glowRef.current += (proximityRef.current - glowRef.current) * 0.1;
      const g = glowRef.current;

      // Tick frequency: slow pulse at rest → faster at full proximity
      // prox=0 → ~1.0s period  |  prox=0.5 → ~0.7s  |  prox=1.0 → ~0.4s
      const tickFreq = 0.0063 + prox * prox * 0.0105;
      const beat     = (Math.sin(now * tickFreq) + 1) * 0.5;

      // Danger colour: gold (safe) → warm orange at close range only
      const dangerG = Math.max(80,  Math.round(200 - prox * prox * 120));
      const dangerB = Math.max(0,   Math.round(55  - prox * prox * 50));

      if (p === 'idle') {
        if (witnessButtonRef.current) {
          const btnScale = 1 + g * 0.18;

          // Tremor only kicks in very close — subtle, not violent
          const tremor = prox > 0.68 ? ((prox - 0.68) / 0.32) * beat * 1.4 : 0;
          const tx = tremor * (Math.random() * 2 - 1);
          const ty = tremor * (Math.random() * 2 - 1);
          witnessButtonRef.current.style.transform =
            `translate(calc(-50% + ${tx.toFixed(1)}px), calc(-50% + ${ty.toFixed(1)}px)) scale(${btnScale})`;

          const glowIntensity = 0.10 + g * 0.28 + beat * 0.16 * prox;
          witnessButtonRef.current.style.boxShadow =
            `0 0 ${10 + g*22 + beat*prox*10}px ${4+g*12+beat*prox*5}px rgba(255,${dangerG},${dangerB},${glowIntensity}), 0 0 ${18+g*32}px rgba(255,${dangerG},${dangerB},${0.06+g*0.14})`;
          witnessButtonRef.current.style.borderColor =
            `rgba(255,${dangerG},${dangerB},${0.55 + prox * 0.45})`;

          // Sonar rings speed up gradually: 2.4s (far) → 0.6s (on button)
          witnessButtonRef.current.querySelectorAll('.sonar-ring').forEach(el => {
            const dur = Math.max(0.6, 2.4 - prox * prox * 1.8);
            (el as HTMLElement).style.animationDuration = `${dur.toFixed(2)}s`;
            (el as HTMLElement).style.borderColor = `rgba(255,${dangerG},${dangerB},0.55)`;
          });
        }

        if (witnessDotRef.current) {
          const dotScale = (1 + g * 0.38) * (1 + beat * (0.35 - g * 0.12));
          const glowPx   = (8 + g * 18) * (0.6 + beat * 0.7);
          witnessDotRef.current.style.boxShadow =
            `0 0 ${glowPx}px ${1 + beat * 4}px rgba(255,${dangerG},${dangerB},${0.55 + beat * 0.3}), 0 0 ${glowPx * 1.6}px rgba(255,${dangerG},0,${0.12 + beat * 0.18 * prox})`;
          witnessDotRef.current.style.transform  = `translate(-50%, -50%) scale(${dotScale})`;
          witnessDotRef.current.style.background = `rgba(255,${dangerG},${dangerB},1)`;
        }
      } else {
        // Post-click: reset button to clean base state, no dynamic effects
        if (witnessButtonRef.current) {
          witnessButtonRef.current.style.transform   = 'translate(-50%, -50%)';
          witnessButtonRef.current.style.boxShadow   = '';
          witnessButtonRef.current.style.borderColor = '';
          witnessButtonRef.current.querySelectorAll('.sonar-ring').forEach(el => {
            (el as HTMLElement).style.animationDuration = '';
            (el as HTMLElement).style.borderColor       = '';
          });
        }
        if (witnessDotRef.current) {
          witnessDotRef.current.style.transform  = 'translate(-50%, -50%)';
          witnessDotRef.current.style.boxShadow  = '';
          witnessDotRef.current.style.background = '';
        }
      }

      // Real fire sparks — canvas draws ZERO arcs. Button CSS border IS the ring.
      // Spawn rate accelerates quadratically — near-frantic at full proximity.
      {
        const canvas = fireCanvasRef.current;
        const ctx    = canvas?.getContext('2d');
        if (canvas && ctx) {
          const cx    = canvas.width  / 2;   // 110
          const cy    = canvas.height / 2;   // 110
          // Button is 56px wide, scaled by glowRef. Track actual border radius.
          const btnR  = 28 * (1 + g * 0.32);
          const active = (p === 'idle') && prox > 0.25;

          // Quadratic burst rate: sparse at distance → near-continuous at button
          // prox=0.3 → ~12% chance/frame | prox=0.7 → ~44% | prox=1.0 → ~92%
          if (active && fireParticles.current.length < 110) {
            if (Math.random() < prox * prox * 0.92) {
              const burstN = 2 + Math.floor(Math.random() * 5 * prox);
              for (let i = 0; i < burstN; i++) {
                const angle  = Math.random() * Math.PI * 2;
                const speed  = 1.4 + Math.random() * 1.6 * prox;
                // Slight angular spread so sparks fan out, not just radially
                const eject  = angle + (Math.random() - 0.5) * 0.5;
                fireParticles.current.push({
                  x:    cx + Math.cos(angle) * btnR,
                  y:    cy + Math.sin(angle) * btnR,
                  vx:   Math.cos(eject) * speed,
                  vy:   Math.sin(eject) * speed,
                  life: 1,
                  size: 0.5 + Math.random() * 1.6,   // tiny: 0.5–2.1px realistic sparks
                  hue:  0,                             // unused — colour computed from life
                });
              }
            }
          }

          // Physics: gravity pulls sparks into arcs, light friction, fast fade
          const pts = fireParticles.current;
          for (let i = pts.length - 1; i >= 0; i--) {
            const pt = pts[i];
            pt.vy   += 0.055;   // gravity → sparks arc downward like real embers
            pt.x    += pt.vx;
            pt.y    += pt.vy;
            pt.vx   *= 0.980;
            pt.vy   *= 0.980;
            pt.life -= 0.052;   // fast decay → ~19 frames (~0.32s) max life
            if (pt.life <= 0) pts.splice(i, 1);
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw sparks — colour shifts white-yellow → orange as they cool and die
          pts.forEach(pt => {
            const l  = pt.life;
            const a  = l * Math.min(1, prox * 1.5);
            if (a < 0.02) return;

            // Colour: born white-gold, cools to orange, fades out
            const rC = 255;
            const gC = l > 0.55 ? 255 : Math.round(255 - (0.55 - l) / 0.55 * 155);
            const bC = l > 0.55 ? 200 : Math.round(200 - (0.55 - l) / 0.55 * 195);

            if (pt.size > 1.2) {
              // Slightly larger sparks get a tiny soft glow (not bokeh — just a 2px halo)
              const gr = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size * 2.8);
              gr.addColorStop(0,   `rgba(${rC},${gC},${bC},${a})`);
              gr.addColorStop(0.5, `rgba(${rC},${Math.max(0, gC - 60)},0,${a * 0.4})`);
              gr.addColorStop(1,   `rgba(${rC},60,0,0)`);
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, pt.size * 2.8, 0, Math.PI * 2);
              ctx.fillStyle = gr;
              ctx.fill();
            } else {
              // Tiny sparks — 1–2px bright pixel, no gradient overhead
              ctx.fillStyle = `rgba(${rC},${gC},${bC},${a})`;
              ctx.fillRect(pt.x - pt.size * 0.5, pt.y - pt.size * 0.5, pt.size, pt.size);
            }
          });
        }
      }

      // Beauty circle border ring — thin gold rim that traces the mask boundary
      {
        if (ringCircleRef.current && sectionRef.current) {
          const sec = sectionRef.current;
          const cx  = sec.clientWidth  / 2;
          const cy  = (btnYPctRef.current / 100) * sec.clientHeight;
          const r   = currMaskRef.current;

          // Fade in only once circle has converged enough to be geometrically visible
          const ringProgress = Math.max(0, Math.min(1, (2600 - r) / (2600 - minMaskRef.current)));
          const ringBase     = ringProgress * ringProgress;
          const ringPulse    = 1 - 0.18 * (1 - beat) * ringProgress;
          const ringOpacity  = (p === 'idle' || p === 'post_click') ? Math.min(0.80, ringBase * ringPulse) : 0;

          ringCircleRef.current.setAttribute('r',  String(Math.max(0, r)));
          ringCircleRef.current.setAttribute('cx', String(cx));
          ringCircleRef.current.setAttribute('cy', String(cy));
          ringCircleRef.current.style.opacity = String(ringOpacity);
        }
      }

      // Side-edge atmospheric glow — saffron amber walls that breathe with the countdown
      // Driven by how far the beauty mask has converged, not raw proximity,
      // so it appears exactly when the void becomes visible on the sides.
      {
        const maskProgress = Math.max(0, Math.min(1, (2800 - currMaskRef.current) / (2800 - minMaskRef.current)));
        // Quadratic start: barely perceptible at first convergence, builds quickly near button
        const edgeBase    = maskProgress * maskProgress;
        // Breathes with the countdown beat — 20% swing, stronger the more converged
        const edgePulse   = 1 - 0.20 * (1 - beat) * maskProgress;
        const edgeOpacity = p === 'idle' ? Math.min(0.92, edgeBase * edgePulse) : 0;

        if (leftGlowRef.current)  leftGlowRef.current.style.opacity  = String(edgeOpacity);
        if (rightGlowRef.current) rightGlowRef.current.style.opacity = String(edgeOpacity);
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // ─── Magnetic CTA buttons ─────────────────────────────────────────────────
  useEffect(() => {
    const RADIUS = 90, STRENGTH = 0.38;

    const applyMagnet = (ref: React.RefObject<HTMLButtonElement | null>) => {
      const btn = ref.current;
      if (!btn) return () => {};
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * STRENGTH;
          gsap.to(btn, { x: dx * pull * 1.6, y: dy * pull * 1.2, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        } else {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        }
      };
      const onLeave = () =>
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      window.addEventListener('mousemove', onMove, { passive: true });
      btn.addEventListener('mouseleave', onLeave);
      return () => {
        window.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      };
    };

    const cleanA = applyMagnet(watchBtnRef);
    const cleanB = applyMagnet(exploreBtnRef);
    return () => { cleanA(); cleanB(); };
  }, []);

  // ─── Witness button click ──────────────────────────────────────────────────
  const handleWitnessClick = useCallback(() => {
    if (hasClickedRef.current) return;
    hasClickedRef.current = true;
    // Press-in spring animation on the button itself
    if (witnessButtonRef.current) {
      witnessButtonRef.current.classList.add('btn-press-active');
      setTimeout(() => witnessButtonRef.current?.classList.remove('btn-press-active'), 500);
    }
    // Expanding burst rings from button center
    if (fireBurstRef.current) {
      fireBurstRef.current.classList.add('fire-burst-active');
      setTimeout(() => fireBurstRef.current?.classList.remove('fire-burst-active'), 900);
    }
    setPhase('montage');
    setMontageIdx(0);
  }, []);

  // ─── Rapid montage ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'montage') return;
    let idx = 0;
    const id = setInterval(() => {
      idx++;
      if (idx >= MONTAGE_IMAGES.length) {
        clearInterval(id);
        setTimeout(() => setPhase('text'), 400);
      } else {
        setMontageIdx(idx);
      }
    }, 105);
    return () => clearInterval(id);
  }, [phase]);

  // ─── Text phase: animate panels + dismiss timer ───────────────────────────
  useEffect(() => {
    if (phase !== 'text') return;

    const overlay = textOverlayRef.current;
    if (overlay) {
      gsap.fromTo(
        overlay.querySelectorAll('.text-panel'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', delay: 0.15 },
      );
    }

    // 5-second timer always starts immediately when text appears.
    // When it fires: if cursor is off button → dismiss now.
    //               if cursor is on button → stay, but any subsequent move off = instant dismiss.
    let past5sec = false;

    const timer = setTimeout(() => {
      past5sec = true;
      if (proxRef.current < 0.2) setPhase('post_click');
    }, 5000);

    const onMove = () => {
      if (past5sec && proxRef.current < 0.2) setPhase('post_click');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); clearTimeout(timer); };
  }, [phase]);

  // ─── Post-click slow montage in edge area ─────────────────────────────────
  useEffect(() => {
    if (phase !== 'post_click') return;
    const id = setInterval(() => setSlowIdx(i => (i + 1) % MONTAGE_IMAGES.length), 900);
    return () => clearInterval(id);
  }, [phase]);

  const isMontage   = phase === 'montage';
  const isText      = phase === 'text';
  const isPostClick = phase === 'post_click';
  const hideContent = isMontage || isText;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100svh', minHeight: '640px',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0c0f',
      }}
    >
      {/* ── z:0  Black void base ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, background: '#0a0c0f', zIndex: 0 }} />

      {/* ── z:1  Edge content layer ──────────────────────────────────────────
          Shows through wherever the beauty mask clips.
          Pre-click proximity: black void (section bg shows through)
          Montage: rapid-fire impactful images in the edge area
          Text phase: montage stops, edge area is dark (for text readability)
          Post-click proximity: slow montage loops in edge area
      ──────────────────────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {(isMontage || isPostClick) && MONTAGE_IMAGES.map((src, i) => {
          const activeIdx = isMontage ? montageIdx : slowIdx;
          return (
            <div
              key={src + '-e-' + i}
              style={{
                position: 'absolute', inset: 0,
                opacity: i === activeIdx ? 1 : 0,
                transition: isMontage
                  ? `opacity ${i === activeIdx ? '0.05s' : '0.2s'} ease`
                  : 'opacity 0.75s ease',
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  filter: isMontage
                    ? 'brightness(0.85) contrast(1.22) saturate(0.6)'
                    : 'brightness(0.45) contrast(1.15) saturate(0.4)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── z:2  Beauty slideshow with radial mask ─────────────────────────
          ALWAYS visible in center circle. Mask shrinks on proximity but
          never below minMaskRef (30vw) — beauty stays visible at minimum.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={beautyWrapRef}
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        <div
          ref={sceneRef}
          style={{
            position: 'absolute', inset: '-8%',
            width: '116%', height: '116%',
            willChange: 'transform', transformStyle: 'preserve-3d',
          }}
        >
          {/* Cycling Kashmir images */}
          <div
            ref={bgLayerRef}
            style={{ position: 'absolute', inset: '-5%', width: '110%', height: '110%', willChange: 'transform' }}
          >
            {BEAUTY_IMAGES.map((src, i) => (
              <div
                key={src}
                style={{
                  position: 'absolute', inset: 0,
                  opacity: i === slideshowIdx ? 1 : 0,
                  transition: 'opacity 2s ease',
                }}
              >
                <Image
                  src={src} alt="Kashmir" fill priority={i === 0} quality={80} sizes="120vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 35%', filter: 'brightness(1.05) contrast(1.12) saturate(1.4)' }}
                />
              </div>
            ))}
          </div>

          {/* Atmospheric mist */}
          <div
            ref={mistLayerRef}
            style={{
              position: 'absolute', inset: 0, willChange: 'transform',
              background: `
                radial-gradient(ellipse 100% 50% at 50% 20%, rgba(10,12,15,0.1) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 30% 60%, rgba(20,18,14,0.06) 0%, transparent 70%)
              `,
              mixBlendMode: 'multiply', pointerEvents: 'none',
            }}
          />

          {/* Vignette — dark bands top and bottom frame the face, clear window in center */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: `
                radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, rgba(5,8,12,0.12) 100%),
                linear-gradient(to bottom,
                  rgba(6,8,13,0.88) 0%,
                  rgba(6,8,13,0.60) 14%,
                  rgba(6,8,13,0.18) 28%,
                  transparent 38%,
                  transparent 56%,
                  rgba(6,8,13,0.22) 68%,
                  rgba(6,8,13,0.65) 82%,
                  rgba(6,8,13,0.94) 100%
                )
              `,
              pointerEvents: 'none', zIndex: 2,
            }}
          />

          {/* Saffron tint */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 55% 45% at 50% 65%, rgba(201,123,43,0.055) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 3,
            }}
          />
        </div>
      </div>


      {/* ── z:3  Beauty circle border ring ───────────────────────────────────
          SVG circle that traces the radial mask boundary exactly.
          r / cx / cy updated each RAF frame to match currMaskRef.
          overflow:visible lets the arc show even when circle is large;
          section overflow:hidden clips it to the viewport naturally.
      ──────────────────────────────────────────────────────────────────────── */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 3, pointerEvents: 'none', overflow: 'visible',
          filter: 'drop-shadow(0 0 5px rgba(201,123,43,0.70)) drop-shadow(0 0 12px rgba(201,123,43,0.28))',
        }}
      >
        <circle
          ref={ringCircleRef}
          cx="50%"
          cy="50%"
          r="0"
          fill="none"
          stroke="rgba(201,123,43,0.90)"
          strokeWidth="1.5"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* ── z:4  Left edge atmospheric glow ───────────────────────────────────
          Saffron-amber radiance spilling from the left wall of the void.
          Opacity driven by RAF (mask convergence × countdown beat).
          blur() stays fixed — only opacity changes, so no reflow cost.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={leftGlowRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '280px', height: '100%',
          background: [
            'radial-gradient(ellipse 100% 55% at 0% 50%,',
            '  rgba(200,95,18,0.90) 0%,',
            '  rgba(178,68,10,0.50) 32%,',
            '  rgba(150,50,6,0.16) 62%,',
            '  transparent 100%)',
          ].join(''),
          filter: 'blur(24px)',
          zIndex: 4, pointerEvents: 'none', opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* ── z:4  Right edge atmospheric glow ──────────────────────────────── */}
      <div
        ref={rightGlowRef}
        style={{
          position: 'absolute', top: 0, right: 0,
          width: '280px', height: '100%',
          background: [
            'radial-gradient(ellipse 100% 55% at 100% 50%,',
            '  rgba(200,95,18,0.90) 0%,',
            '  rgba(178,68,10,0.50) 32%,',
            '  rgba(150,50,6,0.16) 62%,',
            '  transparent 100%)',
          ].join(''),
          filter: 'blur(24px)',
          zIndex: 4, pointerEvents: 'none', opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* ── z:5  Three-panel text overlay ─────────────────────────────────────
          Left and right panels have dark background over the edge void area.
          Center column is TRANSPARENT — beauty (z:2) shows through.
          Text appears only during the 'text' phase.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={textOverlayRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'stretch',
          opacity: isText ? 1 : 0,
          transition: isText ? 'opacity 0.7s ease' : 'opacity 0.4s ease',
          pointerEvents: isText ? 'auto' : 'none',
        }}
      >
        {/* Left dark panel */}
        <div
          className="text-panel"
          style={{ ...sidePanelStyle, opacity: 0 }}
        >
          <span style={panelLabelStyle}>{PANEL_LEFT.label}</span>
          <h3 style={panelHeadStyle}>{PANEL_LEFT.heading}</h3>
          <div style={panelDividerStyle} />
          <p style={panelBodyStyle}>{PANEL_LEFT.body}</p>
        </div>

        {/* Thin separator */}
        <div style={{ width: '1px', background: 'rgba(201,123,43,0.15)', flexShrink: 0 }} />

        {/* Center transparent column — beauty always shows here */}
        <div
          className="text-panel"
          style={{ ...centerPanelStyle, opacity: 0 }}
        >
          {/* Soft gradient so text is readable over landscape */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 100% 80% at 50% 55%, rgba(8,9,11,0.52) 0%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />
          <span style={{ ...panelLabelStyle, position: 'relative', color: 'rgba(201,123,43,0.5)' }}>
            {PANEL_CENTER.label}
          </span>
          <h3 style={{ ...panelHeadStyle, position: 'relative', fontSize: 'clamp(1.1rem, 2.2vw, 1.8rem)', letterSpacing: '0.12em', color: 'rgba(245,240,232,0.95)' }}>
            {PANEL_CENTER.heading}
          </h3>
          <div style={{ ...panelDividerStyle, position: 'relative', width: '28px', background: 'rgba(201,123,43,0.55)' }} />
          <p style={{ ...panelBodyStyle, position: 'relative', fontStyle: 'italic', color: 'rgba(245,240,232,0.55)' }}>
            {PANEL_CENTER.body}
          </p>
        </div>

        {/* Thin separator */}
        <div style={{ width: '1px', background: 'rgba(201,123,43,0.15)', flexShrink: 0 }} />

        {/* Right dark panel */}
        <div
          className="text-panel"
          style={{ ...sidePanelStyle, opacity: 0 }}
        >
          <span style={panelLabelStyle}>{PANEL_RIGHT.label}</span>
          <h3 style={panelHeadStyle}>{PANEL_RIGHT.heading}</h3>
          <div style={panelDividerStyle} />
          <p style={panelBodyStyle}>{PANEL_RIGHT.body}</p>
        </div>
      </div>

      {/* ── z:10  Top content — credit + title + subtitle ─────────────────── */}
      <div
        ref={topContentRef}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: 'clamp(68px, 10vh, 100px) clamp(1.25rem, 5vw, 4rem) 0',
          willChange: 'transform',
          opacity: hideContent ? 0 : 1,
          transition: 'opacity 0.25s ease',
          pointerEvents: hideContent ? 'none' : 'auto',
        }}
      >
        <div
          ref={creditRef}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--color-saffron)', marginBottom: 'var(--space-4)', opacity: 0,
          }}
        >
          A FILM BY {FILM.productionCompany.toUpperCase()}
        </div>

        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 400,
            fontSize: 'clamp(3.4rem, 10vw, 7.2rem)', lineHeight: 1.0,
            letterSpacing: '0.04em', color: 'var(--color-snow)',
            marginBottom: '0.1em',
            textShadow: '0 1px 0 rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.98), 0 6px 28px rgba(0,0,0,0.92), 0 12px 64px rgba(0,0,0,0.8)',
            userSelect: 'none', overflow: 'visible',
          }}
        >
          {FILM.titleLine1}
        </h1>

        <div
          ref={subtitleRef}
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.8vw, 1.75rem)', letterSpacing: '0.05em',
            color: 'var(--color-snow-dim)', opacity: 0,
            textShadow: '0 1px 4px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.9)',
          }}
        >
          {FILM.titleLine2}
        </div>
      </div>

      {/* ── z:10  Bottom content — tagline + CTAs + meta ──────────────────── */}
      <div
        ref={bottomContentRef}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: '0 clamp(1.25rem, 5vw, 4rem) clamp(32px, 5vh, 60px)',
          willChange: 'transform',
          opacity: hideContent ? 0 : 1,
          transition: 'opacity 0.25s ease',
          pointerEvents: hideContent ? 'none' : 'auto',
        }}
      >
        <div
          ref={dividerRef}
          style={{ width: '36px', height: '1px', backgroundColor: 'var(--color-saffron)', marginBottom: 'var(--space-5)', opacity: 0 }}
        />

        <p
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(0.82rem, 1.6vw, 1.05rem)', color: 'var(--color-snow-dim)',
            letterSpacing: '0.02em', lineHeight: 1.7,
            marginBottom: 'var(--space-8)', maxWidth: '400px', opacity: 0,
            textShadow: '0 1px 4px rgba(0,0,0,1), 0 3px 16px rgba(0,0,0,0.9)',
          }}
        >
          &ldquo;{FILM.tagline}&rdquo;
        </p>

        <div
          ref={ctaGroupRef}
          style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center', opacity: 0, marginBottom: 'var(--space-6)' }}
        >
          <button
            ref={watchBtnRef} onClick={() => scrollTo('#watch')}
            className="btn btn-primary btn-pulse" data-cursor-hover
            style={{ minWidth: '162px', willChange: 'transform' }}
          >
            Watch the Film
          </button>
          <button
            ref={exploreBtnRef} onClick={() => scrollTo('#film')}
            className="btn btn-ghost" data-cursor-hover
            style={{ willChange: 'transform' }}
          >
            Explore
          </button>
        </div>

        <div
          ref={metaRef}
          style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}
        >
          {[FILM.durationDisplay, String(FILM.releaseYear), 'Documentary', FILM.productionCompany].map((item, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ash-text)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── z:14  Fire ring + ember particles ────────────────────────────── */}
      <canvas
        ref={fireCanvasRef}
        width={220} height={220}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '220px', height: '220px',
          zIndex: 14, pointerEvents: 'none',
        }}
      />

      {/* Click burst ripple */}
      <div
        ref={fireBurstRef}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '56px', height: '56px',
          borderRadius: '50%', zIndex: 14, pointerEvents: 'none',
        }}
      />

      {/* ── z:15  Witness button ───────────────────────────────────────────── */}
      <button
        ref={witnessButtonRef}
        onClick={handleWitnessClick}
        data-cursor-hover
        aria-label="Witness both truths"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 15,
          width: '56px', height: '56px', borderRadius: '50%',
          border: '1.5px solid rgba(255,210,80,0.7)',
          background: 'radial-gradient(circle, rgba(5,7,12,0.6) 0%, rgba(5,7,12,0.35) 60%, transparent 100%)',
          cursor: 'none', opacity: 0, outline: 'none',
          boxShadow: '0 0 18px 5px rgba(201,123,43,0.45), inset 0 0 12px rgba(201,123,43,0.12)',
          animation: 'witness-pulse 3.5s ease-in-out infinite',
          pointerEvents: (isMontage || isText) ? 'none' : 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Sonar ping rings — expand outward to say "press me", staggered */}
        <span className="sonar-ring" style={{ animationDelay: '0s' }} />
        <span className="sonar-ring" style={{ animationDelay: '1.2s' }} />
        <span
          ref={witnessDotRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--color-saffron)',
            boxShadow: '0 0 12px rgba(201,123,43,0.7)', display: 'block',
          }}
        />
      </button>

      <div className="section-mist-bottom" />

      <style>{`
        /* Sonar ping — ring expands outward from button, fades. Two staggered rings = always one expanding. */
        @keyframes sonar-ping {
          0%   { transform: scale(0.75); opacity: 0.85; }
          100% { transform: scale(3.4);  opacity: 0; }
        }
        .sonar-ring {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(255,175,45,0.7);
          animation: sonar-ping 2.4s ease-out infinite;
          pointer-events: none;
          transform-origin: center center;
        }

        /* Button press-in spring — immediate tactile response on click */
        @keyframes btn-press {
          0%   { transform: translate(-50%,-50%) scale(1); }
          14%  { transform: translate(-50%,-50%) scale(0.84); }
          48%  { transform: translate(-50%,-50%) scale(1.10); }
          100% { transform: translate(-50%,-50%) scale(1); }
        }
        .btn-press-active {
          animation: btn-press 0.48s cubic-bezier(0.36,0.07,0.19,0.97) forwards !important;
        }

        /* Detonation — instant white-hot core then three shock-wave rings blasting outward */
        @keyframes fire-burst {
          0%   { box-shadow: 0 0 0 0px   rgba(255,255,220,1),    0 0 0 0px   rgba(255,90,10,0.95),  0 0 0 0px   rgba(200,60,0,0.8); }
          12%  { box-shadow: 0 0 0 40px  rgba(255,255,220,0.85), 0 0 0 65px  rgba(255,90,10,0.6),   0 0 0 90px  rgba(200,60,0,0.4); }
          40%  { box-shadow: 0 0 0 100px rgba(255,120,20,0.25),  0 0 0 160px rgba(200,60,0,0.12),   0 0 0 220px rgba(150,40,0,0.06); }
          100% { box-shadow: 0 0 0 160px rgba(255,90,10,0),      0 0 0 260px rgba(200,60,0,0),      0 0 0 360px rgba(150,40,0,0); }
        }
        .fire-burst-active { animation: fire-burst 1.1s cubic-bezier(0.12,0.8,0.32,1) forwards; }

        @keyframes witness-pulse {
          0%, 100% { box-shadow: 0 0 18px 5px rgba(201,123,43,0.4), 0 0 45px rgba(201,123,43,0.15), inset 0 0 12px rgba(201,123,43,0.1); }
          50%       { box-shadow: 0 0 30px 10px rgba(201,123,43,0.65), 0 0 80px rgba(201,123,43,0.28), inset 0 0 18px rgba(201,123,43,0.18); }
        }
      `}</style>
    </section>
  );
}

// ─── Panel styles ──────────────────────────────────────────────────────────────
const sidePanelStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  textAlign: 'center',
  padding: 'clamp(2rem, 5vh, 4rem) clamp(1.25rem, 2.5vw, 2rem)',
  background: 'rgba(8,9,11,0.88)',
};

const centerPanelStyle: React.CSSProperties = {
  width: 'clamp(260px, 30vw, 440px)',
  flexShrink: 0,
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  textAlign: 'center',
  padding: 'clamp(2rem, 5vh, 4rem) clamp(1rem, 2vw, 1.5rem)',
  background: 'transparent',
  position: 'relative',
};

const panelLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '8px', letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.28)',
  marginBottom: '1rem', display: 'block',
};

const panelHeadStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(0.82rem, 1.3vw, 1rem)',
  fontWeight: 400, letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.82)',
  marginBottom: '1.1rem',
};

const panelDividerStyle: React.CSSProperties = {
  width: '22px', height: '1px',
  background: 'rgba(201,123,43,0.38)',
  marginBottom: '1.1rem',
};

const panelBodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(0.73rem, 0.95vw, 0.82rem)',
  lineHeight: 1.9,
  color: 'rgba(245,240,232,0.4)',
  maxWidth: '280px',
};
