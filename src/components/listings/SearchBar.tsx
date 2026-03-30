'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const city = (form.elements.namedItem('city') as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams.toString());
    if (city) params.set('city', city);
    else params.delete('city');
    startTransition(() => {
      router.push(`/listings?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white rounded-2xl shadow-xl shadow-stone-900/10 p-2 max-w-xl w-full"
    >
      <div className="flex-1 flex items-center gap-3 px-3">
        <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
        <input
          name="city"
          type="text"
          placeholder="Zoek op stad, buurt..."
          defaultValue={searchParams.get('city') || ''}
          className="w-full bg-transparent py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary rounded-xl"
      >
        {isPending ? 'Searching...' : 'Zoeken'}
      </button>
    </form>
  );
}
