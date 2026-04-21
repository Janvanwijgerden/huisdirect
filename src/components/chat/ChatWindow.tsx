"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { ChatCta, ChatQuickAction, ChatUiMessage } from "./chat-types";

type ChatWindowProps = {
  messages: ChatUiMessage[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (message?: string) => void;
  quickActions: ChatQuickAction[];
  ctas: ChatCta[];
};

function animateScrollToBottom(element: HTMLDivElement, duration = 700) {
  const start = element.scrollTop;
  const end = element.scrollHeight - element.clientHeight;
  const change = end - start;

  if (change <= 0) return;

  const startTime = performance.now();

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    element.scrollTop = start + change * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function splitIntoBlocks(content: string): string[] {
  const normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) return [];

  const numberedSeparated = normalized.replace(/\s(?=(\d+\.\s))/g, "\n");

  return numberedSeparated
    .split(/\n\s*\n|\n(?=\d+\.\s)/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function isNumberedBlock(block: string) {
  return /^\d+\.\s/.test(block);
}

function renderMessageContent(content: string) {
  const blocks = splitIntoBlocks(content);

  if (blocks.length === 0) {
    return <p>{content}</p>;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (isNumberedBlock(block)) {
          return (
            <div
              key={`${index}-${block.slice(0, 20)}`}
              className="rounded-2xl border border-stone-200/80 bg-stone-50 px-3 py-2.5"
            >
              <p className="whitespace-pre-line">{block}</p>
            </div>
          );
        }

        return (
          <div
            key={`${index}-${block.slice(0, 20)}`}
            className="rounded-2xl bg-white/70 px-1 py-0.5"
          >
            <p className="whitespace-pre-line">{block}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatWindow({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  quickActions,
  ctas,
}: ChatWindowProps) {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesRef.current) return;
    animateScrollToBottom(messagesRef.current, 700);
  }, [messages]);

  const handleWheelOnMessages = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleCalculatorClick = () => {
    const calculator = document.getElementById("calculator");

    if (calculator) {
      window.dispatchEvent(new Event("open-calculator"));
      return;
    }

    window.location.href = "/#calculator";
  };

  return (
    <div
      className="flex h-[78vh] max-h-[78vh] w-[calc(100vw-1rem)] max-w-[26rem] flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:h-[46rem] sm:max-h-[84vh] sm:w-[27rem] sm:max-w-[27rem]"
      onWheel={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="border-b border-stone-200 bg-white px-4 py-4 sm:px-5">
        <p className="text-[15px] font-semibold text-stone-900">
          HuisDirect assistent
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Eerlijk advies zonder makelaar
        </p>
      </div>

      <div className="border-b border-stone-100 bg-white px-3 py-3 sm:px-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.slice(0, 3).map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onSubmit(action.prompt)}
              className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={messagesRef}
        onWheel={handleWheelOnMessages}
        className="flex-1 overflow-y-auto overscroll-none bg-stone-50/70 px-3 py-3 sm:px-4 sm:py-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="space-y-3.5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[92%] rounded-[1.35rem] px-4 py-3 text-[15px] leading-7 shadow-sm sm:max-w-[87%] ${
                  message.role === "assistant"
                    ? "border border-stone-200 bg-white text-stone-900"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {message.role === "assistant" ? (
                  renderMessageContent(message.content)
                ) : (
                  <p className="whitespace-pre-line">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[92%] rounded-[1.35rem] border border-stone-200 bg-white px-4 py-3 text-[15px] leading-7 text-stone-400 shadow-sm sm:max-w-[87%]">
                Even nadenken...
              </div>
            </div>
          )}
        </div>
      </div>

      {ctas.length > 0 && (
        <div className="border-t border-stone-100 bg-white px-3 py-3 sm:px-4">
          <div className="flex flex-wrap gap-2">
            {ctas.map((cta) => {
              if (cta.action === "open_calculator") {
                return (
                  <button
                    key={cta.label}
                    type="button"
                    onClick={handleCalculatorClick}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {cta.label}
                  </button>
                );
              }

              return (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href || "#"}
                  className={
                    cta.variant === "primary"
                      ? "rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      : "rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
                  }
                >
                  {cta.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-stone-200 bg-white p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Stel je vraag..."
            rows={1}
            className="max-h-28 min-h-[50px] flex-1 resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-500"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
          />

          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={isLoading}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            Verstuur
          </button>
        </div>
      </div>
    </div>
  );
}