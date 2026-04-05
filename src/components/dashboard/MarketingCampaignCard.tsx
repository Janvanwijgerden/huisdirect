"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Eye,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Props = {
  listingId: string;
  siteUrl?: string;
};

type MarketingProjection = {
  reachLabel: string;
  boostLabel: string;
  leadLabel: string;
  energyLabel: string;
};

function getMarketingProjection(budget: number): MarketingProjection {
  if (budget <= 350) {
    return {
      reachLabel: "ca. 1.500 - 2.500 extra weergaven",
      boostLabel: "Goede eerste boost in zichtbaarheid",
      leadLabel: "Vergroot je kans op de eerste extra aanvragen",
      energyLabel: "Rustige start",
    };
  }

  if (budget <= 650) {
    return {
      reachLabel: "ca. 3.500 - 5.500 extra weergaven",
      boostLabel: "Sterkere zichtbaarheid in een bredere doelgroep",
      leadLabel: "Meer bereik, meer kans op reacties en bezichtigingen",
      energyLabel: "Sterk momentum",
    };
  }

  return {
    reachLabel: "ca. 7.500 - 12.000 extra weergaven",
    boostLabel: "Maximale aandacht voor je woningcampagne",
    leadLabel: "Grootste kans op extra traffic en nieuwe leads",
    energyLabel: "Maximaal bereik",
  };
}

export default function MarketingCampaignCard({
  listingId,
  siteUrl,
}: Props) {
  const [budget, setBudget] = useState(300);

  const projection = useMemo(
    () => getMarketingProjection(budget),
    [budget]
  );

  const shareUrl = `${siteUrl || ""}/listings/${listingId}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Bekijk mijn woning op HuisDirect: ${shareUrl}`
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // stil falen is hier prima
    }
  };

  return (
    <section
      id="marketing"
      className="mb-8 rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_10px_40px_rgba(5,150,105,0.08)]"
    >
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <Sparkles className="h-3.5 w-3.5" />
            Je woning staat live
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900">
            Geef je woning nu extra bereik
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
            Je woning staat online. Dit is nu de slimste vervolgstap om meer
            aandacht te trekken. Hoe meer bereik je inkoopt, hoe groter de kans
            dat extra kijkers doorklikken, reageren en een bezichtiging
            aanvragen.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                <Eye className="h-4 w-4 text-emerald-600" />
                Meer zichtbaarheid
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Bereik extra woningzoekers buiten je standaard advertentie.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Meer kans op leads
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Meer bereik vergroot de kans op reacties en bezichtigingen.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                Direct opschalen
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Kies simpel zelf hoeveel extra aandacht je wilt inkopen.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-inset ring-neutral-200">
                <Share2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                  Jij bent je eigen makelaar
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  Verstuur je woninglink naar vrienden, familie, collega’s en je
                  netwerk. Elke klik kan zorgen voor extra aandacht en nieuwe
                  aanvragen.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                Jouw woninglink
              </p>
              <p className="mt-2 break-all text-sm text-neutral-700">
                {shareUrl}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                <Copy className="h-4 w-4" />
                Kopieer link
              </button>

              <Link
                href={whatsappUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                <Send className="h-4 w-4" />
                Deel via WhatsApp
              </Link>

              <Link
                href={`/listings/${listingId}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                <Eye className="h-4 w-4" />
                Bekijk advertentie
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">
                  Kliks via gedeelde link
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                  0
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  Deze teller koppelen we straks live aan de backend.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Waarom delen werkt
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Hoe vaker je jouw woning actief deelt, hoe meer extra ogen je
                  advertentie zien. Dat geeft direct momentum.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
              Kies zelf je marketingbudget
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Sleep direct met de slider en zie meteen wat meer budget kan doen.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Budget</span>
              <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                € {budget}
              </span>
            </div>

            <div className="mt-5">
              <input
                type="range"
                min="250"
                max="1000"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-600"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
              <span>€250</span>
              <span>€1000</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">
                Geschat extra bereik
              </p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {projection.reachLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                Campagne-effect
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {projection.boostLabel}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                {projection.leadLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Campagneniveau
                </p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {projection.energyLabel}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{
                    width: `${((budget - 250) / (1000 - 250)) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Meer budget voelt hier direct als meer zichtbaarheid. Dat maakt
                de keuze eenvoudiger en motiveert om door te schuiven.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            Activeer campagne van € {budget}
          </button>

          <p className="mt-3 text-center text-xs leading-relaxed text-neutral-500">
            Straks koppelen we dit aan echte campagne-opslag en live resultaten.
          </p>
        </div>
      </div>
    </section>
  );
}