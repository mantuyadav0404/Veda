# Random Password Generator

**Veda Technology Internship | Level 1 | Task 17 | Web Development Track**

A password generator with adjustable length and character-type options (uppercase, lowercase, numbers, symbols). It shows the password, rates its strength and copies it to the clipboard. Built with HTML5, CSS3 and vanilla JavaScript.

## Live Demo
- GitHub Pages: `https://your-username.github.io/password-generator/`
- Repository: `https://github.com/your-username/password-generator`

## Objective
Practise checkboxes, string building and randomization logic.

## Features
- **Length slider and number input**, kept in sync (4 to 64 characters)
- **Checkboxes** for uppercase, lowercase, numbers and symbols
- **Generated password display**, with digits and symbols coloured for easy reading
- **Copy-to-clipboard button** with a "Copied!" confirmation and a fallback for older browsers
- **Cryptographically secure randomness** using `crypto.getRandomValues()` instead of `Math.random()`
- **Every selected type is guaranteed** to appear in the password
- **Empty selection handled**: a clear message is shown and generating is disabled until an option is chosen
- Option to avoid look-alike characters (I, l, 1, O, 0, o)
- Strength meter with an entropy estimate in bits
- New password generated live as the slider or options change
- Responsive and accessible (labelled controls, live status messages, visible focus rings)
- Nothing is sent, stored or logged

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | Form controls: range, number input, checkboxes |
| CSS3 | Layout, custom checkboxes, strength meter, responsive design |
| JavaScript (ES6) | Pool building, secure random selection, shuffle, clipboard |

## Project Structure
```
password-generator/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_17_Report.docx
```

## How It Works
1. **Build the pool.** The selected character sets are joined into one pool, for example uppercase + numbers = 36 characters.
2. **Guarantee each type.** One random character is taken from every selected set first.
3. **Fill the rest.** The remaining positions are filled with random characters from the whole pool.
4. **Shuffle.** A Fisher-Yates shuffle mixes the characters, so the guaranteed ones are not always at the start.
5. **Score.** Entropy = length x log2(pool size), shown as Weak, Fair, Strong or Very strong.

```js
function randomInt(max) {
  const buffer = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);   // avoids modulo bias
  return buffer[0] % max;
}
```

### Why not Math.random()?
`Math.random()` is a fast pseudo-random generator that is **not cryptographically secure**. Its internal state can be worked out from some of its outputs, so later values can be predicted. Passwords need an unpredictable source, so this project uses `crypto.getRandomValues()`, which draws on the operating system's secure random generator. Taking `value % max` directly would favour small numbers slightly, so values above the largest multiple of `max` are rejected and redrawn.

## Test Cases
| Test | Expected result |
|---|---|
| Lengths 4, 8, 16, 32, 64 (10,000 passwords) | Exact length every time |
| All four types at length 4 (50,000 passwords) | Every type present in every password |
| Only lowercase and numbers selected | No other characters appear |
| No option selected | Message shown, copy and generate disabled |
| Avoid look-alike characters | I, l, 1, O, 0, o never appear |
| `randomInt(7)` over 700,000 draws | Even spread (chi-square 2.8, limit 16.8) |
| First character at length 4 | About 25% from each of the four types |
| Number box set to 200, 2 or empty | Snaps to 64, 4 or 16 |
| Copy button | Clipboard text equals the displayed password |
| Width 360 px with a 64-character password | No horizontal scrolling |

## How to Run
1. Clone: `git clone https://github.com/your-username/password-generator.git`
2. Open `index.html` in a browser

## Security Notes
- The entropy figure assumes every character is picked at random. It is an estimate, not a guarantee.
- Use a password manager to store generated passwords, and use a different password for every account.

## Learning Outcomes
- Building a character pool from checkbox state
- String building and the Fisher-Yates shuffle
- Understanding why `Math.random()` is unsafe for security and using the Web Crypto API instead
- Handling empty selections and out-of-range input
- Using the Clipboard API with a fallback

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
