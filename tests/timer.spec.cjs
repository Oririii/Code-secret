const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-18T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-18T12:00:01Z'));
  await page.addInitScript(() => { Math.random = () => 0; }); // Secret : quatre rouges.
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
});

async function submit(page, color) {
  for (let i = 1; i <= 4; i++) await page.getByLabel(`Position ${i}`).selectOption(color);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
}

test('seuil exact, clignotement rouge et jeu toujours disponible après cinq minutes', async ({ page }) => {
  await expect(page.getByRole('timer')).toHaveText('00:00');
  await page.clock.fastForward(299000);
  await expect(page.getByRole('timer')).toHaveText('04:59');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-urgent/);
  await page.clock.fastForward(1000);
  await expect(page.getByRole('timer')).toHaveText('05:00');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-urgent/);
  await page.clock.fastForward(1000);
  await expect(page.getByRole('timer')).toHaveText('05:01');
  await expect(page.locator('#timer-panel')).toHaveClass(/is-urgent/);
  await expect(page.getByRole('timer')).toHaveCSS('color', 'rgb(165, 31, 45)');
  await expect(page.getByRole('timer')).toHaveCSS('animation-name', 'timer-urgency');
  await expect(page.locator('#timer-notice')).toContainText('Vous pouvez toujours continuer');
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await submit(page, 'bleu');
  await expect(page.locator('#attempts')).toHaveText('1 / 10');
  await page.screenshot({ path: '../work/code-secret-timer-desktop.png', fullPage: true });
});

test('nouvelle partie remet à zéro le temps et retire l’urgence', async ({ page }) => {
  await page.clock.fastForward(301000);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await expect(page.getByRole('timer')).toHaveText('00:00');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-urgent/);
  await expect(page.locator('#timer-notice')).toBeEmpty();
  await page.clock.fastForward(1000);
  await expect(page.getByRole('timer')).toHaveText('00:01');
});

test('victoire fige le temps et arrête le clignotement', async ({ page }) => {
  await page.clock.fastForward(301000);
  await submit(page, 'rouge');
  await expect(page.locator('#feedback')).toContainText('Bravo');
  const stopped = await page.getByRole('timer').textContent();
  await page.clock.fastForward(60000);
  await expect(page.getByRole('timer')).toHaveText(stopped);
  await expect(page.getByRole('timer')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-running/);
});

test('défaite fige le temps puis une nouvelle partie le relance', async ({ page }) => {
  await page.clock.fastForward(12000);
  for (let i = 0; i < 10; i++) await submit(page, 'bleu');
  await expect(page.locator('#feedback')).toContainText('épuisés');
  const stopped = await page.getByRole('timer').textContent();
  await page.clock.fastForward(301000);
  await expect(page.getByRole('timer')).toHaveText(stopped);
  await expect(page.locator('#timer-panel')).not.toHaveClass(/is-urgent/);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await page.clock.fastForward(1000);
  await expect(page.getByRole('timer')).toHaveText('00:01');
});

test('réduction des animations : rouge fixe, message et mobile sans débordement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.fastForward(301000);
  await expect(page.getByRole('timer')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('timer')).toHaveCSS('color', 'rgb(165, 31, 45)');
  await expect(page.getByRole('timer')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '../work/code-secret-timer-mobile.png', fullPage: true });
});
