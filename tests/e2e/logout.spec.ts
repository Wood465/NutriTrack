import { test, expect } from '@playwright/test';

test('logout clears session and redirects to login', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', ime: 'Jakob' } } })
  );

  await page.route('**/api/logout', (route) =>
    route.fulfill({ json: { ok: true } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/'),
  ]);

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/logout')),
    page.getByRole('button', { name: 'Odjava' }).click(),
  ]);

  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Prijava' })).toBeVisible();
});
