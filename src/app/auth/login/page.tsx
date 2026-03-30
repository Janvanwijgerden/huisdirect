'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from '@/lib/actions/auth';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-500">Sign in to your Huisje account.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <Link href="#" className="text-sm text-amber-600 hover:text-amber-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-8">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-stone-900 font-semibold hover:text-amber-600 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
