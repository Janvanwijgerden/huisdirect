import { createClient } from '../../../lib/supabase/server';
import { StatusBadge } from '../../../components/manager/StatusBadge';
import { Eye, Check, X } from 'lucide-react';
import { approveListing, rejectListingWithReason } from '../../../lib/actions/listings';

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();

  const filter = searchParams?.status || 'all';

  const { data: listings } = await supabase
    .from('listings')
    .select('*');

  let allListings = listings || [];

  allListings = allListings.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredListings =
    filter === 'all'
      ? allListings
      : allListings.filter((l) => l.status === filter);

  const statuses = ['all', 'pending', 'active', 'rejected', 'sold', 'draft'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Listings</h1>
        <p className="text-neutral-500">
          Beheer en controleer alle woningen op het platform
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <a
            key={status}
            href={
              status === 'all'
                ? '/manager/listings'
                : `/manager/listings?status=${status}`
            }
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              filter === status
                ? 'bg-black text-white'
                : 'bg-white hover:bg-neutral-100'
            }`}
          >
            {status}
          </a>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="text-left px-6 py-4">Titel</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Datum</th>
              <th className="text-right px-6 py-4">Acties</th>
            </tr>
          </thead>

          <tbody>
            {filteredListings.map((listing: any) => (
              <tr
                key={listing.id}
                className={`border-b align-top ${
                  listing.status === 'pending' ? 'bg-amber-50/40' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <p className="font-medium">{listing.title}</p>
                  <p className="text-xs text-neutral-500">{listing.city}</p>

                  {listing.status === 'rejected' && listing.rejection_reason && (
                    <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-xs font-semibold text-red-800">
                        Afwijsreden
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {listing.rejection_reason}
                      </p>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={listing.status} />
                </td>

                <td className="px-6 py-4 text-neutral-500">
                  {new Date(listing.created_at).toLocaleDateString('nl-NL')}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 mb-3">
                    <a
                      href={`/listings/${listing.id}`}
                      target="_blank"
                      className="p-2 hover:bg-neutral-100 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </a>

                    {listing.status === 'pending' && (
                      <form action={approveListing.bind(null, listing.id)}>
                        <button
                          type="submit"
                          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded"
                          title="Goedkeuren"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>

                  {listing.status === 'pending' && (
                    <form
                      action={rejectListingWithReason.bind(null, listing.id)}
                      className="flex flex-col items-end gap-2"
                    >
                      <textarea
                        name="rejection_reason"
                        placeholder="Waarom wijs je deze listing af?"
                        className="w-72 rounded-lg border border-neutral-300 px-3 py-2 text-xs resize-none"
                        rows={3}
                        required
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium"
                      >
                        <X className="w-4 h-4" />
                        Afwijzen met reden
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}

            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-neutral-500">
                  Geen listings gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}