import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Huis verkopen ervaringen | Wat verkopers in de praktijk merken | HuisDirect",
  description:
    "Benieuwd naar ervaringen met huis verkopen zonder makelaar? Ontdek wat verkopers in de praktijk merken, waar ze tegenaan lopen en waarom steeds meer mensen kiezen voor slim zelf verkopen met begeleiding en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-ervaringen",
  },
  openGraph: {
    title: "Huis verkopen ervaringen | HuisDirect",
    description:
      "Lees welke ervaringen verkopers hebben met zelf hun huis verkopen, welke twijfels vaak verdwijnen en waarom begeleiding en AI het proces toegankelijker maken.",
    url: "https://www.huisdirect.nl/huis-verkopen-ervaringen",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const ervaringen = [
  {
    title: "“Ik dacht dat een makelaar alles deed, maar dat bleek niet zo te zijn”",
    text: "Veel verkopers merken pas tijdens het proces hoeveel ze zelf al doen. De woning verkoopklaar maken, informatie aanleveren, keuzes maken, vragen beantwoorden en meedenken over de presentatie ligt vaak al grotendeels bij de verkoper.",
  },
  {
    title: "“Het viel mee hoe ingewikkeld het eigenlijk was”",
    text: "Een veelgehoorde ervaring is dat woningverkoop vooraf groter en ingewikkelder voelt dan het in de praktijk blijkt. Zeker met een duidelijk stappenplan en goede begeleiding ontstaat er snel meer rust en overzicht.",
  },
  {
    title: "“Pas toen ik de kosten uitrekende, ging ik anders kijken”",
    text: "Voor veel mensen begint de echte twijfel pas als ze zien hoeveel courtage een makelaar kost. Dan voelt het ineens logisch om kritischer te kijken naar wat u daar precies voor terugkrijgt.",
  },
  {
    title: "“Ik vond het juist prettig om zelf de regie te houden”",
    text: "Veel verkopers ervaren het als positief dat zij zelf bepalen hoe hun woning wordt gepresenteerd, wanneer bezichtigingen plaatsvinden en hoe zij met geïnteresseerden omgaan.",
  },
];

const faqItems = [
  {
    question: "Wat zijn ervaringen met huis verkopen zonder makelaar?",
    answer:
      "Veel verkopers merken dat zij meer zelf kunnen dan ze vooraf dachten. Vooral met duidelijke begeleiding, een stappenplan en AI-ondersteuning wordt het proces voor veel mensen overzichtelijker dan verwacht.",
  },
  {
    question: "Waar lopen mensen vaak tegenaan bij zelf verkopen?",
    answer:
      "De grootste drempel zit meestal niet in het werk zelf, maar in onzekerheid vooraf. Mensen willen weten of ze niets vergeten en of ze het proces goed aanpakken. Juist daarom zijn structuur en begeleiding zo belangrijk.",
  },
  {
    question: "Hebben mensen spijt van verkopen zonder makelaar?",
    answer:
      "Wat veel vaker terugkomt, is dat mensen verbaasd zijn hoeveel ze zelf al konden en hoeveel geld ze mogelijk hadden kunnen besparen. De ervaring is voor veel verkopers positiever dan ze vooraf verwachtten.",
  },
  {
    question: "Waarom zoeken mensen naar ervaringen?",
    answer:
      "Omdat ervaringen onzekerheid wegnemen. Mensen willen niet alleen feiten, maar ook bevestiging dat anderen dezelfde twijfel hadden en dat het in de praktijk goed te doen is.",
  },
  {
    question: "Kan AI helpen om die drempel lager te maken?",
    answer:
      "Ja. AI kan helpen bij woningteksten, voorbereiding, structuur, uitleg van vervolgstappen en het overzichtelijk maken van keuzes. Daardoor voelen veel verkopers zich zekerder.",
  },
];

export default function HuisVerkopenErvaringenPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen ervaringen
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen ervaringen: wat verkopers in de praktijk merken
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Mensen die zoeken naar ervaringen, zoeken meestal niet alleen naar
              informatie. Ze zoeken vooral naar{" "}
              <strong className="text-neutral-950">geruststelling</strong>.
              Naar het gevoel dat anderen dezelfde twijfel hadden en ontdekten
              dat het in de praktijk minder ingewikkeld was dan gedacht.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Dat is logisch. Een huis verkopen is belangrijk. U wilt weten wat
              andere verkopers hebben gemerkt, waar zij tegenaan liepen en wat
              hen uiteindelijk het meeste heeft geholpen. Juist daar laten
              ervaringen vaak iets zien wat feiten alleen niet doen.
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
              Wat vaak terugkomt
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Veelgehoorde inzichten</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• het viel minder zwaar dan vooraf gedacht</li>
                <li>• veel werk deed ik eigenlijk toch al zelf</li>
                <li>• pas bij de kosten begon ik echt te twijfelen</li>
                <li>• begeleiding was fijn, maar geen courtage waard</li>
                <li>• met structuur en AI voelde het veel toegankelijker</li>
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
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Waarom ervaringen zo krachtig zijn in woningverkoop
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              Bij een huis verkopen spelen emoties een grote rol. Niet alleen
              omdat het om veel geld gaat, maar ook omdat het voor de meeste
              mensen geen routine is. Daardoor zoeken verkopers niet alleen naar
              feiten, maar ook naar herkenning.
            </p>

            <p>
              Ze willen weten:{" "}
              <strong className="text-neutral-950">
                hoe hebben anderen dit ervaren?
              </strong>{" "}
              Was het ingewikkeld? Was het spannend? Viel het mee? Hadden ze
              achteraf het gevoel dat ze teveel betaalden voor een makelaar, of
              juist dat ze meer zelf hadden kunnen doen?
            </p>

            <p>
              Juist daar zit de kracht van ervaring. Het laat zien hoe het
              proces voelt in de praktijk. En voor veel verkopers ontstaat dan
              een belangrijk inzicht: de grootste drempel zit vaak niet in het
              werk zelf, maar in de onzekerheid vooraf.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:px-8 md:grid-cols-2">
          {ervaringen.map((ervaring) => (
            <div
              key={ervaring.title}
              className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6"
            >
              <h2 className="text-xl font-semibold text-neutral-950">
                {ervaring.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {ervaring.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              De ervaring die voor veel verkopers alles verandert
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Voor veel mensen komt het kantelpunt niet meteen aan het begin.
                Dat komt pas wanneer ze echt gaan kijken naar wat een makelaar
                doet, hoeveel ze daar zelf al in bijdragen en wat daar
                financieel tegenover staat.
              </p>

              <p>
                Veel verkopers merken dan dat het oude beeld niet helemaal klopt.
                De makelaar neemt niet alles uit handen. U maakt de woning
                verkoopklaar, levert informatie aan, denkt mee over de
                presentatie, bent beschikbaar voor vragen en neemt uiteindelijk
                zelf de belangrijkste beslissingen.
              </p>

              <p>
                Op dat moment ontstaat vaak een andere vraag. Niet meer:{" "}
                <em>“kan ik dit wel zelf?”</em> maar:{" "}
                <strong className="text-neutral-950">
                  “waarom zou ik hier duizenden euro’s courtage voor betalen als
                  ik dit met slimme begeleiding misschien ook goed kan?”
                </strong>
              </p>

              <p>
                En precies dat is voor veel mensen het moment waarop een
                traditionele makelaar minder vanzelfsprekend begint te voelen.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Waarom de ervaring van nu anders is dan vroeger
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Vroeger was de ervaring van woningverkoop sterk gekoppeld aan één
                logisch pad: makelaar inschakelen en het proces volgen zoals het
                altijd ging. Maar die ervaring verandert, omdat verkopers meer
                informatie hebben en technologie veel toegankelijker is geworden.
              </p>

              <p>
                Wat vroeger specialistisch voelde, wordt nu steeds beter
                ondersteund. Een woningtekst schrijven, informatie structureren,
                bezichtigingen voorbereiden, vervolgstappen begrijpen en keuzes
                overzichtelijk maken: AI kan daar op steeds meer punten bij
                helpen.
              </p>

              <p>
                Daardoor verandert ook de ervaring van verkopers zelf. Niet
                omdat alles ineens simpel is, maar omdat het minder ondoorzichtig
                en minder afhankelijk van een traditioneel model wordt.
              </p>

              <p>
                Voor veel mensen voelt dat modern en logisch. Niet alles
                uitbesteden omdat dat vroeger zo ging, maar zelf de regie houden
                met ondersteuning waar dat echt helpt.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Ervaringen draaien vaak om drie dingen: geld, controle en vertrouwen
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Als u ervaringen van verkopers naast elkaar legt, ziet u vaak
                drie terugkerende thema’s.
              </p>

              <p>
                Het eerste is geld. Veel mensen ervaren pas echt hoe groot het
                verschil is wanneer ze courtage uitrekenen. Dan wordt de vraag
                naar alternatieven ineens veel concreter.
              </p>

              <p>
                Het tweede is controle. Veel verkopers vinden het prettig om
                zelf invloed te hebben op presentatie, planning, bezichtigingen
                en de manier waarop zij met geïnteresseerden omgaan.
              </p>

              <p>
                Het derde is vertrouwen. Niet alleen het vertrouwen van kopers,
                maar ook het vertrouwen van de verkoper zelf. En juist dat
                vertrouwen groeit wanneer het proces overzichtelijk wordt gemaakt
                met stappen, begeleiding en AI-ondersteuning.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Wat veel mensen pas later zien
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                De grootste twijfel ontstaat vaak pas ná het zien van de kosten
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                Zolang courtage een abstract begrip blijft, voelt een makelaar
                vanzelfsprekend. Zodra het bedrag concreet wordt, kijken veel
                verkopers ineens heel anders naar hun opties.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                <li>• geld maakt de keuze concreet</li>
                <li>• AI maakt het alternatief haalbaar</li>
                <li>• begeleiding hoeft niet ouderwets te zijn</li>
              </ul>

              <Link
                href="/#calculator"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken uw voordeel
              </Link>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-950">
                Ook interessant
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Wilt u eerst zien hoe het proces stap voor stap werkt? Bekijk
                dan ook onze pagina over het huis verkopen stappenplan.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/huis-verkopen-stappenplan"
                  className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Bekijk het stappenplan →
                </Link>
                <Link
                  href="/zelf-huis-verkopen"
                  className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Lees over zelf huis verkopen →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              De ervaring van morgen: minder afhankelijk, meer ondersteund
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Wat veel ervaringen nu laten zien, is dat de woningmarkt aan het
                verschuiven is. Waar verkopers vroeger vooral zochten naar iemand
                die alles voor hen deed, zoeken ze nu veel vaker naar een manier
                om het slim te doen zonder onnodig veel te betalen.
              </p>

              <p>
                Dat betekent niet dat begeleiding verdwijnt. Integendeel. Goede
                begeleiding blijft belangrijk. Maar de vorm verandert. Minder
                ouderwets, minder gesloten, minder afhankelijk van hoge
                courtage — en meer gebaseerd op duidelijke stappen, slimme tools
                en AI die ondersteunt waar dat echt helpt.
              </p>

              <p>
                Voor veel verkopers voelt dat als de toekomst. Niet harder
                werken, maar slimmer verkopen.
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
                href="/is-makelaar-nodig"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees of een makelaar nodig is
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over huis verkopen ervaringen
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
              href="/zelf-huis-verkopen"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees over zelf huis verkopen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}