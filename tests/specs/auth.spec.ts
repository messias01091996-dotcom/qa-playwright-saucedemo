import { test, expect } from '../fixtures/test.fixture';
import { invalidUser, validUser } from '../data/test-data';

test.describe('Autenticação', () => {
  test(
    'CT01 | permite login com credenciais válidas',
    { tag: ['@positive', '@smoke'] },
    async ({ loginPage, inventoryPage, page, captureEvidence }) => {
      await loginPage.goto();
      await loginPage.login(validUser);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.items).toHaveCount(6);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
      await captureEvidence('ct01-catalogo-apos-login');
    },
  );

  test(
    'CT02 | rejeita login com senha inválida',
    { tag: ['@negative'] },
    async ({ loginPage, inventoryPage, page, captureEvidence }) => {
      await loginPage.goto();
      await loginPage.login(invalidUser);

      await expect(loginPage.error).toHaveText(
        'Epic sadface: Username and password do not match any user in this service',
      );
      await expect(loginPage.submitButton).toBeVisible();
      await expect(page).toHaveURL(/\/$/);
      await expect(inventoryPage.items).toHaveCount(0);
      await captureEvidence('ct02-senha-invalida-rejeitada');
    },
  );
});
