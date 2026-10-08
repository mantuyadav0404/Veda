# Random Quote Generator

**Veda Technology Internship | Level 1 | Task 8 | Web Development Track**

An application that displays a random quote and its author each time the user clicks a button. Built with HTML5, CSS3 and vanilla JavaScript, with 15 quotes stored as objects in an array.

## Live Demo
- GitHub Pages: `https://your-username.github.io/random-quote-generator/`
- Repository: `https://github.com/your-username/random-quote-generator`

## Objective
Practise arrays, random numbers, event handling and DOM manipulation.

## Features
- 15 quotes stored in JavaScript as `{ text, author }` objects
- **New Quote** button that picks a quote with `Math.random()`
- Quote and author display with a smooth fade transition
- **No immediate repeats**: the same quote never appears twice in a row
- **Copy** button (Clipboard API with a fallback)
- **Share** button (native share sheet, or a pre-filled post on X as a fallback)
- Counter showing how many quotes have been viewed
- Responsive, keyboard accessible, screen-reader friendly (`aria-live`)

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Structure with `figure`, `blockquote` and `figcaption` |
| CSS3 | Layout, transitions, responsive buttons |
| JavaScript (ES6) | Arrays, random selection, events, async clipboard and share APIs |

## Project Structure
```
random-quote-generator/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_8_Report.docx
```

## How It Works
**Storing quotes**
```js
const quotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  // ...14 more
];
```
**Random pick without repeats**
```js
function getRandomIndex(length, previous) {
  if (length <= 1) return 0;
  if (previous < 0) return Math.floor(Math.random() * length);
  let index = Math.floor(Math.random() * (length - 1));
  if (index >= previous) index += 1;   // skip the quote just shown
  return index;
}
```
Choosing from `length - 1` positions and shifting past the previous index keeps every other quote equally likely and avoids retry loops.

## Test Cases
| Test | Expected result |
|---|---|
| Click New Quote | A quote and author appear |
| Click 1,000 times | No quote appears twice in a row |
| Click Copy | Quote text is on the clipboard and a message appears |
| Click Share | Share sheet opens (or an X post window) |
| Before the first quote | Copy and Share are disabled |

## How to Run
1. Clone: `git clone https://github.com/your-username/random-quote-generator.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Adding More Quotes
Add another `{ text: "...", author: "..." }` object to the `quotes` array in `script.js`. No other change is needed.

## Learning Outcomes
- Storing structured data as an array of objects
- Using `Math.random()` and `Math.floor()` to select items
- Avoiding consecutive duplicates with simple index logic
- Handling events and updating the DOM
- Using the Clipboard and Web Share APIs with fallbacks

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
