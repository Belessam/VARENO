# VARENO — Smoke Smarter

Premium wooden cigarette holder e-commerce application.

## What is VARENO?

VARENO is a single-product e-commerce store selling the **VARENO Signature Holder** — a premium wooden cigarette holder made of American walnut and champagne brass, priced at **850 EGP**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 (Executive Heritage design system) |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod v4 |
| Backend | Supabase PostgreSQL |
| Edge Functions | Supabase Edge Functions (Deno) |
| Storage | Supabase Storage (private bucket) |
| Deployment | Vercel (planned) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier works)

### Installation

```bash
cd vareno-app
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BASE_URL=http://localhost:5173
VITE_INSTAPAY_ADDRESS=vareno@instapay
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc -b --noEmit
```

## Project Structure

```
src/
├── components/
│   ├── brand/          Logo (text placeholder)
│   ├── layout/         Header, Footer, MobileNav
│   ├── sections/       Homepage sections
│   └── ui/             15 reusable UI components
├── lib/
│   ├── config/         Product (850 EGP) and app configuration
│   ├── services/       Supabase service layer (via Edge Functions)
│   ├── types/          TypeScript type definitions
│   ├── validations/    Zod schemas
│   ├── supabase.ts     Supabase client (anon key)
│   └── utils.ts        Utility functions
├── pages/              OrderPage, ConfirmationPage, NotFoundPage
├── App.tsx             Router setup
├── main.tsx            Entry point
└── index.css           Design tokens (Executive Heritage)
supabase/
├── migrations/         SQL schema (001 + 002 security fix)
├── functions/          Edge Functions (create-order, get-order, upload-proof)
└── RLS_STRATEGY.md     Security documentation
public/
└── assets/product/     Product images
```

## Supabase Setup

1. Create a project at https://supabase.com
2. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
3. Run `supabase/migrations/002_security_fix.sql` in SQL Editor
4. Create a **PRIVATE** Storage bucket named `order-proofs`
5. Deploy Edge Functions:
   ```bash
   supabase functions deploy create-order
   supabase functions deploy get-order
   supabase functions deploy upload-proof
   ```
6. Set `APP_ORIGIN` in Edge Function settings

See `supabase/RLS_STRATEGY.md` for security details.

## Key Business Rules

- Single product: VARENO Signature Holder — **850 EGP**
- Payment: Cash on Delivery + InstaPay
- Server-side price calculation (browser never sends price/total)
- All order operations via Edge Functions (no direct database access from client)
- Security-audited RLS policies

## Documentation

- `PROJECT_HANDOFF.md` — Complete project status and file map
- `SESSION_HANDOFF.md` — Quick resume guide for new sessions
- `supabase/RLS_STRATEGY.md` — Security architecture
