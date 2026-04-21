"use client";

type ChatLauncherProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function ChatLauncher({
  isOpen,
  onClick,
}: ChatLauncherProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Sluit chat" : "Open chat"}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition hover:bg-green-700 active:scale-[0.98]"
    >
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
}