import { test, expect } from '@playwright/test';

test('stats page shows loading then data', async ({ page }) => {
  await page.route('**/api/stats/weekly', (route) =>
    route.fulfill({
      json: {
        today: { calories: 1100, meals: 2, protein: 70 },
        week: {
          avgCalories: 1400,
          totalCalories: 9800,
          avgProtein: 85,
          days: 7,
        },
        chart: [
          { date: '2026-01-25', calories: 1200 },
          { date: '2026-01-26', calories: 1400 },
          { date: '2026-01-27', calories: 1500 },
          { date: '2026-01-28', calories: 1350 },
          { date: '2026-01-29', calories: 1450 },
          { date: '2026-01-30', calories: 1550 },
          { date: '2026-01-31', calories: 1100 },
        ],
      },
    })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/stats/weekly')),
    page.goto('/stats'),
  ]);

  await expect(page.getByRole('heading', { name: 'Statistika' })).toBeVisible();
  await expect(page.getByText('Današnje kalorije')).toBeVisible();
  await expect(page.getByText('1100 kcal')).toBeVisible();
});
