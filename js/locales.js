/* =========================
   LOCALES
========================= */

const apiClient = window.LaLuchaApi;

const LOCALES_DEMO = [
  { clave: "miraflores", nombre: "Local Miraflores", distrito: "Miraflores", direccion: "Av. Diagonal 308, Miraflores", telefono: "987 654 321", imagen: "assets/img/locales/miraflores.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Miraflores" },
  { clave: "surco", nombre: "Local Surco", distrito: "Santiago de Surco", direccion: "Av. Primavera 1205, Santiago de Surco", telefono: "987 654 322", imagen: "assets/img/locales/SDS.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Surco" },
  { clave: "surquillo", nombre: "Local Surquillo", distrito: "Surquillo", direccion: "Av. Principal 456, Surquillo", telefono: "987 654 003", imagen: "assets/img/locales/surquillo.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Surquillo" },
  { clave: "miraflores1", nombre: "Local Larco / Pardo", distrito: "Miraflores", direccion: "Av. Larco 789, Miraflores", telefono: "987 654 004", imagen: "assets/img/locales/miraflores1.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Larco" },
  { clave: "san-miguel-marina", nombre: "Local La Marina - San Miguel", distrito: "San Miguel", direccion: "Av. de la Marina 790, San Miguel 15088", telefono: "987 653 225", imagen: "assets/img/locales/san-miguel1.webp", maps: "https://maps.app.goo.gl/DQSuSUFCkG1jiHjh9" },
  { clave: "cc", nombre: "Local Centro Cívico", distrito: "Lima", direccion: "C.C. Real Plaza Centro Cívico, Cercado de Lima", telefono: "987 654 006", imagen: "assets/img/locales/cc.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Centro+Civico" },
  { clave: "victoria", nombre: "Local La Victoria", distrito: "La Victoria", direccion: "Av. Gamarra 555, La Victoria", telefono: "987 654 007", imagen: "assets/img/locales/victoria.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+La+Victoria" },
  { clave: "santa-anita", nombre: "Local Santa Anita", distrito: "Santa Anita", direccion: "C.C. Mall Aventura Santa Anita", telefono: "987 654 008", imagen: "assets/img/locales/SantaAnita.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Santa+Anita" },
  { clave: "independencia", nombre: "Local Independencia", distrito: "Independencia", direccion: "Av. Carlos Izaguirre 123, Independencia", telefono: "987 654 009", imagen: "assets/img/locales/independencia.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Independencia" },
  { clave: "plaza-norte", nombre: "Local Plaza Norte", distrito: "Independencia", direccion: "C.C. Plaza Norte, Panamericana Norte", telefono: "987 654 010", imagen: "assets/img/locales/PNorte.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Plaza+Norte" },
  { clave: "san-miguel", nombre: "Local San Miguel", distrito: "San Miguel", direccion: "Av. Universitaria 1011, San Miguel", telefono: "987 654 011", imagen: "assets/img/locales/Sanmiguel.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+San+Miguel" },
  { clave: "chorrillos-sur", nombre: "Local Chorrillos (Lima Sur)", distrito: "Chorrillos", direccion: "Av. Los Proceres 444, Chorrillos", telefono: "987 654 012", imagen: "assets/img/locales/Chorrillos1.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Chorrillos" },
  { clave: "chorrillos", nombre: "Local Chorrillos Principal", distrito: "Chorrillos", direccion: "Av. Defensores del Morro 888, Chorrillos", telefono: "987 654 013", imagen: "assets/img/locales/chorrillos.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Chorrillos+2" }
];

function normalizarTexto(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function formatearTelefono(telefono) {
  const tel = String(telefono || "").replace(/\D/g, "");
  return tel.length === 9 ? `${tel.slice(0, 3)} ${tel.slice(3, 6)} ${tel.slice(6)}` : String(telefono || "");
}

function clonarLocalesDemo() {
  return LOCALES_DEMO.map((local) => ({ ...local }));
}

function buscarLocalRelacionado(locales, localApi) {
  const nombreApi = normalizarTexto(localApi.nombre);
  const distritoApi = normalizarTexto(localApi.distrito);

  return locales.find((local) => {
    const clave = normalizarTexto(local.clave);
    const nombreLocal = normalizarTexto(local.nombre);
    const distritoLocal = normalizarTexto(local.distrito);

    return (
      nombreApi.includes(clave) ||
      nombreLocal.includes(nombreApi) ||
      (distritoApi && distritoLocal === distritoApi)
    );
  });
}

function combinarLocales(localesBase, localesApi) {
  if (!Array.isArray(localesApi)) return localesBase;

  localesApi.forEach((localApi) => {
    const local = buscarLocalRelacionado(localesBase, localApi);
    if (!local) return;

    if (localApi.direccion) local.direccion = localApi.direccion;
    if (localApi.telefono) local.telefono = formatearTelefono(localApi.telefono);
  });

  return localesBase;
}

async function cargarLocales() {
  const localesBase = clonarLocalesDemo();

  if (!apiClient) return localesBase;

  try {
    const resultado = await apiClient.getJsonWithMeta("/locales", {
      cacheKey: "locales",
      fallbackData: localesBase,
      timeoutMs: 5000,
      retries: 0
    });

    if (resultado.source === "fallback") return localesBase;

    return combinarLocales(localesBase, resultado.data);
  } catch (error) {
    console.warn("No se pudo actualizar locales desde la API pública.", error);
    return localesBase;
  }
}

function crearMetaItem(etiqueta, valor) {
  const item = document.createElement("p");
  item.className = "card__meta-item";

  const strong = document.createElement("strong");
  strong.textContent = `${etiqueta}:`;

  item.append(strong, ` ${valor}`);
  return item;
}

function crearCardLocal(local) {
  const card = document.createElement("article");
  card.className = "card";

  const media = document.createElement("div");
  media.className = "card__media";

  const imagen = document.createElement("img");
  imagen.className = "card__image";
  imagen.src = local.imagen;
  imagen.alt = local.nombre;
  imagen.loading = "lazy";
  media.appendChild(imagen);

  const body = document.createElement("div");
  body.className = "card__body";

  const eyebrow = document.createElement("span");
  eyebrow.className = "card__eyebrow";
  eyebrow.textContent = "LOCAL";

  const titulo = document.createElement("h2");
  titulo.className = "card__title";
  titulo.textContent = local.nombre;

  const acciones = document.createElement("div");
  acciones.className = "card__actions";

  const enlace = document.createElement("a");
  enlace.className = "card__action";
  enlace.href = local.maps;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.textContent = "Ver ubicación";

  acciones.appendChild(enlace);
  body.append(
    eyebrow,
    titulo,
    crearMetaItem("Dirección", local.direccion),
    crearMetaItem("Horario", "Atención diaria | 8:00 am - 10:00 pm"),
    crearMetaItem("Teléfono", local.telefono),
    acciones
  );

  card.append(media, body);
  return card;
}

function renderizarLocales(contenedor, listaLocales) {
  if (!contenedor) return;

  contenedor.replaceChildren(...listaLocales.map(crearCardLocal));
}

async function inicializarLocales() {
  const contenedor = document.getElementById("locales-container");
  if (!contenedor) return;

  const locales = await cargarLocales();
  renderizarLocales(contenedor, locales);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarLocales, { once: true });
} else {
  inicializarLocales();
}
