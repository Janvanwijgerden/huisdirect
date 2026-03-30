'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/lib/actions/auth';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Create account</h1>
          <p className="text-stone-500">Join Huisje and start listing or browsing properties.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Full name
            </label>
            <input
              name="full_name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jan de Vries"
              className="input-field"
            />
          </div>

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
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
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

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Confirm password
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="input-field"
            />
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
                Creating account...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-stone-900 font-semibold hover:text-amber-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
