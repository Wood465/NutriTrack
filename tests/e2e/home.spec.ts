import { test, expect } from '@playwright/test';

test('home shows marketing when not logged in', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/'),
  ]);

  await expect(
    page
      .getByRole('navigation')
      .getByRole('heading', { name: 'NutriTrack', exact: true })
  ).toBeVisible();
  await expect(page.getByText('Dodaj obrok v 10 sekundah')).toBeVisible();
});

test('home shows stats when logged in', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', ime: 'Jakob' } } })
  );

  await page.route('**/api/stats/weekly', (route) =>
    route.fulfill({
      json: {
        today: { calories: 1200, meals: 3, protein: 90 },
        week: {
          avgCalories: 1500,
          totalCalories: 10500,
          avgProtein: 95,
          days: 7,
        },
        chart: [
          { date: '2026-01-25', calories: 1400 },
          { date: '2026-01-26', calories: 1600 },
          { date: '2026-01-27', calories: 1500 },
          { date: '2026-01-28', calories: 1300 },
          { date: '2026-01-29', calories: 1700 },
          { date: '2026-01-30', calories: 1550 },
          { date: '2026-01-31', calories: 1200 },
        ],
      },
    })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/stats/weekly')),
    page.goto('/'),
  ]);

  await expect(page.getByRole('heading', { name: 'Zivjo, Jakob' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Pregled', exact: true })
  ).toBeVisible();
});
