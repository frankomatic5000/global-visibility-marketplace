# CLAUDE.md — Global Visibility Marketplace

## Project Overview

Global Visibility Marketplace (GVM) is a Next.js 16 marketplace connecting podcast hosts, event organizers, and media outlets with guests seeking visibility. The MVP focuses on podcast guest appearances with region-first browsing.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Stripe

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── browse/            # Region-first browse pages
│   │   ├── [country]/      # Country + city dynamic routes
│   │   └── page.tsx        # Main browse with filters
│   ├── listings/[id]/     # Listing detail pages
│   ├── checkout/[listingId]/ # Booking flow
│   ├── host/              # Host registration
│   └── hosts/[id]/        # Host profiles
├── components/            # Reusable UI components
│   ├── ListingCard.tsx    # Optimized with Next/Image
│   └── Header.tsx
├── lib/                   # Core utilities
│   ├── api.ts             # Supabase abstraction layer (NEW)
│   ├── supabase.ts        # Supabase client
│   ├── utils.ts           # Formatting & helpers
│   └── validation.ts      # Security & input validation (NEW)
├── types/                 # TypeScript type definitions
│   └── index.ts
├── data/                  # Sample data for MVP
│   └── sample-data.ts
├── middleware.ts          # Security headers, URL validation (NEW)
└── test/                  # Vitest test suite (NEW)
    ├── setup.ts
    └── lib/
```

### Key Patterns

**Region-First Routing:** `/browse/[country]/[city]` — Country always precedes city in URL hierarchy

**Supabase Abstraction (`src/lib/api.ts`):** All database operations centralized with:
- Type-safe query builders
- Input validation with Zod
- Error handling
- Rate limiting helpers

**Security Layer (`src/lib/validation.ts`):**
- XSS prevention (HTML escaping, tag stripping)
- CSRF protection (origin validation)
- Input sanitization (slugs, emails, UUIDs)
- Rate limiting (client-side)

## Type Safety

### Strict Mode Enabled
```json
{
  "strict": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### Enums as Const Objects
Prefer const objects over enums for better tree-shaking:
```typescript
export const PlatformType = {
  PODCAST: 'podcast',
  EVENT: 'event',
  MAGAZINE: 'magazine',
  INFLUENCER: 'influencer',
} as const;
export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

```bash
npm run test          # Run tests
npm run test:run     # Run once (CI)
npm run test:coverage # With coverage
npm run typecheck    # TypeScript validation
```

Tests use Vitest with React Testing Library. See `src/test/` for examples.

## Database Schema (Supabase)

See `supabase/schema.sql` for full DDL including:
- Regions (adjacency list + path for hierarchy)
- Users, MediaProfiles, Listings, Bookings, Reviews
- Row Level Security (RLS) policies
- Performance indexes

### Key Indexes
```sql
CREATE INDEX idx_listings_region ON listings(region_id);
CREATE INDEX idx_listings_status ON listings(status) WHERE status = 'active';
CREATE INDEX idx_regions_slug ON regions(slug);
CREATE INDEX idx_bookings_buyer ON bookings(buyer_id);
```

## Performance Optimizations

1. **Next/Image** — All images use optimized `<Image>` component with:
   - AVIF/WebP auto-formatting
   - Lazy loading
   - Responsive `sizes` attribute

2. **React Server Components** — Pages should be server components by default, client components only for interactivity

3. **URL Parameter Memoization** — Filter state derived from URL params, not local state where possible

4. **Middleware Caching** — Security headers and URL normalization at edge

## Security Measures

1. **CSP Headers** — Strict Content Security Policy in middleware
2. **XSS Prevention** — All user input sanitized before rendering
3. **URL Validation** — Slugs/UUIDs validated before DB queries
4. **RLS Policies** — Supabase row-level security for all tables
5. **HTTPS Only** — HSTS header enforces TLS

## Common Tasks

### Adding a New Filter
1. Add to `ListingFilters` type in `src/types/index.ts`
2. Update filter logic in browse page's `filteredListings` useMemo
3. Add URL param sync in `src/lib/api.ts`

### Adding a New Entity
1. Define TypeScript interface in `src/types/index.ts`
2. Add table + RLS to `supabase/schema.sql`
3. Add API functions in `src/lib/api.ts`
4. Add sample data in `src/data/sample-data.ts`

### Creating a New Page
1. Use App Router: `src/app/[route]/page.tsx`
2. Prefer Server Components for data fetching
3. Add `'use client'` only for interactivity
4. Include proper metadata export for SEO

## Deployment

See `DEPLOY.md` for Vercel deployment instructions.

## TODO

- [ ] Replace sample data with real Supabase queries
- [ ] Add authentication (Supabase Auth)
- [ ] Implement Stripe Checkout
- [ ] Add listing creation flow for hosts
- [ ] Build dashboard for hosts/buyers
- [ ] Add review system
- [ ] Email notifications
