import { test, expect } from '@playwright/test';

test('about page renders core sections', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/about'),
  ]);

  await expect(
    page
      .getByRole('navigation')
      .getByRole('heading', { name: 'NutriTrack', exact: true })
  ).toBeVisible();
  await expect(page.getByText('Kaj lahko delas')).toBeVisible();
  await expect(page.getByText('Kako deluje')).toBeVisible();
});
