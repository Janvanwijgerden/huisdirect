"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

export default function HuisDisclosure({
  title,
  helperText,
  children,
}: {
  title: string;
  helperText?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-start justify-between gap-3 p-3 text-left sm:gap-4 sm:p-4"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-neutral-950">
            {title}
          </span>
          {helperText ? (
            <span className="mt-1 block text-sm leading-5 text-neutral-600 sm:leading-6">
              {helperText}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-neutral-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-neutral-200 p-3 sm:p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
