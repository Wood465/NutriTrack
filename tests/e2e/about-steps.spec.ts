import { test, expect } from '@playwright/test';

test('about page shows the three steps', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/about'),
  ]);

  await expect(page.getByText('1. Vnos obrokov')).toBeVisible();
  await expect(page.getByText('2. Pregled statistike')).toBeVisible();
  await expect(page.getByText('3. Napredek')).toBeVisible();
});
