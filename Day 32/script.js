const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 2) {
    showMessage("Please enter a name with at least 2 characters.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }
  if (message.length < 10) {
    showMessage("Please enter a message of at least 10 characters.");
    return;
  }

  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  showMessage("Your details look good. Opening your email application…", true);
  window.location.href = `mailto:mantuyadav91953@gmail.com?subject=${subject}&body=${body}`;
});

function showMessage(message, success = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", success);
}
