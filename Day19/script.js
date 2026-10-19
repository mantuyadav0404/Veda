"use strict";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];   /* index = rating value */
const STAR_PATH = "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26";

/* ====================================================================
   createStarRating builds one widget inside `root`.
   Each widget keeps its OWN state, so any number can share a page.

   STATE (two separate values):
     rating       : the rating the user has chosen (0 = none). Changes only on click or keys.
     hoverRating  : the star under the pointer (0 = none). Changes on mouse move only.
   The picture on screen is derived from both: hoverRating wins while it is set.
   ==================================================================== */
function createStarRating(root, options) {
  const max = 5;
  const name = root.dataset.label || "Rating";
  const idBase = "rating-" + Math.random().toString(36).slice(2, 8);

  let rating = 0;
  let hoverRating = 0;

  /* ---------- Build the markup ---------- */
  const label = document.createElement("span");
  label.className = "rating-label";
  label.id = idBase + "-label";
  label.textContent = name;

  const group = document.createElement("div");
  group.className = "stars";
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-labelledby", label.id);

  const stars = [];
  for (let value = 1; value <= max; value++) {
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star";
    star.dataset.value = value;                           /* data attribute stores the star's value */
    star.setAttribute("role", "radio");
    star.setAttribute("aria-label", value + (value === 1 ? " star" : " stars") + ", " + LABELS[value]);
    star.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="' + STAR_PATH + '"/></svg>';
    group.appendChild(star);
    stars.push(star);
  }

  const footer = document.createElement("div");
  footer.className = "rating-footer";
  const display = document.createElement("p");
  display.className = "display";
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "reset";
  resetBtn.textContent = "Clear rating";
  resetBtn.setAttribute("aria-label", "Clear " + name + " rating");
  footer.append(display, resetBtn);

  const live = document.createElement("p");               /* announces only chosen ratings, not hover previews */
  live.className = "sr-only";
  live.setAttribute("role", "status");

  root.replaceChildren(label, group, footer, live);

  /* ---------- Render: draw the screen from the state ---------- */
  function render() {
    const shown = hoverRating || rating;                  /* what the stars display right now */

    stars.forEach(function (star) {
      const value = Number(star.dataset.value);
      star.classList.toggle("filled", value <= shown);    /* dynamic class toggling */
      star.setAttribute("aria-checked", String(value === rating));
      star.tabIndex = value === (rating || 1) ? 0 : -1;   /* roving tabindex: one tab stop per widget */
    });
    group.classList.toggle("hovering", hoverRating > 0);

    display.classList.toggle("preview-text", hoverRating > 0);
    if (hoverRating > 0) {
      display.textContent = "Preview: " + hoverRating + " / " + max + " \u2013 " + LABELS[hoverRating];
    } else if (rating > 0) {
      display.innerHTML = "<strong>" + rating + " / " + max + "</strong> \u2013 " + LABELS[rating];
    } else {
      display.textContent = "No rating yet";
    }
    resetBtn.disabled = rating === 0;
  }

  /* ---------- Actions ---------- */
  function setRating(value, focusStar) {
    rating = Math.min(Math.max(value, 0), max);
    hoverRating = 0;                                      /* the pointer preview ends once a rating is chosen */
    render();
    live.textContent = rating === 0
      ? name + " rating cleared"
      : name + ": " + rating + " out of " + max + ", " + LABELS[rating];
    if (focusStar && rating > 0) stars[rating - 1].focus();
    if (options && options.onChange) options.onChange(rating);
  }

  /* ---------- Events (delegated on the group) ---------- */
  group.addEventListener("mouseover", function (event) {
    const star = event.target.closest(".star");
    if (!star) return;
    hoverRating = Number(star.dataset.value);
    render();
  });

  group.addEventListener("mouseleave", function () {
    hoverRating = 0;                                      /* the preview disappears, the chosen rating stays */
    render();
  });

  group.addEventListener("click", function (event) {
    const star = event.target.closest(".star");
    if (!star) return;
    setRating(Number(star.dataset.value), false);
    star.classList.remove("pop");
    void star.offsetWidth;                                /* restart the pop animation */
    star.classList.add("pop");
  });

  /* Keyboard: arrows, Home and End behave like a native radio group */
  group.addEventListener("keydown", function (event) {
    if (!event.target.closest(".star")) return;
    const current = rating || 0;
    let next = null;

    if (event.key === "ArrowRight" || event.key === "ArrowUp")   next = Math.min(current + 1, max);
    if (event.key === "ArrowLeft"  || event.key === "ArrowDown") next = Math.max(current - 1, 1);
    if (event.key === "Home") next = 1;
    if (event.key === "End")  next = max;

    if (next !== null) {
      event.preventDefault();
      setRating(next, true);
    }
  });

  resetBtn.addEventListener("click", function () {
    setRating(0, false);
    stars[0].focus();                                     /* the Clear button becomes disabled, so move focus */
  });

  render();

  return {
    name: name,
    getRating: function () { return rating; },
    setRating: function (value) { setRating(value, false); },
    reset: function () { setRating(0, false); }
  };
}

/* ====================================================================
   PAGE: two independent widgets and a summary
   ==================================================================== */
const summaryEls = [document.getElementById("sum-0"), document.getElementById("sum-1")];
const averageEl = document.getElementById("sum-avg");
const widgets = [];

function updateSummary() {
  const ratings = widgets.map(function (w) { return w.getRating(); });

  ratings.forEach(function (value, index) {
    summaryEls[index].textContent = value === 0 ? "Not rated" : value + " / 5 (" + LABELS[value] + ")";
  });

  const given = ratings.filter(function (value) { return value > 0; });
  averageEl.textContent = given.length === 0
    ? "\u2013"
    : (given.reduce(function (sum, v) { return sum + v; }, 0) / given.length).toFixed(1) + " / 5";
}

Array.from(document.querySelectorAll(".rating")).forEach(function (root) {
  widgets.push(createStarRating(root, { onChange: updateSummary }));
});
updateSummary();
