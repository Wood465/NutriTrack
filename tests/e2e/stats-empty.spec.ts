import { test, expect } from '@playwright/test';

test('stats page handles empty data without crashing', async ({ page }) => {
  await page.route('**/api/stats/weekly', (route) =>
    route.fulfill({
      json: {
        today: { calories: 0, meals: 0, protein: 0 },
        week: {
          avgCalories: 0,
          totalCalories: 0,
          avgProtein: 0,
          days: 0,
        },
        chart: [],
      },
    })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/stats/weekly')),
    page.goto('/stats'),
  ]);

  await expect(page.getByRole('heading', { name: 'Statistika' })).toBeVisible();
  await expect(page.getByText('Današnje kalorije')).toBeVisible();
  await expect(
    page.getByText('Današnje kalorije').locator('..').getByText('0 kcal')
  ).toBeVisible();
});
