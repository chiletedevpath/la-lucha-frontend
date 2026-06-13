/* =========================
   PEDIDO
========================= */

const pedidoForm = document.getElementById("pedido-form");
const tipoPedidoSelect = document.getElementById("tipo-pedido");
const productoPedidoInput = document.getElementById("producto-pedido");
const origenPedidoInput = document.getElementById("origen-pedido");
const itemPedidoInput = document.getElementById("item-pedido");
const mensajeTextarea = document.getElementById("mensaje");
const feedbackPedido = document.getElementById("pedido-feedback");
const nombreInput = document.getElementById("nombre");
const telefonoInput = document.getElementById("telefono");
const correoInput = document.getElementById("correo");
const cantidadInput = document.getElementById("cantidad");

const pedidoImagenPreview = document.getElementById("pedido-imagen-preview");
const pedidoPrecioPreview = document.getElementById("pedido-precio-preview");
const pedidoTotalPreview = document.getElementById("pedido-total-preview");
const pedidoDetallePreview = document.getElementById("pedido-detalle-preview");

const pedidoTipoPreview = document.getElementById("pedido-tipo-preview");
const pedidoNombrePreview = document.getElementById("pedido-nombre-preview");
const pedidoResumenTexto = document.getElementById("pedido-resumen-texto");

const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl;
const IMAGEN_FALLBACK = "assets/img/productos/sanguches/chicharron.webp";

let productoSeleccionado = null;

/* =========================
   UTILIDADES
========================= */

function obtenerParametroUrl(nombreParametro) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nombreParametro);
}

function limpiarTexto(texto) {
  return typeof texto === "string" ? texto.trim() : "";
}

function formatearPrecio(precio) {
  const precioNumerico = Number(precio);

  if (!Number.isFinite(precioNumerico)) return "";

  return `S/ ${precioNumerico.toFixed(2)}`;
}

function mostrarFeedback(mensaje, tipo = "exito") {
  if (!feedbackPedido) return;

  feedbackPedido.textContent = mensaje;
  feedbackPedido.dataset.estado = tipo;
}

function obtenerEtiquetaTipo(tipo) {
  if (tipo === "producto") return "Pedido de producto";
  if (tipo === "promocion") return "Pedido de promocion";
  return "Solicitud general";
}

function actualizarResumen(tipo, nombre, detalle = "") {
  if (!pedidoTipoPreview || !pedidoNombrePreview || !pedidoResumenTexto) return;

  pedidoTipoPreview.textContent = obtenerEtiquetaTipo(tipo);
  pedidoNombrePreview.textContent = nombre || "Sin producto seleccionado";

  pedidoResumenTexto.textContent =
    detalle ||
    (nombre
      ? "Este es el detalle detectado desde la carta o promociones."
      : "Puedes completar manualmente el producto o promocion que deseas solicitar.");
}

function obtenerCantidadActual() {
  const cantidad = Number(cantidadInput?.value || 1);

  if (!Number.isFinite(cantidad) || cantidad < 1) return 1;

  return Math.trunc(cantidad);
}

function resolverImagenProducto(producto) {
  return limpiarTexto(producto?.imagenUrl) || IMAGEN_FALLBACK;
}

function limpiarDetalleProducto() {
  productoSeleccionado = null;

  if (pedidoDetallePreview) {
    pedidoDetallePreview.hidden = true;
  }

  if (pedidoImagenPreview) {
    pedidoImagenPreview.removeAttribute("src");
    pedidoImagenPreview.alt = "";
  }

  if (pedidoPrecioPreview) {
    pedidoPrecioPreview.textContent = "";
  }

  if (pedidoTotalPreview) {
    pedidoTotalPreview.textContent = "";
  }
}

function actualizarDetalleProducto(producto) {
  if (!pedidoDetallePreview || !pedidoImagenPreview || !pedidoPrecioPreview || !pedidoTotalPreview) {
    return;
  }

  const precio = Number(producto.precio);

  if (!Number.isFinite(precio)) {
    limpiarDetalleProducto();
    return;
  }

  const cantidad = obtenerCantidadActual();
  const total = precio * cantidad;

  productoSeleccionado = producto;
  pedidoDetallePreview.hidden = false;

  pedidoImagenPreview.src = resolverImagenProducto(producto);
  pedidoImagenPreview.alt = producto.nombre ? `Imagen de ${producto.nombre}` : "Producto seleccionado";
  pedidoImagenPreview.onerror = () => {
    pedidoImagenPreview.src = IMAGEN_FALLBACK;
  };

  pedidoPrecioPreview.textContent = `Precio unitario: ${formatearPrecio(precio)}`;
  pedidoTotalPreview.textContent = `Total estimado: ${formatearPrecio(total)}`;
}

function sincronizarCamposOcultos(tipo, nombre) {
  if (origenPedidoInput) {
    origenPedidoInput.value = tipo;
  }

  if (itemPedidoInput) {
    itemPedidoInput.value = nombre;
  }
}

async function obtenerProductoPorId(productoId) {
  if (!API_BASE_URL) {
    throw new Error("No se encontro la configuracion de la API publica.");
  }

  const respuesta = await fetch(`${API_BASE_URL}/productos/${productoId}`);

  if (!respuesta.ok) {
    throw new Error(`La API respondio ${respuesta.status} al buscar el producto.`);
  }

  return respuesta.json();
}

/* =========================
   PRECARGA DESDE URL
========================= */

async function prepararPedidoDesdeUrl() {
  if (!tipoPedidoSelect || !productoPedidoInput) return;

  const productoId = limpiarTexto(obtenerParametroUrl("productoId"));
  const producto = limpiarTexto(obtenerParametroUrl("producto"));
  const promocion = limpiarTexto(obtenerParametroUrl("promocion"));

  if (productoId) {
    try {
      const productoApi = await obtenerProductoPorId(productoId);
      const nombreProducto = limpiarTexto(productoApi.nombre);
      const precioProducto = formatearPrecio(productoApi.precio);

      tipoPedidoSelect.value = "producto";
      productoPedidoInput.value = nombreProducto;
      sincronizarCamposOcultos("producto", nombreProducto);

      if (mensajeTextarea && !mensajeTextarea.value) {
        mensajeTextarea.value = `Hola, quiero consultar la disponibilidad del producto: ${nombreProducto}.`;
      }

      actualizarResumen(
        "producto",
        nombreProducto,
        precioProducto
          ? `Producto detectado desde la carta. Precio referencial: ${precioProducto}.`
          : "Producto detectado desde la carta."
      );
      actualizarDetalleProducto(productoApi);
      return;
    } catch (error) {
      console.error("No se pudo cargar el producto seleccionado desde la API.", error);
      mostrarFeedback(
        "No se pudo cargar el producto seleccionado. Puedes completar la solicitud manualmente.",
        "error"
      );
    }
  }

  if (producto) {
    limpiarDetalleProducto();
    tipoPedidoSelect.value = "producto";
    productoPedidoInput.value = producto;
    sincronizarCamposOcultos("producto", producto);

    if (mensajeTextarea && !mensajeTextarea.value) {
      mensajeTextarea.value = `Hola, quiero consultar la disponibilidad del producto: ${producto}.`;
    }

    actualizarResumen("producto", producto);
    return;
  }

  if (promocion) {
    limpiarDetalleProducto();
    tipoPedidoSelect.value = "promocion";
    productoPedidoInput.value = promocion;
    sincronizarCamposOcultos("promocion", promocion);

    if (mensajeTextarea && !mensajeTextarea.value) {
      mensajeTextarea.value = `Hola, quiero consultar la disponibilidad de la promocion: ${promocion}.`;
    }

    actualizarResumen("promocion", promocion);
    return;
  }

  tipoPedidoSelect.value = "general";
  sincronizarCamposOcultos("general", "");
  actualizarResumen("general", "");
  limpiarDetalleProducto();
}

/* =========================
   SINCRONIZAR FORMULARIO
========================= */

function sincronizarResumenManual() {
  if (!tipoPedidoSelect || !productoPedidoInput) return;

  const tipo = tipoPedidoSelect.value || "general";
  const nombre = limpiarTexto(productoPedidoInput.value);

  sincronizarCamposOcultos(tipo, nombre);
  actualizarResumen(tipo, nombre);
  limpiarDetalleProducto();
}

function obtenerDatosPedido() {
  return {
    nombre: limpiarTexto(nombreInput?.value),
    telefono: limpiarTexto(telefonoInput?.value),
    correo: limpiarTexto(correoInput?.value),
    tipoPedido: tipoPedidoSelect?.value || "general",
    itemPedido: limpiarTexto(productoPedidoInput?.value),
    cantidad: Number(cantidadInput?.value || 0),
    mensaje: limpiarTexto(mensajeTextarea?.value),
    origenPedido: origenPedidoInput?.value || "general"
  };
}

function validarDatosPedido(datosPedido) {
  return Boolean(
    datosPedido.nombre &&
    datosPedido.telefono &&
    datosPedido.correo &&
    datosPedido.tipoPedido &&
    datosPedido.itemPedido &&
    Number.isInteger(datosPedido.cantidad) &&
    datosPedido.cantidad > 0
  );
}

/* =========================
   PUNTO FUTURO DE BACKEND
========================= */

async function enviarSolicitudPedido(datosPedido) {
  // Futuro backend:
  // return fetch("/api/pedidos", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(datosPedido)
  // });

  return {
    ok: true,
    modo: "frontend-preparado",
    datos: datosPedido
  };
}

/* =========================
   ENVIO TEMPORAL
========================= */

async function manejarEnvioPedido(event) {
  event.preventDefault();

  if (!pedidoForm) return;

  const datosPedido = obtenerDatosPedido();

  if (!validarDatosPedido(datosPedido)) {
    mostrarFeedback("Completa los datos principales de la solicitud antes de enviarla.", "error");
    return;
  }

  const resultado = await enviarSolicitudPedido(datosPedido);

  if (!resultado.ok) {
    mostrarFeedback("No se pudo registrar la solicitud. Intenta nuevamente.", "error");
    return;
  }

  mostrarFeedback(
    "Solicitud preparada correctamente. El equipo confirmara disponibilidad, precio final y atencion.",
    "exito"
  );
}

/* =========================
   INICIALIZACION
========================= */

if (
  pedidoForm &&
  tipoPedidoSelect &&
  productoPedidoInput &&
  nombreInput &&
  telefonoInput &&
  correoInput &&
  cantidadInput
) {
  prepararPedidoDesdeUrl();

  tipoPedidoSelect.addEventListener("change", sincronizarResumenManual);
  productoPedidoInput.addEventListener("input", sincronizarResumenManual);
  cantidadInput.addEventListener("input", () => {
    if (productoSeleccionado) {
      actualizarDetalleProducto(productoSeleccionado);
    }
  });

  pedidoForm.addEventListener("submit", manejarEnvioPedido);
}
