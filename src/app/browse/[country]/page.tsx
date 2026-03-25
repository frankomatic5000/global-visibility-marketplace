'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sampleRegions, sampleListings, getListingsByCountry } from '@/data/sample-data';
import ListingCard from '@/components/ListingCard';

export default function CountryBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get country from URL
  const countrySlug = searchParams.get('country') || 'us';
  const citySlug = searchParams.get('city') || null;

  // Get current country and cities
  const currentCountry = sampleRegions.find(r => r.slug === countrySlug && r.level === 1);
  const cities = sampleRegions.filter(r => r.parent_id === currentCountry?.id);
  
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

  // Apply filters
  const filteredListings = useMemo(() => {
    let result = [...countryListings];

    if (platformFilter !== 'all') {
      result = result.filter(l => l.platform_type === platformFilter);
    }

    if (priceFilter === 'under_100') {
      result = result.filter(l => l.price_cents < 10000);
    } else if (priceFilter === '100_300') {
      result = result.filter(l => l.price_cents >= 10000 && l.price_cents <= 30000);
    } else if (priceFilter === 'over_300') {
      result = result.filter(l => l.price_cents > 30000);
    }

    if (sortBy === 'featured') {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.price_cents - b.price_cents);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.price_cents - a.price_cents);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [countryListings, platformFilter, priceFilter, sortBy]);

  if (!currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country not found</h1>
          <Link href="/browse" className="text-blue-600 hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">{currentCountry.name}</span>
            {citySlug && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900 font-medium">
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
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

              {/* City Filter */}
              {cities.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={citySlug || ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        router.push(`?country=${currentCountry.slug}&city=${e.target.value}`);
                      } else {
                        router.push(`?country=${currentCountry.slug}`);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All cities</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.slug}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Platform Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Type
                </label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All prices</option>
                  <option value="under_100">Under $100</option>
                  <option value="100_300">$100 - $300</option>
                  <option value="over_300">Over $300</option>
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="featured">Featured first</option>
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear filters */}
              <button
                onClick={() => {
                  setPlatformFilter('all');
                  setPriceFilter('all');
                  setSortBy('featured');
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {citySlug 
                  ? `Listings in ${sampleRegions.find(r => r.slug === citySlug)?.name}`
                  : `Listings in ${currentCountry.name}`
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredListings.length} opportunity{filteredListings.length !== 1 ? 'ies' : ''} found
              </p>
            </div>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">No listings match your filters</p>
                <button
                  onClick={() => {
                    setPlatformFilter('all');
                    setPriceFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-700"
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
