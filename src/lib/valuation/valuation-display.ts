// src/lib/valuation/valuation-display.ts

type NumericInput = number | string | null | undefined;

function toNumber(value: NumericInput): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function roundToThousands(value: NumericInput): number | null {
  const numericValue = toNumber(value);
  if (numericValue === null) return null;

  return Math.round(numericValue / 1000) * 1000;
}

export function formatEuroRounded(value: NumericInput): string {
  const rounded = roundToThousands(value);

  if (!rounded) return "Onbekend";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function calculateBrokerFeeEstimate(value: NumericInput) {
  const roundedValue = roundToThousands(value);

  if (!roundedValue) {
    return {
      low: null,
      high: null,
      platformFee: 195,
      savingLow: null,
      savingHigh: null,
    };
  }

  const brokerFeeLow = Math.round(roundedValue * 0.0125);
  const brokerFeeHigh = Math.round(roundedValue * 0.0185);
  const platformFee = 195;

  return {
    low: brokerFeeLow,
    high: brokerFeeHigh,
    platformFee,
    savingLow: Math.max(0, brokerFeeLow - platformFee),
    savingHigh: Math.max(0, brokerFeeHigh - platformFee),
  };
}

export function formatSavingsRange(value: NumericInput): string {
  const estimate = calculateBrokerFeeEstimate(value);

  if (!estimate.savingLow || !estimate.savingHigh) {
    return "Besparing wordt berekend zodra de waarde bekend is.";
  }

  return `${formatEuroRounded(estimate.savingLow)} – ${formatEuroRounded(
    estimate.savingHigh
  )}`;
}