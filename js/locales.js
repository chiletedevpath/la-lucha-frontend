/* =========================
   LOCALES
========================= */

const contenedorLocales = document.getElementById("locales-container");

function normalizarTelefono(telefono) {
  return telefono.replace(/\D/g, "");
}

function crearMetaLocal(label, valor, enlace) {
  const item = document.createElement("p");
  item.className = "card__meta-item";

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  item.append(strong);

  if (enlace) {
    item.append(enlace);
  } else {
    item.append(valor);
  }

  return item;
}

function crearCardLocal(local, index) {
  const posicionInvertida = index % 2 !== 0;

  const articulo = document.createElement("article");
  articulo.className = `card card--location card--horizontal ${posicionInvertida ? "card--reverse" : ""}`;

  const media = document.createElement("div");
  media.className = "card__media";

  const imagen = document.createElement("img");
  imagen.className = "card__image";
  imagen.src = local.imagen;
  imagen.alt = local.nombre;
  imagen.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card__body";

  const eyebrow = document.createElement("p");
  eyebrow.className = "card__eyebrow";
  eyebrow.textContent = "Local";

  const titulo = document.createElement("h3");
  titulo.className = "card__title";
  titulo.textContent = local.nombre;

  const meta = document.createElement("div");
  meta.className = "card__meta";

  const telefonoLink = document.createElement("a");
  telefonoLink.href = `tel:+51${normalizarTelefono(local.telefono)}`;
  telefonoLink.textContent = local.telefono;

  meta.append(
    crearMetaLocal("Dirección", local.direccion),
    crearMetaLocal("Horario", local.horario),
    crearMetaLocal("Teléfono", local.telefono, telefonoLink)
  );

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const mapsLink = document.createElement("a");
  mapsLink.className = "card__action";
  mapsLink.href = local.maps;
  mapsLink.target = "_blank";
  mapsLink.rel = "noopener noreferrer";
  mapsLink.textContent = "Ver ubicación";

  actions.append(mapsLink);
  media.append(imagen);
  body.append(eyebrow, titulo, meta, actions);
  articulo.append(media, body);

  return articulo;
}

function renderizarLocales(listaLocales) {
  if (!contenedorLocales) return;

  contenedorLocales.innerHTML = "";

  if (!Array.isArray(listaLocales) || listaLocales.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-locales";
    mensaje.textContent = "No se encontraron locales disponibles.";
    contenedorLocales.append(mensaje);
    return;
  }

  const fragmento = document.createDocumentFragment();

  listaLocales.forEach((local, index) => {
    fragmento.append(crearCardLocal(local, index));
  });

  contenedorLocales.append(fragmento);
}

if (Array.isArray(locales)) {
  renderizarLocales(locales);
}
