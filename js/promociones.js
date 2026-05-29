/* =========================
   PROMOCIONES
========================= */

const contenedorPromociones = document.getElementById("promociones-container");

function crearTextoClase(clase, texto) {
  const elemento = document.createElement("p");
  elemento.className = clase;
  elemento.textContent = texto;

  return elemento;
}

function crearCardPromocion(promocion, index) {
  const posicionInvertida = index % 2 !== 0;

  const articulo = document.createElement("article");
  articulo.className = `card card--promo card--horizontal card--featured ${
    posicionInvertida ? "card--reverse" : ""
  }`;

  const media = document.createElement("div");
  media.className = "card__media";

  const imagen = document.createElement("img");
  imagen.className = "card__image";
  imagen.src = promocion.imagen;
  imagen.alt = promocion.nombre;
  imagen.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card__body";

  const eyebrow = document.createElement("p");
  eyebrow.className = "card__eyebrow";
  eyebrow.textContent = "Promoción";

  const titulo = document.createElement("h3");
  titulo.className = "card__title";
  titulo.textContent = promocion.nombre;

  const incluye = document.createElement("p");
  incluye.className = "card__text";
  incluye.textContent = promocion.incluye;

  const meta = document.createElement("div");
  meta.className = "card__meta";

  if (promocion.extra) {
    meta.append(crearTextoClase("card__meta-item", promocion.extra));
  }

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const precios = document.createElement("div");
  precios.className = "card__meta";

  if (promocion.precioOriginal) {
    const precioOriginal = document.createElement("span");
    precioOriginal.className = "card__price-old";
    precioOriginal.textContent = promocion.precioOriginal;
    precios.append(precioOriginal);
  }

  const precioPromo = document.createElement("span");
  precioPromo.className = "card__price";
  precioPromo.textContent = promocion.precioPromo;
  precios.append(precioPromo);

  actions.append(precios);
  media.append(imagen);
  body.append(eyebrow, titulo, incluye);

  if (meta.children.length > 0) {
    body.append(meta);
  }

  body.append(actions);
  articulo.append(media, body);

  return articulo;
}

function renderizarPromociones(listaPromociones) {
  if (!contenedorPromociones) return;

  contenedorPromociones.innerHTML = "";

  if (!Array.isArray(listaPromociones) || listaPromociones.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-promociones";
    mensaje.textContent = "No se encontraron promociones disponibles.";
    contenedorPromociones.append(mensaje);
    return;
  }

  const fragmento = document.createDocumentFragment();

  listaPromociones.forEach((promocion, index) => {
    fragmento.append(crearCardPromocion(promocion, index));
  });

  contenedorPromociones.append(fragmento);
}

if (Array.isArray(promociones)) {
  renderizarPromociones(promociones);
}
