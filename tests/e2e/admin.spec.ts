import { test, expect } from '@playwright/test';

test('non-admin is redirected away from admin page', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'u1', role: 'user' } } })
  );

  await page.goto('/admin');
  await page.waitForURL('**/', { timeout: 5_000 });
});

test('admin can view users and toggle role', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'a1', role: 'admin' } } })
  );

  await page.route('**/api/admin/users', (route) =>
    route.fulfill({
      json: [
        { id: 'u1', email: 'user1@example.com', role: 'user' },
        { id: 'u2', email: 'admin@example.com', role: 'admin' },
      ],
    })
  );

  await page.route('**/api/admin/users/*/role', (route) =>
    route.fulfill({ json: { ok: true } })
  );

  await page.goto('/admin');

  await expect(page.getByText('Admin Panel')).toBeVisible();
  await expect(page.getByText('user1@example.com')).toBeVisible();

  await page.getByRole('button', { name: 'Make Admin' }).click();
  await expect(page.getByRole('cell', { name: 'admin' }).first()).toBeVisible();
});

test('admin can delete user', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: 'a1', role: 'admin' } } })
  );

  await page.route('**/api/admin/users', (route) =>
    route.fulfill({
      json: [{ id: 'u1', email: 'user1@example.com', role: 'user' }],
    })
  );

  await page.route('**/api/admin/users/*', (route) =>
    route.fulfill({ json: { ok: true } })
  );

  await page.goto('/admin');

  await expect(page.getByText('user1@example.com')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('user1@example.com')).toHaveCount(0);
});
