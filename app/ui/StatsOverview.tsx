'use client';

import { useEffect, useState } from 'react';
import CaloriesChart from '../stats/CaloriesChart';

export default function StatsOverview() {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const res = await fetch('/api/stats/weekly', { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();
      setDaily(data.today);
      setWeekly(data.week);
      setChart(data.chart);
    }

    loadStats();
  }, []);

  if (!daily || !weekly) {
    return <p className="text-slate-600 dark:text-slate-300">Nalaganje statistike …</p>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pregled</h2>

      {/* Dnevno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Današnje kalorije" value={`${daily.calories} kcal`} />
        <StatBox title="Obroki danes" value={daily.meals} />
        <StatBox title="Beljakovine danes" value={`${daily.protein} g`} />
      </div>

      {/* Tedensko */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Zadnjih 7 dni</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox title="Povp. kalorije" value={`${weekly.avgCalories} kcal`} />
          <StatBox title="Skupaj kalorij" value={`${weekly.totalCalories} kcal`} />
          <StatBox title="Povp. beljakovine" value={`${weekly.avgProtein} g`} />
          <StatBox title="Aktivni dnevi" value={weekly.days} />
        </div>
      </div>

      {/* Graf */}
      <div>
        <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">Kalorije po dnevih</h3>
        <CaloriesChart data={chart} />
      </div>
    </section>
  );
}

function StatBox({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/20">
      <p className="text-sm text-slate-500 dark:text-slate-300">{title}</p>
      <p className="text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
