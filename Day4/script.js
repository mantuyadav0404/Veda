"use strict";

/* ---------- DOM selection ---------- */
const hoursEl   = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const periodEl  = document.getElementById("period");
const dateEl    = document.getElementById("date");
const toggleBtn = document.getElementById("format-toggle");

let is24Hour = true;

/* Add a leading zero to single-digit numbers: 7 -> "07" */
function pad(value) {
  return String(value).padStart(2, "0");
}

/* Read the current time and update the page */
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (!is24Hour) {
    periodEl.textContent = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;          // 0 -> 12, 13 -> 1
  }

  hoursEl.textContent   = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  dateEl.textContent = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

/* Switch between 24-hour and 12-hour display */
toggleBtn.addEventListener("click", function () {
  is24Hour = !is24Hour;
  periodEl.hidden = is24Hour;
  toggleBtn.setAttribute("aria-pressed", String(!is24Hour));
  toggleBtn.textContent = is24Hour ? "Switch to 12-hour format" : "Switch to 24-hour format";
  updateClock();                        // refresh immediately, no 1-second wait
});

/* Show the time at once, then refresh every 1000 ms */
updateClock();
setInterval(updateClock, 1000);
