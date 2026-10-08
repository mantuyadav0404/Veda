"use strict";

/* ---------- Data: quotes stored as objects in an array ---------- */
const quotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" }
];

/* ---------- DOM selection ---------- */
const boxEl    = document.querySelector(".quote-box");
const quoteEl  = document.getElementById("quote");
const authorEl = document.getElementById("author");
const newBtn   = document.getElementById("new-quote");
const copyBtn  = document.getElementById("copy");
const shareBtn = document.getElementById("share");
const statusEl = document.getElementById("status");
const countEl  = document.getElementById("count");

let lastIndex = -1;       /* index of the quote on screen, -1 = none yet */
let shown = 0;            /* how many quotes the user has viewed */
let statusTimer = null;

/* ---------- Random selection without immediate repeats ----------
   Math.random() returns a decimal from 0 up to (but not including) 1.
   Multiplying by (length - 1) and flooring gives an index from 0..length-2.
   If that index is at or after the last one shown, shift it up by one,
   which skips the last index and keeps every other quote equally likely. */
function getRandomIndex(length, previous) {
  if (length <= 1) return 0;
  if (previous < 0) return Math.floor(Math.random() * length);

  let index = Math.floor(Math.random() * (length - 1));
  if (index >= previous) index += 1;
  return index;
}

/* ---------- DOM update ---------- */
function showQuote() {
  const index = getRandomIndex(quotes.length, lastIndex);
  lastIndex = index;
  shown += 1;

  /* Fade out, swap the text, fade in */
  boxEl.classList.add("fading");
  setTimeout(function () {
    quoteEl.textContent  = quotes[index].text;
    authorEl.textContent = quotes[index].author;
    boxEl.classList.remove("fading");
  }, 200);

  copyBtn.disabled  = false;
  shareBtn.disabled = false;
  countEl.textContent = "Quotes viewed: " + shown + " · Library: " + quotes.length + " quotes";
}

function currentText() {
  const q = quotes[lastIndex];
  return "\u201C" + q.text + "\u201D \u2014 " + q.author;
}

function setStatus(message) {
  statusEl.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(function () { statusEl.textContent = ""; }, 2500);
}

/* ---------- Copy and share ---------- */
async function copyQuote() {
  if (lastIndex < 0) return;
  try {
    await navigator.clipboard.writeText(currentText());
    setStatus("Quote copied to clipboard.");
  } catch (error) {
    /* Fallback for browsers or contexts where the Clipboard API is blocked */
    const area = document.createElement("textarea");
    area.value = currentText();
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    setStatus(ok ? "Quote copied to clipboard." : "Copy failed. Please select the text manually.");
  }
}

async function shareQuote() {
  if (lastIndex < 0) return;
  const text = currentText();

  /* Native share sheet on phones and some browsers */
  if (navigator.share) {
    try {
      await navigator.share({ title: "Random Quote", text: text });
    } catch (error) {
      /* AbortError means the user closed the share sheet, so nothing to report */
    }
    return;
  }
  /* Fallback: open a pre-filled post on X (Twitter) */
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ---------- Events ---------- */
newBtn.addEventListener("click", showQuote);
copyBtn.addEventListener("click", copyQuote);
shareBtn.addEventListener("click", shareQuote);
