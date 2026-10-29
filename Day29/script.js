// Animate skill bars once the skills section enters the viewport.
document.addEventListener("DOMContentLoaded", () => {
  const skillSection = document.querySelector("#skills");
  const fills = document.querySelectorAll(".progress-fill");

  document.querySelector("#year").textContent = new Date().getFullYear();

  function animateBars() {
    fills.forEach((fill) => {
      const value = Math.max(0, Math.min(100, Number(fill.dataset.progress) || 0));
      fill.style.setProperty("--progress", `${value}%`);
      fill.closest(".progress-track").setAttribute("aria-valuenow", String(value));
      const percentage = fill.closest(".skill-item").querySelector(".percentage");
      fill.classList.add("animated");
      percentage.textContent = `${value}%`;
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBars();
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(skillSection);
  } else {
    // Fallback for older browsers without IntersectionObserver.
    animateBars();
  }
});
