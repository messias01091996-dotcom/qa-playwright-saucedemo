import { test as base, expect } from '@playwright/test';
import { validUser } from '../data/test-data';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedInventory: InventoryPage;
  captureEvidence: (name: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  captureEvidence: async ({ page }, use, testInfo) => {
    await use(async (name: string) => {
      await test.step(`Evidência: ${name}`, async () => {
        const screenshotPath = testInfo.outputPath(`${name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach(name, {
          path: screenshotPath,
          contentType: 'image/png',
        });
      });
    });
  },
  authenticatedInventory: async ({ loginPage, inventoryPage, page }, use) => {
    await test.step('Pré-condição: autenticar em um contexto novo', async () => {
      await loginPage.goto();
      await loginPage.login(validUser);
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    });
    await use(inventoryPage);
  },
});

export { expect };
