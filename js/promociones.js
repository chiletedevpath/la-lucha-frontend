const contenedorLocales = document.getElementById("promociones-container");

function renderizarPromociones(listaPromociones) {

  contenedorLocales.innerHTML = "";

  listaPromociones.forEach((promocion, index) => {

    const posicionInvertida = index % 2 !== 0;

    contenedorLocales.innerHTML += `

      <article class="promociones-card">

        <div class="promociones-imagen">
          <img src="${promocion.imagen}" alt="${promocion.nombre}">
        </div>

        <div class="promociones-info">

          <h2>${promocion.nombre}</h2>

          <p>
            ${promocion.incluye}
          </p>
            ${promocion.extra?
              `<span class="promo-extra">${promocion.extra}</span><br>`:""}

          <p>
            ${promocion.precioOriginal?
              `<span class="precio-original">${promocion.precioOriginal}</span><br>`:""}

            <span class="precio-promo">${promocion.precioPromo}</span><br>
          </p>

        </div>

      </article>
    `;
  });
}

renderizarPromociones(promociones);
