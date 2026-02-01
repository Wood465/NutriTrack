import { test, expect } from '@playwright/experimental-ct-react';
import MealsPage from '@/app/meals/page';

test('meals page deletes a meal after confirm', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-11',
          ime: 'Maja',
          priimek: 'Horvat',
          email: 'maja@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'meal-2',
          naziv: 'Zajtrk',
          kalorije: 300,
          beljakovine: 15,
          ogljikovi_hidrati: 35,
          mascobe: 8,
          cas: '2026-01-31T07:30:00.000Z',
        },
      ],
    }),
  );

  await page.route('**/api/meals/meal-2', (route) =>
    route.fulfill({ status: 200, json: { ok: true } }),
  );

  const component = await mount(<MealsPage />);

  await expect(component.getByText('1 skupaj')).toBeVisible();
  await expect(component.getByText('Zajtrk')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await component.getByRole('button', { name: 'Izbrisi' }).click();

  await expect(component.getByText('0 skupaj')).toBeVisible();
  await expect(
    component.getByText(
      'Se ni dodanih obrokov. Dodaj prvega in zacni spremljati vnos.',
    ),
  ).toBeVisible();
});
