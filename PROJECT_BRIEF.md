# Kashmir — Fighting for Peace | Complete Frontend Project Brief
### A Film by Rig 360 Media | For New Claude Code Session

---

## ⚠️ THE TWO COMPANION DOCUMENTS — READ FIRST

This project uses **two briefs that work together**:

| File | What It Owns |
|---|---|
| **`PROJECT_BRIEF.md`** (this file) | **THE BUILD BRIEF** — section structure, backend APIs, design principle, interaction model, tech stack, folder structure, build phases, no-hardcoding rules |
| **`KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md`** | **THE FILM CONTEXT** — what the film actually is (31 scenes, the people in it, the central duality, the human-bar test). Read this to understand the *tone* the build must carry. |

**Hierarchy for build decisions:**

- For **what to build** (sections, pages, APIs, architecture) → **this file is authoritative**.
- For **how the build should feel** (the tone, the gravity, the people being honored) → the Fighting for Peace brief is the soul reference.

The Fighting for Peace brief originally proposed a film-deconstructed section structure (Hero / Duality / Voices / Story / Themes / Closing Gallery). **That structure has been retired.** The site uses the **original 9-section structure** from the reference website (defined in Section 5 of this file). The Fighting for Peace brief is kept for *tone, palette, typography, and emotional alignment* — not for section architecture.

---

## 0. BEFORE YOU DO ANYTHING — READ THIS SECTION

Before touching any code, file, or framework, you must:

1. Read this document entirely (the build brief)
2. Read `KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md` entirely — for film context and tone
3. Ask every clarifying question listed in Section 11
4. Get answers confirmed by the user
5. Propose a visual direction mockup and get owner approval
6. Only then plan and build

**The previous version of this frontend was built for 6+ weeks and thrown away entirely.** The reason: visual direction was never validated before building. The owner saw the result and called it "childish and cartoony." Do not repeat this. Design validation comes before implementation. Always.

---

## ★ THE TWO LOCKED PRINCIPLES ★

Both apply to every design, content, and code decision on this site. Neither is optional.

### PRINCIPLE 1 — THE LIVING ATMOSPHERE

> **The site is not pages of content. It is one continuous atmosphere of Kashmir that the user moves through, breathes in, and is carried by. The way the user traverses, the way each piece of content arrives, the way the site responds — that is where the magic lives.**

What this rules in:
- Polished, cinematic motion and transitions across every section
- A continuous spatial experience — sections fade into one another, never feel like separate pages
- Atmosphere is always present (mist, distant mountain silhouettes, time-of-day shifts, real Kashmir weather reflection)
- Headlines settle rather than appear; body text arrives line-by-line with cinematic timing
- News cards arrive like dispatches; timeline events emerge from a descending journey through time; the map breathes
- The cursor carries a piece of Kashmir's atmosphere — it is not a pointer, it is a presence in the world
- Click-through is transformation, not navigation — spatial continuity is preserved
- Inter-element relationships create a sense of one connected fabric (hover a timeline year, the matching map pin acknowledges)

What this rules out:
- Pages that look and act like documents
- Hard cuts between sections
- Static, generic grids of cards laid out without choreography
- Generic micro-interactions (4px hover lift, fade-in — these are the floor, not the ceiling)
- Anything that feels like a "section" rather than a "moment"

**The reference benchmark for execution polish is Lusion (https://lusion.co, https://labs.lusion.co)** — but with our serious documentary tone instead of their bright celebratory one. The *language of interaction* is borrowed; the *mood* is our own.

**Content access is never gated by interaction.** Lingering, hovering, scrolling — these never unlock content that was hidden. They *deepen presentation* of content that was always available. Anyone scanning quickly gets the full information; anyone moving slowly gets the cinematic experience.

---

### PRINCIPLE 2 — DESIGNED TWICE

> **Every visible element on the site must be designed to mean TWO things: one for a first-time visitor, one for someone who has watched the film. The first meaning is beautiful and intriguing. The second is a quiet recognition — a chord only the film-watched can hear.**

This is the multi-audience architecture:

| First-time visitor | Film-watched recognition |
|---|---|
| Hero darkness = atmospheric mood | Hero darkness = Scene 1 (night patrol) — the film opens here, so does the site |
| Tagline *"Two truths. Same sky. Same soil."* = poetic | Tagline = the spine of Scenes 2, 19, 29 (beauty + grief coexisting) |
| Pull quote *"It is not what they are. The conflict is something that happened to them."* = meaningful | Pull quote = Scene 4, the captured militant's first interview |
| Mist atmosphere = beautiful | Mist = the morning mist of Scene 2 — beauty that makes the darkness worse |
| Conflict-red years (1947, 1989, 1999) on the timeline = color-coded | Same years = where the film's interview subjects lost what they lost |
| LoC line on the map = decorative | LoC = the line the captured militant crossed |
| Chapter names in the player section = navigation | Chapter names = the arcs of grief, ideology, and grace the watched user has lived through |
| Footer tagline *"Same sky. Same soil. Both truths."* = closing thought | Footer = the film's closing chord |

**Implementation rule:** We never *explain* the film-watched layer. We design every line of copy, every image, every detail so that the recognition is *available* — not announced. The site rewards memory without requiring it.

This principle applies to **content choices, copy choices, imagery, layout, color, motion, transitions** — every single decision must ask: *what does this say to a first-time visitor, and what additional meaning does it carry for someone who watched the film?*

---

### THE PURPOSEFULNESS RULE (owner-mandated, applies above both principles)

> **Everything on this site — every element of design, every word of content, every motion, every transition, every interaction — must align with the film's theme and tone, must have meaning, must be useful, must have purpose, and must add value to the user's life. The overall experience must be polished.**

This is the final filter every decision passes through. If a thing exists on the site, it must be defensible against this rule.

Decorative content is forbidden.
Generic placeholder copy is forbidden.
Animation without purpose is forbidden.
Anything that doesn't add value gets cut.

---

## 1. PROJECT IDENTITY

**Film Title:** Kashmir — Fighting for Peace
**Production:** Rig 360 Media
**Type:** Feature-length documentary — journalism conducted on the ground
**Duration:** ~70 minutes
**Release Year:** 2026 (to confirm)

**What the film actually is:**
A feature-length documentary by Rig 360 Media — approximately 70 minutes of journalism conducted on the ground in Kashmir, not from a studio, not from a distance. The journalist is present. The camera is present. The people are present.

**It is NOT a political film.** It does not argue for India or Pakistan. It does not glorify soldiers or demonize militants. It does not simplify.

**What it does:** Places the camera in front of ordinary human beings — fathers, daughters, officers, militants, grieving mothers, young girls on bicycles — and asks them to speak. Then it listens. What emerges is the full, unresolved, unbearable human cost of a conflict that has been running for decades and has learned to consume everything it touches — beauty, faith, family, youth, and peace itself.

**The film's central contradiction (in its title):** *Fighting for Peace.* You cannot fight for peace without the fighting itself becoming the wound.

**The film's core duality (the design brief in one sentence):**
> Kashmir is one of the most beautiful places on earth. And it is quietly, persistently, generationally bleeding. Both of these things are true at the same time. Neither cancels the other out.

**The film's structural anchors (the people whose interviews recur):**
- A captured Pakistani militant whose ideology collapses in custody
- Multiple grieving fathers whose sons were taken by militancy
- Police and army officers — including the officer who counts saved, not killed
- The Sikh officer's daughter — targeted killing, surviving family
- The fallen police officer's father — losing a son in service
- Young girls on bicycles — the ordinary life that continues
- The surrender scene — parents calling their sons home in mother tongue

**Closest comparable films:** Citizenfour, The Act of Killing, Making a Murderer, VICE News long-form documentaries

**What the website must feel like:**
Not a movie marketing site. Not a news site. Not a political site. Not a war movie site. Not a grief tourism site. **A digital extension of the film itself** — built to honor specific human beings whose lives the film documents.

**Target user:**
Indians, Kashmiris, international viewers — anyone the film exists for. Not casual viewers. People who care about Kashmir and want to understand what the headlines do not capture.

**The bar (from the master brief — apply this to every decision):**
> Does this honor the father who accepted his son's death? The mother who keeps asking where her son is? The girls who just want to ride bikes? The officer who wants to count saved, not killed? The daughter who lost her father because someone looked at a row of buses and chose his?
>
> Not: does this look like a serious documentary website. The bar is human, not aesthetic.

---

## 2. WHAT FAILED BEFORE — CRITICAL LESSONS

### The Failed Attempt (archived, do not reference its code)
The previous frontend used React Three Fiber with Genshin Impact / Studio Ghibli stylized 3D aesthetics — turquoise lakes, toon-shaded mountains, lotus pads, animated grass. It was technically impressive. The owner rejected it immediately as "childish and cartoony" and ordered a complete restart.

### Why It Failed
1. **Visual direction was never validated before building.** Weeks of engineering before the owner saw anything.
2. **Wrong aesthetic register entirely.** Stylized 3D game aesthetics are incompatible with a serious conflict documentary.
3. **3D spectacle was chosen over storytelling.** The technology drove the design instead of the story driving the technology.
4. **No phase gates.** There were no checkpoints where the owner approved a direction before the next phase began.

### Rules That Must Not Be Broken
- **Never build more than one phase ahead of a validated approval.** Show it, get a yes, then continue.
- **Never choose a technology because it looks impressive.** Choose it because it serves the story.
- **Never hardcode content, values, colors, or configuration.** Everything must be configurable.
- **Always wireframe first, mockup second, code third.**
- **Always ask before assuming anything about tone, color, or visual language.**

---

## 3. TONE, AESTHETIC & EMOTIONAL DIRECTION

### The Feeling — The Central Duality

This film holds **one truth above all others**, and the website must hold the same truth:

> **Kashmir is one of the most beautiful places on earth. And it is quietly, persistently, generationally bleeding. Both of these things are true at the same time. Neither cancels the other out.**

The beauty does not make the grief easier. The grief does not make the beauty less real. They exist together — in permanent, unresolved coexistence — in the same mountains, the same streets, the same morning light, the same families.

This duality is the design brief. Every visual choice, every color decision, every animation, every layout — must carry the coexistence of beauty and grief. Not alternating between them. Both. Simultaneously.

**Not:** beautiful-only, magical, warm, playful, colorful, light, gamified, futuristic, tech-forward, celebratory, triumphant, resolved.

**Yes:** dark AND saffron-touched, somber AND alive, weighted AND human, journalistic AND cinematic, raw AND dignified.

**The site is almost entirely dark.** Saffron Ember and Snow White do all the work of light. Dull Crimson appears so rarely (3–4 times across the entire site) that it stops the viewer when it appears.

### Reference Aesthetic Directions (Research These Before Designing)
These are directions to study and draw inspiration from — not to copy. Study BOTH tiers — the archival weight AND the raw urgency:

**Tier 1 — Historical Weight & Investigative Journalism:**
1. **NYT Snow Fall (2012)** — `nytimes.com/projects/2012/snow-fall` — the original scrollytelling masterpiece. Immersive, typographic, image-driven, narrative scroll.
2. **FRONTLINE (PBS)** — `pbs.org/frontline` — investigative, dark palette, serious journalism, strong typography.
3. **The Intercept** — `theintercept.com` — investigative journalism aesthetic, bold sans-serif, dark, no-nonsense.
4. **Human Rights Watch** — `hrw.org` — serious, factual, strong photography, purpose-driven design.
5. **Pitch Interactive "Out of Sight, Out of Mind"** — drone strikes visualization. Data made emotional.
6. **The Guardian Interactives** — documentary-grade interactive journalism.
7. **Hollow Documentary** — `hollow.documentary.com` — interactive documentary, community voices, data + story.

**Tier 2 — Raw Urgency & Ground Truth Energy:**
8. **VICE News** — `vice.com/en/topic/vice-news` — raw, on-the-ground, dangerous-feeling journalism. This film shares VICE's DNA.
9. **Citizenfour film site** — Snowden documentary. Classified-document aesthetic, tension, paranoia, truth.
10. **Netflix Making a Murderer** — multi-perspective investigative storytelling, the viewer builds understanding gradually.
11. **The Act of Killing** — interviews with perpetrators of violence treated with unflinching directness.
12. **4DOCS / POV Documentary** — `pov.documentary.com` — activist documentary web presence, urgent, purpose-driven.

### Color Palette (LOCKED — from master brief)

| Name | Hex | Role | Why |
|---|---|---|---|
| Midnight Kashmir | `#0A0C0F` | Primary background | The darkness of night operations and grief — near-black with cold blue undertone |
| Deep Slate | `#111418` | Surface / panels | Slightly lifted — cards, interview panels, content areas |
| Saffron Ember | `#C97B2B` | Primary accent | Kashmir saffron — warmth surviving inside darkness. Key headlines, hover states, the beauty side of the duality |
| Snow White | `#E8EDF2` | Body text | Cold-white like Kashmir snow on a clear day |
| Ash | `#3A3F47` | Borders / dividers | Quiet structural elements — never decorative |
| Dull Crimson | `#7A1F1F` | Loss / conflict marker | Used 3–4 times on the entire site. Never decoration. Only where loss is being specifically acknowledged. Its rarity is its power. |
| Muted Sage | `#4A5C4A` | Nature / terrain tie | Landscape-connected elements — the green of Kashmir's valleys, subdued |
| Film Grain | `#FFFFFF` @ 4% | Grain texture overlay | Ties the digital to the documentary's raw footage. Always present. |

**Color rule:** If you are reaching for a bright color for visual interest — stop. The interest comes from content, not decoration.

### Typography (LOCKED — from master brief)

**Display — Playfair Display (serif)**
- Used for: film title, major section headers, pull quotes of maximum emotional weight
- Treatment: large, tracked in all-caps for power statements; large italic for emotional moments
- Why: carries the gravity and age of a place with centuries of history; the serif acknowledges the artisanal culture the film documents (Scene 2 — Kashmir's craftsmen)

**Body — DM Sans**
- Used for: all body copy, interview excerpts, descriptive text, navigation
- Treatment: clean, journalistic, direct — no decorative font choices in the reading layer
- Why: journalistic clarity — the film is journalism and the reading experience must feel like serious, respectful reporting

**Utility — Space Mono (monospace)**
- Used for: scene labels, timestamps, military codes, technical overlays, caption metadata, person roles (FATHER. OFFICER. SOLDIER.)
- Treatment: small, tracked, all-caps
- Why: the radio codes of Scene 1 (delta, MGL, position numbers) — this typeface carries the raw dispatch energy of field reporting

**Type scale:**
- Hero title: 96–120px Playfair Display, tracked
- Section headers: 48–64px Playfair Display
- Pull quotes: 32–40px Playfair Display italic
- Body: 16–18px DM Sans, 1.7 line height
- Captions / labels: 11–13px Space Mono, tracked, all-caps

**Note:** The previous brief listed Cormorant Garamond / Libre Baskerville / Courier Prime / Inter. Those are **superseded.** The locked stack is Playfair Display / DM Sans / Space Mono.

### Animation & Motion Philosophy
**Every animation must earn its existence. Ask: what does this movement say about Kashmir?**

**Two motion registers — use both deliberately:**

**Register 1 — Slow & Weighted (for history, timeline, overview):**
- Content surfaces like documents being excavated from an archive
- Slow fade + subtle rise (translateY 30px → 0, 0.9s, ease-out)
- Text appears word by word or line by line — testimony being transcribed
- Section transitions are deliberate, never rushed
- Nothing bounces, springs, or feels playful

**Register 2 — Sharp & Urgent (for trailer, conflict moments, action sequences):**
- Quick cuts between perspectives — sharp fade transitions (0.2s)
- The trailer section opens with impact, not a gentle fade
- Conflict timeline events can have a harder, faster entrance
- Map pins for conflict events pulse like a heartbeat — urgent, alive
- News feed header feels like a live ticker — motion implies real-time

**Rules that apply to both registers:**
- No gratuitous animation — if removing it loses nothing, remove it
- Performance always comes first — jank destroys everything
- `prefers-reduced-motion` must be respected — provide CSS fallbacks
- Scroll is a journey through time — moving forward = moving forward in history

### Interaction Philosophy
- Every interactive element should reward curiosity
- Hovering over a timeline event should feel like opening a sealed classified file
- Hovering over a conflict event should feel slightly more tense than a political event
- Clicking a map location should feel like traveling there — to a real place where something real happened
- The trailer should feel like the first time you see something you cannot unsee
- The buy/rent action should feel like gaining access to truth, not purchasing entertainment
- The news feed should feel like a live wire — real, current, potentially dangerous information

---

## 4. COMPLETE BACKEND API REFERENCE

**Base URL (development):** `http://localhost:8000`
**All routes prefixed:** `/api`
**Backend stack:** FastAPI (Python), runs on port 8000

### 4.1 Health Check
```
GET /health
Response: { "status": "ok" }
```
Use this to check backend connectivity before showing any data-dependent UI.

---

### 4.2 Documentary Module — `/api/documentary/`

#### GET /api/documentary/overview
Returns the documentary's core identity data.

```json
{
  "title": "Kashmir: Untold Echoes",
  "tagline": "A land caught between paradise and pain.",
  "synopsis": "An unflinching documentary tracing Kashmir's journey through centuries of beauty, conflict, and resilience...",
  "director": "Your Name",
  "duration_minutes": 95,
  "release_year": 2026,
  "trailer_url": "https://www.youtube.com/embed/YOUR_TRAILER_ID",
  "poster_url": "/static/poster.jpg",
  "genres": ["Documentary", "History", "Political"]
}
```

**Frontend uses:** Hero section, documentary overview section, SEO metadata, page title.
**Note:** `trailer_url` and `poster_url` are placeholders — design UI to gracefully handle missing/placeholder values.

---

#### GET /api/documentary/timeline
Returns all historical events in chronological order.

```json
{
  "events": [
    {
      "year": 1339,
      "title": "Shah Mir Dynasty Founded",
      "description": "Shah Mir establishes the first Muslim dynasty in Kashmir...",
      "category": "political",
      "image_url": null,
      "lat": 34.08,
      "lng": 74.79,
      "place": "Srinagar"
    }
    // ... 13 more events
  ]
}
```

**Current events (14 total):**
| Year | Title | Category | Location |
|------|-------|----------|----------|
| 1339 | Shah Mir Dynasty Founded | political | Srinagar |
| 1586 | Mughal Conquest | political | Srinagar |
| 1819 | Sikh Rule Begins | political | Kashmir Valley |
| 1846 | Treaty of Amritsar | political | Jammu |
| 1947 | Partition & First Kashmir War | conflict | Srinagar |
| 1948 | UN Ceasefire & Resolution | political | Kashmir |
| 1965 | Second Kashmir War | conflict | Uri Sector |
| 1987 | Disputed Elections | political | Srinagar |
| 1989 | Insurgency Begins | conflict | Kashmir Valley |
| 1999 | Kargil War | conflict | Kargil |
| 2008 | Amarnath Land Row & Mass Protests | political | Srinagar |
| 2016 | Burhan Wani's Death & Unrest | conflict | South Kashmir |
| 2019 | Article 370 Revoked | political | Srinagar |
| 2024 | First Elections Post-370 | political | J&K |

**Categories:** `political` | `conflict` | `cultural` | `humanitarian`
**Category colors (reference only — confirm with user):**
```
political:     #C4922A  (gold)
conflict:      #8B1A1A  (red)
cultural:      #4A7A5E  (dark green)
humanitarian:  #4A5F8A  (muted blue)
```

**Frontend uses:** Timeline section, interactive map, chapter navigation.
**Important:** More events will be added. Never hardcode the count (14). Always render from API response. The timeline is designed to eventually extend back to ancient Kashmir origins (pre-1339) — architecture must support years in the range 500–2100.

---

#### GET /api/documentary/timestamps
Returns documentary chapter markers for the video player.

```json
{
  "markers": [
    {
      "timestamp_seconds": 0,
      "title": "Opening — Paradise on Earth",
      "description": "Aerial shots of Kashmir Valley. Dal Lake at dawn.",
      "chapter": "Prologue"
    }
    // ... 9 more markers
  ]
}
```

**10 markers total, spanning:**
Prologue → Origins (0:03, 0:10) → Empire & Control (0:20) → Partition (0:30) → Conflict (0:45) → Insurgency (1:00) → Human Stories (1:15) → Present Day (1:25) → Epilogue (1:30)

**Frontend uses:** Documentary video player chapter navigation bar.

---

### 4.3 News Module — `/api/news/`

#### GET /api/news/feed
Returns live Kashmir news aggregated from multiple sources.

```json
{
  "articles": [
    {
      "headline": "Article headline text",
      "brief": "Truncated summary up to 35 words...",
      "source_name": "Greater Kashmir",
      "source_url": "https://...",
      "image_url": "https://... or null",
      "published_at": "2026-06-08T10:30:00Z",
      "category": "local"
    }
  ],
  "last_updated": "2026-06-08T11:00:00Z"
}
```

**Sources aggregated:**
1. Greater Kashmir (`local`)
2. Kashmir Observer (`local`)
3. The Wire — security section (`security`)
4. NDTV — India news (`national`)
5. Al Jazeera — all news (`international`)

**Fallback:** NewsAPI if RSS feeds return < 5 articles.
**Cache:** 15 minutes TTL. Show `last_updated` in UI.
**Max articles:** 30 per response.
**Categories:** `local` | `security` | `national` | `international` | `general`

**Frontend uses:** Live news section with filtering by category.
**UX consideration:** Articles may have no image. Design cards to work with and without images. Show relative timestamps ("2 hours ago"). Link opens source URL in new tab.

---

### 4.4 Social Media Module — `/api/social/`

#### GET /api/social/feed
#### GET /api/social/feed?platform=instagram
#### GET /api/social/feed?platform=twitter

```json
{
  "posts": [
    {
      "platform": "instagram",
      "author": "Kashmir Valley Journal",
      "author_handle": "@kashmirvalleyjournal",
      "author_avatar": "https://... or null",
      "content": "Post text content...",
      "media_url": "https://... or null",
      "post_url": "https://instagram.com/...",
      "likes": 4821,
      "comments": 234,
      "shares": 0,
      "posted_at": "2026-06-08T09:00:00Z"
    }
  ],
  "last_updated": "2026-06-08T11:00:00Z",
  "total": 8
}
```

**Platforms:** `instagram` | `twitter`
**Real data:** Via Apify scrapers (requires API token in `.env`)
**Fallback:** 8 curated mock posts (4 Instagram, 4 Twitter) — always available without API key
**Cache:** 30 minutes TTL

**Frontend uses:** Social feed section with platform toggle (All / Instagram / Twitter).
**UX consideration:** `shares` is always 0 for Instagram (platform doesn't expose it). `media_url` may be null. Avatar may be null — use a placeholder. Numbers format: 4821 → "4.8K".

---

### 4.5 Payment Module — `/api/payment/`

**Documentary access price:** ₹299 INR
**Payment provider:** Razorpay

#### Flow (must be implemented exactly):

**Step 1 — Create order:**
```
POST /api/payment/create-order
Body:    { "email": "user@example.com", "name": "User Name" }
Returns: { "order_id": "order_xxx", "amount": 29900, "currency": "INR", "razorpay_key_id": "rzp_xxx" }
```

**Step 2 — Open Razorpay modal:**
Use `razorpay_key_id` and `order_id` to open Razorpay's JavaScript checkout widget. The amount is in paise (29900 = ₹299).

**Step 3 — Verify payment:**
```
POST /api/payment/verify
Body:    { "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }
Returns: { "verified": true, "access_token": "jwt_token_here", "message": "Payment verified" }
```

**Step 4 — Store JWT token:**
Store `access_token` in localStorage. It expires in 1440 minutes (24 hours).

**Step 5 — Verify access on load:**
```
GET /api/payment/verify-access
Header: Authorization: Bearer <token>
Returns: { "valid": true, "expires": 1234567890 }
```
Call this on every page load. If valid, show documentary player. If not, show payment gate.

**Frontend uses:** "Watch Now" CTA, payment modal, documentary player access gate.
**Important:** The Razorpay script must be loaded dynamically (`<script src="https://checkout.razorpay.com/v1/checkout.js">`). In development without real Razorpay keys, the payment flow will fail gracefully — design for this with a dev-mode bypass.

---

### 4.6 Environment Variables (Backend `.env` — for reference only)
```
APIFY_API_TOKEN=           # Apify scraper for real social posts
RAZORPAY_KEY_ID=           # Razorpay public key
RAZORPAY_KEY_SECRET=       # Razorpay secret (server-side only, never expose)
NEWS_API_KEY=              # NewsAPI.org fallback key
JWT_SECRET=                # JWT signing secret
DOCUMENTARY_PRICE_INR=299  # Configurable price
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
```

---

## 5. WEBSITE STRUCTURE — PAGES & SECTIONS

**Page architecture: single page (`/`) — all 9 sections live on one scrollable home page.**

The site reuses **the original reference website's section structure** (Hero → Overview → Timeline → Map → News → Social → Watch → Player → Footer). We are not deconstructing the film into film-derived sections. The 9 sections below are LOCKED. The aesthetic and interaction layer is what makes it unforgettable — not the structure.

The Live Feed (news + social) lives inline on the home page as Sections 5 and 6. **There is no separate `/feed` page** unless we decide to break it out later.

---

### Section 1 — HERO

**Visible by default:** Film title, tagline, primary CTA, secondary CTA, scroll cue, navigation bar.

**Layout:** Full viewport (100vh). Cinematic Kashmir photography or video as backdrop (dark-graded, not tourist beauty). Heavy vignette, film grain overlay (4–6% opacity, always on).

**Content:**
- Title: **KASHMIR — FIGHTING FOR PEACE** (Playfair Display, 88–120px, Snow White)
- Production line: `A FILM BY RIG 360 MEDIA` (Space Mono, small caps)
- Tagline: italic Playfair Display, Saffron Ember at 80%
- Primary CTA: **WATCH THE FILM** (filled — Saffron Ember background, dark text)
- Secondary CTA: **EXPLORE** (outlined Snow White)
- Scroll cue at bottom: animated 1px vertical line + `SCROLL` label in Space Mono

**Responsive Aliveness (interactivity):**
- Backdrop has slow parallax against cursor (0.3× cursor position)
- Cursor follows with a soft warm light circle (~100px radius, low opacity Saffron Ember glow) — *visible on all content, never hiding anything*
- Hovering individual title letters: each letter lifts 2px and glows briefly
- Primary CTA: constant ambient pulse (every 8s); on hover, glow intensifies and scale 1.02
- Secondary CTA: underline grows from 0→100% width on hover
- Idle state: scene gently breathes (very subtle ambient motion)

**Entrance choreography (page load):**
```
0.0s   Background image fades in (1.2s)
0.6s   Grain + vignette appear
1.0s   Title letter-spacing collapses from wide → final, opacity 0→1 (0.9s)
1.8s   Tagline fades up from translateY(8px) (0.7s)
2.4s   CTAs fade in, stagger 0.15s (0.6s each)
3.0s   Scroll cue appears, starts breathing pulse
```

**Data from:** `GET /api/documentary/overview` (title, tagline) — or local content module if backend not yet updated for new film identity (see Backend Data Mapping Note below)

---

### Section 2 — DOCUMENTARY OVERVIEW (The Film)

**Visible by default:** Film poster, synopsis paragraph, metadata row, genre badges, trailer button.

**Layout:** Two columns (60/40 desktop, stacked mobile). Left = film poster (dark, serious — not a Bollywood marketing poster). Right = film identity.

**Content (right column):**
- Small label: `THE FILM` in Space Mono small caps, Saffron Ember
- Synopsis paragraph (Libre Baskerville/DM Sans body — 16px, line-height 1.8, Snow White)
- Metadata row: `Director  ·  ~70 min  ·  2026  ·  Documentary`
- Genre tags as small outlined badges
- Trailer button: **WATCH TRAILER →** (only shown if `trailer_url` is real, not placeholder)

**Responsive Aliveness:**
- Poster has subtle 3D tilt on cursor position (max 4° each axis, 200ms inertia) — *not a parallax shift, a tilt of the surface itself*
- Synopsis paragraph: each sentence has its own subtle fade-in as the user scrolls past it
- Metadata items: faint divider lines slide into place when section enters viewport
- Genre badges hover: badge outline thickens, background fills with 8% Saffron Ember
- Trailer button: constant soft glow; on hover, glow intensifies and a faint play-icon ripple emits from cursor position
- Click trailer: dark modal overlay fades in (0.4s), YouTube iframe embeds (autoplay disabled), close on Escape or outside click

**Data from:** `GET /api/documentary/overview`

---

### Section 3 — HISTORICAL TIMELINE

**Visible by default:** All timeline events rendered as cards in chronological order, fully readable.

**Layout:** Vertical scroll. Each event renders as a card with year (large), title, description, location, and category color marker. Section header above: `685 YEARS OF HISTORY` (Space Mono) above `KASHMIR THROUGH TIME` (Playfair Display, 56px).

**Filter:** Category tabs at top — `ALL | POLITICAL | CONFLICT | CULTURAL | HUMANITARIAN` (Space Mono small caps).

**Event card structure (visible always):**
```
┌─────────────────────────────────────────────┐
│ [CATEGORY]                            YEAR   │
│ ──────────────────────────────────────────── │
│ Event Title                                  │
│ Description text...                          │
│ 📍 Place name                                │
└─────────────────────────────────────────────┘
```

- Left border: 3px solid, category color (conflict=Dull Crimson, political=Saffron Ember, cultural=Muted Sage, humanitarian=Kashmir mist blue)
- Year: Playfair Display, 64–80px, right-aligned, category color
- Card background: Deep Slate

**Responsive Aliveness:**
- Cursor proximity to card: card illuminates from Deep Slate to slightly lifted shade
- Hover: card lifts 4px (translateY), left border opacity 30% → 100%, year scales 1.05, faint connecting lines briefly appear to other events of the same category
- Click: card expands inline to reveal full description, optional image, and `VIEW ON MAP →` link that scrolls to Section 4 and highlights this event's pin
- Filter change: non-matching cards fade to 15% opacity and collapse height smoothly (400ms ease); matching cards reflow
- Each year number subtly counts up from 0 → actual year when it first enters viewport (one-time animation)

**Architecture:** Always render from API array. Never hardcode. Support year range 500–2100 (timeline may extend to ancient Kashmir).

**Data from:** `GET /api/documentary/timeline`

---

### Section 4 — INTERACTIVE MAP

**Visible by default:** Kashmir map fully visible with all event pins plotted from the start.

**Layout:** Full-width section, 65vh height. Section header above: `THE GEOGRAPHY OF CONFLICT`.

**Map style:** Dark cartographic — CartoDB Dark Matter tile layer OR custom WebGL terrain rendering (Phase 2 upgrade path — see Section 13). Pins as custom SVG markers, not default Leaflet markers.

**Pin design:**
- Conflict: Dull Crimson circle with slow heartbeat pulse (3 expanding rings, infinite, ~1Hz)
- Political: Saffron Ember diamond
- Cultural: Muted Sage circle
- Humanitarian: Kashmir mist blue circle
- Default size: 12px; hover size: 18px

**Filter:** Same category filter as Section 3 — synced state (changing one filter changes both).

**Responsive Aliveness:**
- Cursor over the map: subtle illumination on the area beneath the cursor (radial gradient mask)
- Hover a pin: pin scales 1.5×, tooltip floats above showing year + event title
- Click a pin: side panel slides in from right with full event detail (Playfair title, full description, category badge, `VIEW IN TIMELINE →` link)
- Category filter: non-matching pins fade out (opacity → 0.1), matching pins remain at full opacity
- Events with `lat: null` / `lng: null`: excluded from map, listed below in a small "Events without location data" section

**Data from:** `GET /api/documentary/timeline` (same data as Section 3, different view)

---

### Section 5 — LIVE NEWS FEED

**Visible by default:** All news article cards rendered in a grid, fully readable.

**Layout:** Section header `FROM THE GROUND` (Space Mono, Saffron Ember small caps) + `KASHMIR TODAY` (Playfair Display 48px). `LAST UPDATED X MIN AGO` indicator top right with pulsing dot. Filter bar: `ALL | LOCAL | SECURITY | NATIONAL | INTERNATIONAL`. 3-column grid → 2 tablet → 1 mobile.

**Card structure:**
- Image (16:9, lazy-loaded) or dark pattern placeholder if `image_url` is null
- Source name + relative timestamp (Space Mono small caps, muted)
- Headline (Playfair Display, 18–22px, Snow White)
- Brief (DM Sans 14px, Aged Paper / secondary)
- `READ →` link in Saffron Ember

**Responsive Aliveness:**
- Cards enter staggered on section entry (0.1s stagger between rows)
- Subtle ambient breathing motion (cards drift ±2px vertically on a slow random cycle, offset per card)
- Hover: card lifts 6px, image brightens 10%, source badge brightens, `READ →` arrow translates +6px right
- Click → opens source URL in new tab
- Filter change: smooth grid reflow with fade

**States:**
- Loading: 6 skeleton cards matching real card dimensions (200ms minimum display)
- Error: "Unable to load news. Check connection." + retry button
- Empty: "No recent articles found."

**Auto-refresh:** Every 15 minutes (matching backend cache TTL).

**Data from:** `GET /api/news/feed`

---

### Section 6 — SOCIAL MEDIA FEED

**Visible by default:** All social posts rendered as cards in a grid (masonry or fixed).

**Layout:** Section header `THE VOICES` (Space Mono, Saffron Ember small caps) + `KASHMIR ONLINE` (Playfair Display 48px). Platform toggle: `ALL | INSTAGRAM | TWITTER` (pill buttons with sliding Saffron Ember active indicator). 3-column masonry desktop → 2 tablet → 1 mobile.

**Card structure:**
- Avatar (40px circle, placeholder if null) + author + handle + platform icon (top right)
- Media image (if `media_url` not null)
- Post content (truncated at 280 chars, "Read more →" if longer)
- Engagement row: `♥ 4.8K · 💬 234 · ↻ 412` (formatted numbers)
- Timestamp (relative)

**Responsive Aliveness:**
- Each card has very subtle floating motion (translateY ±3px, 4–6s cycle, offset per card)
- Hover: card lifts 4px, engagement numbers pulse upward by 1px, platform icon brightens to 100% opacity, slight border glow
- Click anywhere on card → opens `post_url` in new tab
- Platform toggle: cards reflow with physics (300ms ease, not instant)

**Edge cases:**
- `shares` field hidden for Instagram (platform doesn't expose it)
- `author_avatar` null: show silhouette placeholder
- `media_url` null: card renders text-only, no broken image

**States:**
- Loading: 6 skeleton cards
- Fallback: 8 curated mock posts always available (no Apify token required)

**Data from:** `GET /api/social/feed` (+ `?platform=instagram|twitter` when filter is active)

---

### Section 7 — WATCH / PAYMENT GATE

**Visible by default:** Film access offer with poster, price, value proposition, CTA. OR (if JWT is valid) the documentary player directly.

**Two states:**

**State A — Unverified (no valid JWT in localStorage):**
- Section header: `WATCH THE DOCUMENTARY` (Playfair Display 56px)
- Left: film poster (smaller variant) with subtle 3D tilt on cursor
- Right: short value proposition (3–4 lines max) — *"A film that demands to be seen"*
- Price block: **₹299** (Playfair Display 80px, Saffron Ember) + `ONE-TIME ACCESS` (Space Mono small caps)
- (Optional, if approved) Buy/Rent split: Rent ₹99 (48hrs) | Buy ₹299 (lifetime)
- CTA: **WATCH NOW** (filled gold button, constant ambient pulse every 8s)

**State B — Verified (JWT valid via `GET /api/payment/verify-access`):**
- Skip directly to Section 8 (Player) — gate section is hidden or shows brief "ACCESS GRANTED" indicator

**Responsive Aliveness:**
- WATCH NOW button: constant ambient warm glow; hover intensifies glow + 1.02 scale
- Click → opens form modal (email + name fields) → on submit, calls `POST /api/payment/create-order` → opens Razorpay JS checkout widget
- On Razorpay success: calls `POST /api/payment/verify` → stores JWT in localStorage → fade transition into State B (player visible)
- On failure: clear error message + retry option

**Razorpay integration:**
- Script loaded dynamically: `<script src="https://checkout.razorpay.com/v1/checkout.js">` injected via useEffect
- Amount in paise from API response (29900 = ₹299) — never hardcoded
- Order ID from `/create-order` response — never generated client-side

**Dev mode bypass:**
- `NEXT_PUBLIC_DEV_MODE=true` shows a small "SKIP PAYMENT (DEV)" link below the CTA
- Never visible in production builds

**Data from:**
- `GET /api/payment/verify-access` (on page load, with Authorization header if JWT exists)
- `POST /api/payment/create-order` (on Watch Now click)
- `POST /api/payment/verify` (after Razorpay callback)

---

### Section 8 — DOCUMENTARY PLAYER

**Visible by default (only after JWT verified):** Video player + chapter navigation.

**Layout:** Full-width player (16:9, max-width 1200px, centered). Chapter timeline below.

**Player:** `react-player` library — handles YouTube, Vimeo, native video uniformly. Driven by `trailer_url` (placeholder handling: show film poster + "Coming Soon" overlay if URL is placeholder).

**Chapter navigation:**
- Horizontal strip below the player
- Each chapter rendered as a small glowing dot + timestamp `mm:ss` + chapter name
- Active chapter highlighted with Saffron Ember + slight pulse
- Click a chapter → seeks video to `timestamp_seconds`
- As video plays, active chapter updates automatically based on currentTime

**Chapter card structure:**
```
[●] 03:00 — Origins
[ ] 10:00 — Mughal Era
[ ] 20:00 — Empire & Control
...
```

**Responsive Aliveness:**
- Hover a chapter dot: chapter title and description float above in a tooltip
- Click chapter: smooth seek + active state transitions
- Player has subtle dark vignette around it to focus attention
- Mist gently returns at the section edges (we are watching, but we have not left Kashmir)

**Data from:** `GET /api/documentary/timestamps`

---

### Section 9 — FOOTER

**Visible by default:** Film title, tagline, quick links, copyright, social links (if available).

**Layout:** Minimal, dignified. Centered.

**Content:**
- Film title: **KASHMIR — FIGHTING FOR PEACE** (Playfair Display)
- Tagline below (Playfair italic)
- Quick links row: `FILM | TIMELINE | MAP | NEWS | SOCIAL | WATCH` (Space Mono small caps)
- Social links to official accounts (if provided)
- Copyright: `© 2026 Rig 360 Media. All rights reserved.`
- Final italic line: *"Same sky. Same soil. Both truths."*

**Responsive Aliveness:**
- Link hover: thin Ash underline grows from left to right over 0.4s
- The whole section emerges from black as user scrolls down — the mist closes back over Kashmir at the very end

---

### NAVIGATION BAR

Fixed top. Transparent over hero, lifts to `rgba(11,11,15,0.92)` + `backdrop-filter: blur(16px)` after scroll.

**Links:** `FILM · TIMELINE · MAP · NEWS · SOCIAL · WATCH`
**Right side:** **WATCH NOW** CTA button (gold)
**Mobile:** Hamburger → full-screen dark overlay menu

**Responsive Aliveness:**
- Active section indicator: a thin Saffron Ember underline (1–2px) **slides** smoothly between links as user scrolls between sections
- Hover a link: faint glow + underline grows
- Logo / title on left: hover causes slight letter-spacing animation

---

### BACKEND DATA MAPPING NOTE

The existing FastAPI backend has hardcoded film data referring to the *previous* film identity ("Kashmir: Untold Echoes" with 14 historical events 1339–2024). For this new film **Kashmir — Fighting for Peace**, two options:

| Option | What it means |
|---|---|
| **A — Update backend hardcoded data** | Edit `app/services/documentary_data.py` in `Reference-Original` (or a working copy of it) to return Fighting for Peace identity + the film's actual chapter timestamps. Backend continues to be the single source of truth. |
| **B — Local content module** | Keep backend unchanged for now. Drive film identity (Hero, Overview) + chapter data from a local typed module: `src/content/film.ts`. Backend remains source of truth for **timeline events, news, social, payment** — which are unchanged. |

**Recommendation:** **Option B for first launch** — fastest, lowest risk, keeps the read-only Reference-Original folder untouched. Film identity content is small and rarely changes; a typed local module is appropriate. Backend swap is one-file later.

The timeline events (Section 3 + 4) can stay as the existing 14 historical events — that data is still relevant background context for the film and doesn't conflict with the new identity. (Confirm with user.)

---

## 6. TECH STACK

### Frontend Framework
**Next.js 14+ (App Router)**

Why: SSR/SSG for SEO on a documentary site matters. The reference used Vite + React with no SSR. Next.js gives better performance, better SEO, and is the industry standard for content-driven sites.

### Core Libraries
```
next                    # Framework
react + react-dom       # UI
tailwindcss             # Styling (utility-first, no hardcoded CSS values)
gsap + @gsap/react      # Scroll animations, timeline reveals, cinematic transitions
@studio-freight/lenis   # Smooth scrolling (silky, cinematic feel)
framer-motion           # Component-level animations, page transitions
```

### Map
```
leaflet + react-leaflet  # Interactive map with dark tile layer
# OR
react-simple-maps        # SVG-based map (lighter, more customizable)
```
Decide based on visual direction. Leaflet gives real geography. SVG maps give more design control.

### Data Fetching
```
swr OR react-query (@tanstack/react-query)  # Client-side data fetching with caching
```
Use SWR for simplicity, React Query for more complex caching needs.

### Video Player
```
react-player  # Handles YouTube, Vimeo, native video uniformly
```

### Payment
```
# Load Razorpay script dynamically — no npm package needed
# Use useEffect to inject <script> tag
```

### Fonts
```
next/font/google  # Load fonts through Next.js (no layout shift)
```

### Utilities
```
date-fns            # Date formatting (relative times, timestamp formatting)
clsx / cn utility   # Conditional classNames
```

### Development
```
typescript          # Type safety throughout
eslint              # Code quality
prettier            # Formatting
```

---

## 7. ARCHITECTURE & MODULARITY RULES

### Folder Structure
```
Kashmir-Documentary-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx            # Home page (assembles all sections)
│   │   └── globals.css         # Global styles, CSS variables
│   ├── components/
│   │   ├── layout/             # Nav, Footer
│   │   ├── sections/           # One component per page section (9 total)
│   │   │   ├── HeroSection.tsx              # Section 1 — film title, tagline, CTAs
│   │   │   ├── OverviewSection.tsx          # Section 2 — synopsis, poster, trailer
│   │   │   ├── TimelineSection.tsx          # Section 3 — historical timeline
│   │   │   ├── MapSection.tsx               # Section 4 — interactive Kashmir map
│   │   │   ├── NewsSection.tsx              # Section 5 — live news feed
│   │   │   ├── SocialSection.tsx            # Section 6 — Instagram + Twitter
│   │   │   ├── WatchSection.tsx             # Section 7 — payment gate / Razorpay
│   │   │   ├── PlayerSection.tsx            # Section 8 — gated player + chapters
│   │   │   └── FooterSection.tsx            # Section 9 — minimal footer
│   │   ├── effects/            # Reusable effect components (swappable: CSS ↔ WebGL)
│   │   │   ├── CursorGlow/                  # cursor following light
│   │   │   │   ├── CursorGlow.css.tsx       # Phase 1 — CSS implementation
│   │   │   │   ├── CursorGlow.webgl.tsx     # Phase 2 — WebGL implementation
│   │   │   │   └── index.ts                 # Selects active impl via effects-config
│   │   │   ├── AmbientMist/                 # background atmosphere
│   │   │   ├── ResponsiveCard/              # cards that come alive on hover
│   │   │   └── ScrollChoreography/          # GSAP scroll-driven sequences
│   │   ├── ui/                 # Reusable primitives (Button, Card, Badge, Skeleton)
│   │   └── common/             # Shared complex components (EventCard, PostCard, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTimeline.ts      # Fetches + manages timeline data
│   │   ├── useNewsFeed.ts      # Fetches + manages news
│   │   ├── useSocialFeed.ts    # Fetches + manages social posts
│   │   ├── useDocumentary.ts   # Fetches overview + timestamps
│   │   └── usePaymentAccess.ts # JWT verification, payment flow
│   ├── lib/
│   │   ├── api.ts              # All API calls (single source of truth)
│   │   ├── config.ts           # All configuration (URLs, keys, feature flags)
│   │   └── utils.ts            # Formatters, helpers
│   ├── types/
│   │   └── api.ts              # TypeScript interfaces matching backend schemas
│   └── styles/
│       └── tokens.css          # Design tokens (colors, spacing, typography as CSS vars)
├── public/
│   ├── fonts/                  # Any self-hosted fonts
│   └── images/                 # Static images
├── .env.local                  # Local environment variables
├── .env.example                # Template (commit this, not .env.local)
└── next.config.js
```

### The No-Hardcoding Rule (CRITICAL)

**Everything configurable must live in `src/lib/config.ts`:**
```typescript
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoints: {
      overview: '/api/documentary/overview',
      timeline: '/api/documentary/timeline',
      timestamps: '/api/documentary/timestamps',
      news: '/api/news/feed',
      social: '/api/social/feed',
      paymentCreate: '/api/payment/create-order',
      paymentVerify: '/api/payment/verify',
      paymentAccess: '/api/payment/verify-access',
    }
  },
  payment: {
    currency: 'INR',
    // Price comes from API, never hardcode ₹299
  },
  social: {
    platforms: ['instagram', 'twitter'] as const,
    defaultFilter: 'all',
  },
  news: {
    categories: ['local', 'security', 'national', 'international', 'general'] as const,
    refreshInterval: 15 * 60 * 1000, // 15 minutes
  },
  player: {
    storageKey: 'kashmir_access_token',
  }
}
```

**Design tokens must live in CSS variables (LOCKED palette + type from master brief):**
```css
/* src/styles/tokens.css */
:root {
  /* Color — from master brief, do not invent new values */
  --color-midnight-kashmir: #0A0C0F;   /* primary background */
  --color-deep-slate: #111418;          /* surface / panels */
  --color-saffron-ember: #C97B2B;       /* primary accent — beauty */
  --color-snow-white: #E8EDF2;          /* body text */
  --color-ash: #3A3F47;                 /* borders / dividers */
  --color-dull-crimson: #7A1F1F;        /* loss marker — use 3–4x total */
  --color-muted-sage: #4A5C4A;          /* terrain / nature tie */
  --color-grain: rgba(255, 255, 255, 0.04);

  /* Type — Playfair Display / DM Sans / Space Mono */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  /* Scale */
  --type-hero: clamp(64px, 8vw, 120px);
  --type-section: clamp(40px, 5vw, 64px);
  --type-pullquote: clamp(28px, 3vw, 40px);
  --type-body: 17px;
  --type-label: 12px;
}
```

Never write `color: #C97B2B` in a component. Always `color: var(--color-saffron-ember)`.

### API Layer — Single Source of Truth
All API calls in `src/lib/api.ts`. No fetch() calls scattered in components.

```typescript
// src/lib/api.ts
export const api = {
  documentary: {
    getOverview: () => fetch(`${config.api.baseUrl}${config.api.endpoints.overview}`).then(r => r.json()),
    getTimeline: () => fetch(...).then(r => r.json()),
    getTimestamps: () => fetch(...).then(r => r.json()),
  },
  news: {
    getFeed: () => fetch(...).then(r => r.json()),
  },
  social: {
    getFeed: (platform?: string) => fetch(...).then(r => r.json()),
  },
  payment: {
    createOrder: (email: string, name: string) => ...,
    verifyPayment: (data: PaymentVerifyRequest) => ...,
    verifyAccess: (token: string) => ...,
  }
}
```

### TypeScript Types (must mirror backend schemas exactly)
```typescript
// src/types/api.ts

export interface DocumentaryOverview {
  title: string
  tagline: string
  synopsis: string
  director: string
  duration_minutes: number
  release_year: number
  trailer_url: string
  poster_url: string
  genres: string[]
}

export interface TimelineEvent {
  year: number
  title: string
  description: string
  category: 'political' | 'conflict' | 'cultural' | 'humanitarian'
  image_url: string | null
  lat: number | null
  lng: number | null
  place: string | null
}

export interface TimestampMarker {
  timestamp_seconds: number
  title: string
  description: string
  chapter: string | null
}

export interface SocialPost {
  platform: 'instagram' | 'twitter'
  author: string
  author_handle: string
  author_avatar: string | null
  content: string
  media_url: string | null
  post_url: string
  likes: number
  comments: number
  shares: number
  posted_at: string | null
}

export interface NewsItem {
  headline: string
  brief: string
  source_name: string
  source_url: string
  image_url: string | null
  published_at: string | null
  category: string | null
}

export interface PaymentCreateRequest {
  email: string
  name: string
}

export interface PaymentVerifyRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
```

---

## 8. INTERACTION & ANIMATION SPECIFICATION

### Scroll-Driven Narrative (GSAP ScrollTrigger)

The scroll is a timeline. As the user scrolls down, they move forward through history. Every reveal should feel like a discovery.

**Section entrance pattern (for all sections):**
```
Before scroll: opacity 0, translateY 40px
On enter (70% viewport):
  opacity: 0 → 1 (duration: 0.8s, ease: power2.out)
  translateY: 40px → 0 (duration: 0.8s, ease: power2.out)
```

**Timeline event reveal (staggered):**
Each event enters with a stagger of 0.12s. The year number animates last, counting up to the actual year.

**Hero section:**
- Film title: fade in from slight opacity, letter-spacing animates from wider to normal
- Tagline: delayed reveal, 0.4s after title
- CTA buttons: 0.6s after tagline

**Map pins:**
- Each pin appears with a brief pulse/ripple when the map section enters
- Conflict events: red pulse, 3 rings expanding and fading
- Political events: gold pulse

### Micro-interactions

**Timeline event hover:**
- Left border color transitions from category color at 30% to 100% opacity
- Background shifts slightly lighter (2% luminosity increase)
- Year text lifts 2px (subtle translateY)
- A thin underline slides in under the title

**News card hover:**
- Headline color brightens subtly
- Source badge lifts slightly
- "Read More →" appears from right with fade

**Social post hover:**
- Engagement numbers count up slightly (visual pulse)
- Platform icon becomes full opacity

**Watch button:**
- Pulse animation when idle (attention-drawing, but not annoying — every 8 seconds)
- On hover: background fills in, scale 1.02

**Map pin hover:**
- Pin scales up 1.2x
- Event preview card appears (title + year)

### Smooth Scroll (Lenis)
Configure Lenis for the entire page:
```javascript
const lenis = new Lenis({
  duration: 1.4,        // Slightly slower than default — more cinematic
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
})
```

### Loading States
All API-dependent sections must show skeleton loaders (not spinners).
- Skeleton: dark background with subtle shimmer animation
- Matches the shape of the real content
- 200ms minimum display time (prevent flash of skeleton on fast connections)

### Error States
All API-dependent sections must handle:
- Network failure: "Unable to load. Check connection." with retry button
- Empty response: "No content available." (not a crash)
- Partial failure: Show what loaded, indicate what failed

---

## 9. RESPONSIVE DESIGN REQUIREMENTS

**Breakpoints (Tailwind defaults):**
```
sm:   640px   (large phones)
md:   768px   (tablets)
lg:   1024px  (small laptops)
xl:   1280px  (desktops)
2xl:  1536px  (large screens)
```

**Desktop first** — design and build for 1280px+ first, then adapt down.

**Mobile adaptations:**
- Navigation: hamburger menu, full-screen overlay
- Hero: text scales down, image repositioned to focal point
- Timeline: vertical list only (no horizontal scroll on mobile)
- Map: reduced height, simplified interaction (click not hover)
- News/Social: single column cards
- Player: full width, chapter list collapses to accordion

**Performance on mobile:**
- Heavy animations disabled on `prefers-reduced-motion`
- Image lazy loading throughout
- No autoplay video on mobile

---

## 10. PERFORMANCE REQUIREMENTS

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 85 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total Bundle Size | < 500KB JS (gzipped) |

**Rules:**
- All images use `next/image` for automatic optimization
- Fonts loaded via `next/font/google` (no layout shift)
- API data fetched client-side with SWR (cached, no waterfalls)
- Code-split heavy sections (map, player) with `dynamic()` imports
- GSAP ScrollTrigger kills animations on unmount (no memory leaks)

---

## 11. QUESTIONS TO ASK BEFORE STARTING (MANDATORY)

Before designing or building anything, get answers to all of these from the user:

> The master brief (`KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md`) has locked the major decisions: palette, typography, section order, tone, the duality, the bar. The questions below cover what is still open.

### Film Assets
1. "Do we have the actual film stills, portraits of the interview subjects, and landscape footage from the production team yet? (The site is built around real Kashmir photography and real portraits — placeholders should be honest holding states until assets arrive.)"
2. "Is the trailer publicly hostable yet (YouTube/Vimeo) or should the WATCH section show a minimal *'The film is coming'* holding state for now?"
3. "Who are the specific people we should feature in THE VOICES section? Should their portraits use real frames from the film, or stylized portraits, or silhouettes for those who must remain anonymous?"

### Content Source
4. "For film content (Hero text, The Film synopsis, The Voices entries, The Story chapters, The Themes): start with a typed local content module (`src/content/film.ts`) so iteration is fast, then move to a CMS later? Or wire to the existing backend `/api/documentary/*` endpoints from day one (which would require updating the backend's hardcoded film data)?"

### Watch / Monetisation
5. "Is the Buy/Rent flow (₹99 rent · ₹299 buy) in scope for this build, or should WATCH stay as a trailer/holding section until distribution decisions are made?"
6. "Do you have Razorpay test keys? If not, payment UI ships with a clearly-labelled dev bypass."

### Live Feed Page
7. "Is the Live Feed page (`/feed`) in scope for the first launch, or do we ship the Home page first and add `/feed` in a second phase?"

### Technical
8. "Confirm Next.js 14+ (App Router) is the target framework."
9. "Confirm dev server port (default: 3000)."

### Phase 0 Validation Gate
10. "I will build a static HTML mockup of Section 1 (HERO) + Section 3 (DUALITY) before any React code, so the director can approve the visual register. OK to proceed?"

---

## 12. WORKFLOW DISCIPLINE — HOW TO WORK

### Phase Gates (MANDATORY)

Every phase must be shown to the user and approved before the next phase begins. No exceptions.

```
Phase 0:  Visual direction mockup (Claude Design / static HTML) → Director approves tone & palette
Phase 1:  Project setup (Next.js 14, Tailwind, tokens, fonts, content module, Lenis, GSAP, SWR)
Phase 2:  Section 1 — Hero (Responsive Aliveness layer 1: cursor glow, ambient motion) → Approved
Phase 3:  Section 2 — Overview (poster tilt, trailer modal) → Approved
Phase 4:  Section 3 — Timeline (event cards, category filter, hover/expand) → Approved
Phase 5:  Section 4 — Map (Leaflet base + custom pins + heartbeat pulse) → Approved
Phase 6:  Section 5 — News Feed (live data, filtering, breathing cards) → Approved
Phase 7:  Section 6 — Social Feed (live data, platform toggle, post cards) → Approved
Phase 8:  Section 7 — Watch / Payment (Razorpay integration + JWT flow) → Approved
Phase 9:  Section 8 — Player (gated, chapter navigation) → Approved
Phase 10: Section 9 — Footer + Navigation bar polish → Approved
Phase 11: Scroll choreography pass (GSAP ScrollTrigger across all sections)
Phase 12: Responsive pass (375 / 768 / 1280 every section)
Phase 13: Accessibility pass (prefers-reduced-motion, keyboard nav, screen reader, contrast)
Phase 14: Performance pass (Lighthouse, bundle size, image optimization)
Phase 15: Final QA + launch readiness
```

**After Phase 15 (the Phase 1 hybrid foundation is live):** Phase 2 selective WebGL upgrades can begin (see Section 13 — Build Path & Upgrade Strategy).

### The Development Loop (for each component/section)
1. **Understand** — What does this section show? What data does it use? What interactions exist?
2. **Wireframe** — Sketch the layout in words or a simple ASCII diagram
3. **Propose** — Tell the user what you're going to build before building it
4. **Build** — Implement the section
5. **Verify** — Check in the browser, check all states (loading, error, empty, populated)
6. **Show** — Share the result with the user before moving on

### What to Always Check Before Saying "Done"
- [ ] All API data rendered from fetch, nothing hardcoded
- [ ] Loading state shown while fetching
- [ ] Error state shown if fetch fails
- [ ] Empty state shown if no data returned
- [ ] Responsive at 375px (phone), 768px (tablet), 1280px (desktop)
- [ ] No console errors or warnings
- [ ] Animations work and don't cause jank
- [ ] `prefers-reduced-motion` respected
- [ ] All interactive elements have hover/focus states
- [ ] All links open in correct tab (external = new tab)

---

## 13. META-COGNITIVE FRAMEWORK — HOW TO THINK

As a frontend engineer on this project, you must always:

### Before Building Anything
- Ask: **Why does this exist?** What story does this section tell?
- Ask: **What is the user's emotional state** when they see this? What should they feel?
- Ask: **What can go wrong?** (API down, no data, slow connection, mobile device)
- Ask: **What am I assuming?** Challenge every assumption.

### When Designing
- Always propose 2-3 approaches before choosing one
- The simplest approach that achieves the goal is usually best
- If you're adding complexity, justify it with a user benefit
- If you're not sure about a design decision, ask — don't assume

### When Building
- Build the data layer first (API calls, types, hooks)
- Build the skeleton/structure second (HTML + Tailwind layout)
- Add styling and visual design third
- Add animations and interactions last
- Test each layer before adding the next

### When Something Feels Wrong
- Stop building immediately
- Describe what feels wrong
- Propose solutions before implementing any of them
- Get user confirmation before proceeding

### Always Have a Plan B
For every technical choice, know the alternative:
- If Leaflet map is too heavy → SVG map fallback
- If GSAP animation is janky → CSS transition fallback
- If API is unreachable → cached/static data fallback
- If Razorpay fails → graceful error with retry

---

## 14. THINGS THAT MUST NEVER HAPPEN

- **Never hardcode content** — all text that comes from the API must come from the API
- **Never hardcode prices** — ₹299 must come from the API/config, not written in JSX
- **Never write `color: #hexcode`** directly in components — use CSS variables
- **Never write `fetch()` inside a component** — all API calls in `src/lib/api.ts`
- **Never build a section without showing the user first**
- **Never skip error/loading/empty states** — they are not optional
- **Never use `any` type in TypeScript** — always properly type API responses
- **Never ignore mobile** — test at 375px for every section
- **Never autoplay video** with sound — always muted, always user-initiated
- **Never block the scroll** — smooth scroll must not interfere with browser back/forward

---

## 15. SCOPE — WHAT IS IN AND OUT OF THIS BUILD

### In Scope (Build This)
- [x] Complete single-page application (all 10 sections)
- [x] All 4 API integrations (documentary, timeline, news, social)
- [x] Payment flow (Razorpay integration)
- [x] Documentary player with chapter navigation
- [x] Interactive timeline with category filtering
- [x] Interactive map with event pins
- [x] Responsive design (desktop + mobile)
- [x] Loading/error/empty states
- [x] GSAP scroll animations
- [x] Dark documentary aesthetic

### Out of Scope (Later Phases)
- [ ] User accounts / authentication (beyond payment JWT)
- [ ] Comments or community features
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Admin panel for content management
- [ ] Email newsletter signup
- [ ] Push notifications
- [ ] PWA features

### The Architecture Must Support Future Addition Of:
- New timeline events (just add to backend — frontend renders automatically)
- New sections (modular component structure allows dropping in new sections)
- New API endpoints (api.ts layer is extendable)
- New languages (no hardcoded UI strings — all text extractable)
- CMS integration (content driven by API, not JSX)

---

## 12.5 · POST-PURCHASE ENHANCEMENT TIERS (locked priority)

These are the *visible deepenings* a film-watched user experiences. They are layered onto the same site, never a separate build. Tiers must ship complete and polished — no partial deliveries.

### TIER 1 — Ship first (defines the post-purchase experience)
1. **AFTER THE WATCH** — new section with periodic director's dispatches, additional short scenes, written notes. The single strongest retention driver.
2. **Timeline events get inline film quotes** — diverse application across every event, scattered through the chronology. The quintessential "designed twice" example made explicit.
3. **The Watch section transforms** — "Continue · New dispatches since you last visited" replaces the price/CTA. The site stops asking for a sale and becomes a destination.
4. **Map gains an interview-location layer** — anchors the film's people to real geography. Watched users see where each person they met actually lived.

### TIER 2 — Ship second (functional + content depth)
5. **Voices sub-section** — the actual interview subjects honored directly.
6. **Chapter list becomes navigable** — utility for revisiting specific scenes.
7. **"Last visit" indicator** — *"Three new dispatches since you were here."*
8. **"Continue where you left off"** in the player.

### TIER 3 — Ship third (atmospheric recognitions, subtle)
9. **Small saffron mark in nav corner** — persistent recognition.
10. **Cursor's mote becomes 1–2% warmer** — subconscious atmospheric shift.
11. **Time-of-day default shifts toward morning** — they have passed through the night.
12. **Mist density reduces 5%** — almost imperceptible clarity gain.

### TIER 4 — Future expansion (stretch goals, require additional production)
13. **Audio dispatches** — director's voice notes; requires real audio production.
14. **Quarterly director essay** — recurring content commitment.
15. **Anniversary moments** — date-aware infrastructure for 1947, 1989, 2019.
16. **Community contributions** — moderated submission infrastructure.

**Implementation rule:** Each tier ships complete. Tier 1 must feel inevitable and beautiful before Tier 2 begins. No partial tiers.

---

## 13. BUILD PATH — HYBRID FOUNDATION → SELECTIVE WEBGL UPGRADE

**The build is staged in three phases. Each phase is independently shippable. We can stop at any phase.**

### Phase 1 — Hybrid Foundation (initial build, weeks 1–N)

**Tech mix:** Next.js + React + Tailwind + CSS animations + GSAP + Lenis + minimal SVG/Canvas2D effects.

**What we get:** The full 9-section site, fully functional, fully responsive, with Responsive Aliveness interactions implemented in CSS/JS. Reaches ~80% of the Lusion-inspired wow factor. Production-ready.

**Risk:** Low. Proven technology, manageable scope, no heavy WebGL dependencies.

---

### Phase 2 — Selective WebGL Upgrades (post-launch enhancement)

**Approach:** One effect at a time. Each effect ships independently behind a feature flag.

**Candidate upgrades (in order of impact):**
1. **Cursor Glow** — CSS radial gradient → WebGL fragment shader with proper light falloff
2. **Map Terrain** — Leaflet tile layer → WebGL contour wireframe of Kashmir
3. **Ambient Mist** — CSS noise animation → volumetric fog shader with cursor reactivity
4. **Hero Backdrop** — static image + parallax → WebGL depth-of-field cinematic scene
5. **Page Transitions** — CSS fade → WebGL camera move between sections

Each is a self-contained component swap. None depend on each other.

**Risk:** Low-Medium per upgrade. Each can be reverted individually if it underperforms.

---

### Phase 3 — Full WebGL Composition (stretch goal, not committed)

**What it is:** Unifying the Phase 2 effects into a single continuous WebGL scene — true Lusion-grade cinematic camera through one persistent 3D world.

**Risk:** Medium. Highest ceiling. Only attempted if Phase 2 lands cleanly.

---

### Safety Net — Six Layers

To make this upgrade path real (not aspirational), the codebase from day one is architected with:

| Layer | What it does |
|---|---|
| **Feature flags** (`effects-config.ts`) | Each WebGL effect can be toggled on/off in production — instant rollback without redeploy |
| **Component swappability** | Every effect has both a CSS and a WebGL implementation behind the same interface. The section components never know which is active. |
| **Git branch per upgrade** | Each WebGL upgrade lives on its own feature branch. If it breaks, revert that branch only. Other upgrades stay live. |
| **Auto-fallback by device** | `detect-gpu` library tiers visitors. Low-tier GPUs automatically receive the CSS version. |
| **Visual regression tests** | Before any upgrade ships, screenshot tests compare new vs old. Any visual breakage blocks the merge. |
| **Live performance monitoring** | If real users drop below 50fps with WebGL on, the system auto-disables it for them and reports back. |

**Critical architecture rule:** Section components (`HeroSection`, `TimelineSection`, etc.) **never import WebGL libraries directly**. They use generic effect components (`<CursorGlow>`, `<AmbientMist>`) that internally choose CSS or WebGL based on the feature flag. This is what makes the upgrade path real instead of just a wish.

**Example:**
```typescript
// HeroSection.tsx — knows nothing about WebGL
import { CursorGlow, AmbientMist } from '@/components/effects'

export function HeroSection() {
  return (
    <section>
      <AmbientMist intensity="medium" />  {/* CSS in Phase 1, WebGL in Phase 2 */}
      <CursorGlow color="saffron-ember" /> {/* Same — swap impl, not interface */}
      <h1>KASHMIR — FIGHTING FOR PEACE</h1>
      {/* ... */}
    </section>
  )
}
```

---

## 14. WHAT ALWAYS STAYS THE SAME (regardless of phase)

These are constant across all phases — Phase 1 hybrid version and Phase 3 full WebGL version share all of these:

- The 9-section structure
- The Responsive Aliveness principle (content always visible)
- The visual tone (dark documentary, Midnight Kashmir palette, Playfair / DM Sans / Space Mono)
- The film grain overlay
- The backend API contracts (no API changes between phases)
- The content (text, data, copy)
- All accessibility features
- Mobile responsive layout

**The phases differ only in *how* effects are rendered, not what the user sees.**

---

## 15. THE LOCKED DECISIONS (as of 2026-06-09)

These are confirmed by the project owner and not subject to revision without explicit owner approval:

| Decision | Value |
|---|---|
| Film title | Kashmir — Fighting for Peace |
| Production | Rig 360 Media |
| Duration | ~70 minutes |
| Number of pages | 1 (single-page application) |
| Number of sections | 9 (Hero, Overview, Timeline, Map, News, Social, Watch, Player, Footer) |
| Section structure | Original reference website structure (LOCKED — no film-deconstruction) |
| Core design principles (2) | **The Living Atmosphere** (continuous Kashmir world, magical motion, never content-gating) AND **Designed Twice** (every element means one thing to a first-timer, more to someone who watched the film) |
| Purposefulness rule | Every element must align with the film's tone, have meaning, be useful, have purpose, add value. Anything failing this filter gets cut. |
| Visual ambition floor | Lusion-grade interactivity (https://lusion.co) with documentary-serious tone |
| Build path | Phase 1 Hybrid (CSS+light WebGL) first → Phase 2 selective WebGL upgrades → Phase 3 stretch goal |
| Color palette | Midnight Kashmir / Deep Slate / Saffron Ember / Snow White / Ash / Dull Crimson / Muted Sage |
| Typography | Playfair Display (display) / DM Sans (body) / Space Mono (utility) |
| Live news + social | Inline on home page (no separate /feed) |
| Tone | Dark, serious, documentary-grade, never bright/celebratory/playful |

---

## 16. THE MOST IMPORTANT THING — THE BAR

From the master brief (`KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md` Part Nine). Apply this test before publishing **any** section, animation, or copy choice:

> **Does this honor the specific humans in this film?**
>
> Not: does this look like a serious documentary website.
> Not: is this dark and cinematic enough.
> Not: is this technically impressive.
>
> **Does this honor the father who accepted his son's death? The mother who keeps asking where her son is? The girls who just want to ride bikes? The officer who wants to count saved, not killed? The daughter who lost her father because someone looked at a row of buses and chose his?**
>
> If yes — build it. If it just *looks* right but doesn't *feel* earned — go back. Find what is thin. Make it true.
>
> **The bar is not aesthetic. The bar is human.**

---

## APPENDIX A: BACKEND SETUP (for reference when integrating)

```bash
# Backend runs on Python 3.14 — use unpinned deps (pinned deps fail on 3.14)
# From Kashmir-Documentary-v2 or Reference-Original app folder:

python -m venv venv
venv/Scripts/pip install fastapi "uvicorn[standard]" httpx pydantic pydantic-settings python-dotenv razorpay feedparser beautifulsoup4 cachetools "python-jose[cryptography]" apscheduler

# Run backend:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# API docs available at:
# http://127.0.0.1:8000/docs
```

## APPENDIX B: ORIGINAL FRONTEND (for data reference only — DO NOT REUSE ANY CODE OR DESIGN)

The original frontend is a single `App.jsx` file (~80KB) using Vite + React 19 with no animation library, no TypeScript, no CSS framework. Its design uses dark background `#0a0f0a` with gold `#D4A853` accents and a Kashmir SVG map. **None of this code or design should be reused.** It exists only to confirm the data structures and API contract.

## APPENDIX C: FOLDER LOCATIONS ON THIS MACHINE

```
C:\Internship\Project Kashmir\
├── Kashmir-Documentary-v2\              ← THIS PROJECT — work here only
├── Reference-Original\                  ← READ ONLY (backend source of truth)
├── _Frontend_Stylized3D_Reference\      ← Old archived work (ignore for this project)
└── Kashmir_documentary-webpage-main.zip ← Backup zip (ignore)

Reference backend location:
C:\Internship\Project Kashmir\Reference-Original\Kashmir_documentary-webpage-main\app\

NEVER modify Reference-Original. NEVER push to GitHub.
Work is local only on this machine.
```

---

*Last updated: 2026-06-09 — aligned with `KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md`*
*The failed previous frontend: archived at `_Frontend_Stylized3D_Reference` — do not reference its code or design*

---

## APPENDIX D: REVISION LOG

**2026-06-09 (latest, same day) — Design philosophy rewritten after first prototype audit**

The first Claude Design prototype was audited and rejected. The audit honest verdict:
- Technically clean, but structurally identical to the reference original (same 9-section grid, same hero shape, same card layouts) — *we did not elevate, we reskinned*
- The map was decorative kidney-bean geometry, not meaningful Kashmir
- The interactivity borrowed Lusion's smallest details (cursor, easings) but missed Lusion's actual premise (continuous spatial world, not a polished document)
- No moment that could only exist for *this* film

The owner clarified the real intent — which led to the new design philosophy:
- **Replaced "Content is always visible. Interaction makes it alive."** with the new pair: **The Living Atmosphere** + **Designed Twice**
- The Living Atmosphere: site is one continuous Kashmir world, magic is in *how* content is presented/traversed/transitioned (not in gating it)
- Designed Twice: every element carries two meanings — one for first-timer, one for film-watched user
- Purposefulness Rule added on top: every element must align with film tone, have meaning, be useful, have purpose, add value
- New section added: **12.5 Post-Purchase Enhancement Tiers** with all 16 enhancements prioritized into 4 tiers
- New build approach: test the atmosphere FIRST (single hero-into-overview mockup) before building any other section. Failure of first prototype was building all 9 sections then evaluating; this time we prove the central feeling exists before extending.

**2026-06-09 (later, same day) — Section structure reset + design principle locked**
After exploring the film-deconstructed structure (Hero / Duality / Voices / Story / Themes / Closing Gallery from the Fighting for Peace brief), the owner decided to **revert to the original 9-section structure** from the reference website. The film-deconstructed sections felt like over-reach. The site is for promoting/selling the film and serving live Kashmir news, not for re-narrating the film.

Owner also brainstormed and confirmed:
- **Locked design principle:** *"Content is always visible. Interaction makes it alive."* (Rejected: hidden-content "Veil" metaphor — too effortful, fights film's purpose)
- **Visual ambition reference:** Lusion (https://lusion.co, https://labs.lusion.co) — that level of interactive polish, but with documentary-serious tone (not bright/celebratory)
- **Build path:** Phase 1 Hybrid (CSS + minimal WebGL — 80% of the wow, low risk) → Phase 2 selective WebGL upgrades effect-by-effect (with feature flags, component swap, git branches, auto-fallback, regression tests, performance monitoring as 6 safety layers) → Phase 3 full WebGL composition (stretch goal, not committed)

PROJECT_BRIEF.md updated:
- Section 5 (Website Structure): reverted to 9-section original structure (Hero, Overview, Timeline, Map, News, Social, Watch, Player, Footer) with full Responsive Aliveness interaction specs per section
- Section 7 (Folder Structure): updated component names back to original; added `effects/` directory with swappable CSS↔WebGL components
- Section 12 (Phases): 15 phases mapped to the 9-section structure + the upgrade path
- Section 13 (NEW): Build Path & Upgrade Strategy — Phase 1/2/3 with 6-layer safety net
- Section 14 (NEW): What Always Stays the Same (across all phases)
- Section 15 (NEW): The Locked Decisions table
- Top of file: companion-document hierarchy clarified (this file is authoritative for structure; Fighting for Peace brief retained for tone/film context only)

**2026-06-09 (earlier, same day) — Film identity locked**
The owner watched the actual film and produced raw scene-by-scene notes during the watch. Those notes became `KASHMIR_FIGHTING_FOR_PEACE_FRONTEND_BRIEF.md`. This file was updated:

- **Film title:** "Kashmir: Untold Echoes" → **Kashmir — Fighting for Peace**
- **Production:** added — Rig 360 Media
- **Duration:** 95 min → ~70 min
- **Color palette:** replaced — Midnight Kashmir / Saffron Ember / Snow White / Ash / Dull Crimson / Muted Sage
- **Typography:** replaced — Playfair Display / DM Sans / Space Mono (previous Cormorant/Baskerville/Courier/Inter superseded)
- **Initial section proposal:** film-deconstructed structure from the Fighting for Peace brief was tried — then rejected in the later revision above

The backend API contract (Section 4) is unchanged — those endpoints still exist and still work. The current backend hardcoded film data refers to the *previous* film identity; see Section 5 ("Backend Data Mapping Note") for the two options to handle this.
