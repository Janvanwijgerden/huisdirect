import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserListings, deleteListing } from '@/lib/actions/listings';
import { formatPrice, formatDate } from '@/lib/utils';
import { Plus, ExternalLink, Trash2, Home, LayoutDashboard } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard');

  const listings = await getUserListings(user.id).catch(() => []);

  const activeListings = listings.filter((l) => l.status === 'active');
  const totalValue = activeListings.reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-stone-900">Dashboard</h1>
          </div>
          <p className="text-stone-500">
            Welcome back, <span className="text-stone-900 font-medium">{user.email}</span>
          </p>
        </div>
        <Link href="/listings/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { label: 'Total listings', value: listings.length, sub: 'all time' },
          { label: 'Active listings', value: activeListings.length, sub: 'currently live' },
          {
            label: 'Portfolio value',
            value: formatPrice(totalValue),
            sub: 'active listings',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-stone-500 text-sm mb-1">{stat.label}</p>
            <p className="font-display text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-stone-400 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-stone-900">My Listings</h2>
          <span className="text-sm text-stone-500">{listings.length} total</span>
        </div>

        {listings.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-2">
              No listings yet
            </h3>
            <p className="text-stone-500 mb-6">List your first property and reach thousands of buyers.</p>
            <Link href="/listings/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors"
              >
                {/* Color indicator */}
                <div
                  className={`w-1.5 h-10 rounded-full flex-shrink-0 ${
                    listing.status === 'active'
                      ? 'bg-green-400'
                      : listing.status === 'sold'
                      ? 'bg-red-400'
                      : 'bg-stone-300'
                  }`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate">{listing.title}</p>
                  <p className="text-sm text-stone-500 truncate">
                    {listing.city} · {formatDate(listing.created_at)}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`hidden md:inline text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    listing.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : listing.status === 'sold'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {listing.status}
                </span>

                {/* Price */}
                <p className="hidden md:block font-display font-bold text-stone-900 text-lg whitespace-nowrap">
                  {formatPrice(listing.price)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    title="View listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await deleteListing(listing.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
