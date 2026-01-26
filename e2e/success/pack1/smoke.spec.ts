import { test, expect } from '@playwright/test';

test('home renders hero heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /^NutriTrack$/i })).toBeVisible();
});

test('about heading visible', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: /O aplikaciji/i })).toBeVisible();
});

test('login heading visible', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Dobrodošel nazaj/i })).toBeVisible();
});

test('register heading visible', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /Ustvari račun/i })).toBeVisible();
});

test('navbar brand link present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /NutriTrack/i })).toBeVisible();
});
