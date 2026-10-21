import type { Page } from '@playwright/test';

export class CartPage {
  constructor(readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }
  get items() {
    return this.page.getByTestId('cart-list').getByTestId('inventory-item');
  }
  product(name: string) {
    const productName = this.page
      .getByTestId('inventory-item-name')
      .and(this.page.getByText(name, { exact: true }));

    return this.items.filter({
      has: productName,
    });
  }

  async removeProduct(name: string) {
    await this.product(name)
      .getByRole('button', { name: 'Remove', exact: true })
      .click();
  }

  async continueShopping() {
    await this.page
      .getByRole('button', { name: 'Continue Shopping', exact: true })
      .click();
  }

  async checkout() {
    await this.page
      .getByRole('button', { name: 'Checkout', exact: true })
      .click();
  }
}
