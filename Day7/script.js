"use strict";

/* ---------- DOM selection ---------- */
const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");
const keysEl    = document.getElementById("keys");

/* ---------- Calculator state ----------
   currentValue : the number being typed (kept as a string)
   previousValue: the first operand, saved when an operator is chosen
   operator     : the selected operator (+ - × ÷) or null
   overwrite    : true when the next digit should replace the display
   hasError     : true after divide-by-zero until the user continues */
const state = {
  currentValue: "0",
  previousValue: null,
  operator: null,
  overwrite: false,
  hasError: false
};

const MAX_DIGITS = 12;

/* ---------- Pure arithmetic (no eval) ---------- */
function compute(a, b, operator) {
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;   /* null signals divide-by-zero */
    default:  return b;
  }
}

/* Remove floating-point noise: 0.1 + 0.2 -> 0.3 */
function clean(number) {
  return String(parseFloat(number.toPrecision(12)));
}

/* ---------- Display ---------- */
function formatForDisplay(text) {
  if (text.includes("e")) return text;
  const [whole, decimals] = text.split(".");
  const sign = whole.startsWith("-") ? "-" : "";
  const digits = whole.replace("-", "");
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + grouped + (decimals !== undefined ? "." + decimals : "");
}

function updateDisplay() {
  currentEl.textContent = state.hasError ? "Cannot divide by zero" : formatForDisplay(state.currentValue);
  currentEl.classList.toggle("error", state.hasError);

  historyEl.textContent = state.operator !== null
    ? formatForDisplay(state.previousValue) + " " + state.operator
    : "";

  /* Highlight the active operator button */
  document.querySelectorAll(".operator").forEach(function (btn) {
    const isActive = state.operator === btn.dataset.operator && state.overwrite;
    btn.classList.toggle("active", isActive);
  });
}

/* ---------- Actions ---------- */
function clearAll() {
  state.currentValue = "0";
  state.previousValue = null;
  state.operator = null;
  state.overwrite = false;
  state.hasError = false;
  updateDisplay();
}

function inputDigit(digit) {
  if (state.hasError) clearAll();
  if (state.overwrite || state.currentValue === "0") {
    state.currentValue = digit;
    state.overwrite = false;
  } else if (state.currentValue.replace(/[-.]/g, "").length < MAX_DIGITS) {
    state.currentValue += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (state.hasError) clearAll();
  if (state.overwrite) {
    state.currentValue = "0.";
    state.overwrite = false;
  } else if (!state.currentValue.includes(".")) {
    state.currentValue += ".";
  }
  updateDisplay();
}

function deleteLast() {
  if (state.hasError) { clearAll(); return; }
  if (state.overwrite) return;
  const shorter = state.currentValue.slice(0, -1);
  state.currentValue = (shorter === "" || shorter === "-") ? "0" : shorter;
  updateDisplay();
}

/* Run the pending operation. Returns false on divide-by-zero. */
function resolvePending() {
  const a = parseFloat(state.previousValue);
  const b = parseFloat(state.currentValue);
  const result = compute(a, b, state.operator);

  if (result === null) {
    state.currentValue = "0";
    state.previousValue = null;
    state.operator = null;
    state.overwrite = true;
    state.hasError = true;
    return false;
  }
  state.currentValue = clean(result);
  return true;
}

function chooseOperator(operator) {
  if (state.hasError) clearAll();

  /* Chain calculations: 2 + 3 × ... calculates 2 + 3 first */
  if (state.operator !== null && !state.overwrite) {
    if (!resolvePending()) { updateDisplay(); return; }
  }
  state.previousValue = state.currentValue;
  state.operator = operator;
  state.overwrite = true;
  updateDisplay();
}

function evaluate() {
  if (state.operator === null || state.overwrite) return;   /* nothing to calculate */
  const ok = resolvePending();
  if (ok) {
    state.previousValue = null;
    state.operator = null;
    state.overwrite = true;
  }
  updateDisplay();
}

/* ---------- Events ---------- */
/* One listener on the container handles every button (event delegation) */
keysEl.addEventListener("click", function (event) {
  const btn = event.target.closest("button");
  if (!btn) return;

  if (btn.dataset.digit !== undefined) inputDigit(btn.dataset.digit);
  else if (btn.dataset.operator)       chooseOperator(btn.dataset.operator);
  else if (btn.dataset.action === "decimal") inputDecimal();
  else if (btn.dataset.action === "equals")  evaluate();
  else if (btn.dataset.action === "delete")  deleteLast();
  else if (btn.dataset.action === "clear")   clearAll();
});

/* Keyboard support */
document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key >= "0" && key <= "9") inputDigit(key);
  else if (key === ".") inputDecimal();
  else if (key === "+" || key === "-") chooseOperator(key);
  else if (key === "*") chooseOperator("×");
  else if (key === "/") { event.preventDefault(); chooseOperator("÷"); }
  else if (key === "Enter" || key === "=") { event.preventDefault(); evaluate(); }
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
});

updateDisplay();
