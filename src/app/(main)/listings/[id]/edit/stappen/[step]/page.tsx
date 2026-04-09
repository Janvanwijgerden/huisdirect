import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../../../lib/supabase/server";
import { getListingWithImages } from "../../../../../../../lib/actions/listings";

type StepKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type StepStatus = Record<StepKey, boolean>;
type ListingWithImages = Awaited<ReturnType<typeof getListingWithImages>>;

const PROPERTY_TYPE_OPTIONS = [
  { value: "appartement", label: "Appartement" },
  { value: "tussenwoning", label: "Tussenwoning" },
  { value: "hoekwoning", label: "Hoekwoning" },
  { value: "2-onder-1-kap", label: "2-onder-1-kap" },
  { value: "vrijstaand", label: "Vrijstaand" },
  { value: "bungalow", label: "Bungalow" },
  { value: "woonboerderij", label: "Woonboerderij" },
];

const ENERGY_LABEL_OPTIONS = [
  "A++++",
  "A+++",
  "A++",
  "A+",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
];

const stepContent: Record<
  string,
  {
    title: string;
    intro: string;
    blocks: { title: string; items: string[] }[];
  }
> = {
  "1": {
    title: "Zet uw huis op de foto",
    intro:
      "Goede foto’s bepalen voor een groot deel of iemand op jouw woning klikt. Voor de meeste woningen is een sterke basis al genoeg: goede foto’s, een nette plattegrond en een opgeruimd huis.",
    blocks: [
      {
        title: "Voor de meeste woningen is dit voldoende",
        items: [
          "Goede woningfoto’s",
          "Een duidelijke plattegrond",
          "Een opgeruimde woning",
          "Een sterke hoofdfoto",
        ],
      },
      {
        title: "Praktische tips",
        items: [
          "Kies bij voorkeur een fotograaf uit de regio om kosten te besparen",
          "Maak foto’s overdag met veel licht",
          "Ruim de woning goed op voordat de foto’s gemaakt worden",
          "Begin met buitenkant, woonkamer, keuken en tuin",
          "Voeg minimaal 5 goede foto’s toe",
        ],
      },
      {
        title: "Extra opties",
        items: [
          "Video kan sfeer toevoegen, maar is niet verplicht",
          "Drone is vooral interessant bij vrijstaande of landelijke woningen",
          "360 graden beelden zijn een extraatje, geen must",
          "Plattegronden geven veel duidelijkheid en zijn sterk aan te raden",
        ],
      },
    ],
  },
  "2": {
    title: "Waardebepaling",
    intro:
      "Een goede vraagprijs is belangrijk. Te hoog schrikt kopers af, te laag kost geld. Gebruik een eerste indicatie als startpunt en bepaal daarna een realistische vraagprijs.",
    blocks: [
      {
        title: "Waar kijken kopers en verkopers meestal naar?",
        items: [
          "Woonoppervlakte",
          "Type woning",
          "Bouwjaar",
          "Ligging",
          "WOZ-waarde",
          "Vergelijkbare woningen in de buurt",
        ],
      },
      {
        title: "Praktische richtlijn",
        items: [
          "Gebruik een waarde-indicatie als startpunt, niet als absolute waarheid",
          "Kijk naar vergelijkbare woningen die recent verkocht zijn",
          "Twijfel je? Kies liever realistisch dan te ambitieus",
        ],
      },
    ],
  },
  "3": {
    title: "Documentatie verzamelen",
    intro:
      "Hoe beter je documenten op orde zijn, hoe professioneler je woning overkomt en hoe meer vertrouwen je wekt bij serieuze kopers. Door dit vroeg goed te regelen, voorkom je later onrust, losse vragen en onnodig heen en weer sturen.",
    blocks: [
      {
        title: "Essentiële documenten",
        items: [
          "Energielabel – laat zien hoe energiezuinig de woning is en hoort bij een professionele presentatie",
          "Plattegrond – geeft direct overzicht van de indeling en helpt kopers sneller beoordelen of de woning past",
          "Vragenlijst woning – geeft duidelijkheid over de staat van de woning en bekende bijzonderheden",
          "Lijst van zaken – maakt helder wat achterblijft en wat wordt meegenomen",
          "VvE-stukken bij een appartement – denk aan servicekosten, reserves, notulen en relevante afspraken",
        ],
      },
      {
        title: "Documenten die extra vertrouwen geven",
        items: [
          "Facturen of bewijs van recente verbeteringen, zoals keuken, badkamer, dak of kozijnen",
          "Informatie over isolatie, zonnepanelen of andere energiebesparende maatregelen",
          "Onderhoudshistorie of bewijs van goed uitgevoerde reparaties",
          "Gegevens over verbouwingen, uitbouwen of andere aanpassingen aan de woning",
          "Handige extra informatie over erfpacht, perceel, schuur, garage of bijzondere voorzieningen",
        ],
      },
      {
        title: "Slimme voorbereiding",
        items: [
          "Begin met de documenten die essentieel of verplicht zijn",
          "Sla alles digitaal op in duidelijke bestandsnamen, zodat je later snel kunt delen",
          "Zorg dat je documenten zoveel mogelijk klaar hebt voordat je live gaat of bezichtigingen plant",
          "Werk netjes en volledig: een goed voorbereide verkoper wekt meer vertrouwen",
        ],
      },
    ],
  },
  "4": {
    title: "Zet uw woning online",
    intro:
      "Nu komt alles samen. Als uw woning er professioneel uitziet en de informatie klopt, kunt u live gaan. Deze stap is uw laatste controle voordat kopers uw advertentie gaan zien.",
    blocks: [
      {
        title: "Laatste controle voor publicatie",
        items: [
          "Titel klopt en voelt duidelijk",
          "Vraagprijs is ingevuld",
          "Omschrijving is aantrekkelijk en compleet",
          "Foto’s zijn toegevoegd en de hoofdfoto is sterk",
          "Belangrijkste kenmerken zijn ingevuld",
          "Adres en locatie kloppen",
          "Energielabel staat goed ingevuld",
        ],
      },
      {
        title: "Wat kopers als eerste zien",
        items: [
          "De hoofdfoto",
          "De vraagprijs",
          "De titel van de woning",
          "De eerste indruk van de omschrijving",
        ],
      },
    ],
  },
  "5": {
    title: "Plan kijkdagen",
    intro:
      "Met duidelijke kijkmomenten houdt u controle en voorkomt u losse chaos. Dat geeft rust voor u én duidelijkheid voor kopers.",
    blocks: [
      {
        title: "Waarom vaste kijkmomenten slim zijn",
        items: [
          "Minder losse appjes en telefoontjes",
          "Meer overzicht in uw planning",
          "U hoeft de woning niet telkens opnieuw klaar te maken",
          "Het voelt professioneler voor geïnteresseerden",
        ],
      },
      {
        title: "Praktische aanpak",
        items: [
          "Werk met vaste blokken",
          "Houd tijd tussen afspraken",
          "Plan niet te veel bezichtigingen direct achter elkaar",
          "Kies dagdelen die logisch zijn voor uw agenda en doelgroep",
        ],
      },
    ],
  },
  "6": {
    title: "Stel biedingsdeadline in",
    intro:
      "Een duidelijke deadline zorgt voor rust, overzicht en eerlijkheid richting geïnteresseerden. U houdt grip op het proces en voorkomt eindeloos heen en weer.",
    blocks: [
      {
        title: "Waarom dit slim is",
        items: [
          "U houdt controle over het proces",
          "Kopers weten waar ze aan toe zijn",
          "Iedereen krijgt dezelfde kans",
          "U voorkomt onnodige onderhandel-chaos",
        ],
      },
      {
        title: "Zo pakt u het netjes aan",
        items: [
          "Communiceer datum en tijd helder",
          "Geef iedereen dezelfde informatie",
          "Bepaal vooraf hoe u biedingen vergelijkt",
          "Maak alleen uitzonderingen als daar een goede reden voor is",
        ],
      },
    ],
  },
  "7": {
    title: "Accepteer bod",
    intro:
      "Een goed bod is niet alleen het hoogste bod. Kijk ook naar voorwaarden, zekerheid en planning. Deze stap draait om slim kiezen, niet alleen om het hoogste bedrag.",
    blocks: [
      {
        title: "Waar u op let",
        items: [
          "Hoogte van het bod",
          "Financieringsvoorbehoud",
          "Eventuele bouwkundige voorbehouden",
          "Gewenste opleverdatum",
          "Zekerheid en snelheid van de koper",
        ],
      },
      {
        title: "Denk in totaalplaatje",
        items: [
          "Het hoogste bod is niet altijd het beste bod",
          "Meer zekerheid kan uiteindelijk waardevoller zijn",
          "Een goede planning kan veel rust geven",
        ],
      },
    ],
  },
  "8": {
    title: "Overdracht bij notaris",
    intro:
      "De laatste stap van het verkoopproces. Hier wordt alles officieel afgerond. Met een goede voorbereiding verloopt dit rustig, duidelijk en professioneel.",
    blocks: [
      {
        title: "Wat gebeurt er in deze fase",
        items: [
          "Koopovereenkomst vastleggen",
          "Notaris kiezen of afstemmen",
          "Stukken controleren",
          "Definitieve overdracht plannen en afronden",
        ],
      },
      {
        title: "Waar u op let",
        items: [
          "Gegevens en afspraken kloppen",
          "Documenten zijn compleet",
          "Oplevering is goed afgestemd",
          "Alle betrokken partijen weten wat er verwacht wordt",
        ],
      },
    ],
  },
};

const stepLabels: Record<StepKey, string> = {
  "1": "Zet uw huis op de foto",
  "2": "Waardebepaling",
  "3": "Documentatie verzamelen",
  "4": "Zet uw woning online",
  "5": "Plan kijkdagen",
  "6": "Stel biedingsdeadline in",
  "7": "Accepteer bod",
  "8": "Overdracht bij notaris",
};

function getStepStatus(listing: any, imageCount: number): StepStatus {
  const hasBasicDetails =
    Boolean(listing.property_type) &&
    Boolean(listing.living_area) &&
    Boolean(listing.year_built);

  const hasEnergyLabel = Boolean(listing.energy_label);

  return {
    "1": imageCount >= 5,
    "2": Boolean(listing.asking_price),
    "3": hasBasicDetails && hasEnergyLabel,
    "4": listing.status === "active",
    "5": false,
    "6": false,
    "7": false,
    "8": false,
  };
}

function formatPrice(value: number | null | undefined) {
  if (!value) return "Nog niet ingevuld";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getFilledValue(value: unknown, fallback: string) {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getStep4Prompt(listing: any) {
  const typeWoning = getFilledValue(listing.property_type, "[type woning]");
  const plaats = getFilledValue(listing.city, "[plaats]");
  const woonoppervlakte = getFilledValue(
    listing.living_area,
    "[woonoppervlakte in m²]"
  );
  const kamers = getFilledValue(listing.bedrooms, "[aantal kamers]");
  const bouwjaar = getFilledValue(listing.year_built, "[bouwjaar]");
  const straat = getFilledValue(listing.street, "[straat]");
  const huisnummer = getFilledValue(listing.house_number, "[huisnummer]");
  const energielabel = getFilledValue(listing.energy_label, "[energielabel]");

  const kenmerken = [
    listing.plot_size ? `${listing.plot_size} m² perceel` : null,
    listing.description ? listing.description.trim() : null,
  ]
    .filter(Boolean)
    .join(", ");

  const belangrijksteKenmerken =
    kenmerken && kenmerken.trim() !== ""
      ? kenmerken
      : "[belangrijkste kenmerken, bijvoorbeeld tuin, moderne keuken, rustige ligging, veel licht]";

  return `Schrijf een aantrekkelijke woningomschrijving voor een huis met de volgende kenmerken:

- Type woning: ${typeWoning}
- Plaats: ${plaats}
- Straat en huisnummer: ${straat} ${huisnummer}
- Woonoppervlakte: ${woonoppervlakte}
- Aantal kamers: ${kamers}
- Bouwjaar: ${bouwjaar}
- Energielabel: ${energielabel}
- Belangrijkste kenmerken: ${belangrijksteKenmerken}

Schrijf in een professionele, makelaar-achtige stijl.
Maak de tekst aantrekkelijk, maar niet overdreven.
Gebruik vloeiende zinnen en benadruk de leefervaring.
Houd de tekst duidelijk, betrouwbaar en geschikt voor een woningadvertentie.`;
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        <div className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span className="text-sm text-stone-400">Open</span>
        </div>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default async function EditStepPage({
  params,
}: {
  params: { id: string; step: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let listing: ListingWithImages;
  try {
    listing = await getListingWithImages(params.id);
  } catch {
    notFound();
  }

  if (listing.user_id !== user.id) {
    redirect("/dashboard");
  }

  const content = stepContent[params.step];
  if (!content) notFound();

  const imageCount = listing.images?.length ?? 0;
  const stepStatus = getStepStatus(listing, imageCount);
  const isStep2 = params.step === "2";
  const isStep3 = params.step === "3";
  const isStep4 = params.step === "4";
  const isStep5 = params.step === "5";
  const isStep6 = params.step === "6";
  const isStep7 = params.step === "7";
  const isStep8 = params.step === "8";
  const step4Prompt = getStep4Prompt(listing);

  async function updateAskingPrice(formData: FormData) {
    "use server";

    const rawPrice = formData.get("asking_price");
    const parsedPrice =
      typeof rawPrice === "string" && rawPrice.trim() !== ""
        ? Number(rawPrice)
        : null;

    if (parsedPrice !== null && !Number.isFinite(parsedPrice)) {
      return;
    }

    const supabase = await createClient();

    const {
      data: { user: actionUser },
    } = await supabase.auth.getUser();

    if (!actionUser) redirect("/auth/login");

    await supabase
      .from("listings")
      .update({ asking_price: parsedPrice })
      .eq("id", listing.id)
      .eq("user_id", actionUser.id);

    revalidatePath(`/listings/${listing.id}/edit/stappen/2`);
    revalidatePath(`/listings/${listing.id}/edit`);
  }

  async function updateStep3Details(formData: FormData) {
    "use server";

    const propertyTypeRaw = formData.get("property_type");
    const livingAreaRaw = formData.get("living_area");
    const yearBuiltRaw = formData.get("year_built");
    const energyLabelRaw = formData.get("energy_label");

    const propertyType =
      typeof propertyTypeRaw === "string" && propertyTypeRaw.trim() !== ""
        ? propertyTypeRaw.trim()
        : null;

    const livingArea =
      typeof livingAreaRaw === "string" && livingAreaRaw.trim() !== ""
        ? Number(livingAreaRaw)
        : null;

    const yearBuilt =
      typeof yearBuiltRaw === "string" && yearBuiltRaw.trim() !== ""
        ? Number(yearBuiltRaw)
        : null;

    const energyLabel =
      typeof energyLabelRaw === "string" && energyLabelRaw.trim() !== ""
        ? energyLabelRaw.trim()
        : null;

    if (livingArea !== null && !Number.isFinite(livingArea)) {
      return;
    }

    if (yearBuilt !== null && !Number.isFinite(yearBuilt)) {
      return;
    }

    const supabase = await createClient();

    const {
      data: { user: actionUser },
    } = await supabase.auth.getUser();

    if (!actionUser) redirect("/auth/login");

    await supabase
      .from("listings")
      .update({
        property_type: propertyType,
        living_area: livingArea,
        year_built: yearBuilt,
        energy_label: energyLabel,
      })
      .eq("id", listing.id)
      .eq("user_id", actionUser.id);

    revalidatePath(`/listings/${listing.id}/edit/stappen/3`);
    revalidatePath(`/listings/${listing.id}/edit`);
    revalidatePath(`/listings/${listing.id}`);
  }

  return (
    <main className="min-h-screen bg-stone-100 py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">{content.title}</h1>
            <p className="mt-1 text-sm text-stone-500">
              Begeleiding bij het verkopen van je woning
            </p>
          </div>

          <a
            href={`/listings/${listing.id}/edit`}
            className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Terug naar advertentie
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <div className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-stone-900">
                Stappenplan
              </h3>

              <ul className="space-y-2 text-sm">
                {Object.entries(stepLabels).map(([key, label]) => {
                  const stepKey = key as StepKey;

                  return (
                    <li key={key}>
                      <a
                        href={`/listings/${listing.id}/edit/stappen/${key}`}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                          params.step === key
                            ? "bg-emerald-50 font-medium text-emerald-700"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="mr-2 flex h-5 w-5 items-center justify-center">
                            {stepStatus[stepKey] ? (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-emerald-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 111.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            ) : null}
                          </span>

                          <span>
                            {key}. {label}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <p className="text-base leading-8 text-stone-700">{content.intro}</p>
            </div>

            {isStep2 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <h2 className="text-xl font-semibold text-stone-900">
                        Snelle indicatie
                      </h2>
                      <p className="mt-3 leading-7 text-stone-700">
                        Gebruik een eerste waardeschatting als richting, niet als
                        absolute waarheid. Deze stap is bedoeld om gevoel te krijgen
                        bij een realistische vraagprijs.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 lg:min-w-[260px]">
                      <p className="text-sm font-medium text-emerald-900">
                        Huidige vraagprijs
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">
                        {formatPrice(listing.asking_price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-medium text-stone-900">
                      Belangrijk om te onthouden
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Een online indicatie is handig om te starten, maar de echte
                      marktwaarde hangt ook af van afwerking, ligging, onderhoud,
                      perceel, energielabel en hoe jouw woning zich verhoudt tot
                      recente verkopen in de buurt.
                    </p>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Bepaal uw vraagprijs
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Dit is het bedrag waarmee uw woning op de markt komt. Kies een
                    prijs die vertrouwen geeft en goed past bij vergelijkbare woningen.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Te hoog ingezet
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Minder bezichtigingen en meer kans dat kopers afhaken.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Realistisch geprijsd
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        Geeft vertrouwen en vergroot de kans op serieuze interesse.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Te laag ingezet
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Trekt snel aandacht, maar u kunt ook geld laten liggen.
                      </p>
                    </div>
                  </div>

                  <form action={updateAskingPrice} className="mt-8">
                    <label
                      htmlFor="asking_price"
                      className="block text-sm font-medium text-stone-900"
                    >
                      Vraagprijs invullen
                    </label>

                    <div className="mt-3 flex max-w-xl flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                          €
                        </span>
                        <input
                          id="asking_price"
                          name="asking_price"
                          type="number"
                          min="0"
                          step="1000"
                          defaultValue={listing.asking_price ?? ""}
                          placeholder="Bijvoorbeeld 395000"
                          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-9 pr-4 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Sla vraagprijs op
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-stone-500">
                      Tip: rond af op een logisch bedrag en kies liever realistisch
                      dan te ambitieus.
                    </p>
                  </form>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Meer zekerheid? Laat een taxateur langskomen
                  </h2>

                  <p className="mt-3 leading-7 text-stone-700">
                    Twijfelt u over de waarde van uw woning of wilt u extra zekerheid?
                    Dan is een taxateur een verstandige stap. Dat geeft een objectieve
                    waardebepaling en helpt bij het onderbouwen van uw prijs.
                  </p>

                  <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-medium text-stone-900">
                      Richtprijs taxatie
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Reken meestal op ongeveer € 500 tot € 1.000, afhankelijk van
                      woningtype, regio en aanbieder.
                    </p>
                  </div>
                </section>
              </>
            ) : isStep3 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <div className="max-w-3xl">
                    <h2 className="text-xl font-semibold text-stone-900">
                      Vul de belangrijkste woningkenmerken in
                    </h2>
                    <p className="mt-3 leading-7 text-stone-700">
                      Dit is een kernstap voor de kwaliteit van uw advertentie. Kopers
                      vergelijken direct op woningtype, woonoppervlakte, bouwjaar en
                      energielabel. Hoe completer dit staat, hoe sterker en
                      betrouwbaarder uw woning overkomt.
                    </p>
                  </div>

                  <form action={updateStep3Details} className="mt-8 space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="property_type"
                          className="block text-sm font-medium text-stone-900"
                        >
                          Woningtype
                        </label>
                        <select
                          id="property_type"
                          name="property_type"
                          defaultValue={listing.property_type ?? ""}
                          className="mt-3 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">Kies woningtype</option>
                          {PROPERTY_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-stone-500">
                          Dit helpt kopers uw woning sneller goed te plaatsen.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="energy_label"
                          className="block text-sm font-medium text-stone-900"
                        >
                          Energielabel
                        </label>
                        <select
                          id="energy_label"
                          name="energy_label"
                          defaultValue={listing.energy_label ?? ""}
                          className="mt-3 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">Kies energielabel</option>
                          {ENERGY_LABEL_OPTIONS.map((label) => (
                            <option key={label} value={label}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-stone-500">
                          Voor veel kopers is dit een directe filter in hun hoofd.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="living_area"
                          className="block text-sm font-medium text-stone-900"
                        >
                          Woonoppervlakte
                        </label>
                        <div className="relative mt-3">
                          <input
                            id="living_area"
                            name="living_area"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={listing.living_area ?? ""}
                            placeholder="Bijvoorbeeld 126"
                            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-14 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                            m²
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-stone-500">
                          Een van de belangrijkste vergelijkpunten voor kopers.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="year_built"
                          className="block text-sm font-medium text-stone-900"
                        >
                          Bouwjaar
                        </label>
                        <input
                          id="year_built"
                          name="year_built"
                          type="number"
                          min="1000"
                          max="2100"
                          step="1"
                          defaultValue={listing.year_built ?? ""}
                          placeholder="Bijvoorbeeld 1998"
                          className="mt-3 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                        <p className="mt-2 text-sm text-stone-500">
                          Geeft snel context over het type woning en verwachtingen.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <p className="text-sm font-medium text-emerald-900">
                        Waarom dit belangrijk is
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        Met deze vier gegevens staat de basis van uw woningpresentatie
                        direct veel sterker. Dit vergroot vertrouwen, maakt vergelijken
                        makkelijker en helpt later ook bij filters, waardebepaling en
                        automatische invulling.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Sla kenmerken op
                      </button>

                      <a
                        href={`/listings/${listing.id}/edit`}
                        className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Terug naar advertentie
                      </a>
                    </div>
                  </form>
                </section>
              </>
            ) : isStep4 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Controleer dit voordat u live gaat
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Dit is het moment waarop alles samenkomt. Neem nog één keer rustig
                    door of de advertentie professioneel, volledig en aantrekkelijk
                    overkomt.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Basiscontrole
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                        <li>• Titel klopt en is duidelijk</li>
                        <li>• Vraagprijs is ingevuld</li>
                        <li>• Belangrijkste kenmerken zijn compleet</li>
                        <li>• Adres en locatie kloppen</li>
                        <li>• Energielabel staat ingevuld</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Eerste indruk van kopers
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-800">
                        <li>• De hoofdfoto moet sterk zijn</li>
                        <li>• De prijs moet logisch voelen</li>
                        <li>• De titel moet direct duidelijk zijn</li>
                        <li>• De omschrijving moet vertrouwen geven</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Sterke woningomschrijving maken
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Een goede omschrijving doet meer dan alleen feiten opsommen. Het
                    helpt kopers voelen hoe het is om hier te wonen en vergroot de kans
                    op bezichtigingen.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Feiten
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Benoem type woning, woonoppervlakte, kamers en bouwjaar.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Sfeer
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Vertel wat de woning prettig maakt: licht, ruimte, tuin,
                        rustige ligging of moderne afwerking.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Vertrouwen
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Houd het aantrekkelijk, maar wel realistisch en geloofwaardig.
                      </p>
                    </div>
                  </div>
                </section>

                <Accordion title="Hulp nodig bij schrijven? Open voorbeeldprompt">
                  <p className="text-sm leading-6 text-stone-600">
                    Wat al bekend is uit uw advertentie is hieronder alvast ingevuld.
                    Wat nog ontbreekt, blijft open zodat u dat later kunt aanvullen.
                  </p>

                  <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-stone-700">
                      {step4Prompt}
                    </pre>
                  </div>
                </Accordion>
              </>
            ) : isStep5 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Waarom kijkdagen slim zijn
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Met vaste kijkmomenten houdt u overzicht, voorkomt u losse chaos en
                    komt u professioneler over. U hoeft de woning ook niet steeds
                    opnieuw klaar te maken.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Meer controle
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        U bepaalt wanneer bezichtigingen plaatsvinden.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Minder onrust
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Minder losse telefoontjes en minder heen en weer plannen.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Professioneler
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        Geïnteresseerden ervaren structuur en duidelijkheid.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Praktische aanpak
                  </h2>
                  <ul className="mt-6 space-y-3 text-stone-700">
                    <li>• Werk met vaste tijdsblokken</li>
                    <li>• Houd ruimte tussen afspraken voor lucht en reset</li>
                    <li>• Plan niet te veel bezichtigingen achter elkaar</li>
                    <li>• Kies dagdelen die logisch zijn voor uw doelgroep</li>
                    <li>• Zorg dat de woning licht, netjes en rustig is</li>
                  </ul>
                </section>

                <Accordion title="Bekijk voorbeeldschema’s">
                  <div className="space-y-5 text-sm text-stone-700">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <p className="font-semibold text-stone-900">
                        Compacte kijkdag
                      </p>
                      <div className="mt-3 space-y-1 font-mono text-sm">
                        <div>10:00 – 10:30</div>
                        <div>10:45 – 11:15</div>
                        <div>11:30 – 12:00</div>
                      </div>
                      <p className="mt-3 text-stone-600">
                        Handig als u meerdere bezichtigingen op één ochtend wilt
                        plannen, met 15 minuten tussenruimte.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <p className="font-semibold text-stone-900">
                        Rustigere planning
                      </p>
                      <div className="mt-3 space-y-1 font-mono text-sm">
                        <div>10:00 – 11:00</div>
                        <div>11:30 – 12:30</div>
                      </div>
                      <p className="mt-3 text-stone-600">
                        Fijn als u meer rust wilt en geïnteresseerden langer wilt laten
                        kijken.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <p className="font-semibold text-stone-900">
                        Avondschema
                      </p>
                      <div className="mt-3 space-y-1 font-mono text-sm">
                        <div>18:30 – 19:00</div>
                        <div>19:15 – 19:45</div>
                        <div>20:00 – 20:30</div>
                      </div>
                      <p className="mt-3 text-stone-600">
                        Praktisch voor kopers die overdag werken.
                      </p>
                    </div>
                  </div>
                </Accordion>
              </>
            ) : isStep6 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Waarom een biedingsdeadline slim is
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Een duidelijke deadline brengt rust in het proces. Kopers weten
                    waar ze aan toe zijn en u houdt grip op de timing en de vergelijking
                    van biedingen.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Rust
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        U voorkomt eindeloos heen en weer bellen.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Eerlijkheid
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Iedereen krijgt dezelfde informatie en dezelfde kans.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Controle
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        U kiest op uw moment, niet onder druk van losse berichten.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Zo pakt u het netjes aan
                  </h2>
                  <ul className="mt-6 space-y-3 text-stone-700">
                    <li>• Communiceer datum en tijd helder</li>
                    <li>• Geef iedereen dezelfde informatie</li>
                    <li>• Bepaal vooraf hoe u biedingen vergelijkt</li>
                    <li>• Kijk niet alleen naar prijs, maar ook naar voorwaarden</li>
                  </ul>
                </section>

                <Accordion title="Hoe werkt dit precies?">
                  <div className="space-y-3 text-sm leading-6 text-stone-600">
                    <p>
                      Een biedingsdeadline is vooral handig als er meerdere serieuze
                      geïnteresseerden zijn. U voorkomt hiermee losse onderhandeling per
                      persoon en houdt het proces overzichtelijk.
                    </p>
                    <p>
                      Het is verstandig om vooraf te bedenken welke factoren voor u het
                      belangrijkst zijn: hoogste prijs, meeste zekerheid, snelste
                      planning of een combinatie daarvan.
                    </p>
                  </div>
                </Accordion>
              </>
            ) : isStep7 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Kijk verder dan alleen het hoogste bedrag
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Een bod moet niet alleen goed voelen op papier, maar ook haalbaar en
                    betrouwbaar zijn. De beste keuze is vaak het bod dat prijs,
                    zekerheid en planning goed combineert.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Hoogste prijs
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Interessant, maar kijk altijd ook naar de voorwaarden.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Meeste zekerheid
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Minder risico op gedoe of afhaken later in het traject.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Beste planning
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        Een passende opleverdatum kan veel rust geven.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Waar u op moet letten
                  </h2>
                  <ul className="mt-6 space-y-3 text-stone-700">
                    <li>• Hoogte van het bod</li>
                    <li>• Financieringsvoorbehoud</li>
                    <li>• Eventuele bouwkundige voorbehouden</li>
                    <li>• Gewenste opleverdatum</li>
                    <li>• Zekerheid en snelheid van de koper</li>
                  </ul>
                </section>

                <Accordion title="Waar moet u op letten?">
                  <div className="space-y-3 text-sm leading-6 text-stone-600">
                    <p>
                      Een hoger bod met veel voorbehouden kan uiteindelijk minder sterk
                      zijn dan een iets lager bod met meer zekerheid.
                    </p>
                    <p>
                      Kijk daarom altijd naar het totaalplaatje. Dat voorkomt dat u zich
                      blindstaart op alleen het hoogste bedrag.
                    </p>
                  </div>
                </Accordion>
              </>
            ) : isStep8 ? (
              <>
                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Rustige afronding van het verkoopproces
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    In deze fase worden de afspraken officieel vastgelegd en werkt u toe
                    naar de overdracht bij de notaris. Met een goede voorbereiding
                    verloopt dit helder en professioneel.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-sm font-semibold text-stone-900">
                        Wat gebeurt er nu
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                        <li>• Koopovereenkomst voorbereiden</li>
                        <li>• Notaris afstemmen</li>
                        <li>• Stukken controleren</li>
                        <li>• Overdracht afronden</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-sm font-semibold text-emerald-900">
                        Waar u op let
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-800">
                        <li>• Gegevens en afspraken kloppen</li>
                        <li>• Documenten zijn compleet</li>
                        <li>• Oplevering is duidelijk afgestemd</li>
                        <li>• Iedereen weet wat er verwacht wordt</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Voorbeeld koopovereenkomst
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    Voor de verkoop heeft u een koopovereenkomst nodig. HuisDirect kan
                    hier later een slimme basis voor bieden, zodat u sneller kunt
                    werken. Zie dit als een hulpmiddel of model, niet als een definitief
                    juridisch einddocument zonder controle.
                  </p>

                  <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-medium text-stone-900">
                      Toekomstige stap binnen HuisDirect
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Later kunt u bij een gemarkeerde verkoop direct een voorbeeld
                      koopovereenkomst laten genereren op basis van de woninggegevens.
                      Die kunt u dan meenemen richting notaris als startpunt.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Download voorbeeld koopovereenkomst
                    </button>
                  </div>
                </section>

                <Accordion title="Wat gebeurt er bij de overdracht?">
                  <div className="space-y-3 text-sm leading-6 text-stone-600">
                    <p>
                      De notaris controleert de stukken, verwerkt de formele overdracht
                      en zorgt dat alles juridisch correct wordt afgerond.
                    </p>
                    <p>
                      Hoe beter u deze fase voorbereidt, hoe rustiger en soepeler de
                      afronding verloopt.
                    </p>
                  </div>
                </Accordion>
              </>
            ) : (
              content.blocks.map((block) => (
                <section
                  key={block.title}
                  className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-stone-900">
                    {block.title}
                  </h2>

                  <ul className="mt-4 space-y-3 text-stone-700">
                    {block.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>
              ))
            )}

            <div className="flex flex-wrap gap-4">
              <a
                href={`/listings/${listing.id}/edit`}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Terug naar advertentie
              </a>

              {params.step === "1" ? (
                <a
                  href={`/listings/${listing.id}/edit`}
                  className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Foto’s toevoegen
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}