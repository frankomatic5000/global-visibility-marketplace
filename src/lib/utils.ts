// Format price from cents to dollars
export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// Format date
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Get listing type label
export function getListingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    guest_spot: 'Guest Spot',
    sponsored: 'Sponsored',
    featured: 'Featured',
    interview: 'Interview',
    article: 'Article',
    other: 'Other',
  };
  return labels[type] || type;
}

// Get platform type icon (emoji for MVP)
export function getPlatformIcon(type: string): string {
  const icons: Record<string, string> = {
    podcast: '🎙️',
    event: '🎪',
    magazine: '📰',
    influencer: '⭐',
  };
  return icons[type] || '📢';
}
