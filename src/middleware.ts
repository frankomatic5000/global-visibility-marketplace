import { NextResponse, type NextRequest } from 'next/server';
import { isValidSlug, isValidUuid } from '@/lib/validation';

/**
 * Next.js Middleware - Global Visibility Marketplace
 * 
 * Handles:
 * - Security headers (CSP, HSTS, etc.)
 * - Request validation
 * - Region-first routing validation
 * - Auth state for protected routes
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ============================================
  // Security Headers
  // ============================================
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://*.unsplash.com",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co",
      "frame-src https://js.stripe.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; ')
  );

  // HSTS (HTTP Strict Transport Security)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // X-Frame-Options (legacy but good to have)
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // ============================================
  // Request Validation
  // ============================================

  // Validate URL parameters for browse routes
  if (pathname.startsWith('/browse')) {
    const country = request.nextUrl.searchParams.get('country');
    const city = request.nextUrl.searchParams.get('city');

    if (country && !isValidSlug(country)) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }

    if (city && !isValidSlug(city)) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  // Validate listing ID format
  if (pathname.startsWith('/listings/')) {
    const listingId = pathname.split('/')[2];
    if (listingId && !isValidUuid(listingId)) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  // Validate host ID format
  if (pathname.startsWith('/hosts/')) {
    const hostId = pathname.split('/')[2];
    if (hostId && !isValidUuid(hostId)) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  // ============================================
  // Region-First URL Normalization
  // ============================================

  // Normalize browse URLs (remove trailing slashes, lowercase)
  if (pathname.startsWith('/browse/')) {
    const segments = pathname.split('/').filter(Boolean);
    
    // If /browse/[country] with query params, ensure proper format
    if (segments.length === 2 && segments[0] === 'browse') {
      const countrySlug = segments[1];
      if (countrySlug && countrySlug !== countrySlug.toLowerCase()) {
        // Redirect to lowercase
        const url = request.nextUrl.clone();
        url.pathname = `/browse/${countrySlug.toLowerCase()}`;
        return NextResponse.redirect(url);
      }
    }

    // If /browse/[country]/[city]
    if (segments.length === 3 && segments[0] === 'browse') {
      const countrySlug = segments[1];
      const citySlug = segments[2];
      if (countrySlug && citySlug) {
        const needsLowercase = 
          countrySlug !== countrySlug.toLowerCase() ||
          citySlug !== citySlug.toLowerCase();
        
        if (needsLowercase) {
          const url = request.nextUrl.clone();
          url.pathname = `/browse/${countrySlug.toLowerCase()}/${citySlug.toLowerCase()}`;
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // ============================================
  // Protected Routes (future auth integration)
  // ============================================

  const protectedPaths = ['/dashboard', '/settings', '/bookings', '/host/dashboard'];
  
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // For MVP, redirect to home (auth not implemented)
    // In production, check auth cookies/session
    const isAuthenticated = request.cookies.has('session_token');
    
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (_next/api/*)
     * - static files (_next/static/*)
     * - public files (favicon.ico, etc.)
     */
    '/((?!_next/api|_next/static|favicon.ico).*)',
  ],
};
