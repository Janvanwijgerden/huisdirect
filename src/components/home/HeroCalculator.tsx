"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import TrackButton from "../TrackButton";

const REALTOR_PERCENTAGE = 1.35;
const PLATFORM_PRICE = 195;
const INTRO_FREE = true;

const COSTS = {
  photographer: 450,
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

function fireMetaEvent(eventName: string, eventData?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", eventName, eventData);
      console.log(`Meta event fired: ${eventName}`);
    } else {
      console.log("fbq not found");
    }
  } catch (error) {
    console.error("Meta tracking error:", error);
  }
}

function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Meer informatie"
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 120);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/10 text-stone-200 transition hover:bg-white/20"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      <span
        className={`absolute left-1/2 top-full z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-stone-950/95 p-3 text-left text-xs leading-relaxed text-stone-200 shadow-xl transition sm:left-full sm:top-1/2 sm:mt-0 sm:ml-3 sm:w-72 sm:translate-x-0 sm:-translate-y-1/2 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {text}
      </span>
    </span>
  );
}

export default function HeroCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [homeValue, setHomeValue] = useState("");

  const [photographer, setPhotographer] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [marketingCost, setMarketingCost] = useState(250);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const hasFlyerTracking =
      params.get("utm_source") === "flyer" ||
      params.get("utm_medium") === "offline" ||
      params.get("utm_campaign") === "giessenburg";

    const shouldOpenCalculator =
      window.location.hash === "#calculator" || hasFlyerTracking;

    if (shouldOpenCalculator) {
      setIsOpen(true);

      fireMetaEvent("InitiateCheckout", {
        source: hasFlyerTracking ? "flyer_auto_open" : "hash_auto_open",
      });

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
    let total = platformCost;

    if (photographer) total += COSTS.photographer;
    if (marketing) total += marketingCost;

    return total;
  }, [photographer, marketing, marketingCost, platformCost]);

  const netSavings = useMemo(() => {
    return Math.max(realtorCosts - extraServicesTotal, 0);
  }, [realtorCosts, extraServicesTotal]);

  const selectedExtrasCount = useMemo(() => {
    let total = 0;
    if (photographer) total += 1;
    if (marketing) total += 1;
    return total;
  }, [photographer, marketing]);

  function handleCalculatorToggle() {
    setIsOpen((prev) => {
      const next = !prev;

      if (next) {
        fireMetaEvent("InitiateCheckout", {
          source: "hero_calculator_toggle",
        });
      }

      return next;
    });
  }

  return (
    <div id="calculator" className="mt-8 w-full max-w-3xl scroll-mt-24">
      <button
        type="button"
        onClick={handleCalculatorToggle}
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98] sm:w-auto sm:justify-start sm:px-6"
      >
        <span>Bereken direct uw besparing</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-200 sm:text-xs">
                Bespaar op makelaarskosten
              </span>

              <h3 className="mt-3 font-sans text-xl font-bold leading-tight sm:text-3xl">
                Ontdek in 30 seconden hoeveel u kunt besparen
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-200 sm:text-base">
                Veel verkopers betalen ongemerkt duizenden euro&apos;s aan
                makelaarskosten. Met HuisDirect houdt u de regie in eigen hand
                en blijft er vaak aanzienlijk meer over.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                  Stap 1
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  Vul uw woningwaarde in
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                  Stap 2
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  Bekijk wat een makelaar u ongeveer kost
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                  Stap 3
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  Kies alleen de extra hulp die u echt wilt
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
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

            <p className="mt-2 text-xs leading-relaxed text-stone-300">
              We rekenen met een indicatief makelaarstarief van{" "}
              <span className="font-semibold text-white">
                {REALTOR_PERCENTAGE.toFixed(2).replace(".", ",")}%
              </span>
              . In de praktijk kan dit hoger of lager uitvallen.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
              Wat een makelaar u ongeveer kost
            </p>

            {parsedHomeValue > 0 ? (
              <div className="mt-2">
                <p className="text-sm text-stone-200">
                  Bij een woningwaarde van{" "}
                  <span className="font-semibold text-white">
                    {euro(parsedHomeValue)}
                  </span>
                </p>

                <p className="mt-2 break-words text-3xl font-bold text-white sm:text-4xl">
                  {euro(realtorCosts)}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-green-100/90">
                  Dat is geld dat u mogelijk grotendeels zelf kunt houden.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-300">
                Vul eerst de waarde van uw woning in.
              </p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h4 className="text-base font-semibold text-white">
                  Wat kost verkopen via HuisDirect?
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-stone-300">
                  Houd het simpel. Kies alleen wat echt waarde toevoegt aan uw
                  verkoop. Hoe minder u aanvinkt, hoe hoger uw besparing blijft.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300">
                Geselecteerde extra&apos;s:{" "}
                <span className="font-semibold text-white">
                  {selectedExtrasCount}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      Plaatsing via HuisDirect
                    </p>
                    <p className="mt-1 text-sm text-stone-300">
                      {INTRO_FREE
                        ? "Introductieactie: uw woning nu gratis plaatsen."
                        : "Vaste lage prijs voor plaatsing op HuisDirect."}
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

              <label className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/[0.07]">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={photographer}
                    onChange={(e) => setPhotographer(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 text-green-600 focus:ring-green-500"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            Professionele fotograaf
                          </p>
                          <InfoTooltip text="Goede foto's zijn vaak de beste investering rondom verkoop. Ze zorgen voor meer aandacht, meer kliks en een sterkere eerste indruk." />
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-white">
                        {euro(COSTS.photographer)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-stone-300">
                      Aanbevolen als u uw woning direct sterk en professioneel wilt
                      presenteren.
                    </p>
                  </div>
                </div>
              </label>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/[0.07]">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 text-green-600 focus:ring-green-500"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            Extra marketingbudget
                          </p>
                          <InfoTooltip text="Extra promotie kan helpen om sneller meer bereik, bezichtigingen en serieuze interesse te krijgen. U kiest zelf het budget." />
                        </div>
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

                    <p className="mt-1 text-sm leading-relaxed text-stone-300">
                      Alleen interessant als u extra zichtbaarheid wilt. Niet
                      nodig om veel te besparen.
                    </p>

                    <div className="mt-4">
                      <input
                        type="range"
                        min={250}
                        max={1000}
                        step={25}
                        value={marketingCost}
                        onChange={(e) => setMarketingCost(Number(e.target.value))}
                        className="w-full accent-green-500"
                      />

                      <div className="mt-2 flex items-center justify-between text-xs text-stone-300">
                        <span>€250</span>
                        <span>€1.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/10 px-4 py-3">
                <p className="text-sm font-medium text-white">
                  Slimme hulp zonder onnodige kosten
                </p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-100/90">
                  Plattegronden en presentatie zijn belangrijk, maar die zetten
                  we hier bewust niet als extra drempel neer. HuisDirect moet
                  vooral voelen als een slimme manier om geld over te houden,
                  niet als een nieuwe stapel kosten.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-stone-200">
                Totale gekozen kosten via HuisDirect:
                <span className="ml-2 font-semibold text-white">
                  {euro(extraServicesTotal)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-600/15 px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
              Uw mogelijke besparing
            </p>

            {parsedHomeValue > 0 ? (
              <div className="mt-2">
                <p className="text-sm leading-relaxed text-stone-200">
                  Dit is het verschil tussen geschatte makelaarskosten en de
                  opties die u hierboven zelf kiest.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-stone-200">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <span>Geschatte makelaarskosten</span>
                    <span className="text-right font-semibold text-white">
                      {euro(realtorCosts)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <span>Uw gekozen kosten via HuisDirect</span>
                    <span className="text-right font-semibold text-white">
                      - {euro(extraServicesTotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-px w-full bg-white/10" />

                <p className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">
                  {euro(netSavings)}
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-green-100/90">
                  Dat is geld dat u niet aan een traditionele makelaar hoeft af
                  te staan.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <TrackButton
                    href="/listings/new"
                    className="inline-flex items-center justify-center rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-400 active:scale-[0.98]"
                    eventName="Lead"
                    eventData={{ source: "hero_calculator" }}
                  >
                    Plaats uw woning
                  </TrackButton>

                  <Link
                    href="/voor-verkopers"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                  >
                    Bekijk hoe het werkt
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-300">
                Vul eerst de waarde van uw woning in om uw mogelijke besparing
                te zien.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}