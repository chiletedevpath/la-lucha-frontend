/* =========================
   PRODUCTOS
========================= */

const contenedorProductos = document.getElementById("productos-grid");
const buscadorInput = document.getElementById("buscador-input");
const botonesCategorias = document.querySelectorAll(".categorias-lista button");

const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const contenedorPaginacion = document.getElementById("paginacion-numeros");

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

function obtenerTotalPaginas(listaProductos) {
  return Math.ceil(listaProductos.length / PRODUCTOS_POR_PAGINA);
}

function obtenerProductosPagina(listaProductos) {
  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;

  return listaProductos.slice(inicio, fin);
}

/* =========================
   CREAR CARD PRODUCTO
========================= */

function crearCardProducto(producto) {
  const articulo = document.createElement("article");
  articulo.className = "card card--product card--interactive reveal";
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
  actions.append(precio, accion);
  body.append(titulo, descripcion, actions);
  articulo.append(media, body);

  return articulo;
}

/* =========================
   RENDER PRODUCTOS
========================= */

function renderizarProductos(listaProductos) {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-productos";
    mensaje.textContent = "No se encontraron productos.";
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
    return;
  }

  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual === totalPaginas;

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
  let productosFiltrados = productos;

  if (categoriaActual !== "todos") {
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.categoria === categoriaActual
    );
  }

  if (textoBusqueda.trim() !== "") {
    productosFiltrados = productosFiltrados.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
  }

  productosActuales = productosFiltrados;
  paginaActual = 1;

  renderizarProductos(productosActuales);
}

/* =========================
   EVENTOS
========================= */

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesCategorias.forEach((btn) => {
      btn.classList.remove("activo");
    });

    boton.classList.add("activo");
    categoriaActual = boton.dataset.categoria;

    filtrarProductos();
  });
});

if (buscadorInput) {
  buscadorInput.addEventListener("input", (event) => {
    textoBusqueda = event.target.value;
    filtrarProductos();
  });
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

if (Array.isArray(productos)) {
  productosActuales = productos;
  renderizarProductos(productosActuales);
}
