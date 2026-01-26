import { test, expect } from '@playwright/test';

test('api/session responds 200', async ({ request }) => {
  const res = await request.get('/api/session');
  expect(res.status()).toBe(200);
});

test('api/stats/weekly responds 200/401', async ({ request }) => {
  const res = await request.get('/api/stats/weekly');
  expect([200, 401]).toContain(res.status());
});

test('api/meals responds 200/401/500', async ({ request }) => {
  const res = await request.get('/api/meals?user_id=0');
  expect([200, 401, 500]).toContain(res.status());
});

test('api/login method not allowed or auth error', async ({ request }) => {
  const res = await request.get('/api/login');
  expect([400, 401, 405]).toContain(res.status());
});

test('api/register method not allowed or auth error', async ({ request }) => {
  const res = await request.get('/api/register');
  expect([400, 401, 405]).toContain(res.status());
});
