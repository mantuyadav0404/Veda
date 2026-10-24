"use strict";

/* ====================================================================
   GAME DATA
   ==================================================================== */
const CHOICES = ["rock", "paper", "scissors"];
const ICONS = { rock: "\u270A", paper: "\u270B", scissors: "\u270C\uFE0F" };
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };   /* key beats value */
const REVEAL_MS = 700;               /* short pause so the computer's "thinking" is visible */
const HISTORY_MAX = 5;

/* ====================================================================
   GAME LOGIC (pure functions: easy to test)
   ==================================================================== */
/* Math.random() gives 0 <= n < 1. Multiplying by 3 and rounding down gives 0, 1 or 2,
   each equally likely, which is used as an index into the array. */
function getComputerChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

/* Returns "player", "computer" or "draw" */
function getWinner(player, computer) {
  if (player === computer) return "draw";                          /* same move: a tie */
  return BEATS[player] === computer ? "player" : "computer";       /* does the player's move beat the computer's? */
}

function capitalise(word) { return word.charAt(0).toUpperCase() + word.slice(1); }

function describe(winner, player, computer) {
  if (winner === "draw") return "Both chose " + player + ".";
  return winner === "player"
    ? capitalise(player) + " beats " + computer + "."
    : capitalise(computer) + " beats " + player + ".";
}

/* ====================================================================
   STATE
   ==================================================================== */
const state = { player: 0, computer: 0, draws: 0, round: 0, history: [], busy: false };
let revealTimer = null;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ====================================================================
   DOM
   ==================================================================== */
const el = {
  scorePlayer: document.getElementById("score-player"), scoreComputer: document.getElementById("score-computer"), scoreDraws: document.getElementById("score-draws"),
  handPlayer: document.getElementById("hand-player"), handComputer: document.getElementById("hand-computer"),
  banner: document.getElementById("banner"), detail: document.getElementById("detail"),
  history: document.getElementById("history"), reset: document.getElementById("reset"), choices: document.getElementById("choices")
};
const buttons = Array.from(el.choices.querySelectorAll(".choice"));
const boxes = [el.handPlayer.parentElement, el.handComputer.parentElement];

function setBusy(value) {
  state.busy = value;
  buttons.forEach(function (b) { b.disabled = value; });
}

function bump(node) {
  node.classList.remove("bump");
  void node.offsetWidth;
  node.classList.add("bump");
}

function renderScore(changed) {
  el.scorePlayer.textContent = state.player;
  el.scoreComputer.textContent = state.computer;
  el.scoreDraws.textContent = state.draws;
  if (changed) bump({ player: el.scorePlayer, computer: el.scoreComputer, draw: el.scoreDraws }[changed]);
}

function renderHistory() {
  el.history.replaceChildren();
  if (state.history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No rounds yet";
    el.history.appendChild(empty);
    return;
  }
  state.history.forEach(function (round) {
    const li = document.createElement("li");
    const label = round.winner === "player" ? "Win" : round.winner === "computer" ? "Loss" : "Draw";
    li.className = round.winner === "player" ? "win" : round.winner === "computer" ? "lose" : "draw";
    li.textContent = ICONS[round.player] + " vs " + ICONS[round.computer] + " \u00B7 " + label;
    el.history.appendChild(li);
  });
}

function showResult(winner, player, computer) {
  el.handPlayer.textContent = ICONS[player];
  el.handComputer.textContent = ICONS[computer];
  el.handComputer.classList.remove("thinking");
  boxes[0].classList.toggle("winner", winner === "player");
  boxes[1].classList.toggle("winner", winner === "computer");

  const text = { player: "You win!", computer: "You lose!", draw: "It's a draw!" }[winner];
  el.banner.textContent = text;
  el.banner.className = "banner " + { player: "win", computer: "lose", draw: "draw" }[winner];
  el.detail.textContent = describe(winner, player, computer) + "  Round " + state.round + " done.";
}

/* ====================================================================
   PLAYING A ROUND
   ==================================================================== */
function play(playerChoice) {
  if (state.busy) return;                                  /* ignore clicks while the computer is "thinking" */
  setBusy(true);

  el.handPlayer.textContent = ICONS[playerChoice];
  el.handComputer.textContent = "\u2754";
  el.handComputer.classList.add("thinking");
  boxes.forEach(function (box) { box.classList.remove("winner"); });
  el.banner.className = "banner";
  el.banner.textContent = "Computer is choosing\u2026";
  el.detail.textContent = "";

  revealTimer = setTimeout(function () {
    const computerChoice = getComputerChoice();
    const winner = getWinner(playerChoice, computerChoice);

    state.round += 1;
    if (winner === "player") state.player += 1;
    else if (winner === "computer") state.computer += 1;
    else state.draws += 1;                                 /* a tie changes neither player's score */

    state.history.unshift({ player: playerChoice, computer: computerChoice, winner: winner });
    state.history = state.history.slice(0, HISTORY_MAX);

    showResult(winner, playerChoice, computerChoice);
    renderScore(winner === "player" ? "player" : winner === "computer" ? "computer" : "draw");
    renderHistory();
    setBusy(false);
    revealTimer = null;
  }, reduceMotion ? 0 : REVEAL_MS);
}

function resetGame() {
  clearTimeout(revealTimer);                               /* cancel a round that is still in progress */
  revealTimer = null;
  state.player = state.computer = state.draws = state.round = 0;
  state.history = [];
  setBusy(false);

  el.handPlayer.textContent = "\u2754";
  el.handComputer.textContent = "\u2754";
  el.handComputer.classList.remove("thinking");
  boxes.forEach(function (box) { box.classList.remove("winner"); });
  el.banner.className = "banner";
  el.banner.textContent = "Score reset. Make your move!";
  el.detail.textContent = "Round 1";
  renderScore();
  renderHistory();
}

/* ---------- Events ---------- */
el.choices.addEventListener("click", function (event) {
  const button = event.target.closest(".choice");
  if (button) play(button.dataset.choice);
});
el.reset.addEventListener("click", resetGame);

const KEYS = { r: "rock", p: "paper", s: "scissors" };
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const choice = KEYS[event.key.toLowerCase()];
  if (choice) play(choice);
});

renderScore();
renderHistory();
