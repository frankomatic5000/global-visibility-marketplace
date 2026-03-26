'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HostPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    podcastName: '',
    podcastUrl: '',
    audienceSize: '',
    audienceDemo: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('This is a mock host registration. In production, this would create a Supabase user and profile.');
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Section Header with Quadrant Grid Pattern */}
      <section className="pattern-section-header-quadrant border-b border-athos-azure/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-header-content text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎙️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-athos-navy font-[family-name:var(--font-playfair)]">
            Become a Host
          </h1>
          <p className="text-athos-navy/80 mt-3 max-w-2xl mx-auto">
            Monetize your podcast by hosting guests from around the world
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-athos-azure' : 'text-athos-gray'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-athos-azure text-white' : 'bg-athos-silver'}`}>
              1
            </span>
            <span className="text-sm font-medium">Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-athos-silver" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-athos-azure' : 'text-athos-gray'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-athos-azure text-white' : 'bg-athos-silver'}`}>
              2
            </span>
            <span className="text-sm font-medium">Podcast</span>
          </div>
          <div className="w-12 h-0.5 bg-athos-silver" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-athos-azure' : 'text-athos-gray'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-athos-azure text-white' : 'bg-athos-silver'}`}>
              3
            </span>
            <span className="text-sm font-medium">Done</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Sarah Chen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Podcast</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Podcast Name *
                </label>
                <input
                  type="text"
                  name="podcastName"
                  value={formData.podcastName}
                  onChange={handleChange}
                  placeholder="The Marketing Podcast"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Podcast URL
                </label>
                <input
                  type="url"
                  name="podcastUrl"
                  value={formData.podcastUrl}
                  onChange={handleChange}
                  placeholder="https://yourpodcast.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audience Size
                </label>
                <select
                  name="audienceSize"
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="<1k">Under 1,000</option>
                  <option value="1k-10k">1,000 - 10,000</option>
                  <option value="10k-50k">10,000 - 50,000</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k+">Over 100,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audience Demographics
                </label>
                <input
                  type="text"
                  name="audienceDemo"
                  value={formData.audienceDemo}
                  onChange={handleChange}
                  placeholder="B2B marketers, founders, 30-55 age range"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell potential guests about your podcast, what topics you cover, and what makes it unique..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.podcastName || !formData.description}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎙️</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">Ready to Host!</h2>
              
              <p className="text-gray-600">
                Thanks for registering as a host, {formData.fullName || 'Future Host'}!
                <br />
                In production, your account would be created and you could start listing your podcast.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-medium text-gray-900 mb-2">What happens next:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Create your account and verify your email</li>
                  <li>✓ Set up your host profile</li>
                  <li>✓ Create your first listing</li>
                  <li>✓ Start accepting booking requests</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="#" className="text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
