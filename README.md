# Kashmir — Fighting for Peace

> A cinematic documentary website chronicling 687 years of Kashmir's history — from the Sultanate era to the present day.

Built by **RIG 360 Media** as a design-led platform combining immersive storytelling, interactive geography, and real-time news into a single experience.

---

## Overview

This platform serves as the digital home for the documentary film *Kashmir — Fighting for Peace*. It presents the region's complex history through an interactive timeline, a geographic map of the conflict zones, curated news feeds, and a direct film-access purchase flow.

**Key design philosophy:** Every section is treated as a visual chapter — cinematic atmosphere, intentional typography, and motion that respects the weight of the subject.

---

## Features

- **Hero** — Full-screen cinematic opener with atmospheric canvas effects and montage imagery
- **Film Overview** — Nine witnesses, film synopsis, and director's statement
- **Trailer** — Embedded trailer with custom controls
- **History (Three-Zone Command Center)** — Unified section combining:
  - Scrollable timeline rail (687 years, 5 eras, categorized events)
  - Interactive Leaflet map with territory polygons, Line of Control, and event markers
  - Detail panel with GSAP-animated canvas effects per historical event
- **News Feed** — Live RSS-aggregated Kashmir news from multiple sources
- **Social Feed** — Curated social media coverage
- **Watch** — Film access via Razorpay payment integration
- **Responsive** — Desktop three-column layout, tablet two-column, mobile stacked

---

## Tech Stack

### Frontend — `kashmir-frontend/`

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | CSS custom properties + inline styles (design token system) |
| Animation | GSAP 3.15 + ScrollTrigger |
| Scroll | Lenis smooth scroll |
| Map | Leaflet 1.9 (dynamic import, SSR disabled) |
| UI | React 19 |

### Backend — `kashmir-backend/`

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Runtime | Python 3.14 |
| Payments | Razorpay |
| Auth | JWT (python-jose) |
| News | feedparser + BeautifulSoup4 |
| Social | Apify (optional) |
| Scheduling | APScheduler |

---

## Project Structure

```
Kashmir-Documentary-v2/
├── kashmir-frontend/          # Next.js app
│   ├── src/
│   │   ├── app/               # App Router pages + API routes
│   │   │   ├── api/           # Next.js API routes (timeline, news, payment, social)
│   │   │   ├── page.tsx       # Main page — section composition
│   │   │   └── shop/          # Film purchase page
│   │   ├── components/
│   │   │   ├── effects/       # Canvas atmosphere, cursor glow, grain, smooth scroll
│   │   │   ├── layout/        # Nav, Footer
│   │   │   ├── map/           # LeafletMap (territory polygons, LoC, event markers)
│   │   │   └── sections/      # Hero, FilmOverview, Trailer, Duality, HistorySection,
│   │   │                      # NewsFeed, SocialFeed, Watch
│   │   ├── content/           # Film metadata, product definitions
│   │   ├── hooks/             # useTimeline, useNewsFeed, useSocialFeed, useTimestamps
│   │   ├── server/            # Server-side data: timeline, news, social, payments
│   │   ├── styles/            # tokens.css — full design token system
│   │   └── types/             # TypeScript interfaces (TimelineEvent, etc.)
│   └── public/                # Static assets (people portraits, witness images)
│
├── kashmir-backend/           # FastAPI backend (optional — frontend has API routes)
│   └── app/
│       ├── routers/           # /documentary, /news, /payment, /social
│       ├── services/          # Data logic for each router
│       ├── models/            # Pydantic schemas
│       └── .env.example       # Environment variable template
│
├── Beauty of Kashmir/         # 24 landscape reference images
├── Montage/                   # Documentary montage source images
│   └── Enhanced/              # AI-enhanced montage set
├── The People/                # 12 portrait reference images
├── PROJECT_BRIEF.md           # Original project brief
└── KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+ (only if running the backend separately)

### 1. Frontend (Next.js)

```bash
cd kashmir-frontend
npm install
```

Copy the environment template and fill in values:

```bash
cp .env.example .env.local   # or create manually — see Environment Variables below
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Backend — optional

The frontend includes its own Next.js API routes that cover all data needs. The FastAPI backend is an optional standalone alternative.

```bash
cd kashmir-backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
cp app/.env.example app/.env
uvicorn app.main:app --reload --port 8000
```

---

## Environment Variables

Create `kashmir-frontend/.env.local`:

```env
# Backend — leave empty to use built-in Next.js API routes
NEXT_PUBLIC_API_URL=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Auth
JWT_SECRET=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Pricing
DOCUMENTARY_PRICE_INR=299

# Optional — social feed uses mock data if empty
APIFY_API_TOKEN=

# Optional — RSS feeds work without this
NEWS_API_KEY=
```

> **Note:** Never commit real API keys. The `.env.local` file is excluded from git.

---

## Architecture Notes

### History Section (Three-Zone Command Center)

The Timeline and Map sections are merged into a single `HistorySection` component — no scrolling between them. The layout uses a CSS grid (`30fr 46fr 24fr`) with:

- **Left rail** — Scrollable event list grouped by era (`data-lenis-prevent` stops Lenis from intercepting)
- **Center map** — Leaflet map with Kashmir territory polygons, Line of Control polyline, and event markers. Clicking an event triggers `flyTo` automatically
- **Right panel** — Event detail with GSAP-animated canvas effect (8 types: partition crack, shockwave, snow, fire, exodus, embers, drift, ripple)

### Design Token System

All colors, spacing, typography, and radii are defined as CSS custom properties in `src/styles/tokens.css`. Components use `var(--token-name)` throughout — no Tailwind utility classes for visual design.

### Canvas Atmosphere

`AtmosphereCanvas.tsx` renders a persistent background canvas that responds to the `data-atmosphere` attribute on section wrappers (`warm` / `cold` / `neutral`) — smooth transitions between color temperatures as the user scrolls.

---

## Scripts

```bash
# Frontend
npm run dev       # Development server (localhost:3000)
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint

# Backend
uvicorn app.main:app --reload    # Dev server (localhost:8000)
```

---

## Built by

**RIG 360 Media**  
Documentary filmmaking & digital storytelling

---

*"Beyond the curated broadcasts lies a forgotten landscape where grief wears no single uniform."*
