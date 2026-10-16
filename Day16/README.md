# Simple To-Do List (In-Memory)

**Veda Technology Internship | Level 1 | Task 16 | Web Development Track**

A basic to-do list where users can add and remove tasks without persistence. Tasks live in a JavaScript array, the list is rendered from that array, and one event listener (event delegation) handles every Delete button. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/todo-list/`
- Repository: `https://github.com/your-username/todo-list`

## Objective
Practise array manipulation, DOM rendering and event delegation.

## Features
- **Input field** to add tasks (button or Enter key)
- **List rendered from an array**, rebuilt after every change
- **Delete button on every task**, handled with a single delegated listener
- Mark tasks as complete, with a live counter ("3 tasks left", "All done!")
- Clear completed tasks in one click
- Validation: empty or whitespace-only tasks and case-insensitive duplicates are rejected with a clear message
- Friendly empty state
- Safe rendering: user text is inserted with `textContent`, so it can never run as HTML or script
- Accessible: labelled input, `aria-label` on every Delete button, screen-reader announcements, and sensible focus after each action
- Responsive layout
- **No persistence by design**: tasks are lost on refresh

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Form, list container, empty state |
| CSS3 | Card layout, custom checkbox, states, responsive design |
| JavaScript (ES6) | Array methods, DOM creation, event delegation |

## Project Structure
```
todo-list/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_16_Report.docx
```

## How It Works
**State is an array of objects**
```js
let tasks = [{ id: 1, text: "Learn event delegation", done: false }];
```
Each task has a unique `id`. Array positions change after a removal, ids do not, so the right task is always found.

**Removing an item from an array**
```js
tasks = tasks.filter(function (task) { return task.id !== id; });
```
`filter()` returns a new array without the matching task. (`splice(index, 1)` removes in place and also works.)

**Event delegation**
```js
listEl.addEventListener("click", function (event) {
  const button = event.target.closest(".delete");
  if (!button) return;
  const id = Number(button.closest(".task").dataset.id);
  removeTask(id);
  render();
});
```
Events bubble up from the clicked button to the `<ul>`. One listener on the parent serves all tasks, including tasks added later, and no listeners need to be added or removed when the list changes.

**Re-rendering**: `render()` clears the list and rebuilds it from the array. The array is the single source of truth, so the screen can never disagree with the data.

## Test Cases
| Test | Expected result |
|---|---|
| Add a task | Appears in the list; input is cleared and focused |
| Add an empty or spaces-only task | Error message; nothing added |
| Add the same task again (any letter case) | "Already on your list" message |
| Delete the middle task | Only that task is removed; the others keep their order |
| Delete a task added after page load | Works (event delegation) |
| Tick a task | Strike-through; counter updates |
| Clear completed | Only completed tasks are removed |
| Delete every task | Empty state returns |
| Type `<img src=x onerror=alert(1)>` as a task | Shown as plain text; nothing runs |
| 30 tasks, then 2 deletions | 28 tasks with unique ids |
| 100-character word at 360 px width | No horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/todo-list.git`
2. Open `index.html` in a browser

## Learning Outcomes
- Adding, finding, filtering and removing items in an array
- Rendering the page from state
- Event delegation with `closest()` and `data-` attributes
- Preventing XSS by using `textContent`
- Managing keyboard focus after DOM changes

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
