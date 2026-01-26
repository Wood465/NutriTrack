"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";

/**
 * MealsPage
 *
 * Namen:
 * - uporabnik doda nov obrok (POST /api/meals)
 * - prikaže seznam obrokov (GET /api/meals?user_id=...)
 * - omogoča brisanje obroka (DELETE /api/meals/[id])
 * - omogoča link do urejanja obroka (/meals/[id])
 */
export default function MealsPage() {
  const router = useRouter();

  // Seznam obrokov
  const [meals, setMeals] = useState<any[]>([]);

  // Polja forme za dodajanje obroka
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("0");
  const [note, setNote] = useState("");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");

  // Trenutno prijavljen uporabnik (iz /api/session)
  const [user, setUser] = useState<any>(null);

  // 1) Ob odprtju strani naložimo userja iz sessiona
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      setUser(data.user);
    }

    loadUser();
  }, []);

  /**
   * Brisanje obroka:
   * - vpraša za potrditev (confirm)
   * - pošlje DELETE na /api/meals/[id]
   * - odstrani obrok iz UI seznama
   */
  const handleDeleteMeal = async (id: number) => {
    const ok = confirm("Res želiš izbrisati ta obrok?");
    if (!ok) return;

    const res = await fetch(`/api/meals/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Brisanje ni uspelo");
      return;
    }

    // odstrani iz UI
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  /**
   * Naloži vse obroke za določenega uporabnika
   * - kliče GET /api/meals?user_id=...
   */
  const loadMeals = async (userId: string) => {
    const res = await fetch(`/api/meals?user_id=${userId}`);
    const data = await res.json();
    setMeals(data);
  };

  // 2) Ko je user naložen, naložimo še njegove obroke
  useEffect(() => {
    if (!user) return;
    loadMeals(user.id);
  }, [user]);

  /**
   * Dodajanje obroka:
   * - preveri, če je user prijavljen
   * - pripravi payload (pretvori stringe v številke)
   * - pošlje POST /api/meals
   * - doda novo shranjen obrok na vrh seznama
   */
  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Če user ni prijavljen, ga pošljemo na registracijo
    if (!user) {
      router.push("/register");
      return;
    }

    // Minimalna validacija
    if (!name.trim() || !calories.trim()) return;

    // Podatki za API
    const newMeal = {
      user_id: user.id,
      naziv: name,
      kalorije: parseFloat(calories) || 0,
      beljakovine: parseFloat(protein) || 0,
      ogljikovi_hidrati: parseFloat(carbs) || 0,
      mascobe: parseFloat(fat) || 0,
      note,
    };

    // Pošlji POST request
    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeal),
    });

    const saved = await res.json();

    // Če API ne vrne ID-ja, za vsak slučaj ponovno naložimo vse obroke
    if (!saved?.id) {
      await loadMeals(user.id);
    } else {
      // Če vrne ID, dodamo obrok direktno v UI (najnovejši na vrh)
      setMeals((prev) => [saved, ...prev]);
    }

    // Pobrišemo inpute
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setNote("");
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0 dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0 dark:opacity-0" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 dark:shadow-black/40 md:px-10 md:py-14 dark:border-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 dark:shadow-black/40">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white dark:bg-slate-900/10 blur-3xl dark:opacity-0" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:opacity-0" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white dark:bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Moji obroki
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Dodaj obroke</h1>
            <p className="text-blue-100">
              Hitro dodaj obrok, spremljaj kalorije in hranila ter ohrani pregled.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <section className="rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
            <h2 className="text-xl font-semibold">Dodaj obrok</h2>

            <form onSubmit={handleAddMeal} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Ime obroka
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="npr. Zajtrk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="calories"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Kalorije
                </label>
                <input
                  id="calories"
                  type="number"
                  placeholder="npr. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Beljakovine (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Ogljikovi hidrati (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Maščobe (g)
                  </label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Opis (neobvezno)
                </label>
                <textarea
                  id="note"
                  placeholder="kratek opis obroka"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 block min-h-[96px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700"
              >
                Dodaj obrok
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Dodani obroki</h2>
              <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                {meals.length} skupaj
              </span>
            </div>

            {meals.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-6 text-sm text-slate-600 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                Še nimaš dodanih obrokov. Ko dodaš novega, se bo prikazal tukaj.
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {meals.map((meal, index) => (
                  <li
                    key={
                      meal.id ??
                      `${meal.naziv ?? "meal"}-${meal.cas ?? index}-${index}`
                    }
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {meal.naziv}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {meal.kalorije} kcal
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Link na urejanje obroka */}
                        <Link
                          href={`/meals/${meal.id}`}
                          className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-900 dark:text-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          Uredi
                        </Link>

                        {/* Brisanje obroka */}
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-400/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                        >
                          Izbriši
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                      <p>Beljakovine: {meal.beljakovine} g</p>
                      <p>Ogljikovi hidrati: {meal.ogljikovi_hidrati} g</p>
                      <p>Maščobe: {meal.mascobe} g</p>
                    </div>

                    {/* Datum/čas vnosa */}
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                      Čas vnosa: {new Date(meal.cas).toLocaleString()}
                    </p>

                    {/* Opis obroka (če obstaja) */}
                    {meal.note && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Opis: {meal.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

