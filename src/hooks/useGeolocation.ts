/**
 * React hook for browser geolocation API
 * Handles permission, error states, and persistent storage
 */

import { useState, useEffect, useCallback } from 'react';
import type { Coordinates } from '@/lib/distance';

export type GeolocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unknown';

export interface GeolocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN_ERROR';
  message: string;
}

export interface UseGeolocationReturn {
  // Location data
  coordinates: Coordinates | null;
  accuracy: number | null;
  timestamp: number | null;
  
  // Status
  permission: GeolocationPermissionState;
  isLoading: boolean;
  error: GeolocationError | null;
  isSupported: boolean;
  
  // Actions
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  
  // Persistence
  hasSavedLocation: boolean;
}

const STORAGE_KEY = 'gvm-user-location';
const STORAGE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface StoredLocation {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
}

/**
 * Get stored location from localStorage
 */
function getStoredLocation(): StoredLocation | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as StoredLocation;
    const now = Date.now();
    
    // Check if expired
    if (now - parsed.timestamp > STORAGE_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Store location in localStorage
 */
function storeLocation(location: StoredLocation): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Storage might be full or unavailable
  }
}

/**
 * Clear stored location
 */
function clearStoredLocation(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Check geolocation permission status
 */
async function checkPermission(): Promise<GeolocationPermissionState> {
  if (typeof window === 'undefined') return 'unknown';
  if (!('navigator' in window) || !('permissions' in navigator)) return 'unknown';
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state as GeolocationPermissionState;
  } catch {
    return 'unknown';
  }
}

/**
 * Convert PositionError to GeolocationError
 */
function mapPositionError(error: GeolocationPositionError): GeolocationError {
  const messages: Record<number, string> = {
    1: 'Location access was denied. Please enable location permissions in your browser settings.',
    2: 'Location information is unavailable. Please try again.',
    3: 'Location request timed out. Please try again.',
  };
  
  const codes: Record<number, GeolocationError['code']> = {
    1: 'PERMISSION_DENIED',
    2: 'POSITION_UNAVAILABLE',
    3: 'TIMEOUT',
  };
  
  return {
    code: codes[error.code] || 'UNKNOWN_ERROR',
    message: messages[error.code] || 'An unknown error occurred while getting your location.',
  };
}

/**
 * React hook for browser geolocation
 */
export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [permission, setPermission] = useState<GeolocationPermissionState>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [hasSavedLocation, setHasSavedLocation] = useState(false);
  
  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;
  
  // Load stored location on mount
  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setCoordinates(stored.coordinates);
      setAccuracy(stored.accuracy);
      setTimestamp(stored.timestamp);
      setHasSavedLocation(true);
    }
    
    // Check initial permission status
    checkPermission().then(setPermission);
  }, []);
  
  // Update saved location flag when coordinates change
  useEffect(() => {
    setHasSavedLocation(coordinates !== null);
  }, [coordinates]);
  
  /**
   * Request current location
   */
  const requestLocation = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError({
        code: 'UNKNOWN_ERROR',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        });
      });
      
      const newCoordinates: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setCoordinates(newCoordinates);
      setAccuracy(position.coords.accuracy);
      setTimestamp(position.timestamp);
      setPermission('granted');
      
      // Store for persistence
      storeLocation({
        coordinates: newCoordinates,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        setError(mapPositionError(err));
        if (err.code === 1) {
          setPermission('denied');
        }
      } else {
        setError({
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);
  
  /**
   * Clear stored and current location
   */
  const clearLocation = useCallback((): void => {
    setCoordinates(null);
    setAccuracy(null);
    setTimestamp(null);
    setError(null);
    clearStoredLocation();
  }, []);
  
  return {
    coordinates,
    accuracy,
    timestamp,
    permission,
    isLoading,
    error,
    isSupported,
    requestLocation,
    clearLocation,
    hasSavedLocation,
  };
}

export default useGeolocation;
