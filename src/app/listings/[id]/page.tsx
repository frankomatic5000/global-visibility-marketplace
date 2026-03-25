'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { sampleListings, sampleRegions, sampleUsers, sampleMediaProfiles, getCountryAndCity } from '@/data/sample-data';
import { formatPrice, getListingTypeLabel, formatDate } from '@/lib/utils';

export default function ListingDetailPage() {
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
          <Link href="/browse" className="text-blue-600 hover:underline">
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm">
            <Link href="/browse" className="text-gray-500 hover:text-gray-900">
              Browse
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/browse/${listing.region_id.split('-')[0]}`} className="text-gray-500 hover:text-gray-900">
              {location?.country || 'Country'}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {listing.cover_image_url ? (
                <img
                  src={listing.cover_image_url}
                  alt={listing.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-6xl">
                  🎙️
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {listing.platform_type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {getListingTypeLabel(listing.listing_type)}
                    </span>
                    {listing.is_featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {listing.title}
                  </h1>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-6">
                <span className="mr-2">📍</span>
                {location ? `${location.city}, ${location.country}` : 'Location TBD'}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About this opportunity</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Duration */}
              {listing.duration_mins && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Duration</h2>
                  <p className="text-gray-600">
                    Approximately {listing.duration_mins} minutes
                  </p>
                </div>
              )}

              {/* Media Profile */}
              {mediaProfile && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About the platform</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        🎙️
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{mediaProfile.platform_name}</h3>
                        {mediaProfile.handle && (
                          <p className="text-sm text-gray-500">{mediaProfile.handle}</p>
                        )}
                        {mediaProfile.audience_size && (
                          <p className="text-sm text-gray-600 mt-1">
                            Audience: {mediaProfile.audience_size.toLocaleString()} listeners
                          </p>
                        )}
                        {mediaProfile.audience_demo && (
                          <p className="text-sm text-gray-600">
                            Demo: {mediaProfile.audience_demo}
                          </p>
                        )}
                        {mediaProfile.description && (
                          <p className="text-sm text-gray-600 mt-2">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About the host</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {host.avatar_url ? (
                        <img
                          src={host.avatar_url}
                          alt={host.full_name || ''}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{host.full_name}</h3>
                          {host.is_verified && (
                            <span className="text-blue-500 text-sm">✓ Verified</span>
                          )}
                        </div>
                        {host.bio && (
                          <p className="text-sm text-gray-600 mt-1">{host.bio}</p>
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
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(listing.price_cents, listing.currency)}
                </span>
                <span className="text-gray-500 ml-2">per spot</span>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to host (optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd be a great guest..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {isBooking ? 'Processing...' : 'Book Now'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged until the host confirms your booking.
                </p>
              </div>

              {/* Listing Meta */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Listed</dt>
                    <dd className="text-gray-900">{formatDate(listing.created_at)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Platform</dt>
                    <dd className="text-gray-900 capitalize">{listing.platform_type}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="text-gray-900">{getListingTypeLabel(listing.listing_type)}</dd>
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
