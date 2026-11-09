# SpendWise — Interactive Expense Tracker

A responsive browser-based expense tracker built with **HTML5, CSS3 and vanilla JavaScript**. Users can create, view, update, delete, search, categorize, filter and sort expenses. Data is persisted in the browser with `localStorage`.

## Features

- Add expenses with a name, amount, category and date.
- Edit existing expenses and delete them with confirmation.
- View total expenses, current-month expenses and transaction count.
- Search by expense name or category.
- Filter by category, current month or the last 7 days.
- Sort by newest, oldest, highest amount or lowest amount.
- Automatically save data in browser LocalStorage.
- Responsive layout for desktop, tablet and mobile.
- Input validation and accessible labels/status messages.
- Amounts displayed in Indian Rupees (INR).

## Project structure

```text
interactive_expense_tracker/
├── index.html       # Application structure
├── style.css        # Responsive styling
├── script.js        # App logic and LocalStorage
├── README.md        # Setup and project documentation
├── project_report.pdf
└── linkedin_caption.txt
```

## Run the project

1. Download and extract the project ZIP.
2. Open the `interactive_expense_tracker` folder in VS Code.
3. Open `index.html` in a browser, or use the **Live Server** extension in VS Code.
4. Click **Add expense**, enter the details and save.
5. Try editing, deleting, searching, filtering and sorting transactions.

No framework, package installation, backend or API key is required.

## How it works

- `index.html` defines the dashboard, summary cards, filters, transaction table and expense dialog.
- `style.css` provides the visual design and responsive layouts.
- `script.js` stores expense objects in an array, renders the UI, validates form values and synchronizes the array with LocalStorage.
- Each expense contains an ID, title, amount, category, date and creation timestamp.

### LocalStorage

The app uses the key `spendwise_expenses_v1`. Data stays in the same browser profile on the same device. Clearing browser site data or using another browser/device may remove or not show the saved records. This is a front-end learning project, not a cloud-synced financial account.

## Suggested test cases

| Test | Expected result |
|---|---|
| Add a valid expense | New transaction appears and summary updates |
| Submit an empty form | Browser validation prevents invalid submission |
| Enter zero or negative amount | Amount is rejected |
| Edit a transaction | Updated values appear in the list and totals |
| Delete a transaction | Confirmation appears; item is removed after confirmation |
| Search by name | Matching transactions remain visible |
| Filter by category/date | Only matching transactions are displayed |
| Refresh the page | Previously saved transactions are restored |
| Open on a narrow screen | Layout adapts for mobile |

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (ES6+, arrays, objects, DOM manipulation, events)
- Browser LocalStorage

## Future enhancements

- Monthly budgets and budget alerts.
- Category-wise charts and spending trends.
- Export transactions to CSV/PDF.
- Recurring expenses.
- Authentication and cloud database synchronization.

## Author

Created as an internship learning project. Update this section with your name, internship details and submission date before submitting.
