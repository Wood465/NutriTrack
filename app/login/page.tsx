'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../ui/BackButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Nepričakovana napaka');
      return;
    }

    window.location.href = '/'; // preusmeri na glavno stran
  }

  return (
    <main className="p-8 flex justify-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Prijava</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-pošta
            </label>
            <input
              type="email"
              placeholder="vnesi e-pošto"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Geslo
            </label>
            <input
              type="password"
              placeholder="vnesi geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Prijava
          </button>

          <div className="text-center text-sm text-gray-600">
            Nimaš računa?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registracija
            </Link>
          </div>

          <BackButton />
        </form>
      </div>
    </main>
  );
}
