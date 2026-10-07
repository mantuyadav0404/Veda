# Basic Calculator

**Veda Technology Internship | Level 1 | Task 7 | Web Development Track**

A responsive calculator supporting addition, subtraction, multiplication, division, decimal values, clear and equals. Built with HTML5, CSS3 and vanilla JavaScript, with no use of `eval()`.

## Live Demo
- GitHub Pages: `https://your-username.github.io/basic-calculator/`
- Repository: `https://github.com/your-username/basic-calculator`

## Objective
Practise JavaScript event handling, arithmetic operations and DOM manipulation.

## Features
- Number buttons (0-9), decimal point and four operators (+, −, ×, ÷)
- Clear (C), delete last digit (DEL) and equals (=)
- Chained calculations (for example `2 + 3 × 4` evaluates step by step)
- Divide-by-zero handling with a clear message
- Floating-point fix: `0.1 + 0.2` shows `0.3`
- Only one decimal point per number, and a 12-digit limit
- History line showing the pending operation
- Keyboard support: 0-9, `+ - * /`, Enter, Backspace, Esc
- Responsive layout built with CSS Grid, accessible button labels and focus styles

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Display and button structure |
| CSS3 | Grid layout, states, responsive sizing |
| JavaScript (ES6) | State, arithmetic, event delegation, DOM updates |

## Project Structure
```
basic-calculator/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_7_Report.docx
```

## How It Works
**State object** tracks the calculator at all times:
```js
const state = {
  currentValue: "0",   // number being typed
  previousValue: null, // first operand
  operator: null,      // + - × ÷
  overwrite: false,    // next digit replaces the display
  hasError: false      // divide-by-zero flag
};
```
1. A single click listener on the button container (event delegation) reads each button's `data-` attributes.
2. Digits and the decimal point build `currentValue` as a string.
3. Choosing an operator saves `currentValue` as `previousValue`.
4. Equals calls `compute(a, b, operator)`, a `switch` statement with no `eval()`.
5. If the divisor is `0`, `compute` returns `null` and the calculator shows "Cannot divide by zero" instead of `Infinity`.

## Test Cases
| Input | Result |
|---|---|
| 8 + 5 = | 13 |
| 9 − 12 = | -3 |
| 6 × 7 = | 42 |
| 15 ÷ 4 = | 3.75 |
| 0.1 + 0.2 = | 0.3 |
| 5 ÷ 0 = | Cannot divide by zero |
| 2 + 3 × 4 = | 20 (left to right) |
| 1.2.3 | Second decimal point ignored |

## How to Run
1. Clone: `git clone https://github.com/your-username/basic-calculator.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Learning Outcomes
- Managing application state with a JavaScript object
- Event delegation and keyboard events
- Writing arithmetic logic without `eval()`
- Handling edge cases such as divide-by-zero and floating-point errors
- Building button layouts with CSS Grid

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
