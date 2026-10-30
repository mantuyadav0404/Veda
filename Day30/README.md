# Custom 404 Error Page

A friendly, responsive 404 page built with **HTML5, CSS3 and vanilla JavaScript** for Veda Technology Web Development Internship — Task 30.

## Features
- Clear 404 heading and friendly explanatory message.
- Original CSS astronaut / space illustration (no image asset required).
- Homepage link and functional Go back button.
- Responsive centered layout for desktop, tablet and mobile.
- Floating CSS animation and reduced-motion accessibility support.
- Dynamic copyright year.
- Semantic HTML and accessible illustration description.

## Project files
```text
task30-custom-404-page/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally
1. Extract the project ZIP.
2. Open the folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the Live Server extension.

## Connect your homepage
The homepage links currently point to `index.html`. Replace those destinations if your actual homepage has a different filename or URL.

## How it works
- HTML defines the page structure, content and navigation.
- CSS centers the content, styles typography and buttons, creates the astronaut illustration, and makes the layout responsive.
- JavaScript updates the year and handles the Go back action. It uses `window.history.back()` when possible and falls back to `index.html`.

## Testing checklist
- Check desktop and mobile layouts.
- Confirm the error heading and message are readable.
- Test the homepage link.
- Test Go back after navigating from another page.
- Open the 404 page directly and test its fallback.
- Check reduced-motion behavior.

## Interview questions and answers
**1. Why is a custom 404 page useful for user experience?**  
It explains that the requested page is unavailable, reduces confusion, maintains the website's identity, and provides a route back to useful content.

**2. How would you center content vertically and horizontally?**  
Use Flexbox or CSS Grid with `min-height: 100vh`, `align-items: center`, and `justify-content: center`. This project uses a flex column layout and automatic margins.

**3. What should a good error page always include?**  
A clear 404 message, friendly explanation, consistent branding, and a working link to the homepage or another useful destination.

## Production note
Configure your web server or hosting platform to serve this page with the actual HTTP status code `404 Not Found`. A page that looks like a 404 but responds with HTTP 200 is a soft 404.
