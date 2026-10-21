import { test, expect } from '../fixtures/test.fixture';
import { customer, products } from '../data/test-data';

test.describe('Checkout', () => {
  test(
    'CT03 | conclui a compra com produto, quantidade e valores corretos',
    { tag: ['@positive', '@smoke'] },
    async ({
      authenticatedInventory: inventory,
      cartPage,
      checkoutPage,
      page,
      captureEvidence,
    }) => {
      const expectedPrice = `$${(products.backpack.priceInCents / 100).toFixed(2)}`;

      await test.step('Adicionar o produto e conferir o carrinho', async () => {
        await inventory.addProduct(products.backpack.name);
        await expect(inventory.cartBadge).toHaveText('1');
        await inventory.openCart();
        await expect(cartPage.items).toHaveCount(1);
        await expect(cartPage.product(products.backpack.name)).toBeVisible();
        await expect(cartPage.items.getByTestId('item-quantity')).toHaveText(
          '1',
        );
        await expect(
          cartPage.items.getByTestId('inventory-item-price'),
        ).toHaveText(expectedPrice);
        await captureEvidence('ct03-carrinho-validado');
        await cartPage.checkout();
      });

      await test.step('Preencher dados e conferir o resumo antes da compra', async () => {
        await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
        await checkoutPage.fillCustomer(customer);
        await checkoutPage.continue();
        await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
        await expect(checkoutPage.title).toHaveText('Checkout: Overview');
        await expect(checkoutPage.items).toHaveCount(1);
        await expect(
          checkoutPage.items.getByTestId('inventory-item-name'),
        ).toHaveText(products.backpack.name);
        await expect(
          checkoutPage.items.getByTestId('item-quantity'),
        ).toHaveText('1');
        await expect(
          checkoutPage.items.getByTestId('inventory-item-price'),
        ).toHaveText(expectedPrice);

        // Oráculo independente da UI: catálogo demo de $29.99 e imposto de 8%.
        const subtotalInCents = products.backpack.priceInCents;
        const taxInCents = Math.round(subtotalInCents * 0.08);
        await expect(checkoutPage.subtotal).toHaveText(
          `Item total: $${(subtotalInCents / 100).toFixed(2)}`,
        );
        await expect(checkoutPage.tax).toHaveText(
          `Tax: $${(taxInCents / 100).toFixed(2)}`,
        );
        await expect(checkoutPage.total).toHaveText(
          `Total: $${((subtotalInCents + taxInCents) / 100).toFixed(2)}`,
        );
        await captureEvidence('ct03-resumo-e-valores-da-compra');
      });

      await test.step('Finalizar e confirmar a compra e a limpeza do carrinho', async () => {
        await checkoutPage.finish();
        await expect(page).toHaveURL(/\/checkout-complete\.html$/);
        await expect(checkoutPage.confirmation).toBeVisible();
        await expect(inventory.cartBadge).toHaveCount(0);
        await captureEvidence('ct03-compra-confirmada');
        await checkoutPage.backToProducts();
        await inventory.openCart();
        await expect(cartPage.title).toHaveText('Your Cart');
        await expect(cartPage.items).toHaveCount(0);
        await captureEvidence('ct03-carrinho-vazio-apos-compra');
      });
    },
  );

  test(
    'CT04 | bloqueia checkout sem nome e permite continuar após corrigir',
    { tag: ['@negative', '@alternative'] },
    async ({
      authenticatedInventory: inventory,
      cartPage,
      checkoutPage,
      page,
      captureEvidence,
    }) => {
      await inventory.addProduct(products.bikeLight.name);
      await inventory.openCart();
      await cartPage.checkout();

      await test.step('Enviar o formulário sem o primeiro nome', async () => {
        await checkoutPage.fillCustomer({ ...customer, firstName: '' });
        await checkoutPage.continue();
        await expect(checkoutPage.error).toHaveText(
          'Error: First Name is required',
        );
        await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
        await expect(checkoutPage.firstName).toBeEmpty();
        await expect(checkoutPage.lastName).toHaveValue(customer.lastName);
        await expect(checkoutPage.postalCode).toHaveValue(customer.postalCode);
        await captureEvidence('ct04-nome-obrigatorio-nao-preenchido');
      });

      await test.step('Corrigir somente o nome e continuar com o produto preservado', async () => {
        await checkoutPage.firstName.fill(customer.firstName);
        await checkoutPage.continue();
        await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
        await expect(checkoutPage.title).toHaveText('Checkout: Overview');
        await expect(checkoutPage.items).toHaveCount(1);
        await expect(
          checkoutPage.items.getByTestId('inventory-item-name'),
        ).toHaveText(products.bikeLight.name);
        await expect(checkoutPage.error).toHaveCount(0);
        await captureEvidence('ct04-resumo-apos-correcao');
      });
    },
  );
});
