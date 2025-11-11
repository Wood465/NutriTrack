'use client';

import { useState } from 'react';
import BackButton from '../ui/BackButton';

export default function MealsPage() {
  const [meals, setMeals] = useState<{ name: string; calories: string; note: string }[]>([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [note, setNote] = useState('');

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !calories.trim()) return;

    setMeals([...meals, { name, calories, note }]);
    setName('');
    setCalories('');
    setNote('');
  };

  return (
    <main className="p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Moji obroki</h1>

        <form onSubmit={handleAddMeal} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ime obroka
            </label>
            <input
              id="name"
              type="text"
              placeholder="npr. Zajtrk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Kalorije
            </label>
            <input
              id="calories"
              type="number"
              placeholder="npr. 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Opis (neobvezno)
            </label>
            <textarea
              id="note"
              placeholder="kratek opis obroka"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Dodaj obrok
          </button>
        </form>

        {meals.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Dodani obroki:</h2>
            <ul className="space-y-2">
              {meals.map((meal, index) => (
                <li key={index} className="border p-3 rounded-md">
                  <p className="font-medium">{meal.name}</p>
                  <p>{meal.calories} kcal</p>
                  {meal.note && <p className="text-sm text-gray-600">{meal.note}</p>}
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
