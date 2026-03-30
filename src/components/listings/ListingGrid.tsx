import ListingCard from './ListingCard';
import type { Listing } from '@/types/database';

interface ListingGridProps {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingGrid({
  listings,
  emptyMessage = 'No listings found.',
}: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing, i) => (
        <ListingCard key={listing.id} listing={listing} index={i} />
      ))}
    </div>
  );
}
