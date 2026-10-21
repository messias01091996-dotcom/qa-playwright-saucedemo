import type { Page } from '@playwright/test';
import type { Customer } from '../data/test-data';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }
  get firstName() {
    return this.page.getByTestId('firstName');
  }
  get lastName() {
    return this.page.getByTestId('lastName');
  }
  get postalCode() {
    return this.page.getByTestId('postalCode');
  }
  get error() {
    return this.page.getByTestId('error');
  }
  get items() {
    return this.page.getByTestId('inventory-item');
  }
  get subtotal() {
    return this.page.getByTestId('subtotal-label');
  }
  get tax() {
    return this.page.getByTestId('tax-label');
  }
  get total() {
    return this.page.getByTestId('total-label');
  }
  get confirmation() {
    return this.page.getByRole('heading', {
      name: 'Thank you for your order!',
      exact: true,
    });
  }

  async fillCustomer(customer: Customer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continue() {
    await this.page
      .getByRole('button', { name: 'Continue', exact: true })
      .click();
  }

  async finish() {
    await this.page
      .getByRole('button', { name: 'Finish', exact: true })
      .click();
  }

  async backToProducts() {
    await this.page
      .getByRole('button', { name: 'Back Home', exact: true })
      .click();
  }
}
