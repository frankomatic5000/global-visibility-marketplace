# Deployment Guide

## GitHub Repository

✅ **Repo created**: https://github.com/frankomatic5000/global-visibility-marketplace

## Vercel Deployment (Recommended)

### Option 1: One-click deploy via GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `frankomatic5000/global-visibility-marketplace`
3. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
cd global-visibility-marketplace
vercel --prod
```

## Environment Variables (Optional for MVP)

The MVP works without any environment variables (uses sample data).

For production with Supabase and Stripe, add these in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## Local Development

```bash
cd global-visibility-marketplace
npm install
npm run dev
```

Open http://localhost:3000

## Demo Pages

- **Landing**: `/` - Region selector
- **Browse**: `/browse` or `/browse/us`
- **City Listings**: `/browse/us/new-york`
- **Listing Detail**: `/listings/listing-1`
- **Host Profile**: `/hosts/host-1`
- **Checkout**: `/checkout/listing-1`
- **Become Host**: `/host`
