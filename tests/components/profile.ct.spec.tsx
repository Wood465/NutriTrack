import { test, expect } from '@playwright/experimental-ct-react';
import ProfilePage from '@/app/profile/page';

test('profile shows computed stats from meals', async ({ mount, page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-1',
          ime: 'Nika',
          priimek: 'Kovac',
          email: 'nika@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'm1',
          naziv: 'Zajtrk',
          kalorije: 400,
          beljakovine: 20,
          ogljikovi_hidrati: 30,
          mascobe: 12,
          cas: '2026-01-30T08:00:00.000Z',
        },
        {
          id: 'm2',
          naziv: 'Kosilo',
          kalorije: 800,
          beljakovine: 35,
          ogljikovi_hidrati: 60,
          mascobe: 20,
          cas: '2026-01-31T12:00:00.000Z',
        },
      ],
    }),
  );

  const component = await mount(<ProfilePage />);

  await expect(component.getByText('Ime: Nika')).toBeVisible();
  await expect(component.getByText('Priimek: Kovac')).toBeVisible();
  await expect(component.getByText('E-posta: nika@example.com')).toBeVisible();

  const avgCard = component.getByText('Povprecen dnevni vnos').locator('..');
  await expect(avgCard.getByText('600 kcal')).toBeVisible();

  const daysCard = component.getByText('Zabelezeni dnevi').locator('..');
  await expect(daysCard.getByText('2')).toBeVisible();
});

test('profile shows zero stats when there are no meals', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-2',
          ime: 'Tina',
          priimek: 'Horvat',
          email: 'tina@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [],
    }),
  );

  const component = await mount(<ProfilePage />);

  await expect(component.getByText('Ime: Tina')).toBeVisible();
  await expect(component.getByText('Priimek: Horvat')).toBeVisible();
  await expect(component.getByText('E-posta: tina@example.com')).toBeVisible();

  const avgCard = component.getByText('Povprecen dnevni vnos').locator('..');
  await expect(avgCard.getByText('0 kcal')).toBeVisible();

  const daysCard = component.getByText('Zabelezeni dnevi').locator('..');
  await expect(daysCard.getByText('0')).toBeVisible();
});
