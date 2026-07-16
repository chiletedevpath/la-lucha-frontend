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

/* =========================
   ACADEMIC NOTICE
========================= */

function mostrarAvisoAcademico() {
  if (sessionStorage.getItem("la-lucha-aviso-academico") === "v2") {
    return;
  }

  const aviso = document.createElement("section");
  aviso.className = "academic-notice";
  aviso.setAttribute("role", "dialog");
  aviso.setAttribute("aria-modal", "false");
  aviso.setAttribute("aria-labelledby", "academic-notice-title");
  aviso.innerHTML = `
    <div class="academic-notice__content">
      <span class="academic-notice__icon" aria-hidden="true">i</span>
      <div class="academic-notice__body">
        <p class="academic-notice__eyebrow">Aviso académico</p>
        <h2 id="academic-notice-title">Sitio de demostración universitaria</h2>
        <p>
          Esta página fue desarrollada con fines académicos para el curso Taller de Programación Web.
          No representa un canal oficial de La Lucha Sanguchería Criolla.
        </p>
        <ul class="academic-notice__list" aria-label="Alcance del proyecto">
          <li>No oficial</li>
          <li>Sin ventas reales</li>
          <li>Sin pagos en línea</li>
        </ul>
      </div>
      <button class="academic-notice__button" type="button">Entendido</button>
    </div>
  `;

  aviso.querySelector("button").addEventListener("click", () => {
    sessionStorage.setItem("la-lucha-aviso-academico", "v2");
    aviso.remove();
  });

  document.body.appendChild(aviso);
}

/* =========================
   PUBLIC API WARMUP
========================= */

function prepararConexionApiPublica() {
  const apiBaseUrl =
    window.LA_LUCHA_API_CONFIG?.baseUrl || "https://utp-la-lucha-bd-backend.onrender.com/api";
  const apiOrigin = new URL(apiBaseUrl).origin;

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = apiOrigin;
  preconnect.crossOrigin = "anonymous";
  document.head.appendChild(preconnect);

  if (window.LaLuchaApi) {
    window.LaLuchaApi.warmup(["/health", "/productos", "/promociones", "/locales"]);
    return;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  fetch(`${apiBaseUrl}/health`, {
    cache: "no-store",
    signal: controller.signal
  })
    .catch(() => null)
    .finally(() => window.clearTimeout(timeout));
}

function inicializarApp() {
  inicializarComponentes();
  mostrarAvisoAcademico();
  prepararConexionApiPublica();
}

document.addEventListener("DOMContentLoaded", inicializarApp);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.error("No se pudo registrar el service worker:", error);
    });
  });
}
