"use client";

import Link from "next/link";
import { CalendarDays, MessageSquare } from "lucide-react";

type MobileStickyCTAProps = {
  primaryHref?: string;
  secondaryHref?: string;
};

export default function MobileStickyCTA({
  primaryHref = "#lead-form",
  secondaryHref = "#lead-form",
}: MobileStickyCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200/60 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:hidden">
      <div className="mx-auto flex max-w-7xl gap-3 px-4 py-3">
        <Link
          href={secondaryHref}
          className="inline-flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          <MessageSquare className="h-4 w-4" />
          Contact
        </Link>

        <Link
          href={primaryHref}
          className="inline-flex h-[48px] flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <CalendarDays className="h-4 w-4" />
          Plan bezichtiging
        </Link>
      </div>
    </div>
  );
}