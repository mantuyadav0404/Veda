# Temperature Converter

**Veda Technology Internship | Level 1 | Task 5 | Web Development Track**

A live temperature converter between Celsius, Fahrenheit and Kelvin, built with HTML5, CSS3 and vanilla JavaScript. Type in any field and the other two update instantly, with validation for invalid input.

## Live Demo
- GitHub Pages: `https://your-username.github.io/temperature-converter/`
- Repository: `https://github.com/your-username/temperature-converter`

## Objective
Practise form inputs, JavaScript calculations, functions and DOM updates.

## Features
- Three linked inputs: Celsius, Fahrenheit and Kelvin
- Live conversion using the `input` event, with no submit button needed
- Separate function for every conversion formula
- Validation for empty, non-numeric and malformed values
- Absolute zero check (below -273.15 °C, -459.67 °F or 0 K is rejected)
- Results rounded to 2 decimal places
- Inline error messages with `aria-live`, so screen readers announce them
- Responsive and keyboard friendly

## Conversion Formulas
| From | To Celsius | To Fahrenheit | To Kelvin |
|---|---|---|---|
| Celsius | - | (C × 9/5) + 32 | C + 273.15 |
| Fahrenheit | (F − 32) × 5/9 | - | (F − 32) × 5/9 + 273.15 |
| Kelvin | K − 273.15 | (K − 273.15) × 9/5 + 32 | - |

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Form structure and labels |
| CSS3 | Layout, focus and error states |
| JavaScript (ES6) | Functions, regex validation, DOM updates, events |

## Project Structure
```
temperature-converter/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_5_Report.docx
```

## How It Works
1. An `input` event listener on each field calls `handleInput(unit)`.
2. The value is validated with a regular expression and an absolute zero check.
3. If valid, `convert()` calls the matching conversion functions.
4. Results are rounded and written to the other two fields.
5. If invalid, the field is marked with `aria-invalid` and a message is shown.

## How to Run
1. Clone: `git clone https://github.com/your-username/temperature-converter.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Test Cases
| Input | Expected result |
|---|---|
| 0 °C | 32 °F, 273.15 K |
| 100 °C | 212 °F, 373.15 K |
| 32 °F | 0 °C, 273.15 K |
| 0 K | -273.15 °C, -459.67 °F |
| -300 °C | Error: below absolute zero |
| abc | Error: enter a valid number |
| (empty) | Other fields cleared |

## Learning Outcomes
- Writing small, reusable functions for calculations
- Handling the `input` event for live updates
- Validating numeric input with regular expressions
- Updating the DOM and accessibility attributes from JavaScript

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
