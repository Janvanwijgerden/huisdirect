import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Building
} from 'lucide-react';

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // 🔐 1. user ophalen
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 🔐 2. role ophalen
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 🔐 3. check manager
  if (!profile || profile.role !== 'manager') {
    redirect('/dashboard'); // of homepage
  }

  // Navigation Links definition
  const navItems = [
    { name: 'Overview', href: '/manager', icon: LayoutDashboard },
    { name: 'Listings', href: '/manager/listings', icon: Building },
    { name: 'Users', href: '/manager/users', icon: Users },
    { name: 'Leads', href: '/manager/leads', icon: MessageSquare },
    { name: 'Statistics', href: '/manager/statistics', icon: BarChart3 },
  ];

  // ✅ toegang toegestaan
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900">
          <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">HD</span>
          </div>
          Manager
        </div>
        <nav className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-neutral-200 bg-white min-h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">HD</span>
            </div>
            HuisDirect
            <span className="ml-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Dashboard
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors group"
              >
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors group"
          >
            <Home className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
            Exit to App
          </Link>
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <span className="text-xs font-medium text-neutral-600">
                {user?.email?.charAt(0).toUpperCase() || 'M'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-900 truncate">
                {user?.email}
              </p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                Manager
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}