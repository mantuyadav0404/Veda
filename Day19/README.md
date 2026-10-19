# Star Rating Widget

**Veda Technology Internship | Level 1 | Task 19 | Web Development Track**

An interactive 5-star rating component. Users hover to preview a rating, click to choose it, and see the current rating displayed. Built with HTML5, CSS3 and vanilla JavaScript, with the selected rating and the hover preview kept as two separate pieces of state.

## Live Demo
- GitHub Pages: `https://your-username.github.io/star-rating/`
- Repository: `https://github.com/your-username/star-rating`

## Objective
Practise DOM events, dynamic class toggling and simple UI state.

## Features
- **5 clickable stars** (inline SVG, so they stay sharp at any size)
- **Hover preview**: stars light up in a lighter gold while the pointer is over them
- **Selected rating stored in state**, separate from the hover state
- **Display of the current rating**: for example `4 / 5 - Very good`, or `Preview: 2 / 5 - Fair` while hovering
- **Reset** with a Clear rating button
- **Reusable**: `createStarRating(root)` builds a widget, and each widget keeps its own state, so the page can hold several (this demo has two plus a summary and average)
- **Keyboard support** like a native radio group: Arrow keys, Home and End, with a single Tab stop per widget
- **Accessible**: `role="radiogroup"` and `role="radio"`, `aria-checked`, a polite status message for chosen ratings (but not hover previews), visible focus rings
- Responsive, touch friendly (48 px targets) and respects reduced-motion settings

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Containers for the widgets, summary list |
| CSS3 | Star styling, filled, preview and focus states, responsive design |
| JavaScript (ES6) | State, `data-` attributes, `classList.toggle`, event delegation |

## Project Structure
```
star-rating/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_19_Report.docx
```

## How It Works
**Two separate pieces of state**
```js
let rating = 0;        // chosen by clicking or keys
let hoverRating = 0;   // changes only while the pointer is over a star
```
**The screen is drawn from both**
```js
const shown = hoverRating || rating;          // hover wins while it is set
star.classList.toggle("filled", value <= shown);
group.classList.toggle("hovering", hoverRating > 0);   // lighter colour for a preview
```
- `mouseover` sets `hoverRating`; `mouseleave` resets it to 0, so the chosen rating comes back.
- `click` sets `rating` and clears `hoverRating`.
- Because the two values never overwrite each other, hovering never changes the saved rating.

**Data attributes:** each star has `data-value="1"` to `"5"`, read with `star.dataset.value`. The same click handler works for every star, with no per-star code.

**Resetting:** `setRating(0)` clears the rating, the stars, the text and the summary. The Clear rating button calls it and moves focus to the first star.

## Test Cases
| Test | Expected result |
|---|---|
| Hover star 4 with nothing selected | Stars 1 to 4 show a light preview; no rating is saved |
| Move the pointer away | Stars return to empty |
| Click star 3 | 3 stars solid gold; text `3 / 5 - Good` |
| Selected 3, hover star 5 | 5 stars show as a preview; saved rating is still 3 |
| Selected 3, hover star 1 | Only star 1 is lit; the pointer leaving restores 3 |
| Click Clear rating | No stars, `No rating yet`, button disabled |
| Arrow Right / Left / Home / End | Changes the rating and moves focus; stays within 1 to 5 |
| Rate two widgets | Each keeps its own rating; the summary shows both and the average |
| Width 320 px | No horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/star-rating.git`
2. Open `index.html` in a browser

## Using It on Another Page
Add `<div class="rating" data-label="Your label"></div>` and call `createStarRating(element, { onChange: function (value) { ... } })`.

## Learning Outcomes
- Keeping selected state separate from temporary hover state
- Storing values in `data-` attributes
- Toggling classes with `classList.toggle`
- Event delegation and keyboard handling for custom controls
- Building a reusable component with its own state

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
