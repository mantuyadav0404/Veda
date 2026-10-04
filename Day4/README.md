# Digital Clock

**Veda Technology Internship | Level 1 | Task 4 | Web Development Track**

A responsive digital clock that shows the current time as HH:MM:SS and updates every second, built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/digital-clock/`
- Repository: `https://github.com/your-username/digital-clock`

## Objective
Practise JavaScript Date objects, timers, DOM selection and DOM updates.

## Features
- Live time in HH:MM:SS format, updating automatically every second
- Leading zeros for single-digit values (for example `07:05:09`)
- Current date display (weekday, day, month, year)
- 24-hour and 12-hour (AM/PM) toggle
- Responsive design that scales from phones to desktops
- Accessible: `role="timer"`, keyboard-focusable button, reduced-motion support

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Layout, responsive text with `clamp()`, animation |
| JavaScript (ES6) | `Date`, `setInterval`, DOM selection and updates |

## Project Structure
```
digital-clock/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_4_Report.docx
```

## How It Works
1. `new Date()` returns the current date and time.
2. `getHours()`, `getMinutes()` and `getSeconds()` extract each value.
3. `padStart(2, "0")` adds a leading zero when needed.
4. `textContent` writes the values into the elements found with `getElementById`.
5. `setInterval(updateClock, 1000)` repeats the update every second.

## How to Run
1. Clone: `git clone https://github.com/your-username/digital-clock.git`
2. Open `index.html` in any modern browser (or use VS Code Live Server)

## Learning Outcomes
- Using the `Date` object to read the system time
- Scheduling repeated work with `setInterval`
- Selecting and updating elements through the DOM
- Formatting numbers with `padStart`
- Handling events with `addEventListener`

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
