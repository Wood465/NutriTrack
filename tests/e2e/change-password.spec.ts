import { test, expect } from '@playwright/test';

test('change password shows error on failure', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', ime: 'Jakob' } } })
  );

  await page.route('**/api/change-password', (route) =>
    route.fulfill({ status: 400, json: { error: 'Napacno geslo' } })
  );

  await page.goto('/profile/change-password');

  await page.locator('#old-password').fill('old');
  await page.locator('#new-password').fill('new');

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/change-password')),
    page.getByRole('button', { name: 'Spremeni geslo' }).click(),
  ]);

  await expect(page.getByText('Napacno geslo')).toBeVisible();
});

test('change password shows success', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', ime: 'Jakob' } } })
  );

  await page.route('**/api/change-password', (route) =>
    route.fulfill({ json: { ok: true } })
  );

  await page.goto('/profile/change-password');

  await page.locator('#old-password').fill('old');
  await page.locator('#new-password').fill('new');

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/change-password')),
    page.getByRole('button', { name: 'Spremeni geslo' }).click(),
  ]);

  await expect(page.getByText('Geslo uspesno spremenjeno!')).toBeVisible();
});
