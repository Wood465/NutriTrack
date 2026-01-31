import { test, expect } from '@playwright/test';

test('meals submit blocked when no user session', async ({ page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } })
  );
  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] })
  );

  let alertMessage = '';
  page.on('dialog', (dialog) => {
    alertMessage = dialog.message();
    dialog.accept();
  });

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/session')),
    page.goto('/meals'),
  ]);

  const addForm = page.locator('form').first();
  await addForm.getByLabel('Ime obroka').fill('Test');
  await addForm.getByLabel('Kalorije').fill('100');

  const submitBtn = addForm.getByRole('button', { name: 'Dodaj obrok' });
  await expect(submitBtn).toBeDisabled();

  await expect.poll(() => alertMessage).toBe('');
});
