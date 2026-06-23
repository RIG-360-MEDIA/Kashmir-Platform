'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { CONFIG } from '@/lib/config';

/**
 * SmoothScroll — Lenis cinematic scroll provider
 *
 * Duration 1.4s with expo easing creates the weighted, unhurried feeling
 * of moving through a serious documentary world.
 * GSAP ScrollTrigger is connected via the raf loop.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!CONFIG.effects.smoothScrollEnabled) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    /* Expose lenis globally so GSAP ScrollTrigger can connect later */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as unknown as Record<string, unknown>).lenis = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).lenis;
    };
  }, []);

  return <>{children}</>;
}
