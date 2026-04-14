"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  Home,
  Inbox,
  List,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import TrackButton from "../TrackButton";

type MobileNavMenuProps = {
  isLoggedIn: boolean;
};

export default function MobileNavMenu({
  isLoggedIn,
}: MobileNavMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={open ? "Sluit menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <div className="mb-2 px-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Algemeen
            </p>
          </div>

          <div className="space-y-1">
            <Link
              href="/listings"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Aanbod
            </Link>

            <Link
              href="/hoe-het-werkt"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Hoe het werkt
            </Link>

            <Link
              href="/voor-verkopers"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Voor verkopers
            </Link>

            <Link
              href="/over-ons"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Over ons
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Contact
            </Link>

            {isLoggedIn ? (
              <>
                <div className="mb-2 mt-4 px-2 pt-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Account
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/listings"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <List className="h-4 w-4" />
                  Woning
                </Link>

                <Link
                  href="/dashboard/inbox"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <Inbox className="h-4 w-4" />
                  Inbox
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Instellingen
                </Link>

                <Link
                  href="/dashboard/help"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <CircleHelp className="h-4 w-4" />
                  Help
                </Link>

                <TrackButton
                  href="/listings/new"
                  className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  eventName="Lead"
                  eventData={{ source: "mobile_menu_logged_in" }}
                  onTrackedClick={closeMenu}
                >
                  Plaats woning
                </TrackButton>

                <form action="/auth/logout" className="mt-2">
                  <button
                    type="submit"
                    onClick={closeMenu}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    Uitloggen
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  Inloggen
                </Link>

                <TrackButton
                  href="/auth/register"
                  className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  eventName="Lead"
                  eventData={{ source: "mobile_menu_logged_out" }}
                  onTrackedClick={closeMenu}
                >
                  Plaats woning
                </TrackButton>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}