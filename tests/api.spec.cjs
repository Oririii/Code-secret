const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const BASE = process.env.CODE_SECRET_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const colors = ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet'];
const [R, B, V, J, O, Vi] = colors;
const empty = { status: 'not-started', attempts: 0, history: [], lastGuess: null, lastResult: null, lastError: null };

test.beforeEach(async ({ page }) => {
  const url = new URL(BASE);
  url.searchParams.set('autre', 'conserve');
  url.searchParams.set('test', '1');
  await page.goto(url.href);
  await page.waitForFunction(() => window.codeSecretTest !== undefined);
});

test('configuration exacte, état initial et API absente hors mode test', async ({ page }) => {
  const value = await page.evaluate(() => ({
    version: codeSecretTest.version, config: codeSecretTest.getConfig(), state: codeSecretTest.getState(),
    sync: !(codeSecretTest.getConfig() instanceof Promise) && !(codeSecretTest.getState() instanceof Promise),
  }));
  expect(value).toEqual({ version: '0.2', sync: true, state: empty, config: {
    apiVersion: '0.2', rulesVersion: 'code-couleurs-1.0', secretLength: 4, maxAttempts: 10, allowDuplicates: true, colors,
  } });
  await expect(page.locator('#validate')).toBeDisabled();
  await expect(page.getByRole('timer')).toHaveText('00:00');
  for (const query of ['', '?test=0', '?test=true']) {
    const url = new URL(BASE); url.search = query;
    await page.goto(url.href);
    expect(await page.evaluate(() => 'codeSecretTest' in window)).toBe(false);
  }
});

const examples = [
  [[R,B,V,J],[R,V,B,O],1,2], [[R,B,V,J],[O,Vi,R,B],0,2],
  [[R,B,V,J],[B,R,J,V],0,4], [[R,B,V,J],[R,B,J,V],2,2],
  [[R,B,V,J],[R,B,V,J],4,0], [[R,R,B,V],[R,R,R,R],2,0],
  [[R,R,B,V],[R,B,R,V],2,2], [[R,R,B,V],[R,R,B,V],4,0],
  [[R,R,B,V],[R,B,R,R],1,2],
];
for (const [i, [secret, guess, wellPlaced, misplaced]] of examples.entries()) {
  test(`T${String(i + 1).padStart(2, '0')} API et indices visibles`, async ({ page }) => {
    const s = await page.evaluate(async ({ secret, guess }) => {
      await codeSecretTest.startGame({ secret });
      const pending = codeSecretTest.submitGuess(guess);
      if (!(pending instanceof Promise)) throw new Error('Promise attendue');
      return await pending;
    }, { secret, guess });
    expect(s).toEqual({ status: wellPlaced === 4 ? 'won' : 'playing', attempts: 1,
      history: [{ guess, result: { wellPlaced, misplaced } }], lastGuess: guess,
      lastResult: { wellPlaced, misplaced }, lastError: null });
    await expect(page.locator('#attempts')).toHaveText('1 / 10');
    await expect(page.locator('#history .color-chip')).toHaveText(guess);
    await expect(page.locator('.indices')).toHaveText(`${wellPlaced} bien placée${wellPlaced === 1 ? '' : 's'} · ${misplaced} mal placée${misplaced === 1 ? '' : 's'}`);
    if (s.status === 'won') await expect(page.locator('#feedback')).toContainText('Bravo');
    expect(s).not.toHaveProperty('secret'); expect(s).not.toHaveProperty('solution');
  });
}

test('refus avant départ, types, tableaux creux, longueur, couleurs et getters sans effets', async ({ page }) => {
  const results = await page.evaluate(async () => {
    const api = codeSecretTest;
    const first = await api.submitGuess(null);
    await api.startGame({ secret: ['rouge','rouge','bleu','vert'] });
    await api.submitGuess(['bleu','bleu','bleu','bleu']);
    const before = api.getState();
    const invalid = [null, 'rouge', ['rouge',null], new Array(4), ['rouge'],
      ['rouge','rouge','rouge','rouge','rouge'], ['rouge','rouge','rouge','Violet'],
      ['rouge','rouge','rouge','violet '], ['rouge','rouge','rouge','purple']];
    const refused = [];
    for (const guess of invalid) {
      const state = await api.submitGuess(guess);
      const html = document.querySelector('main').innerHTML;
      const read = api.getState(); api.getConfig();
      refused.push({ state, read, unchanged: html === document.querySelector('main').innerHTML });
    }
    const valid = await api.submitGuess(['violet','violet','violet','violet']);
    return { first, before, refused, valid };
  });
  expect(results.first).toEqual({ ...empty, lastError: { code: 'game-not-started', message: expect.any(String) } });
  const expected = ['invalid-type','invalid-type','invalid-type','invalid-type','invalid-length','invalid-length','invalid-color','invalid-color','invalid-color'];
  for (const [i, item] of results.refused.entries()) {
    expect(item.state.lastError.code).toBe(expected[i]);
    expect(item.state.lastError.message.length).toBeGreaterThan(0);
    expect({ ...item.state, lastError: null }).toEqual(results.before);
    expect(item.read).toEqual(item.state); expect(item.unchanged).toBe(true);
  }
  expect(results.valid.attempts).toBe(2); expect(results.valid.lastError).toBeNull();
});

test('startGame invalide rejette avec code sans modifier état, écran, sélection ou temps', async ({ page }) => {
  await page.evaluate(async () => {
    await codeSecretTest.startGame({ secret: ['rouge','rouge','bleu','vert'] });
    await codeSecretTest.submitGuess(['rouge']); // lastError à conserver aussi.
  });
  await page.getByLabel('Position 1').selectOption('orange');
  const results = await page.evaluate(async () => {
    const cases = [
      [null,'invalid-options'], [1,'invalid-options'], [[], 'invalid-options'],
      [new Date(),'invalid-options'], [{ extra: 1 },'invalid-options'],
      [{ secret: ['rouge'], extra: true },'invalid-options'],
      [{ secret: undefined },'invalid-type'], [{ secret: null },'invalid-type'],
      [{ secret: ['rouge',null] },'invalid-type'], [{ secret: new Array(4) },'invalid-type'],
      [{ secret: ['rouge'] },'invalid-length'], [{ secret: ['rouge','rouge','rouge','Violet'] },'invalid-color'],
    ];
    const output = [];
    for (const [options, expected] of cases) {
      const before = codeSecretTest.getState();
      const html = document.querySelector('main').innerHTML;
      const values = Array.from(document.querySelectorAll('select'), el => el.value);
      let rejection;
      try { const p = codeSecretTest.startGame(options); if (!(p instanceof Promise)) throw new Error('Promise attendue'); await p; }
      catch (e) { rejection = { code: e.code, message: e.message, error: e instanceof Error }; }
      output.push({ expected, rejection, before, after: codeSecretTest.getState(),
        sameHTML: html === document.querySelector('main').innerHTML,
        sameValues: JSON.stringify(values) === JSON.stringify(Array.from(document.querySelectorAll('select'), el => el.value)) });
    }
    return output;
  });
  for (const item of results) {
    expect(item.rejection).toEqual({ code: item.expected, message: expect.any(String), error: true });
    expect(item.rejection.message.length).toBeGreaterThan(0);
    expect(item.after).toEqual(item.before); expect(item.sameHTML).toBe(true); expect(item.sameValues).toBe(true);
  }
});

test('entrées, sorties et configuration restent indépendantes du moteur', async ({ page }) => {
  const s = await page.evaluate(async () => {
    const secret = ['rouge','rouge','bleu','vert'];
    const p = codeSecretTest.startGame({ secret }); secret.fill('jaune');
    const started = await p; started.history.push({});
    const guess = ['rouge','bleu','rouge','vert'];
    const sent = codeSecretTest.submitGuess(guess); guess.fill('jaune');
    const result = await sent; result.history[0].guess.fill('jaune'); result.lastResult.wellPlaced = 99;
    const state = codeSecretTest.getState(); state.lastGuess.fill('jaune'); state.history[0].result.misplaced = 99;
    codeSecretTest.getConfig().colors.fill('noir');
    return { state: codeSecretTest.getState(), config: codeSecretTest.getConfig() };
  });
  expect(s.state.lastResult).toEqual({ wellPlaced: 2, misplaced: 2 });
  expect(s.state.history[0].guess).toEqual([R,B,R,V]);
  expect(s.state.history[0].result).toEqual({ wellPlaced: 2, misplaced: 2 });
  expect(s.state.lastGuess).toEqual([R,B,R,V]); expect(s.config.colors).toEqual(colors);
});

for (const end of ['won','lost']) test(`${end} à dix, refus prioritaire et redémarrage`, async ({ page }) => {
  const result = await page.evaluate(async end => {
    const api = codeSecretTest;
    await api.startGame({ secret: Array(4).fill('rouge') });
    for (let i = 0; i < 9; i++) await api.submitGuess(Array(4).fill('bleu'));
    const refused = await api.submitGuess(['rouge']);
    const final = await api.submitGuess(Array(4).fill(end === 'won' ? 'rouge' : 'bleu'));
    const after = await api.submitGuess(null);
    return { refused, final, after };
  }, end);
  expect(result.refused.attempts).toBe(9); expect(result.refused.lastError.code).toBe('invalid-length');
  expect(result.final.status).toBe(end); expect(result.final.attempts).toBe(10); expect(result.final.history).toHaveLength(10);
  expect(result.after.lastError.code).toBe('game-finished'); expect({ ...result.after, lastError: null }).toEqual(result.final);
  await expect(page.locator('#history li')).toHaveCount(10); await expect(page.locator('#validate')).toBeDisabled();
  await expect(page.locator('#feedback')).toContainText(end === 'won' ? 'Bravo' : 'épuisés');
  const fresh = await page.evaluate(async () => await codeSecretTest.startGame({}));
  expect(fresh).toEqual({ ...empty, status: 'playing' });
  await expect(page.locator('#history li')).toHaveCount(0); await expect(page.locator('#validate')).toBeEnabled();
});

test('interface et API commandent la même partie et le même chronomètre', async ({ page }) => {
  await page.evaluate(async () => await codeSecretTest.startGame({ secret: ['rouge','rouge','bleu','vert'] }));
  await expect(page.locator('#timer-panel')).toHaveClass(/is-running/);
  for (const [i, color] of [R,B,R,V].entries()) await page.getByLabel(`Position ${i + 1}`).selectOption(color);
  await page.getByRole('button', { name: 'Valider la proposition' }).click();
  const s = await page.evaluate(() => codeSecretTest.getState());
  expect(s.lastGuess).toEqual([R,B,R,V]); expect(s.lastResult).toEqual({ wellPlaced: 2, misplaced: 2 }); expect(s.attempts).toBe(1);
  await expect(page.locator('.indices')).toHaveText('2 bien placées · 2 mal placées');
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  expect(await page.evaluate(() => codeSecretTest.getState())).toEqual({ ...empty, status: 'playing' });
  await expect(page.locator('#selection-count')).toHaveText('0 / 4 couleurs');
  await page.reload(); await page.waitForFunction(() => window.codeSecretTest);
  expect(await page.evaluate(() => codeSecretTest.getState())).toEqual(empty);
});

test('sans argument, undefined et objet vide démarrent chacun une partie aléatoire', async ({ page }) => {
  const states = await page.evaluate(async () => [await codeSecretTest.startGame(), await codeSecretTest.startGame(undefined), await codeSecretTest.startGame({})]);
  for (const s of states) expect(s).toEqual({ ...empty, status: 'playing' });
});
