"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Inbox,
  List,
  CircleHelp,
  LogOut,
  Settings,
  Building2,
} from "lucide-react";
import { signOut } from "../../lib/actions/auth";

type AppSidebarProps = {
  listingCount?: number;
};

export default function AppSidebar({
  listingCount = 1,
}: AppSidebarProps) {
  const pathname = usePathname();

  const hasMultipleListings = listingCount > 1;
  const listingsLabel = hasMultipleListings ? "Woningen" : "Woning";
  const listingsSummary = hasMultipleListings
    ? `${listingCount} woningen actief`
    : "1 woning actief";

  const navItems = [
    {
      href: "/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      href: "/dashboard/inbox",
      label: "Inbox",
      icon: Inbox,
      soon: true,
    },
    {
      href: "/dashboard/listings",
      label: listingsLabel,
      icon: List,
      count: listingCount > 0 ? listingCount : undefined,
    },
    {
      href: "/dashboard/settings",
      label: "Instellingen",
      icon: Settings,
    },
    {
      href: "/dashboard/help",
      label: "Help",
      icon: CircleHelp,
      soon: true,
    },
  ];

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-[272px] shrink-0 border-r border-slate-200 bg-white xl:block">
      <div className="flex h-full flex-col overflow-hidden px-5 py-6">
        <div className="flex-1 overflow-y-auto pr-1">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.label}
                  </span>

                  <span className="flex items-center gap-2">
                    {typeof item.count === "number" && item.count > 1 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isActive
                            ? "bg-white text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}

                    {item.soon && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        Later
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                <Building2 className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {hasMultipleListings ? "Je woningen" : "Je woning"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {listingsSummary}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Overzicht
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {hasMultipleListings
                  ? "Je account is nu ingericht voor meerdere woningen. Beheer ze vanuit één rustige omgeving."
                  : "Je account is ingericht op één woning, maar is klaar voor uitbreiding als je later nog een woning toevoegt."}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <LogOut className="h-5 w-5" />
                </span>
                Uitloggen
              </span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}