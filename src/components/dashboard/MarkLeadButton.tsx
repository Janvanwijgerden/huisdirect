'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { updateLeadStatus } from '../../lib/actions/leads';

export default function MarkLeadButton({ leadId }: { leadId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (isPending) return;
    setIsPending(true);
    
    try {
      await updateLeadStatus(leadId, 'contacted');
    } catch (error) {
      console.error("Failed to update lead", error);
      setIsPending(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-stone-100 flex-none relative">
      <button 
        onClick={handleClick}
        disabled={isPending}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 hover:shadow-md hover:-translate-y-0.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle className="h-4 w-4" />
        {isPending ? 'Moment...' : 'Markeer als opgevolgd'}
      </button>
    </div>
  );
}
