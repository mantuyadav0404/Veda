"use strict";

/* ---------- Settings ---------- */
const PALETTE_SIZE = 5;       /* the task asks for at least 5 swatches */
const TOAST_MS = 1800;

/* ---------- DOM selection ---------- */
const paletteEl = document.getElementById("palette");
const generateBtn = document.getElementById("generate");
const copyAllBtn = document.getElementById("copy-all");
const toastEl = document.getElementById("toast");

/* ---------- State: one object per swatch ---------- */
let colors = [];
let toastTimer = null;

/* ---------- Colour helpers ---------- */
/* A hex colour is a number from 0 to 16,777,215 (0xFFFFFF) written in base 16.
   Math.random() * 0x1000000 gives 0 up to 16,777,215.99, Math.floor removes the decimals,
   toString(16) converts to hex, and padStart adds leading zeros so there are always 6 digits. */
function randomHex() {
  const number = Math.floor(Math.random() * 0x1000000);
  return "#" + number.toString(16).padStart(6, "0").toUpperCase();
}

/* Choose black or white text, whichever is easier to read on this background */
function getTextColor(hex) {
  const channels = [1, 3, 5].map(function (start) {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.179 ? "#111111" : "#FFFFFF";
}

/* ---------- Rendering ---------- */
/* Build the swatches once; render() later only updates them */
function buildPalette() {
  paletteEl.innerHTML = "";
  colors.forEach(function (_, index) {
    const li = document.createElement("li");
    li.className = "swatch";
    li.dataset.index = index;
    li.innerHTML =
      '<button class="color" type="button">' +
        '<span class="hex"></span>' +
        '<span class="hint">Click to copy</span>' +
        '<span class="flash" aria-hidden="true">Copied!</span>' +
      '</button>' +
      '<button class="lock" type="button" aria-pressed="false">Lock</button>';
    paletteEl.appendChild(li);
  });
}

function render() {
  Array.from(paletteEl.children).forEach(function (li, index) {
    const color = colors[index];
    const text = getTextColor(color.hex);
    const colorBtn = li.querySelector(".color");
    const lockBtn = li.querySelector(".lock");

    colorBtn.style.backgroundColor = color.hex;
    colorBtn.style.color = text;
    colorBtn.setAttribute("aria-label", "Copy color " + color.hex);
    li.querySelector(".hex").textContent = color.hex;

    lockBtn.style.color = color.locked ? "#1B2430" : text;   /* locked = white pill, so use dark text */
    lockBtn.textContent = color.locked ? "Locked" : "Lock";
    lockBtn.setAttribute("aria-pressed", String(color.locked));
    lockBtn.setAttribute("aria-label", (color.locked ? "Unlock color " : "Lock color ") + color.hex);
  });
}

/* ---------- Actions ---------- */
function generatePalette() {
  if (colors.length && colors.every(function (c) { return c.locked; })) {
    showToast("Unlock a color to generate a new palette.");
    return;
  }
  colors = Array.from({ length: PALETTE_SIZE }, function (_, i) {
    const existing = colors[i];
    return existing && existing.locked ? existing : { hex: randomHex(), locked: false };
  });
  render();
}

/* ---------- Copy to clipboard ---------- */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);       /* modern Clipboard API (needs HTTPS or localhost) */
    return true;
  } catch (error) {
    /* Fallback for older browsers or insecure contexts */
    const area = document.createElement("textarea");
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

/* ---------- User feedback ---------- */
function showToast(message, hex) {
  toastEl.innerHTML = "";
  if (hex) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.backgroundColor = hex;
    toastEl.appendChild(dot);
  }
  toastEl.appendChild(document.createTextNode(message));
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, TOAST_MS);
}

async function copyColor(index) {
  const hex = colors[index].hex;
  const ok = await copyText(hex);
  if (!ok) {
    showToast("Copy failed. Please copy " + hex + " manually.");
    return;
  }
  showToast("Copied " + hex, hex);

  const swatch = paletteEl.children[index];            /* brief flash on the swatch itself */
  swatch.classList.add("copied");
  setTimeout(function () { swatch.classList.remove("copied"); }, 1000);
}

async function copyAll() {
  const list = colors.map(function (c) { return c.hex; }).join(", ");
  const ok = await copyText(list);
  showToast(ok ? "Copied all " + colors.length + " colors" : "Copy failed. Please try again.");
}

/* ---------- Events ---------- */
/* One listener on the palette (event delegation) handles every swatch and lock button */
paletteEl.addEventListener("click", function (event) {
  const li = event.target.closest(".swatch");
  if (!li) return;
  const index = Number(li.dataset.index);

  if (event.target.closest(".lock")) {
    colors[index].locked = !colors[index].locked;
    render();
  } else if (event.target.closest(".color")) {
    copyColor(index);
  }
});

generateBtn.addEventListener("click", generatePalette);
copyAllBtn.addEventListener("click", copyAll);

/* Space bar generates a new palette (unless a button or field has focus) */
document.addEventListener("keydown", function (event) {
  if (event.code !== "Space") return;
  if (event.target.closest("button, input, textarea, select, a")) return;
  event.preventDefault();
  generatePalette();
});

/* ---------- Start ---------- */
colors = Array.from({ length: PALETTE_SIZE }, function () { return { hex: randomHex(), locked: false }; });
buildPalette();
render();
