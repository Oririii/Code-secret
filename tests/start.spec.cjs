const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-18T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-18T12:00:01Z'));
  await page.addInitScript(() => {
    window.randomCalls = 0;
    Math.random = () => { window.randomCalls++; return 0; };
  });
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
});

test('le chargement attend le clic sans code ni chronomètre', async ({ page }) => {
  expect(await page.evaluate(() => window.randomCalls)).toBe(0);
  await expect(page.locator('#validate')).toBeDisabled();
  for (let i = 1; i <= 4; i++) await expect(page.getByLabel(`Position ${i}`)).toBeDisabled();
  await expect(page.locator('#feedback')).toContainText('Nouvelle partie');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-running/);
  await page.clock.fastForward(360000);
  await page.locator('#guess-form').dispatchEvent('submit');
  await expect(page.getByRole('timer')).toHaveText('00:00');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-urgent/);
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await expect(page.locator('#history li')).toHaveCount(0);
  expect(await page.evaluate(() => window.randomCalls)).toBe(0);
  await page.screenshot({ path: '../work/code-secret-attente.png', fullPage: true });
});

test('un clic tire quatre couleurs et démarre le temps, puis le redémarrage retire un code', async ({ page }) => {
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  expect(await page.evaluate(() => window.randomCalls)).toBe(4);
  await expect(page.locator('#validate')).toBeEnabled();
  await expect(page.getByLabel('Position 1')).toBeFocused();
  await page.clock.fastForward(2000);
  await expect(page.getByRole('timer')).toHaveText('00:02');
  expect(await page.evaluate(() => window.randomCalls)).toBe(4);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  expect(await page.evaluate(() => window.randomCalls)).toBe(8);
  await expect(page.getByRole('timer')).toHaveText('00:00');
  await page.reload();
  expect(await page.evaluate(() => window.randomCalls)).toBe(0);
  await expect(page.locator('#validate')).toBeDisabled();
});
