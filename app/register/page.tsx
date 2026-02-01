'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/ui/navbar';

/**
 * REGISTER PAGE (Registracija)
 *
 * Namen strani:
 * - Uporabniku omogoca ustvarjanje novega racuna.
 * - Uporabnik vnese osnovne podatke (ime, priimek, email) in izbere geslo.
 *
 
 */

export default function RegisterPage() {
  // Controlled inputs: vrednosti polj so vedno v state-u
  const [ime, setIme] = useState('');
  const [priimek, setPriimek] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // error in success sta message stringa za prikaz uporabniku
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Registracija uporabnika:
   * - validacija gesel
   * - POST /api/register
   * - prikaz error/success
   * - redirect na /login po uspehu
   */
  async function handleRegister() {
    // Pocistimo prejsnja sporocila, da ne ostanejo stari statusi
    setError('');
    setSuccess('');

    // Osnovna validacija na strani klienta: gesli se morata ujemati
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
        password,
      }),
    });

    const data = await res.json();

    // Ce backend vrne napako, jo prikazemo uporabniku
    if (!res.ok) {
      setError(data.error || 'Napaka pri registraciji.');
      return;
    }

    // Uspeh: prikazemo sporocilo in preusmerimo na login (po 1.5s)
    setSuccess('Registracija uspesna. Preusmerjam...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  return (
    <main className="min-h-screen">
      {/* Navigacija */}
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Leva stran: opis strani */}
          <div className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
            <div className="max-w-md space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                Ustvari racun
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">Registracija</h1>
              <p className="text-base text-blue-100 md:text-lg">
                Pridruzi se in zacni spremljati obroke ter napredek.
              </p>
            </div>
          </div>

          {/* Desna stran: obrazec */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Ustvari nov racun
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Izpolni podatke in potrdi registracijo.
            </p>

            {/* Napaka */}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Uspeh */}
            {success && (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200">
                {success}
              </div>
            )}

            {/* Form submit preprečimo, ker registracijo sprozimo rocno z gumbom */}
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="register-ime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Ime
                </label>
                <input
                  id="register-ime"
                  type="text"
                  value={ime}
                  onChange={(e) => setIme(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  placeholder="vnesi ime"
                />
              </div>

              <div>
                <label
                  htmlFor="register-priimek"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Priimek
                </label>
                <input
                  id="register-priimek"
                  type="text"
                  value={priimek}
                  onChange={(e) => setPriimek(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  placeholder="vnesi priimek"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  E-posta
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  placeholder="vnesi e-posto"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Geslo
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  placeholder="vnesi geslo"
                />
              </div>

              <div>
                <label
                  htmlFor="register-confirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Potrdi geslo
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  placeholder="ponovno vnesi geslo"
                />
              </div>

              {/* Gumb sprozi handleRegister */}
              <button
                type="button"
                onClick={handleRegister}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Registracija
              </button>
            </form>

            {/* Link na login stran */}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Ze imas racun?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
              >
                Prijava
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
