/* Contenedor donde se pintan los productos */
const contenedorProductos = document.getElementById("productos-grid");

/* Renderiza productos en pantalla */
function renderizarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  listaProductos.forEach((producto) => {
    contenedorProductos.innerHTML += `
      <article class="producto-card">
        <img src="${producto.imagen}" alt="${producto.nombre}" />

        <div class="producto-info">
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <span>S/ ${producto.precio.toFixed(2)}</span>
        </div>
      </article>
    `;
  });
}

/* Carga inicial */
renderizarProductos(productos);
