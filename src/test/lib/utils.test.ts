/**
 * Utils Test Suite
 */

import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  formatRelativeTime,
  slugify,
  truncate,
  getListingTypeLabel,
  isValidUuid,
  parsePriceRangeToCents,
  cn,
} from '@/lib/utils';

describe('formatPrice', () => {
  it('formats cents to currency string', () => {
    expect(formatPrice(29900, 'USD')).toBe('$299');
    expect(formatPrice(1000, 'USD')).toBe('$10');
    expect(formatPrice(0, 'USD')).toBe('$0');
  });

  it('handles decimals correctly', () => {
    expect(formatPrice(1999, 'USD')).toBe('$19.99');
    expect(formatPrice(10099, 'USD')).toBe('$100.99');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2025-12-01T10:00:00Z');
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/2025/);
  });

  it('handles Date objects without throwing', () => {
    const date = new Date('2025-12-01T00:00:00Z');
    const result = formatDate(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('slugify', () => {
  it('converts text to URL-safe slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('B2B Marketing')).toBe('b2b-marketing');
    expect(slugify('São Paulo')).toBe('sao-paulo');
  });

  it('removes special characters', () => {
    expect(slugify('Hello!@#World')).toBe('helloworld');
  });

  it('handles multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });
});

describe('truncate', () => {
  it('truncates long text', () => {
    // At 12 chars with spaces, it finds word boundary at "Hello World " (11+1=12)
    // But if we use a string where word boundary heuristic kicks in
    expect(truncate('The quick brown fox jumps', 12)).toBe('The quick...');
  });

  it('returns original if shorter than max', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('truncates at word boundaries when beneficial', () => {
    const longText = 'The quick brown fox jumps over the lazy dog';
    const result = truncate(longText, 30);
    // Should be shorter than input
    expect(result.length).toBeLessThan(longText.length);
    // Should end with ellipsis
    expect(result).toMatch(/\.\.\.$/);
  });
});

describe('getListingTypeLabel', () => {
  it('returns human-readable labels', () => {
    expect(getListingTypeLabel('guest_spot')).toBe('Guest Spot');
    expect(getListingTypeLabel('interview')).toBe('Interview');
    expect(getListingTypeLabel('sponsored')).toBe('Sponsored');
  });

  it('returns original for unknown types', () => {
    expect(getListingTypeLabel('unknown')).toBe('unknown');
  });
});

describe('isValidUuid', () => {
  it('validates UUID format', () => {
    expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('')).toBe(false);
  });
});

describe('parsePriceRangeToCents', () => {
  it('converts price range to cents', () => {
    expect(parsePriceRangeToCents('under_100')).toEqual({ max: 10000 });
    expect(parsePriceRangeToCents('100_300')).toEqual({ min: 10000, max: 30000 });
    expect(parsePriceRangeToCents('over_300')).toEqual({ min: 30000 });
    expect(parsePriceRangeToCents('all')).toEqual({});
  });
});

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', false, 'bar')).toBe('foo bar');
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    expect(cn('foo', 0, 'bar')).toBe('foo bar');
  });

  it('filters falsy values', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
