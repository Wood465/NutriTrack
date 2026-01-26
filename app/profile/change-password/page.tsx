'use client';

import { useState } from 'react';
import Navbar from '@/app/ui/navbar';

export default function ChangePasswordPage() {
  // Controlled inputs za obe polji
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  // Status sporočilo (success ali error – brez spremembe funkcionalnosti API-ja)
  const [message, setMessage] = useState<string>('');

  // UI stanje za boljšo UX (prepreči double click / spam requeste)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit() {
    // Počisti prejšnje sporočilo
    setMessage('');

    // Minimalna validacija (ne spreminja API funkcionalnosti, samo prepreči prazen request)
    if (!oldPassword || !newPassword) {
      setMessage('Prosimo, izpolni obe polji.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Pošlji zahtevo na backend endpoint
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      // Backend naj bi vračal JSON v obeh primerih (ok/error)
      const data = await res.json().catch(() => ({} as any));

      // Če response ni OK, pokažemo sporočilo napake (backend ali fallback)
      if (!res.ok) {
        setMessage(data?.error || 'Napaka pri spremembi gesla');
        return;
      }

      // Uspeh
      setMessage('Geslo uspešno spremenjeno!');

      // Po želji: počisti polja po uspehu (UX izboljšava, ne spreminja funkcionalnosti)
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      // Network / fetch napaka
      setMessage('Napaka pri spremembi gesla');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Optional: submit tudi z Enter tipko (še vedno isti handleSubmit)
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      void handleSubmit();
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 dark:shadow-black/40 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white dark:bg-slate-900/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white dark:bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Varnost
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Spremeni geslo</h1>
            <p className="text-blue-100">Posodobi geslo in zaščiti svoj račun.</p>
          </div>
        </section>

        <section className="mt-10 max-w-xl rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
          {/* Opomba: isti message box za success/error (ne spreminja funkcionalnosti).
              Če hočeš, ti lahko naredim dve barvi glede na tip. */}
          {message && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Staro geslo</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Novo geslo</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="new-password"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Shranjujem...' : 'Spremeni geslo'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

