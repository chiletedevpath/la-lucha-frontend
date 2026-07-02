/* =========================
   COMPONENT LOADER
========================= */

async function cargarComponente(idContenedor, rutaArchivo, callback) {
  const contenedor = document.getElementById(idContenedor);

  if (!contenedor) {
    return false;
  }

  try {
    const respuesta = await fetch(rutaArchivo);

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${rutaArchivo}. Estado: ${respuesta.status}`);
    }

    const contenido = await respuesta.text();
    contenedor.innerHTML = contenido;

    if (typeof callback === "function") {
      callback(contenedor);
    }

    return true;
  } catch (error) {
    console.error("Error al cargar componente:", rutaArchivo, error);
    return false;
  }
}

/* =========================
   NAVBAR SCROLL LOGIC
========================= */

function initNavbarScroll(contenedor) {
  const header = contenedor.querySelector("[data-navbar]");

  if (!header) return;

  const evaluarScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  // Evaluar al inicio por si la página ya carga con scroll
  evaluarScroll();

  // Escuchador del scroll del navegador
  window.addEventListener("scroll", evaluarScroll);
}

function initNavbarCompleto(contenedor) {
  initNavbarScroll(contenedor);

  if (typeof window.initNavbar === "function") {
    window.initNavbar(contenedor);
  }
}

/* =========================
   APP INIT
========================= */

async function inicializarComponentes() {
  await Promise.all([
    cargarComponente("navbar-container", "components/navbar.html", initNavbarCompleto),
    cargarComponente("hero-container", "components/hero.html"),
    cargarComponente("footer-container", "components/footer.html")
  ]);
}

document.addEventListener("DOMContentLoaded", inicializarComponentes);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.error("No se pudo registrar el service worker:", error);
    });
  });
}
