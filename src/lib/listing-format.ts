import type { Listing } from '../types/database';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(size: number): string {
  return `${size} m²`;
}

export function formatAddressLine(
  listing: Pick<Listing, 'street' | 'city'>
): string {
  if (listing.street) {
    return `${listing.street}, ${listing.city}`;
  }
  return listing.city || "";
}