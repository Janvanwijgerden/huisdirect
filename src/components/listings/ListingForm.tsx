"use client";

import { useRef, useTransition, useState } from "react";
import { updateDraftListing } from "../../lib/actions/listings";
import { Save, CheckCircle2, AlertCircle, Globe } from "lucide-react";

type Props = {
  listing: any;
  publishAction: () => Promise<{ error?: string } | void>;
  children: React.ReactNode; // For the ImageUploader
};

export default function ListingForm({ listing, publishAction, children }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishError, setPublishError] = useState<string | null>(null);

  // Auto-save logic can be attached to onBlur, but for now we provide a solid manual "Opslaan als concept" knop.
  const handleSaveDraft = async (formData: FormData) => {
    startTransition(async () => {
      setSaveStatus("saving");
      setPublishError(null);
      const res = await updateDraftListing(listing.id, null, formData);
      if (res && res.error) {
        setSaveStatus("error");
        setPublishError(res.error);
      } else {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  };

  const handleSaveAndPublish = async () => {
    const formElement = formRef.current;
    if (!formElement) return;

    startTransition(async () => {
      setPublishError(null);
      setSaveStatus("saving");

      const formData = new FormData(formElement);

      // 1. First solidly save the form data to DB
      const res = await updateDraftListing(listing.id, null, formData);
      if (res && res.error) {
        setSaveStatus("error");
        setPublishError(`Opslaan vóór publicatie mislukt: ${res.error}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setSaveStatus("saved");

      // 2. If save was successful, attempt to publish
      try {
        await publishAction();
      } catch (err: any) {
        setPublishError(err.message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      
      <div className="flex-1 space-y-8">
        {publishError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Kan Woning Niet Publiceren</h3>
              <p className="mt-1 text-sm">{publishError}</p>
            </div>
          </div>
        )}

        <form 
          ref={formRef}
          action={handleSaveDraft}
          id="draft-form" 
          className="space-y-8"
        >
          {/* SECTION: BASIS */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-stone-900">Basisgegevens</h2>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-stone-800">Werktitel</label>
                <input
                  id="title" name="title" type="text"
                  defaultValue={listing.title || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="property_type" className="mb-2 block text-sm font-semibold text-stone-800">Woningtype</label>
                <select
                  id="property_type" name="property_type"
                  defaultValue={listing.property_type || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-transparent"
                >
                  <option value="">(Nog niet gekozen)</option>
                  <option value="eengezinswoning">Eengezinswoning</option>
                  <option value="appartement">Appartement</option>
                  <option value="vrijstaande_woning">Vrijstaande woning</option>
                  <option value="twee_onder_een_kap">Twee-onder-een-kap</option>
                  <option value="hoekwoning">Hoekwoning</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>

              <div>
                <label htmlFor="asking_price" className="mb-2 block text-sm font-semibold text-stone-800">Vraagprijs (€)</label>
                <input
                  id="asking_price" name="asking_price" type="number" min="0" step="1000"
                  defaultValue={listing.asking_price || ""}
                  placeholder="Bv. 450000"
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* SECTION: ADRES */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-stone-900">Locatie</h2>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="street" className="mb-2 block text-sm font-semibold text-stone-800">Straat + Huisnummer</label>
                <input
                  id="street" name="street" type="text"
                  defaultValue={listing.street || ""}
                  placeholder="Bv. De Hoven 12"
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-semibold text-stone-800">Woonplaats / Stad</label>
                <input
                  id="city" name="city" type="text"
                  defaultValue={listing.city || ""}
                  placeholder="Bv. Utrecht"
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* SECTION: KENMERKEN */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-stone-900">Kenmerken</h2>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="living_area" className="mb-2 block text-sm font-semibold text-stone-800">Woonoppervlakte (m²)</label>
                <input
                  id="living_area" name="living_area" type="number"
                  defaultValue={listing.living_area || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="plot_size" className="mb-2 block text-sm font-semibold text-stone-800">Perceel (m²)</label>
                <input
                  id="plot_size" name="plot_size" type="number"
                  defaultValue={listing.plot_size || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="mb-2 block text-sm font-semibold text-stone-800">Slaapkamers</label>
                <input
                  id="bedrooms" name="bedrooms" type="number"
                  defaultValue={listing.bedrooms || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="energy_label" className="mb-2 block text-sm font-semibold text-stone-800">Energielabel</label>
                <select
                  id="energy_label" name="energy_label"
                  defaultValue={listing.energy_label || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-transparent"
                >
                  <option value="">-</option>
                  <option value="A++++">A++++</option>
                  <option value="A+++">A+++</option>
                  <option value="A++">A++</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>

              <div>
                <label htmlFor="year_built" className="mb-2 block text-sm font-semibold text-stone-800">Bouwjaar</label>
                <input
                  id="year_built" name="year_built" type="number"
                  defaultValue={listing.year_built || ""}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* SECTION: BESCHRIJVING */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-stone-900">Beschrijving Woning</h2>
            <div>
              <textarea
                id="description" name="description"
                rows={8}
                defaultValue={listing.description || ""}
                placeholder="Hoe zou je de woning promoten aan potentiele kopers? Wat maakt de buurt speciaal?"
                className="w-full rounded-2xl border border-stone-200 p-5 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-y"
              />
            </div>
          </section>
        </form>

        {/* SECTION: FOTO'S (Uses separate forms internally so we don't nest it in the big form) */}
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900">Beeldmateriaal</h2>
            <p className="mt-1 text-sm text-stone-500">
              Voeg kwalitatieve foto&apos;s toe. Sleep om de volgorde te bepalen, en kies één hoofdfoto voor de catalogus.
            </p>
          </div>
          
          {children}
        </section>

      </div>

      {/* STICKY SIDEBAR VOOR CONTROLE */}
      <aside className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-8 mt-4 lg:mt-0">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-lg">Acties</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] uppercase tracking-wider font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
              Concept
            </span>
          </div>
          
          <p className="text-sm text-stone-500 leading-relaxed mb-1 mt-1">
            Je kunt op elk moment je voortgang opslaan als Concept. Als alles helemaal klopt, zet je de woning online.
          </p>

          <button
            type="button"
            disabled={isPending || saveStatus === "saving"}
            onClick={() => {
              if (formRef.current) formRef.current.requestSubmit();
            }}
            className={`flex items-center justify-center gap-2 w-full rounded-2xl border px-5 py-3.5 text-sm font-semibold transition disabled:opacity-50 ${
              saveStatus === "saved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
            }`}
          >
            {saveStatus === "saving" ? (
              <span className="w-5 h-5 rounded-full border-2 border-stone-400 border-t-transparent animate-spin" />
            ) : saveStatus === "saved" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Save className="h-5 w-5 text-stone-400" />
            )}
            {saveStatus === "saved" ? "Concept opgeslagen!" : "Nu opslaan"}
          </button>

          <div className="my-2 h-px bg-stone-100" />

          <button
            type="button"
            disabled={isPending || saveStatus === "saving"}
            onClick={handleSaveAndPublish}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-200 disabled:opacity-60"
          >
            {isPending ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <Globe className="h-5 w-5" />
            )}
            {isPending ? "Bezig met publiceren..." : "Publiceer Woning"}
          </button>
        </div>
      </aside>

    </div>
  );
}
