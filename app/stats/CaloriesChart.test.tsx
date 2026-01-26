/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CaloriesChart from './CaloriesChart';

// Mock the Bar component so we don't need canvas in JSDOM
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data }: any) => (
    <div data-testid="bar-mock">
      {JSON.stringify({ labels: data?.labels, values: data?.datasets?.[0]?.data })}
    </div>
  ),
}));

describe('CaloriesChart', () => {
  it('passes labels and values to the chart', () => {
    const data = [
      { date: '2026-01-24', calories: 1200 },
      { date: '2026-01-25', calories: 1500 },
    ];

    render(<CaloriesChart data={data} />);

    const chart = screen.getByTestId('bar-mock');
    expect(chart).toBeInTheDocument();
    const text = chart.textContent ?? '';

    expect(text).toMatch(/1200/);
    expect(text).toMatch(/1500/);
  });
});
