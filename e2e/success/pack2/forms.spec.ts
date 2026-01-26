import { test, expect } from '@playwright/test';

test('theme toggle exists on home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /preklopi temo/i })).toBeVisible();
});

test('login form email field visible', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder(/e-?pošto/i)).toBeVisible();
});

test('login form password field visible', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder(/geslo/i)).toBeVisible();
});

test('register form name fields visible', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByPlaceholder(/vnesi ime/i)).toBeVisible();
  await expect(page.getByPlaceholder(/vnesi priimek/i)).toBeVisible();
});

test('register form password fields visible', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByPlaceholder(/^vnesi geslo$/i)).toBeVisible();
  await expect(page.getByPlaceholder(/ponovno vnesi geslo/i)).toBeVisible();
});
