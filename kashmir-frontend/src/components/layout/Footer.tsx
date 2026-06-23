'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FILM } from '@/content/film';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Film',     href: '#film' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Map',      href: '#map' },
  { label: 'News',     href: '#news' },
  { label: 'Social',   href: '#social' },
  { label: 'Watch',    href: '#watch' },
];

export default function Footer() {
  const footerRef  = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const legalRef   = useRef<HTMLDivElement>(null);
  const lastRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Mist closes over — darkening overlay on scroll into footer */
      gsap.from(footerRef.current, {
        opacity: 0,
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%', end: 'top 60%', scrub: true },
      });

      gsap.from([titleRef.current, taglineRef.current, linksRef.current, legalRef.current, lastRef.current], {
        opacity: 0, y: 20, stagger: 0.12, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 80%', once: true },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: 'var(--border-dim)',
        padding: 'clamp(4rem, 8vw, 6rem) 0 clamp(2rem, 4vw, 3rem)',
        overflow: 'hidden',
      }}
    >
      {/* Grain heavier in footer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,123,43,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="section-container">
        <div style={{ textAlign: 'center' }}>

          {/* Title */}
          <div ref={titleRef} style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 400,
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              color: 'var(--color-snow)',
              letterSpacing: '-0.01em',
            }}>
              {FILM.title}
            </span>
          </div>

          {/* Tagline */}
          <div ref={taglineRef} style={{ marginBottom: 'var(--space-10)' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
              color: 'var(--color-saffron)',
              opacity: 0.8,
            }}>
              Two truths. Same sky. Same soil.
            </span>
          </div>

          {/* Nav links */}
          <div
            ref={linksRef}
            style={{
              display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)',
              justifyContent: 'center', flexWrap: 'wrap',
              marginBottom: 'var(--space-10)',
              paddingBottom: 'var(--space-8)',
              borderBottom: 'var(--border-dim)',
            }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                data-cursor-hover
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: '0.20em', textTransform: 'uppercase',
                  color: 'var(--color-ash-text)',
                  transition: 'color 200ms',
                  cursor: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-saffron)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ash-text)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal row */}
          <div
            ref={legalRef}
            style={{
              display: 'flex', justifyContent: 'center', gap: 'var(--space-6)',
              flexWrap: 'wrap', marginBottom: 'var(--space-8)',
            }}
          >
            {[
              `© ${FILM.releaseYear} ${FILM.productionCompany}`,
              'All Rights Reserved',
              FILM.language,
            ].map((item, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-ash-text)' }}>
                {item}
              </span>
            ))}
          </div>

          {/* Closing line */}
          <div ref={lastRef}>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
              color: 'var(--color-snow-dim)',
              letterSpacing: '0.01em',
            }}>
              &ldquo;This story does not end when you leave.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
