import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

// Node 24 carrega .env sem adicionar uma dependência ao projeto.
const envPath = resolve(__dirname, '.env');
if (existsSync(envPath)) loadEnvFile(envPath);

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  failOnFlakyTests: isCI,
  workers: isCI ? 1 : 2,
  timeout: 30_000,
  globalTimeout: 5 * 60_000,
  expect: { timeout: 7_000 },
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    // Falhas são capturadas pelo runner; checkpoints aprovados usam captureEvidence.
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
