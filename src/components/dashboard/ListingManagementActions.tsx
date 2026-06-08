"use client";

import Link from "next/link";
import { ChevronRight, FileText, Pencil } from "lucide-react";
import {
  deleteListing,
  markListingAsSold,
  unpublishListing,
} from "../../lib/actions/listings";

type ListingManagementActionsProps = {
  listingId: string;
  isLive: boolean;
  isRejected?: boolean;
  canGenerateContract?: boolean;
  publicPath: string;
};

export default function ListingManagementActions({
  listingId,
  isLive,
  isRejected = false,
  canGenerateContract = true,
  publicPath,
}: ListingManagementActionsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Link
        href={`/listings/${listingId}/edit`}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-100"
      >
        <Pencil className="h-4 w-4" />
        Bewerken
      </Link>

      {isLive ? (
        <Link
          href={publicPath}
          target="_blank"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-100"
        >
          Bekijk advertentie
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link
          href={`/listings/${listingId}/edit`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-100"
        >
          {isRejected ? "Pas aan" : "Compleet maken"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {canGenerateContract ? (
        <Link
          href={`/dashboard/verkoopdossier/${listingId}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-center text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
        >
          <FileText className="h-4 w-4" />
          Genereer koopovereenkomst
        </Link>
      ) : null}

      {isLive && (
        <>
          <form
            action={markListingAsSold.bind(null, listingId)}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                "Weet u zeker dat u deze woning als verkocht wilt markeren?"
              );

              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="min-h-12 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              Markeer als verkocht
            </button>
          </form>

          <form
            action={unpublishListing.bind(null, listingId)}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                "Weet u zeker dat u deze woning offline wilt halen?"
              );

              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="min-h-12 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              Woning offline halen
            </button>
          </form>
        </>
      )}

      <form
        action={deleteListing.bind(null, listingId)}
        onSubmit={(event) => {
          const confirmed = window.confirm(
            "Weet u het zeker dat u deze woning wilt verwijderen?"
          );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
        >
          Woning verwijderen
        </button>
      </form>
    </div>
  );
}
