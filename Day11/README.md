# Recipe Card Page

**Veda Technology Internship | Level 1 | Task 11 | Web Development Track**

A single recipe card page showing an image, an ingredients list and numbered preparation steps. Built with semantic HTML5 and CSS3 only, with no JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/recipe-card-page/`
- Repository: `https://github.com/your-username/recipe-card-page`

## Objective
Practise semantic HTML structure and CSS card styling.

## Features
- Recipe card with image, title, summary, quick facts, ingredients, steps and a chef's tip
- `<ul>` for ingredients and `<ol>` for preparation steps, as the hints suggest
- `<figure>` and `<figcaption>` for the image, with descriptive `alt` text
- Numbered steps styled with **CSS counters**, drawn as circles joined by a line
- Consistent spacing from one scale of CSS variables (`--space-1` to `--space-4`)
- Two-column body on desktop (ingredients and steps), single column on mobile
- Print stylesheet for a clean printed recipe
- No horizontal scrolling at any width

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure: `article`, `header`, `figure`, `section`, `ul`, `ol`, `aside`, `footer` |
| CSS3 | Card styling, Grid, counters, variables, media queries, print styles |

## Project Structure
```
recipe-card-page/
├── index.html
├── style.css
├── images/
│   └── tomato-basil-pasta.svg
├── README.md
└── Task_11_Report.docx
```

## Semantic Structure
```
article.recipe-card
├── figure (img + figcaption)
├── header (h1, summary, meta list)
├── div.recipe-body
│   ├── section.ingredients  (h2 + ul)
│   └── section.steps        (h2 + ol)
├── aside.tip
└── footer
```

## How the Layout Stays Consistent
- `box-sizing: border-box` on every element, so padding never changes the width
- A single card container with `max-width` and `margin-inline: auto`
- One spacing scale reused for all padding, margins and gaps
- CSS Grid for the body: `1fr 1.6fr` on desktop, `1fr` below 760px
- Fluid heading size with `clamp()`
- Image uses `width: 100%; height: auto` with a fixed `aspect-ratio`

## Image Credits
The pasta image is an original vector illustration created for this project. To use a real photo (for example from Unsplash), save it in `images/` and update the `src` and `alt` of the `<img>` in `index.html`, then credit the photographer here.

## How to Run
1. Clone: `git clone https://github.com/your-username/recipe-card-page.git`
2. Open `index.html` in a browser

## Customising the Recipe
Edit the text in `index.html`. Add or remove `<li>` items, and the step numbers update automatically through CSS counters.

## Learning Outcomes
- Choosing the right semantic element for each part of the content
- Understanding the CSS box model (content, padding, border, margin)
- Styling lists with `::before` and CSS counters
- Building a card layout that adapts to screen size

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
