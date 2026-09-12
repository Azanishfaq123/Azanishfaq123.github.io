const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const body = document.body;
const menuBtn = document.querySelector(".menu-btn");
const rail = document.getElementById("rail");

if (menuBtn && rail) {
  menuBtn.addEventListener("click", () => {
    const open = body.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  rail.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const navLinks = document.querySelectorAll("[data-nav]");
const sections = [...navLinks]
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

const setActive = () => {
  let current = "top";
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 140) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === current);
  });
};

window.addEventListener("scroll", setActive, { passive: true });
setActive();
