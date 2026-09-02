# Mitsat & Bemnet — Wedding Invitation

A premium, digital-first wedding invitation built with React, TypeScript, Tailwind CSS, Framer Motion and MongoDB. The site opens like a physical envelope sealed with a molten-wax "CLICK HERE" stamp, then unfolds into a complete invitation: hero, flip-board countdown, venue details, an editorial photo gallery, a guestbook ("Leave Your Wishes") backed by MongoDB, and a minimal closing section.

## Colors

- Deep Forest Green — `#405842`
- Warm Champagne Cream — `#F3D9B3`

## Project structure

```
mitsat-bemnet/
├── src/                        # React client (Vite)
│   ├── assets/                 # Wedding photographs (local, bundled)
│   ├── config/images.ts        # Gallery configuration (edit to reorder images)
│   ├── components/
│   │   ├── Envelope.tsx        # Envelope + wax seal opening experience
│   │   ├── WeddingHero.tsx     # "We are celebrating OUR WEDDING"
│   │   ├── Countdown.tsx       # Flip-board countdown to Sept 20, 2026
│   │   ├── FlipUnit.tsx        # Single mechanical split-flap display
│   │   ├── VenueSection.tsx    # Date / church / time
│   │   ├── WeddingMessage.tsx  # "A Day to Remember"
│   │   ├── PhotoGallery.tsx    # Editorial asymmetric gallery
│   │   ├── Lightbox.tsx        # Accessible fullscreen viewer
│   │   ├── WishesForm.tsx      # Guestbook form (POST /api/wishes)
│   │   ├── Footer.tsx
│   │   ├── Reveal.tsx          # Scroll reveal helper
│   │   └── Ornament.tsx        # Decorative divider
│   ├── App.tsx
│   ├── index.css               # Tailwind v4 theme + design tokens
│   └── main.tsx
├── server/                     # Express + Mongoose API
│   ├── models/WeddingWish.js
│   ├── routes/wishes.js
│   ├── server.js
│   ├── .env                    # Real credentials (gitignored, never commit)
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

The countdown targets **September 20, 2026 at 09:00 local time**. Update `WEDDING_DATE` in `src/components/Countdown.tsx` if the schedule changes.

## Accessibility

- Semantic HTML, labelled form fields, ARIA on the lightbox and envelope
- Keyboard navigation (lightbox arrows/Escape, focus-visible styles)
- `prefers-reduced-motion` respected — envelope choreography and flips are skipped; real values are still communicated in text
- High-contrast cream/green palette

## Security notes

- MongoDB credentials live only in `server/.env` (gitignored), never in client code or committed files
- The client never sees the connection string; it only talks to the Express API
- Server-side validation, request size limit, and rate limiting are applied