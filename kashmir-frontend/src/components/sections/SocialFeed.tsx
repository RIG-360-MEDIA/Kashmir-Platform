'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

type Platform = 'all' | 'instagram' | 'twitter';

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'IG',
  twitter:   '𝕏',
  facebook:  'FB',
};

export default function SocialFeed() {
  const sectionRef   = useRef<HTMLElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const sliderRef    = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<Platform>('all');
  const { posts, isLoading } = useSocialFeed();

  const filtered = platform === 'all' ? posts : posts.filter(p => p.platform === platform);

  const timeAgo = (iso: string) => {
    try { return formatDistanceToNow(new Date(iso), { addSuffix: true }); }
    catch { return ''; }
  };

  const TABS: { key: Platform; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'twitter',   label: 'Twitter / 𝕏' },
  ];

  /* Animated slider for platform toggle */
  useEffect(() => {
    const container = document.querySelector('.social-tabs');
    if (!container || !sliderRef.current) return;
    const activeBtn = container.querySelector(`[data-tab="${platform}"]`) as HTMLElement;
    if (!activeBtn) return;
    gsap.to(sliderRef.current, {
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [platform]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0, y: 24, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });

      const cards = gridRef.current?.querySelectorAll('.social-card');
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0, y: 28, stagger: { amount: 0.5, from: 'start' },
          duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        });
      }

      /* Masonry float */
      cards?.forEach((card, i) => {
        gsap.to(card, {
          y: `+=${3 + (i % 4)}`,
          duration: 5 + (i % 4),
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section
      id="social"
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
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
          <div>
            <span className="eyebrow">The Voices</span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400, color: 'var(--color-snow)', lineHeight: 1.1,
            }}>
              Kashmir Online
            </h2>
          </div>

          {/* Platform toggle */}
          <div
            className="social-tabs"
            style={{
              display: 'flex', gap: 0, position: 'relative',
              backgroundColor: 'var(--color-deep-slate-hi)',
              border: 'var(--border-dim)', borderRadius: 'var(--radius-md)',
              padding: '4px', overflow: 'hidden',
            }}
          >
            {/* Sliding background */}
            <div
              ref={sliderRef}
              style={{
                position: 'absolute', top: '4px', bottom: '4px',
                backgroundColor: 'var(--color-saffron)', borderRadius: '5px',
                pointerEvents: 'none', zIndex: 0, left: '4px', width: '50px',
              }}
            />
            {TABS.map(tab => (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => setPlatform(tab.key)}
                data-cursor-hover
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: '0.20em', textTransform: 'uppercase',
                  padding: '0.45rem 0.9rem', borderRadius: '5px',
                  cursor: 'none', border: 'none', background: 'none',
                  color: platform === tab.key ? 'var(--color-deep-slate)' : 'var(--color-snow-dim)',
                  position: 'relative', zIndex: 1,
                  transition: 'color 200ms',
                  fontWeight: platform === tab.key ? 700 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        {isLoading ? (
          <div style={{ color: 'var(--color-ash-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
            Loading voices…
          </div>
        ) : (
          <div
            ref={gridRef}
            style={{
              columns: 'auto 300px', columnGap: 'var(--space-5)',
            }}
          >
            {filtered.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target={post.url !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="social-card"
                data-cursor-hover
                style={{
                  display: 'block',
                  backgroundColor: 'var(--color-deep-slate)',
                  border: 'var(--border-dim)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                  marginBottom: 'var(--space-5)',
                  breakInside: 'avoid',
                  cursor: 'none',
                  textDecoration: 'none',
                  transition: 'transform 300ms, box-shadow 300ms, border-color 300ms',
                  willChange: 'transform',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-5px)';
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
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {/* Platform icon */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-deep-slate-hi)',
                      border: 'var(--border-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                      color: 'var(--color-saffron)', fontWeight: 700,
                    }}>
                      {PLATFORM_ICONS[post.platform] ?? '?'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-snow)', fontWeight: 500 }}>
                        {post.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', color: 'var(--color-ash-text)' }}>
                        {post.handle}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', color: 'var(--color-ash-text)' }}>
                    {timeAgo(post.posted_at)}
                  </span>
                </div>

                {/* Image if present */}
                {post.image_url && (
                  <div style={{
                    position: 'relative', borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden', marginBottom: 'var(--space-4)',
                    aspectRatio: '4/3',
                  }}>
                    <Image
                      src={post.image_url}
                      alt=""
                      fill
                      sizes="300px"
                      unoptimized
                      style={{ objectFit: 'cover', filter: 'brightness(0.7) saturate(0.5)' }}
                    />
                  </div>
                )}

                {/* Post text — treated as testimony */}
                <p style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  color: 'var(--color-snow-dim)', lineHeight: 1.7,
                  marginBottom: 'var(--space-4)',
                }}>
                  {post.content}
                </p>

                {/* Engagement */}
                <div style={{ display: 'flex', gap: 'var(--space-5)', borderTop: 'var(--border-dim)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-ash-text)' }}>
                    ♥ {post.likes.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-ash-text)' }}>
                    💬 {post.comments.toLocaleString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="section-mist-bottom" />
    </section>
  );
}
