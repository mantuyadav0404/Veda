# Pricing Table

**Veda Technology Internship | Level 1 | Task 12 | Web Development Track**

A responsive pricing table with three plans (Basic, Pro, Enterprise). Each plan shows a price, a feature list and a call-to-action button, and the Pro plan is highlighted as the most popular. Built with HTML5 and CSS3 only, with no JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/pricing-table/`
- Repository: `https://github.com/your-username/pricing-table`

## Objective
Practise CSS Flexbox/Grid layouts and hover effects.

## Features
- **Three pricing cards** aligned with CSS Grid, all the same height
- **Highlighted "Most Popular" plan**: dark gradient background, amber border, larger shadow, a badge and a slight scale-up
- **Responsive stacking**: three columns on desktop, one centred column on tablets and phones
- **Hover effects**: cards lift with a deeper shadow; buttons change colour and the arrow slides
- Included and not-included features shown with tick and cross icons, with hidden text for screen readers
- Buttons always sit at the bottom of the card, whatever the list length (Flexbox)
- Keyboard focus styles and reduced-motion support

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Semantic `article`, `header`, `ul` and `a` elements |
| CSS3 | Grid, Flexbox, transitions, shadows, media queries |

## Project Structure
```
pricing-table/
├── index.html
├── style.css
├── README.md
└── Task_12_Report.docx
```

## How It Works
**Grid for the page, Flexbox inside each card**
```css
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }

.plan     { display: flex; flex-direction: column; }
.features { flex: 1; }          /* takes the free space */
```
Because the list grows to fill the card, every button lines up at the bottom.

**Highlighting the popular plan**
```css
.plan.featured {
  background: linear-gradient(170deg, #1a4a75, #12304d);
  border: 2px solid #f0a91c;
  box-shadow: 0 20px 45px rgba(18, 48, 77, 0.35);
  transform: scale(1.05);
}
```

**Responsive stacking**
```css
@media (max-width: 920px) {
  .plans { grid-template-columns: minmax(0, 440px); justify-content: center; }
}
```

## Test Cases
| Test | Expected result |
|---|---|
| Desktop (1280 px) | Three equal cards, Pro slightly larger, buttons aligned |
| Width 920 px and below | One column, no horizontal scrolling |
| Hover a card | Lifts up with a deeper shadow |
| Hover a button | Background colour changes and the arrow moves |
| Tab key | Each button shows a visible focus ring |

## How to Run
1. Clone: `git clone https://github.com/your-username/pricing-table.git`
2. Open `index.html` in a browser

## Customising
Edit the plan names, prices and features in `index.html`. To highlight a different plan, move the `featured` class and the `badge` paragraph to that card.

## Learning Outcomes
- Aligning cards with CSS Grid and Flexbox
- Highlighting content with colour, border, shadow and scale
- Building hover and focus effects with transitions
- Making a layout stack on small screens with media queries

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
