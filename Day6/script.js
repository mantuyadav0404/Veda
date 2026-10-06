"use strict";

/* ---------- DOM selection ---------- */
const form        = document.getElementById("bmi-form");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const heightError = document.getElementById("height-error");
const weightError = document.getElementById("weight-error");
const resetBtn    = document.getElementById("reset");
const resultEl    = document.getElementById("result");
const valueEl     = document.getElementById("bmi-value");
const categoryEl  = document.getElementById("bmi-category");
const adviceEl    = document.getElementById("advice");
const markerEl    = document.getElementById("marker");

/* Realistic limits for adults (reject values outside them) */
const LIMITS = {
  height: { min: 50, max: 272, unit: "cm" },
  weight: { min: 2,  max: 650, unit: "kg" }
};

/* Accepts 170, 65.5, .5, 70. (no letters, no multiple dots, no minus sign) */
const NUMBER_PATTERN = /^(\d+\.?\d*|\.\d+)$/;

/* ---------- Calculation functions ---------- */
function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/* WHO classification using if / else conditions */
function getCategory(bmi) {
  if (bmi < 18.5) {
    return { key: "under", label: "Underweight", advice: "Your BMI is below the healthy range. A balanced, nutritious diet may help." };
  } else if (bmi < 25) {
    return { key: "normal", label: "Normal weight", advice: "Your BMI is within the healthy range. Keep up your good habits." };
  } else if (bmi < 30) {
    return { key: "over", label: "Overweight", advice: "Your BMI is above the healthy range. Regular activity and balanced meals can help." };
  }
  return { key: "obese", label: "Obese", advice: "Your BMI is well above the healthy range. Consider speaking with a healthcare professional." };
}

/* Healthy weight range (BMI 18.5 to 24.9) for the entered height */
function healthyRange(heightCm) {
  const m2 = Math.pow(heightCm / 100, 2);
  return { low: 18.5 * m2, high: 24.9 * m2 };
}

/* Map BMI 10..40 onto 0..100% of the colour bar */
function markerPosition(bmi) {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  return ((clamped - 10) / 30) * 100;
}

/* ---------- Validation ---------- */
/* Returns { value } when valid, or { error } with a message */
function validate(raw, field) {
  const text = raw.trim();
  const { min, max, unit } = LIMITS[field];
  const name = field === "height" ? "height" : "weight";

  if (text === "") {
    return { error: "Please enter your " + name + "." };
  }
  if (!NUMBER_PATTERN.test(text)) {
    return { error: "Enter numbers only, with no letters or negative sign." };
  }
  const value = Number(text);
  if (value <= 0) {
    return { error: "Value must be greater than zero." };
  }
  if (value < min || value > max) {
    return { error: "Enter a " + name + " between " + min + " and " + max + " " + unit + "." };
  }
  return { value: value };
}

function showError(input, errorEl, message) {
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message || "";
}

/* ---------- Form handling ---------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const h = validate(heightInput.value, "height");
  const w = validate(weightInput.value, "weight");

  showError(heightInput, heightError, h.error);
  showError(weightInput, weightError, w.error);

  if (h.error || w.error) {
    resultEl.hidden = true;
    (h.error ? heightInput : weightInput).focus();
    return;
  }

  const bmi      = calculateBMI(h.value, w.value);
  const category = getCategory(bmi);
  const range    = healthyRange(h.value);

  valueEl.textContent    = bmi.toFixed(1);
  categoryEl.textContent = category.label;
  categoryEl.className   = "category " + category.key;
  adviceEl.textContent   = category.advice + " For your height, a healthy weight is about " +
                           range.low.toFixed(1) + " to " + range.high.toFixed(1) + " kg.";
  markerEl.style.left    = markerPosition(bmi) + "%";
  resultEl.hidden = false;
});

/* Clear errors as soon as the user edits a field */
[[heightInput, heightError], [weightInput, weightError]].forEach(function (pair) {
  pair[0].addEventListener("input", function () { showError(pair[0], pair[1], ""); });
});

resetBtn.addEventListener("click", function () {
  form.reset();
  showError(heightInput, heightError, "");
  showError(weightInput, weightError, "");
  resultEl.hidden = true;
  heightInput.focus();
});
