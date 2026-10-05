"use strict";

/* ---------- DOM selection ---------- */
const inputs = {
  celsius:    document.getElementById("celsius"),
  fahrenheit: document.getElementById("fahrenheit"),
  kelvin:     document.getElementById("kelvin")
};
const messageEl = document.getElementById("message");
const clearBtn  = document.getElementById("clear");

/* ---------- Conversion functions (one per formula) ---------- */
function celsiusToFahrenheit(c) { return (c * 9) / 5 + 32; }
function celsiusToKelvin(c)     { return c + 273.15; }
function fahrenheitToCelsius(f) { return ((f - 32) * 5) / 9; }
function fahrenheitToKelvin(f)  { return fahrenheitToCelsius(f) + 273.15; }
function kelvinToCelsius(k)     { return k - 273.15; }
function kelvinToFahrenheit(k)  { return celsiusToFahrenheit(kelvinToCelsius(k)); }

/* Lowest physically possible value for each unit (absolute zero) */
const ABSOLUTE_ZERO = { celsius: -273.15, fahrenheit: -459.67, kelvin: 0 };
const LABELS        = { celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin" };

/* ---------- Helpers ---------- */
/* Accepts values like 25, -10, +3.5, .5, 12. (no letters, no multiple dots) */
const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

/* Round to 2 decimals and drop trailing zeros: 77.000000001 -> "77" */
function format(value) {
  return String(Number(value.toFixed(2)));
}

function setMessage(text) {
  messageEl.textContent = text;
}

function markInvalid(el, isInvalid) {
  el.setAttribute("aria-invalid", String(isInvalid));
}

function clearOthers(source) {
  Object.keys(inputs).forEach(function (unit) {
    if (unit !== source) {
      inputs[unit].value = "";
    }
  });
}

/* Returns the converted values for the other two units */
function convert(unit, value) {
  if (unit === "celsius") {
    return { fahrenheit: celsiusToFahrenheit(value), kelvin: celsiusToKelvin(value) };
  }
  if (unit === "fahrenheit") {
    return { celsius: fahrenheitToCelsius(value), kelvin: fahrenheitToKelvin(value) };
  }
  return { celsius: kelvinToCelsius(value), fahrenheit: kelvinToFahrenheit(value) };
}

/* ---------- Main handler (runs on every keystroke) ---------- */
function handleInput(unit) {
  const el  = inputs[unit];
  const raw = el.value.trim();

  markInvalid(el, false);
  setMessage("");

  /* 1. Empty input: reset the other fields */
  if (raw === "") {
    clearOthers(unit);
    return;
  }

  /* 2. A lone sign or dot is still being typed, so wait quietly */
  if (raw === "-" || raw === "+" || raw === ".") {
    clearOthers(unit);
    return;
  }

  /* 3. Not a valid number */
  if (!NUMBER_PATTERN.test(raw)) {
    markInvalid(el, true);
    setMessage("Please enter a valid number (digits, one decimal point, optional minus sign).");
    clearOthers(unit);
    return;
  }

  /* 4. Below absolute zero is physically impossible */
  const value = Number(raw);
  if (value < ABSOLUTE_ZERO[unit]) {
    markInvalid(el, true);
    setMessage(LABELS[unit] + " cannot go below absolute zero (" + ABSOLUTE_ZERO[unit] + ").");
    clearOthers(unit);
    return;
  }

  /* 5. Valid: convert and update the other two fields */
  const results = convert(unit, value);
  Object.keys(results).forEach(function (other) {
    inputs[other].value = format(results[other]);
    markInvalid(inputs[other], false);
  });
}

/* ---------- Events ---------- */
Object.keys(inputs).forEach(function (unit) {
  inputs[unit].addEventListener("input", function () { handleInput(unit); });
});

clearBtn.addEventListener("click", function () {
  Object.keys(inputs).forEach(function (unit) {
    inputs[unit].value = "";
    markInvalid(inputs[unit], false);
  });
  setMessage("");
  inputs.celsius.focus();
});
