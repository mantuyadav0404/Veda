# Veda Technology Internship — Task 26
## Account Creation Form with Live Validation

A professional account creation form UI built as a front-end practice task. The design includes a split-panel layout, live field feedback, password visibility toggle, password strength meter, and a checklist of password requirements.

> **Demo/privacy note:** The screenshot indicates that this is a demo and that details are not sent or saved. Keep that statement only if the implementation truly does not transmit or store user data.

## Features
- Full name field with inline validation feedback
- Email field with basic email-format validation
- Password field with show/hide toggle
- Password strength indicator
- Password requirement checklist:
  - At least 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Does not contain the user's name or email
- Professional split-screen design with dark blue and gold accents
- Responsive layout for desktop and smaller screens
- Clear success/error feedback

## Suggested project structure
```text
task-26/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
```

If your implementation is a single file, you can keep the HTML, CSS, and JavaScript together in `index.html`.

## Run locally
1. Download or clone the project.
2. Open the project folder in VS Code.
3. Open `index.html` in a browser, or use the Live Server extension.
4. Enter sample details to test the validation and password feedback.

## Validation behavior
- Name: should not be empty.
- Email: should match a basic email pattern.
- Password: should meet the listed requirements.
- The create-account action should show a demo success message only after all validations pass.

## Accessibility and UX notes
- Use visible labels for every input.
- Keep keyboard focus indicators visible.
- Use `type="email"` for the email field and `type="password"` for password input.
- Ensure status messages are understandable without relying on color alone.
- Add `aria-live="polite"` to dynamic validation feedback where appropriate.

## Security note
This README describes a front-end demo, not a production authentication system. A real account system needs server-side validation, secure password handling, HTTPS, rate limiting, and a suitable authentication/database design. Never store plaintext passwords or expose real credentials in screenshots or public repositories.

## LinkedIn post title
**Veda Technology Internship | Task 26: Responsive Account Creation Form with Live Validation**

## LinkedIn caption
🚀 Completed Task 26 during my internship at Veda Technology!

I built a clean, responsive account creation form focused on usability and real-time feedback. The interface includes:
✅ Full-name and email validation
✅ Password visibility toggle
✅ Password strength indicator
✅ Live password requirement checklist
✅ Clear success and helper messages
✅ Responsive, professional UI

This task helped me strengthen my front-end development skills and understand how thoughtful form validation improves user experience.

#VedaTechnology #WebDevelopment #FrontendDevelopment #HTML #CSS #JavaScript #Internship #LearningByDoing
