export interface Region {
  id: string;
  name: string;
  slug: string;
  level: number; // 0=world, 1=country, 2=city
  parent_id: string | null;
  path: string;
  path_names: string[];
  lat?: number;
  lng?: number;
  timezone?: string;
  is_active: boolean;
  children?: Region[];
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'buyer' | 'host' | 'both';
  is_verified: boolean;
  stripe_account_id?: string;
  stripe_customer_id?: string;
  created_at: string;
}

export interface MediaProfile {
  id: string;
  user_id: string;
  platform_type: 'podcast' | 'event' | 'magazine' | 'influencer';
  platform_name: string;
  handle?: string;
  url?: string;
  audience_size?: number;
  audience_demo?: string;
  description?: string;
  verified: boolean;
}

export interface Listing {
  id: string;
  host_id: string;
  region_id: string;
  media_profile_id?: string;
  title: string;
  slug: string;
  description: string;
  platform_type: 'podcast' | 'event' | 'magazine' | 'influencer';
  listing_type: 'guest_spot' | 'sponsored' | 'featured' | 'interview' | 'article' | 'other';
  price_cents: number;
  currency: string;
  duration_mins?: number;
  cover_image_url?: string;
  gallery_urls?: string[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  host?: User;
  region?: Region;
  media_profile?: MediaProfile;
}

export interface Booking {
  id: string;
  listing_id: string;
  buyer_id: string;
  host_id: string;
  region_id: string;
  scheduled_at?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  amount_cents: number;
  platform_fee_cents: number;
  host_payout_cents: number;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  listing?: Listing;
  buyer?: User;
  host?: User;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  listing_id: string;
  region_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
