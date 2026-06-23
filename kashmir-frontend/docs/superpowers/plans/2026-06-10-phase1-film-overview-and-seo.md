# Phase 1 Implementation Plan — FilmOverview Redesign, Nav Update & SEO

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current portrait-poster/glow-effects FilmOverview with an editorial journalism design; add missing nav links; complete SEO with JSON-LD and sitemap.

**Architecture:** `film.ts` is the content source of truth — a new `characters` array feeds the "people in this film" column. `FilmOverview.tsx` is a complete file replacement. Nav gets two extra entries. SEO additions go in `layout.tsx` + two new route files.

**Tech Stack:** Next.js 14 App Router, TypeScript, GSAP + ScrollTrigger, Tailwind CSS v4, CSS custom properties from `tokens.css`. No new packages needed.

---

## File Map

| Action   | File                                      | What changes                                          |
|----------|-------------------------------------------|-------------------------------------------------------|
| Modify   | `src/content/film.ts`                     | Add `characters` array + `FilmCharacter` export type |
| Replace  | `src/components/sections/FilmOverview.tsx`| Full redesign — editorial journalism layout           |
| Modify   | `src/components/layout/Nav.tsx`           | Add Trailer + Watch to NAV_LINKS                      |
| Modify   | `src/app/layout.tsx`                      | Add JSON-LD Film schema script                        |
| Create   | `src/app/sitemap.ts`                      | XML sitemap for Next.js                               |
| Create   | `src/app/robots.ts`                       | robots.txt via Next.js                                |

---

## Task 0: Git Baseline

**Files:** none modified

- [ ] **Step 1: Check if git is already initialised**

```powershell
cd "C:\Internship\Project Kashmir\Kashmir-Documentary-v2\kashmir-frontend"
git status
```

Expected: either `On branch main` (already initialised) or `fatal: not a git repository`.

- [ ] **Step 2: Initialise if not already done**

Only run this if Step 1 said "not a git repository":

```powershell
git init
git add .
git commit -m "chore: baseline — existing codebase before Phase 1 redesign"
```

Expected: `main` branch created, all existing files committed.

---

## Task 1: Add `characters` Array to film.ts

**Files:**
- Modify: `src/content/film.ts`

These five character entries power the "people in this film" column in FilmOverview. They come from the film's actual content and must live in `film.ts`, not be hardcoded in a component.

- [ ] **Step 1: Add the `characters` array inside the FILM object**

Open `src/content/film.ts`. After the `scenes` block (around line 188) and before the closing `} as const;`, add:

```typescript
  /* ── Characters (for FilmOverview people column) ─── */
  characters: [
    {
      role: 'A Father',
      description: '"His son called once. He said: I cannot come back."',
    },
    {
      role: 'A Mother',
      description: '"She keeps asking for her son. Every day. Just asking."',
    },
    {
      role: 'A Militant',
      description: 'The ideology that held everything together stops being true.',
    },
    {
      role: 'Girls on Bicycles',
      description: 'The most ordinary thing in the world — made extraordinary by everything around it.',
    },
    {
      role: 'An Officer',
      description: 'Someone looked at a row of buses and chose his. And that was enough.',
    },
  ],
```

- [ ] **Step 2: Export the FilmCharacter type**

At the bottom of `src/content/film.ts`, after the existing export lines, add:

```typescript
export type FilmCharacter = typeof FILM.characters[number];
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
cd "C:\Internship\Project Kashmir\Kashmir-Documentary-v2\kashmir-frontend"
npx tsc --noEmit
```

Expected: no errors. If there are errors, they will name the file and line — fix before continuing.

- [ ] **Step 4: Commit**

```powershell
git add src/content/film.ts
git commit -m "feat(content): add characters array to FILM for FilmOverview people column"
```

---

## Task 2: Redesign FilmOverview.tsx

**Files:**
- Replace: `src/components/sections/FilmOverview.tsx`

The current component uses a portrait poster with amber glow effects, corner brackets, DOC·001 label, and three-column spec-sheet flanking columns. This is commercial-entertainment visual language, not documentary journalism. Replace it entirely with:

- Status row (dot · Documentary · Kashmir · 2026 · U/A Certified)
- Headline: `FILM.synopsis.short` — "A witness, not an argument." in large Playfair serif
- 16:9 landscape still from `CONFIG.sectionImages.poster`
- Two-column body on desktop (stacks on mobile): synopsis left + people in this film right
- Film spec row at the bottom (Duration · Language · Rating · Director) — minimal
- Pull quote band with crimson left bar (kept from original — it was correct)

- [ ] **Step 1: Replace the entire file content**

Replace `src/components/sections/FilmOverview.tsx` with:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FILM } from '@/content/film';
import { CONFIG } from '@/lib/config';

gsap.registerPlugin(ScrollTrigger);

export default function FilmOverview() {
  const sectionRef  = useRef<HTMLElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const specsRef    = useRef<HTMLDivElement>(null);
  const quoteRef    = useRef<HTMLDivElement>(null);

  /* ─── Scroll reveals ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionTrigger = { trigger: sectionRef.current, start: 'top 78%', once: true };

      gsap.from(statusRef.current, {
        opacity: 0, y: 12, duration: 0.7, ease: 'power2.out',
        scrollTrigger: sectionTrigger,
      });

      gsap.from(headlineRef.current, {
        opacity: 0, y: 28, duration: 1.1, ease: 'power3.out', delay: 0.12,
        scrollTrigger: sectionTrigger,
      });

      gsap.from(imageRef.current, {
        opacity: 0, scale: 1.02, duration: 1.4, ease: 'power2.out', delay: 0.28,
        scrollTrigger: sectionTrigger,
      });

      gsap.from(bodyRef.current, {
        opacity: 0, y: 20, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: bodyRef.current, start: 'top 80%', once: true },
      });

      gsap.from(specsRef.current, {
        opacity: 0, y: 12, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: specsRef.current, start: 'top 85%', once: true },
      });

      const qEl = quoteRef.current;
      if (qEl) {
        const qTrigger = { trigger: qEl, start: 'top 82%', once: true };
        gsap.from(qEl.querySelector<HTMLElement>('.q-bar'), {
          scaleY: 0, duration: 0.55, ease: 'power2.inOut', transformOrigin: 'top center',
          scrollTrigger: qTrigger,
        });
        gsap.from(qEl.querySelector<HTMLElement>('.q-text'), {
          opacity: 0, x: -28, duration: 1.0, ease: 'power3.out', delay: 0.22,
          scrollTrigger: qTrigger,
        });
        gsap.from(qEl.querySelector<HTMLElement>('.q-attr'), {
          opacity: 0, duration: 0.7, delay: 0.58,
          scrollTrigger: qTrigger,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const STATUS_ITEMS = [
    { text: 'Documentary', accent: true },
    { text: `Kashmir · ${FILM.releaseYear}`, accent: false },
    { text: `${FILM.certificate} Certified`, accent: false },
  ] as const;

  const SPECS = [
    { label: 'Duration', value: FILM.durationDisplay },
    { label: 'Language', value: FILM.language },
    { label: 'Rating',   value: FILM.certificate },
    { label: 'Director', value: FILM.director },
  ] as const;

  return (
    <section
      id="film"
      ref={sectionRef}
      style={{ position: 'relative', backgroundColor: 'var(--color-deep-slate-mid)' }}
    >
      <div className="section-mist-top" />

      <div className="section-container" style={{ paddingTop: 'var(--section-py)', paddingBottom: 0 }}>

        {/* ── STATUS ROW ── */}
        <div
          ref={statusRef}
          style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap',
            gap: 'var(--space-3)',
            marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%',
            backgroundColor: 'var(--color-saffron)', flexShrink: 0,
          }} />
          {STATUS_ITEMS.map((item, i) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {i > 0 && (
                <div style={{
                  width: '1px', height: '10px',
                  backgroundColor: 'var(--color-ash-dim)',
                }} />
              )}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '8.5px',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: item.accent ? 'var(--color-saffron)' : 'var(--color-ash-text)',
              }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── HEADLINE ── */}
        <h2
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)',
            fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.025em',
            color: 'var(--color-snow)',
            marginBottom: 'clamp(0.75rem, 1.5vw, 1.1rem)',
            maxWidth: '680px',
          }}
        >
          {FILM.synopsis.short}
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)',
          color: 'var(--color-ash-text)',
          fontStyle: 'italic', lineHeight: 1.7,
          maxWidth: '520px',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}>
          {/* First sentence of synopsis.medium — the journalistic statement of intent */}
          This film went to Kashmir. Not from a distance — from inside.
        </p>

      </div>

      {/* ── 16:9 LANDSCAPE STILL ── */}
      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div
          ref={imageRef}
          style={{
            position: 'relative', width: '100%',
            aspectRatio: '16/9', overflow: 'hidden',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <Image
            src={CONFIG.sectionImages.poster}
            alt={`${FILM.title} — scene from the film`}
            fill quality={88}
            sizes="(max-width: 768px) 100vw, 1280px"
            style={{
              objectFit: 'cover', objectPosition: 'center 30%',
              filter: 'brightness(0.55) contrast(1.15) saturate(0.35)',
            }}
          />
          {/* Gradient vignette — darkens bottom so caption is legible */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(6,8,9,0.72) 0%, transparent 50%)',
          }} />
          {/* Scene caption */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '8px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.35)',
          }}>
            Kashmir — Scene from the film
          </div>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>

        {/* ── TWO-COLUMN BODY (stacks on mobile) ── */}
        <div
          ref={bodyRef}
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]"
          style={{
            gap: 'clamp(2rem, 4vw, 4rem)',
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* Synopsis column */}
          <div>
            <div style={{
              borderLeft: '2px solid rgba(201,123,43,0.35)',
              paddingLeft: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)',
                lineHeight: 1.85, color: 'var(--color-snow-dim)', margin: 0,
              }}>
                {FILM.synopsis.medium}
              </p>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, 1.0vw, 0.88rem)',
              lineHeight: 1.95, color: 'var(--color-ash-text)',
              margin: 0,
            }}>
              {FILM.synopsis.long}
            </p>
          </div>

          {/* People column — separated by a left border on desktop */}
          <div
            className="md:border-l"
            style={{
              borderColor: 'var(--color-ash-dim)',
              paddingLeft: 'clamp(0px, 2.5vw, 2rem)',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--color-ash-text)', marginBottom: '1.25rem',
            }}>
              The people in this film
            </div>
            {FILM.characters.map((person, i) => (
              <div
                key={person.role}
                style={{
                  marginBottom: i < FILM.characters.length - 1 ? '1.25rem' : 0,
                  paddingBottom: i < FILM.characters.length - 1 ? '1.25rem' : 0,
                  borderBottom: i < FILM.characters.length - 1
                    ? '1px solid var(--color-ash-dim)'
                    : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8.5px',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-saffron)', marginBottom: '5px',
                }}>
                  {person.role}
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontSize: 'clamp(0.78rem, 1.0vw, 0.88rem)',
                  color: 'var(--color-snow-dim)', lineHeight: 1.6,
                  margin: 0,
                }}>
                  {person.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILM SPEC ROW ── */}
        <div
          ref={specsRef}
          style={{
            display: 'flex', alignItems: 'center',
            flexWrap: 'wrap', gap: 0,
            paddingTop: 'var(--space-5)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
            borderTop: '1px solid var(--color-ash-dim)',
          }}
        >
          {SPECS.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{
                  width: '1px', height: '32px',
                  backgroundColor: 'var(--color-ash-dim)',
                  margin: '0 var(--space-6)',
                }} />
              )}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '7.5px',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'var(--color-saffron)', marginBottom: '4px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-snow)', fontWeight: 500,
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PULL QUOTE BAND ── */}
      <div
        ref={quoteRef}
        style={{
          borderTop: '1px solid var(--color-ash-dim)',
          background: 'linear-gradient(to right, rgba(7,9,12,0.95), rgba(13,15,19,0.95))',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) 0',
        }}
      >
        <div className="section-container">
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            gap: 'var(--space-8)', maxWidth: '740px',
          }}>
            <div
              className="q-bar"
              style={{
                width: '3px', flexShrink: 0, alignSelf: 'stretch',
                minHeight: '58px', backgroundColor: 'var(--color-crimson)',
                borderRadius: '2px',
              }}
            />
            <div>
              <blockquote
                className="q-text"
                style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontSize: 'clamp(1.18rem, 2.4vw, 1.72rem)',
                  lineHeight: 1.58, letterSpacing: '0.005em',
                  color: 'var(--color-snow)', margin: 0,
                  marginBottom: 'var(--space-4)',
                }}
              >
                &ldquo;{FILM.primaryPullQuote}&rdquo;
              </blockquote>
              <div
                className="q-attr"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8.5px',
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'var(--color-saffron)',
                }}
              >
                — {FILM.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-mist-bottom" />
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
cd "C:\Internship\Project Kashmir\Kashmir-Documentary-v2\kashmir-frontend"
npx tsc --noEmit
```

Expected: no errors. The most likely error is `Property 'characters' does not exist on type...` — which means Task 1 wasn't completed first. Complete Task 1 before running this.

- [ ] **Step 3: Start the dev server and check the result visually**

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser. Scroll to the FilmOverview section and verify:
- Status row: orange dot → "Documentary" → divider → "Kashmir · 2026" → divider → "U/A Certified"
- Headline: large serif "A witness, not an argument."
- 16:9 landscape image (desaturated, dark)
- Two columns: synopsis text on left, character list on right (on desktop)
- Film spec row: Duration · Language · Rating · Director
- Pull quote band with crimson left bar and italic quote

Also verify the old design is **gone**: no portrait poster, no amber glow edges, no corner brackets, no "DOC · 001" label, no left/right metadata strips flanking a centre image.

- [ ] **Step 4: Verify mobile layout**

In browser DevTools, switch to iPhone 12 (390px width). Verify:
- The two-column body stacks to a single column (synopsis above, people below)
- Text is readable at small sizes
- Image fills the width correctly
- No horizontal overflow

- [ ] **Step 5: Commit**

```powershell
git add src/components/sections/FilmOverview.tsx
git commit -m "feat(ui): redesign FilmOverview — editorial journalism layout replaces portrait poster"
```

---

## Task 3: Update Nav Links

**Files:**
- Modify: `src/components/layout/Nav.tsx`

Current NAV_LINKS: Film, Timeline, Map, News, Social.
Missing: Trailer (`#trailer`) and Watch (`#watch`). Both sections already exist on the page.

- [ ] **Step 1: Update the NAV_LINKS array**

In `src/components/layout/Nav.tsx`, find the `NAV_LINKS` constant at the top of the file (around line 6) and replace it:

```typescript
const NAV_LINKS = [
  { label: 'Film',     href: '#film'     },
  { label: 'Trailer',  href: '#trailer'  },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Map',      href: '#map'      },
  { label: 'News',     href: '#news'     },
  { label: 'Watch',    href: '#watch'    },
];
```

- [ ] **Step 2: Verify visually**

With dev server running, check `http://localhost:3000`:
- Nav bar shows: Film · Trailer · Timeline · Map · News · Watch
- Clicking "Trailer" scrolls to the Trailer section
- Clicking "Watch" scrolls to the Watch section
- Active section indicator still slides under the correct link as you scroll
- Mobile hamburger menu shows all 6 links

- [ ] **Step 3: Commit**

```powershell
git add src/components/layout/Nav.tsx
git commit -m "feat(nav): add Trailer and Watch links to navigation"
```

---

## Task 4: Add JSON-LD Film Schema

**Files:**
- Modify: `src/app/layout.tsx`

`layout.tsx` already has Open Graph and Twitter Card metadata. The only missing piece is a JSON-LD structured data block for Google's Film schema. This helps search engines understand the page is a documentary film, enabling rich results.

- [ ] **Step 1: Add the JSON-LD script to the `<head>`**

In `src/app/layout.tsx`, add the `jsonLd` object and the `<script>` tag inside `<html>`. Place the script tag after the fonts, before `<body>`. The full updated layout.tsx `RootLayout` function:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: CONFIG.film.title,
    description: CONFIG.seo.defaultDescription,
    director: {
      '@type': 'Organization',
      name: CONFIG.film.productionCompany,
    },
    productionCompany: {
      '@type': 'Organization',
      name: CONFIG.film.productionCompany,
    },
    duration: 'PT70M',
    inLanguage: ['hi', 'en'],
    genre: CONFIG.film.genres,
    url: CONFIG.seo.siteUrl,
    image: CONFIG.seo.ogImage,
    dateCreated: String(CONFIG.film.releaseYear),
    contentRating: CONFIG.film.certificate,
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <Grain />
          <CursorGlow />
          <Nav />
          <main>
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
```

Note: the `<head>` tag with the JSON-LD script is added above `<body>`. Next.js merges this with the metadata API output automatically.

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the script tag is in the HTML**

With dev server running, open `http://localhost:3000`, right-click → View Page Source, and search for `application/ld+json`. You should find the JSON-LD block with the film's data.

- [ ] **Step 4: Commit**

```powershell
git add src/app/layout.tsx
git commit -m "feat(seo): add JSON-LD Movie schema to document head"
```

---

## Task 5: Add sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`

Next.js 14 App Router supports a `sitemap.ts` file that auto-generates `sitemap.xml`. Since this is a single-page app with one URL, the sitemap has one entry.

- [ ] **Step 1: Create the sitemap file**

Create `src/app/sitemap.ts` with this content:

```typescript
import { MetadataRoute } from 'next';
import { CONFIG } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: CONFIG.seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

- [ ] **Step 2: Verify it serves correctly**

With dev server running, open `http://localhost:3000/sitemap.xml`. Expected: an XML document with one `<url>` entry containing `http://localhost:3000`.

- [ ] **Step 3: Commit**

```powershell
git add src/app/sitemap.ts
git commit -m "feat(seo): add sitemap.ts"
```

---

## Task 6: Add robots.ts

**Files:**
- Create: `src/app/robots.ts`

Next.js 14 App Router supports a `robots.ts` file that auto-generates `robots.txt`.

- [ ] **Step 1: Create the robots file**

Create `src/app/robots.ts` with this content:

```typescript
import { MetadataRoute } from 'next';
import { CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${CONFIG.seo.siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Verify it serves correctly**

With dev server running, open `http://localhost:3000/robots.txt`. Expected: a plain text file with `User-agent: *`, `Allow: /`, and `Sitemap: http://localhost:3000/sitemap.xml`.

- [ ] **Step 3: Commit**

```powershell
git add src/app/robots.ts
git commit -m "feat(seo): add robots.ts"
```

---

## Task 7: Phase 1 Final Verification

**Files:** none modified

- [ ] **Step 1: Run TypeScript check one final time**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Full page visual walkthrough**

With `npm run dev` running, open `http://localhost:3000` and go through this checklist:

**Hero:**
- [ ] "KASHMIR" title animates character by character on load
- [ ] Scene tilts as mouse moves
- [ ] "Watch the Film" and "Explore" buttons respond to hover
- [ ] Scroll cue visible at bottom, disappears on first scroll

**FilmOverview (the redesigned section):**
- [ ] Status row is small, humble — orange dot + "Documentary" + "Kashmir · 2026" + "U/A Certified"
- [ ] Headline "A witness, not an argument." is large Playfair serif
- [ ] 16:9 image renders (desaturated, darkened) with scene caption at bottom-left
- [ ] Two columns on desktop: synopsis left, people right separated by left border
- [ ] Character list: A Father, A Mother, A Militant, Girls on Bicycles, An Officer
- [ ] Film spec row: Duration · Language · Rating · Director — minimal at bottom
- [ ] Pull quote band: crimson left bar, italic serif quote, saffron attribution

**Nav:**
- [ ] 6 links: Film · Trailer · Timeline · Map · News · Watch
- [ ] Active link highlights as you scroll through sections
- [ ] "Watch Now" CTA button in nav

**SEO (View Page Source):**
- [ ] `<script type="application/ld+json">` block present in `<head>`
- [ ] `og:title`, `og:description`, `og:image` meta tags present
- [ ] `twitter:card` meta tag present

- [ ] **Step 3: Tag Phase 1 complete**

```powershell
git tag phase-1-complete
```

---

## What's NOT in this plan (Phase 2+)

- Hero.tsx — already well-built, no redesign needed
- Trailer, Duality, Timeline, Watch, KashmirMap, NewsFeed, SocialFeed sections — Phase 2 and 3
- Custom OG image as static asset — needs a production still from the film team
- Email capture for Coming Soon states — needs email provider decision first
- Film player for when `filmAvailable = true` — needs player platform decision first
