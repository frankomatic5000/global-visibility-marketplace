'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDistance } from '@/lib/distance';
import { sampleRegions, sampleUsers, getCountryAndCity } from '@/data/sample-data';
import type { Listing } from '@/types';

export interface ListingCardProps {
  listing: Listing;
  priority?: boolean; // for above-fold images
  distance?: number | null; // distance in km
}

/**
 * Listing Card Component
 * Displays listing information with optional distance badge
 * 
 * Sunset Velocity styling:
 * - Distance badge: Golden (#FFC233)
 */
export default function ListingCard({ 
  listing, 
  priority = false,
  distance = null,
}: ListingCardProps) {
  const region = sampleRegions.find((r) => r.id === listing.region_id);
  const location = getCountryAndCity(listing.region_id);
  const host = sampleUsers.find((u) => u.id === listing.host_id);

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article className="bg-white rounded-xl shadow-sm border border-[#FF6B35]/10 overflow-hidden hover:shadow-md hover:border-[#FF6B35]/30 transition-all cursor-pointer h-full flex flex-col">
        {/* Cover image with Next.js Image optimization */}
        <div className="relative h-48 bg-[#FFF8F5] overflow-hidden">
          {listing.cover_image_url ? (
            <Image
              src={listing.cover_image_url}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-[#FF6B35]/10 to-[#9B59B6]/10">
              🎙️
            </div>
          )}
          
          {/* Featured badge */}
          {listing.is_featured && (
            <span className="absolute top-3 left-3 bg-[#FFC233] text-[#1A1A2E] text-xs font-semibold px-2 py-1 rounded-full shadow-sm font-[family-name:var(--font-syne)]">
              Featured
            </span>
          )}
          
          {/* Distance badge - Golden for Sunset Velocity theme */}
          {distance !== null && distance >= 0 && (
            <span className="absolute top-3 left-3 bg-[#FFC233] text-[#1A1A2E] text-xs font-semibold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(distance, 'km')}
            </span>
          )}
          
          {/* Platform type badge */}
          <span className={`absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#1A1A2E]/70 text-xs font-medium px-2 py-1 rounded-full capitalize ${distance !== null ? '' : ''}`}>
            {listing.platform_type}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Listing type badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#FF6B35] uppercase tracking-wide font-[family-name:var(--font-syne)]">
              {listing.listing_type.replace('_', ' ')}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2 line-clamp-2 group-hover:text-[#FF6B35] transition-colors font-[family-name:var(--font-playfair)]">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#1A1A2E]/60 mb-4 line-clamp-2 flex-1">
            {listing.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-sm text-[#1A1A2E]/50 mb-4">
            <svg
              className="w-4 h-4 mr-1 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location ? `${location.city}, ${location.country}` : region?.name}
          </div>

          {/* Divider */}
          <div className="border-t border-[#FF6B35]/10 pt-4">
            {/* Host info */}
            <div className="flex items-center mb-4">
              {host?.avatar_url ? (
                <Image
                  src={host.avatar_url}
                  alt={host.full_name || ''}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#9B59B6]/20 mr-3" />
              )}
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">
                  {host?.full_name || 'Unknown Host'}
                </p>
                {host?.is_verified && (
                  <span className="text-xs text-[#FF6B35]">✓ Verified</span>
                )}
              </div>
            </div>

            {/* Price and duration */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-[#1A1A2E]">
                  {formatPrice(listing.price_cents, listing.currency)}
                </span>
                {listing.duration_mins && (
                  <span className="text-sm text-[#1A1A2E]/50 ml-2">
                    / {listing.duration_mins}min
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
