import { test, expect } from '@playwright/test';

test('navbar shows login when logged out', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/'),
  ]);

  await expect(page.getByRole('link', { name: 'Prijava' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Odjava' })).toHaveCount(0);
});

test('navbar shows admin link for admin user', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: { id: 'admin-1', ime: 'Admin', role: 'admin' },
      },
    })
  );

  await page.route('**/api/stats/weekly', (route) =>
    route.fulfill({
      json: {
        today: { calories: 1000, meals: 2, protein: 80 },
        week: {
          avgCalories: 1400,
          totalCalories: 9800,
          avgProtein: 90,
          days: 7,
        },
        chart: [
          { date: '2026-01-25', calories: 1400 },
          { date: '2026-01-26', calories: 1500 },
          { date: '2026-01-27', calories: 1300 },
          { date: '2026-01-28', calories: 1600 },
          { date: '2026-01-29', calories: 1200 },
          { date: '2026-01-30', calories: 1700 },
          { date: '2026-01-31', calories: 1400 },
        ],
      },
    })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/stats/weekly')),
    page.goto('/'),
  ]);

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await expect(page.getByText('Zdravo, Admin')).toBeVisible();
});
