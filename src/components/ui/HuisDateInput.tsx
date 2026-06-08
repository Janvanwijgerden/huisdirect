"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import HuisInfoTooltip from "./HuisInfoTooltip";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDisplay(iso?: string | null) {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function parseDateInput(value: string) {
  const text = value.trim();
  const dutch = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(text);
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);

  const parts = dutch
    ? { day: Number(dutch[1]), month: Number(dutch[2]), year: Number(dutch[3]) }
    : iso
      ? { day: Number(iso[3]), month: Number(iso[2]), year: Number(iso[1]) }
      : null;

  if (!parts) return null;

  const date = new Date(parts.year, parts.month - 1, parts.day);
  if (
    date.getFullYear() !== parts.year ||
    date.getMonth() !== parts.month - 1 ||
    date.getDate() !== parts.day
  ) {
    return null;
  }

  return toIso(date);
}

function parseIso(value?: string | null) {
  const iso = parseDateInput(value || "");
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];
const YEARS_PER_PAGE = 12;

function getYearRangeStart(year: number) {
  return year - (year % 10);
}

export default function HuisDateInput({
  label,
  name,
  defaultValue,
  helperText,
  infoText,
  required,
  maxDate,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  helperText?: string;
  infoText?: string;
  required?: boolean;
  maxDate?: Date;
}) {
  const containerRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextFocusOpenRef = useRef(false);
  const initialIso = parseDateInput(defaultValue || "") || "";
  const maxIso = maxDate ? toIso(maxDate) : null;
  const [isOpen, setIsOpen] = useState(false);
  const [isoValue, setIsoValue] = useState(initialIso);
  const [displayValue, setDisplayValue] = useState(formatDisplay(initialIso));
  const [viewDate, setViewDate] = useState(parseIso(initialIso) || new Date());
  const [mode, setMode] = useState<"days" | "years">("days");
  const [yearRangeStart, setYearRangeStart] = useState(
    getYearRangeStart((parseIso(initialIso) || new Date()).getFullYear())
  );
  const [error, setError] = useState("");

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setMode("days");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setMode("days");
        inputRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: startOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [viewDate]);

  function commitIso(iso: string) {
    if (maxIso && iso > maxIso) {
      setError("Deze datum mag niet in de toekomst liggen.");
      return;
    }

    setIsoValue(iso);
    setDisplayValue(formatDisplay(iso));
    const date = parseIso(iso);
    if (date) setViewDate(date);
    setError("");
  }

  function handleTypedValue(value: string) {
    setDisplayValue(value);
    if (!value.trim()) {
      setIsoValue("");
      setError("");
      return;
    }

    const parsed = parseDateInput(value);
    if (parsed) {
      if (maxIso && parsed > maxIso) {
        setError("Deze datum mag niet in de toekomst liggen.");
        return;
      }

      commitIso(parsed);
    } else {
      setError("Gebruik dd-mm-jjjj.");
    }
  }

  function handleConfirm() {
    const parsed = parseDateInput(displayValue);
    if (displayValue.trim() && parsed) commitIso(parsed);
    skipNextFocusOpenRef.current = true;
    setIsOpen(false);
    setMode("days");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const todayIso = toIso(new Date());
  const todayButtonIso = maxIso && todayIso > maxIso ? maxIso : todayIso;

  return (
    <label ref={containerRef} className="relative block min-w-0">
      <input type="hidden" name={name} value={isoValue} />
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-neutral-800">
        <span className="min-w-0">{label}</span>
        {required ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Verplicht
          </span>
        ) : null}
        {infoText ? <HuisInfoTooltip title={label} content={infoText} /> : null}
      </span>
      <div className="mt-2 flex h-12 w-full min-w-0 items-center rounded-2xl border border-neutral-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder="dd-mm-jjjj"
          onFocus={() => {
            if (skipNextFocusOpenRef.current) {
              skipNextFocusOpenRef.current = false;
              return;
            }

            setIsOpen(true);
          }}
          onChange={(event) => handleTypedValue(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
        />
        <button
          type="button"
          aria-label="Kalender openen"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-neutral-500 transition hover:text-emerald-700"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>
      {helperText ? (
        <p className="mt-2 text-sm leading-6 text-neutral-500">{helperText}</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      {isOpen ? (
        <div className="absolute left-0 z-50 mt-2 w-[min(100%,calc(100vw-2rem))] max-w-[23rem] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl ring-1 ring-black/5 sm:w-[23rem]">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (mode === "years") {
                  setYearRangeStart((start) => start - 10);
                  return;
                }

                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                );
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setYearRangeStart(getYearRangeStart(viewDate.getFullYear()));
                setMode("years");
              }}
              className="min-h-9 rounded-xl px-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-100"
            >
              {mode === "years"
                ? `${yearRangeStart} - ${yearRangeStart + YEARS_PER_PAGE - 1}`
                : `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
            </button>
            <button
              type="button"
              onClick={() => {
                if (mode === "years") {
                  setYearRangeStart((start) => start + 10);
                  return;
                }

                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                );
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {mode === "years" ? (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: YEARS_PER_PAGE }, (_, index) => {
                  const year = yearRangeStart + index;
                  const isActive = year === viewDate.getFullYear();
                  const isDisabled = maxDate
                    ? year > maxDate.getFullYear()
                    : false;

                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setViewDate(new Date(year, viewDate.getMonth(), 1));
                        setMode("days");
                      }}
                      className={`rounded-xl px-2 py-3 text-sm transition ${
                        isDisabled
                          ? "cursor-not-allowed text-neutral-300"
                          : isActive
                            ? "bg-emerald-600 font-semibold text-white hover:bg-emerald-600"
                            : "text-neutral-700 hover:bg-emerald-50"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-500">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) return <div key={`blank-${index}`} />;
                  const iso = toIso(
                    new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                  );
                  const isSelected = iso === isoValue;
                  const isToday = iso === todayIso;
                  const isDisabled = maxIso ? iso > maxIso : false;

                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => commitIso(iso)}
                      className={`flex h-9 items-center justify-center rounded-xl text-sm transition ${
                        isDisabled
                          ? "cursor-not-allowed text-neutral-300"
                          : isSelected
                            ? "bg-emerald-600 font-semibold text-white hover:bg-emerald-600"
                            : isToday
                              ? "font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
                              : "text-neutral-700 hover:bg-emerald-50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-neutral-100 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsoValue("");
                setDisplayValue("");
                setError("");
              }}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700"
            >
              Wissen
            </button>
            <button
              type="button"
              onClick={() => commitIso(todayButtonIso)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700"
            >
              Vandaag
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </label>
  );
}
