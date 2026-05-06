"use client";

import { useMemo, useState } from "react";

type Props = {
  listingId: string;
  shareUrl: string;
  initialBudget?: number | null;
  listing?: any;
  viewCount?: number;
  engagementRate?: number;
  leadCount?: number;
  conversionRate?: number;
};

function getReachEstimate(budget: number) {
  return {
    min: Math.round(budget * 4),
    max: Math.round(budget * 8),
  };
}

function getRecommendedBudget({
  viewCount,
  engagementRate,
  leadCount,
}: {
  viewCount: number;
  engagementRate: number;
  leadCount: number;
}) {
  if (viewCount < 20) return 500;
  if (viewCount >= 20 && engagementRate >= 10 && leadCount === 0) return 750;
  if (leadCount > 0) return 500;
  return 500;
}

function getPlatforms({
  budget,
  listing,
  engagementRate,
}: {
  budget: number;
  listing?: any;
  engagementRate: number;
}) {
  const price = Number(listing?.asking_price || 0);

  if (budget <= 300) return ["Facebook"];

  if (price >= 700000 || engagementRate >= 10) {
    return ["Facebook", "Instagram"];
  }

  return ["Facebook", "Instagram"];
}

function getAdvice({
  viewCount,
  engagementRate,
  leadCount,
  conversionRate,
}: {
  viewCount: number;
  engagementRate: number;
  leadCount: number;
  conversionRate: number;
}) {
  if (viewCount < 20) {
    return "Je woning wordt nog weinig gezien. Extra bereik is nu de meest logische eerste stap.";
  }

  if (viewCount >= 20 && leadCount === 0 && engagementRate < 5) {
    return "Er komen bezoekers binnen, maar de interesse blijft laag. Start conservatief en beoordeel tegelijk foto’s, prijs en presentatie.";
  }

  if (viewCount >= 20 && leadCount === 0 && engagementRate >= 5) {
    return "Je woning krijgt aandacht en interesse. Extra bereik kan nu helpen om meer bezichtigingsaanvragen te krijgen.";
  }

  if (leadCount > 0 && conversionRate < 1) {
    return "Je krijgt al aanvragen, maar de conversie is nog laag. Extra bereik kan helpen, maar blijf kritisch op prijs en presentatie.";
  }

  return "Je woning presteert gezond. Extra marketing kan helpen om dit momentum door te zetten.";
}

export default function MarketingBudgetSlider({
  listingId,
  shareUrl,
  initialBudget = null,
  listing,
  viewCount = 0,
  engagementRate = 0,
  leadCount = 0,
  conversionRate = 0,
}: Props) {
  const recommendedBudget = useMemo(
    () =>
      getRecommendedBudget({
        viewCount,
        engagementRate,
        leadCount,
      }),
    [viewCount, engagementRate, leadCount]
  );

  const safeInitialBudget =
    typeof initialBudget === "number" && initialBudget >= 250
      ? initialBudget
      : recommendedBudget;

  const [budget, setBudget] = useState<number>(safeInitialBudget);
  const [loading, setLoading] = useState(false);

  const reach = getReachEstimate(budget);

  const platforms = getPlatforms({
    budget,
    listing,
    engagementRate,
  });

  const advice = getAdvice({
    viewCount,
    engagementRate,
    leadCount,
    conversionRate,
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/listing-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          eventType: "marketing_request",
          source: "marketing_dashboard",
          metadata: {
            budget,
            recommendedBudget,
            platforms,
            shareUrl,
            estimatedReachMin: reach.min,
            estimatedReachMax: reach.max,
            viewCount,
            engagementRate,
            leadCount,
            conversionRate,
          },
        }),
      });

      if (!res.ok) throw new Error("Marketing aanvraag mislukt.");

      alert("Marketing aanvraag verzonden.");
    } catch (e) {
      console.error("Fout bij marketing aanvraag:", e);
      alert("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-semibold text-neutral-950">
        Vergroot je bereik
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Kies een budget. HuisDirect kiest automatisch de beste kanalen voor jouw
        woning, regio en prestaties.
      </p>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">AI-advies</p>
        <p className="mt-1">{advice}</p>
      </div>

      <div className="mt-6">
        <input
          type="range"
          min={250}
          max={1000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full"
        />

        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Marketingbudget</p>
            <p className="text-3xl font-semibold tracking-tight text-neutral-950">
              € {budget}
            </p>
          </div>

          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Advies: € {recommendedBudget}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-100 p-4 text-sm">
        <p className="font-semibold text-neutral-900">Verwacht bereik</p>

        <p className="mt-1 text-lg font-semibold text-neutral-950">
          ± {reach.min.toLocaleString("nl-NL")} –{" "}
          {reach.max.toLocaleString("nl-NL")} mensen
        </p>

        <p className="mt-2 text-xs leading-5 text-neutral-500">
          Lage, conservatieve indicatie. Geen garantie op views, leads,
          bezichtigingen of verkoop.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
        <p className="font-semibold text-neutral-900">
          Automatisch geselecteerde kanalen
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
            >
              {platform}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs leading-5 text-neutral-500">
          Jij hoeft geen platform te kiezen. HuisDirect bepaalt automatisch waar
          dit budget het meest logisch ingezet wordt.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Aanvraag verzenden..." : "Start marketing campagne"}
      </button>
    </div>
  );
}