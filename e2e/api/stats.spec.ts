import { test, expect } from '@playwright/test';

test('api/stats/weekly does not crash', async ({ request }) => {
  const res = await request.get('/api/stats/weekly');
  expect([200, 401]).toContain(res.status());
});
