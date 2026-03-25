'use client';

import Link from 'next/link';
import { Listing } from '@/types';
import { formatPrice, getListingTypeLabel } from '@/lib/utils';
import { sampleRegions, sampleUsers, getCountryAndCity } from '@/data/sample-data';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const region = sampleRegions.find(r => r.id === listing.region_id);
  const location = getCountryAndCity(listing.region_id);
  const host = sampleUsers.find(u => u.id === listing.host_id);

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Cover image */}
        <div className="relative h-48 bg-gray-200">
          {listing.cover_image_url ? (
            <img
              src={listing.cover_image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🎙️
            </div>
          )}
          {listing.is_featured && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Platform type badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {listing.platform_type}
            </span>
            <span className="text-xs text-gray-500">
              {getListingTypeLabel(listing.listing_type)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {listing.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="mr-1">📍</span>
            {location ? `${location.city}, ${location.country}` : region?.name}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-4">
            {/* Host info */}
            <div className="flex items-center mb-4">
              {host?.avatar_url ? (
                <img
                  src={host.avatar_url}
                  alt={host.full_name || ''}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {host?.full_name || 'Unknown Host'}
                </p>
                {host?.is_verified && (
                  <span className="text-xs text-blue-500">✓ Verified</span>
                )}
              </div>
            </div>

            {/* Price and duration */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(listing.price_cents, listing.currency)}
                </span>
                {listing.duration_mins && (
                  <span className="text-sm text-gray-500 ml-2">
                    / {listing.duration_mins}min
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
