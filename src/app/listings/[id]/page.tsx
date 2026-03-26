'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { sampleListings, sampleUsers, sampleMediaProfiles, getCountryAndCity } from '@/data/sample-data';
import { formatPrice, getListingTypeLabel, formatDate } from '@/lib/utils';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;

  const listing = sampleListings.find(l => l.id === listingId);
  const host = listing ? sampleUsers.find(u => u.id === listing.host_id) : null;
  const mediaProfile = listing ? sampleMediaProfiles.find(m => m.id === listing.media_profile_id) : null;
  const location = listing ? getCountryAndCity(listing.region_id) : null;

  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-athos-navy mb-4">Listing not found</h1>
          <Link href="/browse" className="text-athos-azure hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    setIsBooking(true);
    // Simulate booking flow
    setTimeout(() => {
      alert('This is a mock booking flow. In production, this would redirect to Stripe Checkout.');
      setIsBooking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Section Header with Quadrant Grid Pattern */}
      <section className="pattern-section-header border-b border-athos-azure/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-4 section-header-content">
            <Link href="/browse" className="text-white/70 hover:text-white">
              Browse
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <Link href={`/browse/${listing.region_id.split('-')[0]}`} className="text-white/70 hover:text-white">
              {location?.country || 'Country'}
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="text-white font-medium truncate">{listing.title}</span>
          </nav>
          
          <div className="section-header-content">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                {listing.platform_type}
              </span>
              <span className="px-3 py-1 bg-white/80 text-athos-navy text-sm rounded-full">
                {getListingTypeLabel(listing.listing_type)}
              </span>
              {listing.is_featured && (
                <span className="px-3 py-1 bg-athos-gold text-athos-navy text-sm font-medium rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
              {listing.title}
            </h1>
            <div className="flex items-center text-white/80 mt-3">
              <span className="mr-2">📍</span>
              {location ? `${location.city}, ${location.country}` : 'Location TBD'}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm border border-athos-azure/10 overflow-hidden mb-6">
              {listing.cover_image_url ? (
                <img
                  src={listing.cover_image_url}
                  alt={listing.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-athos-azure/10 to-athos-cerulean/10 flex items-center justify-center text-6xl">
                  🎙️
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-xl shadow-sm border border-athos-azure/10 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-athos-azure/10 text-athos-azure text-sm font-medium rounded-full">
                      {listing.platform_type}
                    </span>
                    <span className="px-3 py-1 bg-athos-snow text-athos-navy/70 text-sm rounded-full">
                      {getListingTypeLabel(listing.listing_type)}
                    </span>
                    {listing.is_featured && (
                      <span className="px-3 py-1 bg-athos-gold/20 text-athos-mustard text-sm font-medium rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-athos-navy font-[family-name:var(--font-playfair)]">
                    {listing.title}
                  </h1>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-athos-navy/60 mb-6">
                <span className="mr-2">📍</span>
                {location ? `${location.city}, ${location.country}` : 'Location TBD'}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-athos-navy mb-3 font-[family-name:var(--font-dm-sans)]">About this opportunity</h2>
                <p className="text-athos-navy/60 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Duration */}
              {listing.duration_mins && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-athos-navy mb-3 font-[family-name:var(--font-dm-sans)]">Duration</h2>
                  <p className="text-athos-navy/60">
                    Approximately {listing.duration_mins} minutes
                  </p>
                </div>
              )}

              {/* Media Profile */}
              {mediaProfile && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-athos-navy mb-3 font-[family-name:var(--font-dm-sans)]">About the platform</h2>
                  <div className="bg-athos-snow rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-athos-azure to-athos-cerulean rounded-full flex items-center justify-center text-xl">
                        🎙️
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-athos-navy">{mediaProfile.platform_name}</h3>
                        {mediaProfile.handle && (
                          <p className="text-sm text-athos-navy/50">{mediaProfile.handle}</p>
                        )}
                        {mediaProfile.audience_size && (
                          <p className="text-sm text-athos-navy/60 mt-1">
                            Audience: {mediaProfile.audience_size.toLocaleString()} listeners
                          </p>
                        )}
                        {mediaProfile.audience_demo && (
                          <p className="text-sm text-athos-navy/60">
                            Demo: {mediaProfile.audience_demo}
                          </p>
                        )}
                        {mediaProfile.description && (
                          <p className="text-sm text-athos-navy/60 mt-2">
                            {mediaProfile.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Host Info */}
              {host && (
                <div>
                  <h2 className="text-lg font-semibold text-athos-navy mb-3 font-[family-name:var(--font-dm-sans)]">About the host</h2>
                  <div className="bg-athos-snow rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {host.avatar_url ? (
                        <img
                          src={host.avatar_url}
                          alt={host.full_name || ''}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-athos-azure/20 to-athos-cerulean/20 rounded-full" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-athos-navy">{host.full_name}</h3>
                          {host.is_verified && (
                            <span className="text-athos-azure text-sm">✓ Verified</span>
                          )}
                        </div>
                        {host.bio && (
                          <p className="text-sm text-athos-navy/60 mt-1">{host.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-athos-azure/10 p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-athos-navy">
                  {formatPrice(listing.price_cents, listing.currency)}
                </span>
                <span className="text-athos-navy/50 ml-2">per spot</span>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-athos-navy/70 mb-2">
                    Message to host (optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd be a great guest..."
                    rows={4}
                    className="w-full px-4 py-3 border border-athos-azure/20 rounded-lg focus:ring-2 focus:ring-athos-azure focus:border-athos-azure bg-white text-athos-navy"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-athos-azure text-white py-3 px-4 rounded-lg font-semibold hover:bg-athos-deep-blue transition-colors disabled:bg-athos-azure/50 font-[family-name:var(--font-syne)]"
                >
                  {isBooking ? 'Processing...' : 'Book Now'}
                </button>

                <p className="text-xs text-athos-navy/50 text-center">
                  You won't be charged until the host confirms your booking.
                </p>
              </div>

              {/* Listing Meta */}
              <div className="mt-6 pt-6 border-t border-athos-azure/10">
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-athos-navy/50">Listed</dt>
                    <dd className="text-athos-navy">{formatDate(listing.created_at)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-athos-navy/50">Platform</dt>
                    <dd className="text-athos-navy capitalize">{listing.platform_type}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-athos-navy/50">Type</dt>
                    <dd className="text-athos-navy">{getListingTypeLabel(listing.listing_type)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}