"use client";

import { useEffect } from "react";

export default function ViewContentTracker() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent");
      console.log("👁️ ViewContent fired");
    } else {
      console.log("❌ fbq not found (ViewContent)");
    }
  }, []);

  return null;
}