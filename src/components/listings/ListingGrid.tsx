import ListingCard from './ListingCard';

type Props = {
  listings: any[];
};

export default function ListingGrid({ listings }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {listings.map((listing) => (
          <div key={listing.id} className="mx-auto w-full max-w-[420px]">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}