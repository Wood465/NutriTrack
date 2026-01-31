import { test, expect } from '@playwright/test';

test('landing cards are visible for guests', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/'),
  ]);

  await expect(page.getByText('Hiter zacetek')).toBeVisible();
  await expect(page.getByText('Statistika')).toBeVisible();
  await expect(page.getByText('Fokus')).toBeVisible();
});
