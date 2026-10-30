// tests/rules.spec.js
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// Local-time YYYY-MM-DD, offset by a number of days from today
function dateFromToday(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function checkPrice(page, { checkin, checkout, guests, room }) {
  await page.getByLabel('Check-in').fill(checkin);
  await page.getByLabel('Check-out').fill(checkout);
  await page.getByLabel('Guests').fill(guests);
  await page.getByLabel('Room').selectOption(room);
  await page.getByRole('button', { name: 'Check price' }).click();
}

// Bug report 1: Booking form shows a price when Guests is 0
// Issue #1 (see specs/LS-101.md). Already fixed by LS-101, so no test.fail() here.
test('R1: the form rejects 0 guests and shows no total', async ({ page }) => {
  await checkPrice(page, {
    checkin: '2026-12-10',
    checkout: '2026-12-14',
    guests: '0',
    room: 'deluxe',
  });
  await expect(page.getByRole('alert')).toHaveText('Guests must be between 1 and 6.');
  await expect(page.getByText(/Total/)).toHaveCount(0);
});

// Bug report 2: Booking form prices a stay with a check-in date before today
// LS-103, Issue #4: https://github.com/nhungnguyen-agilityio/dojo-baqa-nhungnguyen/issues/4
test('R2: the form rejects a check-in date of yesterday and shows no total', async ({ page }) => {
  test.fail();
  await checkPrice(page, {
    checkin: dateFromToday(-1),
    checkout: dateFromToday(2),
    guests: '2',
    room: 'standard',
  });
  await expect(page.getByRole('alert')).not.toHaveText('');
  await expect(page.getByText(/Total/)).toHaveCount(0);
});
