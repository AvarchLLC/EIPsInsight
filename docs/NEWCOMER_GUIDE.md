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


## 5. Suggested learning path for new contributors
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

Added by @dhanushlnaik

# ===========================================
# EIPs Insight - Environment Variables
# ===========================================
# Copy this file to .env.local and fill in the values
# Never commit .env.local to version control

# ===========================================
# Database Configuration
# ===========================================

# Main MongoDB Connection URI for application data
MONGODB_URI=mongodb://localhost:27017/eipsinsight

# MongoDB URI for open PRs analytics and tracking
OPENPRS_MONGODB_URI=mongodb://localhost:27017/openprs

# Database name for open PRs (optional, defaults to "test")
OPENPRS_DATABASE=openprs

# MongoDB URI for contributor rankings (optional, falls back to OPENPRS_MONGODB_URI)
CONTRI_URI=mongodb://localhost:27017/contributors

# ===========================================
# Authentication - NextAuth.js
# ===========================================

# NextAuth Secret - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-here

# NextAuth URL - Your application URL
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth Provider
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret

# Google OAuth Provider
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# ===========================================
# GitHub API Integration
# ===========================================

# GitHub Personal Access Token for API calls
# Required for fetching EIPs/ERCs/RIPs data from GitHub
GITHUB_TOKEN=your-github-personal-access-token

# Alternative GitHub token name (used in some API routes)
ACCESS_TOKEN=your-github-personal-access-token

# Public GitHub access token (exposed to client-side)
NEXT_PUBLIC_ACCESS_TOKEN=your-public-github-token

# ===========================================
# Email Configuration
# ===========================================

# SMTP Server Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@eipsinsight.com

# ===========================================
# Payment Integration - Stripe
# ===========================================

# Stripe Secret Key (server-side)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# Stripe Webhook Secret for event verification
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ===========================================
# External APIs
# ===========================================

# Cohere AI API Key for AI summary generation
COHERE_API_KEY=your-cohere-api-key

# Sepolia (Ethereum Testnet) API Key
NEXT_PUBLIC_SEPOLIA_API=your-sepolia-api-key

# ===========================================
# Notifications
# ===========================================

# Discord Webhook URL for notifications and feedback
DISCORD_WEB=https://discord.com/api/webhooks/your-webhook-url

# ===========================================
# Development & CI/CD
# ===========================================

# GitHub Repository for CI/CD workflows
GITHUB_REPOSITORY=ethereum/EIPs

# ===========================================
# Notes
# ===========================================
# 
# Required Variables for Core Functionality:
# - MONGODB_URI
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - GITHUB_TOKEN or ACCESS_TOKEN
#
# Optional but Recommended:
# - OPENPRS_MONGODB_URI (for PR analytics)
# - Email settings (for notifications)
# - OAuth providers (for social login)
#
# For Production:
# - Use strong, unique values for all secrets
# - Set NEXTAUTH_URL to your production domain
# - Enable OAuth providers for better UX
# - Configure email for transactional messages
# - Set up Stripe for payment features
#

## 7. Where to add new work
- **New UI component:** `src/components/`
- **New page/route:** `src/pages/` (or `src/app/` if using App Router)
- **New data integration:** `src/services/` + `src/models/`
- **App-wide styles:** `src/app/globals.css` or Tailwind config
