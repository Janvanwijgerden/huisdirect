"use client";

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";

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
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, eventData);
      console.log(`Meta event fired: ${eventName}`);
    }

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