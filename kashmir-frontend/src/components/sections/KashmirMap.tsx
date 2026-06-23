'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTimeline } from '@/hooks/useTimeline';
import type { TimelineEvent } from '@/types/api';

gsap.registerPlugin(ScrollTrigger);

/* Leaflet must be dynamically imported — it reads window on load */
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      backgroundColor: 'var(--color-deep-slate-mid)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-ash-text)', letterSpacing: '0.14em' }}>
        Loading map…
      </span>
    </div>
  ),
});

const CATEGORY_COLORS: Record<string, string> = {
  political:    '#C97B2B',
  conflict:     '#8B2F3F',
  cultural:     '#4A7B8C',
  humanitarian: '#5A7B5A',
};

type Category = 'all' | 'political' | 'conflict' | 'cultural' | 'humanitarian';

const FILTERS: { key: Category; label: string; color: string }[] = [
  { key: 'all',          label: 'All',          color: 'var(--color-snow-dim)' },
  { key: 'political',    label: 'Political',    color: '#C97B2B' },
  { key: 'conflict',     label: 'Conflict',     color: '#8B2F3F' },
  { key: 'cultural',     label: 'Cultural',     color: '#4A7B8C' },
  { key: 'humanitarian', label: 'Humanitarian', color: '#5A7B5A' },
];

interface KashmirMapProps {
  selectedEvent?: TimelineEvent | null;
  onSelectEvent?: (event: TimelineEvent | null) => void;
}

export default function KashmirMap({ selectedEvent: externalSelected, onSelectEvent: externalSetSelected }: KashmirMapProps) {
  const sectionRef   = useRef<HTMLElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [localSelected, setLocalSelected] = useState<TimelineEvent | null>(null);
  const { events } = useTimeline();

  /* Use external state if provided, otherwise local */
  const selectedEvent = externalSelected !== undefined ? externalSelected : localSelected;
  const setSelectedEvent = (ev: TimelineEvent | null) => {
    setLocalSelected(ev);
    externalSetSelected?.(ev);
  };

  const filtered = activeFilter === 'all'
    ? events
    : events.filter(e => e.category === activeFilter);

  /* Sync external selected event into local state */
  useEffect(() => {
    if (externalSelected !== undefined && externalSelected !== localSelected) {
      setLocalSelected(externalSelected);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSelected]);

  /* Header reveal */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0, y: 24, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
      gsap.from(mapRef.current, {
        opacity: 0, scale: 0.97, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Side panel slide — overlay from right edge */
  useEffect(() => {
    if (!panelRef.current) return;
    if (selectedEvent) {
      gsap.to(panelRef.current, { x: 0, opacity: 1, duration: 0.50, ease: 'power3.out' });
    } else {
      gsap.to(panelRef.current, { x: 340, opacity: 0, duration: 0.32, ease: 'power2.in' });
    }
  }, [selectedEvent]);

  const color = selectedEvent ? CATEGORY_COLORS[selectedEvent.category] : '#C97B2B';

  return (
    <section
      id="map"
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
            <span className="eyebrow">Geography of Conflict</span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400, color: 'var(--color-snow)', lineHeight: 1.1,
            }}>
              Kashmir on the Map
            </h2>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                data-cursor-hover
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: '0.20em', textTransform: 'uppercase',
                  padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-pill)',
                  cursor: 'none', border: `1px solid ${activeFilter === f.key ? f.color : 'var(--color-ash)'}`,
                  backgroundColor: activeFilter === f.key ? f.color + '22' : 'transparent',
                  color: activeFilter === f.key ? f.color : 'var(--color-snow-dim)',
                  transition: 'all 250ms',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map — full width; event panel floats over it as an absolute overlay */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(440px, 58vh, 640px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: 'var(--border-dim)',
          }}
        >
          {/* Leaflet map — always full size, never resized */}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}>
            <LeafletMap
              events={filtered}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          </div>

          {/* Event detail panel — glassmorphism overlay, slides in from right */}
          <div
            ref={panelRef}
            style={{
              position: 'absolute',
              top: 12, right: 12, bottom: 12,
              width: 'clamp(260px, 22vw, 310px)',
              background: 'rgba(8,10,13,0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: `1px solid ${color}28`,
              borderTop: `1px solid ${color}18`,
              borderBottom: `1px solid ${color}18`,
              borderRight: `1px solid ${color}18`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-6)',
              zIndex: 600,
              opacity: 0,
              transform: 'translateX(340px)',
              overflowY: 'auto',
              pointerEvents: selectedEvent ? 'auto' : 'none',
            }}
          >
            {selectedEvent && (
              <>
                {/* Category accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${color}00, ${color}CC, ${color}00)`,
                  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                }} />

                <button
                  onClick={() => setSelectedEvent(null)}
                  data-cursor-hover
                  style={{
                    position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '50%',
                    width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'none',
                    color: 'var(--color-ash-text)', fontSize: '0.9rem', lineHeight: 1,
                    transition: 'background 200ms',
                  }}
                >×</button>

                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: '0.20em', textTransform: 'uppercase', color,
                }}>
                  {selectedEvent.category}
                </span>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                  fontWeight: 400, color, lineHeight: 1,
                  marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)',
                  textShadow: `0 0 40px ${color}40`,
                }}>
                  {selectedEvent.year}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
                  fontWeight: 400, color: 'var(--color-snow)',
                  marginBottom: 'var(--space-3)', lineHeight: 1.25,
                }}>
                  {selectedEvent.title}
                </h3>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 'var(--space-5)',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    letterSpacing: '0.20em', color: 'var(--color-ash-text)',
                    margin: 0,
                  }}>
                    {selectedEvent.place}
                  </p>
                </div>

                <div style={{
                  width: '100%', height: '1px',
                  background: `linear-gradient(90deg, ${color}30, transparent)`,
                  marginBottom: 'var(--space-5)',
                }} />

                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  lineHeight: 1.80, color: 'var(--color-snow-dim)',
                }}>
                  {selectedEvent.description}
                </p>
              </>
            )}
          </div>
        </div>

        {/* LoC legend */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          marginTop: 'var(--space-4)',
        }}>
          <div style={{ width: '24px', height: '1px', borderBottom: '1px dashed rgba(139,47,63,0.6)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-crimson-dim)' }}>
            Line of Control
          </span>
        </div>
      </div>
      <div className="section-mist-bottom" />
    </section>
  );
}
