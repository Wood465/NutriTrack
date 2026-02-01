import { test, expect } from '@playwright/experimental-ct-react';
import ProfilePage from '@/app/profile/page';

test('profile avatar falls back to default image on error', async ({
  mount,
  page,
}) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'user-3',
          ime: 'Luka',
          priimek: 'Nova',
          email: 'luka@example.com',
        },
      },
    }),
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] }),
  );

  await page.route('**/api/profile/avatar/view?key=*', (route) =>
    route.fulfill({ status: 404 }),
  );

  const component = await mount(<ProfilePage />);

  await page.waitForResponse((res) =>
    res.url().includes('/api/profile/avatar/view?key='),
  );

  const avatar = component.getByAltText('Profilna slika');
  await expect(avatar).toHaveAttribute('src', /avatar-default\.svg/);
});
