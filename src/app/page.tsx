'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sampleRegions, sampleListings } from '@/data/sample-data';
import { formatPrice } from '@/lib/utils';
import ListingCard from '@/components/ListingCard';

export default function LandingPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Get countries and cities
  const countries = sampleRegions.filter(r => r.level === 1);
  const cities = selectedCountry 
    ? sampleRegions.filter(r => r.parent_id === countries.find(c => c.slug === selectedCountry)?.id)
    : [];

  // Get featured listings
  const featuredListings = sampleListings.filter(l => l.is_featured);

  const handleCountrySelect = (slug: string) => {
    setSelectedCountry(slug);
    setSelectedCity(null);
  };

  const handleCitySelect = (slug: string) => {
    setSelectedCity(slug);
    router.push(`/browse/${selectedCountry}/${slug}`);
  };

  const handleExplore = () => {
    if (selectedCity) {
      router.push(`/browse/${selectedCountry}/${selectedCity}`);
    } else if (selectedCountry) {
      router.push(`/browse/${selectedCountry}`);
    } else {
      router.push('/browse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Book Visibility
            <span className="text-blue-600"> Anywhere </span>
            in the World
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with podcast hosts, event organizers, and media outlets in 100+ cities. 
            Get your brand in front of the right audiences, everywhere.
          </p>

          {/* Region Selector */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Find opportunities in your target region
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Country selector */}
              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry || ''}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.slug}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City selector */}
              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explore button */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={handleExplore}
                  disabled={!selectedCountry && !selectedCity}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Popular regions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {countries.slice(0, 4).map((country) => (
                  <button
                    key={country.id}
                    onClick={() => router.push(`/browse/${country.slug}`)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Get noticed by engaged audiences worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => router.push('/browse')}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse All Listings →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Discover
              </h3>
              <p className="text-gray-600">
                Browse listings by region. Filter by platform type, audience size, and budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Book
              </h3>
              <p className="text-gray-600">
                Request a booking with your pitch. Pay securely through Stripe.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Shine
              </h3>
              <p className="text-gray-600">
                Get featured and reach new audiences. Leave a review after your spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Have a Podcast or Media Platform?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Monetize your audience by hosting guests from around the world.
          </p>
          <button
            onClick={() => router.push('/host')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Become a Host →
          </button>
        </div>
      </section>
    </div>
  );
}
