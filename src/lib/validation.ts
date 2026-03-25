/**
 * Input Validation & Security Utilities
 * XSS prevention, CSRF protection, input sanitization
 */

import { z } from 'zod';

// ============================================
// Zod Schemas for Type-Safe Validation
// ============================================

// Region slugs
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

// UUID validation
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'Invalid UUID format'
  );

// Email validation (stricter than default)
export const emailSchema = z
  .string()
  .email()
  .max(255)
  .toLowerCase();

// Price range values
export const priceRangeSchema = z.enum(['all', 'under_100', '100_300', 'over_300']);

// Sort options
export const sortBySchema = z.enum(['featured', 'newest', 'price_low', 'price_high']);

// Platform types
export const platformTypeSchema = z.enum([
  'podcast',
  'event',
  'magazine',
  'influencer',
  'all',
]);

// Listing types
export const listingTypeSchema = z.enum([
  'guest_spot',
  'sponsored',
  'featured',
  'interview',
  'article',
  'other',
]);

// Booking notes
export const bookingNotesSchema = z
  .string()
  .min(0)
  .max(2000, 'Notes must be under 2000 characters')
  .trim();

// URL validation (http/https only)
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .refine(
    (url) => url.startsWith('https://'),
    'Only HTTPS URLs are allowed in production'
  )
  .nullable();

export type UrlSchema = z.infer<typeof urlSchema>;

// ============================================
// Sanitization Functions
// ============================================

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strip all HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize text input (escape + strip)
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  const stripped = stripHtml(input);
  return escapeHtml(stripped.trim());
}

/**
 * Validate and sanitize slug
 */
export function sanitizeSlug(slug: string): string | null {
  const result = slugSchema.safeParse(slug.toLowerCase().trim());
  return result.success ? result.data : null;
}

/**
 * Validate slug format (returns boolean)
 */
export function isValidSlug(slug: string): boolean {
  return slugSchema.safeParse(slug).success;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  const result = emailSchema.safeParse(email.trim());
  return result.success ? result.data : null;
}

/**
 * Validate UUID format (returns boolean)
 */
export function isValidUuid(id: string): boolean {
  return uuidSchema.safeParse(id).success;
}

/**
 * Parse price range filter
 */
export function parsePriceRange(
  range: unknown
): 'all' | 'under_100' | '100_300' | 'over_300' {
  const result = priceRangeSchema.safeParse(range);
  return result.success ? result.data : 'all';
}

/**
 * Parse sort option
 */
export function parseSortBy(sort: unknown): 'featured' | 'newest' | 'price_low' | 'price_high' {
  const result = sortBySchema.safeParse(sort);
  return result.success ? result.data : 'featured';
}

/**
 * Parse platform type filter
 */
export function parsePlatformType(type: unknown): 'podcast' | 'event' | 'magazine' | 'influencer' | 'all' {
  const result = platformTypeSchema.safeParse(type);
  return result.success ? result.data : 'all';
}

// ============================================
// Price Range Helpers
// ============================================

export function priceRangeToCents(range: string): { min?: number; max?: number } {
  switch (range) {
    case 'under_100':
      return { max: 10000 }; // $100
    case '100_300':
      return { min: 10000, max: 30000 }; // $100-$300
    case 'over_300':
      return { min: 30000 }; // $300
    default:
      return {};
  }
}

// ============================================
// CSRF Protection
// ============================================

/**
 * Generate a CSRF token (simple implementation)
 * In production, use proper CSRF tokens from your auth provider
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate origin header (CSRF check)
 */
export function isValidOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  return allowedOrigins.some((allowed) => origin === allowed || origin.endsWith(allowed));
}

// ============================================
// Rate Limiting Helpers (client-side)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter (for client-side protection)
 * Server-side rate limiting should be implemented in API routes
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && now > entry.resetAt) {
    rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(key);

  if (!current) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: current.resetAt - now,
    };
  }

  current.count++;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetIn: current.resetAt - now,
  };
}

// ============================================
// Content Security Policy Headers
// ============================================

export const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': [
    "'self'",
    "data:",
    "https://images.unsplash.com",
    "https://*.supabase.co",
  ],
  'connect-src': [
    "'self'",
    "https://api.stripe.com",
    "https://*.supabase.co",
  ],
  'frame-src': ["https://js.stripe.com"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

export function buildCspHeader(): string {
  return Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}
