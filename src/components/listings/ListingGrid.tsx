import ListingCard from './ListingCard';

type Props = {
  listings: any[];
  emptyMessage?: string;
};

export default function ListingGrid({ listings, emptyMessage }: Props) {
  if (!listings || listings.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-gray-500">
          {emptyMessage || "Er zijn momenteel geen woningen beschikbaar."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {listings.map((listing, index) => (
          <div key={listing.id} className="mx-auto w-full max-w-[420px]">
            <ListingCard listing={listing} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}