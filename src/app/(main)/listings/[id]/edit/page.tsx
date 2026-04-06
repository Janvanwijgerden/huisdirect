import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import {
  getListingWithImages,
  attemptPublishListing,
} from "../../../../../lib/actions/listings";
import ListingForm from "../../../../../components/listings/ListingForm";
import ImageManager from "../../../../../components/listings/ImageManager";

function getProgress(listing: any, imageCount: number) {
  let score = 0;

  if (listing.title) score += 10;
  if (listing.street && listing.city) score += 10;
  if (listing.asking_price) score += 15;
  if (listing.property_type) score += 10;
  if (listing.living_area) score += 10;
  if (listing.year_built) score += 5;
  if (listing.description && listing.description.length >= 80) score += 20;
  if (imageCount >= 1) score += 10;
  if (imageCount >= 5) score += 10;

  return Math.min(score, 100);
}

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let listingWithImages;
  try {
    listingWithImages = await getListingWithImages(params.id);
  } catch (err) {
    notFound();
  }

  if (listingWithImages.user_id !== user.id) {
    redirect("/dashboard");
  }

  const boundPublishAction = attemptPublishListing.bind(null, listingWithImages.id);

  const hasImages = listingWithImages.images?.length > 0;
  const imageCount = listingWithImages.images?.length ?? 0;
  const progress = getProgress(listingWithImages, imageCount);

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            Concept
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {listingWithImages.title || "Je woning instellen"}
          </h1>

          <p className="mt-2 max-w-2xl text-stone-500">
            Werk je woning stap voor stap af. Eerst goed neerzetten, daarna pas live.
            Foto’s en presentatie maken hier het grootste verschil.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                  Foto’s van je woning
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">
                  Maak het uploaden van foto’s zo makkelijk mogelijk. Kies daarna met
                  één klik je hoofdfoto. De eerste foto bepaalt voor een groot deel de
                  eerste indruk van kopers.
                </p>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <ImageManager listingId={listingWithImages.id} />
              </div>
            </div>

            <ListingForm
              listing={listingWithImages}
              publishAction={boundPublishAction}
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-sm text-stone-500">Voortgang</p>

              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm font-medium text-stone-900">{progress}% compleet</p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Hoe completer je woning, hoe professioneler hij voelt voor kopers.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-900">
                Wat moet nog gebeuren
              </h3>

              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Basisgegevens invullen</li>
                <li>• Kenmerken toevoegen</li>
                <li>• Beschrijving schrijven</li>
                <li className={!hasImages ? "font-medium text-red-500" : "text-emerald-700"}>
                  • Foto’s uploaden {hasImages ? "✓" : ""}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-900">
                Waarom foto’s nu prio 1 zijn
              </h3>

              <p className="mt-2 text-sm leading-7 text-stone-600">
                Kopers beslissen in seconden of ze verder kijken. Sterke foto’s geven
                direct vertrouwen, sfeer en kwaliteit.
              </p>

              <div className="mt-4 rounded-xl bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-900">Slimme volgorde</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Begin met vooraanzicht, woonkamer, keuken, tuin en daarna de rest.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-emerald-900">
                Klaar om live te gaan?
              </h3>

              <p className="mb-4 text-sm text-emerald-800">
                Eerst woning live, daarna marketing. Zorg dus eerst dat je advertentie
                vertrouwen uitstraalt.
              </p>

              <form action={boundPublishAction}>
                <button className="w-full rounded-xl bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700">
                  Zet woning live
                </button>
              </form>

              <p className="mt-3 text-xs text-emerald-700">
                Je kunt later altijd nog verder verbeteren.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}