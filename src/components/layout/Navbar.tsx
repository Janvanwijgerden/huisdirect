"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="HuisDirect"
            width={40}
            height={40}
            className="h-8 w-auto sm:h-10"
            priority
          />
          <span className="truncate text-xl font-bold text-stone-900 sm:text-2xl">
            HuisDirect
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-stone-700">
            <Link href="/hoe-werkt-het" className="transition hover:text-stone-900">
              Hoe het werkt
            </Link>
            <Link href="/listings" className="transition hover:text-stone-900">
              Woningen
            </Link>
            <Link href="/auth/login" className="transition hover:text-stone-900">
              Inloggen
            </Link>
          </nav>

          <Link
            href="/listings/new"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Plaats je woning
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Inloggen
          </Link>

          <Link
            href="/listings/new"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Plaatsen
          </Link>
        </div>
      </div>
    </header>
  );
}