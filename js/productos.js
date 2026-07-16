/* =========================
   CARTA CON REACT
========================= */

const e = React.createElement;
const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl;
const apiClient = window.LaLuchaApi;
const solicitudStore = window.LaLuchaSolicitud;
const PRODUCTO_ID_MAX_CATALOGO = 20;
const PRODUCTOS_POR_PAGINA = 6;

const CATEGORIAS = [
  { id: "todos", label: "Todos", icono: "apps" },
  { id: "sanguches", label: "Sanguches", icono: "lunch_dining" },
  { id: "bebidas", label: "Bebidas", icono: "local_cafe" },
  { id: "acompanamientos", label: "Acompanamientos", icono: "restaurant" },
  { id: "combos", label: "Combos", icono: "fastfood" },
  { id: "postres", label: "Postres", icono: "bakery_dining" },
  { id: "promociones", label: "Promociones", icono: "sell" }
];

const IMAGENES_FALLBACK = {
  chicharron: "assets/img/productos/sanguches/chicharron.webp",
  pavo: "assets/img/productos/sanguches/pavo.webp",
  chicha: "assets/img/productos/bebidas/chicha.webp",
  cafe: "assets/img/productos/bebidas/cafe.webp",
  emoliente: "assets/img/productos/bebidas/emoliente.webp",
  gaseosa: "assets/img/productos/bebidas/gaseosa-personal.webp",
  limonada: "assets/img/productos/bebidas/limonada-frozen.webp",
  camote: "assets/img/productos/acompanamientos/camote-frito.webp",
  papasPersonales: "assets/img/productos/acompanamientos/papas-fritas-personales.webp",
  papasFamiliares: "assets/img/productos/acompanamientos/papas-fritas-familiar.webp",
  salsaCriolla: "assets/img/productos/acompanamientos/salsa-criolla-extra.webp",
  comboCriollo: "assets/img/productos/combos/combo-criollo-personal.webp",
  comboFamiliar: "assets/img/productos/combos/combo-familiar.webp",
  comboFull: "assets/img/productos/combos/combo-full-aji.webp",
  alfajor: "assets/img/productos/postres/alfajor-artesanal.webp",
  mazamorra: "assets/img/productos/postres/mazamorra-morada.webp",
  sanguches: "assets/img/productos/sanguches/chicharron.webp",
  bebidas: "assets/img/productos/bebidas/chicha.webp",
  acompanamientos: "assets/img/productos/acompanamientos/papas-fritas-personales.webp",
  combos: "assets/img/productos/combos/combo-criollo-personal.webp",
  postres: "assets/img/productos/postres/alfajor-artesanal.webp",
  promociones: "assets/img/productos/sanguches/chicharron.webp"
};

const CATEGORIAS_RESPALDO = [
  { categoriaId: 1, nombre: "Sanguches" },
  { categoriaId: 2, nombre: "Bebidas" },
  { categoriaId: 3, nombre: "Acompanamientos" },
  { categoriaId: 4, nombre: "Combos" },
  { categoriaId: 5, nombre: "Postres" },
  { categoriaId: 6, nombre: "Promociones" }
];

const PRODUCTOS_RESPALDO = [
  { productoId: 1, nombre: "Sanguche de Chicharron", categoriaId: 1, descripcion: "Pan artesanal con chicharron crocante, camote frito y salsa criolla.", precio: 18.9, destacado: true, estado: true },
  { productoId: 2, nombre: "Sanguche de Pavo", categoriaId: 1, descripcion: "Pavo jugoso acompanado de pan artesanal y salsas de la casa.", precio: 19.9, destacado: true, estado: true },
  { productoId: 3, nombre: "Sanguche de Asado", categoriaId: 1, descripcion: "Asado jugoso con salsa criolla y pan artesanal recien tostado.", precio: 20.9, destacado: true, estado: true },
  { productoId: 4, nombre: "Sanguche Mixto", categoriaId: 1, descripcion: "Jamon, queso y pan artesanal dorado.", precio: 14.9, destacado: false, estado: true },
  { productoId: 5, nombre: "Sanguche de Pollo", categoriaId: 1, descripcion: "Pollo sazonado con acompanamientos criollos.", precio: 17.9, destacado: false, estado: true },
  { productoId: 6, nombre: "Hamburguesa Criolla", categoriaId: 1, descripcion: "Hamburguesa con toque criollo y salsas de la casa.", precio: 18.9, destacado: false, estado: true },
  { productoId: 7, nombre: "Chicha Morada", categoriaId: 2, descripcion: "Bebida tradicional peruana servida fria.", precio: 7.9, destacado: true, estado: true },
  { productoId: 8, nombre: "Cafe Pasado", categoriaId: 2, descripcion: "Cafe peruano recien preparado.", precio: 6.9, destacado: false, estado: true },
  { productoId: 9, nombre: "Emoliente", categoriaId: 2, descripcion: "Bebida herbal tradicional.", precio: 6.9, destacado: false, estado: true },
  { productoId: 10, nombre: "Limonada Frozen", categoriaId: 2, descripcion: "Limonada helada y refrescante.", precio: 8.9, destacado: false, estado: true },
  { productoId: 11, nombre: "Camote Frito", categoriaId: 3, descripcion: "Porcion de camote frito para acompanar.", precio: 6.9, destacado: false, estado: true },
  { productoId: 12, nombre: "Papas Fritas Personales", categoriaId: 3, descripcion: "Papas doradas en porcion personal.", precio: 7.9, destacado: false, estado: true },
  { productoId: 13, nombre: "Salsa Criolla Extra", categoriaId: 3, descripcion: "Porcion adicional de salsa criolla.", precio: 3.9, destacado: false, estado: true },
  { productoId: 14, nombre: "Combo Criollo Personal", categoriaId: 4, descripcion: "Sanguche, bebida y acompanamiento.", precio: 27.9, destacado: true, estado: true },
  { productoId: 15, nombre: "Combo Familiar", categoriaId: 4, descripcion: "Seleccion criolla para compartir.", precio: 59.9, destacado: true, estado: true },
  { productoId: 16, nombre: "Alfajor Artesanal", categoriaId: 5, descripcion: "Postre artesanal con manjar.", precio: 6.9, destacado: false, estado: true },
  { productoId: 17, nombre: "Mazamorra Morada", categoriaId: 5, descripcion: "Postre tradicional peruano.", precio: 7.9, destacado: false, estado: true }
];

function formatearPrecio(precio) {
  const precioNumerico = Number(precio);

  if (!Number.isFinite(precioNumerico)) return "S/ 0.00";

  return `S/ ${precioNumerico.toFixed(2)}`;
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizarCategoriaApi(nombreCategoria) {
  const categoria = normalizarTexto(nombreCategoria);

  if (categoria.includes("sanguch")) return "sanguches";
  if (categoria.includes("bebida")) return "bebidas";
  if (categoria.includes("acompan")) return "acompanamientos";
  if (categoria.includes("combo")) return "combos";
  if (categoria.includes("postre")) return "postres";
  if (categoria.includes("promocion")) return "promociones";

  return "sanguches";
}

function obtenerCategoriaPorId(categoriaId, categoriasPorId) {
  const categoriaNormalizada = categoriasPorId[categoriaId];

  if (categoriaNormalizada) return categoriaNormalizada;
  if (categoriaId === 1) return "sanguches";
  if (categoriaId === 2) return "bebidas";
  if (categoriaId === 3) return "acompanamientos";
  if (categoriaId === 4) return "combos";
  if (categoriaId === 5) return "postres";
  if (categoriaId === 6) return "promociones";

  return "sanguches";
}

function resolverImagenProducto(producto, categoria) {
  const nombreNormalizado = normalizarTexto(producto.nombre);

  if (nombreNormalizado.includes("chicharron")) return IMAGENES_FALLBACK.chicharron;
  if (nombreNormalizado.includes("pavo")) return IMAGENES_FALLBACK.pavo;
  if (nombreNormalizado.includes(" de asado") || nombreNormalizado.startsWith("asado")) {
    return "assets/img/productos/sanguches/asado.webp";
  }
  if (nombreNormalizado.includes("mixto")) return "assets/img/productos/sanguches/mixto.webp";
  if (nombreNormalizado.includes("pollo")) return "assets/img/productos/sanguches/pollo.webp";
  if (nombreNormalizado.includes("hamburguesa")) {
    return "assets/img/productos/sanguches/hamburguesa.webp";
  }
  if (nombreNormalizado.includes("chicha")) return IMAGENES_FALLBACK.chicha;
  if (nombreNormalizado.includes("cafe")) return IMAGENES_FALLBACK.cafe;
  if (nombreNormalizado.includes("emoliente")) return IMAGENES_FALLBACK.emoliente;
  if (nombreNormalizado.includes("gaseosa")) return IMAGENES_FALLBACK.gaseosa;
  if (nombreNormalizado.includes("limonada")) return IMAGENES_FALLBACK.limonada;
  if (nombreNormalizado.includes("camote")) return IMAGENES_FALLBACK.camote;
  if (nombreNormalizado.includes("papas") && nombreNormalizado.includes("familiar")) {
    return IMAGENES_FALLBACK.papasFamiliares;
  }
  if (nombreNormalizado.includes("papas")) return IMAGENES_FALLBACK.papasPersonales;
  if (nombreNormalizado.includes("salsa criolla")) return IMAGENES_FALLBACK.salsaCriolla;
  if (nombreNormalizado.includes("combo") && nombreNormalizado.includes("familiar")) {
    return IMAGENES_FALLBACK.comboFamiliar;
  }
  if (nombreNormalizado.includes("combo") && nombreNormalizado.includes("full")) {
    return IMAGENES_FALLBACK.comboFull;
  }
  if (nombreNormalizado.includes("combo")) return IMAGENES_FALLBACK.comboCriollo;
  if (nombreNormalizado.includes("alfajor")) return IMAGENES_FALLBACK.alfajor;
  if (nombreNormalizado.includes("mazamorra")) return IMAGENES_FALLBACK.mazamorra;

  if (producto.imagenUrl) return producto.imagenUrl;

  return IMAGENES_FALLBACK[categoria] || IMAGENES_FALLBACK.sanguches;
}

function adaptarProductoApi(producto, categoriasPorId) {
  const categoria = obtenerCategoriaPorId(producto.categoriaId, categoriasPorId);

  return {
    id: producto.productoId,
    nombre: producto.nombre,
    categoria,
    descripcion: producto.descripcion,
    precio: producto.precio,
    pedido: producto.destacado ? 90 : 70,
    imagen: resolverImagenProducto(producto, categoria)
  };
}

async function obtenerJsonApi(ruta) {
  if (apiClient) {
    const fallbackData = ruta === "/productos" ? PRODUCTOS_RESPALDO : CATEGORIAS_RESPALDO;
    return apiClient.getJson(ruta, {
      cacheKey: ruta.replace("/", ""),
      fallbackData,
      timeoutMs: 9000,
      retries: 1
    });
  }

  if (!API_BASE_URL) {
    throw new Error("No se encontro la configuracion de la API publica.");
  }

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`);

  if (!respuesta.ok) {
    throw new Error(`La API respondio ${respuesta.status} en ${ruta}`);
  }

  return respuesta.json();
}

async function cargarProductosDesdeApi() {
  const usarMeta = typeof apiClient?.getJsonWithMeta === "function";
  const opcionesProductos = {
    cacheKey: "productos",
    fallbackData: PRODUCTOS_RESPALDO,
    timeoutMs: 9000,
    retries: 1
  };
  const opcionesCategorias = {
    cacheKey: "categorias",
    fallbackData: CATEGORIAS_RESPALDO,
    timeoutMs: 9000,
    retries: 1
  };
  const [resultadoProductos, resultadoCategorias] = usarMeta
    ? await Promise.all([
        apiClient.getJsonWithMeta("/productos", opcionesProductos),
        apiClient.getJsonWithMeta("/categorias", opcionesCategorias)
      ])
    : await Promise.all([
        obtenerJsonApi("/productos").then((data) => ({ data, source: "api" })),
        obtenerJsonApi("/categorias").then((data) => ({ data, source: "api" }))
      ]);

  const productosApi = resultadoProductos.data;
  const categoriasApi = resultadoCategorias.data;
  const source =
    resultadoProductos.source === "fallback" || resultadoCategorias.source === "fallback"
      ? "fallback"
      : resultadoProductos.source === "cache" || resultadoCategorias.source === "cache"
        ? "cache"
        : "api";

  const categoriasPorId = categoriasApi.reduce((mapa, categoria) => {
    mapa[categoria.categoriaId] = normalizarCategoriaApi(categoria.nombre);
    return mapa;
  }, {});

  return {
    productos: productosApi
      .filter(
        (producto) =>
          producto.estado !== false && Number(producto.productoId) <= PRODUCTO_ID_MAX_CATALOGO
      )
      .map((producto) => adaptarProductoApi(producto, categoriasPorId)),
    source
  };
}

function obtenerEtiquetaPopularidad(pedido) {
  if (Number(pedido) >= 90) return "Mas pedido";
  if (Number(pedido) >= 80) return "Favorito criollo";
  return "Para acompanar";
}

function contarPorCategoria(productos, categoria) {
  if (categoria === "todos") return productos.length;

  return productos.filter(
    (producto) => normalizarTexto(producto.categoria) === normalizarTexto(categoria)
  ).length;
}

function filtrarProductos(productos, categoriaActual, textoBusqueda) {
  const busquedaNormalizada = normalizarTexto(textoBusqueda);

  return productos.filter((producto) => {
    const coincideCategoria =
      categoriaActual === "todos" ||
      normalizarTexto(producto.categoria) === normalizarTexto(categoriaActual);
    const textoProducto = normalizarTexto(
      `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
    );
    const coincideBusqueda = !busquedaNormalizada || textoProducto.includes(busquedaNormalizada);

    return coincideCategoria && coincideBusqueda;
  });
}

function actualizarMetricasHero(productos) {
  const totalProductosHero = document.getElementById("carta-total-productos");
  const totalCategoriasHero = document.getElementById("carta-total-categorias");

  if (totalProductosHero) {
    totalProductosHero.textContent = productos.length;
  }

  if (totalCategoriasHero) {
    totalCategoriasHero.textContent = new Set(productos.map((producto) => producto.categoria)).size;
  }
}

function agregarProductoASolicitud(producto) {
  if (!solicitudStore) {
    window.location.href = `pedido.html?productoId=${encodeURIComponent(producto.id)}`;
    return;
  }

  solicitudStore.agregarItem({
    id: producto.id,
    tipo: "producto",
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: 1,
    imagen: producto.imagen
  });
}

function MiniSolicitud() {
  const [resumen, setResumen] = React.useState({ cantidadTotal: 0, total: 0 });

  React.useEffect(function () {
    if (!solicitudStore) return undefined;

    function actualizar() {
      setResumen(solicitudStore.calcularTotales(solicitudStore.obtenerSolicitud()));
    }

    actualizar();
    window.addEventListener("la-lucha:solicitud-actualizada", actualizar);

    return function () {
      window.removeEventListener("la-lucha:solicitud-actualizada", actualizar);
    };
  }, []);

  if (!solicitudStore || resumen.cantidadTotal === 0) return null;

  return e(
    "aside",
    { className: "solicitud-mini", id: "solicitud-mini", "aria-live": "polite" },
    e(
      "div",
      { className: "solicitud-mini__info" },
      e("span", { className: "solicitud-mini__label" }, "Tu solicitud"),
      e(
        "strong",
        { id: "solicitud-mini-cantidad" },
        resumen.cantidadTotal === 1 ? "1 producto" : `${resumen.cantidadTotal} productos`
      ),
      e("span", { id: "solicitud-mini-total" }, `Total: ${formatearPrecio(resumen.total)}`)
    ),
    e(
      "div",
      { className: "solicitud-mini__actions" },
      e(
        "button",
        {
          className: "solicitud-mini__ghost",
          type: "button",
          onClick: function () {
            solicitudStore.limpiarSolicitud();
          }
        },
        "Vaciar"
      ),
      e("a", { className: "solicitud-mini__link", href: "pedido.html" }, "Ver solicitud")
    )
  );
}

function Toolbar(props) {
  return e(
    "div",
    { className: "carta-toolbar", "aria-label": "Buscar y filtrar productos" },
    e(
      "div",
      { className: "buscador-container" },
      e("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, "search"),
      e("input", {
        type: "text",
        id: "buscador-input",
        "aria-label": "Buscar productos en la carta",
        placeholder: "Buscar chicharron, cafe, chicha...",
        value: props.textoBusqueda,
        onChange: function (event) {
          props.onBuscar(event.target.value);
        }
      })
    ),
    e(
      "div",
      { className: "categorias-lista", "aria-label": "Filtrar productos por categoria" },
      CATEGORIAS.map(function (categoria) {
        const activo = props.categoriaActual === categoria.id;

        return e(
          "button",
          {
            key: categoria.id,
            type: "button",
            className: activo ? "activo" : "",
            "data-categoria": categoria.id,
            "aria-pressed": String(activo),
            onClick: function () {
              props.onCategoria(categoria.id);
            }
          },
          e("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, categoria.icono),
          e("span", { className: "categoria-label" }, categoria.label),
          e(
            "span",
            { className: "categoria-count" },
            contarPorCategoria(props.productos, categoria.id)
          )
        );
      })
    ),
    e(
      "button",
      {
        className: "carta-toolbar__clear",
        id: "limpiar-filtros",
        type: "button",
        hidden: props.categoriaActual === "todos" && !props.textoBusqueda.trim(),
        onClick: props.onLimpiar
      },
      "Limpiar"
    )
  );
}

function EstadoProductos(props) {
  const totalPaginas = Math.ceil(props.total / PRODUCTOS_POR_PAGINA);
  let mensaje = "";
  let detalle = "";

  if (props.estadoCarga === "cargando") {
    mensaje = "Cargando carta desde la base pública...";
    detalle = "Si Render está iniciando, esto puede tardar unos segundos.";
  } else if (props.estadoCarga === "error") {
    mensaje = "No se pudo cargar la carta en este momento.";
    detalle = "Revisa tu conexión o intenta nuevamente.";
  } else if (props.total === 0) {
    mensaje = props.textoBusqueda.trim()
      ? `No encontramos resultados para "${props.textoBusqueda.trim()}".`
      : "No hay productos disponibles en esta categoria.";
  } else {
    const rangoInicio = (props.paginaActual - 1) * PRODUCTOS_POR_PAGINA + 1;
    const rangoFin = Math.min(props.paginaActual * PRODUCTOS_POR_PAGINA, props.total);
    const busqueda = props.textoBusqueda.trim()
      ? ` con la busqueda "${props.textoBusqueda.trim()}"`
      : "";

    mensaje =
      `Mostrando ${rangoInicio}-${rangoFin} de ${props.total} productos${busqueda}.` +
      (totalPaginas > 1 ? ` Pagina ${props.paginaActual} de ${totalPaginas}.` : "");

    if (props.fuenteDatos === "api") {
      detalle = "API pública conectada.";
    } else if (props.fuenteDatos === "cache") {
      detalle = "Usando datos guardados de la API pública.";
    } else if (props.fuenteDatos === "fallback") {
      detalle = "Trabajando con demo disponible mientras se recupera la API pública.";
    }
  }

  return e(
    "div",
    {
      className: `productos-estado productos-estado--${props.estadoCarga}`,
      id: "productos-estado",
      "aria-live": "polite"
    },
    e("strong", null, mensaje),
    detalle ? e("span", null, detalle) : null,
    props.estadoCarga === "error"
      ? e(
          "button",
          { className: "productos-estado__retry", type: "button", onClick: props.onReintentar },
          "Reintentar"
        )
      : null
  );
}

function SkeletonProductos() {
  return e(
    "div",
    { className: "productos-grid productos-grid--skeleton", id: "productos-grid", "aria-hidden": "true" },
    Array.from({ length: PRODUCTOS_POR_PAGINA }, function (_, index) {
      return e(
        "article",
        { className: "card card--product skeleton-card", key: index },
        e("div", { className: "skeleton-card__media" }),
        e(
          "div",
          { className: "skeleton-card__body" },
          e("span", { className: "skeleton-line skeleton-line--short" }),
          e("span", { className: "skeleton-line skeleton-line--title" }),
          e("span", { className: "skeleton-line" }),
          e("span", { className: "skeleton-line skeleton-line--button" })
        )
      );
    })
  );
}

function CardProducto(props) {
  const producto = props.producto;

  return e(
    "article",
    { className: "card card--product card--interactive", "aria-label": `Producto ${producto.nombre}` },
    e(
      "div",
      { className: "card__media" },
      e("img", {
        className: "card__image",
        src: producto.imagen,
        alt: producto.nombre,
        loading: "lazy"
      }),
      e("span", { className: "card__badge" }, producto.categoria)
    ),
    e(
      "div",
      { className: "card__body" },
      e(
        "span",
        { className: "card__popularidad" },
        e(
          "span",
          { className: "material-symbols-rounded", "aria-hidden": "true" },
          "local_fire_department"
        ),
        e("span", null, obtenerEtiquetaPopularidad(producto.pedido))
      ),
      e("h3", { className: "card__title" }, producto.nombre),
      e("p", { className: "card__text" }, producto.descripcion),
      e(
        "div",
        { className: "card__actions" },
        e("span", { className: "card__price" }, formatearPrecio(producto.precio)),
        e(
          "button",
          {
            className: "card__action card__action--button",
            type: "button",
            "aria-label": `Agregar ${producto.nombre} a la solicitud`,
            onClick: function () {
              agregarProductoASolicitud(producto);
            }
          },
          "Agregar"
        )
      )
    )
  );
}

function GridProductos(props) {
  const productosPagina = props.productosFiltrados.slice(
    (props.paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    props.paginaActual * PRODUCTOS_POR_PAGINA
  );

  if (props.estadoCarga === "error" || props.estadoCarga === "cargando") {
    return props.estadoCarga === "cargando"
      ? e(SkeletonProductos)
      : e("div", { className: "productos-grid", id: "productos-grid" });
  }

  return e(
    "div",
    { className: "productos-grid is-refreshing", id: "productos-grid" },
    productosPagina.length
      ? productosPagina.map(function (producto) {
          return e(CardProducto, { key: producto.id, producto: producto });
        })
      : e(
          "p",
          { className: "sin-productos" },
          "Prueba con otra categoria o limpia la busqueda para ver toda la carta."
        )
  );
}

function Paginacion(props) {
  const totalPaginas = Math.ceil(props.total / PRODUCTOS_POR_PAGINA);
  const deshabilitarAnterior = props.paginaActual <= 1;
  const deshabilitarSiguiente = props.paginaActual >= totalPaginas || totalPaginas <= 1;

  function cambiarPagina(pagina) {
    props.onPagina(pagina);
    document.querySelector(".carta-productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return e(
    "nav",
    { className: "paginacion", "aria-label": "Paginacion de productos" },
    e(
      "button",
      {
        className: "paginacion__btn",
        id: "btn-anterior",
        type: "button",
        "aria-label": "Ir a la pagina anterior",
        "aria-disabled": String(deshabilitarAnterior),
        disabled: deshabilitarAnterior,
        onClick: function () {
          cambiarPagina(Math.max(1, props.paginaActual - 1));
        }
      },
      "Anterior"
    ),
    e(
      "div",
      { className: "paginacion__numeros", id: "paginacion-numeros" },
      Array.from({ length: totalPaginas }, function (_, index) {
        const numeroPagina = index + 1;
        const activo = numeroPagina === props.paginaActual;

        return e(
          "button",
          {
            key: numeroPagina,
            type: "button",
            className: activo ? "paginacion__numero paginacion__numero--activo" : "paginacion__numero",
            "aria-label": `Ir a la pagina ${numeroPagina}`,
            "aria-current": activo ? "page" : undefined,
            onClick: function () {
              cambiarPagina(numeroPagina);
            }
          },
          numeroPagina
        );
      })
    ),
    e(
      "button",
      {
        className: "paginacion__btn",
        id: "btn-siguiente",
        type: "button",
        "aria-label": "Ir a la pagina siguiente",
        "aria-disabled": String(deshabilitarSiguiente),
        disabled: deshabilitarSiguiente,
        onClick: function () {
          cambiarPagina(Math.min(totalPaginas, props.paginaActual + 1));
        }
      },
      "Siguiente"
    )
  );
}

function CartaApp() {
  const [productos, setProductos] = React.useState([]);
  const [estadoCarga, setEstadoCarga] = React.useState("cargando");
  const [fuenteDatos, setFuenteDatos] = React.useState("api");
  const [categoriaActual, setCategoriaActual] = React.useState("todos");
  const [textoBusqueda, setTextoBusqueda] = React.useState("");
  const [paginaActual, setPaginaActual] = React.useState(1);
  const [intentoCarga, setIntentoCarga] = React.useState(0);

  React.useEffect(function () {
    let activo = true;

    setEstadoCarga("cargando");

    cargarProductosDesdeApi()
      .then(function (resultado) {
        if (!activo) return;

        setProductos(resultado.productos);
        setFuenteDatos(resultado.source);
        actualizarMetricasHero(resultado.productos);
        setEstadoCarga("listo");
      })
      .catch(function (error) {
        if (!activo) return;

        console.error("No se pudo cargar productos desde la API publica.", error);
        actualizarMetricasHero([]);
        setEstadoCarga("error");
      });

    return function () {
      activo = false;
    };
  }, [intentoCarga]);

  const productosFiltrados = React.useMemo(
    function () {
      return filtrarProductos(productos, categoriaActual, textoBusqueda);
    },
    [productos, categoriaActual, textoBusqueda]
  );

  React.useEffect(
    function () {
      setPaginaActual(1);
    },
    [categoriaActual, textoBusqueda]
  );

  function limpiarFiltros() {
    setCategoriaActual("todos");
    setTextoBusqueda("");
  }

  return e(
    React.Fragment,
    null,
    e(Toolbar, {
      productos: productos,
      categoriaActual: categoriaActual,
      textoBusqueda: textoBusqueda,
      onCategoria: setCategoriaActual,
      onBuscar: setTextoBusqueda,
      onLimpiar: limpiarFiltros
    }),
    e(EstadoProductos, {
      estadoCarga: estadoCarga,
      total: productosFiltrados.length,
      paginaActual: paginaActual,
      textoBusqueda: textoBusqueda,
      fuenteDatos: fuenteDatos,
      onReintentar: function () {
        setIntentoCarga((valor) => valor + 1);
      }
    }),
    e(GridProductos, {
      estadoCarga: estadoCarga,
      productosFiltrados: productosFiltrados,
      paginaActual: paginaActual
    }),
    e(Paginacion, {
      total: productosFiltrados.length,
      paginaActual: paginaActual,
      onPagina: setPaginaActual
    }),
    e(MiniSolicitud)
  );
}

const root = document.getElementById("carta-react-root");

if (root) {
  ReactDOM.createRoot(root).render(e(CartaApp));
}
