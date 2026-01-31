import { test, expect } from '@playwright/test';

test('login page has link to register', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/login'),
  ]);

  const link = page.getByRole('link', { name: 'Registracija' });
  await expect(link).toBeVisible();

  await link.click();
  await page.waitForURL('**/register');
});
