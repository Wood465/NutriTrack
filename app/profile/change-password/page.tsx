'use client';

import { useState } from 'react';
import BackButton from '../../ui/BackButton';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    setMessage('');

    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Napaka pri spremembi gesla');
      return;
    }

    setMessage('Geslo uspešno spremenjeno!');
  }

  return (
    <main className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Spremeni geslo</h1>

      {message && (
        <div className="p-2 rounded bg-green-100 border border-green-300 text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-4">

        <div>
          <label className="block font-medium">Staro geslo</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Novo geslo</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Spremeni geslo
        </button>

        <BackButton />
      </div>
    </main>
  );
}
