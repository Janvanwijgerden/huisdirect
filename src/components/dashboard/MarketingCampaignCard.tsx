"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Eye, Send, Share2 } from "lucide-react";

type MarketingCampaignCardProps = {
  listingId: string;
  budget: number;
  views: number;
  marketingActive?: boolean;
  city?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  slug?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildPublicHousePath({
  slug,
  city,
  street,
  houseNumber,
  listingId,
}: {
  slug?: string | null;
  city?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  listingId: string;
}) {
  if (slug && slug.trim()) {
    return `/huis/${slug}`;
  }

  if (city && street && houseNumber) {
    return `/huis/${normalizeSegment(city)}/${normalizeSegment(
      street
    )}/${normalizeSegment(houseNumber)}`;
  }

  return `/listings/${listingId}`;
}

function getEstimatedReachRange(amount: number) {
  const step = (amount - 250) / 50;
  const min = 1500 + step * 250;
  const max = 2500 + step * 450;

  return {
    min: Math.round(min),
    max: Math.round(max),
  };
}

function getCampaignPsychology(amount: number) {
  if (amount >= 950) {
    return {
      badge: "Maximale zichtbaarheid",
      title: "Vol inzetten op bereik",
      text: "Je kiest hier voor maximale exposure en veel herhaling in zichtbaarheid.",
      progress: 100,
    };
  }

  if (amount >= 800) {
    return {
      badge: "Zeer sterk bereik",
      title: "Dominant zichtbaar in je regio",
      text: "Serieuze campagne met veel meer herhaling en een duidelijk groter bereik.",
      progress: 82,
    };
  }

  if (amount >= 650) {
    return {
      badge: "Sterke boost",
      title: "Duidelijk meer tractie",
      text: "Sterke middenzone: genoeg kracht om merkbaar meer aandacht op te bouwen.",
      progress: 66,
    };
  }

  if (amount >= 500) {
    return {
      badge: "Slimme keuze",
      title: "Goede balans tussen kosten en bereik",
      text: "Vanaf hier voelt marketing voor veel verkopers echt serieus.",
      progress: 50,
    };
  }

  if (amount >= 350) {
    return {
      badge: "Veilige start",
      title: "Rustig opschalen",
      text: "Prima instap om extra aandacht te creëren zonder direct groot te beginnen.",
      progress: 34,
    };
  }

  return {
    badge: "Instapniveau",
    title: "Eerste extra zichtbaarheid",
    text: "Logische ondergrens om marketing serieus te starten.",
    progress: 20,
  };
}

export default function MarketingCampaignCard({
  listingId,
  budget,
  views,
  marketingActive = false,
  city,
  street,
  houseNumber,
  slug,
}: MarketingCampaignCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(
    Math.min(1000, Math.max(250, budget || 300))
  );

  const publicPath = useMemo(
    () =>
      buildPublicHousePath({
        slug,
        city,
        street,
        houseNumber,
        listingId,
      }),
    [slug, city, street, houseNumber, listingId]
  );

  const absoluteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${publicPath}`
      : publicPath;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Bekijk mijn woning op HuisDirect: ${absoluteUrl}`
  )}`;

  const estimatedReach = useMemo(
    () => getEstimatedReachRange(selectedBudget),
    [selectedBudget]
  );

  const campaign = useMemo(
    () => getCampaignPsychology(selectedBudget),
    [selectedBudget]
  );

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="marketing"
      className="mb-8 rounded-[1.75rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6"
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-stone-200 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-emerald-600">
              <Share2 className="h-4.5 w-4.5" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold tracking-tight text-stone-950">
                Jij bent je eigen makelaar
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-stone-600">
                Verstuur je woninglink naar vrienden, familie, collega&apos;s en je
                netwerk. Elke klik kan zorgen voor extra aandacht en nieuwe
                aanvragen.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1rem] border border-stone-200 bg-stone-50/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
              Jouw woninglink
            </p>
            <p className="mt-2 break-all text-base text-stone-800">{publicPath}</p>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-[60px] items-center justify-center gap-2.5 rounded-[1rem] border border-stone-200 bg-white px-3 py-3 text-sm font-medium text-stone-800 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Copy className="h-4.5 w-4.5 text-stone-500" />
              <span>{copied ? "Gekopieerd" : "Kopieer link"}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[60px] items-center justify-center gap-2.5 rounded-[1rem] border border-stone-200 bg-white px-3 py-3 text-sm font-medium text-stone-800 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Send className="h-4.5 w-4.5 text-stone-500" />
              <span>Deel via WhatsApp</span>
            </a>

            <Link
              href={publicPath}
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center gap-2.5 rounded-[1rem] border border-stone-200 bg-white px-3 py-3 text-sm font-medium text-stone-800 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Eye className="h-4.5 w-4.5 text-stone-500" />
              <span>Bekijk advertentie</span>
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1rem] border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Kliks via gedeelde link
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {views}
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                Dit zijn echte opens van je woningpagina via de gedeelde link.
              </p>
            </div>

            <div className="rounded-[1rem] border border-stone-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                Waarom delen werkt
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                Hoe vaker je jouw woning actief deelt, hoe meer extra ogen je
                advertentie zien en hoe sneller je momentum opbouwt.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 p-4 sm:p-5">
          <div className="rounded-[1rem] border border-emerald-100 bg-emerald-50 px-4 py-4">
            <p className="text-sm font-medium text-emerald-800">
              Geschat extra bereik met campagne
            </p>
            <p className="mt-1.5 text-[2rem] font-semibold leading-tight tracking-tight text-stone-950">
              ca. {estimatedReach.min.toLocaleString("nl-NL")} -{" "}
              {estimatedReach.max.toLocaleString("nl-NL")} extra weergaven
            </p>
          </div>

          <div className="mt-3 rounded-[1rem] border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                Marketingbudget
              </p>
              <span className="text-base font-semibold text-stone-950">
                {formatCurrency(selectedBudget)}
              </span>
            </div>

            <input
              type="range"
              min={250}
              max={1000}
              step={50}
              value={selectedBudget}
              onChange={(event) => setSelectedBudget(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-emerald-600"
            />

            <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500">
              <span>€250</span>
              <span>€500</span>
              <span>€750</span>
              <span>€1000</span>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center rounded-[1rem] bg-emerald-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
            >
              {marketingActive
                ? `Campagne actief · ${formatCurrency(selectedBudget)}`
                : `Activeer campagne van ${formatCurrency(selectedBudget)}`}
            </button>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Vanaf ongeveer €500 voelt een campagne voor veel verkopers al
              serieus, terwijl hogere bedragen zorgen voor meer herhaling en
              zichtbaarheid.
            </p>
          </div>

          <div className="mt-3 rounded-[1rem] border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                Campagneniveau
              </p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {campaign.badge}
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>

            <h4 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
              {campaign.title}
            </h4>

            <p className="mt-1.5 text-sm leading-6 text-stone-600">
              {campaign.text}
            </p>
          </div>

          <p className="mt-3 text-xs leading-5 text-stone-500">
            Echte campagne-opslag koppelen we hierna aan de database. De slider
            en impactweergave werken nu alvast volledig in de UI.
          </p>
        </div>
      </div>
    </section>
  );
}