"use client";

import { useRef, useTransition, useState } from "react";
import { updateDraftListing } from "../../lib/actions/listings";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Home,
  MapPin,
  FileText,
  Camera,
  Sparkles,
} from "lucide-react";

type Props = {
  listing: any;
  publishAction: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
};

export default function ListingFormC({
  listing,
  publishAction,
  children,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishError, setPublishError] = useState<string | null>(null);

  const hasTitle = Boolean(listing.title?.trim());
  const hasType = Boolean(listing.property_type?.trim());
  const hasPrice = Boolean(listing.asking_price);
  const hasStreet = Boolean(listing.street?.trim());
  const hasCity = Boolean(listing.city?.trim());
  const hasDescription = Boolean(listing.description?.trim()?.length > 20);
  const hasImages = Boolean(listing.images?.length > 0);

  const requiredItems = [
    {
      label: "Basisgegevens",
      helper: "Titel, woningtype en vraagprijs ontbreken nog.",
      done: hasTitle && hasType && hasPrice,
      icon: Home,
    },
    {
      label: "Locatie",
      helper: "Straat en woonplaats ontbreken nog.",
      done: hasStreet && hasCity,
      icon: MapPin,
    },
    {
      label: "Beschrijving",
      helper: "Voeg een korte woningomschrijving toe.",
      done: hasDescription,
      icon: FileText,
    },
    {
      label: "Foto’s",
      helper: "Voeg minimaal één woningfoto toe.",
      done: hasImages,
      icon: Camera,
    },
  ];

  const doneCount = requiredItems.filter((item) => item.done).length;
  const progress = Math.round((doneCount / requiredItems.length) * 100);
  const firstIncomplete = requiredItems.find((item) => !item.done);

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
      const res = await updateDraftListing(listing.id, null, formData);

      if (res && res.error) {
        setSaveStatus("error");
        setPublishError(`Opslaan vóór publicatie mislukt: ${res.error}`);
        return;
      }

      setSaveStatus("saved");

      try {
        await publishAction();
      } catch (err: any) {
        setPublishError(err.message);
      }
    });
  };

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        {publishError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Publiceren lukt nog niet</h3>
                <p className="mt-1">{publishError}</p>
              </div>
            </div>
          </div>
        )}

        <form ref={formRef} action={handleSaveDraft} id="draft-form" className="space-y-6">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Basisgegevens
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Dit is het minimale startpunt van je advertentie.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasTitle && hasType && hasPrice
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {hasTitle && hasType && hasPrice ? "Compleet" : "Nog nodig"}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-stone-800">
                  Werktitel
                </label>
                <input id="title" name="title" type="text" defaultValue={listing.title || ""} placeholder="Bijv. Moderne gezinswoning met ruime tuin" className={inputClass} />
              </div>

              <div>
                <label htmlFor="property_type" className="mb-2 block text-sm font-medium text-stone-800">
                  Woningtype
                </label>
                <select id="property_type" name="property_type" defaultValue={listing.property_type || ""} className={inputClass}>
                  <option value="">Nog niet gekozen</option>
                  <option value="eengezinswoning">Eengezinswoning</option>
                  <option value="appartement">Appartement</option>
                  <option value="vrijstaande_woning">Vrijstaande woning</option>
                  <option value="twee_onder_een_kap">Twee-onder-een-kap</option>
                  <option value="hoekwoning">Hoekwoning</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>

              <div>
                <label htmlFor="asking_price" className="mb-2 block text-sm font-medium text-stone-800">
                  Vraagprijs (€)
                </label>
                <input id="asking_price" name="asking_price" type="number" min="0" step="1000" defaultValue={listing.asking_price || ""} placeholder="Bijv. 450000" className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Locatie
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Nodig voor je woninglink en de herkenbaarheid van je advertentie.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasStreet && hasCity ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {hasStreet && hasCity ? "Compleet" : "Nog nodig"}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="street" className="mb-2 block text-sm font-medium text-stone-800">
                  Straat + huisnummer
                </label>
                <input id="street" name="street" type="text" defaultValue={listing.street || ""} placeholder="Bijv. De Hoven 12" className={inputClass} />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-stone-800">
                  Woonplaats / stad
                </label>
                <input id="city" name="city" type="text" defaultValue={listing.city || ""} placeholder="Bijv. Utrecht" className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
              Beschrijving
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Schrijf kort wat je woning prettig maakt: sfeer, licht, tuin, buurt en indeling.
            </p>

            <div className="mt-6">
              <textarea
                id="description"
                name="description"
                rows={8}
                defaultValue={listing.description || ""}
                placeholder="Bijv. Instapklare woning met veel daglicht, rustige straat en fijne tuin op het zuiden."
                className="w-full resize-y rounded-xl border border-stone-200 p-5 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
              Extra kenmerken
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Niet verplicht voor livegang, wel goed voor vertrouwen en vergelijking.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="living_area" className="mb-2 block text-sm font-medium text-stone-800">
                  Woonoppervlakte
                </label>
                <input id="living_area" name="living_area" type="number" defaultValue={listing.living_area || ""} className={inputClass} />
              </div>
              <div>
                <label htmlFor="plot_size" className="mb-2 block text-sm font-medium text-stone-800">
                  Perceel
                </label>
                <input id="plot_size" name="plot_size" type="number" defaultValue={listing.plot_size || ""} className={inputClass} />
              </div>
              <div>
                <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium text-stone-800">
                  Slaapkamers
                </label>
                <input id="bedrooms" name="bedrooms" type="number" defaultValue={listing.bedrooms || ""} className={inputClass} />
              </div>
              <div>
                <label htmlFor="energy_label" className="mb-2 block text-sm font-medium text-stone-800">
                  Energielabel
                </label>
                <select id="energy_label" name="energy_label" defaultValue={listing.energy_label || ""} className={inputClass}>
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
                <label htmlFor="year_built" className="mb-2 block text-sm font-medium text-stone-800">
                  Bouwjaar
                </label>
                <input id="year_built" name="year_built" type="number" defaultValue={listing.year_built || ""} className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
              Foto’s
            </h2>
            <p className="mt-2 mb-6 text-sm text-stone-500">
              Een goede eerste foto maakt je advertentie direct sterker.
            </p>
            {children}
          </section>
        </form>
      </div>

      <aside className="xl:sticky xl:top-8 h-fit">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-semibold tracking-tight text-stone-900">
              Slimme begeleiding
            </h3>
          </div>

          <div className="mt-5 rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Voortgang</span>
              <span className="font-medium text-stone-900">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">
              Eerstvolgende beste stap
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              {firstIncomplete
                ? firstIncomplete.helper
                : "Alles staat klaar. Je woning kan live."}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {requiredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-stone-100 px-4 py-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.done ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-500"}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{item.label}</p>
                    <p className={`text-xs ${item.done ? "text-emerald-600" : "text-stone-500"}`}>
                      {item.done ? "Afgerond" : "Nog open"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {publishError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {publishError}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={isPending || saveStatus === "saving"}
              onClick={() => formRef.current?.requestSubmit()}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition disabled:opacity-50 ${
                saveStatus === "saved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-stone-900 hover:bg-stone-50"
              }`}
            >
              {saveStatus === "saving" ? (
                <span className="h-5 w-5 rounded-full border-2 border-stone-400 border-t-transparent animate-spin" />
              ) : saveStatus === "saved" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Save className="h-5 w-5 text-stone-500" />
              )}
              {saveStatus === "saved" ? "Opgeslagen" : "Opslaan als concept"}
            </button>

            <button
              type="button"
              disabled={isPending || saveStatus === "saving"}
              onClick={handleSaveAndPublish}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Globe className="h-5 w-5" />
              )}
              {isPending ? "Bezig..." : "Zet woning live"}
            </button>

            <p className="text-center text-xs text-stone-500">
              Later kun je alles nog aanpassen
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}