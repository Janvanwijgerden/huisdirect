"use client";

import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HuisInfoTooltip({
  title,
  content,
}: {
  title?: string;
  content: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const skipNextClickRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label={title ? `Toelichting: ${title}` : "Toelichting"}
        onPointerDown={(event) => {
          event.stopPropagation();

          if (event.pointerType !== "mouse") {
            event.preventDefault();
            skipNextClickRef.current = true;
            setIsOpen((open) => !open);
          }
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (skipNextClickRef.current) {
            skipNextClickRef.current = false;
            return;
          }

          setIsOpen((open) => !open);
        }}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {isOpen ? (
        <span className="fixed left-4 right-4 top-20 z-[100] box-border max-w-[calc(100vw-2rem)] rounded-xl border border-stone-200 bg-white p-4 text-left shadow-xl ring-1 ring-black/5 sm:absolute sm:left-0 sm:right-auto sm:top-8 sm:w-80 sm:max-w-[20rem]">
          {title ? (
            <span className="block min-w-0 whitespace-normal break-words text-sm font-semibold text-stone-950">
              {title}
            </span>
          ) : null}
          <span className="mt-1 block min-w-0 whitespace-normal break-words text-sm leading-6 text-stone-600">
            {content}
          </span>
        </span>
      ) : null}
    </span>
  );
}
