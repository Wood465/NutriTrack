import { test, expect } from '@playwright/experimental-ct-react';
import MealsPage from '@/app/meals/page';

test('meals page shows empty state when API returns no meals', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-15',
          ime: 'Anja',
          priimek: 'Hribar',
          email: 'anja@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ status: 500, json: [] }),
  );

  const component = await mount(<MealsPage />);

  await expect(component.getByText('0 skupaj')).toBeVisible();
  await expect(
    component.getByText(
      'Se ni dodanih obrokov. Dodaj prvega in zacni spremljati vnos.',
    ),
  ).toBeVisible();
});
