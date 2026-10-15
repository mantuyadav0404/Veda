/* ==========================================================================
   Unit Converter — Length & Weight — logic
   Task 15 · Web Development Track
   ========================================================================== */

// ---- Unit definitions --------------------------------------------------
// Every unit stores how many *base units* one of it equals. Converting
// between any two units in the same category is then just: go to the
// base unit, then go from the base unit to the target — no need for a
// separate function for every possible pair.
const UNIT_DEFS = {
  length: {
    base: "meters",
    units: {
      meters: { label: "Meters (m)", symbol: "m", toBase: 1 },
      kilometers: { label: "Kilometers (km)", symbol: "km", toBase: 1000 },
      centimeters: { label: "Centimeters (cm)", symbol: "cm", toBase: 0.01 },
      feet: { label: "Feet (ft)", symbol: "ft", toBase: 0.3048 },
      inches: { label: "Inches (in)", symbol: "in", toBase: 0.0254 },
      miles: { label: "Miles (mi)", symbol: "mi", toBase: 1609.344 },
    },
    defaultFrom: "meters",
    defaultTo: "feet",
  },
  weight: {
    base: "kilograms",
    units: {
      kilograms: { label: "Kilograms (kg)", symbol: "kg", toBase: 1 },
      grams: { label: "Grams (g)", symbol: "g", toBase: 0.001 },
      pounds: { label: "Pounds (lb)", symbol: "lb", toBase: 0.45359237 },
      ounces: { label: "Ounces (oz)", symbol: "oz", toBase: 0.0283495231 },
    },
    defaultFrom: "kilograms",
    defaultTo: "pounds",
  },
};

// ---- DOM references ------------------------------------------------------
const dom = {
  tabs: document.querySelectorAll(".tab"),
  fromValue: document.getElementById("fromValue"),
  fromUnit: document.getElementById("fromUnit"),
  toValue: document.getElementById("toValue"),
  toUnit: document.getElementById("toUnit"),
  swapBtn: document.getElementById("swapBtn"),
  equation: document.getElementById("equation"),
};

let currentCategory = "length";

// ---- Core conversion ------------------------------------------------------

/**
 * Converts `value` from `fromKey` to `toKey` within `category`, by
 * routing through the category's base unit.
 */
function convert(value, category, fromKey, toKey) {
  const { units } = UNIT_DEFS[category];
  const valueInBase = value * units[fromKey].toBase;
  return valueInBase / units[toKey].toBase;
}

/** Rounds to a reasonable number of decimals and trims trailing zeros. */
function formatResult(num) {
  if (!isFinite(num)) return "";
  const rounded = Math.round(num * 10000) / 10000; // up to 4 decimal places
  return rounded.toString();
}

// ---- Rendering --------------------------------------------------------

function populateUnitSelect(selectEl, category, selectedKey) {
  const { units } = UNIT_DEFS[category];
  selectEl.innerHTML = "";

  Object.entries(units).forEach(([key, unit]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = unit.label;
    if (key === selectedKey) option.selected = true;
    selectEl.appendChild(option);
  });
}

function updateEquation() {
  const { units } = UNIT_DEFS[currentCategory];
  const fromKey = dom.fromUnit.value;
  const toKey = dom.toUnit.value;
  const sample = convert(1, currentCategory, fromKey, toKey);

  dom.equation.textContent =
    `1 ${units[fromKey].symbol} = ${formatResult(sample)} ${units[toKey].symbol}`;
}

function updateConversion() {
  const rawValue = parseFloat(dom.fromValue.value);

  if (Number.isNaN(rawValue)) {
    dom.toValue.value = "";
  } else {
    const result = convert(rawValue, currentCategory, dom.fromUnit.value, dom.toUnit.value);
    dom.toValue.value = formatResult(result);
  }

  updateEquation();
}

function switchCategory(category) {
  currentCategory = category;
  const config = UNIT_DEFS[category];

  dom.tabs.forEach((tab) => {
    const isActive = tab.dataset.category === category;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  populateUnitSelect(dom.fromUnit, category, config.defaultFrom);
  populateUnitSelect(dom.toUnit, category, config.defaultTo);
  dom.fromValue.value = 1;

  updateConversion();
}

// ---- Event wiring --------------------------------------------------------

dom.tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchCategory(tab.dataset.category));
});

dom.fromValue.addEventListener("input", updateConversion);
dom.fromUnit.addEventListener("change", updateConversion);
dom.toUnit.addEventListener("change", updateConversion);

dom.swapBtn.addEventListener("click", () => {
  const prevFromUnit = dom.fromUnit.value;
  const prevToUnit = dom.toUnit.value;

  populateUnitSelect(dom.fromUnit, currentCategory, prevToUnit);
  populateUnitSelect(dom.toUnit, currentCategory, prevFromUnit);

  // Carry the current result over as the new starting value, so swapping
  // feels like reversing the conversion rather than resetting it.
  const currentResult = parseFloat(dom.toValue.value);
  dom.fromValue.value = Number.isNaN(currentResult) ? dom.fromValue.value : currentResult;

  updateConversion();
});

// ---- Init --------------------------------------------------------

switchCategory("length");
