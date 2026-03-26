'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sampleRegions, sampleListings, getListingsByCountry } from '@/data/sample-data';
import { getCityById } from '@/data/countries';
import { calculateDistance, type Coordinates, type RadiusOption } from '@/lib/distance';
import ListingCard from '@/components/ListingCard';
import NearMeFilter from '@/components/NearMeFilter';

interface ListingWithDistance {
  listing: typeof sampleListings[0];
  distance: number | null;
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get country from URL or default
  const countrySlug = searchParams.get('country') || 'us';
  const citySlug = searchParams.get('city') || null;

  // Get current country and cities
  const currentCountry = sampleRegions.find(r => r.slug === countrySlug && r.level === 1);
  const citiesInCountry = sampleRegions.filter(r => r.parent_id === currentCountry?.id);
  
  // Get listings for this country
  const countryListings = useMemo(() => {
    if (citySlug) {
      const city = sampleRegions.find(r => r.slug === citySlug);
      return sampleListings.filter(l => l.region_id === city?.id);
    }
    return getListingsByCountry(countrySlug);
  }, [countrySlug, citySlug]);

  // Filter state
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Near Me filter state
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<RadiusOption>(0);

  // Calculate distances and apply all filters
  const listingsWithDistance: ListingWithDistance[] = useMemo(() => {
    return countryListings.map(listing => {
      const city = getCityById(listing.region_id);
      const distance = (userLocation && city)
        ? calculateDistance(userLocation, { lat: city.lat, lng: city.lng }, 'km')
        : null;
      return { listing, distance };
    });
  }, [countryListings, userLocation]);

  // Apply filters
  const filteredListings = useMemo(() => {
    let result = [...listingsWithDistance];

    // Filter by distance if user location and radius are set
    if (userLocation && selectedRadius > 0) {
      result = result.filter(({ distance }) => distance !== null && distance <= selectedRadius);
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      result = result.filter(({ listing }) => listing.platform_type === platformFilter);
    }

    // Filter by price
    if (priceFilter === 'under_100') {
      result = result.filter(({ listing }) => listing.price_cents < 10000);
    } else if (priceFilter === '100_300') {
      result = result.filter(({ listing }) => listing.price_cents >= 10000 && listing.price_cents <= 30000);
    } else if (priceFilter === 'over_300') {
      result = result.filter(({ listing }) => listing.price_cents > 30000);
    }

    // Sort
    if (sortBy === 'featured') {
      result.sort((a, b) => (b.listing.is_featured ? 1 : 0) - (a.listing.is_featured ? 1 : 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.listing.price_cents - b.listing.price_cents);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.listing.price_cents - a.listing.price_cents);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.listing.created_at).getTime() - new Date(a.listing.created_at).getTime());
    } else if (sortBy === 'distance') {
      // Sort by distance - listings without distance go to the end
      result.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return result;
  }, [listingsWithDistance, selectedRadius, platformFilter, priceFilter, sortBy, userLocation]);

  // Extract just the listings for display
  const displayListings = filteredListings.map(({ listing }) => listing);
  
  // Create a distance map for quick lookup
  const distanceMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredListings.forEach(({ listing, distance }) => {
      if (distance !== null) {
        map.set(listing.id, distance);
      }
    });
    return map;
  }, [filteredListings]);

  if (!currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F5]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4">Country not found</h1>
          <Link href="/browse" className="text-[#FF6B35] hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#FF6B35]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm">
            <Link href="/browse" className="text-[#1A1A2E]/50 hover:text-[#1A1A2E]">
              Browse
            </Link>
            <span className="mx-2 text-[#1A1A2E]/30">/</span>
            <Link href={`/browse?country=${currentCountry.slug}`} className="text-[#1A1A2E]/50 hover:text-[#1A1A2E]">
              {currentCountry.name}
            </Link>
            {citySlug && (
              <>
                <span className="mx-2 text-[#1A1A2E]/30">/</span>
                <span className="text-[#1A1A2E] font-medium">
                  {sampleRegions.find(r => r.slug === citySlug)?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="space-y-6 sticky top-24">
              {/* Near Me Filter */}
              <NearMeFilter
                selectedRadius={selectedRadius}
                onRadiusChange={setSelectedRadius}
                userLocation={userLocation}
                onLocationChange={setUserLocation}
              />

              {/* Other Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-[#FF6B35]/10 p-6">
                <h2 className="font-semibold text-[#1A1A2E] mb-4 font-[family-name:var(--font-dm-sans)]">Filters</h2>

                {/* City Filter */}
                {!citySlug && citiesInCountry.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                      City
                    </label>
                    <select
                      value={citySlug || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          router.push(`/browse/${currentCountry.slug}?city=${e.target.value}`);
                        } else {
                          router.push(`/browse?country=${currentCountry.slug}`);
                        }
                      }}
                      className="w-full px-3 py-2 border border-[#FF6B35]/20 rounded-lg bg-white text-[#1A1A2E]"
                    >
                      <option value="">All cities</option>
                      {citiesInCountry.map((city) => (
                        <option key={city.id} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Platform Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                    Platform Type
                  </label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FF6B35]/20 rounded-lg bg-white text-[#1A1A2E]"
                  >
                    <option value="all">All types</option>
                    <option value="podcast">Podcast</option>
                    <option value="event">Event</option>
                    <option value="magazine">Magazine</option>
                    <option value="influencer">Influencer</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FF6B35]/20 rounded-lg bg-white text-[#1A1A2E]"
                  >
                    <option value="all">All prices</option>
                    <option value="under_100">Under $100</option>
                    <option value="100_300">$100 - $300</option>
                    <option value="over_300">Over $300</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FF6B35]/20 rounded-lg bg-white text-[#1A1A2E]"
                  >
                    <option value="featured">Featured first</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    {userLocation && <option value="distance">Nearest first</option>}
                  </select>
                </div>

                {/* Clear filters */}
                <button
                  onClick={() => {
                    setPlatformFilter('all');
                    setPriceFilter('all');
                    setSortBy('featured');
                    setSelectedRadius(0);
                  }}
                  className="w-full text-sm text-[#FF6B35] hover:text-[#E55A2B]"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                {citySlug 
                  ? `Listings in ${sampleRegions.find(r => r.slug === citySlug)?.name}`
                  : `Listings in ${currentCountry.name}`
                }
              </h1>
              <p className="text-[#1A1A2E]/60 mt-1">
                {displayListings.length} opportunity{displayListings.length !== 1 ? 'ies' : ''} found
                {userLocation && selectedRadius > 0 && (
                  <span className="text-[#FF6B35] ml-2">
                    within {selectedRadius} km
                  </span>
                )}
              </p>
            </div>

            {/* Listings Grid */}
            {displayListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayListings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    distance={distanceMap.get(listing.id) ?? null}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-[#FF6B35]/10 p-12 text-center">
                <p className="text-[#1A1A2E]/50 mb-4">
                  {userLocation && selectedRadius > 0
                    ? 'No listings found within the selected radius. Try increasing the distance or clearing the filter.'
                    : 'No listings match your filters'}
                </p>
                <button
                  onClick={() => {
                    setPlatformFilter('all');
                    setPriceFilter('all');
                    setSelectedRadius(0);
                  }}
                  className="text-[#FF6B35] hover:text-[#E55A2B]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F5]">
        <div className="text-[#1A1A2E]/50">Loading...</div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
