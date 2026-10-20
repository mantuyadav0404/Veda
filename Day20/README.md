# Task 20 — Newsletter Signup Modal

A responsive newsletter landing page and delayed signup modal built with **HTML5, CSS3, and vanilla JavaScript** for the Veda Technology Web Development Track internship.

## Features

- Signup modal appears automatically after 3 seconds on a first visit.
- Close button, Escape key, and backdrop click dismiss the modal.
- Dismissal and demo subscription are remembered in `localStorage`, so the automatic popup does not keep reappearing.
- Email validation with clear inline error messages.
- Responsive layout for desktop and mobile.
- Keyboard focus handling, dialog semantics, labels, and live status messages.
- Signup buttons in the header, hero, and footer can open the modal manually.
- Reduced-motion preference is respected.
- No frameworks or build tools required.

## Project files

```text
task-20-newsletter-modal/
├── index.html
├── style.css
├── script.js
├── README.md
├── linkedin_post.txt
└── task_report.docx
```

## Run locally

1. Download or clone the project folder.
2. Open `index.html` in a modern browser, or open the folder in VS Code and use the Live Server extension.
3. Wait 3 seconds to see the modal, or click **Join the newsletter** to open it immediately.
4. Try an invalid email, a valid email, the close button, clicking outside the dialog, and the Escape key.

No npm install or build step is needed.

## How it works

- `index.html` defines the landing page and accessible modal markup.
- `style.css` provides the visual design, responsive layouts, animations, and reduced-motion handling.
- `script.js` controls the timer, open/close actions, email validation, local persistence, keyboard behavior, and demo success state.

## Test checklist

- [ ] Automatic modal appears after about 3 seconds on a fresh browser profile.
- [ ] Modal does not automatically reappear after dismissal on the same browser.
- [ ] Modal opens from each signup CTA.
- [ ] Empty email shows a validation message.
- [ ] Malformed email shows a validation message.
- [ ] Valid email shows a success message.
- [ ] Close button, backdrop click, and Escape dismiss the modal.
- [ ] Layout works on mobile and desktop.
- [ ] Keyboard users can move through the dialog controls.

To test the automatic popup again, clear this site's local storage in browser developer tools, then reload.

## Important note

This is a **front-end demonstration**. A valid email is saved only in the browser's local storage; no email is sent and no mailing list is created. For production, connect the form to a secure backend or email marketing provider, validate again on the server, include consent/privacy language appropriate to your region, and never store subscriber information in browser storage as a substitute for a proper mailing-list system.

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, media queries, animations)
- JavaScript (DOM events, `setTimeout`, validation, `localStorage`)
