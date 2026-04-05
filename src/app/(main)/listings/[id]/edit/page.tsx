import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import { getListingWithImages, attemptPublishListing } from "../../../../../lib/actions/listings";
import ListingForm from "../../../../../components/listings/ListingForm";
import ImageUploader from "../../../../../components/listings/ImageUploader";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  // 👉 simpele progress berekening (later uitbreiden)
  const progress = listingWithImages.title ? 40 : 10;
  const hasImages = listingWithImages.images?.length > 0;

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Concept
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {listingWithImages.title || "Je woning instellen"}
          </h1>

          <p className="mt-2 text-stone-500 max-w-xl">
            Vul stap voor stap je woning aan. Zodra alles klopt kun je hem live zetten voor kopers.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* 🔹 LINKERKANT (FORM) */}
          <div className="lg:col-span-2 space-y-6">

            <ListingForm
              listing={listingWithImages}
              publishAction={boundPublishAction}
            >
              <ImageUploader
                listingId={listingWithImages.id}
                initialImages={listingWithImages.images}
              />
            </ListingForm>

          </div>

          {/* 🔥 RECHTER SIDEBAR */}
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* VOORTGANG */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-stone-500 mb-2">
                Voortgang
              </p>

              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm font-medium text-stone-900">
                {progress}% compleet
              </p>
            </div>

            {/* CHECKLIST */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">

              <h3 className="text-sm font-semibold text-stone-900">
                Wat moet nog gebeuren
              </h3>

              <ul className="text-sm text-stone-600 space-y-2">
                <li>• Basisgegevens invullen</li>
                <li>• Kenmerken toevoegen</li>
                <li>• Beschrijving schrijven</li>
                <li className={!hasImages ? "text-red-500 font-medium" : ""}>
                  • Foto’s uploaden {hasImages ? "✓" : ""}
                </li>
              </ul>

            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">

              <h3 className="text-sm font-semibold text-emerald-900 mb-2">
                Klaar om live te gaan?
              </h3>

              <p className="text-sm text-emerald-800 mb-4">
                Zodra je woning compleet is, kun je hem publiceren en zichtbaar maken voor kopers.
              </p>

              <form action={boundPublishAction}>
                <button className="w-full rounded-xl bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 transition">
                  Zet woning live
                </button>
              </form>

              <p className="text-xs text-emerald-700 mt-3">
                Je zit nergens aan vast. Aanpassen kan altijd.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}