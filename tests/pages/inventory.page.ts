import type { Page } from '@playwright/test';

export class InventoryPage {
  constructor(readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }
  get items() {
    return this.page.getByTestId('inventory-list').getByTestId('inventory-item');
  }
  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }

  product(name: string) {
    const productName = this.page
      .getByTestId('inventory-item-name')
      .and(this.page.getByText(name, { exact: true }));

    return this.items.filter({
      has: productName,
    });
  }

  async addProduct(name: string) {
    await this.product(name)
      .getByRole('button', { name: 'Add to cart', exact: true })
      .click();
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}
