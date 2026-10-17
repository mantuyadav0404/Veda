"use strict";

/* ====================================================================
   CHARACTER SETS
   ==================================================================== */
const SETS = {
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:   "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?"
};
const AMBIGUOUS = "Il1O0o";          /* characters that are easy to confuse */
const MIN_LENGTH = 4;                /* one for each character type */
const MAX_LENGTH = 64;

/* ====================================================================
   SECURE RANDOMNESS
   Math.random() is fast but NOT secure: it is a predictable pseudo-random
   generator, and its output must never be used for passwords or tokens.
   crypto.getRandomValues() uses the operating system's secure random source.
   ==================================================================== */
/* Random whole number from 0 to max - 1, without modulo bias */
function randomInt(max) {
  const buffer = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;   /* largest multiple of max that fits */
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);                         /* reject values that would favour small numbers */
  return buffer[0] % max;
}

function pickChar(characters) {
  return characters[randomInt(characters.length)];
}

/* Fisher-Yates shuffle: every ordering is equally likely */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/* ====================================================================
   PASSWORD LOGIC
   ==================================================================== */
/* Build the list of character groups that the user selected */
function buildGroups(options) {
  const selected = [];
  ["upper", "lower", "numbers", "symbols"].forEach(function (key) {
    if (options[key]) {
      let chars = SETS[key];
      if (options.avoidAmbiguous) {
        chars = chars.split("").filter(function (c) { return !AMBIGUOUS.includes(c); }).join("");
      }
      selected.push(chars);
    }
  });
  return selected;
}

/* Returns { password, poolSize } or null when nothing is selected */
function generatePassword(options) {
  const groups = buildGroups(options);
  if (groups.length === 0) return null;                   /* the "no option selected" case */

  const length = Math.min(Math.max(options.length, MIN_LENGTH), MAX_LENGTH);
  const pool = groups.join("");                           /* the combined character pool */
  const chars = [];

  groups.forEach(function (group) { chars.push(pickChar(group)); });   /* one from each group, so every chosen type appears */
  while (chars.length < length) { chars.push(pickChar(pool)); }        /* fill the rest from the whole pool */

  return { password: shuffle(chars).join(""), poolSize: pool.length };
}

/* Entropy in bits: length x log2(pool size). It assumes every character is chosen at random. */
function calculateEntropy(length, poolSize) {
  return length * Math.log2(poolSize);
}

function getStrength(bits) {
  if (bits < 40) return { level: 1, label: "Weak" };
  if (bits < 60) return { level: 2, label: "Fair" };
  if (bits < 90) return { level: 3, label: "Strong" };
  return { level: 4, label: "Very strong" };
}

/* ====================================================================
   DOM
   ==================================================================== */
const form        = document.getElementById("options");
const passwordEl  = document.getElementById("password");
const copyBtn     = document.getElementById("copy");
const refreshBtn  = document.getElementById("refresh");
const generateBtn = document.getElementById("generate");
const rangeEl     = document.getElementById("length-range");
const numberEl    = document.getElementById("length-number");
const errorEl     = document.getElementById("error");
const meterEl     = document.querySelector(".meter");
const labelEl     = document.getElementById("strength-label");
const entropyEl   = document.getElementById("entropy");
const statusEl    = document.getElementById("status");
const checks = {
  upper:   document.getElementById("opt-upper"),
  lower:   document.getElementById("opt-lower"),
  numbers: document.getElementById("opt-numbers"),
  symbols: document.getElementById("opt-symbols"),
  avoidAmbiguous: document.getElementById("opt-ambiguous")
};

let currentPassword = "";
let copyTimer = null;

function readOptions() {
  return {
    length: Number(rangeEl.value),
    upper: checks.upper.checked,
    lower: checks.lower.checked,
    numbers: checks.numbers.checked,
    symbols: checks.symbols.checked,
    avoidAmbiguous: checks.avoidAmbiguous.checked
  };
}

/* Show the password with digits and symbols in different colours */
function showPassword(password) {
  passwordEl.replaceChildren();
  passwordEl.classList.remove("empty");
  password.split("").forEach(function (ch) {
    const span = document.createElement("span");
    if (/[0-9]/.test(ch)) span.className = "d";
    else if (!/[A-Za-z]/.test(ch)) span.className = "s";
    span.textContent = ch;                                /* textContent keeps every symbol safe */
    passwordEl.appendChild(span);
  });
}

function showEmpty(message) {
  currentPassword = "";
  passwordEl.replaceChildren(document.createTextNode(message));
  passwordEl.classList.add("empty");
  copyBtn.disabled = true;
  meterEl.dataset.level = "0";
  labelEl.textContent = "\u00A0";
  entropyEl.textContent = "";
}

function setError(message) {
  errorEl.textContent = message || "";
}

function generate() {
  setError("");
  if (!window.crypto || !crypto.getRandomValues) {
    showEmpty("Secure random numbers are not available in this browser.");
    setError("Please use a modern browser to generate passwords.");
    return;
  }

  const options = readOptions();
  const result = generatePassword(options);

  if (result === null) {                                  /* nothing selected */
    showEmpty("Select at least one character type");
    setError("Choose at least one option: uppercase, lowercase, numbers or symbols.");
    generateBtn.disabled = true;
    refreshBtn.disabled = true;
    return;
  }

  generateBtn.disabled = false;
  refreshBtn.disabled = false;
  copyBtn.disabled = false;
  copyBtn.textContent = "Copy";
  copyBtn.classList.remove("copied");

  currentPassword = result.password;
  showPassword(currentPassword);

  const bits = calculateEntropy(currentPassword.length, result.poolSize);
  const strength = getStrength(bits);
  meterEl.dataset.level = String(strength.level);
  labelEl.textContent = strength.label;
  entropyEl.textContent = "\u00B7 about " + Math.round(bits) + " bits of entropy";
}

/* ====================================================================
   COPY TO CLIPBOARD
   ==================================================================== */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const area = document.createElement("textarea");      /* fallback for insecure pages */
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }
}

copyBtn.addEventListener("click", async function () {
  if (!currentPassword) return;
  const ok = await copyText(currentPassword);
  copyBtn.textContent = ok ? "Copied!" : "Failed";
  copyBtn.classList.toggle("copied", ok);
  statusEl.textContent = ok ? "Password copied to clipboard" : "Copy failed. Please select the password and copy it manually.";
  clearTimeout(copyTimer);
  copyTimer = setTimeout(function () {
    copyBtn.textContent = "Copy";
    copyBtn.classList.remove("copied");
  }, 1800);
});

/* ====================================================================
   EVENTS
   ==================================================================== */
form.addEventListener("submit", function (event) { event.preventDefault(); generate(); });
refreshBtn.addEventListener("click", generate);

/* Slider: update the number and make a new password live */
rangeEl.addEventListener("input", function () {
  numberEl.value = rangeEl.value;
  numberEl.setAttribute("aria-invalid", "false");
  generate();
});

/* Number box: accept typing, keep the slider in step, and keep the value in range */
numberEl.addEventListener("input", function () {
  const value = Number(numberEl.value);
  const valid = numberEl.value !== "" && Number.isInteger(value) && value >= MIN_LENGTH && value <= MAX_LENGTH;
  numberEl.setAttribute("aria-invalid", valid ? "false" : "true");
  if (valid) {
    rangeEl.value = value;
    generate();
  }
});
numberEl.addEventListener("change", function () {
  const value = Math.round(Number(numberEl.value)) || 16;
  const clamped = Math.min(Math.max(value, MIN_LENGTH), MAX_LENGTH);
  numberEl.value = clamped;                                /* out-of-range values snap back */
  rangeEl.value = clamped;
  numberEl.setAttribute("aria-invalid", "false");
  generate();
});

/* Any checkbox change makes a new password */
Object.keys(checks).forEach(function (key) {
  checks[key].addEventListener("change", generate);
});

/* ---------- Start ---------- */
generate();
