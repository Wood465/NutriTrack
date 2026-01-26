import { test, expect } from '@playwright/test';

test('about opens', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('login opens', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText(/prijava/i)).toBeVisible();
});

test('register opens', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByText(/registracija/i)).toBeVisible();
});
