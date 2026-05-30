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

const pedidoTipoPreview = document.getElementById("pedido-tipo-preview");
const pedidoNombrePreview = document.getElementById("pedido-nombre-preview");
const pedidoResumenTexto = document.getElementById("pedido-resumen-texto");

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

function mostrarFeedback(mensaje, tipo = "exito") {
  if (!feedbackPedido) return;

  feedbackPedido.textContent = mensaje;
  feedbackPedido.dataset.estado = tipo;
}

function obtenerEtiquetaTipo(tipo) {
  if (tipo === "producto") return "Pedido de producto";
  if (tipo === "promocion") return "Pedido de promoción";
  return "Solicitud general";
}

function actualizarResumen(tipo, nombre) {
  if (!pedidoTipoPreview || !pedidoNombrePreview || !pedidoResumenTexto) return;

  pedidoTipoPreview.textContent = obtenerEtiquetaTipo(tipo);
  pedidoNombrePreview.textContent = nombre || "Sin producto seleccionado";

  pedidoResumenTexto.textContent = nombre
    ? "Este es el detalle detectado desde la carta o promociones."
    : "Puedes completar manualmente el producto o promoción que deseas solicitar.";
}

function sincronizarCamposOcultos(tipo, nombre) {
  if (origenPedidoInput) {
    origenPedidoInput.value = tipo;
  }

  if (itemPedidoInput) {
    itemPedidoInput.value = nombre;
  }
}

/* =========================
   PRECARGA DESDE URL
========================= */

function prepararPedidoDesdeUrl() {
  if (!tipoPedidoSelect || !productoPedidoInput) return;

  const producto = limpiarTexto(obtenerParametroUrl("producto"));
  const promocion = limpiarTexto(obtenerParametroUrl("promocion"));

  if (producto) {
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
    tipoPedidoSelect.value = "promocion";
    productoPedidoInput.value = promocion;
    sincronizarCamposOcultos("promocion", promocion);

    if (mensajeTextarea && !mensajeTextarea.value) {
      mensajeTextarea.value = `Hola, quiero consultar la disponibilidad de la promoción: ${promocion}.`;
    }

    actualizarResumen("promocion", promocion);
    return;
  }

  tipoPedidoSelect.value = "general";
  sincronizarCamposOcultos("general", "");
  actualizarResumen("general", "");
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
   ENVÍO TEMPORAL
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
    "Solicitud preparada correctamente. El equipo confirmará disponibilidad, precio final y atención.",
    "exito"
  );
}

/* =========================
   INICIALIZACIÓN
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

  pedidoForm.addEventListener("submit", manejarEnvioPedido);
}
