# Recall — Flashcard Study Deck
**Veda Technology Internship · Task 28 · Web Development Track**

A responsive flashcard study app built with vanilla HTML, CSS, and JavaScript. It uses a fixed set of question-and-answer cards, a 3D flip animation, next/previous navigation, deck switching, shuffle, and a live progress indicator.

## Features
- Three built-in decks: Web Development (12 cards), JavaScript Basics (10 cards), and Git & GitHub (8 cards).
- 3D card flip animation using CSS transforms.
- Previous and next navigation with boundary handling.
- Progress bar and reviewed-card/session counters.
- Shuffle cards for a fresh practice order.
- Keyboard support: Space to flip; Left/Right arrows to navigate.
- Responsive layout for desktop, tablet, and mobile.
- Accessible labels, focus styles, live status toast, and reduced-motion support.
- No framework, build process, external dependency, or API key required.

## Run locally
1. Download or clone this project.
2. Open `index.html` in a modern browser.
3. Start reviewing cards. No server is required.

**Recommended:** Open the project folder in VS Code. You can use the Live Server extension if you prefer a local development server.

## Project structure
```text
flashcard-app/
├── index.html
├── README.md
├── linkedin_post.txt
└── Task_Report.docx
```

## How it works
- The `decks` object stores each deck as an array of card objects (`q`, `a`, and `d`).
- `render()` updates the visible question, answer, counters, navigation states, and progress UI.
- `flipCard()` toggles the `.flipped` class and records the card as reviewed.
- `goTo()` moves to a valid card index and resets the flip state.
- `shuffleCards()` randomizes the active deck with the Fisher–Yates shuffle.
- CSS `transform: rotateY(180deg)` and `backface-visibility` create the flip effect.

## Customization
Add or edit cards in the `decks` object inside the `<script>` section. Each card should follow this shape:
```js
{ q: "Your question?", a: "Short answer", d: "Additional explanation." }
```
To add another deck, add a new property to `decks` and create a matching `.deck-item` button with the same `data-deck` key.

## Current limitations
- Progress is session-only and resets when the page is reloaded or a deck is changed.
- Cards are fixed in the source code; there is no add/edit card form or backend.
- Reviewed progress tracks card positions for the current shuffled order, not a persistent card ID.

## Testing checklist
- [ ] App loads without console errors.
- [ ] Flip works by click, Enter, and Space.
- [ ] Previous/next buttons navigate correctly and disable at boundaries.
- [ ] Progress updates after a card is flipped.
- [ ] Shuffle changes the order and resets the session.
- [ ] Each deck displays the correct cards and title.
- [ ] Layout remains usable on mobile and desktop.

## Technologies
HTML5 · CSS3 (3D transforms, responsive media queries, transitions) · JavaScript (arrays, objects, state, events, DOM manipulation)
