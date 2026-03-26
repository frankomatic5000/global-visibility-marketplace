/**
 * Shared TypeScript Types for Global Visibility Marketplace
 * Strict typing for all domain entities
 */

// ============================================
// Enums (as const for type safety)
// ============================================

export const PlatformType = {
  PODCAST: 'podcast',
  EVENT: 'event',
  MAGAZINE: 'magazine',
  INFLUENCER: 'influencer',
} as const;

export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

export const ListingType = {
  GUEST_SPOT: 'guest_spot',
  SPONSORED: 'sponsored',
  FEATURED: 'featured',
  INTERVIEW: 'interview',
  ARTICLE: 'article',
  OTHER: 'other',
} as const;

export type ListingType = (typeof ListingType)[keyof typeof ListingType];

export const ListingStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ARCHIVED: 'archived',
} as const;

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const UserRole = {
  BUYER: 'buyer',
  HOST: 'host',
  BOTH: 'both',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ============================================
// Region
// ============================================

export interface Region {
  id: string;
  name: string;
  slug: string;
  level: 0 | 1 | 2; // 0=world, 1=country, 2=city
  parent_id: string | null;
  path: string;
  path_names: string[];
  lat?: number;
  lng?: number;
  timezone?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Region[];
}

// ============================================
// User
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_verified: boolean;
  stripe_account_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at?: string;
}

// ============================================
// MediaProfile
// ============================================

export interface MediaProfile {
  id: string;
  user_id: string;
  platform_type: PlatformType;
  platform_name: string;
  handle?: string;
  url?: string;
  audience_size?: number;
  audience_demo?: string;
  description?: string;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Listing
// ============================================

export interface Listing {
  id: string;
  host_id: string;
  region_id: string;
  media_profile_id?: string;
  title: string;
  slug: string;
  description: string;
  platform_type: PlatformType;
  listing_type: ListingType;
  price_cents: number;
  currency: string;
  duration_mins?: number;
  cover_image_url?: string;
  gallery_urls?: string[];
  availability?: AvailabilityWindow[];
  status: ListingStatus;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  // Joined data (populated by API)
  host?: User;
  region?: Region;
  media_profile?: MediaProfile;
}

export interface AvailabilityWindow {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// ============================================
// Booking
// ============================================

export interface Booking {
  id: string;
  listing_id: string;
  buyer_id: string;
  host_id: string;
  region_id: string;
  scheduled_at?: string;
  notes?: string;
  status: BookingStatus;
  amount_cents: number;
  platform_fee_cents: number;
  host_payout_cents: number;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  created_at: string;
  updated_at?: string;
  // Joined data
  listing?: Listing;
  buyer?: User;
  host?: User;
}

// ============================================
// Review
// ============================================

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  listing_id: string;
  region_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Filter Types
// ============================================

export interface ListingFilters {
  platformType?: PlatformType | 'all';
  priceRange?: 'all' | 'under_100' | '100_300' | 'over_300';
  sortBy?: 'featured' | 'newest' | 'price_low' | 'price_high';
  countrySlug?: string;
  citySlug?: string;
}

// ============================================
// Form Types
// ============================================

export interface BookingFormData {
  listingId: string;
  notes: string;
  scheduledAt?: string;
}

export interface HostRegistrationData {
  fullName: string;
  email: string;
  podcastName: string;
  podcastUrl?: string;
  audienceSize?: string;
  audienceDemo?: string;
  description: string;
}

// ============================================
// Component Props Types
// ============================================

export interface ListingCardProps {
  listing: Listing;
  priority?: boolean; // for above-fold images
  distance?: number | null; // distance in km
}

export interface HostProfileCardProps {
  host: User;
  mediaProfiles?: MediaProfile[];
}

export interface RegionSelectorProps {
  selectedCountry?: string;
  selectedCity?: string;
  onCountryChange?: (slug: string) => void;
  onCityChange?: (slug: string) => void;
  onExplore?: () => void;
}

// ============================================
// Utility Type Helpers
// ============================================

export type Maybe<T> = T | null | undefined;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// ============================================
// Constants
// ============================================

export const PRICE_RANGES = {
  UNDER_100: { label: 'Under $100', min: 0, max: 10000 },
  RANGE_100_300: { label: '$100 - $300', min: 10000, max: 30000 },
  OVER_300: { label: 'Over $300', min: 30000, max: Infinity },
} as const;

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  [PlatformType.PODCAST]: 'Podcast',
  [PlatformType.EVENT]: 'Event',
  [PlatformType.MAGAZINE]: 'Magazine',
  [PlatformType.INFLUENCER]: 'Influencer',
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.GUEST_SPOT]: 'Guest Spot',
  [ListingType.SPONSORED]: 'Sponsored',
  [ListingType.FEATURED]: 'Featured',
  [ListingType.INTERVIEW]: 'Interview',
  [ListingType.ARTICLE]: 'Article',
  [ListingType.OTHER]: 'Other',
};
