'use client';

import { useEffect, useState } from 'react';
import CaloriesChart from './CaloriesChart';

// Tipi za podatke iz API-ja (namesto any)
type DayStat = {
  date: string;
  calories: number;
};

type TodayStats = {
  calories: number;
  meals: number;
  protein: number;
};

type WeekStats = {
  avgCalories: number;
  totalCalories: number;
  avgProtein: number;
  days: number;
};

type WeeklyStatsResponse = {
  today: TodayStats;
  week: WeekStats;
  chart: DayStat[];
};

export default function StatsPage() {
  // Bolj striktno tipiziranje (namesto any)
  const [daily, setDaily] = useState<TodayStats | null>(null);
  const [weekly, setWeekly] = useState<WeekStats | null>(null);
  const [chart, setChart] = useState<DayStat[]>([]);

  // Optional UI state za bolj varen fetch
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true; // prepreči setState po unmountu

    async function loadStats() {
      try {
        setError('');

        const res = await fetch('/api/stats/weekly', { cache: 'no-store' });
        const data: WeeklyStatsResponse = await res.json();

        if (!res.ok) {
          // Če backend vrne error field, ga pokažemo, sicer fallback
          const msg = (data as any)?.error || 'Napaka pri nalaganju statistike.';
          if (isMounted) setError(msg);
          return;
        }

        // Nastavi state-e samo, če je komponenta še mountana
        if (!isMounted) return;

        setDaily(data.today);
        setWeekly(data.week);
        setChart(Array.isArray(data.chart) ? data.chart : []);
      } catch {
        if (isMounted) setError('Napaka pri nalaganju statistike.');
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loading stanje (ohranjeno)
  if (!daily || !weekly) {
    return (
      <p className="p-6">
        {error ? error : 'Nalaganje statistike …'}
      </p>
    );
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

function StatBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
