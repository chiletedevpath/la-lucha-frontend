/* =========================
   PROMOCIONES
========================= */

const contenedorPromociones = document.getElementById("promociones-container");

/**
 * Crea un elemento HTML con clase y texto.
 * Sirve para evitar repetir muchas veces document.createElement + className + textContent.
 */
function crearElementoTexto(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;

  return elemento;
}

/**
 * Crea la tarjeta visual de una promoción.
 * El nombre de la promoción no se muestra como título porque ya aparece dentro de la imagen.
 * Aun así, se conserva en alt y aria-label para accesibilidad.
 */
function crearCardPromocion(promocion, index) {
  const posicionInvertida = index % 2 !== 0;

  const articulo = document.createElement("article");
  articulo.className = `promocion-card reveal ${posicionInvertida ? "promocion-card--reverse reveal-delay-1" : ""}`;
  articulo.setAttribute("aria-label", `Promoción ${promocion.nombre}`);

  const media = document.createElement("div");
  media.className = "promocion-imagen";

  const imagen = document.createElement("img");
  imagen.src = promocion.imagen;
  imagen.alt = `Promoción ${promocion.nombre}`;
  imagen.loading = "lazy";

  const body = document.createElement("div");
  body.className = "promocion-contenido";

  const badge = crearElementoTexto(
    "span",
    "promocion-badge",
    promocion.badge || "Promoción especial"
  );

  const incluye = crearElementoTexto("p", "promocion-incluye", promocion.incluye);

  const extra = crearElementoTexto("p", "promocion-extra", promocion.extra);

  const precios = document.createElement("div");
  precios.className = "promocion-precios";
  precios.setAttribute("aria-label", "Precio de la promoción");

  if (promocion.precioOriginal) {
    const precioOriginal = crearElementoTexto(
      "span",
      "promocion-precio-original",
      promocion.precioOriginal
    );

    precios.append(precioOriginal);
  }

  const precioPromo = crearElementoTexto("strong", "promocion-precio-final", promocion.precioPromo);
  precios.append(precioPromo);

  const boton = document.createElement("a");
  boton.className = "promocion-btn";
  boton.href = "contacto.html";
  boton.textContent = promocion.cta || "Pedir promoción";
  boton.setAttribute("aria-label", `Pedir promoción ${promocion.nombre}`);

  media.append(imagen);
  body.append(badge, incluye, extra, precios, boton);
  articulo.append(media, body);

  return articulo;
}

/**
 * Renderiza todas las promociones dentro del contenedor principal.
 */
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
