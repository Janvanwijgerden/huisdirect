import { getListings } from "../../../lib/actions/listings";
import ListingGrid from "../../../components/listings/ListingGrid";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-stone-900">
          Woningen te koop
        </h1>

        <p className="mt-2 text-stone-500">
          Ontdek het actuele aanbod van woningen
        </p>

        <div className="mt-10">
          <ListingGrid 
            listings={listings} 
            emptyMessage="Er staan momenteel geen woningen te koop." 
          />
        </div>
      </div>
    </div>
  );
}