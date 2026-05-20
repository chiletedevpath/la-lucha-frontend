/* =========================
   PRODUCTOS
========================= */

const contenedorProductos = document.getElementById("productos-grid");
const buscadorInput = document.getElementById("buscador-input");
const botonesCategorias = document.querySelectorAll(".categorias-lista button");

let categoriaActual = "todos";
let textoBusqueda = "";

/* =========================
   RENDER PRODUCTOS
========================= */

function formatearPrecio(precio) {
  return `S/ ${Number(precio).toFixed(2)}`;
}

function crearCardProducto(producto) {
  const articulo = document.createElement("article");
  articulo.className = "card card--product card--interactive reveal";

  const link = document.createElement("a");
  link.className = "card__link";
  link.href = `detalle-producto.html?id=${producto.id}`;

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

  const accion = document.createElement("span");
  accion.className = "card__action";
  accion.textContent = "Ver más";

  media.append(imagen, badge);
  actions.append(precio, accion);
  body.append(titulo, descripcion, actions);
  link.append(media, body);
  articulo.append(link);

  return articulo;
}

function renderizarProductos(listaProductos) {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-productos";
    mensaje.textContent = "No se encontraron productos.";
    contenedorProductos.append(mensaje);
    return;
  }

  const fragmento = document.createDocumentFragment();

  listaProductos.forEach((producto) => {
    fragmento.append(crearCardProducto(producto));
  });

  contenedorProductos.append(fragmento);
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

  renderizarProductos(productosFiltrados);
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

/* =========================
   CARGA INICIAL
========================= */

if (Array.isArray(productos)) {
  renderizarProductos(productos);
}
