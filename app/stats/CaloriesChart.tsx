"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartArea,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registracija potrebnih komponent za Chart.js (Bar chart + osi + tooltip)
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Tipizirajmo input (namesto any[]), brez spremembe funkcionalnosti
type CaloriesPoint = {
  date: string | Date; // pričakuješ datum (string ali Date)
  calories: number; // vrednost kalorij za dan
};

export default function CaloriesChart({ data }: { data: CaloriesPoint[] }) {
  // Funkcija za gradient background (Chart.js kliče to za vsak bar)
  function getBarGradient(
    context: ScriptableContext<"bar">
  ): string | CanvasGradient {
    const { chart } = context;
    const { ctx, chartArea } = chart;

    // ChartArea ni na voljo pri prvem renderju (pred layoutom)
    if (!chartArea) return "rgba(59,130,246,0.6)";

    const area = chartArea as ChartArea;

    // Vertikalni gradient od vrha do dna grafa
    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    gradient.addColorStop(0, "rgba(99,102,241,0.9)");
    gradient.addColorStop(1, "rgba(59,130,246,0.35)");
    return gradient;
  }

  // Pripravimo Chart.js data objekt (ločeno zaradi preglednosti)
  const chartData: ChartData<"bar"> = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString("sl-SI")),
    datasets: [
      {
        label: "Kalorije",
        data: data.map((d) => d.calories),
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 28,
        backgroundColor: getBarGradient,
        hoverBackgroundColor: "rgba(59,130,246,0.9)",
      },
    ],
  };

  // Pripravimo options objekt (ločeno zaradi preglednosti)
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // Legend je izklopljen (imaš samo en dataset)
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        padding: 10,
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        displayColors: true,
        callbacks: {
          // `raw` je vrednost bara (kalorije)
          label: (item) => ` Kalorije: ${item.raw} kcal`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", maxRotation: 0, autoSkip: true },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(148,163,184,0.25)" },
        ticks: { color: "#64748b" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
