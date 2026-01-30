"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/ui/navbar";

export default function MealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("0");
  const [note, setNote] = useState("");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      setUser(data.user);
    }

    loadUser();
  }, []);

  const handleDeleteMeal = async (id: number) => {
    const ok = confirm("Res zelis izbrisati ta obrok?");
    if (!ok) return;

    const res = await fetch(`/api/meals/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Brisanje ni uspelo");
      return;
    }

    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (!user) return;

    async function loadMeals() {
      const res = await fetch(`/api/meals?user_id=${user.id}`);
      const data = await res.json();
      setMeals(data);
    }

    loadMeals();
  }, [user]);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !calories.trim()) return;

    const newMeal = {
      user_id: user.id,
      naziv: name,
      kalorije: parseFloat(calories) || 0,
      beljakovine: parseFloat(protein) || 0,
      ogljikovi_hidrati: parseFloat(carbs) || 0,
      mascobe: parseFloat(fat) || 0,
      note,
    };

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeal),
    });

    const saved = await res.json();

    setMeals([saved, ...meals]);
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setNote("");
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Moji obroki
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Dodaj obrok in spremljaj vnos
            </h1>
            <p className="text-base text-blue-100 md:text-lg">
              Hitro zabelezi kalorije in makro hranila ter imej vse na enem mestu.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Dodaj nov obrok
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Vnesi ime, kalorije in dodatne podatke.
            </p>

            <form onSubmit={handleAddMeal} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Ime obroka
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="npr. Zajtrk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label
                  htmlFor="calories"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Kalorije
                </label>
                <input
                  id="calories"
                  type="number"
                  placeholder="npr. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Beljakovine (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Ogljikovi hidrati (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Mascobe (g)
                  </label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Opis (neobvezno)
                </label>
                <textarea
                  id="note"
                  placeholder="kratek opis obroka"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 block min-h-[110px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Dodaj obrok
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dodani obroki
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                {meals.length} skupaj
              </span>
            </div>

            {meals.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                Se ni dodanih obrokov. Dodaj prvega in zacni spremljati vnos.
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {meals.map((meal) => (
                  <li
                    key={meal.id}
                    className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {meal.naziv}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {meal.kalorije} kcal
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40"
                      >
                        Izbrisi
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
                      <p>Beljakovine: {meal.beljakovine} g</p>
                      <p>Ogljikovi hidrati: {meal.ogljikovi_hidrati} g</p>
                      <p>Mascobe: {meal.mascobe} g</p>
                    </div>

                    <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                      Cas vnosa: {new Date(meal.cas).toLocaleString()}
                    </p>

                    {meal.note && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Opis: {meal.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
