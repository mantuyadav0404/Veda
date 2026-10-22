"use strict";

/* ---------- Settings ---------- */
const CONFIG = {
  intervalMs: 5000,      /* time each slide stays on screen */
  slideMs: 600           /* duration of the slide animation (must match --slide-ms) */
};

/* ---------- DOM selection ---------- */
const carousel  = document.getElementById("carousel");
const slideList = document.getElementById("slides");
const slides    = Array.from(slideList.children);
const prevBtn   = document.getElementById("prev");
const nextBtn   = document.getElementById("next");
const playBtn   = document.getElementById("play");
const dotsEl    = document.getElementById("dots");
const counterEl = document.getElementById("counter");
const progressEl = document.getElementById("progress");

/* Users who prefer reduced motion get instant changes and no progress bar */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const slideMs = reduceMotion ? 0 : CONFIG.slideMs;
document.documentElement.style.setProperty("--slide-ms", slideMs + "ms");
document.documentElement.style.setProperty("--autoplay-ms", CONFIG.intervalMs + "ms");

/* ====================================================================
   STATE
   index        : which slide is showing (0 to slides.length - 1)
   timerId      : the setInterval id, or null when auto-rotation is stopped
   pauseReasons : why auto-rotation is paused. Empty set = it runs.
                  "hover", "focus", "hidden" (tab not visible), "user" (Pause button)
   animating    : true while a slide animation is running
   ==================================================================== */
let index = 0;
let timerId = null;
let animating = false;
const pauseReasons = new Set();

/* ---------- Indicators ---------- */
const dots = slides.map(function (_, i) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.dataset.index = i;
  dot.setAttribute("aria-label", "Go to slide " + (i + 1));
  dotsEl.appendChild(dot);
  return dot;
});

function updateIndicators() {
  dots.forEach(function (dot, i) {
    if (i === index) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current");
  });
  counterEl.textContent = (index + 1) + " / " + slides.length;
  slides.forEach(function (slide, i) {
    if (i === index) slide.removeAttribute("aria-hidden"); else slide.setAttribute("aria-hidden", "true");
  });
}

/* ====================================================================
   SHOWING A SLIDE
   Next: the new slide waits on the right and slides in; the old one leaves to the left.
   Previous: the opposite. Because slides move by position (not by rewinding a long strip),
   going from the last slide to the first looks exactly like any other "next".
   ==================================================================== */
function goTo(newIndex, direction) {
  if (newIndex === index || animating) return;

  const current = slides[index];
  const incoming = slides[newIndex];
  const forward = direction === "next";

  incoming.classList.add(forward ? "from-right" : "from-left");   /* park it on the correct side, no animation */
  void incoming.offsetWidth;                                       /* force the browser to apply that position */
  incoming.classList.remove("from-right", "from-left");
  incoming.classList.add("active");                                /* now it animates to the centre */

  current.classList.remove("active");
  current.classList.add(forward ? "exit-left" : "exit-right");

  index = newIndex;
  animating = slideMs > 0;
  updateIndicators();

  function finish() {                                              /* tidy up once the animation is over */
    current.classList.add("no-anim");
    current.classList.remove("exit-left", "exit-right");
    void current.offsetWidth;
    current.classList.remove("no-anim");
    animating = false;
  }
  if (slideMs > 0) setTimeout(finish, slideMs); else finish();
}

/* Modulo wraps the index at both ends */
function next() { goTo((index + 1) % slides.length, "next"); }
function prev() { goTo((index - 1 + slides.length) % slides.length, "prev"); }

/* A manual action: move, then restart the auto-rotation timer */
function manual(action) {
  action();
  restartAutoplay();
}

/* ====================================================================
   AUTO-ROTATION
   ==================================================================== */
function startProgress() {
  progressEl.classList.remove("run");
  void progressEl.offsetWidth;                                     /* restart the CSS animation */
  if (!reduceMotion) progressEl.classList.add("run");
}

function stopAutoplay() {
  clearInterval(timerId);                                          /* always clear before anything else */
  timerId = null;
  progressEl.classList.remove("run");
}

function startAutoplay() {
  stopAutoplay();                                                  /* never allow two timers */
  if (pauseReasons.size > 0) return;
  timerId = setInterval(next, CONFIG.intervalMs);
  startProgress();
}

function restartAutoplay() {
  if (pauseReasons.size === 0) startAutoplay();
}

function setPaused(reason, paused) {
  const wasPaused = pauseReasons.size > 0;
  if (paused) pauseReasons.add(reason); else pauseReasons.delete(reason);
  const isPaused = pauseReasons.size > 0;
  if (isPaused === wasPaused) return;

  if (isPaused) stopAutoplay(); else startAutoplay();            /* resuming starts a full new interval */
  slideList.setAttribute("aria-live", isPaused ? "polite" : "off");   /* announce slide changes only when not auto-rotating */
}

/* ---------- Events ---------- */
nextBtn.addEventListener("click", function () { manual(next); });
prevBtn.addEventListener("click", function () { manual(prev); });

dotsEl.addEventListener("click", function (event) {
  const dot = event.target.closest(".dot");
  if (!dot) return;
  const target = Number(dot.dataset.index);
  manual(function () { goTo(target, target > index ? "next" : "prev"); });
});

/* Pause on hover, but only for a real mouse (touch screens have no hover) */
carousel.addEventListener("pointerenter", function (event) {
  if (event.pointerType === "mouse") setPaused("hover", true);
});
carousel.addEventListener("pointerleave", function (event) {
  if (event.pointerType === "mouse") setPaused("hover", false);
});

/* Pause while a keyboard user is inside the carousel (not after a mouse click) */
carousel.addEventListener("focusin", function (event) {
  if (event.target.matches(":focus-visible")) setPaused("focus", true);
});
carousel.addEventListener("focusout", function (event) {
  if (!carousel.contains(event.relatedTarget)) setPaused("focus", false);
});

/* Do not rotate in a background tab */
document.addEventListener("visibilitychange", function () {
  setPaused("hidden", document.hidden);
});

/* Pause / Play button for people who want control */
playBtn.addEventListener("click", function () {
  const pausing = !pauseReasons.has("user");
  setPaused("user", pausing);
  playBtn.textContent = pausing ? "Play" : "Pause";
  playBtn.setAttribute("aria-pressed", String(pausing));
});

/* Arrow keys */
carousel.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") { event.preventDefault(); manual(next); }
  if (event.key === "ArrowLeft")  { event.preventDefault(); manual(prev); }
});

/* Swipe on touch screens */
let touchStartX = null;
carousel.addEventListener("touchstart", function (event) {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
carousel.addEventListener("touchend", function (event) {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(dx) > 50) manual(dx < 0 ? next : prev);            /* swipe left = next */
}, { passive: true });

/* ---------- Start ---------- */
updateIndicators();
startAutoplay();
