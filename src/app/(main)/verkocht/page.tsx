import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Home } from "lucide-react";
import { getSoldListings } from "../../../lib/actions/listings";
import ListingGrid from "../../../components/listings/ListingGrid";

export default async function VerkochtPage() {
  const soldListings = await getSoldListings(100);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Verkocht via HuisDirect
            </p>

            <h1 className="font-sans text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
              Bekijk woningen die al verkocht zijn
            </h1>

            <p className="mt-5 text-lg leading-8 text-stone-600">
              Deze pagina laat zien dat verkopen zonder makelaar gewoon werkt.
              Rustig, duidelijk en zonder gedoe. Voor nieuwe verkopers is dit
              het bewijs dat je ook zélf succesvol kunt verkopen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Plaats je woning
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                Bekijk hoe het werkt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Echt bewijs
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Je ziet hier echte woningen die al verkocht zijn via het platform.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Vertrouwen en rust
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Geen drukke verkooppraat, maar een duidelijk overzicht dat laat
              zien dat het proces werkt.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Home className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Jij kunt dit ook
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Deze voorbeelden helpen nieuwe verkopers zien dat zélf verkopen
              haalbaar en overzichtelijk is.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
              Verkochte woningen
            </p>
            <h2 className="font-sans text-3xl font-bold text-stone-900 md:text-4xl">
              Recent verkocht
            </h2>
          </div>

          <Link
            href="/listings"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 md:inline-flex"
          >
            Bekijk aanbod
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ListingGrid
          listings={soldListings}
          emptyMessage="Er zijn nog geen verkochte woningen om te tonen."
        />

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold text-stone-900">
              Ook je eigen woning verkopen zonder makelaar?
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
              Deze verkochte woningen laten zien dat het platform werkt. Wil je
              zelf ontdekken hoeveel je kunt besparen en hoe eenvoudig het kan
              zijn? Dan is de volgende stap om je woning te plaatsen of eerst te
              bekijken hoe het proces werkt.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Plaats je woning
            </Link>

            <Link
              href="/hoe-het-werkt"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
            >
              Bekijk hoe het werkt
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}