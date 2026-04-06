import Link from "next/link";

const benefits = [
  {
    title: "Bespaar duizenden euro’s",
    text: "Verkoop uw woning zonder traditionele makelaarscourtage. U houdt meer over aan de verkoop.",
  },
  {
    title: "Zelf de regie houden",
    text: "U bepaalt de prijs, de presentatie en het moment van bezichtigingen. Geen onnodige tussenlaag.",
  },
  {
    title: "Professionele uitstraling",
    text: "Uw woning staat online met een nette, moderne presentatie die vertrouwen geeft aan serieuze kopers.",
  },
  {
    title: "Eenvoudig en snel geregeld",
    text: "Plaats uw woning stap voor stap. Geen ingewikkeld proces, maar een duidelijke route naar livegang.",
  },
];

const steps = [
  {
    step: "Stap 1",
    title: "Maak uw woning compleet",
    text: "Vul de basisgegevens in, voeg foto’s toe en controleer hoe uw woning eruitziet voor kopers.",
  },
  {
    step: "Stap 2",
    title: "Zet uw woning live",
    text: "Wanneer alles goed staat, publiceert u de woning. Eerst afronden, daarna zichtbaar worden.",
  },
  {
    step: "Stap 3",
    title: "Ontvang interesse",
    text: "Kopers bekijken uw woning en nemen contact op. U houdt overzicht en bepaalt zelf het vervolg.",
  },
];

const faqs = [
  {
    question: "Is HuisDirect een makelaar?",
    answer:
      "Nee. HuisDirect is een platform waarmee verkopers hun woning zelf kunnen presenteren en verkopen, zonder traditionele makelaar.",
  },
  {
    question: "Moet ik alles verplicht invullen?",
    answer:
      "Nee. U kunt stap voor stap opbouwen. Hoe completer uw woningpresentatie, hoe sterker deze overkomt op kopers.",
  },
  {
    question: "Kan ik later nog iets aanpassen?",
    answer:
      "Ja. U kunt uw woninggegevens, foto’s en presentatie later blijven verbeteren.",
  },
  {
    question: "Is dit geschikt voor de meeste verkopers?",
    answer:
      "Ja. De basis is juist gemaakt voor mensen die vooral eenvoud, controle en besparing willen.",
  },
];

export default function VoorVerkopersPage() {
  return (
    <main className="bg-stone-50 text-stone-900">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                Voor verkopers
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Verkoop uw woning met meer regie en lagere kosten.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
                HuisDirect is gemaakt voor verkopers die hun woning professioneel
                online willen zetten, zonder direct vast te zitten aan een
                traditionele makelaar. U houdt overzicht, snelheid en controle.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/listings/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Plaats uw woning
                </Link>

                {/* ✅ AANGEPAST */}
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3.5 text-base font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  Maak een account aan
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">Focus</p>
                  <p className="mt-1 font-semibold text-stone-900">
                    Eerst woning live
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">Voordeel</p>
                  <p className="mt-1 font-semibold text-stone-900">
                    Meer controle
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm text-stone-500">Resultaat</p>
                  <p className="mt-1 font-semibold text-stone-900">
                    Professionele presentatie
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50">
                <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 via-white to-stone-100 p-6">
                  <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Voorbeeld woningpresentatie
                        </div>
                        <div className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                          Concept
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-stone-200/70">
                        <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-stone-300 to-stone-200" />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h2 className="text-xl font-semibold text-stone-950">
                        Uw woning centraal
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Laat direct zien hoe uw woning straks overkomt op
                        potentiële kopers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}