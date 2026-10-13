"use strict";

/* ====================================================================
   CONFIGURATION: change the event and the target date here
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour time, read in the visitor's local time)
   ==================================================================== */
const CONFIG = {
  eventName: "New Year 2027",
  targetDate: "2027-01-01T00:00:00"
};

/* ---------- DOM selection ---------- */
const cardEl      = document.getElementById("card");
const nameEl      = document.getElementById("event-name");
const targetTextEl = document.getElementById("target-text");
const daysEl      = document.getElementById("days");
const hoursEl     = document.getElementById("hours");
const minutesEl   = document.getElementById("minutes");
const secondsEl   = document.getElementById("seconds");
const messageEl   = document.getElementById("message");
const form        = document.getElementById("custom-form");
const nameInput   = document.getElementById("custom-name");
const dateInput   = document.getElementById("custom-date");
const formErrorEl = document.getElementById("form-error");

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR   = 60 * MS_MINUTE;
const MS_DAY    = 24 * MS_HOUR;

let timerId = null;      /* id returned by setInterval, so it can be cleared */
let targetTime = null;   /* target as a timestamp in milliseconds */
let eventName = "";

/* ---------- Date math ---------- */
/* Difference between two moments, split into days, hours, minutes, seconds.
   The remaining time is rounded UP to whole seconds (Math.ceil), so the display
   shows 00:00:00:00 at exactly the moment the countdown ends, not up to a second earlier. */
function getTimeRemaining(target, now) {
  const total = target - now;               /* subtracting Date values gives milliseconds */
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.ceil(total / MS_SECOND);
  return {
    total: total,
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60
  };
}

/* 7 -> "07" (days can have more than two digits, which is fine) */
function pad(value) {
  return String(value).padStart(2, "0");
}

/* ---------- DOM updates ---------- */
function render(time) {
  daysEl.textContent    = pad(time.days);
  hoursEl.textContent   = pad(time.hours);
  minutesEl.textContent = pad(time.minutes);
  secondsEl.textContent = pad(time.seconds);
}

function showMessage(text, state) {
  cardEl.classList.remove("done", "passed");
  if (state) cardEl.classList.add(state);
  messageEl.textContent = text;
  messageEl.hidden = !text;
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);                 /* stop the repeating updates */
    timerId = null;
  }
}

/* Runs once per second */
function tick() {
  /* Recalculate from the real clock every time, so the display never drifts */
  const time = getTimeRemaining(targetTime, Date.now());
  render(time);

  if (time.total <= 0) {
    stopTimer();                            /* no need to keep running */
    showMessage("\uD83C\uDF89 It's time! " + eventName + " has arrived.", "done");
  }
}

/* ---------- Start a countdown ---------- */
function startCountdown(name, dateValue) {
  stopTimer();                              /* never leave two intervals running */

  const target = new Date(dateValue);
  if (isNaN(target.getTime())) {            /* invalid date string */
    return false;
  }

  eventName  = name;
  targetTime = target.getTime();
  nameEl.textContent = eventName;
  targetTextEl.textContent = "Target: " + target.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
  document.title = eventName + " Countdown | Mantu Yadav";
  showMessage("", null);

  /* Handle a date that has already passed */
  if (targetTime - Date.now() <= 0) {
    render(getTimeRemaining(targetTime, Date.now()));
    showMessage("This date has already passed. Choose a future date to start a countdown.", "passed");
    return true;
  }

  tick();                                   /* show the time immediately */
  timerId = setInterval(tick, MS_SECOND);   /* then update every second */
  return true;
}

/* ---------- Custom countdown form ---------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  formErrorEl.textContent = "";

  if (dateInput.value === "") {
    formErrorEl.textContent = "Please choose a date and time.";
    dateInput.focus();
    return;
  }
  const name = nameInput.value.trim() || "Custom countdown";
  if (!startCountdown(name, dateInput.value)) {
    formErrorEl.textContent = "That date is not valid. Please try again.";
  }
});

/* ---------- Start with the configured date ---------- */
if (!startCountdown(CONFIG.eventName, CONFIG.targetDate)) {
  nameEl.textContent = "Invalid target date";
  showMessage("Check CONFIG.targetDate in script.js. Use the format YYYY-MM-DDTHH:MM:SS.", "passed");
}
