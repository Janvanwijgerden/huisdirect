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

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, eventData);
      console.log(`Meta event fired: ${eventName}`);
    } else {
      console.log("fbq not found");
    }

    if (onTrackedClick) {
      onTrackedClick();
    }

    setTimeout(() => {
      window.location.href = href;
    }, 150);
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}