import { test, expect } from '@playwright/test';

test('change password page has back to profile link', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', ime: 'Jakob' } } })
  );

  await page.goto('/profile/change-password');

  const backLink = page.getByRole('link', { name: 'Nazaj na profil' });
  await expect(backLink).toBeVisible();

  await backLink.click();
  await page.waitForURL('**/profile');
});
