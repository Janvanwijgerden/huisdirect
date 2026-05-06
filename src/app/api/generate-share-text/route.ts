import { NextResponse } from "next/server";
import { getOpenAIClient } from "../../../lib/chat/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      city,
      price,
      bedrooms,
      livingArea,
      propertyType,
      energyLabel,
      description,
      url,
    } = body;

    const client = getOpenAIClient();

    const prompt = `
Je bent een ervaren Nederlandse woningmarketeer én conversiespecialist.

Je schrijft deelteksten die ervoor zorgen dat mensen:
- klikken
- doorsturen
- reageren
- een bezichtiging aanvragen

Maak 5 losse deelteksten voor dezelfde woning:

1. whatsapp
2. linkedin
3. facebook
4. instagram
5. algemeen

Woninggegevens:
Titel: ${title || "Niet opgegeven"}
Plaats: ${city || "Niet opgegeven"}
Vraagprijs: ${price ? `€${price}` : "Niet opgegeven"}
Woningtype: ${propertyType || "Niet opgegeven"}
Slaapkamers/kamers: ${bedrooms || "Niet opgegeven"}
Woonoppervlakte: ${livingArea ? `${livingArea} m²` : "Niet opgegeven"}
Energielabel: ${energyLabel || "Niet opgegeven"}
Omschrijving: ${description || "Niet opgegeven"}
Link: ${url}

Schrijfstijl:

Gebruik een LICHT PERSOONLIJKE toon.

De eigenaar verkoopt de woning zelf. Dat persoonlijke gevoel is onderdeel van de kracht van HuisDirect. De teksten mogen dus voelen alsof ze door de eigenaar worden gedeeld, maar ze moeten ook geschikt blijven om door te sturen naar mensen die de eigenaar niet persoonlijk kent.

Gebruik waar passend:
- "Wij zetten onze woning te koop..."
- "Onze woning staat nu online..."
- "Misschien interessant voor iemand in je netwerk..."
- "Ken jij iemand die zoekt in ${city || "de regio"}?"

Vermijd:
- Te privé taal
- Te emotionele verhalen
- Te gladde makelaarstaal
- Overdreven verkooppraat
- Claims die niet uit de woningdata blijken

De tekst moet:
- echt voelen
- vertrouwen geven
- makkelijk deelbaar zijn
- niet klinken als een standaard advertentie

Platformregels:

WHATSAPP:
- Licht persoonlijk
- Kort en direct
- Moet makkelijk doorstuurbaar zijn
- Geschikt voor familieapps, buurtapps, werkapps, sportapps én bredere netwerken
- Gebruik liever "onze woning" dan "mijn huis"
- Eindig laagdrempelig, bijvoorbeeld met "Delen mag natuurlijk."

LINKEDIN:
- Licht persoonlijk maar professioneel
- Zakelijk, betrouwbaar en compact
- Niet schrijven alsof het alleen aan vrienden gericht is
- Focus op kwaliteit, locatie en het feit dat de woning nu online staat
- Mag iets netter en rustiger klinken

FACEBOOK:
- Meest persoonlijk van alle varianten
- Warm, lokaal en toegankelijk
- Mag "Ken jij iemand?" bevatten
- Gericht op delen, taggen of reageren

INSTAGRAM:
- Korter
- Caption-stijl
- Eerste zin moet aandacht trekken
- Geschikt bij woningfoto’s of story
- Licht persoonlijk, maar niet te lang

ALGEMEEN:
- Licht persoonlijk maar breed inzetbaar
- Geschikt voor elk kanaal
- Niet te zakelijk, niet te privé

Conversie optimalisatie regels:

- Begin ALTIJD met een sterke eerste zin
- De eerste zin moet nieuwsgierig maken of direct relevant zijn
- Vermijd zwakke openers zonder richting
- Geef maximaal 1 tot 2 sterke redenen om te klikken
- Niet alle kenmerken opsommen
- Laat details deels open om nieuwsgierigheid te houden
- Gebruik korte zinnen
- Maak het scanbaar
- Vermijd lange zinnen en lange opsommingen
- Geen emojis
- Geen nep urgentie
- Geen nep claims
- Niet liegen of dingen verzinnen
- Gebruik alleen de gegeven woningdata
- Altijd eindigen met de link

Geef ALLEEN geldige JSON terug in exact dit formaat:

{
  "whatsapp": "...",
  "linkedin": "...",
  "facebook": "...",
  "instagram": "...",
  "general": "..."
}
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: prompt,
      temperature: 0.75,
    });

    const rawText = response.output_text || "";

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json(
        { error: "AI gaf geen geldige JSON terug." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));

    return NextResponse.json({
      messages: {
        whatsapp: parsed.whatsapp || "",
        linkedin: parsed.linkedin || "",
        facebook: parsed.facebook || "",
        instagram: parsed.instagram || "",
        general: parsed.general || "",
      },
    });
  } catch (error) {
    console.error("Generate share text error:", error);

    return NextResponse.json(
      { error: "Kon geen deelteksten genereren." },
      { status: 500 }
    );
  }
}