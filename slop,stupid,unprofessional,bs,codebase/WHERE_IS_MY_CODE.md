## Where is the migrated code (Next.js)?

All pages now live as **real Next.js App Router routes** under `src/app/*`.

The old `public/*.html` files were **legacy copies** and are intentionally removed.

### How each page is structured

- **`page.tsx` (Server Component)**: contains the **HTML → JSX** skeleton and the **inline `<style>`** (copied 1:1).
- **`*Client.tsx` (Client Component)**: runs the original page JavaScript (IIFE) inside `useEffect` so all DOM manipulation/GSAP/maps/store logic works the same.

### Routes → files

- **`/` (Landing)**
  - `src/app/page.tsx` (JSX)
  - `src/components/HomeClient.tsx` (original `main.ts` + `animations.ts` logic wrapped)

- **`/book`**
  - `src/app/book/page.tsx` (JSX + inline CSS)
  - `src/app/book/BookClient.tsx` (original inline script wrapped)

- **`/checkout`**
  - `src/app/checkout/page.tsx` (JSX + inline CSS)
  - `src/app/checkout/CheckoutClient.tsx` (original inline script wrapped)

- **`/confirmation`**
  - `src/app/confirmation/page.tsx` (JSX + inline CSS)
  - `src/app/confirmation/ConfirmationClient.tsx` (original inline script wrapped)

- **`/track`**
  - `src/app/track/page.tsx` (JSX + inline CSS)
  - `src/app/track/TrackClient.tsx` (original inline script wrapped)

- **`/profile`**
  - `src/app/profile/page.tsx` (JSX + inline CSS)
  - `src/app/profile/ProfileClient.tsx` (original inline script wrapped)

### Shared “global” scripts (loaded for all pages)

These are loaded in `src/app/layout.tsx` with `beforeInteractive` so the execution order matches the original:

- `/src/maps-env.js`
- `/src/maps-config.js`
- `/src/maps-estimates.js`
- `/src/store.js`

### Static assets (images / videos / svg)

Next.js serves these from `public/` by design:

- `public/assets/**` → available at `/assets/**`

