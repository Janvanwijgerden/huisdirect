import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../../lib/supabase/server";
import { getListingWithImages } from "../../../../../../lib/actions/listings";

export default async function Stap1FotosPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let listing;
  try {
    listing = await getListingWithImages(params.id);
  } catch {
    notFound();
  }

  if (listing.user_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-[900px] px-4">

        <h1 className="text-3xl font-bold text-stone-900 mb-4">
          Zo regel je je woningpresentatie
        </h1>

        <p className="text-stone-600 mb-8">
          Voor de meeste woningen is een sterke basis al genoeg: goede foto’s,
          een nette plattegrond en een opgeruimd huis.
        </p>

        {/* BASIS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Voor de meeste woningen is dit voldoende
          </h2>

          <ul className="space-y-2 text-stone-700">
            <li>• Goede woningfoto’s (belangrijkste onderdeel)</li>
            <li>• Plattegrond</li>
            <li>• Opgeruimde woning</li>
            <li>• Sterke hoofdfoto</li>
          </ul>
        </section>

        {/* SIMPEL HOUDEN */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Begin simpel
          </h2>

          <p className="text-stone-700 mb-3">
            Laat je niet gek maken door alle opties. Een woning verkoopt meestal
            niet beter door veel extra’s, maar door een sterke basis.
          </p>

          <ul className="space-y-2 text-stone-700">
            <li>• Regel een goede fotograaf</li>
            <li>• Zorg dat je woning netjes is</li>
            <li>• Voeg minimaal 5 foto’s toe</li>
            <li>• Kies een sterke hoofdfoto</li>
          </ul>
        </section>

        {/* TYPE WONING */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Wat past bij jouw woning?
          </h2>

          <div className="space-y-4 text-stone-700">
            <p><strong>Appartement:</strong> foto’s + plattegrond is vaak genoeg</p>
            <p><strong>Tussenwoning:</strong> eventueel korte video toevoegen</p>
            <p><strong>Vrijstaand:</strong> drone en video kunnen extra waarde geven</p>
          </div>
        </section>

        {/* OPTIES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Wat betekenen de opties?
          </h2>

          <ul className="space-y-2 text-stone-700">
            <li>• Foto’s → altijd doen</li>
            <li>• Plattegrond → sterk aanbevolen</li>
            <li>• Video → sfeer, maar niet verplicht</li>
            <li>• Drone → alleen bij geschikte woning</li>
            <li>• 360 → leuk, maar niet nodig</li>
          </ul>
        </section>

        {/* ADVIES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Praktisch advies
          </h2>

          <ul className="space-y-2 text-stone-700">
            <li>• Kies een fotograaf uit de regio</li>
            <li>• Vergelijk 2 of 3 aanbieders</li>
            <li>• Vraag wat inbegrepen is</li>
            <li>• Investeer vooral in goede foto’s</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-12 flex gap-4">
          <a
            href={`/listings/${params.id}/edit`}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700"
          >
            Ga terug naar advertentie
          </a>

          <a
            href={`/listings/${params.id}/edit`}
            className="rounded-xl border border-stone-300 px-6 py-3 text-stone-700 hover:bg-stone-50"
          >
            Foto’s toevoegen
          </a>
        </div>

      </div>
    </main>
  );
}