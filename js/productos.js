/* =========================
   CONTENEDOR PRODUCTOS
========================= */

/* Contenedor donde se renderizan las cards */
const contenedorProductos = document.getElementById("productos-grid");

/* Input buscador */
const buscadorInput = document.getElementById("buscador-input");

/* Botones categorías */
const botonesCategorias = document.querySelectorAll(".categorias-lista button");

/* =========================
   ESTADO GLOBAL
========================= */

/* Categoría seleccionada */
let categoriaActual = "todos";

/* Texto búsqueda */
let textoBusqueda = "";

/* =========================
   RENDER PRODUCTOS
========================= */

/* Renderiza productos dinámicamente */
function renderizarProductos(listaProductos) {
  /* Limpia contenedor */
  contenedorProductos.innerHTML = "";

  /* Si no hay productos */
  if (listaProductos.length === 0) {
    contenedorProductos.innerHTML = `

      <p class="sin-productos">
        No se encontraron productos.
      </p>

    `;

    return;
  }

  /* Recorre productos */
  listaProductos.forEach((producto) => {
    contenedorProductos.innerHTML += `

      <a
        href="detalle-producto.html?id=${producto.id}"
        class="producto-link"
      >

        <article class="producto-card">

          <!-- Imagen -->
          <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
          />

          <!-- Información -->
          <div class="producto-info">

            <h3>
              ${producto.nombre}
            </h3>

            <p>
              ${producto.descripcion}
            </p>

            <span>
              S/ ${producto.precio.toFixed(2)}
            </span>

          </div>

        </article>

      </a>

    `;
  });
}

/* =========================
   FILTRAR PRODUCTOS
========================= */

/* Filtra productos por categoría y texto */
function filtrarProductos() {
  /* Copia productos */
  let productosFiltrados = productos;

  /* =========================
     FILTRO CATEGORÍA
  ========================== */

  /* Si NO es todos */
  if (categoriaActual !== "todos") {
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.categoria === categoriaActual
    );
  }

  /* =========================
     FILTRO BUSCADOR
  ========================== */

  /* Si existe texto */
  if (textoBusqueda.trim() !== "") {
    productosFiltrados = productosFiltrados.filter(
      (producto) =>
        /* Busca nombre */
        producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        /* Busca descripción */
        producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
  }

  /* Render final */
  renderizarProductos(productosFiltrados);
}

/* =========================
   EVENTOS CATEGORÍAS
========================= */

/* Recorre botones */
botonesCategorias.forEach((boton) => {
  /* Evento click */
  boton.addEventListener("click", () => {
    /* Quita clase activa */
    botonesCategorias.forEach((btn) => {
      btn.classList.remove("activo");
    });

    /* Activa botón actual */
    boton.classList.add("activo");

    /* Guarda categoría */
    categoriaActual = boton.dataset.categoria;

    /* Filtra */
    filtrarProductos();
  });
});

/* =========================
   EVENTO BUSCADOR
========================= */

/* Escucha escritura */
buscadorInput.addEventListener("input", (event) => {
  /* Guarda texto */
  textoBusqueda = event.target.value;

  /* Filtra */
  filtrarProductos();
});

/* =========================
   CARGA INICIAL
========================= */

/* Render inicial */
renderizarProductos(productos);
