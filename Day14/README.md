# Color Palette Generator

**Veda Technology Internship | Level 1 | Task 14 | Web Development Track**

A tool that generates a random set of hex colour swatches. Clicking a swatch copies its hex code to the clipboard and shows a short confirmation. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/color-palette-generator/`
- Repository: `https://github.com/your-username/color-palette-generator`

## Objective
Practise random value generation, the Clipboard API and DOM rendering.

## Features
- **Generate new palette** button producing 5 random swatches with hex codes (the task asks for at least 5)
- **Click to copy**: copies the hex code using the Clipboard API, with a fallback for older browsers
- **Confirmation feedback**: a toast message (for example `Copied #A15EE9`) and a "Copied!" label on the swatch
- **Lock** a swatch to keep it when generating a new palette
- **Copy all hex codes** as a comma-separated list
- Press the **Space bar** to generate a new palette
- Text colour (black or white) chosen automatically for readable contrast on every swatch
- Responsive: five columns on desktop, stacked rows on phones
- Accessible: real buttons, descriptive `aria-label`s, `aria-pressed` on lock buttons, a live status region, visible focus rings

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Page structure, empty list filled by JavaScript |
| CSS3 | Grid layout, transitions, toast, responsive design |
| JavaScript (ES6) | `Math.random`, Clipboard API, DOM creation and updates |

## Project Structure
```
color-palette-generator/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_14_Report.docx
```

## How It Works
**Random hex colour**
```js
function randomHex() {
  const number = Math.floor(Math.random() * 0x1000000);   // 0 to 16,777,215
  return "#" + number.toString(16).padStart(6, "0").toUpperCase();
}
```
A hex colour is a number between `0` and `0xFFFFFF`. `toString(16)` converts it to base 16 and `padStart(6, "0")` keeps six digits, so a small number such as 5 becomes `#000005`.

**Copy to clipboard**
```js
await navigator.clipboard.writeText(hex);
```
The Clipboard API works on HTTPS pages and `localhost`. When it is not available, a hidden textarea with `document.execCommand("copy")` is used instead.

**Readable text colour**: the relative luminance of the background is calculated, and black or white text is chosen, whichever contrasts better.

**Rendering**: swatches are created once with `createElement`, then `render()` updates colours and text. One click listener on the list (event delegation) handles every swatch and lock button.

## Test Cases
| Test | Expected result |
|---|---|
| 200,000 generated colours | All match `#RRGGBB`; `Math.random() = 0` gives `#000000`, the maximum gives `#FFFFFF` |
| Click a swatch | Hex code is on the clipboard; toast and "Copied!" label appear, then disappear |
| Lock a swatch, then generate | Locked colour stays; the others change |
| All swatches locked, then generate | Palette unchanged, with a message |
| Space bar | New palette (does not trigger while a button has focus) |
| Copy all | Clipboard holds all five hex codes |
| Clipboard API unavailable | Fallback still copies the code |
| Phone width (360 px) | One column, no horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/color-palette-generator.git`
2. Open `index.html` in a browser (copying works best on the GitHub Pages link or `localhost`)

## Learning Outcomes
- Generating random numbers and converting them to hex strings
- Using the asynchronous Clipboard API with a fallback
- Creating and updating DOM elements from data
- Giving users clear feedback after an action
- Choosing readable text colours with a luminance formula

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
