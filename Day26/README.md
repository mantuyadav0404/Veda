# Number Guessing Game

A browser game where the player guesses a secret number and gets higher or lower hints after every try.
Built for **Level 1 · Day 26 · Task 25** of the Web Development track.

## Features
- Random target number inside a defined range (Easy 1-50, Medium 1-100, Hard 1-500)
- "Too low, go higher" and "Too high, go lower" feedback
- Attempt counter and best score per difficulty
- Input validation: empty, decimal, and out-of-range guesses show a message and are **not** counted
- Repeated guesses are detected and not counted
- Guess history chips with arrows, and a bar showing the range that is still possible
- **Play again** button that fully resets the game state
- Responsive, keyboard friendly, light and dark theme

## Tech stack
| Tool | Used for |
|------|----------|
| HTML5 | Form, labels, live region for feedback |
| CSS3 | Layout, themes, meter animation |
| JavaScript | Random number, conditionals, state, DOM updates |

## Project structure
```
number-guessing-game/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to run
Open `index.html` in any modern browser. No install or build step is needed.

## How it works
1. **Random integer in a range:** `Math.floor(Math.random() * (max - min + 1)) + min` gives a whole number from `min` to `max`, both included.
2. **Validation:** the input is trimmed and converted with `Number()`. `Number.isInteger()` rejects decimals, and a range check rejects values outside `min`-`max`.
3. **Conditionals:** an `if / else if / else` compares the guess with the target: equal means win, lower means "go higher", higher means "go lower".
4. **State:** one `state` object holds `target`, `attempts`, `low`, `high`, and `guesses`. `low` and `high` shrink after each hint and drive the range bar.
5. **Reset:** `newGame()` builds a fresh `state`, clears the input and history, and re-enables the controls. The Play again button and the difficulty menu both call it.

## Interview questions
**How would you generate a random integer in a range?**
`Math.floor(Math.random() * (max - min + 1)) + min`. `Math.random()` gives 0 up to (not including) 1, scaling by the range size and flooring gives an integer, and adding `min` shifts it into place.

**How would you give feedback for an out-of-range guess?**
Validate before comparing. If the value is below `min` or above `max`, show an error that states the allowed range, and do not count it as an attempt.

**How would you reset the game state?**
Keep all game data in one state object and write a `newGame()` function that recreates it, picks a new target, clears the UI, and re-enables the input.

## Future improvements
- Maximum attempts with a game-over screen
- Timer and score based on speed
- Save best scores with localStorage
- Custom range chosen by the player

## Author
Mantu Yadav
