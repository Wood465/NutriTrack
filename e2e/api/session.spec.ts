import { test, expect } from '@playwright/test';

test('api/session returns json', async ({ request }) => {
  const res = await request.get('/api/session');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('user');
});
