/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsOverview from './StatsOverview';

vi.mock('../stats/CaloriesChart', () => ({
  default: ({ data }: any) => (
    <div data-testid="chart-mock">{Array.isArray(data) ? data.length : 0}</div>
  ),
}));

describe('StatsOverview', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        today: { calories: 1200, meals: 3, protein: 90 },
        week: { avgCalories: 1000, totalCalories: 7000, avgProtein: 80, days: 7 },
        chart: [{ date: '2026-01-24', calories: 1200 }],
      }),
    } as Response)));
  });

  it('renders stats and chart after load', async () => {
    render(<StatsOverview />);

    expect(await screen.findByText(/Pregled/i)).toBeInTheDocument();
    expect(screen.getByText(/Današnje kalorije/i)).toBeInTheDocument();
    expect(screen.getByText(/1200 kcal/i)).toBeInTheDocument();
    expect(screen.getByText(/Povp\. kalorije/i)).toBeInTheDocument();
    expect(screen.getByText(/1000 kcal/i)).toBeInTheDocument();
    expect(screen.getByTestId('chart-mock')).toHaveTextContent('1');
  });
});
