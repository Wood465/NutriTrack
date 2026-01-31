import { test, expect } from '@playwright/test';

test('profile stats show zero when no meals', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'u1',
          ime: 'Jakob',
          priimek: 'Meh',
          email: 'jakob@example.com',
        },
      },
    })
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals')),
    page.goto('/profile'),
  ]);

  const avgCard = page.getByText('Povprecen dnevni vnos').locator('..');
  await expect(avgCard.getByText('0 kcal')).toBeVisible();

  const daysCard = page.getByText('Zabelezeni dnevi').locator('..');
  await expect(daysCard.getByText('0')).toBeVisible();
});
