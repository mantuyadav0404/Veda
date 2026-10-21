# Responsive Navbar with Hamburger Menu

**Veda Technology Internship | Level 1 | Task 21 | Web Development Track**

A responsive navigation bar that is a horizontal bar on desktop and collapses into a hamburger button with a slide-in menu on small screens. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/responsive-navbar/`
- Repository: `https://github.com/your-username/responsive-navbar`

## Objective
Practise responsive design, media queries and toggle interactions.

## Features
- **Horizontal navbar on desktop**: brand on the left, links and a call-to-action on the right (Flexbox)
- **Hamburger icon and slide-in menu on mobile** (769 px and below is desktop, 768 px and below is mobile)
- **Smooth open and close transition**: the panel slides in, the overlay fades, and the three bars morph into an X
- Closes with the X button, the dark overlay, the Esc key, a link click, or by resizing to desktop width
- Sticky header that gains a shadow after scrolling, and highlights the section being viewed
- **Accessible**: `aria-expanded`, `aria-controls` and a label that changes between "Open menu" and "Close menu"; the closed menu is hidden from the keyboard and screen readers; focus moves into the menu, stays inside it and returns to the button; the background is `inert` while open; skip link; respects reduced-motion settings
- Page scroll is locked while the menu is open

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic `header`, `nav`, `button`, lists, skip link |
| CSS3 | Flexbox, media query, transforms, transitions |
| JavaScript (ES6) | Class toggling, keyboard handling, `matchMedia`, `IntersectionObserver` |

## Project Structure
```
responsive-navbar/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_21_Report.docx
```

## How It Works
**1. A media query changes the layout**
```css
@media (max-width: 768px) {
  .nav-toggle { display: block; }          /* show the hamburger */
  .nav-menu {                              /* menu becomes a panel parked off-screen */
    position: fixed; right: 0; top: 0; height: 100vh;
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.35s ease, visibility 0s linear 0.35s;
  }
  .nav-open .nav-menu { transform: translateX(0); visibility: visible; transition-delay: 0s; }
}
```
**2. JavaScript only toggles one class**
```js
header.classList.add("nav-open");     // open
header.classList.remove("nav-open");  // close
```
**3. CSS does all the animation.** `transform` and `opacity` transitions are smooth because the browser can animate them on the graphics card. `visibility` is switched after the slide-out finishes, so a closed menu cannot receive focus.

### Why toggle a class instead of inline styles?
- Styles stay in the CSS file, and JavaScript stays about state.
- One class can change many elements at once (panel, overlay, icon).
- Media queries, transitions and `:hover` work with classes but not with inline styles, which also override the stylesheet and are hard to undo.
- It is easier to read, test and change later.

## Test Cases
| Test | Expected result |
|---|---|
| Width 1200 px | Links in one row; hamburger and overlay hidden |
| Width 769 px / 768 px | Desktop bar / hamburger (exact breakpoint) |
| Tap the hamburger | Panel slides in over 0.35 s, overlay fades in, icon becomes an X, label becomes "Close menu" |
| Esc, overlay click, link click | Menu closes; Esc and overlay return focus to the button |
| Tab key while open | Focus cycles inside the menu only |
| Tab key while closed | Hidden menu links are skipped |
| Resize to desktop while open | Menu resets and page scrolling is restored |
| Seven rapid taps | State and `aria-expanded` stay consistent |
| Reduced-motion setting | No animation, menu still works |
| Widths 320 to 1440 px | No horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/responsive-navbar.git`
2. Open `index.html` in a browser and resize the window, or open it on a phone

## Learning Outcomes
- How media queries change a layout at different widths
- Animating with `transform`, `opacity` and `transition`
- Class-based state instead of inline styles
- Keyboard and screen-reader support for a custom menu
- Managing scroll lock and focus for overlays

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
