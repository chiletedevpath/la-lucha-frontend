/* =========================
   PROMOCIONES CON REACT
========================= */

const e = React.createElement;
const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl;

const IMAGENES_PROMOCIONES = {
  "combo criollo": "assets/img/promos/combocriollo.webp",
  "la brava de la casa": "assets/img/promos/labrava.webp",
  "promo universitario": "assets/img/promos/universitario.webp",
  "combo full aji": "assets/img/promos/full.webp",
  "promo familiar": "assets/img/promos/familiar.webp",
  "martes 2x1": "assets/img/promos/martes.webp",
  "donde comen 2 comen 3": "assets/img/promos/dondecomen.webp"
};

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
  if (!API_BASE_URL) {
    throw new Error("No se encontro la configuracion de la API publica.");
  }

  const respuesta = await fetch(`${API_BASE_URL}/promociones`);

  if (!respuesta.ok) {
    throw new Error(`La API respondio ${respuesta.status} en /promociones`);
  }

  const promocionesApi = await respuesta.json();

  return promocionesApi
    .filter((promocion) => promocion.estado !== false)
    .map(adaptarPromocionApi);
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

  React.useEffect(function () {
    let activo = true;

    obtenerPromocionesDesdeApi()
      .then(function (promocionesApi) {
        if (!activo) return;

        setPromociones(promocionesApi);
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
  }, []);

  if (estado === "cargando") {
    return e("p", { className: "sin-promociones" }, "Cargando promociones desde el backend...");
  }

  if (estado === "error") {
    return e(
      "p",
      { className: "sin-promociones" },
      "No se pudo cargar promociones desde el backend publico. Intenta nuevamente en unos segundos."
    );
  }

  if (!promociones.length) {
    return e("p", { className: "sin-promociones" }, "No se encontraron promociones disponibles.");
  }

  return e(
    React.Fragment,
    null,
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
