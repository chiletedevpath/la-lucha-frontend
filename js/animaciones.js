/* =========================
   REVEAL ON SCROLL
========================= */

const elementosReveal = document.querySelectorAll(".reveal");

/* Observer */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      /* Si entra en pantalla */
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15
  }
);

/* Observa elementos */
elementosReveal.forEach((elemento) => {
  observer.observe(elemento);
});
