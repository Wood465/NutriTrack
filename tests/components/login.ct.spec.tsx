import { test, expect } from '@playwright/experimental-ct-react';
import LoginPage from '@/app/login/page';
import {
  __getSignInCalls,
  __resetSignInCalls,
} from '@/tests/components/mocks/next-auth-react';

test('login shows error on invalid credentials', async ({ mount, page }) => {
  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: null } }),
  );

  await page.route('**/api/login', (route) =>
    route.fulfill({
      status: 401,
      json: { error: 'Napacni podatki' },
    }),
  );

  const component = await mount(<LoginPage />);

  await component.getByLabel('E-posta').fill('user@example.com');
  await component.getByLabel('Geslo').fill('badpass');
  await component
    .getByRole('button', { name: 'Prijava', exact: true })
    .click();

  await expect(component.getByText('Napacni podatki')).toBeVisible();
});

// Google sign-in test removed per request.
