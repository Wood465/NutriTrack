'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../ui/BackButton';

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
    <main className="p-8 flex justify-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Registracija</h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>
          )}

          <div>
            <label className="block text-sm font-medium">Ime</label>
            <input
              type="text"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="vnesi ime"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Priimek</label>
            <input
              type="text"
              value={priimek}
              onChange={(e) => setPriimek(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="vnesi priimek"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">E-pošta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="vnesi e-pošto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Geslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="vnesi geslo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Potrdi geslo</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
              placeholder="ponovno vnesi geslo"
            />
          </div>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Registracija
          </button>

          <div className="text-center text-sm text-gray-600">
            Že imaš račun?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Prijava
            </Link>
          </div>

          <BackButton />
        </form>
      </div>
    </main>
  );
}
