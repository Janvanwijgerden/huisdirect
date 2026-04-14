"use client";

import { useEffect } from "react";
import { createDraftListing } from "../../../../lib/actions/listings";
import NewListingStartForm from "../../../../components/listings/new/new-listing-start-form";

export default function NewListingPage() {
  useEffect(() => {
    // 🔥 Lead event bij openen pagina
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
      console.log("🔥 Lead event fired (page load)");
    } else {
      console.log("❌ fbq not found");
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <NewListingStartForm action={createDraftListing} />
        </div>
      </section>
    </main>
  );
}