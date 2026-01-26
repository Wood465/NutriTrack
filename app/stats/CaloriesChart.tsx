"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function CaloriesChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <Bar
        data={{
          labels: data.map((d) => new Date(d.date).toLocaleDateString("sl-SI")),
          datasets: [
            {
              label: "Kalorije",
              data: data.map((d) => d.calories),
              borderRadius: 10,
              borderSkipped: false,
              maxBarThickness: 28,
              backgroundColor: (context) => {
                const { chart } = context;
                const { ctx, chartArea } = chart;
                if (!chartArea) return "rgba(59,130,246,0.6)";
                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, "rgba(99,102,241,0.9)");
                gradient.addColorStop(1, "rgba(59,130,246,0.35)");
                return gradient;
              },
              hoverBackgroundColor: "rgba(59,130,246,0.9)",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
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
        }}
      />
    </div>
  );
}
