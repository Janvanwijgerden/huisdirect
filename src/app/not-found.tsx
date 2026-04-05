import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <p className="font-sans text-8xl font-bold text-stone-200 mb-4">404</p>
        <h1 className="font-sans text-3xl font-bold text-stone-900 mb-3">Page not found</h1>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go home
          </Link>
          <Link href="/listings" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  );
}
