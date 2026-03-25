-- Global Visibility Marketplace - Supabase Schema
-- This is a reference file for the MVP database schema

-- ============================================
-- REGIONS (Adjacency List + Path)
-- ============================================
CREATE TABLE regions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  level       SMALLINT NOT NULL,   -- 0=world, 1=country, 2=city
  parent_id   UUID REFERENCES regions(id) ON DELETE CASCADE,
  path        TEXT NOT NULL,       -- '/world/north-america/us/new-york'
  path_names  TEXT[] NOT NULL,     -- {'World', 'North America', 'United States', 'New York'}
  lat         DECIMAL(9,6),
  lng         DECIMAL(9,6),
  timezone    TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(parent_id, slug)
);

CREATE INDEX idx_regions_parent ON regions(parent_id);
CREATE INDEX idx_regions_level ON regions(level);
CREATE INDEX idx_regions_slug ON regions(slug);

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT UNIQUE NOT NULL,
  full_name         TEXT,
  avatar_url        TEXT,
  bio               TEXT,
  role              TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'host', 'both')),
  is_verified       BOOLEAN DEFAULT false,
  stripe_account_id TEXT,          -- for hosts receiving payouts
  stripe_customer_id TEXT,         -- for buyers
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MEDIA PROFILES
-- ============================================
CREATE TABLE public.media_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  platform_type   TEXT NOT NULL CHECK (platform_type IN ('podcast', 'event', 'magazine', 'influencer', 'other')),
  platform_name   TEXT NOT NULL,
  handle          TEXT,
  url             TEXT,
  audience_size   INTEGER,
  audience_demo   TEXT,
  description     TEXT,
  verified        BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_media_profiles_user ON media_profiles(user_id);

-- ============================================
-- LISTINGS
-- ============================================
CREATE TABLE public.listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  region_id       UUID REFERENCES regions(id) ON DELETE RESTRICT NOT NULL,
  media_profile_id UUID REFERENCES public.media_profiles(id) ON DELETE SET NULL,

  -- Core listing data
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT NOT NULL,
  platform_type   TEXT NOT NULL CHECK (platform_type IN ('podcast', 'event', 'magazine', 'influencer')),
  listing_type    TEXT NOT NULL CHECK (listing_type IN ('guest_spot', 'sponsored', 'featured', 'interview', 'article', 'other')),

  -- Pricing
  price_cents     INTEGER NOT NULL,
  currency        TEXT DEFAULT 'USD',
  duration_mins   INTEGER,

  -- Availability windows (JSONB for flexibility)
  availability    JSONB DEFAULT '[]',

  -- Media
  cover_image_url TEXT,
  gallery_urls    TEXT[],

  -- Status
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  is_featured     BOOLEAN DEFAULT false,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(region_id, slug)
);

CREATE INDEX idx_listings_region ON listings(region_id);
CREATE INDEX idx_listings_host ON listings(host_id);
CREATE INDEX idx_listings_platform ON listings(platform_type);
CREATE INDEX idx_listings_status ON listings(status) WHERE status = 'active';

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE public.bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES public.listings(id) NOT NULL,
  buyer_id        UUID REFERENCES public.users(id) NOT NULL,
  host_id         UUID REFERENCES public.users(id) NOT NULL,
  region_id       UUID REFERENCES regions(id) NOT NULL,

  scheduled_at    TIMESTAMPTZ,
  notes           TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  
  -- Payment
  amount_cents    INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  host_payout_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_buyer ON bookings(buyer_id);
CREATE INDEX idx_bookings_host ON bookings(host_id);
CREATE INDEX idx_bookings_listing ON bookings(listing_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES public.users(id) NOT NULL,
  reviewee_id UUID REFERENCES public.users(id) NOT NULL,
  listing_id  UUID REFERENCES public.listings(id) NOT NULL,
  region_id   UUID REFERENCES regions(id) NOT NULL,

  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Regions: public read
CREATE POLICY "Regions are viewable by everyone" ON regions
  FOR SELECT USING (true);

-- Users: public read profile, own write
CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Media Profiles: public read, own write
CREATE POLICY "Media profiles are viewable by everyone" ON public.media_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own media profiles" ON public.media_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media profiles" ON public.media_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Listings: public read active, own write
CREATE POLICY "Active listings are viewable by everyone" ON public.listings
  FOR SELECT USING (status = 'active' OR auth.uid() = host_id);

CREATE POLICY "Hosts can insert listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = host_id);

-- Bookings: own read/write
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = host_id);

CREATE POLICY "Buyers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = host_id);

-- Reviews: public read, own write
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews for completed bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id 
        AND buyer_id = auth.uid() 
        AND status = 'completed'
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get listings by region
CREATE OR REPLACE FUNCTION get_listings_by_region(region_slug TEXT)
RETURNS SETOF public.listings AS $$
BEGIN
  RETURN QUERY
  SELECT l.* FROM public.listings l
  JOIN regions r ON l.region_id = r.id
  WHERE r.slug = region_slug AND l.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get region children
CREATE OR REPLACE FUNCTION get_region_children(parent_slug TEXT)
RETURNS SETOF regions AS $$
DECLARE
  parent_region regions;
BEGIN
  SELECT * INTO parent_region FROM regions WHERE slug = parent_slug;
  
  RETURN QUERY
  SELECT * FROM regions
  WHERE parent_id = parent_region.id AND is_active = true
  ORDER BY name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER media_profiles_updated_at
  BEFORE UPDATE ON public.media_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA (sample regions)
-- ============================================
INSERT INTO regions (id, name, slug, level, parent_id, path, path_names, lat, lng, timezone) VALUES
-- Countries
('us', 'United States', 'us', 1, NULL, '/us', '{"United States"}', 37.0902, -95.7129, 'America/New_York'),
('uk', 'United Kingdom', 'uk', 1, NULL, '/uk', '{"United Kingdom"}', 55.3781, -3.4360, 'Europe/London'),
('br', 'Brazil', 'br', 1, NULL, '/br', '{"Brazil"}', -14.2350, -51.9253, 'America/Sao_Paulo'),
('de', 'Germany', 'de', 1, NULL, '/de', '{"Germany"}', 51.1657, 10.4515, 'Europe/Berlin'),

-- US Cities
('us-nyc', 'New York', 'new-york', 2, 'us', '/us/new-york', '{"United States", "New York"}', 40.7128, -74.0060, 'America/New_York'),
('us-la', 'Los Angeles', 'los-angeles', 2, 'us', '/us/los-angeles', '{"United States", "Los Angeles"}', 34.0522, -118.2437, 'America/Los_Angeles'),
('us-sf', 'San Francisco', 'san-francisco', 2, 'us', '/us/san-francisco', '{"United States", "San Francisco"}', 37.7749, -122.4194, 'America/Los_Angeles'),

-- UK Cities
('uk-ldn', 'London', 'london', 2, 'uk', '/uk/london', '{"United Kingdom", "London"}', 51.5074, -0.1278, 'Europe/London'),

-- Brazil Cities
('br-sp', 'São Paulo', 'sao-paulo', 2, 'br', '/br/sao-paulo', '{"Brazil", "São Paulo"}', -23.5505, -46.6333, 'America/Sao_Paulo'),

-- Germany Cities
('de-ber', 'Berlin', 'berlin', 2, 'de', '/de/berlin', '{"Germany", "Berlin"}', 52.52, 13.405, 'Europe/Berlin');
