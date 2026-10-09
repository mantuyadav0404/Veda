"use strict";

/* ---------- DOM selection ---------- */
const thumbs   = Array.from(document.querySelectorAll(".thumb"));
const lightbox = document.getElementById("lightbox");
const imgEl    = document.getElementById("lb-img");
const titleEl  = document.getElementById("lb-title");
const countEl  = document.getElementById("lb-count");
const closeBtn = document.getElementById("lb-close");
const prevBtn  = document.getElementById("lb-prev");
const nextBtn  = document.getElementById("lb-next");

/* Build the data from the page itself, so the HTML stays the single source */
const images = thumbs.map(function (btn) {
  const img = btn.querySelector("img");
  return { src: img.getAttribute("src"), alt: img.alt, title: btn.dataset.title || img.alt };
});

let current = 0;

/* ---------- Show the image at a given index ---------- */
function show(index) {
  /* Wrap around at both ends */
  current = (index + images.length) % images.length;
  const item = images[current];

  imgEl.src = item.src;
  imgEl.alt = item.alt;
  titleEl.textContent = item.title;
  countEl.textContent = (current + 1) + " / " + images.length;

  /* Preload the neighbours so next and previous feel instant */
  [current + 1, current - 1].forEach(function (i) {
    new Image().src = images[(i + images.length) % images.length].src;
  });
}

function openLightbox(index) {
  show(index);
  lightbox.showModal();                       /* <dialog> traps focus and handles Esc */
  document.documentElement.classList.add("lock");   /* stop the page scrolling behind */
  closeBtn.focus();
}

/* Runs for every way of closing (button, Esc, backdrop click) */
lightbox.addEventListener("close", function () {
  document.documentElement.classList.remove("lock");
  thumbs[current].focus();                    /* return focus to the last viewed thumbnail */
});

/* ---------- Events ---------- */
thumbs.forEach(function (btn, index) {
  btn.addEventListener("click", function () { openLightbox(index); });
});

closeBtn.addEventListener("click", function () { lightbox.close(); });
prevBtn.addEventListener("click",  function () { show(current - 1); });
nextBtn.addEventListener("click",  function () { show(current + 1); });

/* Click on the dark area (not the image or buttons) closes the preview */
lightbox.addEventListener("click", function (event) {
  if (!event.target.closest(".lb-img, .lb-btn, .lb-caption")) {
    lightbox.close();
  }
});

/* Arrow keys move between images while the preview is open */
document.addEventListener("keydown", function (event) {
  if (!lightbox.open) return;
  if (event.key === "ArrowRight") show(current + 1);
  if (event.key === "ArrowLeft")  show(current - 1);
});

/* Swipe left or right on touch screens */
let touchStartX = null;
lightbox.addEventListener("touchstart", function (event) {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
lightbox.addEventListener("touchend", function (event) {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
  touchStartX = null;
}, { passive: true });
