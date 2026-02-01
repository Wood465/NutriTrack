'use client';

import { useEffect, useState } from 'react';
import CaloriesChart from '../stats/CaloriesChart';
import { fetchWithTimeout } from '@/app/lib/fetch-timeout';

export default function StatsOverview() {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchWithTimeout(
          '/api/stats/weekly',
          { cache: 'no-store' },
          7000,
        );
        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        setDaily(data.today);
        setWeekly(data.week);
        setChart(data.chart);
      } catch {
        setError(true);
      }
    }

    loadStats();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 text-sm text-gray-600 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80 dark:text-gray-300">
        Statistika trenutno ni na voljo.
      </div>
    );
  }

  if (!daily || !weekly) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 text-sm text-gray-600 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80 dark:text-gray-300">
        Nalaganje statistike ...
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Pregled
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Zadnja osvezitev: danes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatBox title="Danes" value={`${daily.calories} kcal`} note="Kalorije" />
        <StatBox title="Obroki" value={daily.meals} note="Danes" />
        <StatBox title="Beljakovine" value={`${daily.protein} g`} note="Danes" />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Zadnjih 7 dni
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBox
            title="Povp. kalorije"
            value={`${weekly.avgCalories} kcal`}
            note="Na dan"
          />
          <StatBox
            title="Skupaj kalorij"
            value={`${weekly.totalCalories} kcal`}
            note="Skupno"
          />
          <StatBox
            title="Povp. beljakovine"
            value={`${weekly.avgProtein} g`}
            note="Na dan"
          />
          <StatBox title="Aktivni dnevi" value={weekly.days} note="Od 7" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Kalorije po dnevih
          </h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
            Teden
          </span>
        </div>
        <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80">
          <CaloriesChart data={chart} />
        </div>
      </div>
    </section>
  );
}

function StatBox({
  title,
  value,
  note,
}: {
  title: string;
  value: any;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
      <div className="mb-3 h-1 w-12 rounded-full bg-blue-500/70" />
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
    </div>
  );
}

