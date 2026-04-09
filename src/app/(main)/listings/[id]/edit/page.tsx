import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import {
  getListingWithImages,
  attemptPublishListing,
} from "../../../../../lib/actions/listings";
import ListingForm from "../../../../../components/listings/ListingForm";
import ImageManager from "../../../../../components/listings/ImageManager";

type StepKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

type StepStatus = Record<StepKey, boolean>;

function getProgress(listing: any, imageCount: number) {
  let score = 0;

  if (listing.title) score += 10;
  if (listing.street && listing.city) score += 10;
  if (listing.asking_price) score += 15;
  if (listing.property_type) score += 10;
  if (listing.living_area) score += 10;
  if (listing.year_built) score += 5;
  if (listing.energy_label) score += 10;
  if (listing.description && listing.description.length >= 80) score += 10;
  if (imageCount >= 1) score += 10;
  if (imageCount >= 5) score += 10;

  return Math.min(score, 100);
}

function getStepStatus(listing: any, imageCount: number): StepStatus {
  const hasBasicDetails =
    Boolean(listing.property_type) &&
    Boolean(listing.living_area) &&
    Boolean(listing.year_built);

  const hasEnergyLabel = Boolean(listing.energy_label);

  return {
    "1": imageCount >= 5,
    "2": Boolean(listing.asking_price),
    "3": hasBasicDetails && hasEnergyLabel,
    "4": listing.status === "active",
    "5": false,
    "6": false,
    "7": false,
    "8": false,
  };
}

const stepLabels: Record<StepKey, string> = {
  "1": "Zet uw huis op de foto",
  "2": "Waardebepaling",
  "3": "Woningkenmerken invullen",
  "4": "Zet uw woning online",
  "5": "Plan kijkdagen",
  "6": "Stel biedingsdeadline in",
  "7": "Accepteer bod",
  "8": "Overdracht bij notaris",
};

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let listingWithImages;
  try {
    listingWithImages = await getListingWithImages(params.id);
  } catch {
    notFound();
  }

  if (listingWithImages.user_id !== user.id) {
    redirect("/dashboard");
  }

  const boundPublishAction = attemptPublishListing.bind(null, listingWithImages.id);
  const imageCount = listingWithImages.images?.length ?? 0;
  const progress = getProgress(listingWithImages, imageCount);
  const stepStatus = getStepStatus(listingWithImages, imageCount);

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-[1500px] px-4 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              {listingWithImages.title || "Bouw je woningadvertentie"}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Volg de stappen en maak een professionele presentatie
            </p>
          </div>

          <a
            href={`/listings/${listingWithImages.id}/preview`}
            target="_blank"
            className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Bekijk preview
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-stone-900">
                Stappenplan
              </h3>

              <ul className="space-y-2 text-sm">
                {Object.entries(stepLabels).map(([key, label]) => {
                  const stepKey = key as StepKey;

                  return (
                    <li key={key}>
                      <a
                        href={`/listings/${listingWithImages.id}/edit/stappen/${key}`}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                          key === "1"
                            ? "bg-emerald-50 font-medium text-emerald-700"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <span className="flex h-4 w-4 items-center justify-center">
                            {stepStatus[stepKey] ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-2.5 w-2.5 text-emerald-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 111.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            ) : null}
                          </span>

                          <span>
                            {key}. {label}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900">
                Slimme begeleiding
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Werk van boven naar beneden. Hoe completer je advertentie, hoe sterker je woning overkomt op kopers.
              </p>

              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Voortgang</span>
                  <span className="font-medium text-stone-900">{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-900">
                  Focus voor nu
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Zorg eerst voor sterke foto’s, complete basisgegevens en een duidelijke omschrijving. Dat maakt het grootste verschil.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-stone-100 px-4 py-3">
                  <p className="text-sm font-medium text-stone-900">
                    Wat kopers direct vergelijken
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Foto’s, prijs, woonoppervlak, locatie en energielabel
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-100 px-4 py-3">
                  <p className="text-sm font-medium text-stone-900">
                    Belangrijk voor vertrouwen
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Complete kenmerken, nette teksten en een professionele eerste indruk
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-100 px-4 py-3">
                  <p className="text-sm font-medium text-stone-900">
                    Later kun je altijd bijwerken
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Eerst rustig goed neerzetten, daarna verder verfijnen
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-stone-900">
                  Foto’s van je woning
                </h2>
                <p className="text-sm text-stone-500">
                  Dit bepaalt 80% van de eerste indruk
                </p>
              </div>

              <div className="p-6">
                <ImageManager listingId={listingWithImages.id} />
              </div>
            </div>

            <ListingForm
              listing={listingWithImages}
              publishAction={boundPublishAction}
            >
              <></>
            </ListingForm>
          </div>
        </div>
      </div>
    </main>
  );
}