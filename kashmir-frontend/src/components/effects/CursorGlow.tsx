'use client';

import { useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '@/lib/config';

/**
 * CursorGlow — Three-Layer Custom Cursor
 *
 * Layer 1: dot — instant tracking (no lerp), 6px Saffron Ember circle
 * Layer 2: ring — lerp factor 0.18, 36px border ring
 * Layer 3: light — lerp factor 0.22, 320px radial gradient (the lantern)
 *
 * The lantern metaphor: cursor is a warm light moving through Kashmir's night.
 * Where it moves, things illuminate. Where it leaves, darkness returns.
 */
export default function CursorGlow() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const mouse  = useRef({ x: -400, y: -400 });
  const ring   = useRef({ x: -400, y: -400 });
  const light  = useRef({ x: -400, y: -400 });
  const rafRef = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    const mx = mouse.current.x;
    const my = mouse.current.y;

    /* Ring lerp */
    ring.current.x = lerp(ring.current.x, mx, 0.18);
    ring.current.y = lerp(ring.current.y, my, 0.18);

    /* Light lerp */
    light.current.x = lerp(light.current.x, mx, 0.10);
    light.current.y = lerp(light.current.y, my, 0.10);

    if (dotRef.current) {
      dotRef.current.style.left = `${mx}px`;
      dotRef.current.style.top  = `${my}px`;
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${ring.current.x}px`;
      ringRef.current.style.top  = `${ring.current.y}px`;
    }
    if (lightRef.current) {
      lightRef.current.style.left = `${light.current.x}px`;
      lightRef.current.style.top  = `${light.current.y}px`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!CONFIG.effects.cursorEnabled) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]');
      if (ringRef.current) {
        ringRef.current.classList.toggle('is-hovering', !!isInteractive);
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  if (!CONFIG.effects.cursorEnabled) return null;

  return (
    <>
      {/* Layer 1 — Dot (instant) */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />

      {/* Layer 2 — Ring (lerp 0.18) */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
      />

      {/* Layer 3 — Light / Lantern (lerp 0.10) */}
      {CONFIG.effects.cursorLightEnabled && (
        <div
          ref={lightRef}
          className="cursor-light"
          aria-hidden="true"
        />
      )}
    </>
  );
}
