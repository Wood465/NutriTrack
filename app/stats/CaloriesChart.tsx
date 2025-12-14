'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function CaloriesChart({ data }: { data: any[] }) {
  return (
    <Bar
      data={{
        labels: data.map(d => d.date),
        datasets: [
          {
            label: 'Kalorije',
            data: data.map(d => d.calories),
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  );
}
