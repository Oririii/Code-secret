const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test.beforeEach(async ({ page }) => {
  // Fixer le générateur du navigateur de test : le vrai moteur tire rouge, rouge, bleu, vert.
  await page.addInitScript(() => {
    const values = [0.01, 0.01, 0.18, 0.35];
    let i = 0;
    Math.random = () => values[(i++) % values.length];
  });
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
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
  await expect(page.locator('#history .color-chip')).toHaveText(['rouge', 'rouge', 'bleu', 'vert']);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await choose(page, ['rouge', 'bleu', 'rouge', 'vert']);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await page.getByLabel('Position 2').selectOption('');
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('#attempts')).toHaveText('1 / 10');
  await expect(page.locator('#history .color-chip')).toHaveText(['rouge', 'bleu', 'rouge', 'vert']);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await expect(page.locator('#history li')).toHaveCount(0);
  await expect(page.locator('#selection-count')).toHaveText('0 / 4 couleurs');
});

test('sélection et validation accessibles au clavier', async ({ page }) => {
  // « Nouvelle partie » place le focus sur le premier sélecteur.
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
  await page.getByLabel('Position 4').selectOption('rouge');
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.getByRole('button', { name: 'Valider la proposition' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '../work/code-secret-etape-2-mobile.png', fullPage: true });
});

test('les indices du vrai moteur apparaissent et le secret reste caché', async ({ page }) => {
  await choose(page, ['rouge', 'rouge', 'rouge', 'rouge']);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('.indices')).toHaveText('2 bien placées · 0 mal placées');
  await choose(page, ['rouge', 'bleu', 'rouge', 'rouge']);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('.indices').nth(1)).toHaveText('1 bien placée · 2 mal placées');
  expect(await page.evaluate(() => typeof window.codeSecretTest)).toBe('undefined');
  await page.screenshot({ path: '../work/code-secret-etape-2-desktop.png', fullPage: true });
});

test('victoire à dix, commandes bloquées puis nouvelle partie', async ({ page }) => {
  await choose(page, ['jaune', 'jaune', 'jaune', 'jaune']);
  for (let i = 0; i < 9; i++) await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await choose(page, ['rouge', 'rouge', 'bleu', 'vert']);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('#feedback')).toHaveText('Bravo, vous avez trouvé le code secret !');
  await expect(page.locator('#attempts')).toHaveText('10 / 10');
  await expect(page.locator('#validate')).toBeDisabled();
  await expect(page.getByLabel('Position 1')).toBeDisabled();
  await page.locator('#guess-form').dispatchEvent('submit');
  await expect(page.locator('#history li')).toHaveCount(10);
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await expect(page.locator('#history li')).toHaveCount(0);
  await expect(page.locator('#validate')).toBeEnabled();
  await expect(page.locator('#selection-count')).toHaveText('0 / 4 couleurs');
});

test('défaite après dix essais, indices consultables et remise à zéro', async ({ page }) => {
  await choose(page, ['jaune', 'jaune', 'jaune', 'jaune']);
  for (let i = 0; i < 10; i++) await page.getByRole('button', { name: 'Valider la proposition' }).click();
  await expect(page.locator('#feedback')).toContainText('dix essais sont épuisés');
  await expect(page.locator('#history li')).toHaveCount(10);
  await expect(page.locator('.indices')).toHaveText(Array(10).fill('0 bien placées · 0 mal placées'));
  await expect(page.locator('#validate')).toBeDisabled();
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await expect(page.locator('#attempts')).toHaveText('0 / 10');
  await expect(page.locator('#error')).toBeEmpty();
});
