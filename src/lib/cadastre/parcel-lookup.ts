// src/lib/cadastre/parcel-lookup.ts

export type ParcelLookupResult = {
  plotSize: number | null;
  parcelId: string | null;
  source: "pdok_brk_kadastrale_kaart_ogc_v1" | null;
  raw: unknown;
};

type PdokFeature = {
  id?: string;
  properties?: Record<string, unknown>;
};

type PdokResponse = {
  features?: PdokFeature[];
};

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function pickFirstNumber(
  props: Record<string, unknown>,
  keys: string[]
): number | null {
  for (const key of keys) {
    const value = normalizeNumber(props[key]);
    if (value !== null && value > 0) return value;
  }

  return null;
}

function pickFirstString(
  props: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = props[key];

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return null;
}

async function lookupParcelByBbox(
  bbox: string,
  bboxCrs: string
): Promise<ParcelLookupResult> {
  try {
    const url =
      "https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/collections/perceel/items" +
      `?bbox=${encodeURIComponent(bbox)}` +
      `&bbox-crs=${encodeURIComponent(bboxCrs)}` +
      `&limit=5`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/geo+json, application/json",
      },
    });

    if (!response.ok) {
      return {
        plotSize: null,
        parcelId: null,
        source: null,
        raw: {
          status: response.status,
          body: await response.text(),
          url,
        },
      };
    }

    const data = (await response.json()) as PdokResponse;
    const feature = data.features?.[0];

    if (!feature) {
      return {
        plotSize: null,
        parcelId: null,
        source: "pdok_brk_kadastrale_kaart_ogc_v1",
        raw: {
          url,
          data,
        },
      };
    }

    const props = feature.properties ?? {};

    const plotSize = pickFirstNumber(props, [
      "kadastraleGrootteWaarde",
      "kadastrale_grootte_waarde",
      "oppervlakte",
      "grootte",
      "size",
      "area",
    ]);

    const parcelId =
      pickFirstString(props, [
        "identificatieLokaalID",
        "identificatie",
        "lokaalID",
        "perceelnummer",
        "perceelNummer",
      ]) ??
      feature.id ??
      null;

    return {
      plotSize,
      parcelId,
      source: "pdok_brk_kadastrale_kaart_ogc_v1",
      raw: {
        url,
        feature,
      },
    };
  } catch (error) {
    return {
      plotSize: null,
      parcelId: null,
      source: null,
      raw: {
        error: error instanceof Error ? error.message : "Onbekende fout",
      },
    };
  }
}

export async function lookupParcelByRdCoordinates(
  rdX: number,
  rdY: number
): Promise<ParcelLookupResult> {
  const buffer = 40;

  const bbox = [
    rdX - buffer,
    rdY - buffer,
    rdX + buffer,
    rdY + buffer,
  ].join(",");

  return lookupParcelByBbox(
    bbox,
    "http://www.opengis.net/def/crs/EPSG/0/28992"
  );
}

export async function lookupParcelByCoordinates(
  lat: number,
  lng: number
): Promise<ParcelLookupResult> {
  const buffer = 0.00025;

  const bbox = [
    lng - buffer,
    lat - buffer,
    lng + buffer,
    lat + buffer,
  ].join(",");

  return lookupParcelByBbox(
    bbox,
    "http://www.opengis.net/def/crs/EPSG/0/4326"
  );
}