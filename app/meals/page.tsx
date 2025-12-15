"use client";

import { useState, useEffect } from "react";
import BackButton from "../ui/BackButton";
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

  // Load logged-in user from API session
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      console.log("Session user:", data.user);
      setUser(data.user);
    }

    loadUser();
  }, []);

  // Load meals when user is known
  useEffect(() => {
    if (!user) return;

    async function loadMeals() {
      const res = await fetch(`/api/meals?user_id=${user.id}`);
      const data = await res.json();
      setMeals(data);
    }

    loadMeals();
  }, [user]);

  // Dodaj nov obrok
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

   setMeals((prev) => Array.isArray(prev) ? [saved, ...prev] : [saved]);

    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");

    setNote("");
  };

  return (
    <main className="flex min-h-screen flex-col pt-20 p-6">
      {/* Navigacija na vrhu */}
      <Navbar />

      {/* Glava strani */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        {/* <AcmeLogo /> */}
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Moji obroki</h1>

        <form onSubmit={handleAddMeal} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Ime obroka
            </label>
            <input
              id="name"
              type="text"
              placeholder="npr. Zajtrk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-700"
            >
              Kalorije
            </label>
            <input
              id="calories"
              type="number"
              placeholder="npr. 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Beljakovine (g)
            </label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ogljikovi hidrati (g)
            </label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maščobe (g)
            </label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Opis (neobvezno)
            </label>
            <textarea
              id="note"
              placeholder="kratek opis obroka"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Dodaj obrok
          </button>
        </form>

        {meals.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Dodani obroki:</h2>
            <ul className="space-y-2">
              {meals.map((meal) => (
                <li key={meal.id} className="border p-3 rounded-md">
                  <p className="font-medium">{meal.naziv}</p>
                  <p>{meal.kalorije} kcal</p>

                  <p>Beljakovine: {meal.beljakovine} g</p>
                  <p>Ogljikovi hidrati: {meal.ogljikovi_hidrati} g</p>
                  <p>Maščobe: {meal.mascobe} g</p>

                  <p className="text-sm text-gray-600">
                    Čas vnosa: {new Date(meal.cas).toLocaleString()}
                  </p>

                  {meal.note && (
                    <p className="text-sm text-gray-600 mt-1">
                      Opis: {meal.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <BackButton />
    </main>
  );
}
