"use client";

type FbqFunction = (
  action: string,
  eventName: string,
  data?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq !== "function") {
    return;
  }

  try {
    window.fbq("track", eventName, data);
  } catch (error) {
    console.error("Meta Pixel tracking failed:", error);
  }
}