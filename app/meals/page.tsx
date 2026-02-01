"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/ui/navbar";

/**
 * MEALS PAGE (Moji obroki)
 *
 * Namen strani:
 * - Prijavljen uporabnik lahko:
 *   1) Doda nov obrok (ime + kalorije + makrohranila + opis)
 *   2) Vidi seznam vseh svojih obrokov
 *   3) Izbrise posamezen obrok
 *
 * Kako deluje (flow):
 * - Najprej preberemo sejo (/api/session), da dobimo user.id.
 * - Ko imamo user.id, nalozimo obroke (/api/meals?user_id=...).
 * - Pri dodajanju posljemo POST na /api/meals in dodamo vrnjen obrok v seznam.
 * - Pri brisanju posljemo DELETE na /api/meals/:id in ga odstranimo iz seznama.
 */

export default function MealsPage() {
  // Seznam obrokov, ki se prikaze na desni strani (tabela/lista)
  const [meals, setMeals] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 3;

  // Controlled inputs za dodajanje novega obroka (leva stran)
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("0");
  const [note, setNote] = useState("");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");

  // Trenutno prijavljen uporabnik (rabimo user.id za nalaganje in shranjevanje obrokov)
  const [user, setUser] = useState<any>(null);

  // Edit state za obrok
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCalories, setEditCalories] = useState("0");
  const [editProtein, setEditProtein] = useState("0");
  const [editCarbs, setEditCarbs] = useState("0");
  const [editFat, setEditFat] = useState("0");

  /**
   * 1) Nalozimo trenutno sejo
   * - /api/session vrne podatke o prijavljenem uporabniku
   * - rezultat shranimo v state "user"
   */
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      setUser(data.user);
    }

    loadUser();
  }, []);

  /**
   * 2) Ko dobimo user, nalozimo njegove obroke
   * - ta useEffect se izvede sele takrat, ko se "user" nastavi
   * - s tem se izognemo klicu API-ja, dokler nimamo user.id
   */
  useEffect(() => {
    if (!user) return;

    async function loadMeals() {
      const res = await fetch(`/api/meals?user_id=${user.id}`);
      const data = await res.json();
      setMeals(data);
    }

    loadMeals();
  }, [user]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(meals.length / mealsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [meals.length, currentPage]);

  /**
   * 3) Brisanje obroka
   * - uporabnika najprej vprasamo za potrditev (confirm)
   * - DELETE /api/meals/:id
   * - ce uspe, odstranimo obrok iz state, da se UI takoj posodobi
   */
  const handleDeleteMeal = async (id: string) => {
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

  const handleStartEdit = (meal: any) => {
    setEditingId(meal.id);
    setEditName(meal.naziv ?? "");
    setEditCalories(String(meal.kalorije ?? 0));
    setEditProtein(String(meal.beljakovine ?? 0));
    setEditCarbs(String(meal.ogljikovi_hidrati ?? 0));
    setEditFat(String(meal.mascobe ?? 0));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCalories("0");
    setEditProtein("0");
    setEditCarbs("0");
    setEditFat("0");
  };

  const handleSaveEdit = async (id: string) => {
    if (!user?.id) {
      alert("Uporabnik ni prijavljen ali seja ni nalozena.");
      return;
    }

    if (!editName.trim() || !editCalories.trim()) return;

    const parsedCalories = Number(editCalories);
    const parsedProtein = Number(editProtein);
    const parsedCarbs = Number(editCarbs);
    const parsedFat = Number(editFat);

    if (
      !Number.isFinite(parsedCalories) ||
      !Number.isFinite(parsedProtein) ||
      !Number.isFinite(parsedCarbs) ||
      !Number.isFinite(parsedFat) ||
      parsedCalories < 0 ||
      parsedProtein < 0 ||
      parsedCarbs < 0 ||
      parsedFat < 0
    ) {
      alert("Vrednosti ne smejo biti negativne.");
      return;
    }

    const res = await fetch(`/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naziv: editName,
        kalorije: parsedCalories || 0,
        beljakovine: parsedProtein || 0,
        ogljikovi_hidrati: parsedCarbs || 0,
        mascobe: parsedFat || 0,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const fields =
        Array.isArray(err?.fields) && err.fields.length > 0
          ? ` (${err.fields.join(", ")})`
          : "";
      alert(`${err?.error || "Urejanje ni uspelo"}${fields}`);
      return;
    }

    const updated = await res.json();
    setMeals((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    handleCancelEdit();
  };

  /**
   * 4) Dodajanje novega obroka
   * - validacija: ime mora biti vneseno, vrednosti ne smejo biti negativne
   * - POST /api/meals
   * - vrnjen obrok dodamo na vrh seznama, da je takoj viden
   */
  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Uporabnik ni prijavljen ali seja ni nalozena.");
      return;
    }

    // osnovna validacija
    if (!name.trim() || !calories.trim()) return;

    // pretvorba input stringov v stevila
    const parsedCalories = Number(calories);
    const parsedProtein = Number(protein);
    const parsedCarbs = Number(carbs);
    const parsedFat = Number(fat);

    // varnost: ne dovolimo negativnih ali neveljavnih vrednosti
    if (
      !Number.isFinite(parsedCalories) ||
      !Number.isFinite(parsedProtein) ||
      !Number.isFinite(parsedCarbs) ||
      !Number.isFinite(parsedFat) ||
      parsedCalories < 0 ||
      parsedProtein < 0 ||
      parsedCarbs < 0 ||
      parsedFat < 0
    ) {
      alert("Vrednosti ne smejo biti negativne.");
      return;
    }

    // objekt, ki ga posljemo backend-u (v enaki strukturi, kot jo backend pricakuje)
    const newMeal = {
      user_id: user.id,
      naziv: name,
      kalorije: parsedCalories || 0,
      beljakovine: parsedProtein || 0,
      ogljikovi_hidrati: parsedCarbs || 0,
      mascobe: parsedFat || 0,
      note,
    };

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeal),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const fields =
        Array.isArray(err?.fields) && err.fields.length > 0
          ? ` (${err.fields.join(", ")})`
          : "";
      alert(`${err?.error || "Dodajanje ni uspelo"}${fields}`);
      return;
    }

    // backend vrne shranjen obrok (z id-jem, casom, ...)
    const saved = await res.json();
    if (!saved || saved.id == null) {
      alert("Obrok ni bil shranjen pravilno (manjka id).");
      return;
    }

    // UI: obrok dodamo na vrh seznama (da se vidi takoj)
    setMeals((prev) => [saved, ...prev]);
    setCurrentPage(1);

    // ponastavimo formo
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setNote("");
  };

  return (
    <main className="min-h-screen">
      {/* Navigacija */}
      <Navbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        {/* Naslovna (hero) sekcija strani */}
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

        {/* Layout: levo forma, desno seznam obrokov */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          {/* LEVO: forma za dodajanje */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
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
                  min={0}
                  placeholder="npr. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="protein"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Beljakovine (g)
                  </label>
                  <input
                    id="protein"
                    type="number"
                    min={0}
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="carbs"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Ogljikovi hidrati (g)
                  </label>
                  <input
                    id="carbs"
                    type="number"
                    min={0}
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fat"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Mascobe (g)
                  </label>
                  <input
                    id="fat"
                    type="number"
                    min={0}
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
                disabled={!user?.id}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Dodaj obrok
              </button>
            </form>
          </div>

          {/* DESNO: seznam obrokov */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dodani obroki
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                {meals.length} skupaj
              </span>
            </div>

            {/* Ce ni obrokov, prikazemo “empty state”, drugace seznam */}
            {meals.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                Se ni dodanih obrokov. Dodaj prvega in zacni spremljati vnos.
              </div>
            ) : (
              <>
                <ul className="mt-6 space-y-4">
                  {meals
                    .slice(
                      (currentPage - 1) * mealsPerPage,
                      currentPage * mealsPerPage,
                    )
                    .map((meal, index) => (
                  <li
                    key={meal.id ?? `${meal.naziv}-${meal.cas ?? "no-date"}-${index}`}
                    className="rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60"
                  >
                    {editingId === meal.id ? (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`edit-name-${meal.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            Ime obroka
                          </label>
                          <input
                            id={`edit-name-${meal.id}`}
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`edit-calories-${meal.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            Kalorije
                          </label>
                          <input
                            id={`edit-calories-${meal.id}`}
                            type="number"
                            min={0}
                            value={editCalories}
                            onChange={(e) => setEditCalories(e.target.value)}
                            className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor={`edit-protein-${meal.id}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                              Beljakovine (g)
                            </label>
                            <input
                              id={`edit-protein-${meal.id}`}
                              type="number"
                              min={0}
                              value={editProtein}
                              onChange={(e) => setEditProtein(e.target.value)}
                              className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`edit-carbs-${meal.id}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                              Ogljikovi hidrati (g)
                            </label>
                            <input
                              id={`edit-carbs-${meal.id}`}
                              type="number"
                              min={0}
                              value={editCarbs}
                              onChange={(e) => setEditCarbs(e.target.value)}
                              className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`edit-fat-${meal.id}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                              Mascobe (g)
                            </label>
                            <input
                              id={`edit-fat-${meal.id}`}
                              type="number"
                              min={0}
                              value={editFat}
                              onChange={(e) => setEditFat(e.target.value)}
                              className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleSaveEdit(meal.id)}
                            className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Shrani
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            Preklici
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {meal.naziv}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {meal.kalorije} kcal
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(meal)}
                              className="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-950/40"
                            >
                              Uredi
                            </button>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40"
                            >
                              Izbrisi
                            </button>
                          </div>
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
                      </>
                    )}
                  </li>
                ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    Stran {currentPage} /{" "}
                    {Math.max(1, Math.ceil(meals.length / mealsPerPage))}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Prejsnja
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            Math.max(1, Math.ceil(meals.length / mealsPerPage)),
                            p + 1,
                          ),
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.max(1, Math.ceil(meals.length / mealsPerPage))
                      }
                      className="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40"
                    >
                      Naslednja
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
