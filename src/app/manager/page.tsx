import { createClient } from '../../lib/supabase/server';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit,
  Eye,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/manager/StatusBadge';

export default async function ManagerDashboard() {
  const supabase = createClient();

  // 🔥 haal alle listings op
  const { data: listings } = await supabase
    .from('listings')
    .select('*');

  const allListings = listings || [];

  // 🔥 stats berekenen
  const pending = allListings.filter(l => l.status === 'pending').length;
  const active = allListings.filter(l => l.status === 'active').length;
  const sold = allListings.filter(l => l.status === 'sold').length;
  const draft = allListings.filter(l => l.status === 'draft').length;

  // 🔥 recent listings (laatste 5)
  const recentListings = [...allListings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overzicht</h1>
        <p className="text-neutral-500 mt-1">
          {pending > 0
            ? `⚠️ ${pending} listings wachten op goedkeuring`
            : 'Alles is bijgewerkt'}
        </p>
      </div>

      {/* 🔥 BELANGRIJK: pending alert */}
      {pending > 0 && (
        <Link
          href="/manager/listings"
          className="block bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="font-medium text-amber-800">
                {pending} listings wachten op jouw goedkeuring
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-600" />
          </div>
        </Link>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-neutral-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-neutral-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{active}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-neutral-500">Sold</p>
          <p className="text-2xl font-bold text-blue-600">{sold}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-neutral-500">Draft</p>
          <p className="text-2xl font-bold text-neutral-700">{draft}</p>
        </div>

      </div>

      {/* Recent Listings */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Recente listings</h2>
          <Link href="/manager/listings" className="text-sm text-blue-600">
            Bekijk alles
          </Link>
        </div>

        <div>
          {recentListings.map((listing: any) => (
            <div key={listing.id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="font-medium">{listing.title}</p>
                <p className="text-xs text-neutral-500">{listing.city}</p>
              </div>

              <StatusBadge status={listing.status} />
            </div>
          ))}

          {recentListings.length === 0 && (
            <p className="p-4 text-neutral-500">Geen listings</p>
          )}
        </div>
      </div>

    </div>
  );
}