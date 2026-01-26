'use client';

import { useState } from 'react';
import Navbar from "@/app/ui/navbar";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    setMessage('');

    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Napaka pri spremembi gesla');
      return;
    }

    setMessage('Geslo uspešno spremenjeno!');
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Varnost
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Spremeni geslo</h1>
            <p className="text-blue-100">
              Posodobi geslo in zaščiti svoj račun.
            </p>
          </div>
        </section>

        <section className="mt-10 max-w-xl rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          {message && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Staro geslo</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Novo geslo</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700"
            >
              Spremeni geslo
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
