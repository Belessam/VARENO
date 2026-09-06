# VARENO — RLS & Security Strategy

## Overview

The VARENO frontend is a React/Vite SPA that communicates with Supabase.
**All order operations go through Edge Functions** — the client never directly reads or writes order data.

## Key Principle

**The frontend is NEVER trusted for pricing, order totals, or order data access.**

## Architecture

```
React/Vite Frontend (anon key)
    ↓
    ├── products table (RLS: SELECT where is_active = true)
    ↓
Supabase Edge Functions (service-role key, bypasses RLS)
    ├── create-order: validates, calculates price, inserts order
    ├── get-order: verifies ownership (order_reference + email), returns order
    ├── upload-proof: verifies ownership, validates file, uploads to Storage
    ↓
Supabase PostgreSQL (orders, order_items)
    ↓
Supabase Storage (order-proofs bucket, private)
```

## RLS Policies

### products Table
- **SELECT**: `USING (is_active = true)` — anyone can read active products
- **INSERT/UPDATE/DELETE**: No policy = denied (admin via service-role only)

### orders Table
- **No policies** — all access denied by default
- All reads and writes go through Edge Functions (service-role bypasses RLS)

### order_items Table
- **No policies** — all access denied by default
- All reads and writes go through Edge Functions (service-role bypasses RLS)

## Storage Policies (order-proofs bucket)

- **INSERT (anon)**: Allowed for JPEG/PNG/WebP/PDF files
- **SELECT**: No policy for anon = private (only service-role can read)
- **DELETE**: Service-role only

## Security Audit Findings (Fixed)

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 1 | orders SELECT exposed all PII | CRITICAL | Removed — all reads via Edge Function |
| 2 | orders UPDATE allowed modifying any order | CRITICAL | Removed — all writes via Edge Function |
| 3 | order_items INSERT allowed injection | HIGH | Removed — only Edge Function inserts |
| 4 | order_items SELECT exposed all items | HIGH | Removed — only Edge Function reads |
| 5 | Client-side upload without ownership | HIGH | Moved to upload-proof Edge Function |
| 6 | No Storage policies | HIGH | Added private bucket policies |
| 7 | No rate limiting | MEDIUM | Recommended for production |
| 8 | No ownership verification on read | MEDIUM | Added email verification in get-order |
| 9 | CORS allows any origin | LOW | Restricted via APP_ORIGIN env var |
| 10 | No duplicate order prevention | LOW | Optional — can add later |

## What We Do NOT Do

- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- ❌ Never trust price or total sent from the browser
- ❌ Never allow direct client access to orders/order_items tables
- ❌ Never allow unauthenticated admin operations
- ❌ Never store sensitive payment data (card numbers, etc.)
- ❌ Never allow public read of payment proofs

## Edge Functions

| Function | Purpose | Auth |
|----------|---------|------|
| `create-order` | Create new order with server-side pricing | Public (validated) |
| `get-order` | Fetch order details with ownership verification | Requires order_reference + email |
| `upload-proof` | Upload InstaPay proof with ownership verification | Requires order_reference + email + file |

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Frontend | Supabase project URL (public) |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase anon key (public) |
| `APP_ORIGIN` | Edge Functions | App domain for CORS restriction |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions ONLY | Admin key — never in frontend |
