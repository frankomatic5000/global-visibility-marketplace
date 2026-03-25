'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sampleListings, sampleUsers, getCountryAndCity } from '@/data/sample-data';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const listingId = params.listingId as string;
  const listing = sampleListings.find(l => l.id === listingId);
  const host = listing ? sampleUsers.find(u => u.id === listing.host_id) : null;
  const location = listing ? getCountryAndCity(listing.region_id) : null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Booking details from URL
  const notes = searchParams.get('notes') || '';

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
          <Link href="/browse" className="text-blue-600 hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const platformFee = Math.round(listing.price_cents * 0.05); // 5% fee
  const totalAmount = listing.price_cents + platformFee;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h1>
          <p className="text-gray-600 mb-6">
            Your booking request has been sent to {host?.full_name}. 
            You'll receive a confirmation once they accept.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/browse')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse More Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Listing preview */}
              <div className="flex gap-4 pb-4 border-b border-gray-200 mb-4">
                {listing.cover_image_url ? (
                  <img
                    src={listing.cover_image_url}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                    🎙️
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-500">
                    {location ? `${location.city}, ${location.country}` : ''}
                  </p>
                  {host && (
                    <p className="text-sm text-gray-600 mt-1">Host: {host.full_name}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">Your message:</p>
                  <p className="text-sm text-gray-600">{notes}</p>
                </div>
              )}

              {/* Price breakdown */}
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Listing price</dt>
                  <dd className="text-gray-900">{formatPrice(listing.price_cents)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Platform fee (5%)</dt>
                  <dd className="text-gray-900">{formatPrice(platformFee)}</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <dt className="font-semibold text-gray-900">Total</dt>
                  <dd className="font-bold text-xl text-gray-900">{formatPrice(totalAmount)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment (Mock)</h2>
              
              {/* Mock credit card form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      defaultValue="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    defaultValue="Test User"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>Pay {formatPrice(totalAmount)}</>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  🔒 This is a mock payment form. No real charges will be made.
                </p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-4 text-center">
              <Link
                href={`/listings/${listing.id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
