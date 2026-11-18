const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGame } = require('../engine.js');
const R = 'rouge', B = 'bleu', V = 'vert', J = 'jaune', O = 'orange', Vi = 'violet';
const cases = [
  [[R,B,V,J], [R,V,B,O], 1,2], [[R,B,V,J], [O,Vi,R,B], 0,2],
  [[R,B,V,J], [B,R,J,V], 0,4], [[R,B,V,J], [R,B,J,V], 2,2],
  [[R,B,V,J], [R,B,V,J], 4,0], [[R,R,B,V], [R,R,R,R], 2,0],
  [[R,R,B,V], [R,B,R,V], 2,2], [[R,R,B,V], [R,R,B,V], 4,0],
  [[R,R,B,V], [R,B,R,R], 1,2],
];
cases.forEach(([secret, guess, wellPlaced, misplaced], i) => {
  test(`T${String(i + 1).padStart(2, '0')} : indices du contrat`, () => {
    const game = createGame();
    game.start(secret);
    const s = game.submit(guess);
    assert.deepEqual(s.lastResult, { wellPlaced, misplaced });
    assert.equal(s.attempts, 1);
    assert.deepEqual(s.history, [{ guess, result: { wellPlaced, misplaced } }]);
    assert.equal(s.status, wellPlaced === 4 ? 'won' : 'playing');
    assert.equal(s.lastError, null);
    assert.equal('secret' in s || 'solution' in s, false);
  });
});

test('refus, priorité des types et historique inchangé', () => {
  const game = createGame();
  game.start([R,R,B,V]);
  game.submit([B,B,B,B]);
  const before = game.snapshot();
  const invalid = [[R,R,R], [R,null], Array(4), [R,R,R,'Violet']];
  const codes = ['invalid-length', 'invalid-type', 'invalid-type', 'invalid-color'];
  invalid.forEach((guess, i) => {
    const after = game.submit(guess);
    assert.equal(after.lastError.code, codes[i]);
    assert.deepEqual({ ...after, lastError: null }, before);
  });
  assert.equal(game.submit([B,B,B,B]).lastError, null);
});

test('victoire au dixième essai après un refus au neuvième', () => {
  const game = createGame();
  game.start([R,R,R,R]);
  for (let i = 0; i < 9; i++) game.submit([B,B,B,B]);
  assert.equal(game.submit([R]).attempts, 9);
  const won = game.submit([R,R,R,R]);
  assert.equal(won.status, 'won');
  assert.equal(won.attempts, 10);
  assert.equal(won.history.length, 10);
  const after = game.submit(null);
  assert.equal(after.lastError.code, 'game-finished');
  assert.deepEqual({ ...after, lastError: null }, won);
});

test('défaite à dix, blocage et redémarrage', () => {
  const game = createGame(() => 0);
  game.start();
  for (let i = 0; i < 10; i++) game.submit([B,B,B,B]);
  const lost = game.snapshot();
  assert.equal(lost.status, 'lost');
  assert.deepEqual(lost.lastResult, { wellPlaced: 0, misplaced: 0 });
  assert.equal(game.submit([R,R,R,R]).lastError.code, 'game-finished');
  const fresh = game.start();
  assert.deepEqual(fresh, { status: 'playing', attempts: 0, history: [], lastGuess: null, lastResult: null, lastError: null });
  assert.equal(game.submit([R,R,R,R]).status, 'won');
  assert.equal(game.start().status, 'playing');
});

test('secret, propositions et résultats indépendants des tableaux externes', () => {
  const game = createGame();
  const secret = [R,R,B,V];
  game.start(secret);
  secret.fill(J);
  const guess = [R,B,R,V];
  const result = game.submit(guess);
  guess.fill(J);
  result.history[0].guess.fill(J);
  result.lastResult.wellPlaced = 100;
  assert.deepEqual(game.snapshot().lastResult, { wellPlaced: 2, misplaced: 2 });
  assert.deepEqual(game.snapshot().lastGuess, [R,B,R,V]);
});

test('nouveau tirage à chaque départ, secret fixe entre deux propositions', () => {
  const values = [0.01, 0.01, 0.18, 0.35, 0.51, 0.68, 0.85, 0.01];
  let calls = 0;
  const game = createGame(() => values[calls++]);
  game.start();
  assert.equal(calls, 4);
  game.submit([R,R,R,R]);
  assert.equal(calls, 4);
  assert.equal(game.submit([R,R,B,V]).status, 'won');
  game.start();
  assert.equal(calls, 8);
  assert.equal(game.submit([J,O,Vi,R]).status, 'won');
});
