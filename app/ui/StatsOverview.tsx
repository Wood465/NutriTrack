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
    return <p>Nalaganje statistike …</p>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Pregled</h2>

      {/* Dnevno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Današnje kalorije" value={`${daily.calories} kcal`} />
        <StatBox title="Obroki danes" value={daily.meals} />
        <StatBox title="Beljakovine danes" value={`${daily.protein} g`} />
      </div>

      {/* Tedensko */}
      <div>
        <h3 className="text-lg font-medium mb-3">Zadnjih 7 dni</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox title="Povp. kalorije" value={`${weekly.avgCalories} kcal`} />
          <StatBox title="Skupaj kalorij" value={`${weekly.totalCalories} kcal`} />
          <StatBox title="Povp. beljakovine" value={`${weekly.avgProtein} g`} />
          <StatBox title="Aktivni dnevi" value={weekly.days} />
        </div>
      </div>

      {/* Graf */}
      <div>
        <h3 className="text-lg font-medium mb-2">Kalorije po dnevih</h3>
        <CaloriesChart data={chart} />
      </div>
    </section>
  );
}

function StatBox({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
