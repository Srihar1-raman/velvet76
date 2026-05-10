# Velvet Experience

Private chauffeur service for Delhi NCR and IGI Airport.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- A Google Maps JavaScript API key (with Maps, Places, Directions APIs enabled)

### Setup

```bash
# Install dependencies
bun install

# Copy env file and add your API key
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building

```bash
bun run build
bun run start
```

### Optimize images (convert to WebP)

```bash
bun run optimize-assets
```

This converts all JPG/PNG assets in `public/assets/` to WebP for faster load times.

## Routes

| Route | Description |
|---|---|
| `/` | Scrolling landing page — all sections |
| `/reserve` | Standalone booking island for ad campaigns |
| `/book` | Full booking flow (journey → tier → confirm) |

## Tech Stack

- **Next.js 15** (App Router, React 19)
- **Bun** (package manager + runtime)
- **Tailwind CSS v4** (CSS-first config)
- **GSAP** (all animations)
- **Google Maps JS API** (`@vis.gl/react-google-maps` + vanilla JS for compatibility)
- **Zod** (booking state validation)
- **Lucide React** (icons)

## Environment Variables

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

Required for: maps, autocomplete, distance/duration estimates.  
The app works without it — maps show a placeholder and location inputs fall back to plain text fields.
