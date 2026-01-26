"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";

/**
 * EditMealPage
 *
 * Namen:
 * - prikaÅ¾e formo za urejanje obroka
 * - ob odprtju strani naloÅ¾i obrok iz /api/meals/[id]
 * - ob shranjevanju poÅ¡lje PUT na /api/meals/[id]
 */
export default function EditMealPage() {
  const router = useRouter();
  const params = useParams();

  // ID iz URL-ja (lahko je string ali array -> zato normaliziramo)
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // UI stanja
  const [loading, setLoading] = useState(true); // nalaganje obroka
  const [saving, setSaving] = useState(false); // shranjevanje sprememb
  const [error, setError] = useState(""); // sporoÄilo napake

  // Polja forme
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("0");
  const [note, setNote] = useState("");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");

  // Ko se stran odpre (in imamo id), naloÅ¾imo obrok iz API-ja
  useEffect(() => {
    if (!id) return;

    async function loadMeal() {
      try {
        const res = await fetch(`/api/meals/${id}`, { cache: "no-store" });

        // ÄŒe obrok ne obstaja ali user nima pravic, vrnemo napako
        if (!res.ok) {
          setError("Obrok ne obstaja ali nimaÅ¡ dostopa.");
          return;
        }

        // Napolnimo formo s podatki iz baze
        const meal = await res.json();
        setName(meal.naziv ?? "");
        setCalories(String(meal.kalorije ?? 0));
        setProtein(String(meal.beljakovine ?? 0));
        setCarbs(String(meal.ogljikovi_hidrati ?? 0));
        setFat(String(meal.mascobe ?? 0));
        setNote(meal.note ?? "");
      } catch {
        setError("Napaka pri nalaganju obroka.");
      } finally {
        setLoading(false);
      }
    }

    loadMeal();
  }, [id]);

  /**
   * Shrani spremembe:
   * - pretvori Å¡tevilke iz string v number
   * - poÅ¡lje PUT na /api/meals/[id]
   * - ob uspehu preusmeri nazaj na /meals
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Pripravimo payload za API
    const payload = {
      naziv: name,
      kalorije: parseFloat(calories) || 0,
      beljakovine: parseFloat(protein) || 0,
      ogljikovi_hidrati: parseFloat(carbs) || 0,
      mascobe: parseFloat(fat) || 0,
      note,
    };

    const res = await fetch(`/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ÄŒe shranjevanje ne uspe, pokaÅ¾emo napako
    if (!res.ok) {
      setError("Shranjevanje ni uspelo.");
      setSaving(false);
      return;
    }

    // Uspeh -> nazaj na seznam obrokov
    router.push("/meals");
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 dark:shadow-black/40 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white dark:bg-slate-900/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white dark:bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Uredi obrok
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Uredi obrok</h1>
            <p className="text-blue-100">
              Posodobi podatke o obroku in shrani spremembe.
            </p>
          </div>
        </section>

        <section className="mt-10 max-w-2xl rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
          {/* Prikaz napak */}
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* ÄŒe se Å¡e nalaga, pokaÅ¾i tekst */}
          {loading ? (
            <p className="text-slate-600 dark:text-slate-300">Nalaganje...</p>
          ) : (
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {/* Ime obroka */}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Kalorije */}
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
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Makro hranila */}
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
                    MaÅ¡Äobe (g)
                  </label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Opomba */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Opis (neobvezno)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 block min-h-[96px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Gumbi */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Shranjujem..." : "Shrani spremembe"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/meals")}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-900 dark:text-white"
                >
                  PrekliÄi
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

