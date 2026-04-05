"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";

const REALTOR_PERCENTAGE = 1.35;
const PLATFORM_PRICE = 195;
const INTRO_FREE = true;

const COSTS = {
  photographer: 450,
  valuation: 700,
  presenter: 250,
  energyLabel: 350,
  floorPlan: 250,
} as const;

function formatCurrencyInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return new Intl.NumberFormat("nl-NL").format(Number(digitsOnly));
}

function parseCurrencyInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
}

function euro(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-white/15 bg-white/10 text-stone-200 transition hover:bg-white/20">
        <Info className="h-3.5 w-3.5" />
      </span>

      <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 hidden w-72 -translate-y-1/2 rounded-xl border border-white/10 bg-stone-950/95 p-3 text-left text-xs leading-relaxed text-stone-200 shadow-xl group-hover:block">
        {text}
      </span>
    </span>
  );
}

export default function HeroCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [homeValue, setHomeValue] = useState("");

  const [photographer, setPhotographer] = useState(false);
  const [valuation, setValuation] = useState(false);
  const [presenter, setPresenter] = useState(false);
  const [floorPlan, setFloorPlan] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [marketingCost, setMarketingCost] = useState(250);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash === "#calculator") {
      setIsOpen(true);

      setTimeout(() => {
        const element = document.getElementById("calculator");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, []);

  const parsedHomeValue = useMemo(
    () => parseCurrencyInput(homeValue),
    [homeValue]
  );

  const realtorCosts = useMemo(() => {
    if (!parsedHomeValue) return 0;
    return (parsedHomeValue * REALTOR_PERCENTAGE) / 100;
  }, [parsedHomeValue]);

  const platformCost = INTRO_FREE ? 0 : PLATFORM_PRICE;

  const extraServicesTotal = useMemo(() => {
    let total = COSTS.energyLabel + platformCost;

    if (photographer) total += COSTS.photographer;
    if (valuation) total += COSTS.valuation;
    if (presenter) total += COSTS.presenter;
    if (floorPlan) total += COSTS.floorPlan;
    if (marketing) total += marketingCost;

    return total;
  }, [
    photographer,
    valuation,
    presenter,
    floorPlan,
    marketing,
    marketingCost,
    platformCost,
  ]);

  const netSavings = useMemo(() => {
    return Math.max(realtorCosts - extraServicesTotal, 0);
  }, [realtorCosts, extraServicesTotal]);

  return (
    <div id="calculator" className="mt-8 w-full max-w-3xl scroll-mt-24">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98]"
      >
        Bereken uw besparing
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
          <h3 className="font-sans text-xl font-bold">Bespaarcalculator</h3>

          <p className="mt-2 text-sm leading-relaxed text-stone-200">
            Vul de geschatte woningwaarde in. Daarna ziet u wat u normaal kwijt
            bent aan makelaarskosten, welke extra diensten u eventueel nog wilt
            afnemen, en wat er netto aan besparing overblijft.
          </p>

          <div className="mt-5">
            <label
              htmlFor="home-value"
              className="mb-2 block text-sm font-medium text-white"
            >
              Geschatte woningwaarde
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400">
                €
              </span>

              <input
                id="home-value"
                type="text"
                inputMode="numeric"
                value={homeValue}
                onChange={(e) => setHomeValue(formatCurrencyInput(e.target.value))}
                placeholder="Bijvoorbeeld 450.000"
                className="w-full rounded-xl border border-white/15 bg-white py-3 pl-9 pr-4 text-base font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/10 px-4 py-3">
            <p className="text-sm text-stone-200">
              Vast makelaarspercentage:
              <span className="ml-2 font-semibold text-white">
                {REALTOR_PERCENTAGE.toFixed(2).replace(".", ",")}%
              </span>
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
              Geschatte makelaarskosten
            </p>

            {parsedHomeValue > 0 ? (
              <div className="mt-2">
                <p className="text-sm text-stone-200">
                  Bij een woningwaarde van{" "}
                  <span className="font-semibold text-white">
                    {euro(parsedHomeValue)}
                  </span>
                </p>

                <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  {euro(realtorCosts)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-300">
                Vul eerst de waarde van uw woning in.
              </p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
            <h4 className="text-sm font-semibold text-white">
              Extra diensten via HuisDirect
            </h4>
            <p className="mt-1 text-sm text-stone-300">
              Deze kosten trekken we af van uw mogelijke besparing.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Platformkosten HuisDirect
                    </p>
                    <p className="mt-1 text-sm text-stone-300">
                      {INTRO_FREE
                        ? "Introductieactie: eerste 10 woningen gratis."
                        : "Vaste prijs voor het plaatsen van uw woning."}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {INTRO_FREE ? (
                      <>
                        <p className="text-sm text-stone-400 line-through">
                          {euro(PLATFORM_PRICE)}
                        </p>
                        <p className="text-sm font-semibold text-green-300">
                          €0
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-white">
                        {euro(PLATFORM_PRICE)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="text-sm font-medium text-white">Energielabel</p>
                    <InfoTooltip text="Bij verkoop van een woning in Nederland is een energielabel in principe verplicht. Daarom nemen we deze standaard mee in de berekening." />
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-white">
                    {euro(COSTS.energyLabel)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-stone-300">
                  Standaard meegenomen in de berekening.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={photographer}
                  onChange={(e) => setPhotographer(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 text-green-600 focus:ring-green-500"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="text-sm font-medium text-white">Fotograaf</p>
                      <InfoTooltip text="Goede foto's zijn enorm belangrijk voor de verkoop. Ze bepalen mede hoeveel mensen doorklikken en een bezichtiging aanvragen. Dit is meestal niet iets om op te besparen." />
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-white">
                      {euro(COSTS.photographer)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-stone-300">
                    Professionele foto&apos;s voor een sterke eerste indruk.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={valuation}
                  onChange={(e) => setValuation(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 text-green-600 focus:ring-green-500"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        Taxatierapport
                      </p>
                      <InfoTooltip text="Niet altijd verplicht, maar in de praktijk is een taxatie vaak nodig voor de hypotheek van de koper. Dit kan uw woning aantrekkelijker maken voor kopers die financiering nodig hebben." />
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-white">
                      {euro(COSTS.valuation)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-stone-300">
                    Interessant voor kopers die een hypotheek nodig hebben.
                  </p>
                </div>
              </label>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 text-green-600 focus:ring-green-500"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          Marketingplan
                        </p>
                        <InfoTooltip text="Denk aan extra promotie, meer zichtbaarheid of aanvullende advertentie-ondersteuning. Dit kan helpen om meer bereik en bezichtigingen te krijgen. U kunt hieronder zelf een indicatief budget kiezen." />
                      </div>

                      <span
                        className={`shrink-0 text-sm font-semibold ${
                          marketing
                            ? "text-white"
                            : "text-stone-400 line-through"
                        }`}
                      >
                        {euro(marketingCost)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-stone-300">
                      Kies zelf een indicatief budget. Telt alleen mee als u het
                      aanvinkt.
                    </p>

                    <div className="mt-4">
                      <input
                        type="range"
                        min={50}
                        max={1000}
                        step={25}
                        value={marketingCost}
                        onChange={(e) => setMarketingCost(Number(e.target.value))}
                        className="w-full accent-green-500"
                      />

                      <div className="mt-2 flex items-center justify-between text-xs text-stone-300">
                        <span>€50</span>
                        <span>€1.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={presenter}
                  onChange={(e) => setPresenter(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 text-green-600 focus:ring-green-500"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        Presentator
                      </p>
                      <InfoTooltip text="Het is mogelijk om per kijkdag een presentator in te huren voor ongeveer €250 per dag. Vooral interessant als u het lastig vindt om zelf bezichtigingen te begeleiden." />
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-white">
                      {euro(COSTS.presenter)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-stone-300">
                    Alleen aanbevolen als u bezichtigingen liever uitbesteedt.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={floorPlan}
                  onChange={(e) => setFloorPlan(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 text-green-600 focus:ring-green-500"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        Plattegronden
                      </p>
                      <InfoTooltip text="Plattegronden zijn niet verplicht, maar wel sterk aanbevolen. Makelaars laten deze meestal professioneel inmeten en uitwerken. Het geeft kopers snel duidelijkheid over de indeling van de woning." />
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-white">
                      {euro(COSTS.floorPlan)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-stone-300">
                    Niet verplicht, wel sterk aanbevolen voor vertrouwen en
                    duidelijkheid.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-stone-200">
                Totaal extra diensten:
                <span className="ml-2 font-semibold text-white">
                  {euro(extraServicesTotal)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-600/15 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
              Netto besparing
            </p>

            {parsedHomeValue > 0 ? (
              <div className="mt-2">
                <p className="text-sm text-stone-200">
                  Uw besparing na aftrek van de geselecteerde extra diensten:
                </p>

                <div className="mt-3 space-y-1 text-sm text-stone-200">
                  <div className="flex items-center justify-between">
                    <span>Geschatte makelaarskosten</span>
                    <span className="font-semibold text-white">
                      {euro(realtorCosts)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Extra diensten + platformkosten</span>
                    <span className="font-semibold text-white">
                      - {euro(extraServicesTotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-px w-full bg-white/10" />

                <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {euro(netSavings)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-300">
                Vul eerst de waarde van uw woning in om uw netto besparing te
                zien.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}