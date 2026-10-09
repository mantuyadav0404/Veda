# Image Gallery

**Veda Technology Internship | Level 1 | Task 9 | Web Development Track**

A responsive image gallery with a lightbox preview, built with HTML5, CSS Grid and vanilla JavaScript. Nine images are shown in a grid that adapts to any screen size. Selecting an image opens a larger preview with a close button, previous/next controls and keyboard support.

## Live Demo
- GitHub Pages: `https://your-username.github.io/image-gallery/`
- Repository: `https://github.com/your-username/image-gallery`

## Objective
Practise CSS Grid, responsive layouts, JavaScript click events and basic UI interaction.

## Features
- Responsive grid built with `repeat(auto-fill, minmax(260px, 1fr))`, with no media query needed for the column count
- 9 images (the task asks for at least 8), each with descriptive `alt` text
- Lightbox opened by clicking or pressing Enter on any image
- **Close button**, Esc key, or click on the dark area to close
- Previous / next buttons, Left and Right arrow keys, swipe on touch screens
- Image title and position counter (for example `5 / 9`)
- Hover zoom and caption on thumbnails
- Accessible: native `<dialog>` (focus trap and Esc built in), real `<button>` thumbnails, focus returns to the last viewed thumbnail, page scroll locked while open
- `loading="lazy"` and `width` / `height` attributes for faster loading and no layout shift

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure, `<dialog>` for the lightbox |
| CSS3 | Grid layout, transitions, responsive design |
| JavaScript (ES6) | Click and keyboard events, DOM updates |

## Project Structure
```
image-gallery/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── mountain-sunrise.svg
│   ├── ocean-sunset.svg
│   └── ... (9 images)
├── README.md
└── Task_9_Report.docx
```

## How It Works
1. The gallery is an `<ul>` of `<button class="thumb">` elements, each wrapping an `<img>`.
2. `script.js` reads the `src`, `alt` and title from the page, so the HTML is the single source of truth.
3. Clicking a thumbnail calls `openLightbox(index)`, which fills the preview and runs `dialog.showModal()`.
4. `show(index)` uses `(index + length) % length`, so next and previous wrap around.
5. A `close` event handler unlocks scrolling and returns focus, whichever way the preview was closed.

## Image Credits
The nine landscape images are original vector illustrations created for this project, so no attribution is required. To use real photos (for example from [Unsplash](https://unsplash.com)), download them into `images/`, then update the `src`, `alt` and `data-title` of each thumbnail in `index.html`. Add the photographer credits to this section.

## How to Run
1. Clone: `git clone https://github.com/your-username/image-gallery.git`
2. Open `index.html` in a browser (or use VS Code Live Server)

## Test Cases
| Test | Expected result |
|---|---|
| Click an image | Lightbox opens with that image, title and counter |
| Click the close button, press Esc, or click the dark area | Lightbox closes and focus returns to the thumbnail |
| Press Right arrow on the last image | Wraps to the first image |
| Resize from desktop to phone | Columns reduce smoothly, no horizontal scroll |
| Tab through the page | Every thumbnail and control is reachable with a visible focus ring |

## Learning Outcomes
- Building responsive layouts with CSS Grid (`auto-fill`, `minmax`, `aspect-ratio`)
- Handling click, keyboard and touch events
- Showing and hiding a modal with the native `<dialog>` element
- Writing meaningful `alt` text and keyboard-accessible UI

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
