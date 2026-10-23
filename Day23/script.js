"use strict";

/* ====================================================================
   MONEY MATH
   Computers store decimals such as 0.1 inexactly (0.1 + 0.2 = 0.30000000000000004).
   So all money is kept as WHOLE CENTS (integers) and only turned back into
   a decimal for display. Rounding then happens once, in one clear place.
   ==================================================================== */
const LIMITS = { maxBill: 10000000, maxTip: 100, maxPeople: 100 };

/* Turn what the user typed into a number, or an error message.
   Accepts up to 2 decimals so cents are exact. */
function parseDecimal(raw, label) {
  const text = raw.replace(/[,\s]/g, "");
  if (text === "") return { empty: true };
  if (!/^\d*\.?\d*$/.test(text) || !/\d/.test(text)) return { error: "Enter numbers only, for example 450.50." };
  const decimals = text.includes(".") ? text.split(".")[1].length : 0;
  if (decimals > 2) return { error: label + " can have at most 2 decimal places." };
  return { value: Number(text), text: text };
}

function toCents(text) {                       /* "12.5" -> 1250, with no floating-point error */
  const parts = text.split(".");
  const whole = parts[0] === "" ? 0 : Number(parts[0]);
  const frac = Number(((parts[1] || "") + "00").slice(0, 2));
  return whole * 100 + frac;
}

/* Tip in cents, rounded half-up using integer maths only.
   percentBasis is the percentage in hundredths (12.5% -> 1250). */
function tipInCents(billCents, percentBasis) {
  return Math.floor((billCents * percentBasis + 5000) / 10000);
}

/* Split an amount between people: everyone pays the base share, and the
   leftover cents (the remainder) are given to some people, one cent each. */
function splitCents(totalCents, people) {
  const base = Math.floor(totalCents / people);
  const remainder = totalCents % people;
  return { base: base, remainder: remainder };       /* `remainder` people pay base + 1 cent */
}

/* The whole calculation. Returns an object, or an error for a bad number of people. */
function calculate(billCents, percentBasis, people) {
  if (!Number.isInteger(people) || people < 1) return { error: "People must be at least 1" };   /* division by zero guard */
  const tipCents = tipInCents(billCents, percentBasis);
  const totalCents = billCents + tipCents;
  const tipShare = Math.round(tipCents / people);
  const totalSplit = splitCents(totalCents, people);
  return {
    tipCents: tipCents,
    totalCents: totalCents,
    tipPerPersonCents: tipShare,
    totalPerPersonCents: Math.round(totalCents / people),
    split: totalSplit
  };
}

/* ====================================================================
   FORMATTING (Intl.NumberFormat)
   ==================================================================== */
const LOCALES = { INR: "en-IN", USD: "en-US", EUR: "en-IE", GBP: "en-GB" };
const SYMBOLS = { INR: "\u20B9", USD: "$", EUR: "\u20AC", GBP: "\u00A3" };

function formatMoney(cents, currency) {
  return new Intl.NumberFormat(LOCALES[currency], { style: "currency", currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(cents / 100);
}

/* ====================================================================
   DOM
   ==================================================================== */
const els = {
  bill: document.getElementById("bill"), custom: document.getElementById("custom"), people: document.getElementById("people"),
  currency: document.getElementById("currency"), symbol: document.getElementById("symbol"),
  billError: document.getElementById("bill-error"), tipError: document.getElementById("tip-error"), peopleError: document.getElementById("people-error"),
  tipPP: document.getElementById("tip-pp"), totalPP: document.getElementById("total-pp"), note: document.getElementById("split-note"),
  sumBill: document.getElementById("sum-bill"), sumTip: document.getElementById("sum-tip"), sumTotal: document.getElementById("sum-total"),
  minus: document.getElementById("minus"), plus: document.getElementById("plus"), reset: document.getElementById("reset"),
  form: document.getElementById("calc")
};
const tipButtons = Array.from(document.querySelectorAll(".tip"));
let selectedTip = "15";                      /* the preset in use, or "" when a custom value is used */

function setError(input, errorEl, message) {
  errorEl.textContent = message || "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function showDashes() {
  [els.tipPP, els.totalPP, els.sumBill, els.sumTip, els.sumTotal].forEach(function (el) { el.textContent = "\u2013"; });
  els.note.textContent = "";
}

/* Runs on every input event */
function update() {
  const currency = els.currency.value;
  els.symbol.textContent = SYMBOLS[currency];

  /* 1. Read and validate each input */
  const bill = parseDecimal(els.bill.value, "The bill");
  let billError = bill.error || "";
  if (!billError && !bill.empty && bill.value > LIMITS.maxBill) billError = "The bill cannot be more than " + LIMITS.maxBill.toLocaleString("en-US") + ".";
  setError(els.bill, els.billError, billError);

  const tipText = selectedTip !== "" ? { value: Number(selectedTip), text: selectedTip } : parseDecimal(els.custom.value, "The tip");
  let tipError = tipText.error || "";
  if (!tipError && !tipText.empty && tipText.value > LIMITS.maxTip) tipError = "The tip cannot be more than 100%.";
  setError(els.custom, els.tipError, tipError);

  const peopleRaw = els.people.value.trim();
  let peopleError = "";
  let people = Number(peopleRaw);
  if (peopleRaw === "") peopleError = "Enter the number of people.";
  else if (!/^\d+$/.test(peopleRaw)) peopleError = "Use a whole number, such as 2.";
  else if (people < 1) peopleError = "Can't be zero. At least 1 person.";
  else if (people > LIMITS.maxPeople) peopleError = "Maximum " + LIMITS.maxPeople + " people.";
  setError(els.people, els.peopleError, peopleError);

  els.minus.disabled = !(people > 1);
  els.plus.disabled = people >= LIMITS.maxPeople;

  /* 2. Only calculate when everything is valid */
  if (billError || tipError || peopleError || bill.empty || tipText.empty) { showDashes(); return; }

  const billCents = toCents(bill.text);
  const percentBasis = toCents(tipText.text);              /* 12.5% -> 1250 */
  const result = calculate(billCents, percentBasis, people);

  /* 3. Show the results */
  els.tipPP.textContent = formatMoney(result.tipPerPersonCents, currency);
  els.totalPP.textContent = formatMoney(result.totalPerPersonCents, currency);
  els.sumBill.textContent = formatMoney(billCents, currency);
  els.sumTip.textContent = formatMoney(result.tipCents, currency);
  els.sumTotal.textContent = formatMoney(result.totalCents, currency);

  const s = result.split;
  els.note.textContent = (people > 1 && s.remainder > 0)
    ? "The total does not split evenly: " + s.remainder + (s.remainder === 1 ? " person pays " : " people pay ") +
      formatMoney(s.base + 1, currency) + " and the rest pay " + formatMoney(s.base, currency) + "."
    : "";
}

/* ---------- Events ---------- */
els.form.addEventListener("submit", function (event) { event.preventDefault(); });
els.bill.addEventListener("input", update);
els.currency.addEventListener("change", update);
els.people.addEventListener("input", update);

els.custom.addEventListener("input", function () {
  selectedTip = els.custom.value.trim() === "" ? "15" : "";    /* typing a custom tip replaces the preset; clearing it brings 15% back */
  syncTipButtons();
  update();
});

document.getElementById("tip-grid").addEventListener("click", function (event) {
  const button = event.target.closest(".tip");
  if (!button) return;
  selectedTip = button.dataset.tip;
  els.custom.value = "";
  syncTipButtons();
  update();
});

function syncTipButtons() {
  tipButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.tip === selectedTip)); });
}

function stepPeople(change) {
  const current = /^\d+$/.test(els.people.value.trim()) ? Number(els.people.value) : 1;
  els.people.value = Math.min(Math.max(current + change, 1), LIMITS.maxPeople);
  update();
}
els.minus.addEventListener("click", function () { stepPeople(-1); });
els.plus.addEventListener("click", function () { stepPeople(1); });

els.reset.addEventListener("click", function () {
  els.bill.value = ""; els.custom.value = ""; els.people.value = "1";
  selectedTip = "15";
  syncTipButtons();
  update();
  els.bill.focus();
});

syncTipButtons();
update();
