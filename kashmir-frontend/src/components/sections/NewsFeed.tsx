'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNewsFeed } from '@/hooks/useNewsFeed';
import { formatDistanceToNow } from 'date-fns';

gsap.registerPlugin(ScrollTrigger);

export default function NewsFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const { articles, isLoading, fetchedAt } = useNewsFeed();

  const timeAgo = (iso: string) => {
    try { return formatDistanceToNow(new Date(iso), { addSuffix: true }); }
    catch { return ''; }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0, y: 24, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });

      const cards = gridRef.current?.querySelectorAll('.news-card');
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0, y: 32, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        });
      }

      /* Ambient float on cards */
      cards?.forEach((card, i) => {
        gsap.to(card, {
          y: `+=${2 + (i % 3)}`,
          duration: 4 + (i % 3),
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [articles]);

  return (
    <section
      id="news"
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: 'var(--section-py) 0',
      }}
    >
      <div className="section-mist-top" />
      <div className="section-container">

        {/* Header */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <span className="eyebrow">From the Ground</span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400, color: 'var(--color-snow)', lineHeight: 1.1,
            }}>
              Kashmir Today
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', backgroundColor: 'var(--color-crimson)',
              animation: 'live-pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-ash-text)' }}>
              Live · Updated {timeAgo(fetchedAt.toISOString())}
            </span>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ color: 'var(--color-ash-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
            Loading news…
          </div>
        ) : (
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target={article.url !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="news-card"
                data-cursor-hover
                style={{
                  display: 'block',
                  backgroundColor: 'var(--color-deep-slate-mid)',
                  border: 'var(--border-dim)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'none',
                  textDecoration: 'none',
                  transition: 'transform 300ms var(--ease-decisive), box-shadow 300ms var(--ease-settle), border-color 300ms',
                  willChange: 'transform',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-6px)';
                  el.style.boxShadow = 'var(--shadow-card-hover)';
                  el.style.borderColor = 'var(--color-saffron-border)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'var(--color-ash-dim)';
                }}
              >
                {/* Image */}
                {article.image_url && (
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 320px"
                      /* News images come from arbitrary third-party CDNs that can't be
                         whitelisted in next.config; bypass the optimizer for these. */
                      unoptimized
                      style={{
                        objectFit: 'cover',
                        filter: 'brightness(0.65) saturate(0.6)',
                        transition: 'filter 300ms',
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: 'var(--space-5)' }}>
                  {/* Source + time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-saffron)' }}>
                      {article.source}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', color: 'var(--color-ash-text)' }}>
                      {timeAgo(article.published_at)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 400,
                    fontSize: 'clamp(1rem, 1.6vw, 1.1rem)',
                    color: 'var(--color-snow)', lineHeight: 1.4,
                    marginBottom: 'var(--space-3)',
                  }} className="line-clamp-3">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                    color: 'var(--color-snow-dim)', lineHeight: 1.65,
                  }} className="line-clamp-2">
                    {article.summary}
                  </p>

                  {/* Read link */}
                  <div style={{
                    marginTop: 'var(--space-4)',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    color: 'var(--color-saffron)',
                    transition: 'letter-spacing 200ms',
                  }}>
                    Read →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      <div className="section-mist-bottom" />
    </section>
  );
}
