'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sampleRegions, sampleListings } from '@/data/sample-data';
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
    <div className="min-h-screen bg-[#FFF8F5]">
      {/* Hero Section - Sunset Gradient */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FF6B35] via-[#E55A2B] to-[#9B59B6]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
            Book Visibility
            <span className="text-[#FFC233]"> Anywhere </span>
            in the World
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto font-[family-name:var(--font-dm-sans)]">
            Connect with podcast hosts, event organizers, and media outlets in 100+ cities. 
            Get your brand in front of the right audiences, everywhere.
          </p>

          {/* Region Selector */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-dm-sans)]">
              Find opportunities in your target region
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Country selector */}
              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry || ''}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  className="w-full px-4 py-3 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white text-[#1A1A2E]"
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
                <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                  City
                </label>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-4 py-3 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] disabled:bg-[#FFF8F5] disabled:cursor-not-allowed bg-white text-[#1A1A2E]"
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
                <label className="block text-sm font-medium text-[#1A1A2E]/70 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={handleExplore}
                  disabled={!selectedCountry && !selectedCity}
                  className="w-full sm:w-auto px-8 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#E55A2B] transition-colors disabled:bg-[#1A1A2E]/20 disabled:cursor-not-allowed font-[family-name:var(--font-syne)]"
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 pt-6 border-t border-[#FF6B35]/10">
              <p className="text-sm text-[#1A1A2E]/50 mb-3">Popular regions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {countries.slice(0, 4).map((country) => (
                  <button
                    key={country.id}
                    onClick={() => router.push(`/browse/${country.slug}`)}
                    className="px-3 py-1 text-sm bg-[#FFF8F5] text-[#1A1A2E]/70 rounded-full hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] transition-colors"
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
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4 font-[family-name:var(--font-playfair)]">
              Featured Opportunities
            </h2>
            <p className="text-lg text-[#1A1A2E]/60">
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
              className="px-8 py-3 border-2 border-[#FF6B35] text-[#FF6B35] font-semibold rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors font-[family-name:var(--font-syne)]"
            >
              Browse All Listings →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF8F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A1A2E] text-center mb-12 font-[family-name:var(--font-playfair)]">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/20 to-[#9B59B6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2 font-[family-name:var(--font-dm-sans)]">
                1. Discover
              </h3>
              <p className="text-[#1A1A2E]/60">
                Browse listings by region. Filter by platform type, audience size, and budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/20 to-[#9B59B6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2 font-[family-name:var(--font-dm-sans)]">
                2. Book
              </h3>
              <p className="text-[#1A1A2E]/60">
                Request a booking with your pitch. Pay securely through Stripe.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/20 to-[#9B59B6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎙️</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2 font-[family-name:var(--font-dm-sans)]">
                3. Shine
              </h3>
              <p className="text-[#1A1A2E]/60">
                Get featured and reach new audiences. Leave a review after your spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#9B59B6] to-[#FF6B35]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            Have a Podcast or Media Platform?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Monetize your audience by hosting guests from around the world.
          </p>
          <button
            onClick={() => router.push('/host')}
            className="px-8 py-3 bg-white text-[#FF6B35] font-semibold rounded-lg hover:bg-[#FFF8F5] transition-colors font-[family-name:var(--font-syne)]"
          >
            Become a Host →
          </button>
        </div>
      </section>
    </div>
  );
}