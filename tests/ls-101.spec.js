// tests/ls-101.spec.js
const { test, expect } = require('@playwright/test');

const GUESTS_ERROR = 'Guests must be between 1 and 6.';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function checkPrice(page, guests) {
  await page.getByLabel('Check-in').fill('2026-12-01');
  await page.getByLabel('Check-out').fill('2026-12-03');
  await page.getByLabel('Room').selectOption('standard');
  await page.getByLabel('Guests').fill(guests);
  await page.getByRole('button', { name: 'Check price' }).click();
}

test('LS-101: 0 guests is rejected', async ({ page }) => {
  await checkPrice(page, '0');
  await expect(page.getByRole('alert')).toHaveText(GUESTS_ERROR);
  await expect(page.getByText(/Total/)).toHaveCount(0);
});

test('LS-101: 1 guest is accepted', async ({ page }) => {
  await checkPrice(page, '1');
  await expect(page.getByRole('alert')).toHaveText('');
  await expect(page.getByText('2 night(s) · Total 1,200,000 VND')).toBeVisible();
});

test('LS-101: 6 guests is accepted', async ({ page }) => {
  await checkPrice(page, '6');
  await expect(page.getByRole('alert')).toHaveText('');
  await expect(page.getByText('2 night(s) · Total 1,200,000 VND')).toBeVisible();
});

test('LS-101: 7 guests is rejected', async ({ page }) => {
  await checkPrice(page, '7');
  await expect(page.getByRole('alert')).toHaveText(GUESTS_ERROR);
  await expect(page.getByText(/Total/)).toHaveCount(0);
});
