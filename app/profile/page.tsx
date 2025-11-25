'use client';

import { useEffect, useState } from 'react';
import BackButton from '../ui/BackButton';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('/api/session', { cache: 'no-store' });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Profil</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Osebni podatki</h2>
        <div className="rounded-lg border p-4 bg-white shadow-sm space-y-1">
          <p><span className="font-medium">Ime:</span> {user?.ime ?? '—'}</p>
          <p><span className="font-medium">Priimek:</span> {user?.priimek ?? '—'}</p>
          <p><span className="font-medium">E-pošta:</span> {user?.email ?? '—'}</p>
          <p><span className="font-medium">Starost:</span> —</p>
          <p><span className="font-medium">Teža:</span> —</p>
          <p><span className="font-medium">Višina:</span> —</p>
        </div>
      </section>

        <Link 
        href="/profile/change-password" 
        className="text-blue-600 hover:underline block mt-2"
        >
        Spremeni geslo
        </Link>


      <section className="space-y-3">
        <h2 className="text-xl font-medium">Cilji</h2>
        <div className="rounded-lg border p-4 bg-white shadow-sm space-y-1">
          <p><span className="font-medium">Dnevni vnos kalorij:</span> —</p>
          <p><span className="font-medium">Ciljna teža:</span> —</p>
          <p><span className="font-medium">Status:</span> —</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Statistika</h2>
        <div className="rounded-lg border p-4 bg-white shadow-sm space-y-1">
          <p><span className="font-medium">Povprečen dnevni vnos:</span> —</p>
          <p><span className="font-medium">Zabeleženi dnevi:</span> —</p>
        </div>
      </section>


      <BackButton />
    </main>
  );
}
