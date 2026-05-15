"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { generateSaleContract } from "../../lib/actions/sale-cases";

type LatestContractDocument = {
  public_url: string | null;
  version: number;
  created_at: string;
};

function formatGeneratedDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SaleContractActions({
  saleCaseId,
  latestDocument,
}: {
  saleCaseId: string;
  latestDocument: LatestContractDocument | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hasDocument = Boolean(latestDocument);

  function handleGenerate() {
    setError(null);

    startTransition(async () => {
      try {
        const result = await generateSaleContract(saleCaseId);
        router.refresh();
        window.open(result.publicUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Koopovereenkomst genereren mislukt."
        );
      }
    });
  }

  return (
    <div className="mt-5 space-y-3">
      {hasDocument && latestDocument?.public_url ? (
        <a
          href={latestDocument.public_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Koopovereenkomst downloaden
        </a>
      ) : null}

      <button
        type="button"
        disabled={isPending}
        onClick={handleGenerate}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
      >
        {hasDocument ? (
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isPending
          ? "Koopovereenkomst genereren..."
          : hasDocument
          ? "Opnieuw genereren"
          : "Koopovereenkomst genereren"}
      </button>

      {latestDocument ? (
        <p className="text-xs leading-5 text-neutral-500">
          Laatste versie: v{latestDocument.version}, gegenereerd op{" "}
          {formatGeneratedDate(latestDocument.created_at)}.
        </p>
      ) : (
        <p className="text-xs leading-5 text-neutral-500">
          Er is nog geen koopovereenkomst gegenereerd voor dit dossier.
        </p>
      )}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
