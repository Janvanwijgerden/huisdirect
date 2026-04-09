import { NextResponse } from "next/server";
import OpenAI from "openai";

function normalizePropertyType(value?: string | null) {
  if (!value) return "woning";

  switch (value) {
    case "eengezinswoning":
      return "eengezinswoning";
    case "appartement":
      return "appartement";
    case "vrijstaande_woning":
      return "vrijstaande woning";
    case "twee_onder_een_kap":
      return "twee-onder-een-kapwoning";
    case "hoekwoning":
      return "hoekwoning";
    case "tussenwoning":
      return "tussenwoning";
    case "bungalow":
      return "bungalow";
    default:
      return value.replaceAll("_", " ").toLowerCase();
  }
}

function buildFeatureHints({
  livingArea,
  bedrooms,
  energyLabel,
  yearBuilt,
  plotSize,
}: {
  livingArea?: string | number | null;
  bedrooms?: string | number | null;
  energyLabel?: string | null;
  yearBuilt?: string | number | null;
  plotSize?: string | number | null;
}) {
  const hints: string[] = [];

  const livingAreaNumber = Number(livingArea);
  const bedroomsNumber = Number(bedrooms);
  const yearBuiltNumber = Number(yearBuilt);
  const plotSizeNumber = Number(plotSize);
  const energy = String(energyLabel || "").trim().toUpperCase();

  if (Number.isFinite(livingAreaNumber)) {
    if (livingAreaNumber >= 140) {
      hints.push("benadruk de royale leefruimte");
    } else if (livingAreaNumber >= 100) {
      hints.push("benadruk de prettige gebruiksruimte");
    } else if (livingAreaNumber > 0) {
      hints.push("benadruk de efficiënte en praktische indeling");
    }
  }

  if (Number.isFinite(bedroomsNumber)) {
    if (bedroomsNumber >= 4) {
      hints.push("benadruk de geschiktheid voor gezinnen of thuiswerken");
    } else if (bedroomsNumber === 3) {
      hints.push("benadruk de fijne balans tussen wooncomfort en praktische indeling");
    } else if (bedroomsNumber > 0) {
      hints.push("benadruk het comfortabele woonkarakter");
    }
  }

  if (energy) {
    if (energy.startsWith("A")) {
      hints.push("benadruk duurzaamheid, comfort en toekomstbestendig wonen");
    } else if (["B", "C"].includes(energy)) {
      hints.push("benadruk aangenaam wooncomfort");
    }
  }

  if (Number.isFinite(plotSizeNumber)) {
    if (plotSizeNumber >= 500) {
      hints.push("benadruk de ruime buitenruimte en vrijheid rondom de woning");
    } else if (plotSizeNumber >= 250) {
      hints.push("benadruk de prettige buitenruimte");
    } else if (plotSizeNumber > 0) {
      hints.push("benadruk dat er een fijne buitenplek aanwezig is");
    }
  }

  if (Number.isFinite(yearBuiltNumber)) {
    if (yearBuiltNumber >= 2005) {
      hints.push("benadruk het moderne wooncomfort");
    } else if (yearBuiltNumber >= 1990) {
      hints.push("benadruk de degelijke basis en het comfortabele karakter");
    } else if (yearBuiltNumber > 0) {
      hints.push("schrijf met gevoel voor karakter, maar zonder veroudering te benoemen");
    }
  }

  return hints;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      propertyType,
      city,
      livingArea,
      bedrooms,
      energyLabel,
      yearBuilt,
      plotSize,
    } = body;

    const normalizedPropertyType = normalizePropertyType(propertyType);
    const cityLabel = String(city || "").trim() || "de omgeving";
    const livingAreaLabel = livingArea ? `${livingArea} m²` : "onbekend";
    const bedroomsLabel = bedrooms ? String(bedrooms) : "onbekend";
    const energyLabelText = String(energyLabel || "").trim() || "onbekend";
    const yearBuiltText = yearBuilt ? String(yearBuilt) : "onbekend";
    const plotSizeText = plotSize ? `${plotSize} m²` : "onbekend";

    const featureHints = buildFeatureHints({
      livingArea,
      bedrooms,
      energyLabel,
      yearBuilt,
      plotSize,
    });

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Je bent een sterke Nederlandse woningcopywriter op Funda-niveau.

Je schrijft woningomschrijvingen die voelen als:
- professioneel
- aantrekkelijk
- geloofwaardig
- verkoopgericht
- prettig leesbaar
- niet overdreven

DOEL:
Schrijf een woningomschrijving die de sterke kanten van de woning benadrukt en aantrekkelijk maakt voor potentiële kopers.

BESCHIKBARE GEGEVENS:
- Type woning: ${normalizedPropertyType}
- Plaats: ${cityLabel}
- Woonoppervlakte: ${livingAreaLabel}
- Aantal kamers: ${bedroomsLabel}
- Bouwjaar: ${yearBuiltText}
- Energielabel: ${energyLabelText}
- Perceeloppervlakte: ${plotSizeText}

EXTRA SCHRIJFACCENTEN:
${featureHints.length > 0 ? featureHints.map((hint) => `- ${hint}`).join("\n") : "- benadruk comfort, ruimte en woonkwaliteit"}

STIJLREGELS:
- Schrijf in correct, vloeiend Nederlands
- Schrijf alsof de woning op een professioneel woningplatform komt te staan
- Gebruik natuurlijke variatie in zinsbouw
- Vermijd clichés en herhaling
- Vermijd steeds dezelfde openingszin
- Gebruik geen opsommingstekens
- Gebruik 3 tot 5 korte alinea's
- Schrijf warm, professioneel en aantrekkelijk
- Benoem alleen pluspunten en verkoopbare kwaliteiten
- Noem geen onzekerheden, tekortkomingen of ontbrekende informatie
- Als informatie ontbreekt, schrijf daar dan soepel omheen in plaats van het te benoemen
- Laat de tekst uniek aanvoelen, niet als een standaard template

INHOUD:
- Start met een sterke, aantrekkelijke openingsalinea
- Werk daarna ruimte, indeling en woongevoel uit
- Benoem buitenruimte wanneer perceel relevant is
- Benoem comfort/duurzaamheid subtiel wanneer energielabel of bouwjaar daar aanleiding toe geven
- Sluit af met een korte, positieve eindsamenvatting

LENGTE:
- ongeveer 130 tot 190 woorden

BELANGRIJK:
- Geen kopjes
- Geen bullets
- Geen uitleg buiten de woningtekst
- Alleen de definitieve woningomschrijving
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: prompt,
    });

    const text = (response.output_text || "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI gaf geen omschrijving terug." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI generatie mislukt" },
      { status: 500 }
    );
  }
}