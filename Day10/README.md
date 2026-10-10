# FAQ Accordion

**Veda Technology Internship | Level 1 | Task 10 | Web Development Track**

An FAQ section where clicking a question expands or collapses its answer. Built with HTML5, CSS3 and vanilla JavaScript, using `classList.toggle` for the active state and real `<button>` elements for the questions.

## Live Demo
- GitHub Pages: `https://your-username.github.io/faq-accordion/`
- Repository: `https://github.com/your-username/faq-accordion`

## Objective
Practise DOM events, class manipulation and simple interactive UI components.

## Features
- **10 FAQ questions** about web development basics (the task asks for at least 8)
- Expandable and collapsible answers with a smooth height animation
- **Clear active state**: highlighted card, amber accent bar, and a plus icon that turns into a minus
- **Open-answers decision built in**: a switch lets users choose between one open answer at a time (default) or multiple open answers, plus Expand all / Collapse all buttons
- Keyboard support: Tab, Enter or Space to toggle, and Up / Down / Home / End to move between questions
- Responsive layout that works from phones to desktops
- Accessible: `aria-expanded`, `aria-controls`, `role="region"`, visible focus rings, reduced-motion support

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic list of headings and buttons |
| CSS3 | Grid-based height animation, active state, responsive design |
| JavaScript (ES6) | `classList.toggle`, event delegation, ARIA updates |

## Project Structure
```
faq-accordion/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_10_Report.docx
```

## How It Works
```js
function setOpen(item, open) {
  item.classList.toggle("active", open);
  item.querySelector(".faq-question").setAttribute("aria-expanded", String(open));
}
```
1. Each question is a `<button>` inside a heading, so it is focusable and works with the keyboard by default.
2. One click listener on the list (event delegation) finds the clicked question with `closest()`.
3. `classList.toggle("active", open)` adds or removes the active class; CSS does the rest.
4. In single-open mode, `closeOthers()` closes every other answer first.
5. The answer height animates from `0fr` to `1fr` using CSS Grid, so no fixed heights are needed.
6. Collapsed answers get `visibility: hidden`, so they cannot be reached by keyboard or screen readers.

## Test Cases
| Test | Expected result |
|---|---|
| Click a question | Its answer opens and `aria-expanded` becomes `true` |
| Click it again | The answer closes |
| Open a second question (single mode) | The first one closes |
| Switch on "Keep multiple answers open" | Several answers stay open |
| Expand all / Collapse all | All answers open or close |
| Switch back to single mode | Only the most recently opened answer stays open |
| Press Down, Up, Home, End on a question | Focus moves between questions |
| Phone width (390 px) | No horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/faq-accordion.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Customising the Questions
Copy one `<li class="faq-item">` block in `index.html`, then change its question, answer and the matching `id`, `aria-controls` and `aria-labelledby` values. No JavaScript change is needed.

## Learning Outcomes
- Using `classList.toggle` and `addEventListener`
- Event delegation with `closest()`
- Keeping ARIA attributes in sync with visual state
- Animating height with CSS Grid instead of JavaScript
- Building keyboard-accessible interactive components

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
