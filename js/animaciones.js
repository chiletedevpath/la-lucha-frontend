/* =========================
   REVEAL ON SCROLL
========================= */

function inicializarReveals() {
  const elementosReveal = document.querySelectorAll(".reveal");

  if (!elementosReveal.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elementosReveal.forEach((elemento) => elemento.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elementosReveal.forEach((elemento) => observer.observe(elemento));
}

document.addEventListener("DOMContentLoaded", inicializarReveals);
