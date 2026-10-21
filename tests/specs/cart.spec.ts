import { test, expect } from '../fixtures/test.fixture';
import { products } from '../data/test-data';

test(
  'CT05 | remove um produto e preserva o outro ao continuar comprando',
  { tag: ['@alternative'] },
  async ({ authenticatedInventory: inventory, cartPage, page, captureEvidence }) => {
    await test.step('Adicionar dois produtos diferentes ao carrinho', async () => {
      await inventory.addProduct(products.backpack.name);
      await inventory.addProduct(products.bikeLight.name);
      await expect(inventory.cartBadge).toHaveText('2');
      await inventory.openCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.items).toHaveCount(2);
      await expect(cartPage.product(products.backpack.name)).toBeVisible();
      await expect(cartPage.product(products.bikeLight.name)).toBeVisible();
      await captureEvidence('ct05-carrinho-com-dois-produtos');
    });

    await test.step('Remover somente a mochila e manter a luminária', async () => {
      await cartPage.removeProduct(products.backpack.name);
      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.product(products.backpack.name)).toHaveCount(0);
      await expect(cartPage.product(products.bikeLight.name)).toBeVisible();
      await expect(inventory.cartBadge).toHaveText('1');
      await captureEvidence('ct05-carrinho-apos-remocao');
    });

    await test.step('Continuar comprando e verificar a persistência no carrinho', async () => {
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventory.title).toHaveText('Products');
      await expect(inventory.cartBadge).toHaveText('1');
      await expect(
        inventory
          .product(products.backpack.name)
          .getByRole('button', { name: 'Add to cart', exact: true }),
      ).toBeVisible();
      await expect(
        inventory
          .product(products.bikeLight.name)
          .getByRole('button', { name: 'Remove', exact: true }),
      ).toBeVisible();
      await inventory.openCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.product(products.backpack.name)).toHaveCount(0);
      await expect(cartPage.product(products.bikeLight.name)).toBeVisible();
      await captureEvidence('ct05-produto-preservado-apos-navegar');
    });
  },
);
