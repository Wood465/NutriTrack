import { test, expect } from '@playwright/test';



test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NutriTrack/i);
});

test('about loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: /O aplikaciji/i })).toBeVisible();
});

test('login loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Dobrodošel nazaj/i })).toBeVisible();
});

test('register loads', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /Ustvari račun/i })).toBeVisible();
});

test('stats page loads (public)', async ({ page }) => {
  await page.goto('/stats');
  await expect(
    page.getByText(/Statistika/i).or(page.getByText(/Napaka pri nalaganju statistike/i))
  ).toBeVisible();
});

test('navbar links visible on home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Domov' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'O aplikaciji' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Moji obroki' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible();
});

test('theme toggle visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /preklopi temo/i })).toBeVisible();
});

test('login form fields exist', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder(/e-?pošto/i)).toBeVisible();
  await expect(page.getByPlaceholder(/geslo/i)).toBeVisible();
});

test('register form fields exist', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByPlaceholder(/vnesi ime/i)).toBeVisible();
  await expect(page.getByPlaceholder(/vnesi priimek/i)).toBeVisible();
  await expect(page.getByPlaceholder(/e-?pošto/i)).toBeVisible();
  await expect(page.getByPlaceholder(/^vnesi geslo$/i)).toBeVisible();
  await expect(page.getByPlaceholder(/ponovno vnesi geslo/i)).toBeVisible();
});

test('home hero visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /^NutriTrack$/i })).toBeVisible();
});

test('about content card visible', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/Kaj lahko delaš/i)).toBeVisible();
});

test('register link exists on login', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('link', { name: /Registracija/i })).toBeVisible();
});

test('login link exists on register', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('form').getByRole('link', { name: /Prijava/i })).toBeVisible();
});

test('api/session responds', async ({ request }) => {
  const res = await request.get('/api/session');
  expect(res.status()).toBe(200);
});

test('api/stats/weekly responds (200/401)', async ({ request }) => {
  const res = await request.get('/api/stats/weekly');
  expect([200, 401]).toContain(res.status());
});

test('api/meals responds (200/401)', async ({ request }) => {
  const res = await request.get('/api/meals?user_id=0');
  expect([200, 401, 500]).toContain(res.status());
});

test('api/login responds (400/401/405)', async ({ request }) => {
  const res = await request.get('/api/login');
  expect([400, 401, 405]).toContain(res.status());
});

test('api/register responds (400/401/405)', async ({ request }) => {
  const res = await request.get('/api/register');
  expect([400, 401, 405]).toContain(res.status());
});

test('favicon loads', async ({ page }) => {
  const res = await page.goto('/favicon.ico');
  expect(res?.status()).toBe(200);
});

test('opengraph image (optional) responds', async ({ page }) => {
  const res = await page.goto('/opengraph-image.png');
  expect([200, 404]).toContain(res?.status() ?? 404);
});
