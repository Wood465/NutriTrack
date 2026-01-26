import { test, expect } from '@playwright/test';

test('about content visible', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/Kaj lahko delaš/i)).toBeVisible();
});

test('home navbar links visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Domov' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'O aplikaciji' })).toBeVisible();
});

test('register link visible on login', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('link', { name: /Registracija/i })).toBeVisible();
});

test('login link visible in register form', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('form').getByRole('link', { name: /Prijava/i })).toBeVisible();
});

test('favicon returns 200', async ({ page }) => {
  const res = await page.goto('/favicon.ico');
  expect(res?.status()).toBe(200);
});
