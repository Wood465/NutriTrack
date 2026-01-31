import { test, expect } from '@playwright/test';

test('login shows API error message', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );
  await page.route('**/api/login', (route) =>
    route.fulfill({ status: 400, json: { error: 'Napacno geslo' } })
  );

  await page.goto('/login');

  await page.getByLabel('E-posta').fill('test@mail.com');
  await page.getByLabel('Geslo').fill('wrong');
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/login')),
    page
      .getByRole('button', { name: 'Prijava', exact: true })
      .first()
      .click(),
  ]);

  await expect(page.getByText('Napacno geslo')).toBeVisible();
});

test('register validates password mismatch', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );
  await page.goto('/register');

  await page.locator('#register-ime').fill('Jakob');
  await page.locator('#register-priimek').fill('Meh');
  await page.locator('#register-email').fill('jakob@example.com');
  await page.locator('#register-password').fill('geslo1');
  await page.locator('#register-confirm').fill('geslo2');

  await page.getByRole('button', { name: 'Registracija' }).click();

  await expect(page.getByText('Gesli se ne ujemata.')).toBeVisible();
});

test('register success redirects to login', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );
  await page.route('**/api/register', (route) =>
    route.fulfill({ json: { success: true } })
  );

  await page.goto('/register');

  await page.locator('#register-ime').fill('Jakob');
  await page.locator('#register-priimek').fill('Meh');
  await page.locator('#register-email').fill('jakob@example.com');
  await page.locator('#register-password').fill('geslo1');
  await page.locator('#register-confirm').fill('geslo1');

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/register')),
    page.getByRole('button', { name: 'Registracija' }).click(),
  ]);

  await expect(page.getByText('Registracija uspesna. Preusmerjam...')).toBeVisible();
  await page.waitForURL('**/login', { timeout: 5_000 });
});
