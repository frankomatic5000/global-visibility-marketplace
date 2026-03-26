/**
 * Distance calculation utilities for geolocation features
 * Uses Haversine formula for accurate Earth-surface distances
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export type DistanceUnit = 'km' | 'miles';

const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_MILES = 3959;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 - First coordinates
 * @param point2 - Second coordinates
 * @param unit - Distance unit ('km' | 'miles')
 * @returns Distance in specified unit
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates,
  unit: DistanceUnit = 'km'
): number {
  const R = unit === 'miles' ? EARTH_RADIUS_MILES : EARTH_RADIUS_KM;
  
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const deltaLatRad = toRadians(point2.lat - point1.lat);
  const deltaLngRad = toRadians(point2.lng - point1.lng);

  const a = 
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Format distance for display
 * - Shows "km" for kilometers
 * - Shows "mi" for miles
 * - Shows "< 1 km/mi" for very close distances
 * - Rounds to 1 decimal for distances under 10, whole number otherwise
 * @param distance - Distance value
 * @param unit - Distance unit
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, unit: DistanceUnit = 'km'): string {
  if (distance < 1) {
    return `< 1 ${unit === 'miles' ? 'mi' : 'km'}`;
  }
  
  if (distance < 10) {
    return `${distance.toFixed(1)} ${unit === 'miles' ? 'mi' : 'km'}`;
  }
  
  return `${Math.round(distance)} ${unit === 'miles' ? 'mi' : 'km'}`;
}

/**
 * Check if a point is within a radius of another point
 * @param center - Center coordinates
 * @param point - Point to check
 * @param radiusKm - Radius in kilometers
 * @returns Boolean indicating if point is within radius
 */
export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean {
  const distance = calculateDistance(center, point, 'km');
  return distance <= radiusKm;
}

/**
 * Sort items by distance from a reference point
 * @param items - Array of items with coordinates
 * @param referencePoint - Reference coordinates to sort by
 * @param unit - Distance unit
 * @returns Sorted array with distance property added
 */
export interface WithCoordinates {
  lat?: number;
  lng?: number;
}

export interface WithDistance<T> {
  item: T;
  distance: number;
}

export function sortByDistance<T extends WithCoordinates>(
  items: T[],
  referencePoint: Coordinates,
  unit: DistanceUnit = 'km'
): WithDistance<T>[] {
  const withDistance = items
    .filter((item): item is T & Required<WithCoordinates> => 
      typeof item.lat === 'number' && typeof item.lng === 'number'
    )
    .map((item) => ({
      item,
      distance: calculateDistance(referencePoint, { lat: item.lat, lng: item.lng }, unit),
    }));

  return withDistance.sort((a, b) => a.distance - b.distance);
}

/**
 * Filter items within a specific radius
 * @param items - Array of items with coordinates
 * @param center - Center coordinates
 * @param radiusKm - Radius in kilometers
 * @returns Filtered array with distance property added
 */
export function filterByRadius<T extends WithCoordinates>(
  items: T[],
  center: Coordinates,
  radiusKm: number
): WithDistance<T>[] {
  const sorted = sortByDistance(items, center, 'km');
  return sorted.filter(({ distance }) => distance <= radiusKm);
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles: number): number {
  return miles * 1.60934;
}

/**
 * Predefined radius options for the Near Me filter
 */
export const RADIUS_OPTIONS = [
  { value: 25, label: '25 km', labelMiles: '15 mi' },
  { value: 50, label: '50 km', labelMiles: '30 mi' },
  { value: 100, label: '100 km', labelMiles: '60 mi' },
  { value: 0, label: 'Any distance', labelMiles: 'Any distance' },
] as const;

export type RadiusOption = typeof RADIUS_OPTIONS[number]['value'];
