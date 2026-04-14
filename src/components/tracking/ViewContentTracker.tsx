"use client";

import { useEffect } from "react";
import { trackEvent } from "../../lib/fbq";

export default function ViewContentTracker() {
  useEffect(() => {
    trackEvent("ViewContent");
  }, []);

  return null;
}