# Animated Skill / Progress Bars

A responsive skills dashboard built with **HTML5, CSS3 and vanilla JavaScript**. Skill bars animate smoothly when the skills section scrolls into view, using the `IntersectionObserver` API.

## Features
- Five editable skill bars with percentage labels.
- Scroll-triggered animation with a fallback for older browsers.
- Responsive layout for desktop, tablet and mobile.
- Accessible progress-bar roles and labels.
- Reduced-motion preference support.
- No framework, package installation, or build step required.

## Project files
```text
task29-animated-skill-bars/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally
1. Download or extract the project folder.
2. Open `index.html` in a modern browser.
3. Recommended: open the folder in Visual Studio Code and run `index.html` with the Live Server extension.

## Customize skill names and percentages
In `index.html`, find each progress fill:
```html
<span class="progress-fill" data-progress="90"></span>
```
Change `90` to a number from `0` to `100`. Update the nearby skill name and its `aria-label` to match. The JavaScript clamps values to the 0–100 range.

## How the animation works
1. JavaScript waits for `DOMContentLoaded`.
2. `IntersectionObserver` watches the `#skills` section.
3. When the section becomes visible, the script reads each `data-progress` value.
4. It sets a CSS custom property (`--progress`) and adds the `animated` class.
5. CSS transitions the width from `0` to the configured percentage.
6. The observer stops watching the section after the first animation.

If `IntersectionObserver` is unavailable, the script animates the bars immediately.

## Technologies
- HTML5 for semantic structure.
- CSS3 for responsive layout, gradients, transitions and reduced-motion handling.
- JavaScript for viewport detection and dynamic percentages.

## Interview / viva questions
**1. How does a progress bar fill to a percentage?**  
JavaScript reads the target percentage from `data-progress`, assigns it to a CSS custom property, and CSS transitions the bar width to that value.

**2. What is IntersectionObserver used for?**  
It detects when an element enters or leaves the viewport, avoiding the need to repeatedly calculate scroll position manually.

**3. How can the percentages be configured?**  
Edit each element's `data-progress` value in `index.html` and keep it between 0 and 100.

## Note
The included percentages are sample values for demonstrating the UI. Replace them with your actual skill levels before publishing as a personal portfolio.
