import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huis verkopen checklist | Alles wat u moet regelen | HuisDirect",
  description:
    "Uw huis verkopen? Gebruik deze complete checklist met alles wat u moet regelen voor, tijdens en na de verkoop van uw woning. Praktisch, duidelijk en met slimme begeleiding en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-checklist",
  },
  openGraph: {
    title: "Huis verkopen checklist | HuisDirect",
    description:
      "Een duidelijke checklist voor uw huis verkopen. Ontdek wat u moet regelen, in welke volgorde en hoe slimme begeleiding en AI het proces makkelijker maken.",
    url: "https://www.huisdirect.nl/huis-verkopen-checklist",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const checklistVooraf = [
  "Bepaal waarom u uw woning wilt verkopen en wat uw gewenste planning is",
  "Bepaal een realistische vraagprijs",
  "Verzamel belangrijke woninginformatie zoals woonoppervlakte, perceeloppervlakte, bouwjaar en energielabel",
  "Controleer of uw woning netjes, opgeruimd en verkoopklaar is",
  "Denk na over de sterke punten van uw woning en buurt",
  "Zorg voor goede foto’s en een duidelijke woningpresentatie",
  "Maak een sterke woningomschrijving",
];

const checklistTijdens = [
  "Zet uw woning online met complete en duidelijke informatie",
  "Zorg dat geïnteresseerden snel antwoord krijgen",
  "Plan bezichtigingen slim in",
  "Bereid antwoorden voor op veelgestelde vragen van kopers",
  "Begeleid bezichtigingen rustig en duidelijk",
  "Vergelijk biedingen niet alleen op prijs, maar ook op voorwaarden",
  "Blijf zakelijk bij onderhandelingen",
];

const checklistNa = [
  "Leg afspraken correct vast in een koopovereenkomst",
  "Controleer goed welke voorwaarden zijn afgesproken",
  "Houd overzicht over de vervolgstappen richting overdracht",
  "Stem zaken af rondom oplevering en praktische overdracht",
  "Zorg dat de woning netjes wordt achtergelaten",
];

const faqItems = [
  {
    question: "Waarom is een checklist handig bij het verkopen van een huis?",
    answer:
      "Omdat het verkoopproces uit veel onderdelen bestaat. Met een checklist voorkomt u dat u belangrijke stappen vergeet en houdt u meer rust en overzicht.",
  },
  {
    question: "Kan ik een huis verkopen zonder makelaar als ik een checklist gebruik?",
    answer:
      "Ja. Een checklist helpt juist om het proces overzichtelijk te maken als u zelf meer regie wilt houden. In combinatie met een stappenplan, slimme begeleiding en AI-ondersteuning wordt dat voor veel verkopers goed haalbaar.",
  },
  {
    question: "Wat vergeten verkopers het vaakst?",
    answer:
      "Vaak worden de vraagprijs, presentatie of volledigheid van woninginformatie onderschat. Ook reageren sommige verkopers te laat op geïnteresseerden of kijken ze te veel alleen naar de hoogte van het bod.",
  },
  {
    question: "Heb ik naast een checklist ook nog andere hulp nodig?",
    answer:
      "Dat hangt af van uw voorkeur. Veel verkopers hebben vooral behoefte aan overzicht, duidelijke instructies, begeleiding op de juiste momenten en eventueel AI-advies. Dat is iets anders dan automatisch een traditionele makelaar nodig hebben.",
  },
  {
    question: "Kan AI helpen bij het verkopen van mijn huis?",
    answer:
      "Ja. AI kan steeds beter helpen bij woningteksten, structuur, voorbereiding op bezichtigingen, uitleg van vervolgstappen en het overzichtelijk maken van keuzes. Daardoor wordt zelf verkopen voor veel mensen toegankelijker.",
  },
];

function ChecklistBlock({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
      <h3 className="text-2xl font-semibold text-neutral-950">{title}</h3>
      <p className="mt-4 text-base leading-8 text-neutral-600">{intro}</p>

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              ✓
            </span>
            <span className="text-base leading-7 text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HuisVerkopenChecklistPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen checklist
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen checklist: alles wat u moet regelen
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Een huis verkopen bestaat uit veel kleine en grote stappen. Juist
              daarom raken veel verkopers gaandeweg overzicht kwijt. Niet omdat
              het proces onmogelijk is, maar omdat er op meerdere momenten
              tegelijk dingen geregeld moeten worden.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Met een duidelijke checklist wordt dat een stuk rustiger. U ziet
              wat u vooraf moet regelen, wat tijdens de verkoop belangrijk is en
              waar u na een akkoord nog op moet letten. En het goede nieuws:
              steeds meer van die begeleiding kan tegenwoordig slim ondersteund
              worden met technologie en AI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken uw besparing
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-100"
              >
                Bekijk hoe het werkt
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-neutral-500">
              Waarom een checklist werkt
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Wat het u oplevert</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• minder kans dat u iets vergeet</li>
                <li>• meer rust en overzicht</li>
                <li>• sterkere voorbereiding</li>
                <li>• professionelere indruk naar kopers</li>
                <li>• meer grip zonder onnodige complexiteit</li>
              </ul>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Met slimme begeleiding en AI wordt dit proces steeds makkelijker.
              </p>

              <Link
                href="/#calculator"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Start de calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Waarom een checklist zo belangrijk is bij het verkopen van een huis
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              Veel verkopers denken bij een woningverkoop vooral aan de
              vraagprijs, de foto’s en het moment waarop de woning online komt.
              Maar in de praktijk bestaat verkopen uit veel meer onderdelen.
              Juist daardoor ontstaan fouten vaak niet door onkunde, maar
              simpelweg door gebrek aan overzicht.
            </p>

            <p>
              Een checklist helpt om dat overzicht terug te brengen. Het zorgt
              ervoor dat u minder op gevoel hoeft te onthouden en meer kunt
              werken met een duidelijke volgorde. Dat geeft rust en maakt het
              hele proces professioneler.
            </p>

            <p>
              Dat is ook precies waarom steeds meer verkopers anders naar
              begeleiding kijken. Waar vroeger vooral een makelaar werd ingezet
              om structuur te houden, kunnen checklists, stappenplannen en
              slimme ondersteuning vandaag de dag veel van dat overzicht ook
              bieden.
            </p>

            <p>
              De kracht zit dus niet alleen in kennis, maar ook in het goed
              organiseren van die kennis. En daar helpt een checklist direct
              bij. Zeker nu AI op steeds meer punten mee kan denken, uitleg kan
              geven en werk kan versnellen.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Complete checklist voor uw woningverkoop
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              Gebruik deze checklist als praktische leidraad voor, tijdens en na
              de verkoop van uw huis. U hoeft het daarbij niet allemaal zelf uit
              te vinden: veel onderdelen zijn tegenwoordig goed te ondersteunen
              met slimme begeleiding en AI.
            </p>
          </div>

          <ChecklistBlock
            title="1. Wat u vooraf moet regelen"
            intro="Dit is de fase waarin u de basis legt. Hoe beter deze voorbereiding, hoe sterker de rest van het verkoopproces verloopt."
            items={checklistVooraf}
          />

          <ChecklistBlock
            title="2. Wat u tijdens de verkoop moet doen"
            intro="Zodra uw woning zichtbaar wordt voor geïnteresseerden, draait het om snelheid, duidelijkheid en vertrouwen."
            items={checklistTijdens}
          />

          <ChecklistBlock
            title="3. Wat u na een akkoord nog moet regelen"
            intro="Ook nadat er een koper is gevonden, blijven er belangrijke stappen die aandacht vragen."
            items={checklistNa}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Een checklist vervangt geen nadenken, maar voorkomt onnodige fouten
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Het voordeel van een checklist is niet dat u niet meer hoeft na
                te denken. Het voordeel is dat u belangrijke onderdelen niet
                hoeft te onthouden terwijl er al genoeg tegelijk speelt.
              </p>

              <p>
                Juist bij woningverkoop lopen praktische, financiële en
                emotionele zaken door elkaar. Dat maakt het logisch dat mensen
                soms iets vergeten of te laat oppakken. Een checklist haalt die
                ruis weg en maakt het proces veel overzichtelijker.
              </p>

              <p>
                Voor veel verkopers voelt dat als een enorme stap vooruit. Niet
                alles op gevoel doen, maar werken met een duidelijk systeem. En
                precies daarom wordt zelf verkopen voor steeds meer mensen
                haalbaar: niet omdat alles simpel is, maar omdat structuur het
                verschil maakt.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Veel taken zijn vooral een kwestie van volgorde en duidelijke uitleg
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Dat is misschien wel de belangrijkste verschuiving van deze tijd.
                Veel taken die vroeger volledig via een makelaar liepen, blijken
                in de kern vooral afhankelijk van goede instructies, heldere
                stappen en het juiste moment van handelen.
              </p>

              <p>
                Denk aan het verzamelen van woninginformatie, het voorbereiden
                van een bezichtiging, het vergelijken van biedingen of het
                bewaken van vervolgstappen. Dat zijn belangrijke onderdelen,
                maar geen mysterie.
              </p>

              <p>
                Met een combinatie van checklist, stappenplan en AI-advies wordt
                die kennis steeds toegankelijker. Daardoor verschuift het gevoel
                bij veel verkopers van “ik heb iemand nodig die alles overneemt”
                naar “ik heb vooral een slim systeem nodig dat mij goed
                begeleidt”.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              AI en begeleiding maken zelf verkopen steeds toegankelijker
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Waar verkopers vroeger vooral afhankelijk waren van de uitleg
                van een makelaar, kunnen veel vragen nu steeds sneller en
                duidelijker beantwoord worden. AI kan helpen bij woningteksten,
                samenvattingen, voorbereiding op bezichtigingen, structuur in
                documenten en het logisch maken van vervolgstappen.
              </p>

              <p>
                Dat betekent niet dat alles automatisch vanzelf gaat. Het
                betekent wel dat veel werk minder zwaar en minder onduidelijk
                wordt. De combinatie van goede begeleiding en slimme
                automatisering maakt het proces voor veel mensen overzichtelijker.
              </p>

              <p>
                Precies daarom voelt de toekomst van woningverkoop voor steeds
                meer verkopers anders dan vroeger. Niet automatisch kiezen voor
                een klassiek model, maar werken met een slim systeem dat u helpt
                op de momenten dat het ertoe doet.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              De toekomst van verkopen voelt voor veel mensen anders
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Waar de makelaar vroeger bijna automatisch werd gezien als vaste
                schakel, groeit nu een andere manier van denken. Verkopers willen
                nog steeds zekerheid en overzicht, maar niet altijd meer het oude
                model met hoge kosten en volledige afhankelijkheid.
              </p>

              <p>
                Voor veel mensen voelt slim zelf verkopen daarom steeds
                logischer. Zelf de regie houden, ondersteund worden waar nodig
                en gebruikmaken van technologie die het proces duidelijker
                maakt. Niet harder of ingewikkelder, maar slimmer.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Slim verkopen
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                Eerst weten wat u kunt besparen?
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                Veel verkopers gaan pas echt anders kijken naar het proces als
                ze zien hoeveel geld er anders naar makelaarskosten kan gaan.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                <li>• direct inzicht in kostenverschil</li>
                <li>• geen verplichtingen</li>
                <li>• duidelijke vervolgstap</li>
              </ul>

              <Link
                href="/#calculator"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken uw besparing
              </Link>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-950">
                Ook interessant
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Wilt u eerst het grotere geheel zien? Bekijk dan ook ons
                complete stappenplan voor uw woningverkoop.
              </p>

              <Link
                href="/huis-verkopen-stappenplan"
                className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Bekijk het stappenplan →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Wilt u eerst weten hoeveel u mogelijk kunt besparen?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Veel verkopers maken pas echt een andere keuze zodra zij zwart op
              wit zien hoeveel geld er mogelijk overblijft als zij slimmer
              verkopen.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/zelf-huis-verkopen"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees over zelf huis verkopen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over een huis verkopen checklist
            </h2>
          </div>

          <div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200">
            {faqItems.map((item) => (
              <details key={item.question} className="group bg-white p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-neutral-950">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Wilt u slimmer verkopen?
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Gebruik deze checklist als basis en ontdek daarna hoeveel u
              mogelijk kunt besparen als u niet automatisch kiest voor het
              traditionele makelaarsmodel.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#calculator"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Start de calculator
            </Link>

            <Link
              href="/wat-doet-een-makelaar"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees wat een makelaar doet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}