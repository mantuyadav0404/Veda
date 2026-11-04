const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const statusText = document.getElementById("formMessage");

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const topic = document.getElementById("topic").value;
  const message = document.getElementById("message").value.trim();

  if (name.length < 2) return showStatus("Please enter a name with at least 2 characters.");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return showStatus("Please enter a valid email address.");
  if (message.length < 10) return showStatus("Please enter at least 10 characters in your message.");

  // Replace this placeholder with the organization's verified public email before launch.
  const officialEmail = "REPLACE_WITH_OFFICIAL_EMAIL@example.com";
  if (officialEmail.startsWith("REPLACE_")) {
    showStatus("Form validated. Add the official company email in script.js to enable email enquiries.", true);
    return;
  }
  const subject = encodeURIComponent(`Website enquiry: ${topic}`);
  const body = encodeURIComponent(`Name: ${name}\\nEmail: ${email}\\nEnquiry: ${topic}\\n\\nMessage:\\n${message}`);
  showStatus("Your details are valid. Opening your email application…", true);
  window.location.href = `mailto:${officialEmail}?subject=${subject}&body=${body}`;
});

function showStatus(message, success = false) {
  statusText.textContent = message;
  statusText.classList.toggle("success", success);
}
