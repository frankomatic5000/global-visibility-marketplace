/**
 * Utility Functions
 * Shared helpers for formatting, transformations, and common operations
 */

import type { ListingType, PlatformType } from '@/types';

// ============================================
// Price Formatting
// ============================================

/**
 * Format cents to currency string
 * @example formatPrice(29900, 'USD') => "$299.00"
 */
export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

// ============================================
// Date Formatting
// ============================================

/**
 * Format date to readable string
 * @example formatDate('2025-12-01') => "Dec 1, 2025"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date to short format
 * @example formatDateShort('2025-12-01') => "Dec 1"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ============================================
// String Utilities
// ============================================

/**
 * Generate URL-safe slug from text
 * @example slugify('Hello World!') => "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Trim hyphens from start/end
    .trim();
}

/**
 * Truncate text to max length with ellipsis
 * @example truncate('Hello World', 8) => "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return text.slice(0, maxLength) + '...';
  
  const truncated = text.slice(0, maxLength);
  // Don't cut mid-word if possible
  const lastSpace = truncated.lastIndexOf(' ');
  // If there's a word boundary before 70% of maxLength, use it
  if (lastSpace > maxLength * 0.3) {
    return truncated.slice(0, lastSpace).trim() + '...';
  }
  return truncated.trim() + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Title case formatting
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// Listing Helpers
// ============================================

/**
 * Get human-readable listing type label
 */
export function getListingTypeLabel(type: string): string {
  const labels: Record<ListingType, string> = {
    guest_spot: 'Guest Spot',
    sponsored: 'Sponsored',
    featured: 'Featured',
    interview: 'Interview',
    article: 'Article',
    other: 'Other',
  };
  return labels[type as ListingType] || type;
}

/**
 * Get platform type icon (emoji for MVP, can be replaced with SVGs later)
 */
export function getPlatformIcon(type: string): string {
  const icons: Record<PlatformType, string> = {
    podcast: '🎙️',
    event: '🎪',
    magazine: '📰',
    influencer: '⭐',
  };
  return icons[type as PlatformType] || '📢';
}

/**
 * Get price range filter label
 */
export function getPriceRangeLabel(range: string): string {
  const labels: Record<string, string> = {
    all: 'All prices',
    under_100: 'Under $100',
    '100_300': '$100 - $300',
    over_300: 'Over $300',
  };
  return labels[range] || range;
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is a valid UUID
 */
export function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// ============================================
// Array Helpers
// ============================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort array by key (ascending)
 */
export function sortByAsc<T>(array: T[], keyFn: (item: T) => number | string): T[] {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  });
}

/**
 * Sort array by key (descending)
 */
export function sortByDesc<T>(array: T[], keyFn: (item: T) => number | string): T[] {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    if (aKey > bKey) return -1;
    if (aKey < bKey) return 1;
    return 0;
  });
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================
// Number Helpers
// ============================================

/**
 * Format large numbers with K/M suffixes
 * @example formatCompact(50000) => "50K"
 */
export function formatCompact(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toString();
}

/**
 * Parse price range to min/max cents
 */
export function parsePriceRangeToCents(
  range: string
): { min?: number; max?: number } {
  switch (range) {
    case 'under_100':
      return { max: 10000 };
    case '100_300':
      return { min: 10000, max: 30000 };
    case 'over_300':
      return { min: 30000 };
    default:
      return {};
  }
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================
// Class Name Helper (simple cn implementation)
// ============================================

/**
 * Combine class names conditionally
 * @example cn('foo', isBar && 'bar', undefined && 'baz') => "foo bar"
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
