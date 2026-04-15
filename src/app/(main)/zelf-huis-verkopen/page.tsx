import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zelf huis verkopen | Zo verkoopt u uw woning zonder makelaar | HuisDirect",
  description:
    "Zelf uw huis verkopen? Ontdek hoe u uw woning zonder makelaar kunt verkopen, welke stappen belangrijk zijn en waarom steeds meer verkopers kiezen voor slim zelf verkopen met hulp van technologie en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/zelf-huis-verkopen",
  },
  openGraph: {
    title: "Zelf huis verkopen | HuisDirect",
    description:
      "Lees hoe u zelf uw huis verkoopt, welke stappen belangrijk zijn en waarom zelf verkopen met slimme ondersteuning voor veel mensen steeds logischer wordt.",
    url: "https://www.huisdirect.nl/zelf-huis-verkopen",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voordelen = [
  {
    title: "U bespaart vaak duizenden euro’s",
    text: "Een traditionele makelaar rekent vaak courtage of een stevig vast tarief. Door zelf te verkopen blijft er vaak veel meer van de opbrengst over.",
  },
  {
    title: "U houdt zelf de regie",
    text: "U bepaalt hoe uw woning wordt gepresenteerd, wanneer bezichtigingen plaatsvinden en hoe u met biedingen omgaat.",
  },
  {
    title: "U kent uw woning het best",
    text: "U weet hoe het is om er te wonen, wat prettig is aan de buurt en welke details voor kopers echt relevant zijn.",
  },
];

const stappen = [
  {
    title: "Bepaal een logische vraagprijs",
    text: "Een goede vraagprijs trekt serieuze interesse aan en voorkomt dat uw woning te lang blijft staan of te goedkoop wordt verkocht.",
  },
  {
    title: "Zorg voor sterke presentatie",
    text: "Foto’s, woningtekst en complete informatie zijn bepalend voor de eerste indruk. Online beslist een koper vaak in seconden of hij verder kijkt.",
  },
  {
    title: "Maak het proces overzichtelijk",
    text: "Werk met een duidelijk stappenplan zodat u weet wat eerst moet gebeuren, wat daarna komt en welke informatie u nodig heeft.",
  },
  {
    title: "Begeleid bezichtigingen met vertrouwen",
    text: "U hoeft geen makelaarspraatje te houden. Duidelijkheid, rust en kennis van uw woning maken vaak meer indruk.",
  },
  {
    title: "Vergelijk biedingen slim",
    text: "Kijk niet alleen naar de prijs, maar ook naar voorwaarden, opleverdatum en hoe serieus een koper echt is.",
  },
  {
    title: "Leg afspraken correct vast",
    text: "Een goede afronding voorkomt onduidelijkheid. Structuur en helderheid zijn hier belangrijker dan vakjargon.",
  },
];

const faqItems = [
  {
    question: "Kan ik zelf mijn huis verkopen?",
    answer:
      "Ja. In Nederland bent u niet verplicht om een makelaar in te schakelen. U mag uw woning gewoon zelf verkopen.",
  },
  {
    question: "Is zelf huis verkopen moeilijk?",
    answer:
      "Niet per se. Veel verkopers denken vooraf dat het ingewikkelder is dan het werkelijk is. Met een duidelijk stappenplan, goede informatie en slimme ondersteuning is het voor veel mensen prima te doen.",
  },
  {
    question: "Wat moet ik regelen als ik zelf mijn huis verkoop?",
    answer:
      "U moet onder andere nadenken over de vraagprijs, woningpresentatie, bezichtigingen, biedingen en de juiste vervolgstappen richting koopovereenkomst.",
  },
  {
    question: "Waarom kiezen mensen ervoor om zelf hun huis te verkopen?",
    answer:
      "Vooral om kosten te besparen en zelf de regie te houden. Veel verkopers ontdekken bovendien dat zij al meer zelf kunnen dan zij vooraf dachten.",
  },
  {
    question: "Heb ik dan helemaal geen hulp nodig?",
    answer:
      "Niet iedereen wil alles volledig alleen doen. Veel verkopers zoeken vooral slimme begeleiding: een duidelijk systeem, praktische instructies en eventueel AI-advies. Dat is iets anders dan automatisch een traditionele makelaar nodig hebben.",
  },
];

export default function ZelfHuisVerkopenPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Zelf huis verkopen
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Zelf uw huis verkopen: slimmer, duidelijker en steeds logischer
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Zelf uw huis verkopen klinkt voor veel mensen eerst spannend. Niet
              omdat het onmogelijk voelt, maar omdat het verkoopproces vaak
              groter en ingewikkelder wordt voorgesteld dan nodig is.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Toch ontdekken steeds meer verkopers dat zij al veel meer zelf
              kunnen dan gedacht. En wat vroeger bijna automatisch via een
              makelaar liep, kan nu steeds beter worden ondersteund met een
              duidelijk stappenplan, slimme tools en AI-advies.
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
              Waarom steeds meer verkopers hiervoor kiezen
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Wat dit aantrekkelijk maakt</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• duizenden euro’s besparen op makelaarskosten</li>
                <li>• zelf de regie houden over het proces</li>
                <li>• direct contact met geïnteresseerden</li>
                <li>• duidelijke begeleiding zonder ouderwets model</li>
                <li>• AI maakt steeds meer taken toegankelijk</li>
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
        <div className="grid gap-6 md:grid-cols-3">
          {voordelen.map((voordeel) => (
            <div
              key={voordeel.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-950">
                {voordeel.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {voordeel.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
                Zelf verkopen is vaak minder onrealistisch dan het eerst lijkt
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Veel mensen hebben het gevoel dat een huis verkopen zonder
                  makelaar risicovol of te ingewikkeld is. Dat gevoel is
                  begrijpelijk. Een woning verkopen is belangrijk, financieel
                  groot en voor de meeste mensen geen dagelijkse bezigheid.
                </p>

                <p>
                  Toch is het goed om onderscheid te maken tussen{" "}
                  <strong>belangrijk</strong> en{" "}
                  <strong>onmogelijk om zelf te doen</strong>. Veel onderdelen
                  van het verkoopproces zijn niet zo mysterieus als ze soms
                  worden gebracht. Ze vragen vooral om structuur, voorbereiding
                  en duidelijke keuzes.
                </p>

                <p>
                  En precies daar verandert veel. Wat vroeger sterk afhankelijk
                  leek van een makelaar, kan nu steeds beter worden ondersteund
                  met logische stappen, heldere uitleg en AI die helpt bij
                  teksten, keuzes en voorbereiding.
                </p>

                <p>
                  Daardoor verschuift het gevoel bij veel verkopers van{" "}
                  <strong>“dit durf ik niet zelf”</strong> naar{" "}
                  <strong>“dit kan ik eigenlijk best, als ik goed begeleid word”</strong>.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Veel verkopers doen sowieso al meer zelf dan ze denken
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Ook als u met een makelaar werkt, doet u in de praktijk vaak
                  al veel zelf. U maakt de woning verkoopklaar, levert
                  informatie aan, maakt keuzes, bent beschikbaar voor vragen,
                  controleert gegevens en denkt mee over presentatie en planning.
                </p>

                <p>
                  Vaak is het verschil dus niet dat u niets doet en de makelaar
                  alles. Het verschil is eerder dat u veel doet onder begeleiding
                  van een makelaar. En juist dat maakt de vraag logisch: als u
                  toch al een groot deel zelf doet, heeft u dan een traditioneel
                  makelaarsmodel nodig, of vooral een slim systeem dat u goed
                  ondersteunt?
                </p>

                <p>
                  Voor steeds meer mensen ligt daar de echte verschuiving. Niet
                  alles volledig uit handen geven, maar zelf verkopen met
                  ondersteuning op de punten waar dat echt waarde toevoegt.
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
                  Veel verkopers gaan pas echt anders kijken naar zelf verkopen
                  als ze zien hoeveel geld er anders naar makelaarskosten gaat.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• direct inzicht in kostenverschil</li>
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
                  Ook interessant
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Wilt u eerst zien hoe het proces stap voor stap werkt? Bekijk
                  dan ook ons complete stappenplan voor het verkopen van uw
                  woning.
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Wat u nodig heeft om zelf uw huis goed te verkopen
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Zelf verkopen betekent niet dat u alles blind moet uitvinden. Het
            betekent vooral dat u de juiste volgorde, informatie en ondersteuning
            nodig heeft.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {stappen.map((stap) => (
            <div
              key={stap.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-950">
                {stap.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {stap.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Zelf verkopen met hulp van AI voelt voor veel verkopers logischer
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Hier zit misschien wel de grootste verandering van nu. Waar een
                makelaar vroeger vooral nodig leek omdat kennis en instructies
                moeilijk toegankelijk waren, kunnen verkopers tegenwoordig steeds
                beter geholpen worden met technologie.
              </p>

              <p>
                AI kan helpen bij het schrijven van woningteksten, het structureren
                van informatie, het voorbereiden van bezichtigingen, het uitleggen
                van vervolgstappen en het helder maken van keuzes. Dat betekent
                niet dat technologie alles overneemt, maar wel dat veel drempels
                lager worden.
              </p>

              <p>
                Voor veel mensen voelt dat als een logischere toekomst. Niet
                automatisch duizenden euro’s betalen voor een oud model, maar
                zelf de regie houden met slimme ondersteuning precies waar dat
                nodig is.
              </p>

              <p>
                Juist daarom groeit zelf huis verkopen. Niet als wilde gok, maar
                als moderne manier van verkopen waarbij overzicht, vertrouwen en
                technologie samenkomen.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Is zelf huis verkopen voor iedereen geschikt?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Niet iedereen wil hetzelfde. Sommige verkopers vinden het prettig
                om alles uit handen te geven. Anderen willen juist zelf grip
                houden en alleen ondersteuning op de momenten die ertoe doen.
              </p>

              <p>
                Zelf verkopen past vooral goed bij mensen die kosten willen
                besparen, duidelijk willen communiceren en bereid zijn om
                betrokken te zijn bij de verkoop. Voor die groep wordt de stap
                steeds kleiner, juist omdat begeleiding slimmer en toegankelijker
                wordt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Wilt u eerst weten hoeveel u mogelijk kunt besparen?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Veel verkopers maken pas echt een keuze zodra zij zwart op wit zien
              hoeveel geld er mogelijk overblijft als zij slimmer verkopen.
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
              Veelgestelde vragen over zelf huis verkopen
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
              Ontdek hoeveel u mogelijk overhoudt als u niet automatisch kiest
              voor het traditionele makelaarsmodel.
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