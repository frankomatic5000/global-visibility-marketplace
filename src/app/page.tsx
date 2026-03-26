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
    <div className="min-h-screen bg-athos-snow">
      {/* Hero Section — Athos Elegant Pattern (soft, readable) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 pattern-athos-hero-elegant">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-athos-navy mb-6 font-[family-name:var(--font-playfair)]">
            Book Visibility
            <span className="text-athos-azure"> Anywhere </span>
            in the World
          </h1>
          <p className="text-xl text-athos-charcoal mb-12 max-w-3xl mx-auto font-[family-name:var(--font-dm-sans)]">
            Connect with podcast hosts, event organizers, and media outlets in 100+ cities. 
            Get your brand in front of the right audiences, everywhere.
          </p>

          {/* Region Selector */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-athos-navy mb-6 font-[family-name:var(--font-dm-sans)]">
              Find opportunities in your target region
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Country selector */}
              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-athos-charcoal mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry || ''}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  className="w-full px-4 py-3 border border-athos-azure/20 rounded-lg focus:ring-2 focus:ring-athos-azure focus:border-athos-azure bg-white text-athos-navy"
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
                <label className="block text-sm font-medium text-athos-charcoal mb-2">
                  City
                </label>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-4 py-3 border border-athos-azure/20 rounded-lg focus:ring-2 focus:ring-athos-azure focus:border-athos-azure disabled:bg-athos-snow disabled:cursor-not-allowed bg-white text-athos-navy"
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
                <label className="block text-sm font-medium text-athos-charcoal mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={handleExplore}
                  disabled={!selectedCountry && !selectedCity}
                  className="w-full sm:w-auto px-8 py-3 bg-athos-azure text-white font-semibold rounded-lg hover:bg-athos-deep-blue transition-colors disabled:bg-athos-silver disabled:cursor-not-allowed font-[family-name:var(--font-syne)]"
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 pt-6 border-t border-athos-azure/10">
              <p className="text-sm text-athos-gray mb-3">Popular regions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {countries.slice(0, 4).map((country) => (
                  <button
                    key={country.id}
                    onClick={() => router.push(`/browse/${country.slug}`)}
                    className="px-3 py-1 text-sm bg-athos-pale-blue text-athos-azure rounded-full hover:bg-athos-azure hover:text-white transition-colors"
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
            <h2 className="text-3xl font-bold text-athos-navy mb-4 font-[family-name:var(--font-playfair)]">
              Featured Opportunities
            </h2>
            <p className="text-lg text-athos-gray">
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
              className="px-8 py-3 border-2 border-athos-azure text-athos-azure font-semibold rounded-lg hover:bg-athos-azure hover:text-white transition-colors font-[family-name:var(--font-syne)]"
            >
              Browse All Listings →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works — Athos Wave Divider */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 pattern-athos-waves">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-athos-navy text-center mb-12 font-[family-name:var(--font-playfair)]">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-athos-azure/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-athos-navy mb-2 font-[family-name:var(--font-dm-sans)]">
                1. Discover
              </h3>
              <p className="text-athos-gray">
                Browse listings by region. Filter by platform type, audience size, and budget.
              </p>
            </div>

            <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-athos-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-athos-navy mb-2 font-[family-name:var(--font-dm-sans)]">
                2. Book
              </h3>
              <p className="text-athos-gray">
                Request a booking with your pitch. Pay securely through Stripe.
              </p>
            </div>

            <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-athos-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎙️</span>
              </div>
              <h3 className="text-xl font-semibold text-athos-navy mb-2 font-[family-name:var(--font-dm-sans)]">
                3. Shine
              </h3>
              <p className="text-athos-gray">
                Get featured and reach new audiences. Leave a review after your spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-athos-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 pattern-athos-diamonds"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            Have a Podcast or Media Platform?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Monetize your audience by hosting guests from around the world.
          </p>
          <button
            onClick={() => router.push('/host')}
            className="px-8 py-3 bg-athos-gold text-athos-navy font-semibold rounded-lg hover:bg-athos-amber transition-colors font-[family-name:var(--font-syne)]"
          >
            Become a Host →
          </button>
        </div>
      </section>
    </div>
  );
}
