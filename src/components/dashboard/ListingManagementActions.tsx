"use client";

import { deleteListing, unpublishListing } from "../../lib/actions/listings";

type ListingManagementActionsProps = {
  listingId: string;
  isLive: boolean;
};

export default function ListingManagementActions({
  listingId,
  isLive,
}: ListingManagementActionsProps) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      {isLive && (
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
            className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
          >
            Woning offline halen
          </button>
        </form>
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
          className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Woning verwijderen
        </button>
      </form>
    </div>
  );
}