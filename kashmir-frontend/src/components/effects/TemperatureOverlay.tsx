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
          background:    'radial-gradient(ellipse 130% 90% at 15% 70%, rgba(201,123,43,0.09) 0%, rgba(201,123,43,0.025) 45%, transparent 72%)',
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
          background:    'radial-gradient(ellipse 120% 85% at 80% 20%, rgba(14,28,48,0.16) 0%, rgba(10,18,30,0.05) 50%, transparent 75%)',
        }}
      />
    </>
  );
}
