'use client';
import CaloriesChart from './CaloriesChart';

import { useEffect, useState } from 'react';

type DayStat = {
  date: string;
  calories: number;
};

export default function StatsPage() {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [chart, setChart] = useState<DayStat[]>([]);

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

  if (!daily || !weekly) {
    return <p className="p-6">Nalaganje statistike …</p>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Statistika</h1>

      {/* Dnevna statistika */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Današnje kalorije" value={`${daily.calories} kcal`} />
        <StatBox title="Obroki danes" value={daily.meals} />
        <StatBox title="Beljakovine danes" value={`${daily.protein} g`} />
      </section>

      {/* Tedenska statistika */}
      <section>
        <h2 className="text-xl font-medium mb-3">Zadnjih 7 dni</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox title="Povp. kalorije" value={`${weekly.avgCalories} kcal`} />
          <StatBox title="Skupaj kalorij" value={`${weekly.totalCalories} kcal`} />
          <StatBox title="Povp. beljakovine" value={`${weekly.avgProtein} g`} />
          <StatBox title="Aktivni dnevi" value={weekly.days} />
        </div>
      </section>

      {/* Graf */}
      <section>
        <h2 className="text-xl font-medium mb-3">Kalorije po dnevih</h2>
        <CaloriesChart data={chart} />
      </section>
    </main>
  );
}

function StatBox({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

