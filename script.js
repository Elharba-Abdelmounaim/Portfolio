// ===== script.js =====
document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect + active link
  const nav = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-links a");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 100);

    let current = "";
    document.querySelectorAll("section").forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 150) current = sec.getAttribute("id");
    });

    links.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href").slice(1) === current);
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
      if (navLinks.classList.contains("active")) navLinks.classList.remove("active");
    });
  });

  // Typing effect
  const texts = ["Full Stack Developer", "3D Visualizer", "Automation Enthusiast"];
  let i = 0, j = 0, forward = true;
  const typingEl = document.querySelector(".typing");
  setInterval(() => {
    if (forward) {
      typingEl.textContent = texts[i].slice(0, j++) + "|";
      if (j > texts[i].length) { forward = false; setTimeout(() => {}, 1500); }
    } else {
      typingEl.textContent = texts[i].slice(0, j--) + "|";
      if (j === 0) { forward = true; i = (i + 1) % texts.length; }
    }
  }, 120);

  // Fade-in on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-in").forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Certificate modal
  window.openModal = (title, issuer) => {
    document.getElementById("certModal").style.display = "flex";
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalIssuer").textContent = issuer;
  };
  window.closeModal = () => {
    document.getElementById("certModal").style.display = "none";
  };
});