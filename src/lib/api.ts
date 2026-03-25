/**
 * Supabase API Abstraction Layer
 * Centralizes all database operations with type safety and error handling
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type { Region, User, MediaProfile, Listing, Booking, Review } from '@/types';

// ============================================
// Supabase Client Setup
// ============================================

// Create client only if credentials exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Use a typed proxy to handle missing client gracefully
const supabase = supabaseClient ?? createMockClient();

// Mock client for development without credentials
function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          then: (resolve: (value: unknown) => void) => resolve({ data: null, error: null }),
        }),
        order: () => ({
          then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
        }),
        limit: () => ({
          range: () => ({
            then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
          }),
          then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
        }),
        range: () => ({
          then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
        }),
        in: () => ({
          order: () => ({
            limit: () => ({
              range: () => ({
                then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
              }),
              then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
            }),
            then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
          }),
          then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
        }),
        then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          then: (resolve: (value: unknown) => void) => resolve({ data: null, error: null }),
        }),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    channel: () => ({
      on: () => ({ on: () => ({ subscribe: () => ({}) }) }),
      subscribe: () => ({}),
    }),
  } as unknown as SupabaseClient;
}

// ============================================
// Type Guards
// ============================================

export function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ============================================
// Regions API
// ============================================

export interface RegionFilters {
  level?: number;
  parentId?: string;
  isActive?: boolean;
}

export async function getRegions(filters?: RegionFilters): Promise<Region[]> {
  let query = supabase
    .from('regions')
    .select('*')
    .order('name');

  if (filters?.level !== undefined) {
    query = query.eq('level', filters.level);
  }
  if (filters?.parentId) {
    query = query.eq('parent_id', filters.parentId);
  }
  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
  
  return data || [];
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  if (!isValidSlug(slug)) return null;

  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getRegionChildren(parentSlug: string): Promise<Region[]> {
  const parent = await getRegionBySlug(parentSlug);
  if (!parent) return [];

  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .eq('parent_id', parent.id)
    .eq('is_active', true)
    .order('name');

  if (error) return [];
  return data || [];
}

// ============================================
// Listings API
// ============================================

export interface ListingFilters {
  regionId?: string;
  countrySlug?: string;
  citySlug?: string;
  platformType?: string;
  listingType?: string;
  status?: 'draft' | 'active' | 'paused' | 'archived';
  isFeatured?: boolean;
  hostId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ListingQueryOptions {
  includeHost?: boolean;
  includeRegion?: boolean;
  includeMediaProfile?: boolean;
  orderBy?: 'created_at' | 'price_cents' | 'title';
  orderDir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function getListings(
  filters?: ListingFilters,
  options?: ListingQueryOptions
): Promise<Listing[]> {
  let query = supabase
    .from('listings')
    .select(options?.includeHost || options?.includeRegion || options?.includeMediaProfile
      ? `*, host:users(*), region:regions(*), media_profile:media_profiles(*)`
      : '*'
    );

  // Apply filters
  if (filters?.regionId) {
    query = query.eq('region_id', filters.regionId);
  }
  if (filters?.platformType) {
    query = query.eq('platform_type', filters.platformType);
  }
  if (filters?.listingType) {
    query = query.eq('listing_type', filters.listingType);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  } else {
    // Default to active listings only
    query = query.eq('status', 'active');
  }
  if (filters?.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured);
  }
  if (filters?.hostId) {
    query = query.eq('host_id', filters.hostId);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price_cents', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price_cents', filters.maxPrice);
  }

  // Country/City filter via region join
  if (filters?.countrySlug || filters?.citySlug) {
    // Get region IDs for the filter
    const regionFilter = filters.citySlug || filters.countrySlug;
    if (regionFilter) {
      const region = await getRegionBySlug(regionFilter);
      if (region) {
        if (filters.citySlug) {
          query = query.eq('region_id', region.id);
        } else {
          // Get all child region IDs for country
          const children = await getRegionChildren(filters.countrySlug!);
          const regionIds = [region.id, ...children.map(r => r.id)];
          query = query.in('region_id', regionIds);
        }
      }
    }
  }

  // Ordering
  const orderBy = options?.orderBy || 'created_at';
  const orderDir = options?.orderDir || 'desc';
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }

  return (data ?? []) as unknown as Listing[];
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!isValidUuid(id)) return null;

  const { data, error } = await supabase
    .from('listings')
    .select('*, host:users(*), region:regions(*), media_profile:media_profiles(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getListingBySlug(slug: string, regionId?: string): Promise<Listing | null> {
  let query = supabase
    .from('listings')
    .select('*, host:users(*), region:regions(*), media_profile:media_profiles(*)')
    .eq('slug', slug)
    .eq('status', 'active');

  if (regionId) {
    query = query.eq('region_id', regionId);
  }

  const { data, error } = await query.single();
  if (error || !data) return null;
  return data as unknown as Listing;
}

// ============================================
// Users API
// ============================================

export async function getUserById(id: string): Promise<User | null> {
  if (!isValidUuid(id)) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) return null;
  return data;
}

export async function getHostById(id: string): Promise<User | null> {
  return getUserById(id);
}

// ============================================
// Media Profiles API
// ============================================

export async function getMediaProfilesByUser(userId: string): Promise<MediaProfile[]> {
  if (!isValidUuid(userId)) return [];

  const { data, error } = await supabase
    .from('media_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getMediaProfileById(id: string): Promise<MediaProfile | null> {
  if (!isValidUuid(id)) return null;

  const { data, error } = await supabase
    .from('media_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// ============================================
// Bookings API
// ============================================

export interface CreateBookingInput {
  listingId: string;
  scheduledAt?: string;
  notes?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get listing to determine price
  const listing = await getListingById(input.listingId);
  if (!listing) return null;

  const platformFeePercent = 0.05;
  const platformFeeCents = Math.round(listing.price_cents * platformFeePercent);
  const hostPayoutCents = listing.price_cents - platformFeeCents;

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: input.listingId,
      buyer_id: user.id,
      host_id: listing.host_id,
      region_id: listing.region_id,
      scheduled_at: input.scheduledAt,
      notes: input.notes,
      amount_cents: listing.price_cents,
      platform_fee_cents: platformFeeCents,
      host_payout_cents: hostPayoutCents,
      status: 'pending',
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating booking:', error);
    return null;
  }

  return data;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  if (!isValidUuid(userId)) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*, listing:listings(*), buyer:users(*), host:users(*)')
    .or(`buyer_id.eq.${userId},host_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

// ============================================
// Reviews API
// ============================================

export async function getReviewsByListing(listingId: string): Promise<Review[]> {
  if (!isValidUuid(listingId)) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  if (!isValidUuid(userId)) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

// ============================================
// Realtime Subscriptions
// ============================================

export function subscribeToListings(
  regionId: string | null,
  onUpdate: (payload: unknown) => void
): RealtimeChannel {
  let channel = supabase.channel('listings-changes');

  if (regionId) {
    channel = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `region_id=eq.${regionId}`,
        },
        onUpdate
      );
  } else {
    channel = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'listings',
        filter: 'status=eq.active',
      },
      onUpdate
    );
  }

  return channel.subscribe();
}

// ============================================
// Utility Functions
// ============================================

export async function getListingCount(filters?: ListingFilters): Promise<number> {
  let query = supabase
    .from('listings')
    .select('id', { count: 'exact', head: true });

  if (filters?.regionId) {
    query = query.eq('region_id', filters.regionId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.eq('status', 'active');
  }

  const { count, error } = await query;
  
  if (error) return 0;
  return count || 0;
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  return getListings(
    { isFeatured: true, status: 'active' },
    { limit, orderBy: 'created_at', orderDir: 'desc' }
  );
}

// ============================================
// Input Validation (Zod schemas)
// ============================================

import { z } from 'zod';

export const listingFiltersSchema = z.object({
  platformType: z.enum(['podcast', 'event', 'magazine', 'influencer', 'all']).optional(),
  priceRange: z.enum(['all', 'under_100', '100_300', 'over_300']).optional(),
  sortBy: z.enum(['featured', 'newest', 'price_low', 'price_high']).optional(),
});

export type ListingFiltersInput = z.infer<typeof listingFiltersSchema>;

export function parseListingFilters(input: unknown): ListingFiltersInput {
  return listingFiltersSchema.parse(input);
}

export function filtersToQueryParams(filters: ListingFiltersInput): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.platformType && filters.platformType !== 'all') {
    params.set('platform', filters.platformType);
  }
  if (filters.priceRange && filters.priceRange !== 'all') {
    params.set('price', filters.priceRange);
  }
  if (filters.sortBy) {
    params.set('sort', filters.sortBy);
  }
  return params;
}

export function queryParamsToFilters(params: URLSearchParams): ListingFiltersInput {
  return {
    platformType: (params.get('platform') as ListingFiltersInput['platformType']) || 'all',
    priceRange: (params.get('price') as ListingFiltersInput['priceRange']) || 'all',
    sortBy: (params.get('sort') as ListingFiltersInput['sortBy']) || 'featured',
  };
}
