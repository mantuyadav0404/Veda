"use strict";

/* ---------- DOM selection ---------- */
const list        = document.getElementById("faq-list");
const items       = Array.from(list.querySelectorAll(".faq-item"));
const multiToggle = document.getElementById("multi");
const expandBtn   = document.getElementById("expand-all");
const collapseBtn = document.getElementById("collapse-all");

let lastOpened = null;   /* remembers the most recently opened item */

/* ---------- Core: open or close one item ---------- */
function setOpen(item, open) {
  item.classList.toggle("active", open);        /* active state for CSS */
  item.querySelector(".faq-question").setAttribute("aria-expanded", String(open));
  if (open) lastOpened = item;
}

function isOpen(item) {
  return item.classList.contains("active");
}

/* Close every item except the one passed in (single-open mode) */
function closeOthers(keep) {
  items.forEach(function (item) {
    if (item !== keep && isOpen(item)) setOpen(item, false);
  });
}

/* Expand all only makes sense when multiple answers may stay open */
function updateBulkButtons() {
  const allOpen = items.every(isOpen);
  expandBtn.disabled = !multiToggle.checked || allOpen;
  collapseBtn.disabled = !items.some(isOpen);
}

/* ---------- Events ---------- */
/* One listener on the list (event delegation) handles every question */
list.addEventListener("click", function (event) {
  const button = event.target.closest(".faq-question");
  if (!button) return;

  const item = button.closest(".faq-item");
  const willOpen = !isOpen(item);

  if (willOpen && !multiToggle.checked) closeOthers(item);
  setOpen(item, willOpen);
  updateBulkButtons();
});

/* Keyboard: Up / Down / Home / End move between questions */
list.addEventListener("keydown", function (event) {
  const button = event.target.closest(".faq-question");
  if (!button) return;

  const buttons = items.map(function (item) { return item.querySelector(".faq-question"); });
  const i = buttons.indexOf(button);
  let target = null;

  if (event.key === "ArrowDown") target = buttons[(i + 1) % buttons.length];
  if (event.key === "ArrowUp")   target = buttons[(i - 1 + buttons.length) % buttons.length];
  if (event.key === "Home")      target = buttons[0];
  if (event.key === "End")       target = buttons[buttons.length - 1];

  if (target) { event.preventDefault(); target.focus(); }
});

/* Switching back to single mode keeps only the latest opened answer */
multiToggle.addEventListener("change", function () {
  if (!multiToggle.checked) {
    const keep = (lastOpened && isOpen(lastOpened)) ? lastOpened : items.find(isOpen);
    if (keep) closeOthers(keep);
  }
  updateBulkButtons();
});

expandBtn.addEventListener("click", function () {
  items.forEach(function (item) { setOpen(item, true); });
  updateBulkButtons();
});

collapseBtn.addEventListener("click", function () {
  items.forEach(function (item) { setOpen(item, false); });
  updateBulkButtons();
});

updateBulkButtons();
