/* =========================
   PROMOCIONES CON REACT
========================= */

const e = React.createElement;
const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl;
const apiClient = window.LaLuchaApi;

const IMAGENES_PROMOCIONES = {
  "combo criollo": "assets/img/promos/combocriollo.webp",
  "la brava de la casa": "assets/img/promos/labrava.webp",
  "promo universitario": "assets/img/promos/universitario.webp",
  "combo full aji": "assets/img/promos/full.webp",
  "promo familiar": "assets/img/promos/familiar.webp",
  "martes 2x1": "assets/img/promos/martes.webp",
  "donde comen 2 comen 3": "assets/img/promos/dondecomen.webp"
};

const PROMOCIONES_RESPALDO = [
  { promocionId: 1, nombre: "Combo Criollo", descripcion: "Sanguche criollo, bebida y acompanamiento.", precioPromocional: 27.9, estado: true },
  { promocionId: 2, nombre: "La Brava de la Casa", descripcion: "Seleccion especial de la casa con sabor criollo.", precioPromocional: 32.9, estado: true },
  { promocionId: 3, nombre: "Promo Universitario", descripcion: "Opcion rapida para estudiantes.", precioPromocional: 19.9, estado: true },
  { promocionId: 4, nombre: "Promo Familiar", descripcion: "Promocion para compartir en familia.", precioPromocional: 59.9, estado: true },
  { promocionId: 5, nombre: "Martes 2x1", descripcion: "Promocion especial disponible por campana.", precioPromocional: 29.9, estado: true },
  { promocionId: 6, nombre: "Donde Comen 2 Comen 3", descripcion: "Promocion grupal para compartir.", precioPromocional: 49.9, estado: true }
];

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatearPrecio(valor) {
  const precio = Number(valor);

  if (!Number.isFinite(precio)) return "Consultar";

  return `S/. ${precio.toFixed(2)}`;
}

function formatearFecha(fecha) {
  if (!fecha) return "";

  const fechaLocal = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(fechaLocal.getTime())) return "";

  return fechaLocal.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function resolverImagenPromocion(promocion) {
  if (promocion.imagenUrl) return promocion.imagenUrl;

  const clave = normalizarTexto(promocion.nombre);

  return IMAGENES_PROMOCIONES[clave] || IMAGENES_PROMOCIONES["combo criollo"];
}

function adaptarPromocionApi(promocion) {
  const fechaInicio = formatearFecha(promocion.fechaInicio);
  const fechaFin = formatearFecha(promocion.fechaFin);
  const vigencia = fechaInicio && fechaFin ? `Vigente del ${fechaInicio} al ${fechaFin}` : "";

  return {
    id: promocion.promocionId,
    nombre: promocion.nombre,
    badge: "Promocion vigente",
    incluye: promocion.descripcion,
    extra: vigencia || "Consulta disponibilidad en el local mas cercano.",
    precioPromo: formatearPrecio(promocion.precioPromocional),
    cta: "Pedir promocion",
    imagen: resolverImagenPromocion(promocion)
  };
}

async function obtenerPromocionesDesdeApi() {
  if (apiClient) {
    const resultado = typeof apiClient.getJsonWithMeta === "function"
      ? await apiClient.getJsonWithMeta("/promociones", {
          cacheKey: "promociones",
          fallbackData: PROMOCIONES_RESPALDO,
          timeoutMs: 9000,
          retries: 1
        })
      : {
          data: await apiClient.getJson("/promociones", {
            cacheKey: "promociones",
            fallbackData: PROMOCIONES_RESPALDO,
            timeoutMs: 9000,
            retries: 1
          }),
          source: "api"
        };

    return {
      promociones: resultado.data
        .filter((promocion) => promocion.estado !== false)
        .map(adaptarPromocionApi),
      source: resultado.source
    };
  }

  if (!API_BASE_URL) {
    throw new Error("No se encontro la configuracion de la API publica.");
  }

  const respuesta = await fetch(`${API_BASE_URL}/promociones`);

  if (!respuesta.ok) {
    throw new Error(`La API respondio ${respuesta.status} en /promociones`);
  }

  const promocionesApi = await respuesta.json();

  return {
    promociones: promocionesApi
      .filter((promocion) => promocion.estado !== false)
      .map(adaptarPromocionApi),
    source: "api"
  };
}

function EstadoPromociones(props) {
  let mensaje = "";
  let detalle = "";

  if (props.estado === "cargando") {
    mensaje = "Cargando promociones desde la base pública...";
    detalle = "Si Render está iniciando, puede tardar unos segundos.";
  } else if (props.estado === "error") {
    mensaje = "No se pudieron cargar las promociones.";
    detalle = "Intenta nuevamente o revisa tu conexión.";
  } else if (props.source === "cache") {
    mensaje = "Promociones cargadas desde cache local.";
    detalle = "La web mantiene la demo disponible mientras responde la API.";
  } else if (props.source === "fallback") {
    mensaje = "Promociones de respaldo académico.";
    detalle = "Se muestran datos locales para sostener la exposición.";
  }

  if (!mensaje) return null;

  return e(
    "div",
    { className: `promociones-estado promociones-estado--${props.estado}`, role: "status" },
    e("strong", null, mensaje),
    detalle ? e("span", null, detalle) : null,
    props.estado === "error"
      ? e(
          "button",
          { className: "promociones-estado__retry", type: "button", onClick: props.onReintentar },
          "Reintentar"
        )
      : null
  );
}

function PromocionesSkeleton() {
  return e(
    React.Fragment,
    null,
    e(EstadoPromociones, { estado: "cargando" }),
    Array.from({ length: 3 }, function (_, index) {
      return e(
        "article",
        { className: "promocion-card promocion-card--skeleton", key: index, "aria-hidden": "true" },
        e("div", { className: "promocion-skeleton__media" }),
        e(
          "div",
          { className: "promocion-skeleton__body" },
          e("span", { className: "promocion-skeleton__line promocion-skeleton__line--short" }),
          e("span", { className: "promocion-skeleton__line promocion-skeleton__line--title" }),
          e("span", { className: "promocion-skeleton__line" }),
          e("span", { className: "promocion-skeleton__line promocion-skeleton__line--button" })
        )
      );
    })
  );
}

function PromocionCard(props) {
  const promocion = props.promocion;
  const posicionInvertida = props.index % 2 !== 0;
  const clases = `promocion-card reveal active ${
    posicionInvertida ? "promocion-card--reverse reveal-delay-1" : ""
  }`;

  return e(
    "article",
    { className: clases, "aria-label": `Promocion ${promocion.nombre}` },
    e(
      "div",
      { className: "promocion-imagen" },
      e("img", {
        src: promocion.imagen,
        alt: `Promocion ${promocion.nombre}`,
        loading: "lazy"
      })
    ),
    e(
      "div",
      { className: "promocion-contenido" },
      e("span", { className: "promocion-badge" }, promocion.badge || "Promocion especial"),
      e("p", { className: "promocion-incluye" }, promocion.incluye),
      e("p", { className: "promocion-extra" }, promocion.extra),
      e(
        "div",
        { className: "promocion-precios", "aria-label": "Precio de la promocion" },
        promocion.precioOriginal
          ? e(
              "span",
              { className: "promocion-precio-original" },
              promocion.precioOriginal
            )
          : null,
        e("strong", { className: "promocion-precio-final" }, promocion.precioPromo)
      ),
      e(
        "a",
        {
          className: "promocion-btn",
          href: `pedido.html?promocion=${encodeURIComponent(promocion.nombre)}`,
          "aria-label": `Pedir promocion ${promocion.nombre}`
        },
        promocion.cta || "Pedir promocion"
      )
    )
  );
}

function PromocionesApp() {
  const [promociones, setPromociones] = React.useState([]);
  const [estado, setEstado] = React.useState("cargando");
  const [source, setSource] = React.useState("api");
  const [intentoCarga, setIntentoCarga] = React.useState(0);

  React.useEffect(function () {
    let activo = true;

    setEstado("cargando");

    obtenerPromocionesDesdeApi()
      .then(function (resultado) {
        if (!activo) return;

        setPromociones(resultado.promociones);
        setSource(resultado.source);
        setEstado("listo");
      })
      .catch(function (error) {
        if (!activo) return;

        console.error("No se pudo cargar promociones desde la API publica.", error);
        setPromociones([]);
        setEstado("error");
      });

    return function () {
      activo = false;
    };
  }, [intentoCarga]);

  if (estado === "cargando") {
    return e(PromocionesSkeleton);
  }

  if (estado === "error") {
    return e(EstadoPromociones, {
      estado,
      onReintentar: function () {
        setIntentoCarga((valor) => valor + 1);
      }
    });
  }

  if (!promociones.length) {
    return e("p", { className: "sin-promociones" }, "No se encontraron promociones disponibles.");
  }

  return e(
    React.Fragment,
    null,
    e(EstadoPromociones, { estado, source }),
    promociones.map(function (promocion, index) {
      return e(PromocionCard, {
        key: promocion.id || promocion.nombre,
        promocion,
        index
      });
    })
  );
}

const promocionesRoot = document.getElementById("promociones-container");

if (promocionesRoot) {
  ReactDOM.createRoot(promocionesRoot).render(e(PromocionesApp));
}
