const contenedorLocales = document.getElementById("locales-container");

function renderizarLocales(listaLocales) {

  contenedorLocales.innerHTML = "";

  listaLocales.forEach((local, index) => {

    const posicionInvertida = index % 2 !== 0;

    contenedorLocales.innerHTML += `

      <article class="local-card ${posicionInvertida ? "reverse" : ""}">

        <div class="local-imagen">
          <img src="${local.imagen}" alt="${local.nombre}">
        </div>

        <div class="local-info">

          <h2>${local.nombre}</h2>

          <p>
            <strong>Dirección:</strong>
            ${local.direccion}
          </p>

          <p>
            <strong>Horario:</strong>
            ${local.horario}
          </p>

          <p>
            <strong>Teléfono:</strong>
            ${local.telefono}
          </p>

          <a href="${local.maps}" target="_blank">
            Ver ubicación
          </a>

        </div>

      </article>
    `;
  });
}

renderizarLocales(locales);
