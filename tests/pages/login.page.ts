import type { Page } from '@playwright/test';
import type { Credentials } from '../data/test-data';

export class LoginPage {
  constructor(readonly page: Page) {}

  get username() {
    return this.page.getByTestId('username');
  }
  get password() {
    return this.page.getByTestId('password');
  }
  get submitButton() {
    return this.page.getByRole('button', { name: 'Login', exact: true });
  }
  get error() {
    return this.page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async login(credentials: Credentials) {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await this.submitButton.click();
  }
}
