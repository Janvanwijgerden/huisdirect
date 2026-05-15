"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HuisSelectOption = {
  value: string;
  label: string;
};

export default function HuisSelect({
  label,
  name,
  defaultValue,
  options,
  required,
  helperText,
  className = "",
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: HuisSelectOption[];
  required?: boolean;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        disabled={disabled}
      />

      <span className="block text-sm font-semibold text-neutral-800">
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="mt-2 flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 text-left text-sm text-neutral-950 outline-none transition hover:border-neutral-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-neutral-50 disabled:text-neutral-400"
      >
        <span className={selectedOption ? "truncate" : "truncate text-neutral-400"}>
          {selectedOption?.label ?? "Maak een keuze"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {helperText ? (
        <p className="mt-2 text-sm leading-6 text-neutral-500">{helperText}</p>
      ) : null}

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-2 max-h-[60vh] w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setValue(option.value);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }}
                className={`flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition hover:bg-emerald-50 ${
                  isSelected
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-neutral-800"
                }`}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
