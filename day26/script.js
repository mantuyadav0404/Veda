"use strict";

/* ====================================================================
   VALIDATION RULES (pure functions: text in, result out)
   Each returns { value } when valid or { error: "message" } when not.
   ==================================================================== */

/* ---------- Name ---------- */
/* A letter first, then letters (any language), accents, spaces, apostrophes, dots and hyphens */
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}'\u2019.\- ]*$/u;

function validateName(raw) {
  const value = raw.trim().replace(/\s+/g, " ");             /* tidy extra spaces */
  if (value === "") return { error: "Please enter your name." };
  if (value.length < 2) return { error: "Your name must be at least 2 characters." };
  if (value.length > 50) return { error: "Your name must be 50 characters or fewer." };
  if (!NAME_PATTERN.test(value)) return { error: "Use letters, spaces, hyphens or apostrophes only." };
  return { value: value };
}

/* ---------- Email ---------- */
/* Practical pattern, not the full RFC 5322 grammar:
   local part : letters, digits and the symbols allowed by the standard
   @
   domain     : labels of letters/digits/hyphens (not starting or ending with a hyphen), separated by dots */
const EMAIL_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

/* Common typos of popular domains */
const DOMAIN_FIXES = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmail.con": "gmail.com", "gmail.co": "gmail.com", "gmail.cm": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com"
};

function validateEmail(raw) {
  const value = raw.trim();
  if (value === "") return { error: "Please enter your email address." };
  if (value.length > 254) return { error: "That email address is too long." };
  if (/\s/.test(value)) return { error: "An email address cannot contain spaces." };

  const at = value.indexOf("@");
  if (at === -1) return { error: "Your email needs an @ symbol, like name@example.com." };
  if (value.indexOf("@", at + 1) !== -1) return { error: "Use only one @ symbol." };

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (local === "") return { error: "Add the part before the @, like name@example.com." };
  if (domain === "") return { error: "Add the domain after the @, like name@example.com." };
  if (!domain.includes(".")) return { error: "The domain needs a dot, like example.com." };

  const tld = domain.split(".").pop();
  if (!/^[A-Za-z]{2,}$/.test(tld)) return { error: "The ending (such as .com) must be at least 2 letters." };

  const badLocal = local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..");
  if (badLocal || !EMAIL_PATTERN.test(value)) return { error: "Enter a valid email address, like name@example.com." };

  const fix = DOMAIN_FIXES[domain.toLowerCase()];
  return fix ? { value: value, suggestion: local + "@" + fix } : { value: value };
}

/* ---------- Password ---------- */
const COMMON_PASSWORDS = ["password", "password1", "password123", "12345678", "123456789", "1234567890", "qwerty123", "qwertyuiop", "iloveyou", "admin123", "welcome1", "letmein123", "abc12345", "passw0rd", "p@ssw0rd"];

/* The requirements shown in the checklist. `required` ones must pass before submitting. */
function getPasswordChecks(password, context) {
  const lower = password.toLowerCase();
  const tokens = [];
  if (context && context.name) context.name.toLowerCase().split(/[\s.'\u2019-]+/).forEach(function (t) { if (t.length >= 3) tokens.push(t); });
  if (context && context.email) { const local = context.email.split("@")[0].toLowerCase(); if (local.length >= 3) tokens.push(local); }
  return {
    length:   password.length >= 8,
    lower:    /[a-z]/.test(password),
    upper:    /[A-Z]/.test(password),
    number:   /[0-9]/.test(password),
    personal: !tokens.some(function (t) { return lower.includes(t); })
  };
}

function validatePassword(password, context) {
  if (password === "") return { error: "Please create a password." };
  const checks = getPasswordChecks(password, context);
  if (!checks.length) return { error: "Use at least 8 characters." };
  if (!checks.lower) return { error: "Add a lowercase letter." };
  if (!checks.upper) return { error: "Add an uppercase letter." };
  if (!checks.number) return { error: "Add a number." };
  if (!checks.personal) return { error: "Do not use your name or email in the password." };
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) return { error: "That password is too common. Try something more unique." };
  return { value: password };
}

/* Strength: 0 (empty) to 4 (strong). A guide, not a guarantee. */
function getStrength(password, context) {
  if (password === "") return { level: 0, label: "\u2013" };
  const checks = getPasswordChecks(password, context);
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) return { level: 1, label: "Weak (too common)" };

  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(function (re) { return re.test(password); }).length;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (classes >= 3) score += 1;
  if (classes === 4) score += 1;

  if (/(.)\1{2,}/.test(password)) score -= 1;                                   /* aaa, 111 */
  if (/(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv)/i.test(password)) score -= 1;   /* easy sequences */
  if (!checks.personal) score -= 1;                                             /* contains your own name or email */

  let level = Math.max(1, Math.min(4, Math.ceil(score * 4 / 5)));               /* 0..5 points -> 1..4 bars */
  if (!(checks.length && checks.lower && checks.upper && checks.number)) level = Math.min(level, password.length < 8 ? 1 : 2);   /* missing requirements cap the rating */
  return { level: level, label: ["", "Weak", "Fair", "Good", "Strong"][level] };
}

/* ====================================================================
   DOM
   ==================================================================== */
const form = document.getElementById("signup");
const inputs = { name: document.getElementById("name"), email: document.getElementById("email"), password: document.getElementById("password") };
const fieldEls = {};
document.querySelectorAll(".field").forEach(function (f) { fieldEls[f.dataset.field] = f; });
const msgEls = { name: document.getElementById("name-msg"), email: document.getElementById("email-msg"), password: document.getElementById("password-msg") };
const suggestEl = document.getElementById("email-suggest");
const submitBtn = document.getElementById("submit");
const statusEl = document.getElementById("form-status");
const meter = document.getElementById("meter");
const strengthLabel = document.getElementById("strength-label");
const ruleEls = {};
document.querySelectorAll("#rules li").forEach(function (li) { ruleEls[li.dataset.rule] = li; });
const toggleBtn = document.getElementById("toggle-pw");
const formView = document.getElementById("form-view");
const successView = document.getElementById("success");

/* Which fields the user has already visited (so we do not scold an untouched form) */
const touched = { name: false, email: false, password: false };
let submitAttempted = false;

function results() {
  const name = validateName(inputs.name.value);
  const email = validateEmail(inputs.email.value);
  const context = { name: inputs.name.value, email: inputs.email.value };
  const password = validatePassword(inputs.password.value, context);
  return { name: name, email: email, password: password, context: context };
}

function showField(key, result) {
  const visible = touched[key] || submitAttempted;
  const field = fieldEls[key];
  field.classList.toggle("invalid", visible && !!result.error);
  field.classList.toggle("valid", visible && !result.error);
  inputs[key].setAttribute("aria-invalid", visible && result.error ? "true" : "false");
  msgEls[key].textContent = !visible ? "" : result.error ? result.error : (key === "password" ? "Looks good." : "Looks good.");
}

function render() {
  const r = results();
  showField("name", r.name);
  showField("email", r.email);
  showField("password", r.password);

  /* email typo suggestion */
  if (r.email.suggestion) {
    suggestEl.hidden = false;
    suggestEl.innerHTML = "";
    suggestEl.append("Did you mean ");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = r.email.suggestion;
    btn.addEventListener("click", function () { inputs.email.value = r.email.suggestion; render(); inputs.email.focus(); });
    suggestEl.append(btn, "?");
  } else {
    suggestEl.hidden = true;
  }

  /* password strength + checklist (always live) */
  const checks = getPasswordChecks(inputs.password.value, r.context);
  Object.keys(ruleEls).forEach(function (key) { ruleEls[key].classList.toggle("met", inputs.password.value !== "" && checks[key]); });
  const strength = getStrength(inputs.password.value, r.context);
  meter.dataset.level = strength.level;
  strengthLabel.textContent = strength.label;

  /* the button looks disabled until everything is valid, but stays focusable so it can explain what is wrong */
  const valid = !r.name.error && !r.email.error && !r.password.error;
  submitBtn.setAttribute("aria-disabled", String(!valid));
  return { valid: valid, r: r };
}

/* ---------- Events ---------- */
Object.keys(inputs).forEach(function (key) {
  inputs[key].addEventListener("input", render);                              /* live feedback while typing */
  inputs[key].addEventListener("blur", function () { touched[key] = true; render(); });   /* first message after leaving the field */
});

toggleBtn.addEventListener("click", function () {
  const showing = inputs.password.type === "text";
  inputs.password.type = showing ? "password" : "text";
  toggleBtn.textContent = showing ? "Show" : "Hide";
  toggleBtn.setAttribute("aria-pressed", String(!showing));
  toggleBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

form.addEventListener("submit", function (event) {
  event.preventDefault();                                                     /* always stop the browser's own submit */
  submitAttempted = true;
  const outcome = render();

  if (!outcome.valid) {                                                       /* PREVENT SUBMISSION until valid */
    const order = ["name", "email", "password"];
    const invalid = order.filter(function (key) { return outcome.r[key].error; });
    statusEl.textContent = invalid.length === 1 ? "Please fix 1 field." : "Please fix " + invalid.length + " fields.";
    inputs[invalid[0]].focus();                                               /* take the user to the first problem */
    return;
  }

  /* Valid: this demo shows a success view. A real site would send the data to a server here. */
  document.getElementById("success-text").textContent =
    "Welcome, " + outcome.r.name.value.split(" ")[0] + "! A confirmation would be sent to " + outcome.r.email.value + ".";
  formView.hidden = true;
  successView.hidden = false;
  successView.focus();
  form.reset();                                                               /* the password is never kept */
});

document.getElementById("again").addEventListener("click", function () {
  touched.name = touched.email = touched.password = false;
  submitAttempted = false;
  statusEl.textContent = "Demo only: your details are not sent or saved.";
  successView.hidden = true;
  formView.hidden = false;
  render();
  inputs.name.focus();
});

render();
