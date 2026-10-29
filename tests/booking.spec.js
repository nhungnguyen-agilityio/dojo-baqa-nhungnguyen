// tests/booking.spec.js
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function fillBooking(page, { checkin, checkout, guests, room }) {
  await page.getByLabel('Check-in').fill(checkin);
  await page.getByLabel('Check-out').fill(checkout);
  await page.getByLabel('Guests').fill(guests);
  await page.getByLabel('Room').selectOption(room);
  await page.getByRole('button', { name: 'Check price' }).click();
}

test('R4: 2 nights in Standard costs 1,200,000 VND', async ({ page }) => {
  await fillBooking(page, { checkin: '2026-12-01', checkout: '2026-12-03', guests: '2', room: 'standard' });
  await expect(page.locator('#result')).toHaveText('2 night(s) · Total 1,200,000 VND');
});

test('R3: check-out before check-in shows an error', async ({ page }) => {
  await fillBooking(page, { checkin: '2026-12-05', checkout: '2026-12-03', guests: '2', room: 'standard' });
  await expect(page.getByRole('alert')).toHaveText('Check-out must be after check-in.');
  await expect(page.locator('#result')).toHaveText('');
});

test('R1 / LS-101: 0 guests is rejected', async ({ page }) => {
  await fillBooking(page, { checkin: '2026-12-01', checkout: '2026-12-03', guests: '0', room: 'standard' });
  await expect(page.getByRole('alert')).toHaveText('Guests must be between 1 and 6.');
  await expect(page.locator('#result')).toHaveText('');
});