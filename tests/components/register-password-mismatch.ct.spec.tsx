import { test, expect } from '@playwright/experimental-ct-react';
import RegisterPage from '@/app/register/page';

test('register shows error when passwords do not match', async ({
  mount,
}) => {
  const component = await mount(<RegisterPage />);

  await component.locator('#register-ime').fill('Jure');
  await component.locator('#register-priimek').fill('Vidmar');
  await component.locator('#register-email').fill('jure@example.com');
  await component.locator('#register-password').fill('pass1234');
  await component.locator('#register-confirm').fill('pass9999');

  await component.getByRole('button', { name: 'Registracija' }).click();

  await expect(component.getByText('Gesli se ne ujemata.')).toBeVisible();
});
