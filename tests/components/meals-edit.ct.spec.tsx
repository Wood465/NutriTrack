import { test, expect } from '@playwright/experimental-ct-react';
import MealsPage from '@/app/meals/page';

test('meals page edits an existing meal', async ({ mount, page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-12',
          ime: 'Sara',
          priimek: 'Kovac',
          email: 'sara@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({
      json: [
        {
          id: 'meal-3',
          naziv: 'Kosilo',
          kalorije: 700,
          beljakovine: 35,
          ogljikovi_hidrati: 60,
          mascobe: 18,
          cas: '2026-01-31T13:00:00.000Z',
        },
      ],
    }),
  );

  await page.route('**/api/meals/meal-3', async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      json: {
        id: 'meal-3',
        cas: '2026-01-31T13:00:00.000Z',
        ...body,
      },
    });
  });

  const component = await mount(<MealsPage />);

  await expect(component.getByText('Kosilo')).toBeVisible();
  await component.getByRole('button', { name: 'Uredi' }).click();

  await component.locator('#edit-name-meal-3').fill('Pozno kosilo');
  await component.locator('#edit-calories-meal-3').fill('820');
  await component.locator('#edit-protein-meal-3').fill('40');
  await component.locator('#edit-carbs-meal-3').fill('70');
  await component.locator('#edit-fat-meal-3').fill('22');
  await component.getByRole('button', { name: 'Shrani' }).click();

  await expect(component.getByText('Pozno kosilo')).toBeVisible();
  await expect(component.getByText('820 kcal')).toBeVisible();
});
