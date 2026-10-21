export type Credentials = Readonly<{ username: string; password: string }>;
export type Customer = Readonly<{
  firstName: string;
  lastName: string;
  postalCode: string;
}>;
export type Product = Readonly<{ name: string; priceInCents: number }>;

// Contas publicadas na própria aplicação demo. Segredos reais seriam injetados pelo CI.
export const validUser: Credentials = {
  username: process.env.E2E_USERNAME || 'standard_user',
  password: process.env.E2E_PASSWORD || 'secret_sauce',
};

export const invalidUser: Credentials = {
  username: validUser.username,
  password: 'invalid-password-for-negative-test',
};

// Dados sintéticos: nenhum cliente real ou geração aleatória desnecessária.
export const customer: Customer = {
  firstName: 'Pessoa',
  lastName: 'Teste QA',
  postalCode: '06000-000',
};

export const products = {
  backpack: { name: 'Sauce Labs Backpack', priceInCents: 2999 },
  bikeLight: { name: 'Sauce Labs Bike Light', priceInCents: 999 },
} as const satisfies Record<string, Product>;
