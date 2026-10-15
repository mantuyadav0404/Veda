# Unit Converter — Length & Weight

**Task 15 · Web Development Track · Veda Technology Internship**
**Level 1 · Day 15**

A live unit converter supporting length and weight, built with vanilla HTML5, CSS3, and JavaScript.

---

## 📋 Task Brief

| | |
|---|---|
| **Objective** | Practice functions, conditional logic, and form handling |
| **Deliverables** | Dropdowns for unit selection · Live conversion as the user types · Support for at least 4 unit types |
| **Tools** | HTML5, CSS3, JavaScript |

## 📐 What it does

- Two categories — **Length** and **Weight** — switchable via tabs
- **Length:** meters, kilometers, centimeters, feet, inches, miles (6 units)
- **Weight:** kilograms, grams, pounds, ounces (4 units)
- Type a value and the converted result updates **live**, with no submit button
- A **swap** button reverses the from/to units and carries the current result over as the new input
- A one-line equation (e.g. "1 m = 3.2808 ft") always shows the live conversion rate for the selected units

## 📁 Files

```
unit-converter/
├── index.html     # Page structure and content
├── styles.css      # All styling, layout, and responsive rules
├── script.js       # Unit definitions, conversion logic, form handling
└── README.md        # This file
```

## 🛠️ How to view it

No build step or server required — it's a static page.

1. Download all three files (`index.html`, `styles.css`, `script.js`) into the same folder.
2. Open `index.html` in any modern browser.

> The page loads two Google Fonts (`Outfit` and `Inter`) over the network, and falls back to system fonts if you're offline.

## 🧠 How the conversion logic works

Rather than writing a separate function for every possible unit pair (which grows fast — 6 length units alone would mean 30 pair-wise combinations), each unit stores **how many base units it equals**:

```js
feet: { label: "Feet (ft)", symbol: "ft", toBase: 0.3048 }
```

Length uses **meters** as its base unit, weight uses **kilograms**. Converting between *any* two units in a category is then a two-step trip through the base unit:

```js
function convert(value, category, fromKey, toKey) {
  const { units } = UNIT_DEFS[category];
  const valueInBase = value * units[fromKey].toBase;   // → base unit
  return valueInBase / units[toKey].toBase;             // → target unit
}
```

Adding a new unit is then a single line in `UNIT_DEFS`, with no new conversion function required.

Other key pieces:

- **Live updates** — an `input` event listener on the value field re-runs the conversion on every keystroke, so there's no submit button or page reload.
- **Conditional logic** — switching the Length/Weight tab swaps which unit set populates both dropdowns and resets them to sensible defaults for that category.
- **Rounding** — results are rounded to 4 decimal places and trailing zeros are trimmed, so `3.280800` displays as `3.2808` and whole numbers display cleanly as `2`, not `2.0000`.

## 📱 Responsive approach

- A single centred card that scales down on smaller screens
- Below 540px, the From/To fields stack vertically and the swap button rotates 90° to sit naturally between them

## ✅ Deliverables checklist

- [x] Dropdowns for unit selection
- [x] Live conversion as the user types
- [x] Support for at least 4 unit types (6 length units + 4 weight units)
- [x] Responsive layout for mobile and desktop

---

**Submitted by:** Sachin
**Track:** Web Development
**Internship:** Veda Technology
