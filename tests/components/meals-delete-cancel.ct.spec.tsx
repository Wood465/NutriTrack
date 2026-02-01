import { test, expect } from '@playwright/experimental-ct-react';
import MealsPage from '@/app/meals/page';

test('meals page keeps meal when delete is cancelled', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-14',
          ime: 'Nejc',
          priimek: 'Koren',
          email: 'nejc@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'meal-4',
          naziv: 'Malica',
          kalorije: 250,
          beljakovine: 12,
          ogljikovi_hidrati: 20,
          mascobe: 9,
          cas: '2026-01-31T10:00:00.000Z',
        },
      ],
    }),
  );

  let deleteCalled = false;
  page.on('request', (req) => {
    if (req.url().includes('/api/meals/meal-4') && req.method() === 'DELETE') {
      deleteCalled = true;
    }
  });

  const component = await mount(<MealsPage />);

  await expect(component.getByText('1 skupaj')).toBeVisible();
  await expect(component.getByText('Malica')).toBeVisible();

  page.once('dialog', (dialog) => dialog.dismiss());
  await component.getByRole('button', { name: 'Izbrisi' }).click();

  await expect(component.getByText('1 skupaj')).toBeVisible();
  await expect(component.getByText('Malica')).toBeVisible();
  expect(deleteCalled).toBeFalsy();
});
