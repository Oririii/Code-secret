const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
});

async function choose(page, colors) {
  for (let i = 0; i < colors.length; i++) await page.getByLabel(`Position ${i + 1}`).selectOption(colors[i]);
}

test('trois couleurs sont refusées sans compteur ni historique modifiés', async ({ page }) => {
  await choose(page, ['rouge', 'bleu', 'vert']);
  await expect(page.locator('#selection-count')).toHaveText('3 / 4 couleurs');
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.getByRole('alert')).toContainText('Choisissez les quatre couleurs');
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await expect(page.locator('#history li')).toHaveCount(0);
  await expect(page.getByLabel('Position 4')).toBeFocused();
  await page.getByLabel('Position 4').selectOption('jaune');
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.getByRole('alert')).toBeEmpty();
  await expect(page.locator('#attempts')).toHaveText('1 / 10');
  await expect(page.locator('#history li')).toHaveCount(1);
});

test('quatre couleurs et répétitions acceptées, puis refus sans altérer un historique existant', async ({ page }) => {
  await choose(page, ['rouge', 'rouge', 'bleu', 'vert']);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('#history li')).toHaveText('Essai 1rougerougebleuvert');
  await page.getByLabel('Position 2').selectOption('');
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('#attempts')).toHaveText('1 / 10');
  await expect(page.locator('#history li')).toHaveText('Essai 1rougerougebleuvert');
  await page.getByRole('button', { name: 'Recommencer' }).click();
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await expect(page.locator('#history li')).toHaveCount(0);
  await expect(page.locator('#selection-count')).toHaveText('0 / 4 couleurs');
});

test('sélection et validation accessibles au clavier', async ({ page }) => {
  await page.keyboard.press('Tab');
  for (let i = 1; i <= 4; i++) {
    await expect(page.getByLabel(`Position ${i}`)).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
  }
  await expect(page.getByRole('button', { name: 'Valider la proposition' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#attempts')).toHaveText('1 / 10');
});

test('affichage étroit sans débordement horizontal et capture de contrôle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await choose(page, ['rouge', 'bleu', 'vert']);
  await expect(page.getByRole('button', { name: 'Valider la proposition' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '../work/code-secret-mobile.png', fullPage: true });
});
