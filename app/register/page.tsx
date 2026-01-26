'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from "@/app/ui/navbar";

export default function RegisterPage() {
  const [ime, setIme] = useState('');
  const [priimek, setPriimek] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister() {
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Gesli se ne ujemata.');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ime,
        priimek,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Napaka pri registraciji.');
      return;
    }

    setSuccess('Registracija uspešna. Preusmerjam...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Navbar />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                  Registracija
                </div>
                <h1 className="mt-4 text-3xl font-semibold">Ustvari račun</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Začni s sledenjem prehrani v nekaj korakih.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Ime</label>
                    <input
                      type="text"
                      value={ime}
                      onChange={(e) => setIme(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="vnesi ime"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Priimek</label>
                    <input
                      type="text"
                      value={priimek}
                      onChange={(e) => setPriimek(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="vnesi priimek"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">E-pošta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="vnesi e-pošto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Geslo</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="vnesi geslo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Potrdi geslo</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="ponovno vnesi geslo"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRegister}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700"
                >
                  Registracija
                </button>

                <div className="text-center text-sm text-slate-600">
                  Že imaš račun?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Prijava
                  </Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
