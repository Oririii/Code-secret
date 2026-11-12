"use strict";

// Première étape : sélection et validation. Aucun moteur de score ni API simulée.
const colors = ["rouge", "bleu", "vert", "jaune", "orange", "violet"];
const selects = Array.from(document.querySelectorAll("select"));
const error = document.getElementById("error");
const feedback = document.getElementById("feedback");
const history = document.getElementById("history");
const validate = document.getElementById("validate");
let guesses = [];

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
  document.getElementById("attempts").textContent = `${guesses.length} / 10`;
  document.getElementById("empty-history").hidden = guesses.length !== 0;
  history.replaceChildren();
  guesses.forEach((guess, index) => {
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
    history.append(row);
  });
  validate.disabled = guesses.length === 10;
}

document.getElementById("guess-form").addEventListener("submit", event => {
  event.preventDefault();
  if (guesses.length >= 10) return;
  const guess = selects.map(select => select.value);
  feedback.textContent = "";
  if (guess.some(color => !color)) {
    error.textContent = "Choisissez les quatre couleurs avant de valider. Aucun essai n’a été consommé.";
    selects.find(select => !select.value).focus();
    return;
  }
  if (guess.some(color => !colors.includes(color))) {
    error.textContent = "Une couleur n’est pas autorisée. Aucun essai n’a été consommé.";
    return;
  }
  guesses.push(guess);
  error.textContent = "";
  feedback.textContent = guesses.length === 10
    ? "Dix propositions enregistrées. Vous pouvez recommencer."
    : "Proposition enregistrée.";
  renderHistory();
});

document.getElementById("restart").addEventListener("click", () => {
  guesses = [];
  selects.forEach(select => { select.value = ""; });
  error.textContent = "";
  feedback.textContent = "";
  renderSelection();
  renderHistory();
  selects[0].focus();
});

renderSelection();
renderHistory();
