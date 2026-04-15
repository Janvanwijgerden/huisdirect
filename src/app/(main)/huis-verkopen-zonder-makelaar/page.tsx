import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Huis verkopen zonder makelaar | Zelf verkopen en duizenden euro’s besparen | HuisDirect",
  description:
    "Wilt u uw huis verkopen zonder makelaar? Ontdek hoe het werkt, wat u zelf moet regelen, waar u op moet letten en hoeveel u kunt besparen met HuisDirect.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-zonder-makelaar",
  },
  openGraph: {
    title: "Huis verkopen zonder makelaar | HuisDirect",
    description:
      "Lees hoe u uw woning zonder makelaar verkoopt, welke stappen daarbij horen en hoeveel u kunt besparen.",
    url: "https://www.huisdirect.nl/huis-verkopen-zonder-makelaar",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voordelen = [
  {
    title: "Duizenden euro’s besparen",
    text: "Bij een traditionele verkoop betaalt u vaak courtage. Zeker bij hogere woningwaardes loopt dat bedrag snel op. Zonder makelaar houdt u dat geld veel meer in eigen zak.",
  },
  {
    title: "Zelf de regie houden",
    text: "U bepaalt zelf hoe uw woning wordt gepresenteerd, wanneer bezichtigingen plaatsvinden en hoe u met biedingen omgaat. Dat voelt voor veel verkopers logischer en prettiger.",
  },
  {
    title: "Meer grip op het proces",
    text: "Geen onnodige tussenlaag, geen ruis en geen afhankelijkheid van iemand anders zijn planning. U ziet zelf wat er gebeurt en kunt sneller schakelen.",
  },
];

const stappen = [
  "een realistische vraagprijs bepalen",
  "de woning professioneel presenteren",
  "complete woninginformatie verzamelen",
  "bezichtigingen organiseren",
  "onderhandelen met geïnteresseerden",
  "afspraken correct vastleggen in een koopovereenkomst",
];

const faqItems = [
  {
    question: "Kan ik mijn huis verkopen zonder makelaar?",
    answer:
      "Ja. In Nederland bent u niet verplicht om een makelaar in te schakelen om uw woning te verkopen. U mag uw woning zelf aanbieden, bezichtigingen doen, onderhandelen en afspraken maken met een koper.",
  },
  {
    question: "Wat moet ik regelen als ik zonder makelaar verkoop?",
    answer:
      "U moet onder andere zorgen voor een goede vraagprijs, duidelijke woningpresentatie, complete woninginformatie, bezichtigingen, onderhandelingen en een correcte koopovereenkomst. Ook is een energielabel verplicht bij verkoop.",
  },
  {
    question: "Hoeveel bespaar ik door geen makelaar te gebruiken?",
    answer:
      "Dat hangt af van de woningwaarde en het tarief van een makelaar, maar vaak gaat het om duizenden euro’s. Juist daarom rekenen veel verkopers eerst uit wat verkopen zonder makelaar financieel oplevert.",
  },
  {
    question: "Is verkopen zonder makelaar veilig?",
    answer:
      "Ja, zolang u gestructureerd werkt en belangrijke zaken goed vastlegt. Duidelijke communicatie, volledige woninginformatie en een correcte koopovereenkomst zijn daarbij essentieel.",
  },
  {
    question: "Is Funda nodig om mijn huis te verkopen?",
    answer:
      "Funda is bekend en groot, maar het is niet de enige manier om kopers te bereiken. Een sterke woningpresentatie, slimme online zichtbaarheid en duidelijke informatie maken ook buiten traditionele makelaarsmodellen veel verschil.",
  },
  {
    question: "Voor wie is zelf een huis verkopen geschikt?",
    answer:
      "Vooral voor verkopers die kosten willen besparen, zelf de regie willen houden en het geen probleem vinden om bezichtigingen en contact met geïnteresseerden zelf te doen.",
  },
];

export default function HuisVerkopenZonderMakelaarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Zonder makelaar verkopen
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen zonder makelaar: zo werkt het
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Een huis verkopen zonder makelaar wordt steeds interessanter voor
              mensen die geen duizenden euro’s aan courtage willen betalen en
              liever zelf de regie houden. U bent in Nederland niet verplicht om
              een makelaar in te schakelen.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Dat betekent dat u uw woning ook zelf kunt verkopen, zolang u weet
              welke stappen belangrijk zijn en waar u op moet letten. Voor veel
              verkopers draait deze keuze om twee dingen:{" "}
              <strong className="text-neutral-950">geld besparen</strong> en{" "}
              <strong className="text-neutral-950">controle houden</strong>.
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
              <p className="text-sm text-neutral-300">Grootste motivaties</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• geen hoge makelaarscourtage betalen</li>
                <li>• zelf de controle houden over bezichtigingen</li>
                <li>• direct contact met geïnteresseerden</li>
                <li>• slimmer verkopen, zonder onnodige kosten</li>
              </ul>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Eerst zien hoeveel u mogelijk kunt besparen?
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
                Waarom kiezen mensen ervoor om zonder makelaar te verkopen?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  De grootste reden is simpel: een makelaar kost geld. En niet
                  een klein beetje. Bij veel woningen betaalt u een percentage
                  van de verkoopprijs, vaak aangevuld met opstartkosten of extra
                  diensten. Dat voelt voor veel verkopers steeds minder logisch,
                  zeker in een markt waarin woningen vaak al veel aandacht
                  krijgen.
                </p>

                <p>
                  Daarnaast willen veel mensen niet het gevoel hebben dat ze hun
                  eigen verkoopproces uit handen geven. U heeft waarschijnlijk
                  jarenlang in uw woning gewoond, kent de buurt, weet wat de
                  pluspunten zijn en kunt geïnteresseerden vaak beter vertellen
                  hoe het echt is om daar te wonen.
                </p>

                <p>
                  Ook speelt psychologie mee. Zodra mensen ontdekken hoeveel
                  courtage zij mogelijk betalen, ontstaat vaak dezelfde gedachte:{" "}
                  <strong>
                    is dit bedrag de meerwaarde van een makelaar echt waard?
                  </strong>{" "}
                  Voor een groeiende groep verkopers is het antwoord daarop nee.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Mag u uw huis zelf verkopen?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Ja. In Nederland mag u uw woning gewoon zelf verkopen. Er is
                  geen wettelijke verplichting om een makelaar in te schakelen.
                  U kunt dus zelf de vraagprijs bepalen, foto’s laten maken, de
                  woning online presenteren, bezichtigingen doen, onderhandelen
                  en de afspraken met de koper vastleggen.
                </p>

                <p>
                  Wel is het belangrijk om te begrijpen dat “zonder makelaar”
                  niet betekent dat u zomaar iets online zet en verder afwacht.
                  Succesvol zelf verkopen draait om een goede voorbereiding,
                  duidelijke informatie en een professionele uitstraling.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Wat moet u regelen als u zonder makelaar verkoopt?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Zonder makelaar ligt meer verantwoordelijkheid bij uzelf. Dat
                  hoeft geen probleem te zijn, zolang u weet welke onderdelen
                  echt belangrijk zijn. In de praktijk gaat het meestal om deze
                  onderdelen:
                </p>

                <ol className="space-y-3 pl-5 text-neutral-700 marker:font-semibold">
<ol className="space-y-3 pl-5 list-decimal text-neutral-700">
  {stappen.map((stap) => (
    <li key={stap} className="pl-1">
      {stap}
    </li>
  ))}
</ol>
                </ol>

                <p>
                  Juist op deze punten maakt structuur het verschil. Niet door
                  alles ingewikkeld te maken, maar door het traject logisch en
                  professioneel op te bouwen.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Wat zijn de voordelen van een huis verkopen zonder makelaar?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Het grootste voordeel is natuurlijk de besparing. Waar een
                  makelaar vaak een percentage van de verkoopprijs rekent, houdt
                  u dat bedrag zonder traditionele makelaar grotendeels zelf.
                  Zeker bij woningwaardes van enkele tonnen kan dat verschil fors
                  zijn.
                </p>

                <p>
                  Maar geld is niet het enige voordeel. Veel verkopers ervaren
                  ook meer rust wanneer zij zelf de regie hebben. U hoeft niet
                  te wachten tot een makelaar tijd heeft, u bepaalt uw eigen
                  tempo en u kunt zelf kiezen hoe u met kijkers en biedingen
                  omgaat.
                </p>

                <p>
                  Daarnaast waarderen kopers het vaak wanneer informatie direct
                  van de eigenaar komt. Dat voelt menselijker, concreter en vaak
                  overtuigender dan standaard verkooppraat.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Wat zijn de nadelen of risico’s?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Zonder makelaar moet u wel meer zelf doen. Dat betekent dat u
                  tijd moet steken in de voorbereiding, presentatie en
                  communicatie. Ook moet u zakelijk blijven tijdens
                  onderhandelingen.
                </p>

                <p>
                  Een ander risico is dat sommige verkopers te licht denken over
                  het verkoopproces. Een woning verkopen is geen losse
                  advertentie, maar een traject met financiële, juridische en
                  praktische onderdelen.
                </p>

                <p>
                  Toch betekent dat niet dat u automatisch een makelaar nodig
                  heeft. Het betekent vooral dat u een goede structuur nodig
                  heeft. Precies daarom kiezen steeds meer mensen voor een
                  platform dat de verkoop ondersteunt, zonder direct de
                  klassieke makelaarskosten te rekenen.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Besparen met HuisDirect
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Eerst weten wat u mogelijk bespaart?
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Gebruik onze calculator en ontdek hoeveel makelaarskosten u
                  mogelijk kunt vermijden.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• inzicht in mogelijke besparing</li>
                  <li>• geen verplichtingen</li>
                  <li>• u houdt zelf de regie</li>
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
                  Wanneer is zelf verkopen slim?
                </h3>

                <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
                  <p>
                    Zelf verkopen past vaak goed bij mensen die duidelijk kosten
                    willen besparen en zelf contact met kopers willen houden.
                  </p>
                  <p>
                    Het werkt vooral goed voor verkopers die hun woning en buurt
                    goed kunnen uitleggen en geen behoefte hebben aan een
                    traditionele makelaar.
                  </p>
                </div>

                <Link
                  href="/hoe-het-werkt"
                  className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Lees hoe HuisDirect werkt →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Is verkopen zonder makelaar goedkoper dan via een makelaar?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                In de meeste gevallen wel. Dat is juist de hoofdreden waarom
                deze route zo aantrekkelijk is. Een traditionele makelaar
                rekent vaak courtage over de uiteindelijke verkoopprijs. Daardoor
                lopen de kosten mee op naarmate uw woning meer waard is.
              </p>

              <p>
                Bij zelf verkopen of verkopen via een slimmer platform heeft u
                veel meer grip op die kosten. U ziet beter waar u voor betaalt
                en houdt meer over van uw opbrengst. Zeker in een markt met hoge
                woningwaardes is dat een sterk argument.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Hoe verkoopt u professioneel zonder makelaar?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Professioneel verkopen zonder makelaar draait niet om dure
                woorden, maar om een strak proces. Zorg dat uw
                woningpresentatie klopt, dat uw vraagprijs verdedigbaar is, dat
                geïnteresseerden snel antwoord krijgen en dat u duidelijk bent
                over vervolgstappen.
              </p>

              <p>
                Een sterke aanpak bestaat meestal uit drie onderdelen: een
                woningadvertentie die vertrouwen opwekt, een duidelijk en logisch
                verkoopproces en meerdere contactmomenten die twijfel wegnemen.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgemaakte fouten bij verkopen zonder makelaar
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <ul className="list-disc space-y-2 pl-5">
                <li>een te hoge vraagprijs kiezen uit emotie;</li>
                <li>slechte of onduidelijke woningfoto’s gebruiken;</li>
                <li>te weinig informatie geven in de advertentie;</li>
                <li>traag reageren op geïnteresseerden;</li>
                <li>onderhandelen zonder duidelijke grenzen of strategie;</li>
                <li>afspraken niet strak genoeg vastleggen.</li>
              </ul>

              <p>
                Het goede nieuws is dat deze fouten meestal te voorkomen zijn
                met een beter systeem. U hoeft het dus niet ingewikkeld te
                maken. U moet vooral weten wat belangrijk is, en in welke
                volgorde.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Eerst weten wat u kunt besparen?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Veel verkopers raken pas echt gemotiveerd als ze zwart op wit zien
              hoeveel geld er mogelijk blijft hangen door niet voor een
              traditionele makelaar te kiezen.
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
              Veelgestelde vragen over huis verkopen zonder makelaar
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
              Klaar om slimmer te verkopen?
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Bereken uw mogelijke besparing en ontdek of een traditionele
              makelaar voor uw situatie wel nodig is.
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
              href="/hoe-het-werkt"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees hoe het werkt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}