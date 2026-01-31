import { test, expect } from '@playwright/test';

test('profile shows user info and computed stats', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-1',
          ime: 'Jakob',
          priimek: 'Meh',
          email: 'jakob@example.com',
        },
      },
    })
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'm1',
          naziv: 'Zajtrk',
          kalorije: 500,
          beljakovine: 20,
          ogljikovi_hidrati: 40,
          mascobe: 10,
          cas: '2026-01-30T08:00:00.000Z',
        },
        {
          id: 'm2',
          naziv: 'Kosilo',
          kalorije: 700,
          beljakovine: 30,
          ogljikovi_hidrati: 60,
          mascobe: 15,
          cas: '2026-01-30T12:00:00.000Z',
        },
        {
          id: 'm3',
          naziv: 'Vecerja',
          kalorije: 900,
          beljakovine: 35,
          ogljikovi_hidrati: 70,
          mascobe: 20,
          cas: '2026-01-31T18:00:00.000Z',
        },
      ],
    })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals')),
    page.goto('/profile'),
  ]);

  await expect(page.getByText('Ime: Jakob')).toBeVisible();
  await expect(page.getByText('Priimek: Meh')).toBeVisible();
  await expect(page.getByText('E-posta: jakob@example.com')).toBeVisible();

  const avgCard = page.getByText('Povprecen dnevni vnos').locator('..');
  await expect(avgCard.getByText('1050 kcal')).toBeVisible();

  const daysCard = page.getByText('Zabelezeni dnevi').locator('..');
  await expect(daysCard.getByText('2')).toBeVisible();
});

test('profile avatar upload triggers API call', async ({ page }) => {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9z5nT3sAAAAASUVORK5CYII=';

  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-2',
          ime: 'Maja',
          priimek: 'Novak',
          email: 'maja@example.com',
        },
      },
    })
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] })
  );

  await page.route('**/api/profile/avatar/view?key=*', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'image/png' },
      body: Buffer.from(pngBase64, 'base64'),
    })
  );

  await page.route('**/api/profile/avatar', (route) =>
    route.fulfill({ status: 200, json: { ok: true } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals')),
    page.goto('/profile'),
  ]);

  const img = page.getByAltText('Profilna slika');
  const initialSrc = await img.getAttribute('src');

  const fileInput = page.locator('input[type="file"][name="avatar"]');
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/profile/avatar')),
    fileInput.setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngBase64, 'base64'),
    }),
  ]);

  await expect(img).toHaveAttribute('src', /\/api\/profile\/avatar\/view\?key=/);
  const updatedSrc = await img.getAttribute('src');
  expect(updatedSrc).not.toBe(initialSrc);
});
