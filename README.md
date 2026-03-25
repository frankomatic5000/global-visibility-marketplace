# Global Visibility Marketplace (GVM)

A region-first marketplace for booking visibility opportunities in podcasts, events, and media worldwide.

![GVM Preview](https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop)

## 🚀 Features

- **Region-First Architecture**: Browse by country → city
- **Podcast Listings**: Book guest spots, interviews, and sponsored segments
- **Host Profiles**: View host media profiles and audience data
- **Mock Booking Flow**: Simulated Stripe checkout for MVP
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, RLS)
- **Payments**: Stripe (mock for MVP)
- **Deployment**: Vercel

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page with region selector
│   │   ├── browse/             # Browse listings
│   │   │   ├── page.tsx        # Main browse page
│   │   │   └── [country]/
│   │   │       ├── page.tsx    # Country listings
│   │   │       └── [city]/
│   │   │           └── page.tsx # City listings
│   │   ├── listings/
│   │   │   └── [id]/page.tsx   # Listing detail
│   │   ├── hosts/
│   │   │   └── [id]/page.tsx   # Host profile
│   │   ├── checkout/
│   │   │   └── [listingId]/    # Mock checkout
│   │   └── host/page.tsx       # Become a host
│   ├── components/             # Reusable components
│   ├── data/                   # Sample data
│   ├── lib/                    # Utilities
│   └── types/                  # TypeScript types
├── supabase/
│   └── schema.sql              # Database schema
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for MVP)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd global-visibility-marketplace

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
# Supabase (optional for MVP - app works with sample data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe (optional for MVP - mock checkout works without)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## 📖 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Landing page with region selector |
| `/browse` | Browse all listings |
| `/browse/[country]` | Listings by country |
| `/browse/[country]/[city]` | Listings by city |
| `/listings/[id]` | Listing detail & booking |
| `/hosts/[id]` | Host profile page |
| `/host` | Become a host registration |
| `/checkout/[listingId]` | Mock Stripe checkout |

## 🗄️ Database Setup

The MVP uses static sample data stored in `src/data/sample-data.ts`.

For production with Supabase:

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL editor
3. Add your Supabase URL and anon key to `.env.local`

## 🎯 MVP Scope

### Included
- ✅ Region-first browsing (country → city)
- ✅ 4 sample podcast listings
- ✅ Listing detail pages
- ✅ Mock booking flow
- ✅ Host profiles
- ✅ Responsive mobile design

### Excluded (Phase 2+)
- Real authentication
- Stripe Connect payouts
- Multiple platform types (events, magazines, influencers)
- Availability calendar
- Reviews system
- Real-time messaging

## 📝 License

MIT

---

Built with ❤️ by the GVM Team
