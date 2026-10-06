# BMI Calculator

**Veda Technology Internship | Level 1 | Task 6 | Web Development Track**

A BMI calculator where users enter height (cm) and weight (kg) and receive their Body Mass Index, WHO category, a colour-coded scale and their healthy weight range. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/bmi-calculator/`
- Repository: `https://github.com/your-username/bmi-calculator`

## Objective
Practise form handling, calculations, validation and conditional output.

## Features
- Height and weight input fields with labelled units
- BMI calculation: `weight (kg) / height (m)²`, rounded to 1 decimal place
- WHO category display using `if / else` conditions
- Validation for empty, non-numeric, zero, negative and unrealistic values
- Inline error messages with `aria-invalid` and `role="alert"`
- Colour-coded scale with a marker showing where the BMI falls
- Healthy weight range for the entered height
- Reset button and responsive layout

## BMI Categories (WHO, adults)
| BMI | Category |
|---|---|
| Below 18.5 | Underweight |
| 18.5 – 24.9 | Normal weight |
| 25.0 – 29.9 | Overweight |
| 30.0 and above | Obese |

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Form and result structure |
| CSS3 | Layout, colours, error states, scale bar |
| JavaScript (ES6) | Validation, calculation, conditionals, DOM updates |

## Project Structure
```
bmi-calculator/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_6_Report.docx
```

## How It Works
1. The `submit` event is intercepted with `preventDefault()`.
2. `validate()` checks each value and returns a number or an error message.
3. `calculateBMI()` applies the formula.
4. `getCategory()` uses `if / else` conditions to choose the WHO category.
5. The result, category colour, advice and scale marker are written to the DOM.

## Validation Rules
| Input | Result |
|---|---|
| Empty | "Please enter your height/weight." |
| Letters or symbols | "Enter numbers only..." |
| 0 or negative | "Value must be greater than zero." |
| Height outside 50-272 cm or weight outside 2-650 kg | Range message |

## Test Cases
| Height | Weight | BMI | Category |
|---|---|---|---|
| 170 cm | 50 kg | 17.3 | Underweight |
| 175 cm | 70 kg | 22.9 | Normal weight |
| 170 cm | 80 kg | 27.7 | Overweight |
| 165 cm | 95 kg | 34.9 | Obese |

## How to Run
1. Clone: `git clone https://github.com/your-username/bmi-calculator.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Disclaimer
BMI is a screening tool and not a medical diagnosis. It does not account for muscle mass, age or body composition.

## Learning Outcomes
- Handling form submission and preventing default behaviour
- Validating input before calculating
- Using conditional statements to produce different output
- Updating the DOM and styles dynamically

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
