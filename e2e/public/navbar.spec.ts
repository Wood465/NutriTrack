import { test, expect } from '@playwright/test';

test('navbar links exist', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Domov' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'O aplikaciji' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Moji obroki' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible();
});
