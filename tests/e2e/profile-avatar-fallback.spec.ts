import { test, expect } from '@playwright/test';

test('profile avatar falls back to default on error', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'u1',
          ime: 'Jakob',
          priimek: 'Meh',
          email: 'jakob@example.com',
        },
      },
    })
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] })
  );

  await page.route('**/api/profile/avatar/view?key=*', (route) =>
    route.abort()
  );

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals')),
    page.goto('/profile'),
  ]);

  const img = page.getByAltText('Profilna slika');
  await img.waitFor();

  await page.evaluate(() => {
    const el = document.querySelector<HTMLImageElement>('img[alt="Profilna slika"]');
    if (el) {
      el.dispatchEvent(new Event('error'));
    }
  });

  await expect(img).toHaveAttribute('src', '/avatar-default.svg');
});
