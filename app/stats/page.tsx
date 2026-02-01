'use client';

import { useEffect, useState } from 'react';
import CaloriesChart from './CaloriesChart';

type DayStat = {
  date: string;
  calories: number;
};

/**
 * STATS PAGE (Statistika)
 *
 * Namen strani:
 * - Prikaze uporabniku statistiko prehranjevanja:
 *   1) danes (today): kalorije, stevilo obrokov, beljakovine
 *   2) zadnjih 7 dni (week): povprecja + vsote + aktivni dnevi
 *   3) graf (chart): kalorije po dnevih za vizualen pregled
 *
 
 */

export default function StatsPage() {
  // daily: podatki za danes (dnevna statistika)
  const [daily, setDaily] = useState<any>(null);

  // weekly: podatki za zadnjih 7 dni (tedenska statistika)
  const [weekly, setWeekly] = useState<any>(null);

  // chart: podatki za graf (kalorije po dnevih)
  const [chart, setChart] = useState<DayStat[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );
  const [reloadKey, setReloadKey] = useState(0);

  /**
   * Nalozimo statistiko samo enkrat (ko se stran odpre).
   * cache: 'no-store' pomeni, da vedno dobimo svez izracun iz backend-a.
   */
  useEffect(() => {
    async function loadStats() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      try {
        setStatus('loading');
        const res = await fetch('/api/stats/weekly', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();

        setDaily(data.today);
        setWeekly(data.week);
        setChart(data.chart);
        setStatus('ready');
      } catch {
        setStatus('error');
      } finally {
        clearTimeout(timeout);
      }
    }

    loadStats();
  }, [reloadKey]);

  if (status === 'loading') {
    return <p className="p-6">Nalaganje statistike …</p>;
  }

  if (status === 'error' || !daily || !weekly) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-6 text-sm text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          <p>Statistika trenutno ni dosegljiva.</p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="w-fit rounded-full border border-amber-300/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 transition-colors hover:bg-amber-100/80 dark:border-amber-800/60 dark:text-amber-100 dark:hover:bg-amber-900/40"
          >
            Poskusi ponovno
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <h1 className="text-3xl font-semibold">Statistika</h1>

      {/* Dnevna statistika: prikaz kljucnih metrik za danes */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatBox title="Današnje kalorije" value={`${daily.calories} kcal`} />
        <StatBox title="Obroki danes" value={daily.meals} />
        <StatBox title="Beljakovine danes" value={`${daily.protein} g`} />
      </section>

      {/* Tedenska statistika: povprecja in vsote za zadnjih 7 dni */}
      <section>
        <h2 className="mb-3 text-xl font-medium">Zadnjih 7 dni</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBox title="Povp. kalorije" value={`${weekly.avgCalories} kcal`} />
          <StatBox title="Skupaj kalorij" value={`${weekly.totalCalories} kcal`} />
          <StatBox title="Povp. beljakovine" value={`${weekly.avgProtein} g`} />
          <StatBox title="Aktivni dnevi" value={weekly.days} />
        </div>
      </section>

      {/* Graf: vizualen prikaz kalorij po dnevih */}
      <section>
        <h2 className="mb-3 text-xl font-medium">Kalorije po dnevih</h2>

        {/* CaloriesChart je locena komponenta, ki iz "chart" podatkov narise graf */}
        <CaloriesChart data={chart} />
      </section>
    </main>
  );
}

/**
 * StatBox:
 * - mala UI komponenta, ki prikaze en kos statistike (naslov + vrednost)
 * - uporabljamo jo veckrat, da ne ponavljamo istega JSX-ja (DRY)
 */
function StatBox({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
