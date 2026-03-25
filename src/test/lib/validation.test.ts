/**
 * Validation Utilities Test Suite
 */

import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  stripHtml,
  sanitizeText,
  sanitizeSlug,
  sanitizeEmail,
  parsePriceRange,
  parseSortBy,
  parsePlatformType,
  priceRangeToCents,
  generateCsrfToken,
  isValidOrigin,
  checkRateLimit,
} from '@/lib/validation';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    const result = escapeHtml('<script>alert("xss")</script>');
    // Should escape < and > and quotes
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    expect(result).toContain('&quot;');
    // Original tags should not be present
    expect(result).not.toContain('<script>');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes comparison operators', () => {
    expect(escapeHtml('5 > 3')).toBe('5 &gt; 3');
    expect(escapeHtml('3 < 5')).toBe('3 &lt; 5');
  });

  it('handles empty strings', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null as unknown as string)).toBe('');
  });
});

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
  });

  it('handles nested tags', () => {
    expect(stripHtml('<div><span><a href="#">Link</a></span></div>')).toBe('Link');
  });

  it('returns original text if no tags', () => {
    expect(stripHtml('Hello World')).toBe('Hello World');
  });
});

describe('sanitizeText', () => {
  it('strips and escapes HTML', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeText(input);
    // Should remove tags and escape special chars
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('handles plain text', () => {
    expect(sanitizeText('Hello World')).toBe('Hello World');
  });
});

describe('sanitizeSlug', () => {
  it('validates and returns slug', () => {
    expect(sanitizeSlug('hello-world')).toBe('hello-world');
    expect(sanitizeSlug('B2B-Marketing')).toBe('b2b-marketing');
  });

  it('returns null for invalid slugs', () => {
    expect(sanitizeSlug('')).toBe(null);
    expect(sanitizeSlug('hello world')).toBe(null);
    expect(sanitizeSlug('hello@world')).toBe(null);
  });
});

describe('sanitizeEmail', () => {
  it('validates and normalizes email', () => {
    expect(sanitizeEmail('  Test@Example.COM  ')).toBe('test@example.com');
  });

  it('returns null for invalid emails', () => {
    expect(sanitizeEmail('not-an-email')).toBe(null);
    expect(sanitizeEmail('')).toBe(null);
    expect(sanitizeEmail('@nodomain')).toBe(null);
  });
});

describe('parsePriceRange', () => {
  it('parses valid price ranges', () => {
    expect(parsePriceRange('all')).toBe('all');
    expect(parsePriceRange('under_100')).toBe('under_100');
    expect(parsePriceRange('100_300')).toBe('100_300');
    expect(parsePriceRange('over_300')).toBe('over_300');
  });

  it('defaults to all for invalid values', () => {
    expect(parsePriceRange('invalid')).toBe('all');
    expect(parsePriceRange(null)).toBe('all');
    expect(parsePriceRange(undefined)).toBe('all');
  });
});

describe('parseSortBy', () => {
  it('parses valid sort options', () => {
    expect(parseSortBy('featured')).toBe('featured');
    expect(parseSortBy('newest')).toBe('newest');
    expect(parseSortBy('price_low')).toBe('price_low');
    expect(parseSortBy('price_high')).toBe('price_high');
  });

  it('defaults to featured for invalid values', () => {
    expect(parseSortBy('invalid')).toBe('featured');
  });
});

describe('parsePlatformType', () => {
  it('parses valid platform types', () => {
    expect(parsePlatformType('podcast')).toBe('podcast');
    expect(parsePlatformType('event')).toBe('event');
    expect(parsePlatformType('magazine')).toBe('magazine');
    expect(parsePlatformType('influencer')).toBe('influencer');
    expect(parsePlatformType('all')).toBe('all');
  });

  it('defaults to all for invalid values', () => {
    expect(parsePlatformType('invalid')).toBe('all');
  });
});

describe('priceRangeToCents', () => {
  it('converts price ranges to min/max cents', () => {
    expect(priceRangeToCents('under_100')).toEqual({ max: 10000 });
    expect(priceRangeToCents('100_300')).toEqual({ min: 10000, max: 30000 });
    expect(priceRangeToCents('over_300')).toEqual({ min: 30000 });
    expect(priceRangeToCents('all')).toEqual({});
  });
});

describe('generateCsrfToken', () => {
  it('generates a random token', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    
    expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });
});

describe('isValidOrigin', () => {
  const allowedOrigins = ['https://example.com', 'https://app.example.com'];

  it('validates allowed origins', () => {
    expect(isValidOrigin('https://example.com', allowedOrigins)).toBe(true);
    expect(isValidOrigin('https://app.example.com', allowedOrigins)).toBe(true);
  });

  it('rejects disallowed origins', () => {
    expect(isValidOrigin('https://evil.com', allowedOrigins)).toBe(false);
    expect(isValidOrigin(null, allowedOrigins)).toBe(false);
    expect(isValidOrigin('', allowedOrigins)).toBe(false);
  });
});

describe('checkRateLimit', () => {
  it('allows requests under limit', () => {
    const result = checkRateLimit('test-key', 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks requests over limit', () => {
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      checkRateLimit('test-key-limit', 5, 60000);
    }
    
    const result = checkRateLimit('test-key-limit', 5, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
