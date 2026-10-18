"use strict";

/* ====================================================================
   COUNTING FUNCTIONS (pure: text in, number out, easy to test)
   ==================================================================== */

/* Characters. text.length counts UTF-16 code units, so an emoji such as a smiley
   would count as 2. Intl.Segmenter counts what a person sees as one character. */
const SEGMENTER = (typeof Intl !== "undefined" && Intl.Segmenter)
  ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
  : null;

function countCharacters(text) {
  if (!/[\u0300-\uFFFF]/.test(text)) return text.length;      /* fast path: plain ASCII text */
  if (!SEGMENTER) return Array.from(text).length;             /* older browsers: count code points */
  let count = 0;
  for (const part of SEGMENTER.segment(text)) count++;
  return count;
}

function countCharactersNoSpaces(text) {
  return countCharacters(text.replace(/\s/g, ""));            /* \s covers spaces, tabs and new lines */
}

/* A "real" token contains a letter, a digit or an emoji. \p{L} and \p{N} work for every language. */
const HAS_CONTENT = /[\p{L}\p{N}\p{Extended_Pictographic}]/u;

/* Words: trim, split on any run of whitespace, and ignore tokens that are only
   punctuation (for example a lone dash). */
function getWords(text) {
  const trimmed = text.trim();
  if (trimmed === "") return [];
  return trimmed.split(/\s+/).filter(function (token) {
    return HAS_CONTENT.test(token);
  });
}

function countWords(text) {
  return getWords(text).length;
}

/* Sentences: split at . ! ? or an ellipsis that is followed by a space or the end.
   Common abbreviations (Dr., e.g.) are protected so they do not end a sentence. */
const ABBREVIATIONS = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|e\.g|i\.e)\./gi;

function countSentences(text) {
  const protectedText = text.replace(ABBREVIATIONS, "$1\uE000");
  return protectedText
    .split(/[.!?\u2026]+["')\]]*(?=\s|$)|\n\s*\n/)             /* sentence end, or a blank line */
    .filter(function (part) { return HAS_CONTENT.test(part); })
    .length;
}

function countParagraphs(text) {
  return text.split(/\n\s*\n/).filter(function (part) { return part.trim() !== ""; }).length;
}

function averageWordLength(words) {
  if (words.length === 0) return 0;
  const letters = words.reduce(function (sum, word) {
    return sum + countCharacters(word.replace(/[^\p{L}\p{N}]/gu, ""));   /* ignore punctuation */
  }, 0);
  return letters / words.length;
}

/* Reading time at an average of 200 words per minute */
function formatReadingTime(wordCount) {
  const seconds = Math.round((wordCount / 200) * 60);
  if (seconds < 60) return seconds + " sec";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes >= 10 || rest === 0 ? Math.round(seconds / 60) + " min" : minutes + " min " + rest + " sec";
}

/* ====================================================================
   DOM
   ==================================================================== */
const textEl      = document.getElementById("text");
const limitInput  = document.getElementById("limit");
const limitBox    = document.getElementById("limit-box");
const limitFill   = document.getElementById("limit-fill");
const limitText   = document.getElementById("limit-text");
const sampleBtn   = document.getElementById("sample");
const clearBtn    = document.getElementById("clear");
const statusEl    = document.getElementById("status");
const out = {
  chars:      document.getElementById("chars"),
  words:      document.getElementById("words"),
  sentences:  document.getElementById("sentences"),
  noSpace:    document.getElementById("chars-nospace"),
  paragraphs: document.getElementById("paragraphs"),
  reading:    document.getElementById("reading"),
  avg:        document.getElementById("avg")
};

const SAMPLE_TEXT =
  "Counting words sounds easy, but real text is messy. Dr. Smith wrote 3 notes, e.g. a list, a plan and a summary!\n\n" +
  "Do extra   spaces matter?  They should not... Hyphenated words like well-known count as one word, and punctuation such as \u2014 is ignored.\n\n" +
  "Try typing your own text. The numbers update as you type.";

let statusTimer = null;

function formatNumber(n) {
  return n.toLocaleString("en-US");
}

/* Runs on every input event */
function update() {
  const text = textEl.value;
  const words = getWords(text);
  const chars = countCharacters(text);

  out.chars.textContent      = formatNumber(chars);
  out.words.textContent      = formatNumber(words.length);
  out.sentences.textContent  = formatNumber(countSentences(text));
  out.noSpace.textContent    = formatNumber(countCharactersNoSpaces(text));
  out.paragraphs.textContent = formatNumber(countParagraphs(text));
  out.reading.textContent    = formatReadingTime(words.length);
  out.avg.textContent        = (Math.round(averageWordLength(words) * 10) / 10).toFixed(1);

  updateLimit(chars);

  /* A short summary for screen readers, after the user pauses (not on every key) */
  clearTimeout(statusTimer);
  statusTimer = setTimeout(function () {
    statusEl.textContent = chars + " characters, " + words.length + " words, " + out.sentences.textContent + " sentences";
  }, 800);
}

function updateLimit(chars) {
  const limit = Number(limitInput.value);
  const active = limitInput.value !== "" && Number.isInteger(limit) && limit > 0;
  limitBox.hidden = !active;
  if (!active) return;

  const ratio = chars / limit;
  limitFill.style.width = Math.min(ratio, 1) * 100 + "%";
  limitBox.classList.toggle("over", chars > limit);
  limitBox.classList.toggle("warn", chars <= limit && ratio >= 0.9);

  limitText.textContent = chars > limit
    ? formatNumber(chars - limit) + " over the limit (" + formatNumber(chars) + " / " + formatNumber(limit) + ")"
    : formatNumber(limit - chars) + " remaining (" + formatNumber(chars) + " / " + formatNumber(limit) + ")";
}

/* ---------- Events ---------- */
/* The input event fires on typing, pasting, cutting and dropping.
   Normal text updates instantly; a very large paste waits 200 ms so typing stays smooth. */
let bigTimer = null;
textEl.addEventListener("input", function () {
  clearTimeout(bigTimer);
  if (textEl.value.length > 100000) bigTimer = setTimeout(update, 200);
  else update();
});
limitInput.addEventListener("input", update);

sampleBtn.addEventListener("click", function () {
  textEl.value = SAMPLE_TEXT;
  update();
  textEl.focus();
});

clearBtn.addEventListener("click", function () {
  textEl.value = "";
  update();
  textEl.focus();
});

/* ---------- Start ---------- */
update();        /* also handles text the browser restores after a refresh */
