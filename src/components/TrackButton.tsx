"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type TrackButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  eventName?: string;
  eventData?: Record<string, unknown>;
  onTrackedClick?: () => void;
  delayMs?: number;
};

export default function TrackButton({
  href,
  children,
  className,
  eventName = "Lead",
  eventData,
  onTrackedClick,
  delayMs = 180,
}: TrackButtonProps) {
  const router = useRouter();

  function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
    return (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    );
  }

  function navigate() {
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }

    window.location.href = href;
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Laat browser default gedrag toe voor:
    // - nieuwe tab
    // - middelste muisknop
    // - modified clicks
    if (isModifiedEvent(e)) {
      return;
    }

    e.preventDefault();

    try {
      if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        let didNavigate = false;

        const safeNavigate = () => {
          if (didNavigate) return;
          didNavigate = true;
          navigate();
        };

        (window as any).fbq("track", eventName, eventData);

        if (onTrackedClick) {
          onTrackedClick();
        }

        window.setTimeout(safeNavigate, delayMs);
        return;
      }
    } catch (error) {
      console.error("Meta tracking error:", error);
    }

    if (onTrackedClick) {
      onTrackedClick();
    }

    navigate();
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}