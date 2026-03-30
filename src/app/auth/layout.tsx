import Link from 'next/link';
import { Home } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Simple auth header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit group">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-stone-900">Huisje</span>
        </Link>
      </header>

      {/* Auth form centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="p-6 text-center text-stone-400 text-sm">
        © {new Date().getFullYear()} Huisje
      </footer>
    </div>
  );
}
