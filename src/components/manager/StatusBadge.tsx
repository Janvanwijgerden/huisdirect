import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ListingStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'sold';

interface StatusBadgeProps {
  status: ListingStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as ListingStatus;

  const styleMap: Record<ListingStatus, string> = {
    draft: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    sold: 'bg-blue-50 text-blue-700 border border-blue-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };

  // Fallback map if the string doesn't perfectly match our strict type
  const matchingStyle = styleMap[normalizedStatus] || styleMap.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide',
        matchingStyle,
        className
      )}
    >
      {status}
    </span>
  );
}
