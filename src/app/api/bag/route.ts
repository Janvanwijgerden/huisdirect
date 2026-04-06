import { NextResponse } from 'next/server';

type BagApiAddress = {
  woonoppervlakte?: number | string;
  oppervlakte?: number | string;
  woningtype?: string;
  type?: string;
  bouwjaar?: number | string;
  pand?: {
    bouwjaar?: number | string;
  };
  verblijfsobject?: {
    oppervlakte?: number | string;
    bouwjaar?: number | string;
    gebruiksdoelen?: string[];
  };
};

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed;
}

function normalizePropertyType(input?: string | null) {
  const value = String(input || '').toLowerCase().trim();

  if (!value) return 'eengezinswoning';
  if (value.includes('appartement')) return 'appartement';
  if (value.includes('vrijstaand')) return 'vrijstaand';
  if (value.includes('hoek')) return 'hoekwoning';
  if (value.includes('tussen')) return 'tussenwoning';
  if (value.includes('twee-onder-een-kap')) return 'twee-onder-een-kap';
  if (value.includes('2-onder-1-kap')) return 'twee-onder-een-kap';
  if (value.includes('2 onder 1 kap')) return 'twee-onder-een-kap';
  if (value.includes('halfvrijstaand')) return 'twee-onder-een-kap';
  if (value.includes('woonfunctie')) return 'eengezinswoning';

  return 'eengezinswoning';
}

function getRegionalPricePerM2(postcode?: string | null) {
  const normalizedPostcode = String(postcode || '')
    .replace(/\s+/g, '')
    .toUpperCase();

  if (normalizedPostcode.startsWith('10') || normalizedPostcode.startsWith('11')) {
    return 5200;
  }

  if (normalizedPostcode.startsWith('25')) {
    return 4700;
  }

  if (normalizedPostcode.startsWith('30')) {
    return 4300;
  }

  if (normalizedPostcode.startsWith('33') || normalizedPostcode.startsWith('42')) {
    return 3700;
  }

  return 3600;
}

function buildSimpleValuation({
  woonoppervlakte,
  woningtype,
  postcode,
}: {
  woonoppervlakte: number;
  woningtype: string;
  postcode?: string | null;
}) {
  let pricePerM2 = getRegionalPricePerM2(postcode);

  if (woningtype === 'vrijstaand') pricePerM2 += 450;
  if (woningtype === 'appartement') pricePerM2 -= 150;
  if (woningtype === 'tussenwoning') pricePerM2 -= 50;
  if (woningtype === 'hoekwoning') pricePerM2 += 75;
  if (woningtype === 'twee-onder-een-kap') pricePerM2 += 200;

  const estimatedValueMid = Math.round(woonoppervlakte * pricePerM2);
  const estimatedValueLow = Math.round(estimatedValueMid * 0.94);
  const estimatedValueHigh = Math.round(estimatedValueMid * 1.06);
  const estimatedWozValue = Math.round(estimatedValueMid * 0.9);

  return {
    estimatedValueLow,
    estimatedValueMid,
    estimatedValueHigh,
    estimatedWozValue,
    pricePerM2,
    confidence: 62,
  };
}

function getAddressSpecificFallback(postcode?: string | null, huisnummer?: string | null) {
  const normalizedPostcode = String(postcode || '').replace(/\s+/g, '').toUpperCase();
  const normalizedHuisnummer = String(huisnummer || '').trim();

  if (normalizedPostcode === '3381AW' && normalizedHuisnummer === '5') {
    const woonoppervlakte = 131;
    const bouwjaar = 1947;
    const woningtype = 'vrijstaand';

    const valuation = buildSimpleValuation({
      woonoppervlakte,
      woningtype,
      postcode,
    });

    return {
      woonoppervlakte,
      bouwjaar,
      woningtype,
      wozWaarde: 472000,
      estimatedValueLow: valuation.estimatedValueLow,
      estimatedValueMid: valuation.estimatedValueMid,
      estimatedValueHigh: valuation.estimatedValueHigh,
      valuationPricePerM2: valuation.pricePerM2,
      valuationConfidence: 70,
      valuationSource: 'address_specific_mock_v1',
      valuationModelVersion: 'simple_valuation_v1',
    };
  }

  if (normalizedPostcode === '3381JS' && normalizedHuisnummer === '4') {
    const woonoppervlakte = 136;
    const bouwjaar = 1998;
    const woningtype = 'eengezinswoning';

    const valuation = buildSimpleValuation({
      woonoppervlakte,
      woningtype,
      postcode,
    });

    return {
      woonoppervlakte,
      bouwjaar,
      woningtype,
      wozWaarde: valuation.estimatedWozValue,
      estimatedValueLow: valuation.estimatedValueLow,
      estimatedValueMid: valuation.estimatedValueMid,
      estimatedValueHigh: valuation.estimatedValueHigh,
      valuationPricePerM2: valuation.pricePerM2,
      valuationConfidence: 62,
      valuationSource: 'address_specific_mock_v1',
      valuationModelVersion: 'simple_valuation_v1',
    };
  }

  return null;
}

function extractAddressFromBagResponse(json: any): BagApiAddress | null {
  const embedded = json?._embedded;

  const addresses =
    embedded?.adressen ||
    embedded?.nummeraanduidingen ||
    embedded?.adresseerbareObjecten ||
    [];

  if (Array.isArray(addresses) && addresses.length > 0) {
    return addresses[0] as BagApiAddress;
  }

  if (addresses && typeof addresses === 'object') {
    return addresses as BagApiAddress;
  }

  return null;
}

function buildFallbackData(postcode?: string | null, huisnummer?: string | null) {
  const specific = getAddressSpecificFallback(postcode, huisnummer);
  if (specific) return specific;

  const woonoppervlakte = 136;
  const bouwjaar = 1998;
  const woningtype = 'eengezinswoning';

  const valuation = buildSimpleValuation({
    woonoppervlakte,
    woningtype,
    postcode,
  });

  return {
    woonoppervlakte,
    bouwjaar,
    woningtype,
    wozWaarde: valuation.estimatedWozValue,
    estimatedValueLow: valuation.estimatedValueLow,
    estimatedValueMid: valuation.estimatedValueMid,
    estimatedValueHigh: valuation.estimatedValueHigh,
    valuationPricePerM2: valuation.pricePerM2,
    valuationConfidence: valuation.confidence,
    valuationSource: 'bag_mock_v2',
    valuationModelVersion: 'simple_valuation_v1',
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const postcode = searchParams.get('postcode');
  const huisnummer = searchParams.get('huisnummer');

  if (!postcode || !huisnummer) {
    return NextResponse.json(
      { error: 'Postcode en huisnummer verplicht' },
      { status: 400 }
    );
  }

  const apiKey = process.env.BAG_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      mock: true,
      data: buildFallbackData(postcode, huisnummer),
    });
  }

  try {
    const res = await fetch(
      `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=${encodeURIComponent(
        postcode
      )}&huisnummer=${encodeURIComponent(huisnummer)}`,
      {
        headers: {
          'X-Api-Key': apiKey,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const text = await res.text();

      return NextResponse.json(
        {
          mock: true,
          warning: `BAG fout, fallback gebruikt: ${text}`,
          data: buildFallbackData(postcode, huisnummer),
        },
        { status: 200 }
      );
    }

    const json = await res.json();
    const firstAddress = extractAddressFromBagResponse(json);

    const woonoppervlakte =
      normalizeNumber(firstAddress?.woonoppervlakte) ||
      normalizeNumber(firstAddress?.oppervlakte) ||
      normalizeNumber(firstAddress?.verblijfsobject?.oppervlakte) ||
      136;

    const bouwjaar =
      normalizeNumber(firstAddress?.bouwjaar) ||
      normalizeNumber(firstAddress?.pand?.bouwjaar) ||
      normalizeNumber(firstAddress?.verblijfsobject?.bouwjaar) ||
      1998;

    const rawWoningtype =
      firstAddress?.woningtype ||
      firstAddress?.type ||
      firstAddress?.verblijfsobject?.gebruiksdoelen?.[0] ||
      'eengezinswoning';

    const woningtype = normalizePropertyType(rawWoningtype);

    const valuation = buildSimpleValuation({
      woonoppervlakte,
      woningtype,
      postcode,
    });

    return NextResponse.json({
      mock: false,
      data: {
        woonoppervlakte,
        bouwjaar,
        woningtype,
        wozWaarde: valuation.estimatedWozValue,
        estimatedValueLow: valuation.estimatedValueLow,
        estimatedValueMid: valuation.estimatedValueMid,
        estimatedValueHigh: valuation.estimatedValueHigh,
        valuationPricePerM2: valuation.pricePerM2,
        valuationConfidence: valuation.confidence,
        valuationSource: 'kadaster_bag_v2',
        valuationModelVersion: 'simple_valuation_v1',
      },
      raw: json,
    });
  } catch (error) {
    return NextResponse.json({
      mock: true,
      warning: 'Netwerkfout, fallback gebruikt',
      data: buildFallbackData(postcode, huisnummer),
    });
  }
}