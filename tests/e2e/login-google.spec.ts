import { test, expect } from '@playwright/test';

test('login page shows Google sign-in button', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/login'),
  ]);

  await expect(
    page.getByRole('button', { name: 'Prijava z Googlom' })
  ).toBeVisible();
});
