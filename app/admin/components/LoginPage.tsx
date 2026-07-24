'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await loginAction(password);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bugis-cream px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div
          className="bg-white rounded-3xl shadow-xl border border-bugis-gold/20 overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(107,29,29,0.1)' }}
        >
          {/* Header strip */}
          <div className="h-1.5 bg-gradient-to-r from-bugis-maroon via-bugis-gold to-bugis-deepgreen" />

          <div className="p-8">
            {/* Logo / ornament */}
            <div className="flex flex-col items-center mb-8">
              <svg viewBox="0 0 48 48" className="w-12 h-12 text-bugis-gold mb-3" fill="none">
                <path d="M24 2L46 24L24 46L2 24Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M24 10L38 24L24 38L10 24Z" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.5" />
              </svg>
              <h1 className="font-playfair text-2xl text-bugis-maroon">Admin Dashboard</h1>
              <p className="font-poppins text-xs text-gray-400 mt-1">Amir &amp; Wardah</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-poppins text-xs font-semibold text-bugis-deepgreen uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-3 rounded-xl border border-bugis-gold/25 bg-bugis-cream/30 font-poppins text-sm focus:outline-none focus:border-bugis-gold focus:ring-2 focus:ring-bugis-gold/20 transition-all"
                />
              </div>

              {error && (
                <p className="font-poppins text-xs text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-xl font-poppins font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6B1D1D, #8b2828)' }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </span>
                ) : 'Masuk'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center font-poppins text-[10px] text-gray-400 mt-6">
          Hanya untuk pengelola undangan · Bukan untuk tamu
        </p>
      </div>
    </div>
  );
}
