import { test, expect } from '@playwright/experimental-ct-react';
import Navbar from '@/app/ui/navbar';

test('navbar shows greeting and admin link', async ({ mount, page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          ime: 'Eva',
          role: 'admin',
        },
      },
    }),
  );

  const component = await mount(<Navbar />);

  await expect(component.getByText('NutriTrack')).toBeVisible();
  await expect(component.getByRole('link', { name: 'Profil' })).toBeVisible();
  await expect(component.getByText('Zdravo, Eva')).toBeVisible();
  await expect(component.getByRole('link', { name: 'Admin' })).toBeVisible();
});
