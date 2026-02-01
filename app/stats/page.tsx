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

  /**
   * Nalozimo statistiko samo enkrat (ko se stran odpre).
   * cache: 'no-store' pomeni, da vedno dobimo svez izracun iz backend-a.
   */
  useEffect(() => {
    async function loadStats() {
      const res = await fetch('/api/stats/weekly', { cache: 'no-store' });
      const data = await res.json();

      setDaily(data.today);
      setWeekly(data.week);
      setChart(data.chart);
    }

    loadStats();
  }, []);

  // Dokler se podatki ne nalozijo, prikazemo enostaven loading tekst
  if (!daily || !weekly) {
    return <p className="p-6">Nalaganje statistike …</p>;
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
