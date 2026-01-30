'use client';

import { useState } from 'react';
import Navbar from '@/app/ui/navbar';
import Link from 'next/link';

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

    setMessage('Geslo uspesno spremenjeno!');
  }

  const isSuccess = message.toLowerCase().includes('uspesno');

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Varnost
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Spremeni geslo
            </h1>
            <p className="text-base text-blue-100 md:text-lg">
              Poskrbi za varnost racuna z novo, mocno geslo.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Posodobi podatke
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Vnesi staro in novo geslo ter potrdi spremembo.
              </p>
            </div>
            <Link
              href="/profile"
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Nazaj na profil
            </Link>
          </div>

          {message && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                isSuccess
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200'
                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Staro geslo
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Novo geslo
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Spremeni geslo
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

