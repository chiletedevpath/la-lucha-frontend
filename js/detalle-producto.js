/* =========================
   DETALLE PRODUCTO
========================= */

const contenedorDetalle = document.getElementById("product-detail");
const tituloDocumentoBase = "La Lucha Sanguchería Criolla";

function obtenerIdProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  return Number.isInteger(id) && id > 0 ? id : null;
}

function buscarProductoPorId(id) {
  const listaProductos =
    Array.isArray(window.productos)
      ? window.productos
      : typeof productos !== "undefined" && Array.isArray(productos)
        ? productos
        : null;

  if (!listaProductos) {
    return null;
  }

  return listaProductos.find((producto) => producto.id === id) || null;
}

function formatearPrecio(precio) {
  return `S/ ${Number(precio).toFixed(2)}`;
}

function crearEnlaceCarta(texto) {
  const enlace = document.createElement("a");
  enlace.className = "card__action";
  enlace.href = "carta.html";
  enlace.textContent = texto;

  return enlace;
}

function renderizarFallback(mensaje) {
  if (!contenedorDetalle) return;

  document.title = `Producto no encontrado | ${tituloDocumentoBase}`;

  const fragmento = document.createDocumentFragment();

  const wrapper = document.createElement("div");
  wrapper.className = "product-detail__empty";

  const eyebrow = document.createElement("p");
  eyebrow.className = "section-eyebrow";
  eyebrow.textContent = "Producto no encontrado";

  const titulo = document.createElement("h1");
  titulo.id = "product-detail-title";
  titulo.textContent = "No encontramos este producto";

  const descripcion = document.createElement("p");
  descripcion.className = "section-description";
  descripcion.textContent = mensaje;

  wrapper.append(eyebrow, titulo, descripcion, crearEnlaceCarta("Volver a la carta"));
  fragmento.append(wrapper);

  contenedorDetalle.replaceChildren(fragmento);
}

function renderizarProducto(producto) {
  if (!contenedorDetalle) return;

  document.title = `${producto.nombre} | ${tituloDocumentoBase}`;

  const fragmento = document.createDocumentFragment();

  const media = document.createElement("div");
  media.className = "product-detail__media";

  const imagen = document.createElement("img");
  imagen.className = "product-detail__image";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.loading = "eager";

  const contenido = document.createElement("div");
  contenido.className = "product-detail__content";

  const categoria = document.createElement("p");
  categoria.className = "section-eyebrow";
  categoria.textContent = producto.categoria;

  const titulo = document.createElement("h1");
  titulo.id = "product-detail-title";
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "product-detail__description";
  descripcion.textContent = producto.descripcion;

  const compra = document.createElement("div");
  compra.className = "product-detail__purchase";

  const precio = document.createElement("span");
  precio.className = "product-detail__price";
  precio.textContent = formatearPrecio(producto.precio);

  compra.append(precio, crearEnlaceCarta("Ver carta"));
  contenido.append(categoria, titulo, descripcion, compra);
  media.append(imagen);
  fragmento.append(media, contenido);

  contenedorDetalle.replaceChildren(fragmento);
}

function inicializarDetalleProducto() {
  if (!contenedorDetalle) return;

  const idProducto = obtenerIdProducto();

  if (!idProducto) {
    renderizarFallback("El enlace no incluye un producto válido. Puedes volver a la carta para elegir otra opción.");
    return;
  }

  const producto = buscarProductoPorId(idProducto);

  if (!producto) {
    renderizarFallback("El producto que buscas no está disponible o ya no forma parte de la carta.");
    return;
  }

  renderizarProducto(producto);
}

inicializarDetalleProducto();
