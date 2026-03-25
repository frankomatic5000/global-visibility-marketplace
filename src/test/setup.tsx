/**
 * Vitest Test Setup
 * Global test configuration and utilities
 */

/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { vi, expect, afterEach, afterAll } from 'vitest';

// ============================================
// Mock Next.js Navigation
// ============================================

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  Link: vi.fn(({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  )),
}));

// ============================================
// Mock Image Component
// ============================================

vi.mock('next/image', () => ({
  default: (props: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
  }) => {
    const { src, alt, width, height, fill, className } = props;
    return (
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={fill ? { objectFit: 'cover' } : undefined}
      />
    );
  },
}));

// ============================================
// Mock Supabase
// ============================================

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          then: vi.fn(),
        })),
        order: vi.fn(() => ({
          then: vi.fn(),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    },
  })),
}));

// ============================================
// Mock Crypto
// ============================================

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  },
});

// ============================================
// Global Test Utilities
// ============================================

// Extend expect with jest-dom matchers
expect.extend({
  toBeInTheDocument(element: Element | null) {
    if (!element) {
      return {
        pass: false,
        message: () => 'Element is null',
      };
    }
    const isInDocument = element.ownerDocument?.body?.contains(element);
    return {
      pass: !!isInDocument,
      message: () => `Expected element to be in the document`,
    };
  },
});

// ============================================
// Cleanup
// ============================================

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});
