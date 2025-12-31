# EIPs Insights — Newcomer Code Guide

Welcome! This guide helps new contributors understand how the EIPs Insights codebase is organized, where to look first, and what to learn next.

## 1. What this project is
EIPs Insights is a Next.js web app for browsing and exploring Ethereum Improvement Proposals (EIPs). It provides searchable/filterable EIP lists and detailed EIP views with metadata (status, author, description), plus links to official sources.

---

## 2. Top-level structure (repo root)
These files set up the app and build system:

- **Next.js & build config:**
  `next.config.mjs`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `middleware.ts`, `vercel.json`
  (core build, routing middleware, and deployment)

- **Dependencies & scripts:**
  `package.json` defines scripts (`dev`, `build`, `start`, `lint`, `create-admin`, `migrate-blogs`) and the dependency stack (React + Next.js + UI libs + charts + data tooling).

---

## 3. Application structure (`src/`)

### Routing
This repo uses **both** routing systems:
- **App Router:** `src/app/`
  Contains `layout.tsx`, `globals.css`, providers, and error pages.
- **Pages Router:** `src/pages/`
  Large set of routes (e.g., `eip/`, `erc/`, `analytics/`, `profile/`, etc.) and `_app.tsx`.

### Shared UI & data layers
- **`src/components/`** — shared UI components
- **`src/services/`** — service/data-fetching logic
- **`src/models/`, `src/userModels/`** — domain models
- **`src/stores/`** — state management (Redux is present in deps)
- **`src/hooks/`**, **`src/utils/`**, **`src/lib/`** — utilities & hooks
- **`src/data/`** — data sources or fixtures
- **`src/constants/`** — shared constants

---

## 4. Key dependencies to be aware of
The codebase uses a large UI and data stack:
- **UI frameworks:** Chakra UI, MUI, Radix, Tailwind
- **Charts/visualization:** Chart.js, D3, Recharts, AntV
- **State/data:** Redux, React Query, Axios
- **Other:** NextAuth, Supabase, MDX tooling

---

## 5. Useful scripts
From `package.json`:
- `npm run dev` — local dev server
- `npm run lint` — linting
- `npm run create-admin` — admin creation
- `npm run migrate-blogs` — blog migration

---

## 6. Suggested learning path for new contributors
1. **Routing:**
   Start with `src/app/layout.tsx` and a couple of major pages in `src/pages/` to understand navigation and layout.
2. **UI building blocks:**
   Explore `src/components/` to see how common elements are assembled.
3. **Data flow:**
   Read `src/services/` + `src/models/` to learn how EIP data is fetched and shaped.
4. **State management:**
   Check `src/stores/` for app-level state patterns.
5. **Utilities & hooks:**
   Browse `src/hooks/` and `src/utils/` for reusable logic patterns.

---

## 7. Where to add new work
- **New UI component:** `src/components/`
- **New page/route:** `src/pages/` (or `src/app/` if using App Router)
- **New data integration:** `src/services/` + `src/models/`
- **App-wide styles:** `src/app/globals.css` or Tailwind config
