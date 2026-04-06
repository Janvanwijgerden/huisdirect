import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  ChevronRight,
  Euro,
  Eye,
  FileText,
  Home,
  ImagePlus,
  MapPin,
  PencilLine,
  Ruler,
  Sparkles,
} from "lucide-react";

function formatPrice(value?: number | null) {
  if (!value) return "Nog niet ingevuld";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCompletionScore(listing: any, imageCount: number) {
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

function getNextStep(listing: any, imageCount: number) {
  if (imageCount === 0) {
    return {
      title: "Voeg foto’s toe",
      text: "Sterke foto’s zijn het eerste wat kopers zien. Dit heeft direct impact op kliks en aanvragen.",
      href: `/listings/${listing.id}/edit`,
      cta: "Foto’s uploaden",
    };
  }

  if (!listing.asking_price) {
    return {
      title: "Bepaal je vraagprijs",
      text: "Een duidelijke vraagprijs geeft vertrouwen en helpt kopers sneller beslissen om contact op te nemen.",
      href: `/listings/${listing.id}/edit`,
      cta: "Vraagprijs invullen",
    };
  }

  if (!listing.description || listing.description.length < 80) {
    return {
      title: "Schrijf je omschrijving",
      text: "Een goede woningomschrijving verkoopt sfeer, ruimte en vertrouwen. Dit maakt je advertentie veel sterker.",
      href: `/listings/${listing.id}/edit`,
      cta: "Omschrijving schrijven",
    };
  }

  return {
    title: "Controleer en zet live",
    text: "Je basis staat. Loop je advertentie nog één keer door en zet hem daarna live voor kopers.",
    href: `/listings/${listing.id}/edit`,
    cta: "Advertentie afronden",
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const listing = listings?.[0] ?? null;

  if (!listing) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Start je verkoop
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Je hebt nog geen woning gestart
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
                Start met je adres en wij helpen je stap voor stap verder. Zo bouw je
                snel een sterke advertentie op die klaar is om live te gaan.
              </p>

              <div className="mt-8">
                <Link
                  href="/listings/new"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Plaats woning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { data: images } = await supabase
    .from("listing_images")
    .select("id, public_url, is_cover, position")
    .eq("listing_id", listing.id)
    .order("position", { ascending: true });

  const imageList = images ?? [];
  const coverImage =
    imageList.find((image: any) => image.is_cover)?.public_url ||
    imageList[0]?.public_url ||
    null;

  const completion = getCompletionScore(listing, imageList.length);
  const nextStep = getNextStep(listing, imageList.length);

  const checklist = [
    {
      label: "Basisgegevens ingevuld",
      done: !!listing.title && !!listing.street && !!listing.city,
    },
    {
      label: "Vraagprijs toegevoegd",
      done: !!listing.asking_price,
    },
    {
      label: "Kenmerken toegevoegd",
      done: !!listing.property_type && !!listing.living_area && !!listing.year_built,
    },
    {
      label: "Omschrijving geschreven",
      done: !!listing.description && listing.description.length >= 80,
    },
    {
      label: "Foto’s geüpload",
      done: imageList.length > 0,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Jouw woning in opbouw
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {listing.title || `${listing.street || "Jouw woning"}, ${listing.city || ""}`}
          </h1>

          <p className="max-w-3xl text-base leading-7 text-neutral-600">
            Hier werk je jouw advertentie af. Laat hem voelen als een echte woningpresentatie,
            niet als een invulscherm. Hoe beter het hier oogt, hoe groter de kans dat je hem ook echt afmaakt.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_380px]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="relative">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={listing.title || "Woning"}
                    className="h-[280px] w-full object-cover sm:h-[380px]"
                  />
                ) : (
                  <div className="flex h-[280px] w-full items-center justify-center bg-neutral-100 sm:h-[380px]">
                    <div className="text-center">
                      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <ImagePlus className="h-6 w-6 text-neutral-400" />
                      </div>
                      <p className="text-base font-medium text-neutral-700">
                        Voeg een sterke hoofdfoto toe
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        De eerste foto bepaalt voor een groot deel de eerste indruk.
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-5 sm:p-7">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                      Voorbeeld van je live advertentie
                    </p>

                    <div className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                      {formatPrice(listing.asking_price)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90 sm:text-base">
                      {listing.living_area ? (
                        <span className="inline-flex items-center gap-2">
                          <Ruler className="h-4 w-4" />
                          {listing.living_area} m²
                        </span>
                      ) : null}

                      {listing.bedrooms ? (
                        <span className="inline-flex items-center gap-2">
                          <BedDouble className="h-4 w-4" />
                          {listing.bedrooms} kamers
                        </span>
                      ) : null}

                      {listing.year_built ? (
                        <span className="inline-flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Bouwjaar {listing.year_built}
                        </span>
                      ) : null}

                      {listing.energy_label ? (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Label {listing.energy_label}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.street || "Adres nog niet volledig"}{listing.city ? `, ${listing.city}` : ""}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <Eye className="h-3.5 w-3.5" />
                      Zo zien kopers jouw woning straks
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                    Woningomschrijving
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                    {listing.description && listing.description.length > 0
                      ? listing.description
                      : "Voeg een overtuigende omschrijving toe waarin ruimte, sfeer, ligging en pluspunten direct duidelijk worden. Dit is een belangrijk verkooponderdeel van je advertentie."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Advertentie bewerken
                      <PencilLine className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
                    >
                      Foto’s beheren
                      <ImagePlus className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Snelle woningcheck
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span className="text-sm text-neutral-500">Woningtype</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {listing.property_type || "Nog niet ingevuld"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span className="text-sm text-neutral-500">Vraagprijs</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {formatPrice(listing.asking_price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span className="text-sm text-neutral-500">Woonoppervlakte</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {listing.living_area ? `${listing.living_area} m²` : "Nog niet ingevuld"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span className="text-sm text-neutral-500">Foto’s</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {imageList.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <ImagePlus className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                      Foto’s moeten extreem makkelijk zijn
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                      Foto’s verkopen je woning. Zorg dat de mooiste buitenfoto bovenaan staat
                      en maak het wisselen van hoofdfoto straks drag-and-drop.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
                  <p className="text-sm font-medium text-neutral-900">
                    Aanbevolen hierna
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Upload eerst 8 tot 15 sterke foto’s. Begin met vooraanzicht, woonkamer, keuken en tuin.
                  </p>
                </div>
              </div>

              <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                      Verkoop vanuit gevoel én duidelijkheid
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                      Laat direct zien waarom deze woning aantrekkelijk is. Kopers beslissen niet alleen op feiten,
                      maar vooral op gevoel, vertrouwen en eerste indruk.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-emerald-50/60 p-4">
                  <p className="text-sm font-medium text-neutral-900">
                    Slimme tip
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Benoem licht, ruimte, tuin, rust, sfeer en ligging. Dat leest sterker dan alleen droge kenmerken.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <p className="text-sm font-medium text-neutral-500">Voortgang</p>

              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                {completion}% compleet
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Hoe completer je advertentie, hoe professioneler hij voelt voor kopers.
              </p>
            </div>

            <div className="rounded-[32px] border border-emerald-200 bg-emerald-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700/80">
                Eerstvolgende beste stap
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                {nextStep.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                {nextStep.text}
              </p>

              <Link
                href={nextStep.href}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {nextStep.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                Checklist
              </h3>

              <div className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl bg-neutral-50 px-4 py-3"
                  >
                    <div
                      className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                        item.done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-sm text-neutral-700">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                Klaar om live te gaan?
              </h3>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Publiceer pas als je advertentie vertrouwen uitstraalt. Goede foto’s en een sterke omschrijving maken het verschil.
              </p>

              <Link
                href={`/listings/${listing.id}/edit`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Eerst nog verbeteren
                <PencilLine className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}