import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../../lib/actions/auth";
import MobileNavMenu from "./MobileNavMenu";
import TrackButton from "../TrackButton";

const navLinks = [
  { href: "/listings", label: "Aanbod" },
  { href: "/hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/voor-verkopers", label: "Voor verkopers" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

function navItemClasses() {
  return "whitespace-nowrap rounded-xl px-3 py-2 text-[15px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900";
}

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-14 sm:w-14">
            <Image
              src="/logo.png"
              alt="HuisDirect"
              width={56}
              height={56}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[1.65rem] font-semibold leading-none tracking-tight text-slate-900 sm:text-[2rem]">
              HuisDirect
            </div>
            <div className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-600 sm:text-xs sm:tracking-[0.28em]">
              Zonder makelaar
            </div>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-2 2xl:flex">
          <div className="flex min-w-0 items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navItemClasses()}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className={navItemClasses()}>
                Mijn account
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex whitespace-nowrap rounded-xl px-3 py-2 text-[15px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <span className="inline-flex items-center gap-2">
                    Uitloggen
                    <LogOut className="h-4 w-4" />
                  </span>
                </button>
              </form>

              <TrackButton
                href="/listings/new"
                className="ml-1 inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                eventName="Lead"
                eventData={{ source: "navbar_desktop_logged_in" }}
              >
                Plaats woning
              </TrackButton>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={navItemClasses()}>
                Inloggen
              </Link>

              <TrackButton
                href="/auth/register"
                className="ml-1 inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                eventName="Lead"
                eventData={{ source: "navbar_desktop_logged_out" }}
              >
                Plaats woning
              </TrackButton>
            </>
          )}
        </nav>

        <div className="hidden sm:block 2xl:hidden">
          <TrackButton
            href="/listings/new"
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            eventName="Lead"
            eventData={{ source: "navbar_compact" }}
          >
            Plaats woning
          </TrackButton>
        </div>

        <div className="2xl:hidden">
          <MobileNavMenu isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}