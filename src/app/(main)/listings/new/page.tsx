import { createDraftListing } from "../../../../lib/actions/listings";
import { CopyPlus, ArrowRight } from "lucide-react";

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <CopyPlus className="h-6 w-6 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-semibold text-neutral-900">
          Nieuwe Woning Aanmelden
        </h1>
        <p className="mt-2 text-sm text-neutral-500 mb-8">
          Geef de woning een werktitel om te beginnen. Maak je geen zorgen, je concept wordt pas openbaar als we álles hebben afgevinkt.
        </p>

        <form action={createDraftListing} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-800">
              Werktitel
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Bv. Appartement Zuid, of de Straatnaam"
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Concept starten
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </form>

      </div>
    </main>
  );
}