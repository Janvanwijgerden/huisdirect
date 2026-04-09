import { NextResponse } from 'next/server';

type BagLink = {
  href?: string;
};

type BagAddress = {
  openbareRuimteNaam?: string;
  openbareruimteNaam?: string;
  straat?: string;
  huisnummer?: number | string;
  huisletter?: string;
  huisnummertoevoeging?: string;
  postcode?: string;
  woonplaatsNaam?: string;
  woonplaats?: string;
  nummeraanduidingIdentificatie?: string;
  adresseerbaarObjectIdentificatie?: string;
  pandIdentificaties?: string[];
  adresseerbaarObject?: {
    identificatie?: string;
  };
  _links?: {
    self?: BagLink;
    nummeraanduiding?: BagLink;
    adresseerbaarObject?: BagLink;
    panden?: BagLink[];
  };
};

type BagVerblijfsobjectWrapped = {
  verblijfsobject?: {
    identificatie?: string;
    oppervlakte?: number | string;
    gebruiksdoelen?: string[];
    status?: string;
    geometrie?: {
      type?: string;
      coordinates?: unknown;
    };
    _links?: {
      self?: BagLink;
      maaktDeelUitVan?: BagLink[];
      panden?: BagLink[];
    };
  };
};

type BagPandWrapped = {
  pand?: {
    identificatie?: string;
    oorspronkelijkBouwjaar?: number | string;
    oppervlakte?: number | string;
    status?: string;
    geometrie?: {
      type?: string;
      coordinates?: unknown;
    };
    _links?: {
      self?: BagLink;
    };
  };
};

const BAG_API_BASE =
  'https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2';

function normalizePostcode(input: string | null): string {
  return String(input || '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

function normalizeHouseNumber(input: string | null): string {
  return String(input || '').trim();
}

function normalizeHouseNumberAddition(input: string | null): string {
  return String(input || '')
    .trim()
    .toUpperCase();
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed;
}

function normalizePropertyType(input?: string[] | null): string | null {
  const joined = Array.isArray(input) ? input.join(' ').toLowerCase() : '';

  if (!joined) return null;
  if (joined.includes('woonfunctie')) return 'eengezinswoning';
  if (joined.includes('logiesfunctie')) return 'appartement';

  return null;
}

async function fetchJson(url: string, apiKey: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
      Accept: 'application/hal+json',
      'Accept-Crs': 'epsg:28992',
    },
    cache: 'no-store',
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`BAG request failed (${response.status}): ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('BAG response was not valid JSON.');
  }
}

function pickFirstAddress(json: any): BagAddress | null {
  const embedded = json?._embedded;

  const candidates =
    embedded?.adressen ||
    embedded?.nummeraanduidingen ||
    embedded?.adresseerbareObjecten ||
    [];

  if (Array.isArray(candidates) && candidates.length > 0) {
    return candidates[0] as BagAddress;
  }

  if (candidates && typeof candidates === 'object') {
    return candidates as BagAddress;
  }

  return null;
}

function getStreetFromAddress(address: BagAddress | null) {
  if (!address) return null;

  return (
    String(
      address.openbareRuimteNaam ||
        address.openbareruimteNaam ||
        address.straat ||
        ''
    ).trim() || null
  );
}

function getCityFromAddress(address: BagAddress | null) {
  if (!address) return null;

  return (
    String(address.woonplaatsNaam || address.woonplaats || '').trim() || null
  );
}

function buildSimpleValuation({
  livingArea,
  propertyType,
  postcode,
}: {
  livingArea: number;
  propertyType: string;
  postcode?: string | null;
}) {
  const normalizedPostcode = String(postcode || '')
    .replace(/\s+/g, '')
    .toUpperCase();

  let pricePerM2 = 3600;

  if (normalizedPostcode.startsWith('10') || normalizedPostcode.startsWith('11')) {
    pricePerM2 = 5200;
  } else if (normalizedPostcode.startsWith('25')) {
    pricePerM2 = 4700;
  } else if (normalizedPostcode.startsWith('30')) {
    pricePerM2 = 4300;
  } else if (
    normalizedPostcode.startsWith('33') ||
    normalizedPostcode.startsWith('42')
  ) {
    pricePerM2 = 3700;
  }

  if (propertyType === 'vrijstaand') pricePerM2 += 450;
  if (propertyType === 'appartement') pricePerM2 -= 150;
  if (propertyType === 'tussenwoning') pricePerM2 -= 50;
  if (propertyType === 'hoekwoning') pricePerM2 += 75;
  if (propertyType === 'twee-onder-een-kap') pricePerM2 += 200;

  const estimatedValueMid = Math.round(livingArea * pricePerM2);
  const estimatedValueLow = Math.round(estimatedValueMid * 0.94);
  const estimatedValueHigh = Math.round(estimatedValueMid * 1.06);
  const wozWaarde = Math.round(estimatedValueMid * 0.9);

  return {
    wozWaarde,
    estimatedValueLow,
    estimatedValueMid,
    estimatedValueHigh,
    valuationPricePerM2: pricePerM2,
    valuationConfidence: 62,
    valuationSource: 'simple_valuation_v1',
    valuationModelVersion: 'simple_valuation_v1',
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const postcode = normalizePostcode(searchParams.get('postcode'));
  const huisnummer = normalizeHouseNumber(searchParams.get('huisnummer'));
  const huisnummertoevoeging = normalizeHouseNumberAddition(
    searchParams.get('huisnummertoevoeging') ||
      searchParams.get('house_number_addition')
  );

  if (!postcode || !huisnummer) {
    return NextResponse.json(
      {
        error: 'Postcode en huisnummer zijn verplicht.',
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.BAG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'BAG_API_KEY ontbreekt in de server environment.',
      },
      { status: 500 }
    );
  }

  try {
    const addressUrl = new URL(`${BAG_API_BASE}/adressen`);
    addressUrl.searchParams.set('postcode', postcode);
    addressUrl.searchParams.set('huisnummer', huisnummer);

    if (huisnummertoevoeging) {
      addressUrl.searchParams.set('huisnummertoevoeging', huisnummertoevoeging);
    }

    const addressJson = await fetchJson(addressUrl.toString(), apiKey);
    const address = pickFirstAddress(addressJson);

    if (!address) {
      return NextResponse.json(
        {
          error: 'Adres niet gevonden in BAG.',
        },
        { status: 404 }
      );
    }

    const street = getStreetFromAddress(address);
    const city = getCityFromAddress(address);
    const houseNumber = String(address.huisnummer || huisnummer).trim() || null;
    const houseLetter = String(address.huisletter || '').trim() || null;
    const houseNumberAddition =
      String(address.huisnummertoevoeging || huisnummertoevoeging || '').trim() ||
      null;

    const bagObjectId =
      address.adresseerbaarObjectIdentificatie ||
      address.adresseerbaarObject?.identificatie ||
      null;

    let objectByIdJson: BagVerblijfsobjectWrapped | null = null;
    let pandByIdJson: BagPandWrapped | null = null;
    let derivedPandId: string | null =
      address.pandIdentificaties?.[0] || null;

    if (bagObjectId) {
      objectByIdJson = (await fetchJson(
        `${BAG_API_BASE}/verblijfsobjecten/${bagObjectId}`,
        apiKey
      )) as BagVerblijfsobjectWrapped;

      derivedPandId =
        objectByIdJson?.verblijfsobject?._links?.maaktDeelUitVan?.[0]?.href
          ?.split('/')
          .pop() ||
        objectByIdJson?.verblijfsobject?._links?.panden?.[0]?.href
          ?.split('/')
          .pop() ||
        derivedPandId;
    }

    if (derivedPandId) {
      pandByIdJson = (await fetchJson(
        `${BAG_API_BASE}/panden/${derivedPandId}`,
        apiKey
      )) as BagPandWrapped;
    }

    const objectData = objectByIdJson?.verblijfsobject || null;
    const pandData = pandByIdJson?.pand || null;

    const livingArea = normalizeNumber(objectData?.oppervlakte) || null;
    const yearBuilt = normalizeNumber(pandData?.oorspronkelijkBouwjaar) || null;
    const plotSize = normalizeNumber(pandData?.oppervlakte) || null;
    const propertyType = normalizePropertyType(objectData?.gebruiksdoelen || null);

    const valuation =
      livingArea && propertyType
        ? buildSimpleValuation({
            livingArea,
            propertyType,
            postcode,
          })
        : {
            wozWaarde: null,
            estimatedValueLow: null,
            estimatedValueMid: null,
            estimatedValueHigh: null,
            valuationPricePerM2: null,
            valuationConfidence: null,
            valuationSource: null,
            valuationModelVersion: null,
          };

    return NextResponse.json({
      success: true,
      source: 'kadaster_bag_v2',
      data: {
        street,
        city,
        postal_code: postcode,
        house_number: houseNumber,
        house_letter: houseLetter,
        house_number_addition: houseNumberAddition,
        latitude: null,
        longitude: null,
        living_area: livingArea,
        plot_size: plotSize,
        year_built: yearBuilt,
        property_type: propertyType,
        bag_address_id: address.nummeraanduidingIdentificatie || null,
        bag_object_id: bagObjectId,
        bag_pand_id: derivedPandId,

        wozWaarde: valuation.wozWaarde,
        estimatedValueLow: valuation.estimatedValueLow,
        estimatedValueMid: valuation.estimatedValueMid,
        estimatedValueHigh: valuation.estimatedValueHigh,
        valuationPricePerM2: valuation.valuationPricePerM2,
        valuationConfidence: valuation.valuationConfidence,
        valuationSource: valuation.valuationSource,
        valuationModelVersion: valuation.valuationModelVersion,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'BAG lookup mislukt.',
        details: error instanceof Error ? error.message : 'Onbekende fout.',
      },
      { status: 500 }
    );
  }
}