import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <p className="mb-4 font-sans text-8xl font-bold text-stone-200">404</p>

        <h1 className="mb-3 font-sans text-3xl font-bold text-stone-900">
          Page not found
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-stone-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Go home
          </Link>

          <Link href="/listings" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  );
}