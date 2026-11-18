(() => {
"use strict";

const colors = CodeSecretGame.colors;
const game = CodeSecretGame.createGame();
const selects = Array.from(document.querySelectorAll("select"));
const error = document.getElementById("error");
const feedback = document.getElementById("feedback");
const history = document.getElementById("history");
const validate = document.getElementById("validate");
const timer = document.getElementById("timer");
const timerPanel = document.getElementById("timer-panel");
const timerNotice = document.getElementById("timer-notice");
let timerStartedAt = null;
let timerStoppedElapsed = 0;
let timerInterval = null;

function renderTimer() {
  // Mesurer le temps réel écoulé plutôt que compter les déclenchements de l’intervalle.
  const elapsed = timerStartedAt === null ? timerStoppedElapsed : Math.max(0, Date.now() - timerStartedAt);
  const seconds = Math.floor(elapsed / 1000);
  timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const urgent = elapsed > 5 * 60 * 1000;
  timerPanel.classList.toggle("is-urgent", urgent);
  timerPanel.classList.toggle("is-running", timerStartedAt !== null);
  const notice = urgent ? "Plus de cinq minutes écoulées. Vous pouvez toujours continuer à jouer." : "";
  // Une annonce au changement de seuil ; ne pas interrompre la lecture à chaque seconde.
  if (timerNotice.textContent !== notice) timerNotice.textContent = notice;
}

function startTimer() {
  clearInterval(timerInterval);
  timerStartedAt = Date.now();
  timerStoppedElapsed = 0;
  renderTimer();
  timerInterval = setInterval(renderTimer, 250);
}

function stopTimer() {
  if (timerStartedAt === null) return;
  timerStoppedElapsed = Math.max(0, Date.now() - timerStartedAt);
  timerStartedAt = null;
  clearInterval(timerInterval);
  timerInterval = null;
  renderTimer();
}

document.addEventListener("visibilitychange", renderTimer);

selects.forEach(select => {
  colors.forEach(color => select.add(new Option(color[0].toUpperCase() + color.slice(1), color)));
  select.addEventListener("change", renderSelection);
});

function renderSelection() {
  const count = selects.filter(select => select.value !== "").length;
  document.getElementById("selection-count").textContent = `${count} / 4 couleurs`;
  selects.forEach(select => { select.previousElementSibling.dataset.color = select.value; });
}

function renderHistory() {
  const state = game.snapshot();
  document.getElementById("attempts").textContent = `${state.attempts} / 10`;
  document.getElementById("empty-history").hidden = state.attempts !== 0;
  history.replaceChildren();
  state.history.forEach(({ guess, result }, index) => {
    const row = document.createElement("li");
    const number = document.createElement("span");
    number.className = "attempt-number";
    number.textContent = `Essai ${index + 1}`;
    row.append(number);
    guess.forEach(color => {
      const chip = document.createElement("span");
      chip.className = "color-chip";
      const dot = document.createElement("i");
      dot.dataset.color = color;
      dot.setAttribute("aria-hidden", "true");
      chip.append(dot, document.createTextNode(color));
      row.append(chip);
    });
    const indices = document.createElement("span");
    indices.className = "indices";
    indices.textContent = `${result.wellPlaced} bien placée${result.wellPlaced === 1 ? "" : "s"} · ${result.misplaced} mal placée${result.misplaced === 1 ? "" : "s"}`;
    row.append(indices);
    history.append(row);
  });
  const finished = state.status === "won" || state.status === "lost";
  if (finished) stopTimer();
  validate.disabled = finished;
  selects.forEach(select => { select.disabled = finished; });
  error.textContent = state.lastError?.message || "";
  feedback.textContent = state.status === "won" ? "Bravo, vous avez trouvé le code secret !"
    : state.status === "lost" ? "Les dix essais sont épuisés. Lancez une nouvelle partie pour réessayer."
    : state.attempts ? "Proposition enregistrée. Utilisez les indices pour votre prochain essai."
    : "À vous de jouer : le code secret est prêt.";
}

document.getElementById("guess-form").addEventListener("submit", event => {
  event.preventDefault();
  if (game.snapshot().status !== "playing") return;
  const guess = selects.map(select => select.value);
  if (guess.some(color => !color)) {
    // Les positions vides ne sont pas des couleurs ; transmettre une proposition incomplète au moteur.
    game.submit(guess.filter(Boolean));
    renderHistory();
    error.textContent = "Choisissez les quatre couleurs avant de valider. Aucun essai n’a été consommé.";
    selects.find(select => !select.value).focus();
    return;
  }
  game.submit(guess);
  renderHistory();
});

document.getElementById("restart").addEventListener("click", () => {
  game.start();
  startTimer();
  selects.forEach(select => { select.value = ""; });
  error.textContent = "";
  feedback.textContent = "";
  renderSelection();
  renderHistory();
  selects[0].focus();
});

game.start();
startTimer();
renderSelection();
renderHistory();
})();
