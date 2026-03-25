'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { sampleUsers, sampleMediaProfiles, sampleListings } from '@/data/sample-data';
import { formatDate } from '@/lib/utils';
import ListingCard from '@/components/ListingCard';

export default function HostProfilePage() {
  const params = useParams();
  const hostId = params.id as string;

  const host = sampleUsers.find(u => u.id === hostId);
  const mediaProfiles = sampleMediaProfiles.filter(m => m.user_id === hostId);
  const hostListings = sampleListings.filter(l => l.host_id === hostId);

  const [activeTab, setActiveTab] = useState<'listings' | 'about'>('listings');

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Host not found</h1>
          <Link href="/browse" className="text-blue-600 hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            {host.avatar_url ? (
              <img
                src={host.avatar_url}
                alt={host.full_name || ''}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full" />
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {host.full_name || 'Unknown Host'}
                </h1>
                {host.is_verified && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {host.role === 'host' ? 'Podcast Host' : host.role === 'buyer' ? 'Guest' : 'Host & Guest'}
              </p>
              {host.bio && (
                <p className="text-gray-700 mt-3 max-w-2xl">{host.bio}</p>
              )}
            </div>

            {/* Contact button */}
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Host
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-t pt-4">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'listings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Listings ({hostListings.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'listings' ? (
          <>
            {/* Media Profiles */}
            {mediaProfiles.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Profiles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediaProfiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                          🎙️
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{profile.platform_name}</h3>
                          {profile.handle && (
                            <p className="text-sm text-gray-500">{profile.handle}</p>
                          )}
                          {profile.audience_size && (
                            <p className="text-sm text-gray-600 mt-1">
                              {profile.audience_size.toLocaleString()} audience
                            </p>
                          )}
                          {profile.audience_demo && (
                            <p className="text-sm text-gray-500 mt-1">
                              {profile.audience_demo}
                            </p>
                          )}
                        </div>
                        {profile.verified && (
                          <span className="text-blue-500 text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Listings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Listings</h2>
              {hostListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">No active listings</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About {host.full_name}</h2>
            <div className="space-y-4">
              {host.bio ? (
                <p className="text-gray-700">{host.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio available</p>
              )}
              
              <div className="border-t pt-4 mt-4">
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Member since</dt>
                    <dd className="text-gray-900">{formatDate(host.created_at)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Role</dt>
                    <dd className="text-gray-900 capitalize">{host.role}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Verified</dt>
                    <dd className="text-gray-900">{host.is_verified ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
