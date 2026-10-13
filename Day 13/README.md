# Countdown Timer

**Veda Technology Internship | Level 1 | Task 13 | Web Development Track**

A countdown timer that counts down to a specific date and shows the days, hours, minutes and seconds remaining. It updates every second, shows a message when the countdown ends, and handles dates that have already passed. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/countdown-timer/`
- Repository: `https://github.com/your-username/countdown-timer`

## Objective
Practise JavaScript Date math, `setInterval` and DOM updates.

## Features
- Live countdown (days, hours, minutes, seconds) updating every second
- **Target date configurable in code** through one `CONFIG` object at the top of `script.js`
- **Message when the countdown reaches zero**, with a highlighted finished state
- **Interval cleared** when the countdown ends, so nothing keeps running
- **Already-passed dates handled** with a clear message instead of negative numbers
- Optional form to set a custom event name and date (also validated)
- No drift: the remaining time is recalculated from the real clock on every tick
- Responsive tiles (four columns, two on small screens) and keyboard-friendly form

## Configuring the Target Date
Open `script.js` and edit the `CONFIG` object:
```js
const CONFIG = {
  eventName: "New Year 2027",
  targetDate: "2027-01-01T00:00:00"   // YYYY-MM-DDTHH:MM:SS, in the visitor's local time
};
```

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Structure, `role="timer"`, `datetime-local` input |
| CSS3 | Grid tiles, finished and passed states, responsive layout |
| JavaScript (ES6) | `Date` math, `setInterval` / `clearInterval`, DOM updates |

## Project Structure
```
countdown-timer/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_13_Report.docx
```

## How It Works
```js
function getTimeRemaining(target, now) {
  const total = target - now;                     // milliseconds
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.ceil(total / 1000);
  return {
    total,
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60
  };
}
```
1. Subtracting two `Date` values gives the difference in milliseconds.
2. The milliseconds are converted into days, hours, minutes and seconds with division, `Math.floor` and the remainder operator `%`.
3. `setInterval(tick, 1000)` calls `tick()` every second, which recalculates and redraws the numbers.
4. When the remaining time reaches zero, `clearInterval()` stops the timer and the finished message appears.
5. If the target is already in the past when the page loads, no interval is started and a "date has already passed" message is shown.

## Test Cases
| Test | Expected result |
|---|---|
| Target 1 day 2 h 3 min 4 s away | Shows `01 : 02 : 03 : 04` |
| 13 Oct 2026, 10:00 to 1 Jan 2027 | Shows 79 days, 14 hours |
| Countdown reaches zero | Shows `00:00:00:00`, the message appears and the interval stops |
| Target already in the past | Zeros and an "already passed" message, with no interval running |
| Custom form with empty date | Error message, no change |
| Start a new countdown after the old one ended | Works, with only one interval active |
| Phone width (360 px) | Two-column tiles, no horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/countdown-timer.git`
2. Open `index.html` in a browser

## Learning Outcomes
- Creating and subtracting `Date` objects
- Converting milliseconds into time units
- Using `setInterval` and `clearInterval` correctly
- Handling edge cases: ended and already-passed countdowns
- Updating the DOM and element state with classes

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
