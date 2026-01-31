import { test, expect } from '@playwright/test';

test('user can add, edit, and delete a meal', async ({ page }) => {
  const userId = '11111111-1111-1111-1111-111111111111';
  const baseMeal = {
    id: 'meal-1',
    naziv: 'Kosilo',
    kalorije: 450,
    beljakovine: 30,
    ogljikovi_hidrati: 50,
    mascobe: 10,
    cas: '2026-01-31T10:00:00.000Z',
  };

  await page.route('**/api/session', (route) =>
    route.fulfill({ json: { user: { id: userId, ime: 'Jakob' } } })
  );

  await page.route('**/api/meals?user_id=*', (route) =>
    route.fulfill({ json: [] })
  );

  await page.route('**/api/meals', async (route) => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }
    const body = JSON.parse(route.request().postData() || '{}');
    return route.fulfill({
      json: {
        ...baseMeal,
        naziv: body.naziv ?? baseMeal.naziv,
        kalorije: body.kalorije ?? baseMeal.kalorije,
        beljakovine: body.beljakovine ?? baseMeal.beljakovine,
        ogljikovi_hidrati: body.ogljikovi_hidrati ?? baseMeal.ogljikovi_hidrati,
        mascobe: body.mascobe ?? baseMeal.mascobe,
      },
    });
  });

  await page.route('**/api/meals/*', async (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      const body = JSON.parse(route.request().postData() || '{}');
      return route.fulfill({
        json: {
          ...baseMeal,
          naziv: body.naziv ?? baseMeal.naziv,
          kalorije: body.kalorije ?? baseMeal.kalorije,
          beljakovine: body.beljakovine ?? baseMeal.beljakovine,
          ogljikovi_hidrati: body.ogljikovi_hidrati ?? baseMeal.ogljikovi_hidrati,
          mascobe: body.mascobe ?? baseMeal.mascobe,
        },
      });
    }
    if (method === 'DELETE') {
      return route.fulfill({ json: { ok: true } });
    }
    return route.fallback();
  });

  page.on('dialog', (dialog) => dialog.accept());

  await page.goto('/meals');

  const addForm = page.locator('form').first();
  await addForm.getByLabel('Ime obroka').fill('Kosilo');
  await addForm.getByLabel('Kalorije').fill('450');
  await addForm.getByLabel('Beljakovine (g)').fill('30');
  await addForm.getByLabel('Ogljikovi hidrati (g)').fill('50');
  await addForm.getByLabel('Mascobe (g)').fill('10');

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals') && res.request().method() === 'POST'),
    page.getByRole('button', { name: 'Dodaj obrok' }).click(),
  ]);

  await expect(page.getByText('Kosilo')).toBeVisible();
  await expect(page.getByText('450 kcal')).toBeVisible();

  await page.getByRole('button', { name: 'Uredi' }).click();
  const editCard = page.locator('li').filter({
    has: page.getByRole('button', { name: 'Shrani' }),
  });
  await editCard.getByLabel('Ime obroka').fill('Kosilo 2');
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals/') && res.request().method() === 'PUT'),
    editCard.getByRole('button', { name: 'Shrani' }).click(),
  ]);

  await expect(page.getByText('Kosilo 2')).toBeVisible();

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/meals/') && res.request().method() === 'DELETE'),
    page.getByRole('button', { name: 'Izbrisi' }).click(),
  ]);
  await expect(page.getByText('Kosilo 2')).toHaveCount(0);
});
