# Character and Word Counter

**Veda Technology Internship | Level 1 | Task 18 | Web Development Track**

A text-area tool that counts characters, words and sentences live as the user types. Built with HTML5, CSS3 and vanilla JavaScript. Nothing is sent or stored, because all counting happens in the browser.

## Live Demo
- GitHub Pages: `https://your-username.github.io/word-counter/`
- Repository: `https://github.com/your-username/word-counter`

## Objective
Practise input events, string methods and live DOM updates.

## Features
- **Live character count** (with and without spaces)
- **Live word count**
- **Sentence count** (the optional extra in the task)
- Paragraph count, estimated reading time (200 words per minute) and average word length
- **Optional character limit** with a progress bar, a warning near the limit and an "over the limit" message
- Sample text and Clear buttons
- Counts update on typing, pasting, cutting, dragging text in and deleting, because it uses the `input` event
- Handles extra spaces, tabs, new lines, emoji, accented letters and non-English text
- Responsive layout (two columns on desktop, stacked on phones) and screen-reader friendly (labelled textarea, short spoken summary after you pause typing)

## Tech Stack
| Technology | Purpose |
|---|---|
| HTML5 | `textarea`, `dl` for the statistics, labelled controls |
| CSS3 | Grid layout, stat cards, limit bar, responsive design |
| JavaScript (ES6) | `input` event, string methods, regular expressions, `Intl.Segmenter` |

## Project Structure
```
word-counter/
├── index.html
├── style.css
├── script.js
├── README.md
└── Task_18_Report.docx
```

## How It Works
**Words: trim, split on whitespace, ignore punctuation-only tokens**
```js
function getWords(text) {
  const trimmed = text.trim();
  if (trimmed === "") return [];
  return trimmed.split(/\s+/).filter(function (token) {
    return /[\p{L}\p{N}\p{Extended_Pictographic}]/u.test(token);
  });
}
```
- `trim()` first: otherwise leading or trailing spaces make `split` return empty strings, so `"  "` would count as a word.
- `/\s+/` treats any run of spaces, tabs and new lines as one separator, so multiple spaces between words do not create extra words.
- The filter ignores tokens such as a lone dash, while letters, digits and emoji (in any language) count.

**Characters:** `text.length` counts UTF-16 units, so one emoji would count as 2. `Intl.Segmenter` counts what a person sees as one character. A fast path uses `text.length` for plain ASCII text.

**Sentences:** the text is split at `.`, `!`, `?` or an ellipsis that is followed by whitespace or the end. Common abbreviations (`Dr.`, `Mr.`, `e.g.`, `i.e.`) are protected, and decimals such as `3.14` are not split. A blank line also starts a new sentence.

**Live updates:** one `input` listener recalculates everything. A very large paste (over 100,000 characters) is debounced by 200 ms to keep typing smooth.

## Test Cases
| Input | Words | Sentences |
|---|---|---|
| (empty) or only spaces | 0 | 0 |
| `Hello world` | 2 | 1 |
| `  Hello    world` (extra spaces) | 2 | 1 |
| `Hello, world! How are you? I'm fine.` | 7 | 3 |
| `Wait... what?!` | 2 | 2 |
| `Dr. Smith went to Washington. He arrived at 3.14 p.m.` | 10 | 2 |
| `well-known state-of-the-art` | 2 | 1 |
| `word — word` (dash alone) | 2 | 1 |
| `Hi 😀😀` | 2 | 1 (3 characters + 2 for the emoji = 5 characters) |
| `नमस्ते दुनिया` | 2 | 1 |

**Known limitations:** sentence counting is an estimate. An abbreviation that is not in the list (for example `Inc.`) followed by a capital letter can be counted as a sentence end. Languages written without spaces, such as Chinese, count each run of text as one word.

## How to Run
1. Clone: `git clone https://github.com/your-username/word-counter.git`
2. Open `index.html` in a browser

## Learning Outcomes
- Using the `input` event on a textarea
- String methods: `trim`, `split`, `replace`, `match`, `test`
- Regular expressions and Unicode property escapes
- Why `string.length` is not always the number of characters
- Updating many DOM elements efficiently and accessibly

## Author
**Mantu Yadav**, Web Development Intern, Veda Technology
