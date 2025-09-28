# Vadis — Next.js App Router Project

A modern, type-safe web app for creators, brands, and investors. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **lucide-react** — backed by a **Flask API**.

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Scripts](#scripts)
* [Project Structure](#project-structure)
* [Key Features & Routes](#key-features--routes)
* [UI Conventions](#ui-conventions)
* [API Layer](#api-layer)
* [Types](#types)
* [State, Data Fetching & Caching](#state-data-fetching--caching)
* [Styling](#styling)
* [Icons](#icons)
* [Forms & Validation](#forms--validation)
* [Loading, Empty & Error States](#loading-empty--error-states)
* [Authentication (Placeholder)](#authentication-placeholder)
* [Testing (Recommended)](#testing-recommended)
* [CI/CD (Recommended)](#cicd-recommended)
* [Performance](#performance)
* [Accessibility](#accessibility)
* [Troubleshooting](#troubleshooting)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui components
* **Icons:** lucide-react
* **Data:** Fetch to external **Flask** backend (server & client components)
* **Linting/Formatting:** ESLint + Prettier
* **Package Manager:** `pnpm` (recommended) or `npm`/`yarn`

---

## Prerequisites

* **Node.js** ≥ 18.17 (Next.js requirement)
* **pnpm** ≥ 8 (or npm/yarn)
* Running **Flask API** for server calls (endpoints listed below)

---

## Getting Started

```bash
# 1) Install deps
pnpm install

# 2) Configure environment
cp .env.example .env.local
# then edit .env.local (see variables below)

# 3) Run dev server
pnpm dev
# http://localhost:3000
```

---

## Environment Variables

Create `.env.local` (not committed). Example:

```env
# Base URL of your Flask backend
NEXT_PUBLIC_API_BASE=http://localhost:5000

# If you proxy API requests via Next:
API_PROXY_ENABLED=false
API_PROXY_TARGET=http://localhost:5000
```

**Notes**

* `NEXT_PUBLIC_*` variables are exposed to the browser; keep secrets server-side.
* If deploying on Vercel, configure these in the Vercel project settings.

---

## Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

---

## Project Structure

```
.
├─ app/                         # App Router
│  ├─ layout.tsx                # Root layout (global shell)
│  ├─ page.tsx                  # Root route (Landing / Dashboard)
│  ├─ brand/                    # Brand routes (UI strictly per design)
│  │  └─ page.tsx
│  ├─ investor/                 # Investor routes
│  │  └─ page.tsx
│  ├─ creator/                  # Creator routes
│  │  ├─ page.tsx
│  │  └─ Project/[id]/page.tsx  # Dynamic project page
│  ├─ (shared)/components/      # Route-group for shared layouts if used
│  └─ api/                      # Optional Next API routes (proxy/edge)
├─ components/                  # Reusable UI components
│  ├─ cards/
│  ├─ tables/
│  ├─ layout/
│  └─ ui/                       # shadcn/ui wrappers if extended
├─ lib/
│  ├─ api/                      # API clients per domain
│  │  ├─ brands.ts
│  │  ├─ creator.ts
│  │  ├─ investor.ts
│  │  ├─ finance.ts
│  │  └─ requests.ts
│  ├─ hooks/                    # Reusable hooks (client-only)
│  │  ├─ useQueryParams.ts
│  │  └─ useIsClient.ts
│  ├─ types/                    # Centralized TypeScript types
│  │  ├─ brand.ts
│  │  ├─ creator.ts
│  │  ├─ project.ts
│  │  ├─ finance.ts
│  │  └─ common.ts
│  └─ utils/                    # Helpers (fetcher, formatters, cn, etc.)
├─ public/                      # Static assets
├─ styles/                      # Tailwind globals
│  └─ globals.css
├─ .eslintrc.cjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ next.config.js
```

---

## Key Features & Routes

### Brand

* **Deal management UI** exactly per Figma.
* Delete deal (triggers Flask):

  * `DELETE /brands/deals` with `creatorEmail`, `projectId`, `brandId`.

### Investor

* Investor dashboard UI per Figma.
* Table/metrics/cards with responsive height handling (see layout guidance below).

### Creator

* **Projects grid/cards** with poster/preview/metrics/tags/budget.

  * Cards with missing poster show a soft color block.
  * Missing preview text shows “No preview available yet”.
* Clicking a project:

  * `router.push(\`creator/Project/${p.id}?${q}`)`
* **Deck panel**

  * Generate pitch deck (Flask):

    * `POST /project/pitch-deck/generate` with `{ userEmail }`
* **Scenes**

  * Save scene changes:

    * `POST /scene/save` with `{ userEmail, projectId, sceneId, title, content }`
  * Marked as **not analyzed** on save (server behavior).

### Requests / Leads

* “Request a demo” form:

  * `POST /requests/new` with lead fields:

    * `firstName, lastName, org, email, region, role, phone, source?`

### Trailers

* Create trailer request:

  * `POST /trailers/request` with `{ userEmail, projectId }`

### Finance

* Finance bundle fetch (UI & skeletons included).
* Investment table repurposed from finance progress; adjusted headings.

> All UI is **App Router** compliant, **strictly following the design** with reusable components, types, and hooks.

---

## UI Conventions

* **Layouts & Screens**

  * Root layout manages full-height app shell. Use `className="min-h-dvh"` (or `min-h-screen` fallback).
  * Page sections should avoid double scroll; prefer **one scroll container** per viewport with `overflow-hidden` on wrappers and `overflow-auto` on content panes.

* **Cards**

  * Rounded `2xl`, soft shadows, adequate padding.
  * Poster preview area (when missing): render a neutral/soft placeholder.

* **Tables**

  * Consistent column alignment.
  * Compact density with accessible row focus states.

---

## API Layer

All API calls to Flask live under `lib/api/*.ts`. Each function:

* Uses `fetch` with `NEXT_PUBLIC_API_BASE`.
* Properly sets method, headers, and handles JSON/form.
* Normalizes error shapes `{ ok: boolean; error?: string }`.

**Examples**

```ts
// lib/api/creator.ts
export async function generatePitchDeck(userEmail: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/project/pitch-deck/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail })
  });
  return res.json();
}

// lib/api/scenes.ts
export async function saveScene(payload: {
  userEmail: string;
  projectId: string;
  sceneId: string;
  title: string;
  content: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/scene/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// lib/api/brands.ts
export async function deleteBrandDeal(params: {
  creatorEmail: string;
  projectId: string;
  brandId: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/brands/deals`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  return res.json();
}
```

---

## Types

Centralize types in `lib/types/*`. Examples:

```ts
// lib/types/project.ts
export type Project = {
  id: string;
  title: string;
  posterUrl?: string;        // optional: drives placeholder
  previewText?: string;      // optional: drives “No preview available yet”
  metrics: {
    views: number;
    likes: number;
  };
  tags: string[];
  estimatedBudget?: number;
};

// lib/types/brand.ts
export type BrandDeal = {
  id: string;
  brandId: string;
  name: string;
  category: string; // enforce non-optional to match UI expectations
  value: number;
  status: "pending" | "active" | "completed" | "canceled";
};
```

**Tip:** If you get:

```
Type 'BrandDealRow[]' is not assignable to type 'BrandDeal[]'
```

map/normalize upstream fields (e.g., ensure `category` is a non-optional string).

---

## State, Data Fetching & Caching

* **Server Components** by default for SEO and performance.
* **Client Components** (with `"use client"`) for:

  * hooks: `useSearchParams`, `useRouter`
  * interactive tables/filters
* **Suspense** + `<Skeleton />` for loading.
* For frequently-changing data, consider `revalidate: 0` or client fetch with SWR/React Query (optional).

---

## Styling

* Tailwind configured in `tailwind.config.ts`.
* Global styles in `styles/globals.css`.
* Use `class-variance-authority` (via shadcn) for consistent variants where needed.
* Prefer utility classes; extract to components when patterns repeat.

---

## Icons

Using **lucide-react**:

```tsx
import { Plus, X, Trash2 } from "lucide-react";

<Plus className="h-4 w-4" aria-hidden />
```

---

## Forms & Validation

* Use shadcn/ui inputs + labels for accessible forms.
* Client-side validation via Zod (recommended).
* Server returns `{ ok: false, error: string }` shape — render inline error banners.

---

## Loading, Empty & Error States

* **Loading:** skeletons for cards, tables, and metrics.
* **Empty:** friendly prompts and CTAs (e.g., “No preview available yet”).
* **Error:** toast/banner with retry. Log to console in dev, silence in prod.

---

## Authentication (Placeholder)

If auth is required, add middleware or providers (e.g., NextAuth.js) and secure API calls server-side. Protect routes using layouts that gate content.

---

## Testing (Recommended)

* **Unit:** Vitest or Jest + React Testing Library
* **E2E:** Playwright
* **Type:** `pnpm type-check` in CI

---

## CI/CD (Recommended)

* GitHub Actions workflow:

  * Install → Lint → Type-check → Build
* Protect `main` with required checks.

---

## Performance

* Opt into **Partial Prerendering** where beneficial.
* Image optimization via `<Image />` for posters.
* Avoid client runtimes unless needed.
* Memoize heavy lists; use `React.useMemo` and `key` discipline on tables.

---

## Accessibility

* Use semantic elements, proper headings, and `aria-*` for interactive controls.
* Ensure focus states are visible.
* Color contrast meets WCAG AA.

---

## Troubleshooting

### `useSearchParams() should be wrapped in a suspense boundary`

* **Cause:** Using client hooks in App Router without Suspense.
* **Fix:**

  * Mark file `"use client"`.
  * Wrap the subtree with `<Suspense fallback={<YourSkeleton />}>...</Suspense>`.
  * Or move logic to a client child component inside a server page.

### “Pages have inconsistent heights / double scroll”

* Make **one** scroll container per screen:

  * In layout: `className="min-h-dvh flex flex-col overflow-hidden"`
  * For content: `className="flex-1 overflow-auto"`
* Avoid nested `overflow-auto` on both sidebar and content; let sidebar be fixed within the grid and scroll only the content region.

### Type mismatches (e.g., optional fields)

* Normalize API responses in the API layer before passing to UI.
* Prefer strict non-optional types for displayed fields; coerce defaults (e.g., `category ?? "Uncategorized"`).

### CORS issues against Flask

* Enable CORS on Flask or proxy via Next (configure `API_PROXY_ENABLED` and Next rewrites).

---

## Deployment

### Vercel

* Add env vars in Vercel dashboard.
* Ensure Flask is reachable from Vercel (public URL or private network).
* Build command: `pnpm build`
* Start: `next start` (handled by Vercel)

### Self-hosting

* `pnpm build && pnpm start`
* Serve with reverse proxy (Nginx) and set `NEXT_PUBLIC_API_BASE` accordingly.

---

## Contributing

1. Create a feature branch from `main`.
2. Keep PRs small and focused.
3. Add or update component stories/tests if applicable.
4. Run:

   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   ```

---

## License

Copyright © Vadis.
All rights reserved. (Or update with your chosen license.)

---

### Appendix — Known Flask Endpoints (consumed by this app)

* `POST /project/pitch-deck/generate` → generate PDF deck
* `POST /scene/save` → save scene `{ userEmail, projectId, sceneId, title, content }`
* `POST /trailers/request` → create trailer request `{ userEmail, projectId }`
* `DELETE /brands/deals` → delete brand deal `{ creatorEmail, projectId, brandId }`
* `POST /requests/new` → create “request a demo” lead

