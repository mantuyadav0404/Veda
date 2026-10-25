// Number Guessing Game - Level 1, Day 26 (Task 25)
// Concepts: randomization, conditionals, attempt tracking, input validation, state reset

const LEVELS = {
  easy:   { min: 1, max: 50 },
  medium: { min: 1, max: 100 },
  hard:   { min: 1, max: 500 }
};

// ---- DOM ----
const levelSelect = document.getElementById("difficulty");
const promptEl = document.getElementById("prompt");
const form = document.getElementById("guess-form");
const input = document.getElementById("guess");
const guessBtn = document.getElementById("guess-btn");
const feedback = document.getElementById("feedback");
const meterFill = document.getElementById("meter-fill");
const boundsEl = document.getElementById("bounds");
const attemptsEl = document.getElementById("attempts");
const bestEl = document.getElementById("best");
const historyEl = document.getElementById("history");
const playAgainBtn = document.getElementById("play-again");

// ---- Game state ----
let state = {};
const bestScores = {}; // best (lowest) attempts per level, kept in memory

// [snippet:start]
// Random integer from min to max, both included
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns an error message, or "" when the guess is valid
function validate(raw) {
  const text = raw.trim();
  if (text === "") return "Enter a number to guess.";
  const value = Number(text);
  if (!Number.isInteger(value)) return "Use a whole number, like 42.";
  if (value < state.min || value > state.max) {
    return "Pick a number between " + state.min + " and " + state.max + ".";
  }
  return "";
}
// [snippet:end]

function newGame() {
  const { min, max } = LEVELS[levelSelect.value];
  state = {
    min, max,
    target: randomInt(min, max),
    attempts: 0,
    low: min,       // smallest number still possible
    high: max,      // largest number still possible
    guesses: [],
    over: false
  };
  promptEl.textContent = "I\u2019m thinking of a number between " + min + " and " + max + ".";
  input.value = "";
  input.disabled = false;
  guessBtn.disabled = false;
  playAgainBtn.classList.remove("btn-win");
  setFeedback("Type a number and press Guess.", "");
  render();
  input.focus();
}

function setFeedback(message, kind) {
  feedback.textContent = message;
  feedback.className = "feedback" + (kind ? " " + kind : "");
}

function render() {
  attemptsEl.textContent = state.attempts;
  bestEl.textContent = bestScores[levelSelect.value] || "-";

  // History chips
  historyEl.innerHTML = "";
  if (state.guesses.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "None yet";
    historyEl.appendChild(li);
  }
  state.guesses.forEach(function (g) {
    const li = document.createElement("li");
    li.className = g.kind;
    li.textContent = g.value + (g.kind === "up" ? " \u2191" : g.kind === "down" ? " \u2193" : " \u2713");
    historyEl.appendChild(li);
  });

  // Remaining-range meter
  const span = state.max - state.min + 1;
  const left = ((state.low - state.min) / span) * 100;
  const width = ((state.high - state.low + 1) / span) * 100;
  meterFill.style.left = left + "%";
  meterFill.style.width = width + "%";
  boundsEl.textContent = state.over
    ? ""
    : "It is between " + state.low + " and " + state.high + ".";
}

function handleGuess(event) {
  event.preventDefault();
  if (state.over) return;

  const error = validate(input.value);
  if (error) {
    setFeedback(error, "error");   // invalid guesses are not counted as attempts
    return;
  }

  const value = Number(input.value);
  if (state.guesses.some(function (g) { return g.value === value; })) {
    setFeedback("You already tried " + value + ". Pick a different number.", "error");
    return;
  }

  state.attempts++;

  if (value === state.target) {
    state.over = true;
    state.guesses.push({ value: value, kind: "win" });
    const word = state.attempts === 1 ? "attempt" : "attempts";
    let msg = "Correct! " + value + " was the number. You needed " + state.attempts + " " + word + ".";
    const best = bestScores[levelSelect.value];
    if (!best || state.attempts < best) {
      bestScores[levelSelect.value] = state.attempts;
      msg += " New best for this level.";
    }
    setFeedback(msg, "win");
    input.disabled = true;
    guessBtn.disabled = true;
    playAgainBtn.classList.add("btn-win");
    playAgainBtn.focus();
  } else if (value < state.target) {
    state.low = Math.max(state.low, value + 1);
    state.guesses.push({ value: value, kind: "up" });
    setFeedback(value + " is too low. Go higher.", "up");
  } else {
    state.high = Math.min(state.high, value - 1);
    state.guesses.push({ value: value, kind: "down" });
    setFeedback(value + " is too high. Go lower.", "down");
  }

  input.value = "";
  render();
  if (!state.over) input.focus();
}

// ---- Events ----
form.addEventListener("submit", handleGuess);
playAgainBtn.addEventListener("click", newGame);
levelSelect.addEventListener("change", newGame);

newGame();
