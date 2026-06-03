/* =========================
   PRODUCTOS
========================= */

const contenedorProductos = document.getElementById("productos-grid");
const buscadorInput = document.getElementById("buscador-input");
const botonesCategorias = document.querySelectorAll(".categorias-lista button");

const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const contenedorPaginacion = document.getElementById("paginacion-numeros");
const estadoProductos = document.getElementById("productos-estado");
const seccionProductos = document.querySelector(".carta-productos");
const btnLimpiarFiltros = document.getElementById("limpiar-filtros");

const PRODUCTOS_POR_PAGINA = 6;

let categoriaActual = "todos";
let textoBusqueda = "";
let paginaActual = 1;
let productosActuales = [];

/* =========================
   UTILIDADES
========================= */

function formatearPrecio(precio) {
  return `S/ ${Number(precio).toFixed(2)}`;
}

function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerTotalPaginas(listaProductos) {
  return Math.ceil(listaProductos.length / PRODUCTOS_POR_PAGINA);
}

function obtenerProductosPagina(listaProductos) {
  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;

  return listaProductos.slice(inicio, fin);
}

function obtenerEtiquetaCategoria(categoria) {
  if (categoria === "todos") return "productos";

  const botonActivo = document.querySelector(`[data-categoria="${categoria}"]`);

  if (!botonActivo) return categoria;

  return botonActivo.querySelector(".categoria-label")?.textContent.trim().toLowerCase() || categoria;
}

function obtenerEtiquetaPopularidad(pedido) {
  if (Number(pedido) >= 90) return "Más pedido";
  if (Number(pedido) >= 80) return "Favorito criollo";
  return "Para acompañar";
}

function actualizarEstadoProductos(totalProductos) {
  if (!estadoProductos) return;

  const etiquetaCategoria = obtenerEtiquetaCategoria(categoriaActual);
  const busqueda = textoBusqueda.trim();
  const totalPaginas = obtenerTotalPaginas(productosActuales);

  if (totalProductos === 0) {
    estadoProductos.textContent = busqueda
      ? `No encontramos resultados para "${busqueda}" en ${etiquetaCategoria}.`
      : `No hay productos disponibles en ${etiquetaCategoria}.`;
    return;
  }

  const rangoInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA + 1;
  const rangoFin = Math.min(paginaActual * PRODUCTOS_POR_PAGINA, totalProductos);
  const detalleBusqueda = busqueda ? ` con la búsqueda "${busqueda}"` : "";

  estadoProductos.textContent =
    `Mostrando ${rangoInicio}-${rangoFin} de ${totalProductos} ${etiquetaCategoria}${detalleBusqueda}.` +
    (totalPaginas > 1 ? ` Página ${paginaActual} de ${totalPaginas}.` : "");
}

function desplazarAResultados() {
  if (!seccionProductos) return;

  seccionProductos.scrollIntoView({ behavior: "smooth", block: "start" });
}

function animarResultados() {
  if (!contenedorProductos) return;

  contenedorProductos.classList.remove("is-refreshing");
  window.requestAnimationFrame(() => {
    contenedorProductos.classList.add("is-refreshing");
  });
}

function contarPorCategoria(categoria) {
  if (typeof productos === "undefined" || !Array.isArray(productos)) return 0;
  if (categoria === "todos") return productos.length;

  return productos.filter(
    (producto) => normalizarTexto(producto.categoria) === normalizarTexto(categoria)
  ).length;
}

function actualizarConteosCategorias() {
  botonesCategorias.forEach((boton) => {
    const contador = boton.querySelector(".categoria-count");
    if (!contador) return;

    contador.textContent = contarPorCategoria(boton.dataset.categoria);
  });
}

function actualizarBotonLimpiar() {
  if (!btnLimpiarFiltros) return;

  const hayCategoriaFiltrada = categoriaActual !== "todos";
  const hayBusqueda = textoBusqueda.trim() !== "";

  btnLimpiarFiltros.hidden = !hayCategoriaFiltrada && !hayBusqueda;
}

function activarCategoria(categoria) {
  botonesCategorias.forEach((boton) => {
    const esActivo = boton.dataset.categoria === categoria;

    boton.classList.toggle("activo", esActivo);
    boton.setAttribute("aria-pressed", String(esActivo));
  });

  categoriaActual = categoria;
}

function limpiarFiltros() {
  textoBusqueda = "";

  if (buscadorInput) {
    buscadorInput.value = "";
    buscadorInput.focus();
  }

  activarCategoria("todos");
  filtrarProductos();
}

/* =========================
   CREAR CARD PRODUCTO
========================= */

function crearCardProducto(producto) {
  const articulo = document.createElement("article");
  articulo.className = "card card--product card--interactive";
  articulo.setAttribute("aria-label", `Producto ${producto.nombre}`);

  const media = document.createElement("div");
  media.className = "card__media";

  const imagen = document.createElement("img");
  imagen.className = "card__image";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.loading = "lazy";

  const badge = document.createElement("span");
  badge.className = "card__badge";
  badge.textContent = producto.categoria;

  const body = document.createElement("div");
  body.className = "card__body";

  const popularidad = document.createElement("span");
  popularidad.className = "card__popularidad";

  const popularidadIcono = document.createElement("span");
  popularidadIcono.className = "material-symbols-rounded";
  popularidadIcono.setAttribute("aria-hidden", "true");
  popularidadIcono.textContent = "local_fire_department";

  const popularidadTexto = document.createElement("span");
  popularidadTexto.textContent = obtenerEtiquetaPopularidad(producto.pedido);

  const titulo = document.createElement("h3");
  titulo.className = "card__title";
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "card__text";
  descripcion.textContent = producto.descripcion;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const precio = document.createElement("span");
  precio.className = "card__price";
  precio.textContent = formatearPrecio(producto.precio);

  const accion = document.createElement("a");
  accion.className = "card__action card__action--button";
  accion.href = `pedido.html?producto=${encodeURIComponent(producto.nombre)}`;
  accion.textContent = "Pedir producto";
  accion.setAttribute("aria-label", `Pedir ${producto.nombre}`);

  media.append(imagen, badge);
  popularidad.append(popularidadIcono, popularidadTexto);
  actions.append(precio, accion);
  body.append(popularidad, titulo, descripcion, actions);
  articulo.append(media, body);

  return articulo;
}

/* =========================
   RENDER PRODUCTOS
========================= */

function renderizarProductos(listaProductos) {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";
  actualizarEstadoProductos(listaProductos.length);

  if (listaProductos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-productos";
    mensaje.textContent = "Prueba con otra categoría o limpia la búsqueda para ver toda la carta.";
    contenedorProductos.append(mensaje);
    renderizarPaginacion([]);
    return;
  }

  const productosPagina = obtenerProductosPagina(listaProductos);
  const fragmento = document.createDocumentFragment();

  productosPagina.forEach((producto) => {
    fragmento.append(crearCardProducto(producto));
  });

  contenedorProductos.append(fragmento);
  renderizarPaginacion(listaProductos);
  animarResultados();
}

/* =========================
   PAGINACIÓN
========================= */

function renderizarPaginacion(listaProductos) {
  if (!contenedorPaginacion || !btnAnterior || !btnSiguiente) return;

  const totalPaginas = obtenerTotalPaginas(listaProductos);

  contenedorPaginacion.innerHTML = "";

  if (totalPaginas <= 1) {
    btnAnterior.disabled = true;
    btnSiguiente.disabled = true;
    btnAnterior.setAttribute("aria-disabled", "true");
    btnSiguiente.setAttribute("aria-disabled", "true");
    return;
  }

  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnAnterior.setAttribute("aria-disabled", String(btnAnterior.disabled));
  btnSiguiente.setAttribute("aria-disabled", String(btnSiguiente.disabled));

  for (let numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++) {
    const botonPagina = document.createElement("button");
    botonPagina.type = "button";
    botonPagina.className = "paginacion__numero";
    botonPagina.textContent = numeroPagina;
    botonPagina.setAttribute("aria-label", `Ir a la página ${numeroPagina}`);

    if (numeroPagina === paginaActual) {
      botonPagina.classList.add("paginacion__numero--activo");
      botonPagina.setAttribute("aria-current", "page");
    }

    botonPagina.addEventListener("click", () => {
      paginaActual = numeroPagina;
      renderizarProductos(productosActuales);
      contenedorProductos.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    contenedorPaginacion.append(botonPagina);
  }
}

function irPaginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarProductos(productosActuales);
    contenedorProductos.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function irPaginaSiguiente() {
  const totalPaginas = obtenerTotalPaginas(productosActuales);

  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderizarProductos(productosActuales);
    contenedorProductos.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* =========================
   FILTRAR PRODUCTOS
========================= */

function filtrarProductos() {
  if (typeof productos === "undefined" || !Array.isArray(productos)) {
    productosActuales = [];
    renderizarProductos(productosActuales);
    return;
  }

  const busquedaNormalizada = normalizarTexto(textoBusqueda);
  let productosFiltrados = [...productos];

  if (categoriaActual !== "todos") {
    productosFiltrados = productosFiltrados.filter(
      (producto) => normalizarTexto(producto.categoria) === normalizarTexto(categoriaActual)
    );
  }

  if (busquedaNormalizada !== "") {
    productosFiltrados = productosFiltrados.filter(
      (producto) => {
        const textoProducto = normalizarTexto(
          `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
        );

        return textoProducto.includes(busquedaNormalizada);
      }
    );
  }

  productosActuales = productosFiltrados;
  paginaActual = 1;

  renderizarProductos(productosActuales);
  actualizarBotonLimpiar();
}

/* =========================
   EVENTOS
========================= */

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    activarCategoria(boton.dataset.categoria);
    filtrarProductos();
  });
});

if (buscadorInput) {
  buscadorInput.addEventListener("input", (event) => {
    textoBusqueda = event.target.value;
    filtrarProductos();
  });
}

if (btnLimpiarFiltros) {
  btnLimpiarFiltros.addEventListener("click", limpiarFiltros);
}

if (btnAnterior) {
  btnAnterior.addEventListener("click", irPaginaAnterior);
}

if (btnSiguiente) {
  btnSiguiente.addEventListener("click", irPaginaSiguiente);
}

/* =========================
   CARGA INICIAL
========================= */

botonesCategorias.forEach((boton) => {
  boton.setAttribute("aria-pressed", String(boton.classList.contains("activo")));
});

actualizarConteosCategorias();

if (typeof productos !== "undefined" && Array.isArray(productos)) {
  productosActuales = productos;
  renderizarProductos(productosActuales);
} else {
  renderizarProductos([]);
}
