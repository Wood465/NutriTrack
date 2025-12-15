'use client';

import { useEffect, useState } from 'react';
import BackButton from '../ui/BackButton';
import Link from 'next/link';



export default function ProfilePage() {
  const [avatarKey, setAvatarKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [averageCalories, setAverageCalories] = useState<number | null>(null);
const [loggedDays, setLoggedDays] = useState<number | null>(null);

useEffect(() => {
  if (!user) return;

  async function loadStats() {
    const res = await fetch(`/api/meals?user_id=${user.id}`, { cache: "no-store" });
    const meals = await res.json();

    if (meals.length === 0) {
      setAverageCalories(0);
      setLoggedDays(0);
      return;
    }

    // skupne kalorije
    const total = meals.reduce((sum: number, meal: any) => sum + meal.kalorije, 0);

    // unikatni dnevi vnosa
    const days = new Set(
      meals.map((m: any) => new Date(m.cas).toISOString().slice(0, 10))
    );

    setLoggedDays(days.size);
    setAverageCalories(Math.round(total / days.size));
  }

  loadStats();
}, [user]);


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
          <div className="flex items-center gap-4 mt-3">
          <img
            src={`/api/profile/avatar/view?key=${avatarKey}`}
            alt="Profilna slika"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <label className="cursor-pointer text-blue-600 hover:underline text-sm">
            Spremeni sliko
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
            />
          </label>
        </div>

        </div>
      </section>

        <Link 
        href="/profile/change-password" 
        className="text-blue-600 hover:underline block mt-2"
        >
        Spremeni geslo
        </Link>

  


      <section className="space-y-3">
        <h2 className="text-xl font-medium">Statistika</h2>
        <div className="rounded-lg border p-4 bg-white shadow-sm space-y-1">
                <p>
          <span className="font-medium">Povprečen dnevni vnos:</span>{' '}
          {averageCalories !== null ? `${averageCalories} kcal` : 'Nalaganje...'}
        </p>

        <p>
          <span className="font-medium">Zabeleženi dnevi:</span>{' '}
          {loggedDays !== null ? loggedDays : 'Nalaganje...'}
        </p>


        </div>
      </section>


      <BackButton />
    </main>
  );
 async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  console.log("DEBUG selected file:", file);

  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });

  console.log("DEBUG upload status:", res.status);

  if (res.ok) {
    setAvatarKey(Date.now());
  } else {
    const err = await res.json();
    console.log("UPLOAD ERROR:", err);
    alert("Upload ni uspel");
  }
}

}


