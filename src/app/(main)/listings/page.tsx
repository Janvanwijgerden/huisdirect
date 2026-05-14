import { getListings } from "../../../lib/actions/listings";
import ListingsFilterClient from "../../../components/listings/ListingsFilterClient";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Actueel woningaanbod
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Woningen te koop zonder makelaar
            </h1>

            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              Zoek gericht op plaats, prijs, woningtype en uitgebreide kenmerken zoals tuin, balkon, garage, zonnepanelen en ligging.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-8">
        <ListingsFilterClient listings={listings} />
      </section>
    </main>
  );
}
