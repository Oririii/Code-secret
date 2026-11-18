(function (root) {
  "use strict";
  const COLORS = Object.freeze(["rouge", "bleu", "vert", "jaune", "orange", "violet"]);
  const copy = value => JSON.parse(JSON.stringify(value));

  function validateCode(code) {
    if (!Array.isArray(code)) return { code: "invalid-type", message: "La proposition doit être un tableau de couleurs." };
    for (let i = 0; i < code.length; i++) {
      if (!Object.hasOwn(code, i) || typeof code[i] !== "string") {
        return { code: "invalid-type", message: "Chaque position doit contenir un nom de couleur." };
      }
    }
    if (code.length !== 4) return { code: "invalid-length", message: "Choisissez les quatre couleurs avant de valider. Aucun essai n’a été consommé." };
    if (code.some(color => !COLORS.includes(color))) return { code: "invalid-color", message: "Une couleur n’est pas autorisée. Aucun essai n’a été consommé." };
    return null;
  }

  function score(secret, guess) {
    let wellPlaced = 0;
    const remaining = {};
    const unmatched = [];
    secret.forEach((color, i) => {
      if (color === guess[i]) wellPlaced++;
      else {
        remaining[color] = (remaining[color] || 0) + 1;
        unmatched.push(guess[i]);
      }
    });
    let misplaced = 0;
    unmatched.forEach(color => {
      if (remaining[color] > 0) {
        remaining[color]--;
        misplaced++;
      }
    });
    return { wellPlaced, misplaced };
  }

  function createGame(random = Math.random) {
    let secret;
    let state = { status: "not-started", attempts: 0, history: [], lastGuess: null, lastResult: null, lastError: null };
    return {
      snapshot() { return copy(state); },
      // Un secret imposé sert aux tests du moteur ; il n’est jamais exposé dans l’état.
      start(fixedSecret) {
        const next = fixedSecret === undefined
          ? Array.from({ length: 4 }, () => COLORS[Math.floor(random() * COLORS.length)])
          : fixedSecret;
        const issue = validateCode(next);
        if (issue) throw Object.assign(new Error(issue.message), { code: issue.code });
        secret = next.slice();
        state = { status: "playing", attempts: 0, history: [], lastGuess: null, lastResult: null, lastError: null };
        return copy(state);
      },
      submit(guess) {
        const issue = state.status === "not-started"
          ? { code: "game-not-started", message: "Commencez une nouvelle partie." }
          : state.status !== "playing"
            ? { code: "game-finished", message: "La partie est terminée. Lancez une nouvelle partie." }
            : validateCode(guess);
        if (issue) {
          state.lastError = issue;
          return copy(state);
        }
        const result = score(secret, guess);
        state.history.push({ guess: guess.slice(), result });
        state.attempts = state.history.length;
        state.lastGuess = guess.slice();
        state.lastResult = result;
        state.lastError = null;
        state.status = result.wellPlaced === 4 ? "won" : state.attempts === 10 ? "lost" : "playing";
        return copy(state);
      },
    };
  }

  const engine = Object.freeze({ colors: COLORS, createGame });
  if (typeof module !== "undefined" && module.exports) module.exports = engine;
  else root.CodeSecretGame = engine;
})(typeof globalThis !== "undefined" ? globalThis : this);
