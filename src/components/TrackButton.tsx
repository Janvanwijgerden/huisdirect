"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { trackEvent } from "../lib/fbq";

type TrackButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  eventName?: string;
  eventData?: Record<string, unknown>;
  onTrackedClick?: () => void;
};

export default function TrackButton({
  href,
  children,
  className,
  eventName = "Lead",
  eventData,
  onTrackedClick,
}: TrackButtonProps) {
  function fireEvent() {
    trackEvent(eventName, eventData);

    if (onTrackedClick) {
      onTrackedClick();
    }
  }

  function handleClick() {
    fireEvent();
  }

  function handleAuxClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button === 1) {
      fireEvent();
    }
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
    >
      {children}
    </Link>
  );
}