"use client";

type TrackButtonProps = {
  href: string;
  children: React.ReactNode;
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
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    try {
      if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        (window as any).fbq("track", eventName, eventData);
        console.log(`Meta event fired: ${eventName}`);
      } else {
        console.log("fbq not found");
      }
    } catch (error) {
      console.error("Meta tracking error:", error);
    }

    if (onTrackedClick) {
      onTrackedClick();
    }

    window.setTimeout(() => {
      window.location.assign(href);
    }, 250);
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}