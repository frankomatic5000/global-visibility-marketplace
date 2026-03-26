'use client';

import { useState, useCallback } from 'react';
import { MapPin, Navigation, X, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { RADIUS_OPTIONS, type RadiusOption, formatDistance } from '@/lib/distance';
import type { Coordinates } from '@/lib/distance';

export interface NearMeFilterProps {
  selectedRadius: RadiusOption;
  onRadiusChange: (radius: RadiusOption) => void;
  userLocation: Coordinates | null;
  onLocationChange: (location: Coordinates | null) => void;
  className?: string;
}

/**
 * Near Me Filter Component
 * Sunset Velocity theme styling:
 * - Filter panel: Warm cream (#FFF8F5) bg
 * - Active radius: Coral (#FF6B35)
 * - Distance badge: Golden (#FFC233)
 */
export default function NearMeFilter({
  selectedRadius,
  onRadiusChange,
  userLocation,
  onLocationChange,
  className = '',
}: NearMeFilterProps) {
  const [showError, setShowError] = useState(false);
  
  const {
    coordinates,
    isLoading,
    error,
    isSupported,
    requestLocation,
    clearLocation,
    hasSavedLocation,
  } = useGeolocation();

  const handleRequestLocation = useCallback(async () => {
    setShowError(false);
    await requestLocation();
    setShowError(true);
  }, [requestLocation]);

  const handleClearLocation = useCallback(() => {
    clearLocation();
    onLocationChange(null);
  }, [clearLocation, onLocationChange]);

  const handleRadiusSelect = useCallback((radius: RadiusOption) => {
    onRadiusChange(radius);
    
    // If we have coordinates but no userLocation prop, update it
    if (coordinates && !userLocation) {
      onLocationChange(coordinates);
    }
  }, [onRadiusChange, coordinates, userLocation, onLocationChange]);

  // Sync with geolocation hook when coordinates change
  const effectiveLocation = userLocation || coordinates;

  const getRadiusLabel = (radius: number, index: number): string => {
    if (radius === 0) return 'Any distance';
    const option = RADIUS_OPTIONS[index];
    return option?.label || `${radius} km`;
  };

  // If geolocation is not supported, don't render
  if (!isSupported) {
    return null;
  }

  return (
    <div className={`bg-[#FFF8F5] rounded-xl border border-[#FF6B35]/10 p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FF6B35]" />
          <h3 className="font-semibold text-[#1A1A2E] font-[family-name:var(--font-dm-sans)]">
            Near Me
          </h3>
        </div>
        
        {effectiveLocation && (
          <button
            onClick={handleClearLocation}
            className="text-xs text-[#1A1A2E]/50 hover:text-[#FF6B35] transition-colors flex items-center gap-1"
            title="Clear location"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Location Status / Action Button */}
      {!effectiveLocation ? (
        <div className="space-y-3">
          <p className="text-sm text-[#1A1A2E]/60">
            Find listings near your current location
          </p>
          <button
            onClick={handleRequestLocation}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#FF6B35]/20 rounded-lg text-[#FF6B35] hover:bg-[#FF6B35]/5 hover:border-[#FF6B35]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Use my location
              </>
            )}
          </button>
          
          {/* Error message */}
          {showError && error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Location indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[#1A1A2E]/70">
              Location active
            </span>
            {hasSavedLocation && (
              <span className="text-xs text-[#1A1A2E]/40 ml-auto">
                (saved)
              </span>
            )}
          </div>

          {/* Radius selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A2E]/70">
              Distance radius
            </label>
            <div className="flex flex-wrap gap-2">
              {RADIUS_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleRadiusSelect(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRadius === option.value
                      ? 'bg-[#FF6B35] text-white shadow-sm'
                      : 'bg-white text-[#1A1A2E]/70 hover:bg-[#FF6B35]/5 border border-[#FF6B35]/10'
                  }`}
                >
                  {getRadiusLabel(option.value, index)}
                </button>
              ))}
            </div>
          </div>

          {/* Selected radius indicator */}
          {selectedRadius > 0 && (
            <div className="text-xs text-[#1A1A2E]/50">
              Showing listings within {formatDistance(selectedRadius, 'km')} of your location
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { RADIUS_OPTIONS, type RadiusOption };