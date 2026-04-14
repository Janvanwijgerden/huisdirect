import { Eye, MessageSquare, MousePointerClick, TrendingUp, BarChart, ArrowUpRight } from 'lucide-react';

export default function StatisticsPage() {
  const statCards = [
    { label: 'Totaal Weergaven', value: '45.2K', change: '+12.5%', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Nieuwe Leads', value: '891', change: '+18.2%', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Conversie', value: '3.2%', change: '+0.4%', icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const topListings = [
    { id: 1, title: 'Prinsengracht 123', views: '2,340', leads: '45', conversion: '1.9%' },
    { id: 2, title: 'Coolsingel 45', views: '1,890', leads: '32', conversion: '1.7%' },
    { id: 3, title: 'Vredenburg 8', views: '1,650', leads: '28', conversion: '1.7%' },
    { id: 4, title: 'Keizersgracht 90', views: '1,200', leads: '24', conversion: '2.0%' },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Statistics</h1>
        <p className="text-neutral-500 mt-1">Analyseer prestaties van het platform en woningen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
              <p className="text-sm font-medium text-neutral-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Placeholder for Chart */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 flex flex-col h-96">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Weergaven over tijd</h2>
            <select className="text-sm border-neutral-200 rounded-md text-neutral-600 focus:ring-neutral-900 focus:border-neutral-900">
              <option>Laatste 30 dagen</option>
              <option>Laatste 7 dagen</option>
              <option>Dit jaar</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
            <div className="text-center text-neutral-400">
              <BarChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Grafiek data (Placeholder)</p>
            </div>
          </div>
        </div>

        {/* Top Performing Listings */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-96">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Populairste Woningen
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3">Woning</th>
                  <th className="px-6 py-3 text-right">Weergaven</th>
                  <th className="px-6 py-3 text-right">Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {topListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-neutral-900">{listing.title}</td>
                    <td className="px-6 py-3 text-right text-neutral-600">{listing.views}</td>
                    <td className="px-6 py-3 text-right text-neutral-600">{listing.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
