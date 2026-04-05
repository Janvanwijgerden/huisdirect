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

  // Bind the publish server action so the client doesn't need to know the ID
  const boundPublishAction = attemptPublishListing.bind(null, listingWithImages.id);

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Concept Modus
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {listingWithImages.title || "Naamloze Woning"}
          </h1>
          <p className="mt-2 text-stone-500">
            Je kunt deze woning op elk moment stapsgewijs aanvullen. Hij wordt pas zichtbaar voor kopers zodra je hem daadwerkelijk publiceert.
          </p>
        </div>

        <ListingForm
          listing={listingWithImages}
          publishAction={boundPublishAction}
        >
          {/* We injecteer de ImageUploader component direct binnenin de formulier container */}
          <ImageUploader
            listingId={listingWithImages.id}
            initialImages={listingWithImages.images}
          />
        </ListingForm>

      </div>
    </main>
  );
}