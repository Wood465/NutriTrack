import { test, expect } from '@playwright/experimental-ct-react';
import MealsPage from '@/app/meals/page';

test('meals page adds a new meal and updates count', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-10',
          ime: 'Tina',
          priimek: 'Novak',
          email: 'tina@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] }),
  );

  await page.route('**/api/meals', async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      json: {
        id: 'meal-1',
        cas: '2026-01-31T12:00:00.000Z',
        ...body,
      },
    });
  });

  const component = await mount(<MealsPage />);

  await expect(component.getByText('0 skupaj')).toBeVisible();

  await component.getByLabel('Ime obroka').fill('Kosilo');
  await component.getByLabel('Kalorije').fill('650');
  await component.getByLabel('Beljakovine (g)').fill('30');
  await component.getByLabel('Ogljikovi hidrati (g)').fill('55');
  await component.getByLabel('Mascobe (g)').fill('18');
  await component.getByLabel('Opis (neobvezno)').fill('Testni obrok');

  await component.getByRole('button', { name: 'Dodaj obrok' }).click();

  await expect(component.getByText('1 skupaj')).toBeVisible();
  await expect(component.getByText('Kosilo')).toBeVisible();
  await expect(component.getByText('650 kcal')).toBeVisible();
  await expect(component.getByText('Beljakovine: 30 g')).toBeVisible();
});
