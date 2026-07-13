/* ===================================================
   LOCALES - LA LUCHA (PRODUCCIÓN FINAL - 13 SEDES)
=================================================== */

const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl || ""; 
const apiClient = window.LaLuchaApi;


const MIS_LOCALES_OFICIALES = [
  { clave: "miraflores", nombre: "Local Miraflores", distrito: "Miraflores", direccion: "Av. Diagonal 308, Miraflores", telefono: "987 654 321", imagen: "assets/img/locales/miraflores.webp", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Miraflores" },
  { clave: "surco", nombre: "Local Surco", distrito: "Santiago de Surco", direccion: "Av. Primavera 1205, Santiago de Surco", telefono: "987 654 322", imagen: "assets/img/locales/SDS.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Surco" },
  { clave: "surquillo", nombre: "Local Surquillo", distrito: "Surquillo", direccion: "Av. Principal 456, Surquillo", telefono: "987 654 003", imagen: "assets/img/locales/surquillo.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Surquillo" },
  { clave: "miraflores1", nombre: "Local Larco / Pardo", distrito: "Miraflores", direccion: "Av. Larco 789, Miraflores", telefono: "987 654 004", imagen: "assets/img/locales/miraflores1.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Larco" },
  { clave: "San miguel1", nombre: "Local La Marina - San Miguel", distrito: "San Miguel", direccion: "Av. de la Marina 790, San Miguel 15088", telefono: "987 653 225", imagen: "assets/img/locales/San miguel1.jpg", maps: "https://maps.app.goo.gl/DQSuSUFCkG1jiHjh9" },
  { clave: "cc", nombre: "Local Centro Cívico", distrito: "Lima", direccion: "C.C. Real Plaza Centro Cívico, Cercado de Lima", telefono: "987 654 006", imagen: "assets/img/locales/cc.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Centro+Civico" },
  { clave: "victoria", nombre: "Local La Victoria", distrito: "La Victoria", direccion: "Av. Gamarra 555, La Victoria", telefono: "987 654 007", imagen: "assets/img/locales/victoria.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+La+Victoria" },
  { clave: "SantaAnita", nombre: "Local Santa Anita", distrito: "Santa Anita", direccion: "C.C. Mall Aventura Santa Anita", telefono: "987 654 008", imagen: "assets/img/locales/SantaAnita.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Santa+Anita" },
  { clave: "independencia", nombre: "Local Independencia", distrito: "Independencia", direccion: "Av. Carlos Izaguirre 123, Independencia", telefono: "987 654 009", imagen: "assets/img/locales/independencia.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Independencia" },
  { clave: "PNorte: ", nombre: "Local Plaza Norte", distrito: "Independencia", direccion: "C.C. Plaza Norte, Panamericana Norte", telefono: "987 654 010", imagen: "assets/img/locales/PNorte.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Plaza+Norte" },
  { clave: "SanMiguel", nombre: "Local San Miguel", distrito: "San Miguel", direccion: "Av. Universitaria 1011, San Miguel", telefono: "987 654 011", imagen: "assets/img/locales/Sanmiguel.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+San+Miguel" },
  { clave: "chorrillos1", nombre: "Local Chorrillos (Lima Sur)", distrito: "Chorrillos", direccion: "Av. Los Proceres 444, Chorrillos", telefono: "987 654 012", imagen: "assets/img/locales/Chorrillos1.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Chorrillos" },
  { clave: "chorrillos", nombre: "Local Chorrillos Principal", distrito: "Chorrillos", direccion: "Av. Defensores del Morro 888, Chorrillos", telefono: "987 654 013", imagen: "assets/img/locales/chorrillos.jpg", maps: "https://maps.google.com/?q=La+Lucha+Sangucheria+Criolla+Chorrillos+2" }
];

function normalizarTexto(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function formatearTelefono(telefono) {
  let tel = String(telefono || "").replace(/\D/g, "");
  return tel.length === 9 ? `${tel.slice(0, 3)} ${tel.slice(3, 6)} ${tel.slice(6)}` : String(telefono);
}

async function cargarYCombinarLocales() {
 
  let listaFinal = JSON.parse(JSON.stringify(MIS_LOCALES_OFICIALES));

  try {
    const localesApi = apiClient
      ? await apiClient.getJson("/locales", {
          cacheKey: "locales",
          timeoutMs: 9000,
          retries: 1
        })
      : await fetch(`${API_BASE_URL}/locales`).then((respuesta) => {
          if (!respuesta.ok) throw new Error(`La API respondio ${respuesta.status}`);
          return respuesta.json();
        });

    
    localesApi.forEach(localApi => {
      const nombreApi = normalizarTexto(localApi.nombre);
        
      
      const localTuyo = listaFinal.find(tuyo => nombreApi.includes(normalizarTexto(tuyo.clave)) || normalizarTexto(tuyo.nombre).includes(nombreApi));
        
      if (localTuyo) {

        if (localApi.direccion) localTuyo.direccion = localApi.direccion;
        if (localApi.telefono) localTuyo.telefono = formatearTelefono(localApi.telefono);
      }
    });
  } catch (error) {
    console.warn("La API falló o está desconectada, usando datos locales de respaldo:", error);
  }

  return listaFinal;
}

function renderizarLocales(contenedor, listaLocales) {
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const htmlCards = listaLocales.map((local) => {
    return `
      <div class="card">
        <div class="card__media">
          <img class="card__image" src="${local.imagen}" alt="${local.nombre}" />
        </div>
        <div class="card__body">
          <span class="card__eyebrow">LOCAL</span>
          <h2 class="card__title">${local.nombre}</h2>
          <p class="card__meta-item"><strong>Dirección:</strong> ${local.direccion}</p>
          <p class="card__meta-item"><strong>Horario:</strong> Atención diaria | 8:00 am - 10:00 pm</p>
          <p class="card__meta-item"><strong>Teléfono:</strong> ${local.telefono}</p>
          <div class="card__actions">
            <a href="${local.maps}" target="_blank" rel="noopener noreferrer" class="card__action">Ver ubicación</a>
          </div>
        </div>
      </div>
    `;
  }).join("");

  contenedor.innerHTML = htmlCards;
}

async function inicializarLocales() {
  const contenedor = document.getElementById("locales-container");
  if (!contenedor) return false;

  const datosCompletos = await cargarYCombinarLocales();
  renderizarLocales(contenedor, datosCompletos);
  return true;
}

const comprobarContenedor = setInterval(async () => {
  const completado = await inicializarLocales();
  if (completado) {
    clearInterval(comprobarContenedor);
  }
}, 100);
