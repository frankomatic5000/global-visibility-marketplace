/**
 * Country and city data with coordinates
 * Extended dataset with ~50 major global cities
 */

import type { Region } from '@/types';

// ============================================
// Countries (Level 1)
// ============================================

export const countries: Pick<Region, 'id' | 'name' | 'slug' | 'level' | 'parent_id' | 'path' | 'path_names' | 'is_active'>[] = [
  // Americas
  { id: 'us', name: 'United States', slug: 'us', level: 1, parent_id: null, path: '/us', path_names: ['United States'], is_active: true },
  { id: 'ca', name: 'Canada', slug: 'ca', level: 1, parent_id: null, path: '/ca', path_names: ['Canada'], is_active: true },
  { id: 'br', name: 'Brazil', slug: 'br', level: 1, parent_id: null, path: '/br', path_names: ['Brazil'], is_active: true },
  { id: 'mx', name: 'Mexico', slug: 'mx', level: 1, parent_id: null, path: '/mx', path_names: ['Mexico'], is_active: true },
  { id: 'ar', name: 'Argentina', slug: 'ar', level: 1, parent_id: null, path: '/ar', path_names: ['Argentina'], is_active: true },
  
  // Europe
  { id: 'uk', name: 'United Kingdom', slug: 'uk', level: 1, parent_id: null, path: '/uk', path_names: ['United Kingdom'], is_active: true },
  { id: 'de', name: 'Germany', slug: 'de', level: 1, parent_id: null, path: '/de', path_names: ['Germany'], is_active: true },
  { id: 'fr', name: 'France', slug: 'fr', level: 1, parent_id: null, path: '/fr', path_names: ['France'], is_active: true },
  { id: 'es', name: 'Spain', slug: 'es', level: 1, parent_id: null, path: '/es', path_names: ['Spain'], is_active: true },
  { id: 'it', name: 'Italy', slug: 'it', level: 1, parent_id: null, path: '/it', path_names: ['Italy'], is_active: true },
  { id: 'nl', name: 'Netherlands', slug: 'nl', level: 1, parent_id: null, path: '/nl', path_names: ['Netherlands'], is_active: true },
  { id: 'pt', name: 'Portugal', slug: 'pt', level: 1, parent_id: null, path: '/pt', path_names: ['Portugal'], is_active: true },
  { id: 'se', name: 'Sweden', slug: 'se', level: 1, parent_id: null, path: '/se', path_names: ['Sweden'], is_active: true },
  { id: 'ch', name: 'Switzerland', slug: 'ch', level: 1, parent_id: null, path: '/ch', path_names: ['Switzerland'], is_active: true },
  { id: 'ie', name: 'Ireland', slug: 'ie', level: 1, parent_id: null, path: '/ie', path_names: ['Ireland'], is_active: true },
  { id: 'pl', name: 'Poland', slug: 'pl', level: 1, parent_id: null, path: '/pl', path_names: ['Poland'], is_active: true },
  
  // Asia-Pacific
  { id: 'jp', name: 'Japan', slug: 'jp', level: 1, parent_id: null, path: '/jp', path_names: ['Japan'], is_active: true },
  { id: 'au', name: 'Australia', slug: 'au', level: 1, parent_id: null, path: '/au', path_names: ['Australia'], is_active: true },
  { id: 'sg', name: 'Singapore', slug: 'sg', level: 1, parent_id: null, path: '/sg', path_names: ['Singapore'], is_active: true },
  { id: 'in', name: 'India', slug: 'in', level: 1, parent_id: null, path: '/in', path_names: ['India'], is_active: true },
  { id: 'kr', name: 'South Korea', slug: 'kr', level: 1, parent_id: null, path: '/kr', path_names: ['South Korea'], is_active: true },
  { id: 'cn', name: 'China', slug: 'cn', level: 1, parent_id: null, path: '/cn', path_names: ['China'], is_active: true },
  { id: 'ae', name: 'United Arab Emirates', slug: 'ae', level: 1, parent_id: null, path: '/ae', path_names: ['United Arab Emirates'], is_active: true },
  { id: 'hk', name: 'Hong Kong', slug: 'hk', level: 1, parent_id: null, path: '/hk', path_names: ['Hong Kong'], is_active: true },
  { id: 'tw', name: 'Taiwan', slug: 'tw', level: 1, parent_id: null, path: '/tw', path_names: ['Taiwan'], is_active: true },
  { id: 'th', name: 'Thailand', slug: 'th', level: 1, parent_id: null, path: '/th', path_names: ['Thailand'], is_active: true },
  { id: 'vn', name: 'Vietnam', slug: 'vn', level: 1, parent_id: null, path: '/vn', path_names: ['Vietnam'], is_active: true },
  { id: 'ph', name: 'Philippines', slug: 'ph', level: 1, parent_id: null, path: '/ph', path_names: ['Philippines'], is_active: true },
  { id: 'my', name: 'Malaysia', slug: 'my', level: 1, parent_id: null, path: '/my', path_names: ['Malaysia'], is_active: true },
  { id: 'id', name: 'Indonesia', slug: 'id', level: 1, parent_id: null, path: '/id', path_names: ['Indonesia'], is_active: true },
  { id: 'nz', name: 'New Zealand', slug: 'nz', level: 1, parent_id: null, path: '/nz', path_names: ['New Zealand'], is_active: true },
  
  // Middle East & Africa
  { id: 'za', name: 'South Africa', slug: 'za', level: 1, parent_id: null, path: '/za', path_names: ['South Africa'], is_active: true },
  { id: 'ng', name: 'Nigeria', slug: 'ng', level: 1, parent_id: null, path: '/ng', path_names: ['Nigeria'], is_active: true },
  { id: 'ke', name: 'Kenya', slug: 'ke', level: 1, parent_id: null, path: '/ke', path_names: ['Kenya'], is_active: true },
  { id: 'eg', name: 'Egypt', slug: 'eg', level: 1, parent_id: null, path: '/eg', path_names: ['Egypt'], is_active: true },
  { id: 'tr', name: 'Turkey', slug: 'tr', level: 1, parent_id: null, path: '/tr', path_names: ['Turkey'], is_active: true },
  { id: 'il', name: 'Israel', slug: 'il', level: 1, parent_id: null, path: '/il', path_names: ['Israel'], is_active: true },
];

// ============================================
// Major Cities (Level 2) with coordinates
// ============================================

export interface CityData {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const cities: CityData[] = [
  // United States (10 cities)
  { id: 'us-nyc', name: 'New York City', slug: 'new-york', parent_id: 'us', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { id: 'us-la', name: 'Los Angeles', slug: 'los-angeles', parent_id: 'us', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { id: 'us-chi', name: 'Chicago', slug: 'chicago', parent_id: 'us', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { id: 'us-hou', name: 'Houston', slug: 'houston', parent_id: 'us', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago' },
  { id: 'us-phx', name: 'Phoenix', slug: 'phoenix', parent_id: 'us', lat: 33.4484, lng: -112.0740, timezone: 'America/Phoenix' },
  { id: 'us-sf', name: 'San Francisco', slug: 'san-francisco', parent_id: 'us', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { id: 'us-sea', name: 'Seattle', slug: 'seattle', parent_id: 'us', lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles' },
  { id: 'us-mia', name: 'Miami', slug: 'miami', parent_id: 'us', lat: 25.7617, lng: -80.1918, timezone: 'America/New_York' },
  { id: 'us-den', name: 'Denver', slug: 'denver', parent_id: 'us', lat: 39.7392, lng: -104.9903, timezone: 'America/Denver' },
  { id: 'us-bos', name: 'Boston', slug: 'boston', parent_id: 'us', lat: 42.3601, lng: -71.0589, timezone: 'America/New_York' },
  
  // Canada (3 cities)
  { id: 'ca-to', name: 'Toronto', slug: 'toronto', parent_id: 'ca', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto' },
  { id: 'ca-van', name: 'Vancouver', slug: 'vancouver', parent_id: 'ca', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver' },
  { id: 'ca-mtl', name: 'Montreal', slug: 'montreal', parent_id: 'ca', lat: 45.5017, lng: -73.5673, timezone: 'America/Toronto' },
  
  // Brazil (3 cities)
  { id: 'br-sp', name: 'São Paulo', slug: 'sao-paulo', parent_id: 'br', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
  { id: 'br-rj', name: 'Rio de Janeiro', slug: 'rio-de-janeiro', parent_id: 'br', lat: -22.9068, lng: -43.1729, timezone: 'America/Sao_Paulo' },
  { id: 'br-bsa', name: 'Brasília', slug: 'brasilia', parent_id: 'br', lat: -15.7975, lng: -47.8919, timezone: 'America/Sao_Paulo' },
  
  // Mexico (1 city)
  { id: 'mx-mex', name: 'Mexico City', slug: 'mexico-city', parent_id: 'mx', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City' },
  
  // Argentina (1 city)
  { id: 'ar-bue', name: 'Buenos Aires', slug: 'buenos-aires', parent_id: 'ar', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  
  // United Kingdom (2 cities)
  { id: 'uk-ldn', name: 'London', slug: 'london', parent_id: 'uk', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { id: 'uk-man', name: 'Manchester', slug: 'manchester', parent_id: 'uk', lat: 53.4808, lng: -2.2426, timezone: 'Europe/London' },
  
  // Germany (2 cities)
  { id: 'de-ber', name: 'Berlin', slug: 'berlin', parent_id: 'de', lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' },
  { id: 'de-muc', name: 'Munich', slug: 'munich', parent_id: 'de', lat: 48.1351, lng: 11.5820, timezone: 'Europe/Berlin' },
  
  // France (2 cities)
  { id: 'fr-par', name: 'Paris', slug: 'paris', parent_id: 'fr', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { id: 'fr-lyo', name: 'Lyon', slug: 'lyon', parent_id: 'fr', lat: 45.7640, lng: 4.8357, timezone: 'Europe/Paris' },
  
  // Spain (2 cities)
  { id: 'es-mad', name: 'Madrid', slug: 'madrid', parent_id: 'es', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid' },
  { id: 'es-bar', name: 'Barcelona', slug: 'barcelona', parent_id: 'es', lat: 41.3851, lng: 2.1734, timezone: 'Europe/Madrid' },
  
  // Italy (1 city)
  { id: 'it-mil', name: 'Milan', slug: 'milan', parent_id: 'it', lat: 45.4642, lng: 9.1900, timezone: 'Europe/Rome' },
  
  // Netherlands (1 city)
  { id: 'nl-ams', name: 'Amsterdam', slug: 'amsterdam', parent_id: 'nl', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam' },
  
  // Portugal (1 city)
  { id: 'pt-lis', name: 'Lisbon', slug: 'lisbon', parent_id: 'pt', lat: 38.7223, lng: -9.1393, timezone: 'Europe/Lisbon' },
  
  // Sweden (1 city)
  { id: 'se-sto', name: 'Stockholm', slug: 'stockholm', parent_id: 'se', lat: 59.3293, lng: 18.0686, timezone: 'Europe/Stockholm' },
  
  // Switzerland (1 city)
  { id: 'ch-zur', name: 'Zurich', slug: 'zurich', parent_id: 'ch', lat: 47.3769, lng: 8.5417, timezone: 'Europe/Zurich' },
  
  // Ireland (1 city)
  { id: 'ie-dub', name: 'Dublin', slug: 'dublin', parent_id: 'ie', lat: 53.3498, lng: -6.2603, timezone: 'Europe/Dublin' },
  
  // Poland (1 city)
  { id: 'pl-war', name: 'Warsaw', slug: 'warsaw', parent_id: 'pl', lat: 52.2297, lng: 21.0122, timezone: 'Europe/Warsaw' },
  
  // Japan (1 city)
  { id: 'jp-tok', name: 'Tokyo', slug: 'tokyo', parent_id: 'jp', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  
  // Australia (2 cities)
  { id: 'au-syd', name: 'Sydney', slug: 'sydney', parent_id: 'au', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
  { id: 'au-mel', name: 'Melbourne', slug: 'melbourne', parent_id: 'au', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne' },
  
  // Singapore (city-state)
  { id: 'sg-sg', name: 'Singapore', slug: 'singapore', parent_id: 'sg', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  
  // India (2 cities)
  { id: 'in-bom', name: 'Mumbai', slug: 'mumbai', parent_id: 'in', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },
  { id: 'in-blr', name: 'Bangalore', slug: 'bangalore', parent_id: 'in', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata' },
  
  // South Korea (1 city)
  { id: 'kr-sel', name: 'Seoul', slug: 'seoul', parent_id: 'kr', lat: 37.5665, lng: 126.9780, timezone: 'Asia/Seoul' },
  
  // China (2 cities)
  { id: 'cn-bjs', name: 'Beijing', slug: 'beijing', parent_id: 'cn', lat: 39.9042, lng: 116.4074, timezone: 'Asia/Shanghai' },
  { id: 'cn-shg', name: 'Shanghai', slug: 'shanghai', parent_id: 'cn', lat: 31.2304, lng: 121.4737, timezone: 'Asia/Shanghai' },
  
  // UAE (1 city)
  { id: 'ae-dxb', name: 'Dubai', slug: 'dubai', parent_id: 'ae', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  
  // Hong Kong
  { id: 'hk-hk', name: 'Hong Kong', slug: 'hong-kong', parent_id: 'hk', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong' },
  
  // Taiwan (1 city)
  { id: 'tw-tpe', name: 'Taipei', slug: 'taipei', parent_id: 'tw', lat: 25.0330, lng: 121.5654, timezone: 'Asia/Taipei' },
  
  // Thailand (1 city)
  { id: 'th-bkk', name: 'Bangkok', slug: 'bangkok', parent_id: 'th', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok' },
  
  // Vietnam (1 city)
  { id: 'vn-sgn', name: 'Ho Chi Minh City', slug: 'ho-chi-minh-city', parent_id: 'vn', lat: 10.8231, lng: 106.6297, timezone: 'Asia/Ho_Chi_Minh' },
  
  // Philippines (1 city)
  { id: 'ph-mnl', name: 'Manila', slug: 'manila', parent_id: 'ph', lat: 14.5995, lng: 120.9842, timezone: 'Asia/Manila' },
  
  // Malaysia (1 city)
  { id: 'my-kl', name: 'Kuala Lumpur', slug: 'kuala-lumpur', parent_id: 'my', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  
  // Indonesia (1 city)
  { id: 'id-jkt', name: 'Jakarta', slug: 'jakarta', parent_id: 'id', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta' },
  
  // New Zealand (1 city)
  { id: 'nz-akl', name: 'Auckland', slug: 'auckland', parent_id: 'nz', lat: -36.8509, lng: 174.7645, timezone: 'Pacific/Auckland' },
  
  // South Africa (1 city)
  { id: 'za-cpt', name: 'Cape Town', slug: 'cape-town', parent_id: 'za', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg' },
  
  // Nigeria (1 city)
  { id: 'ng-lag', name: 'Lagos', slug: 'lagos', parent_id: 'ng', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos' },
  
  // Kenya (1 city)
  { id: 'ke-nbo', name: 'Nairobi', slug: 'nairobi', parent_id: 'ke', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi' },
  
  // Egypt (1 city)
  { id: 'eg-cai', name: 'Cairo', slug: 'cairo', parent_id: 'eg', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  
  // Turkey (1 city)
  { id: 'tr-ist', name: 'Istanbul', slug: 'istanbul', parent_id: 'tr', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul' },
  
  // Israel (1 city)
  { id: 'il-tlv', name: 'Tel Aviv', slug: 'tel-aviv', parent_id: 'il', lat: 32.0853, lng: 34.7818, timezone: 'Asia/Jerusalem' },
];

// ============================================
// Helper functions
// ============================================

/**
 * Get city data by ID
 */
export function getCityById(id: string): CityData | undefined {
  return cities.find(c => c.id === id);
}

/**
 * Get city data by slug
 */
export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug);
}

/**
 * Get all cities for a country
 */
export function getCitiesByCountry(countryId: string): CityData[] {
  return cities.filter(c => c.parent_id === countryId);
}

/**
 * Get country data by ID
 */
export function getCountryById(id: string): typeof countries[0] | undefined {
  return countries.find(c => c.id === id);
}

/**
 * Get country data by slug
 */
export function getCountryBySlug(slug: string): typeof countries[0] | undefined {
  return countries.find(c => c.slug === slug);
}

/**
 * Convert CityData to full Region type
 */
export function cityToRegion(city: CityData): Region {
  const country = getCountryById(city.parent_id);
  return {
    id: city.id,
    name: city.name,
    slug: city.slug,
    level: 2,
    parent_id: city.parent_id,
    path: `${country?.path || ''}/${city.slug}`,
    path_names: [...(country?.path_names || []), city.name],
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    is_active: true,
  };
}

/**
 * Convert country data to full Region type
 */
export function countryToRegion(country: typeof countries[0]): Region {
  return {
    ...country,
    lat: undefined,
    lng: undefined,
    timezone: undefined,
  };
}

/**
 * Get all regions (countries + cities)
 */
export function getAllRegions(): Region[] {
  const countryRegions = countries.map(countryToRegion);
  const cityRegions = cities.map(cityToRegion);
  return [...countryRegions, ...cityRegions];
}
