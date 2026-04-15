import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huis verkopen stappenplan | Stap voor stap uw woning verkopen | HuisDirect",
  description:
    "Uw huis verkopen? Volg dit duidelijke stappenplan voor het verkopen van uw woning. Ontdek wat u moet regelen, in welke volgorde en hoe u slim kosten kunt besparen.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-stappenplan",
  },
  openGraph: {
    title: "Huis verkopen stappenplan | HuisDirect",
    description:
      "Een duidelijk stappenplan voor uw huis verkopen. Van vraagprijs tot bezichtigingen en koopovereenkomst.",
    url: "https://www.huisdirect.nl/huis-verkopen-stappenplan",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const stappen = [
  {
    stap: "Stap 1",
    title: "Bepaal een realistische vraagprijs",
    text: "Een goede verkoop begint bij de juiste prijs. Zet u uw woning te hoog in de markt, dan schrikt dat geïnteresseerden af. Zet u te laag in, dan laat u mogelijk geld liggen. Kijk daarom naar vergelijkbare woningen, de staat van uw huis, de locatie en de actuele markt.",
  },
  {
    stap: "Stap 2",
    title: "Zorg voor een sterke woningpresentatie",
    text: "De eerste indruk ontstaat online. Goede foto’s, een duidelijke titel, complete woninggegevens en een aantrekkelijke omschrijving maken direct verschil. Kopers beslissen vaak binnen enkele seconden of ze verder kijken.",
  },
  {
    stap: "Stap 3",
    title: "Verzamel alle belangrijke informatie",
    text: "Zorg dat woonoppervlakte, perceeloppervlakte, aantal kamers, bouwjaar, energielabel en andere relevante kenmerken kloppen. Hoe duidelijker uw informatie, hoe professioneler en betrouwbaarder uw woning overkomt.",
  },
  {
    stap: "Stap 4",
    title: "Zet uw woning online",
    text: "Zodra de presentatie klopt, is het tijd om uw woning zichtbaar te maken. Een goede advertentie moet overzichtelijk zijn, vertrouwen geven en direct duidelijk maken waarom uw woning interessant is.",
  },
  {
    stap: "Stap 5",
    title: "Plan en begeleid bezichtigingen",
    text: "Geïnteresseerden willen niet alleen foto’s zien, maar ook voelen of een woning bij hen past. Zorg voor een nette woning, een rustige bezichtiging en duidelijke antwoorden op vragen. Juist hier kunt u als eigenaar vaak sterk zijn, omdat u de woning en buurt goed kent.",
  },
  {
    stap: "Stap 6",
    title: "Onderhandel slim en zakelijk",
    text: "Bij biedingen kijkt u niet alleen naar het bedrag. Let ook op voorwaarden, financieringsvoorbehoud, gewenste opleverdatum en hoe serieus een koper is. Een hoger bod is niet altijd automatisch het beste bod.",
  },
  {
    stap: "Stap 7",
    title: "Leg afspraken correct vast",
    text: "Is er overeenstemming? Dan moeten de gemaakte afspraken goed worden vastgelegd in een koopovereenkomst. Dat voorkomt onduidelijkheid en geeft beide partijen zekerheid.",
  },
  {
    stap: "Stap 8",
    title: "Rond de verkoop goed af",
    text: "Na het tekenen van de koopovereenkomst volgen de laatste stappen richting overdracht. Denk aan de inspectie, communicatie met de notaris en het netjes opleveren van de woning.",
  },
];

const faqItems = [
  {
    question: "In welke volgorde moet ik mijn huis verkopen?",
    answer:
      "Begin met de vraagprijs en woningpresentatie. Daarna zorgt u voor complete informatie, zet u de woning online, plant u bezichtigingen en legt u afspraken vast zodra er een koper is.",
  },
  {
    question: "Heb ik een makelaar nodig voor een stappenplan?",
    answer:
      "Nee. U kunt uw woning ook zonder makelaar verkopen, zolang u weet welke stappen belangrijk zijn en het proces gestructureerd aanpakt.",
  },
  {
    question: "Wat is de belangrijkste stap bij het verkopen van een huis?",
    answer:
      "De vraagprijs en presentatie zijn vaak het belangrijkst. Daarmee bepaalt u of kopers doorklikken, interesse krijgen en een bezichtiging willen plannen.",
  },
  {
    question: "Hoe voorkom ik fouten tijdens de verkoop?",
    answer:
      "Werk met een duidelijk stappenplan, zorg voor complete informatie, reageer snel op geïnteresseerden en leg afspraken correct vast.",
  },
];

export default function HuisVerkopenStappenplanPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen stappenplan
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen: het complete stappenplan
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Een huis verkopen voelt voor veel mensen groot en onoverzichtelijk.
              Zeker als u geen fouten wilt maken. Met een goed stappenplan wordt
              het proces een stuk duidelijker, rustiger en slimmer.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Op deze pagina ziet u stap voor stap wat u moet regelen, in welke
              volgorde en waar de grootste kansen liggen om kosten te besparen
              en grip te houden op de verkoop.
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
              In het kort
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Sterke verkoopvolgorde</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• juiste vraagprijs bepalen</li>
                <li>• woning goed presenteren</li>
                <li>• bezichtigingen begeleiden</li>
                <li>• slim onderhandelen</li>
                <li>• afspraken goed vastleggen</li>
              </ul>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Eerst weten hoeveel u mogelijk kunt besparen?
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
            Waarom werken met een stappenplan slim is
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              Veel verkopers beginnen met enthousiasme, maar zonder duidelijke
              volgorde. Daardoor worden belangrijke onderdelen soms te laat
              geregeld. Bijvoorbeeld een onduidelijke vraagprijs, zwakke foto’s
              of onvolledige woninginformatie. Dat kost niet alleen vertrouwen,
              maar vaak ook geïnteresseerden.
            </p>

            <p>
              Een goed stappenplan voorkomt dat. U houdt overzicht, maakt
              minder fouten en weet precies waar u mee bezig bent. Dat geeft
              rust in een traject dat voor veel mensen spannend genoeg is.
            </p>

            <p>
              Bovendien helpt een stappenplan u om zakelijker te blijven. Zeker
              tijdens bezichtigingen en onderhandelingen is het prettig als u
              weet welke stap volgt en wat op dat moment echt belangrijk is.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Stap voor stap uw huis verkopen
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              Dit zijn de belangrijkste stappen om uw woning goed, duidelijk en
              professioneel te verkopen.
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            {stappen.map((item) => (
              <div
                key={item.stap}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 lg:p-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      {item.stap}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-neutral-700">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgemaakte fouten zonder duidelijk stappenplan
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Zonder duidelijke structuur maken verkopers vaak dezelfde
                fouten. De woning wordt te snel online gezet, de presentatie is
                niet sterk genoeg of er wordt te weinig informatie gedeeld. Ook
                bij biedingen ontstaat dan sneller twijfel of onrust.
              </p>

              <p>
                Een andere fout is emotioneel reageren. Dat is begrijpelijk,
                want uw woning is niet zomaar een product. Toch helpt het om
                elke stap zakelijk te bekijken. Wat is slim? Wat geeft
                vertrouwen? Wat helpt de verkoop echt vooruit?
              </p>

              <p>
                Juist daarom werkt een stappenplan zo goed. Het haalt ruis weg
                en maakt het proces logisch. Daardoor verkoopt u niet alleen
                rustiger, maar vaak ook sterker.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Verkoopt u ook zonder makelaar met een stappenplan?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Ja. Een stappenplan is juist extra waardevol als u zonder
                makelaar verkoopt. U moet dan zelf meer keuzes maken en meer
                onderdelen aansturen. Met een duidelijke volgorde voorkomt u
                dat er gaten in het proces vallen.
              </p>

              <p>
                Voor veel verkopers is dat precies de interessante combinatie:
                wel professioneel verkopen, maar niet automatisch hoge
                makelaarskosten betalen. Dan is overzicht geen luxe, maar een
                voorwaarde.
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
                Veel mensen kiezen pas echt bewust als ze zien hoeveel geld er
                mogelijk blijft hangen zonder traditionele makelaar.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                <li>• direct inzicht in mogelijke besparing</li>
                <li>• geen verplichtingen</li>
                <li>• duidelijke volgende stap</li>
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
                Meer weten over zelf verkopen?
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Lees ook hoe een huis verkopen zonder makelaar werkt en waar u
                op moet letten als u zelf de regie wilt houden.
              </p>

              <Link
                href="/huis-verkopen-zonder-makelaar"
                className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Lees meer →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Klaar voor de volgende stap?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Een goed stappenplan geeft overzicht. De volgende logische vraag
              is hoeveel u kunt besparen als u uw woning slimmer verkoopt.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees hoe HuisDirect werkt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over een huis verkopen stappenplan
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
              Gebruik het stappenplan als basis en ontdek daarna wat u mogelijk
              kunt besparen met HuisDirect.
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
              href="/huis-verkopen-zonder-makelaar"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees over zonder makelaar verkopen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}