# Mitsat & Bemnet — Wedding Invitation

A premium, editorial wedding invitation built with React, TypeScript, Tailwind CSS v4 and Framer Motion, with a bilingual (English / አማርኛ) experience throughout: a cinematic hero, a mechanical split-flap countdown, an Ethiopian (Meskerem 2019 E.C.) calendar section, event details, a guestbook ("Leave Your Wishes") backed by MongoDB, and a minimal closing section.

## Colors

- Warm Champagne Cream — `#F4D9AD` (dominant surface)
- Champagne Accent — `#EED7AC`
- Deep Forest Green — `#304B38` (primary contrast)
- Darker Forest Green — `#233A2B`
- Muted Taupe — `#A89575`

## Typography

- **English** — Cormorant Garamond (high-contrast serif, display) + Space Grotesk (letter-spaced sans, labels/UI)
- **Amharic** — "Bela Bereka" (titles/headings) + "Benaiah" (body). Drop the licensed font files into `public/fonts/` as `BelaBereka.woff2` / `Benaiah.woff2` (or `.ttf`) and they are picked up automatically; until then the site falls back to Google-hosted Noto Serif/Sans Ethiopic.
- Amharic gets a dedicated typographic scale (larger sizes, taller line-height, no uppercase tracking) — see the `html[lang="am"]` rules in `src/index.css`.

## Language

A fixed EN / አማ switch (upper right) toggles every visible string via `src/i18n.tsx` (React context + dictionary). The choice is persisted in `localStorage` and reflected on `<html lang>`, which drives the Amharic font + spacing system.

## Project structure

```
mitsat-bemnet/
├── src/                            # React client (Vite)
│   ├── assets/                     # Wedding photographs (local, bundled)
│   ├── config/images.ts            # Photo list, focal points, hero order
│   ├── i18n.tsx                    # LangProvider + EN/አማ dictionary
│   ├── components/
│   │   ├── LanguageSwitch.tsx      # Fixed EN / አማ pill
│   │   ├── Hero.tsx                # Cinematic pinned hero + slideshow
│   │   ├── Countdown.tsx           # Mechanical split-flap countdown (2x2 on mobile)
│   │   ├── EthiopianCalendar.tsx   # Meskerem 2019 E.C. calendar
│   │   ├── EventDetails.tsx        # Date / church / time invitation card
│   │   ├── WishesForm.tsx          # Guestbook form (POST /api/wishes)
│   │   ├── Footer.tsx
│   │   ├── ScrollProgress.tsx      # Thin scroll-progress hairline
│   │   ├── Reveal.tsx              # Scroll reveal helper
│   │   └── Ornament.tsx            # Diamond divider motif
│   ├── hooks/useMedia.ts           # Reduced-motion preference hook
│   ├── App.tsx
│   ├── index.css                   # Tailwind v4 theme + Amharic type system
│   └── main.tsx
├── server/                         # Express + Mongoose API
│   ├── models/WeddingWish.js
│   ├── routes/wishes.js
│   ├── server.js
│   ├── .env                        # Real credentials (gitignored, never commit)
│   └── .env.example
└── package.json
```

## Getting started

### 1. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set your real MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/...
PORT=5000
```

Then start the API:

```bash
npm run dev
```

The server listens on `http://localhost:5000` and exposes:

- `POST /api/wishes` — store a guestbook wish
- `GET /api/wishes` — list stored wishes
- `GET /api/health` — health check

Validation is enforced server-side: name required (trimmed, <= 100 chars), wish required (trimmed, <= 1000 chars). Requests are rejected with clear 400/503 responses, and basic rate limiting is applied.

> Note: `server/.env` in this checkout still contains a placeholder `<db_username>` in the connection string. Replace it with the real database username before the wishes form can persist to MongoDB.
>
> The URI uses the **non-SRV** `mongodb://` seed-list format (not `mongodb+srv://`) because `mongodb+srv://` requires DNS SRV lookups, which fail on some networks/routers (`querySrv ECONNREFUSED`). If you regenerate the string from Atlas, choose the "Node.js driver 2.2.12 or later" option and swap `mongodb+srv://` for the three-host `mongodb://` format above.

### 2. Frontend

In the project root:

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`). In development, `/api` requests are proxied to `http://localhost:5000` via `vite.config.ts`.

To point the client at a deployed API, set `VITE_API_URL` in a root `.env`:

```
VITE_API_URL=https://your-api.example.com
```

### 3. Production build

```bash
npm run build   # type-checks and bundles the client into dist/
```

## Photos

Add or reorder photos by placing them in `src/assets` and updating `src/config/images.ts`. Six wedding photographs ship with the project and are bundled locally — no external image URLs.

The countdown targets **September 20, 2026 at 15:00 local time (3:00 PM — ከቀኑ ፱ ሰዓት)**. Update `WEDDING_DATE` in `src/components/Countdown.tsx` if the schedule changes.

## Accessibility

- Semantic HTML, labelled form fields, ARIA on the language switch and timers
- Keyboard navigation (hero slideshow arrows, focus-visible styles)
- Touch-friendly hero slideshow controls
- `prefers-reduced-motion` respected — pinning, parallax and flips are disabled; real values are still communicated in text
- High-contrast cream/green palette; Amharic typography is tuned for Ethiopic legibility

## Security notes

- MongoDB credentials live only in `server/.env` (gitignored), never in client code or committed files
- The client never sees the connection string; it only talks to the Express API
- Server-side validation, request size limit, and rate limiting are applied