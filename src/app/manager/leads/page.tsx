import { Search, Filter, MoreVertical, Eye, Mail } from 'lucide-react';

export default function LeadsPage() {
  const mockLeads = [
    { id: 1, listing: 'Prinsengracht 123', name: 'Johan de Vries', email: 'johan.devries@example.com', createdAt: '2026-04-13T10:30:00Z', status: 'new' },
    { id: 2, listing: 'Coolsingel 45', name: 'Maria Jansen', email: 'maria.j@gmail.com', createdAt: '2026-04-12T14:15:00Z', status: 'contacted' },
    { id: 3, listing: 'Prinsengracht 123', name: 'Pieter Zwart', email: 'pieter88@hotmail.com', createdAt: '2026-04-12T09:00:00Z', status: 'new' },
    { id: 4, listing: 'Vredenburg 8', name: 'Eva de Jong', email: 'eva.dejong@company.nl', createdAt: '2026-04-10T16:45:00Z', status: 'qualified' },
    { id: 5, listing: 'Keizersgracht 90', name: 'Sven Bakker', email: 'sbakker@outlook.com', createdAt: '2026-04-09T11:20:00Z', status: 'closed' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Leads</h1>
          <p className="text-neutral-500 mt-1">Interesse en aanvragen voor woningen.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Zoek leads..." 
              className="pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50/50 border-b border-neutral-200 text-neutral-500 font-medium">
              <tr>
                <th className="px-6 py-4">Naam / E-mail</th>
                <th className="px-6 py-4">Woning</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ontvangen op</th>
                <th className="px-6 py-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">{lead.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-neutral-500">
                        <Mail className="w-3 h-3" />
                        <span>{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-neutral-700">{lead.listing}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${lead.status === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }
                    `}>
                      {lead.status === 'new' ? 'Nieuw' : lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {new Date(lead.createdAt).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Lead">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors" title="More actions">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-500 flex justify-between items-center">
          <span>Totaal {mockLeads.length} leads</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-neutral-200 rounded hover:bg-white disabled:opacity-50" disabled>Vorige</button>
            <button className="px-2 py-1 border border-neutral-200 rounded hover:bg-white disabled:opacity-50" disabled>Volgende</button>
          </div>
        </div>
      </div>
    </div>
  );
}
