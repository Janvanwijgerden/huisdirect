// src/lib/valuation/huisdirect-valuation-v1.ts

export type HuisDirectValuationInput = {
  asking_price?: number | null;

  living_area?: number | null;
  plot_size?: number | null;
  year_built?: number | null;
  property_type?: string | null;
  energy_label?: string | null;

  source_living_area?: number | null;
  source_plot_area?: number | null;
  source_build_year?: number | null;
  source_property_type?: string | null;
  source_energy_label?: string | null;
  source_woz_value?: number | null;

  source_city?: string | null;
  source_postal_code?: string | null;
  source_lat?: number | null;
  source_lng?: number | null;

  features?: Record<string, any> | null;
};

export type HuisDirectValuationResult = {
  estimated_value_low: number;
  estimated_value_mid: number;
  estimated_value_high: number;
  valuation_confidence: number;
  valuation_price_per_m2: number;
  valuation_source: 'huisdirect_ai_v1';
  valuation_model_version: 'huisdirect_ai_v1.0.0';
  valuation_metadata: {
    method: string;
    base_source: 'woz' | 'price_per_m2_fallback';
    base_value: number;
    correction_factor: number;
    confidence_reasons: string[];
    value_drivers: string[];
    warnings: string[];
    inputs_used: Record<string, unknown>;
  };
};

const VALUATION_SOURCE = 'huisdirect_ai_v1' as const;
const VALUATION_MODEL_VERSION = 'huisdirect_ai_v1.0.0' as const;

function roundToNearest(value: number, nearest = 1000): number {
  return Math.round(value / nearest) * nearest;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalize(value?: string | null): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function getNestedBoolean(features: Record<string, any> | null | undefined, path: string[]): boolean {
  let current: any = features;
  for (const key of path) {
    if (!current || typeof current !== 'object') return false;
    current = current[key];
  }
  return current === true;
}

function getLivingArea(input: HuisDirectValuationInput): number | null {
  return toNumber(input.source_living_area) ?? toNumber(input.living_area);
}

function getPlotSize(input: HuisDirectValuationInput): number | null {
  return toNumber(input.source_plot_area) ?? toNumber(input.plot_size);
}

function getBuildYear(input: HuisDirectValuationInput): number | null {
  return toNumber(input.source_build_year) ?? toNumber(input.year_built);
}

function getEnergyLabel(input: HuisDirectValuationInput): string | null {
  return input.source_energy_label || input.energy_label || null;
}

function getPropertyType(input: HuisDirectValuationInput): string | null {
  return input.source_property_type || input.property_type || null;
}

function fallbackPricePerM2(input: HuisDirectValuationInput): number {
  const city = normalize(input.source_city);
  const postalCode = String(input.source_postal_code || '').replace(/\s+/g, '').toUpperCase();
  const propertyType = normalize(getPropertyType(input));

  let base = 4100;

  if (city.includes('amsterdam')) base = 7600;
  else if (city.includes('utrecht')) base = 6100;
  else if (city.includes('haarlem')) base = 5900;
  else if (city.includes('rotterdam')) base = 4550;
  else if (city.includes('den_haag') || city.includes('s-gravenhage')) base = 4850;
  else if (city.includes('eindhoven')) base = 4700;
  else if (city.includes('breda')) base = 4550;
  else if (city.includes('tilburg')) base = 3900;
  else if (city.includes('groningen')) base = 4300;
  else if (city.includes('giessenburg') || city.includes('molenlanden')) base = 3700;

  if (postalCode.startsWith('10')) base = Math.max(base, 7200);
  if (postalCode.startsWith('35')) base = Math.max(base, 5900);
  if (postalCode.startsWith('30')) base = Math.max(base, 4400);
  if (postalCode.startsWith('33')) base = Math.max(base, 3600);

  if (propertyType.includes('appartement')) base *= 1.05;
  if (propertyType.includes('vrijstaand')) base *= 0.95;
  if (propertyType.includes('twee_onder_een_kap')) base *= 0.98;

  return roundToNearest(base, 50);
}

function energyCorrection(label: string | null): { factor: number; reason?: string } {
  const normalized = normalize(label).replace(/\+/g, 'plus');

  if (!normalized) return { factor: 1 };

  if (normalized.includes('aplusplusplus') || normalized.includes('a++++')) {
    return { factor: 1.055, reason: 'Zeer sterk energielabel verhoogt de verwachte waarde.' };
  }

  if (normalized.includes('aplusplus') || normalized.includes('a+++')) {
    return { factor: 1.045, reason: 'Energielabel A+++ is een duidelijke positieve waardedrijver.' };
  }

  if (normalized.includes('aplus') || normalized.includes('a++')) {
    return { factor: 1.035, reason: 'Energielabel A++ ondersteunt een hogere marktwaarde.' };
  }

  if (normalized === 'a' || normalized.includes('label_a')) {
    return { factor: 1.025, reason: 'Energielabel A is positief voor verkoopbaarheid en waarde.' };
  }

  if (normalized === 'b') return { factor: 1.01, reason: 'Energielabel B is licht positief.' };
  if (normalized === 'c') return { factor: 1 };
  if (normalized === 'd') return { factor: 0.985, reason: 'Energielabel D drukt de waarde licht.' };
  if (normalized === 'e') return { factor: 0.965, reason: 'Energielabel E vraagt om een conservatievere waardering.' };
  if (normalized === 'f') return { factor: 0.94, reason: 'Energielabel F verlaagt de verwachte waarde.' };
  if (normalized === 'g') return { factor: 0.91, reason: 'Energielabel G verlaagt de verwachte waarde duidelijk.' };

  return { factor: 1 };
}

function buildYearCorrection(year: number | null): { factor: number; reason?: string } {
  if (!year) return { factor: 1 };

  if (year >= 2020) return { factor: 1.04, reason: 'Recente bouw verhoogt de verwachte waarde.' };
  if (year >= 2010) return { factor: 1.025, reason: 'Relatief jonge bouw is positief voor de waarde.' };
  if (year >= 1990) return { factor: 1.005 };
  if (year >= 1970) return { factor: 0.99 };
  if (year >= 1945) return { factor: 0.975, reason: 'Oudere bouw vraagt om een iets voorzichtigere waardering.' };
  if (year < 1945) return { factor: 0.985, reason: 'Karakteristieke oudere bouw kan waardevol zijn, maar vraagt meer nuance.' };

  return { factor: 1 };
}

function propertyTypeCorrection(type: string | null): { factor: number; reason?: string } {
  const normalized = normalize(type);

  if (!normalized) return { factor: 1 };

  if (normalized.includes('vrijstaand')) {
    return { factor: 1.04, reason: 'Vrijstaande woningen hebben vaak een hogere marktwaarde door privacy en perceel.' };
  }

  if (normalized.includes('twee_onder_een_kap')) {
    return { factor: 1.025, reason: 'Twee-onder-een-kapwoningen scoren vaak bovengemiddeld in de markt.' };
  }

  if (normalized.includes('hoek')) {
    return { factor: 1.015, reason: 'Een hoekwoning heeft vaak extra licht, privacy en grond.' };
  }

  if (normalized.includes('appartement')) {
    return { factor: 0.99 };
  }

  return { factor: 1 };
}

function featureCorrections(features: Record<string, any> | null | undefined): {
  factor: number;
  reasons: string[];
} {
  let factor = 1;
  const reasons: string[] = [];

  const solarPanels = getNestedBoolean(features, ['extras', 'solarPanels']);
  const airco = getNestedBoolean(features, ['extras', 'airco']);
  const elevator = getNestedBoolean(features, ['extras', 'elevator']);
  const fireplace = getNestedBoolean(features, ['extras', 'fireplace']);
  const swimmingPool = getNestedBoolean(features, ['extras', 'swimmingPool']);
  const hasGarden = getNestedBoolean(features, ['outdoor', 'garden', 'hasGarden']);
  const balcony = getNestedBoolean(features, ['outdoor', 'balcony']);
  const roofTerrace = getNestedBoolean(features, ['outdoor', 'roofTerrace']);
  const hasGarage = getNestedBoolean(features, ['garage', 'hasGarage']);
  const hasStorage = getNestedBoolean(features, ['storage', 'hasStorage']);

  const condition = normalize(features?.general?.condition);
  const orientation = normalize(features?.outdoor?.garden?.orientation);

  if (solarPanels) {
    factor += 0.012;
    reasons.push('Zonnepanelen versterken de energiezuinigheid en verkoopbaarheid.');
  }

  if (airco) {
    factor += 0.006;
    reasons.push('Airconditioning verhoogt het wooncomfort.');
  }

  if (elevator) {
    factor += 0.006;
    reasons.push('Een lift is vooral bij appartementen een positief comfortkenmerk.');
  }

  if (fireplace) {
    factor += 0.004;
    reasons.push('Een haard kan bijdragen aan sfeer en beleving.');
  }

  if (swimmingPool) {
    factor += 0.01;
    reasons.push('Een zwembad is een onderscheidend luxe kenmerk.');
  }

  if (hasGarden) {
    factor += 0.012;
    reasons.push('Een tuin is een sterke waardedrijver voor veel kopers.');
  }

  if (orientation.includes('zuid')) {
    factor += 0.006;
    reasons.push('Een gunstige tuinligging richting het zuiden ondersteunt de waarde.');
  }

  if (balcony) {
    factor += 0.005;
    reasons.push('Een balkon verhoogt de gebruikswaarde van de woning.');
  }

  if (roofTerrace) {
    factor += 0.009;
    reasons.push('Een dakterras is een aantrekkelijk buitenruimtekenmerk.');
  }

  if (hasGarage) {
    factor += 0.012;
    reasons.push('Een garage is positief voor gebruiksgemak en verkoopbaarheid.');
  }

  if (hasStorage) {
    factor += 0.004;
    reasons.push('Extra bergruimte ondersteunt de praktische waarde.');
  }

  if (condition.includes('uitstekend') || condition.includes('instapklaar')) {
    factor += 0.025;
    reasons.push('Een uitstekende of instapklare staat verhoogt de verwachte opbrengst.');
  } else if (condition.includes('goed')) {
    factor += 0.012;
    reasons.push('Een goede onderhoudsstaat ondersteunt de waarde.');
  } else if (condition.includes('matig') || condition.includes('renovatie')) {
    factor -= 0.035;
    reasons.push('Een matige staat of renovatiebehoefte verlaagt de verwachte waarde.');
  }

  return {
    factor,
    reasons,
  };
}

function plotCorrection(plotSize: number | null, livingArea: number | null, propertyType: string | null): {
  factor: number;
  reason?: string;
} {
  if (!plotSize || !livingArea) return { factor: 1 };

  const normalizedType = normalize(propertyType);

  if (normalizedType.includes('appartement')) return { factor: 1 };

  const ratio = plotSize / livingArea;

  if (ratio >= 6) {
    return { factor: 1.035, reason: 'Het ruime perceel is een duidelijke plus in de waardering.' };
  }

  if (ratio >= 3) {
    return { factor: 1.02, reason: 'Het perceel is relatief ruim ten opzichte van de woning.' };
  }

  if (ratio < 1.1) {
    return { factor: 0.985, reason: 'Het perceel is relatief beperkt ten opzichte van het woonoppervlak.' };
  }

  return { factor: 1 };
}

function calculateConfidence(input: HuisDirectValuationInput, warnings: string[]): {
  confidence: number;
  reasons: string[];
} {
  let score = 45;
  const reasons: string[] = [];

  if (toNumber(input.source_woz_value)) {
    score += 20;
    reasons.push('WOZ-waarde aanwezig.');
  }

  if (getLivingArea(input)) {
    score += 12;
    reasons.push('Woonoppervlakte aanwezig.');
  }

  if (getBuildYear(input)) {
    score += 7;
    reasons.push('Bouwjaar aanwezig.');
  }

  if (getPropertyType(input)) {
    score += 6;
    reasons.push('Woningtype aanwezig.');
  }

  if (getEnergyLabel(input)) {
    score += 5;
    reasons.push('Energielabel aanwezig.');
  }

  if (input.source_postal_code || input.source_city) {
    score += 5;
    reasons.push('Locatiegegevens aanwezig.');
  }

  if (input.features && Object.keys(input.features).length > 0) {
    score += 5;
    reasons.push('Uitgebreide woningkenmerken aanwezig.');
  }

  score -= warnings.length * 4;

  return {
    confidence: clamp(Math.round(score), 35, 92),
    reasons,
  };
}

export function calculateHuisDirectValuation(
  input: HuisDirectValuationInput
): HuisDirectValuationResult | null {
  const livingArea = getLivingArea(input);
  const plotSize = getPlotSize(input);
  const buildYear = getBuildYear(input);
  const propertyType = getPropertyType(input);
  const energyLabel = getEnergyLabel(input);
  const wozValue = toNumber(input.source_woz_value);

  const warnings: string[] = [];
  const valueDrivers: string[] = [];

  if (!livingArea || livingArea < 15) {
    warnings.push('Woonoppervlakte ontbreekt of lijkt onrealistisch.');
    return null;
  }

  if (livingArea > 1000) {
    warnings.push('Woonoppervlakte lijkt extreem hoog en moet handmatig gecontroleerd worden.');
  }

  let baseValue: number;
  let baseSource: 'woz' | 'price_per_m2_fallback';

  if (wozValue && wozValue > 50000) {
    baseValue = wozValue;
    baseSource = 'woz';
    valueDrivers.push('WOZ-waarde gebruikt als basis voor de eerste waardering.');
  } else {
    const pricePerM2 = fallbackPricePerM2(input);
    baseValue = livingArea * pricePerM2;
    baseSource = 'price_per_m2_fallback';
    valueDrivers.push(`Fallback gebruikt: ${pricePerM2.toLocaleString('nl-NL')} euro per m² op basis van locatie en woningtype.`);
  }

  const energy = energyCorrection(energyLabel);
  const build = buildYearCorrection(buildYear);
  const type = propertyTypeCorrection(propertyType);
  const plot = plotCorrection(plotSize, livingArea, propertyType);
  const features = featureCorrections(input.features);

  if (energy.reason) valueDrivers.push(energy.reason);
  if (build.reason) valueDrivers.push(build.reason);
  if (type.reason) valueDrivers.push(type.reason);
  if (plot.reason) valueDrivers.push(plot.reason);
  valueDrivers.push(...features.reasons);

  const correctionFactor = clamp(
    energy.factor * build.factor * type.factor * plot.factor * features.factor,
    0.82,
    1.22
  );

  const midRaw = baseValue * correctionFactor;
  const rangePercentage = baseSource === 'woz' ? 0.055 : 0.085;

  const estimatedMid = roundToNearest(midRaw, 1000);
  const estimatedLow = roundToNearest(estimatedMid * (1 - rangePercentage), 1000);
  const estimatedHigh = roundToNearest(estimatedMid * (1 + rangePercentage), 1000);
  const pricePerM2 = roundToNearest(estimatedMid / livingArea, 50);

  const confidence = calculateConfidence(input, warnings);

  return {
    estimated_value_low: estimatedLow,
    estimated_value_mid: estimatedMid,
    estimated_value_high: estimatedHigh,
    valuation_confidence: confidence.confidence,
    valuation_price_per_m2: pricePerM2,
    valuation_source: VALUATION_SOURCE,
    valuation_model_version: VALUATION_MODEL_VERSION,
    valuation_metadata: {
      method: 'rule_based_baseline_with_bag_woz_features',
      base_source: baseSource,
      base_value: roundToNearest(baseValue, 1000),
      correction_factor: Number(correctionFactor.toFixed(4)),
      confidence_reasons: confidence.reasons,
      value_drivers: valueDrivers.slice(0, 8),
      warnings,
      inputs_used: {
        living_area: livingArea,
        plot_size: plotSize,
        build_year: buildYear,
        property_type: propertyType,
        energy_label: energyLabel,
        source_woz_value: wozValue,
        source_city: input.source_city || null,
        source_postal_code: input.source_postal_code || null,
      },
    },
  };
}