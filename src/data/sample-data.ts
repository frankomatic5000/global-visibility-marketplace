import { Region, Listing, User, MediaProfile } from '@/types';

// Sample regions (countries and cities)
export const sampleRegions: Region[] = [
  // Countries
  { id: 'us', name: 'United States', slug: 'us', level: 1, parent_id: null, path: '/us', path_names: ['United States'], is_active: true },
  { id: 'uk', name: 'United Kingdom', slug: 'uk', level: 1, parent_id: null, path: '/uk', path_names: ['United Kingdom'], is_active: true },
  { id: 'br', name: 'Brazil', slug: 'br', level: 1, parent_id: null, path: '/br', path_names: ['Brazil'], is_active: true },
  { id: 'de', name: 'Germany', slug: 'de', level: 1, parent_id: null, path: '/de', path_names: ['Germany'], is_active: true },
  
  // Cities
  { id: 'us-nyc', name: 'New York', slug: 'new-york', level: 2, parent_id: 'us', path: '/us/new-york', path_names: ['United States', 'New York'], lat: 40.7128, lng: -74.006, timezone: 'America/New_York', is_active: true },
  { id: 'us-la', name: 'Los Angeles', slug: 'los-angeles', level: 2, parent_id: 'us', path: '/us/los-angeles', path_names: ['United States', 'Los Angeles'], lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', is_active: true },
  { id: 'us-sf', name: 'San Francisco', slug: 'san-francisco', level: 2, parent_id: 'us', path: '/us/san-francisco', path_names: ['United States', 'San Francisco'], lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles', is_active: true },
  { id: 'uk-ldn', name: 'London', slug: 'london', level: 2, parent_id: 'uk', path: '/uk/london', path_names: ['United Kingdom', 'London'], lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', is_active: true },
  { id: 'br-sp', name: 'São Paulo', slug: 'sao-paulo', level: 2, parent_id: 'br', path: '/br/sao-paulo', path_names: ['Brazil', 'São Paulo'], lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo', is_active: true },
  { id: 'de-ber', name: 'Berlin', slug: 'berlin', level: 2, parent_id: 'de', path: '/de/berlin', path_names: ['Germany', 'Berlin'], lat: 52.52, lng: 13.405, timezone: 'Europe/Berlin', is_active: true },
];

// Sample users (hosts)
export const sampleUsers: User[] = [
  {
    id: 'host-1',
    email: 'sarah@marketingpodcast.com',
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Host of The Marketing Podcast with 50K monthly listeners. Covering B2B marketing, growth strategies, and founder stories.',
    role: 'host',
    is_verified: true,
    created_at: '2025-06-15T10:00:00Z',
  },
  {
    id: 'host-2',
    email: 'marcus@techunch.io',
    full_name: 'Marcus Williams',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Tech journalist and podcast host. Featured in TechCrunch, Wired, and The Verge. Weekly tech news podcast.',
    role: 'host',
    is_verified: true,
    created_at: '2025-08-20T14:30:00Z',
  },
  {
    id: 'host-3',
    email: 'ana@startuplife.br',
    full_name: 'Ana Silva',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Brazilian startup ecosystem advocate. Weekly conversations with founders from LatAm and beyond.',
    role: 'host',
    is_verified: true,
    created_at: '2025-09-10T09:00:00Z',
  },
  {
    id: 'host-4',
    email: 'james@designmatters.co',
    full_name: 'James Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Design strategist and host of Design Matters. Exploring the intersection of design, business, and culture.',
    role: 'host',
    is_verified: true,
    created_at: '2025-07-05T11:00:00Z',
  },
];

// Sample media profiles
export const sampleMediaProfiles: MediaProfile[] = [
  {
    id: 'mp-1',
    user_id: 'host-1',
    platform_type: 'podcast',
    platform_name: 'The Marketing Podcast',
    handle: '@marketingpodcast',
    url: 'https://marketingpodcast.com',
    audience_size: 50000,
    audience_demo: 'B2B marketers, founders, 30-55 age range',
    description: 'Weekly deep dives into marketing strategies, growth tactics, and founder interviews.',
    verified: true,
  },
  {
    id: 'mp-2',
    user_id: 'host-2',
    platform_type: 'podcast',
    platform_name: 'Tech Weekly News',
    handle: '@techweekly',
    url: 'https://techweeklynews.io',
    audience_size: 75000,
    audience_demo: 'Tech professionals, developers, startup founders',
    description: 'Daily tech news coverage with weekly deep-dive episodes.',
    verified: true,
  },
  {
    id: 'mp-3',
    user_id: 'host-3',
    platform_type: 'podcast',
    platform_name: 'Startup Life Brasil',
    handle: '@startuplifebr',
    url: 'https://startuplifebr.com.br',
    audience_size: 25000,
    audience_demo: 'Brazilian founders, LatAm entrepreneurs, Portuguese speakers',
    description: 'Conversas semanais com fundadores da América Latina.',
    verified: true,
  },
  {
    id: 'mp-4',
    user_id: 'host-4',
    platform_type: 'podcast',
    platform_name: 'Design Matters',
    handle: '@designmatterspod',
    url: 'https://designmatters.co',
    audience_size: 40000,
    audience_demo: 'Designers, creative directors, product managers',
    description: 'Exploring design thinking, UX, and visual culture.',
    verified: true,
  },
];

// Sample listings (podcasts only for MVP)
export const sampleListings: Listing[] = [
  {
    id: 'listing-1',
    host_id: 'host-1',
    region_id: 'us-nyc',
    media_profile_id: 'mp-1',
    title: 'Guest Spot: B2B Marketing Deep Dive',
    slug: 'b2b-marketing-deep-dive',
    description: 'Share your B2B marketing expertise with 50K+ monthly listeners. We discuss demand generation, content marketing, and growth strategies. Episode runs 45-60 minutes, recorded via Zoom. You\'ll have opportunity to mention your company and share actionable insights.',
    platform_type: 'podcast',
    listing_type: 'guest_spot',
    price_cents: 29900, // $299
    currency: 'USD',
    duration_mins: 55,
    cover_image_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop',
    status: 'active',
    is_featured: true,
    created_at: '2025-12-01T10:00:00Z',
    updated_at: '2025-12-01T10:00:00Z',
  },
  {
    id: 'listing-2',
    host_id: 'host-2',
    region_id: 'us-sf',
    media_profile_id: 'mp-2',
    title: 'Tech News Guest Appearance',
    slug: 'tech-news-guest',
    description: 'Join our weekly tech news roundup or do a 20-minute solo segment on a trending topic. Perfect for founders, investors, or tech leaders wanting to reach 75K engaged tech professionals.',
    platform_type: 'podcast',
    listing_type: 'interview',
    price_cents: 19900, // $199
    currency: 'USD',
    duration_mins: 25,
    cover_image_url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    status: 'active',
    is_featured: false,
    created_at: '2025-11-15T14:00:00Z',
    updated_at: '2025-11-15T14:00:00Z',
  },
  {
    id: 'listing-3',
    host_id: 'host-3',
    region_id: 'br-sp',
    media_profile_id: 'mp-3',
    title: 'Founder Interview: Startup Journey',
    slug: 'founder-interview-startup',
    description: 'Share your startup story with Brazil\'s growing entrepreneur community. Episodes are 40-50 minutes, recorded in Portuguese. Great for LatAm founders looking to expand their reach.',
    platform_type: 'podcast',
    listing_type: 'interview',
    price_cents: 14900, // R$149 (approx $30, keeping USD for MVP)
    currency: 'USD',
    duration_mins: 45,
    cover_image_url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop',
    status: 'active',
    is_featured: false,
    created_at: '2025-10-20T09:00:00Z',
    updated_at: '2025-10-20T09:00:00Z',
  },
  {
    id: 'listing-4',
    host_id: 'host-4',
    region_id: 'uk-ldn',
    media_profile_id: 'mp-4',
    title: 'Sponsored Segment: Design Strategy',
    slug: 'design-strategy-sponsored',
    description: 'Get a 10-minute sponsored segment in the Design Matters podcast. Perfect for design tool companies, agencies, or consultants. Includes host read and mention in show notes.',
    platform_type: 'podcast',
    listing_type: 'sponsored',
    price_cents: 49900, // $499
    currency: 'USD',
    duration_mins: 10,
    cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
    status: 'active',
    is_featured: true,
    created_at: '2025-12-10T11:00:00Z',
    updated_at: '2025-12-10T11:00:00Z',
  },
];

// Helper function to get region by slug
export function getRegionBySlug(slug: string): Region | undefined {
  return sampleRegions.find(r => r.slug === slug);
}

// Helper function to get listings by region
export function getListingsByRegion(regionSlug: string): Listing[] {
  const region = getRegionBySlug(regionSlug);
  if (!region) return [];
  return sampleListings.filter(l => {
    const listingRegion = sampleRegions.find(r => r.id === l.region_id);
    return listingRegion?.slug === regionSlug;
  });
}

// Helper function to get listings by country
export function getListingsByCountry(countrySlug: string): Listing[] {
  return sampleListings.filter(l => {
    const region = sampleRegions.find(r => r.id === l.region_id);
    const country = sampleRegions.find(r => r.id === region?.parent_id);
    return country?.slug === countrySlug;
  });
}

// Get country and city names
export function getCountryAndCity(regionId: string): { country: string; city: string } | null {
  const city = sampleRegions.find(r => r.id === regionId);
  if (!city) return null;
  const country = sampleRegions.find(r => r.id === city.parent_id);
  return {
    country: country?.name || '',
    city: city.name,
  };
}
