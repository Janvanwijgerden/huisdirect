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

// Keep track of fired events in this session to prevent duplicates
const firedEvents = new Set<string>();

export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    // Prevent duplicate events safely
    const eventKey = `${eventName}-${JSON.stringify(data || {})}`;
    if (firedEvents.has(eventKey)) {
      console.log(`⚠️ Meta Pixel: Duplicate event prevented: ${eventName}`);
      return true; // Treat as "handled" so we don't spam fallbacks, but skip sending
    }

    if (typeof window.fbq !== "function") {
      console.log(`❌ Meta Pixel: fbq not found for event: ${eventName}`);
      return false;
    }

    window.fbq("track", eventName, data);
    firedEvents.add(eventKey);
    console.log(`✅ Meta Pixel: Event fired successfully: ${eventName}`, data || {});
    return true;

  } catch (error) {
    console.error("❌ Meta Pixel: tracking failed:", error);
    return false;
  }
}