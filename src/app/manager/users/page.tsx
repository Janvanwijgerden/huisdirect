import { Search, Filter, MoreVertical, Shield, User, Clock } from 'lucide-react';

export default function UsersPage() {
  const mockUsers = [
    { id: 1, email: 'jan@huisdirect.nl', role: 'manager', accountType: 'premium', createdAt: '2025-10-01' },
    { id: 2, email: 'test@example.com', role: 'user', accountType: 'standard', createdAt: '2026-01-15' },
    { id: 3, email: 'makelaar@vastgoed.nl', role: 'agent', accountType: 'premium', createdAt: '2026-03-20' },
    { id: 4, email: 'koper123@gmail.com', role: 'user', accountType: 'standard', createdAt: '2026-04-10' },
    { id: 5, email: 'admin@huisdirect.nl', role: 'admin', accountType: 'system', createdAt: '2025-08-14' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Users</h1>
          <p className="text-neutral-500 mt-1">Beheer accounts en toegangsrechten.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Zoek e-mail..." 
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
                <th className="px-6 py-4">Gebruiker (E-mail)</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Account Type</th>
                <th className="px-6 py-4">Aangemaakt op</th>
                <th className="px-6 py-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-medium text-xs border border-neutral-200 flex-shrink-0">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-neutral-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'admin' || user.role === 'manager' ? (
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${user.accountType === 'premium' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        user.accountType === 'system' ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }
                    `}>
                      {user.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(user.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          <span>Totaal {mockUsers.length} gebruikers</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-neutral-200 rounded hover:bg-white disabled:opacity-50" disabled>Vorige</button>
            <button className="px-2 py-1 border border-neutral-200 rounded hover:bg-white disabled:opacity-50" disabled>Volgende</button>
          </div>
        </div>
      </div>
    </div>
  );
}
