"use client";

import { useEffect, useRef } from "react";

type Props = {
  listingId: string;
};

export default function ViewContentTracker({ listingId }: Props) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    hasTracked.current = true;

    const track = async () => {
      try {
        await fetch("/api/listing-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId,
            eventType: "view",
            source: "listing_page",
          }),
        });
      } catch (error) {
        console.error("View tracking failed");
      }
    };

    track();
  }, [listingId]);

  return null;
}