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
): void {
  if (typeof window === "undefined") {
    return;
  }

  // Prevent duplicate events
  const eventKey = `${eventName}-${JSON.stringify(data || {})}`;
  if (firedEvents.has(eventKey)) {
    console.log(`⚠️ Meta Pixel: Duplicate event prevented: ${eventName}`);
    return;
  }

  if (typeof window.fbq !== "function") {
    console.log(`❌ Meta Pixel: fbq not found for event: ${eventName}`);
    return;
  }

  try {
    window.fbq("track", eventName, data);
    firedEvents.add(eventKey);
    console.log(`✅ Meta Pixel: Event fired successfully: ${eventName}`, data || {});
  } catch (error) {
    console.error("❌ Meta Pixel: tracking failed:", error);
  }
}