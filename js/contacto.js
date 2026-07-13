/* =========================
   CONTACTO CON REACT
========================= */

const e = React.createElement;

const preguntasFrecuentes = [
  {
    id: "delivery",
    pregunta: "Tienen servicio de delivery a todo Lima?",
    respuesta:
      "Contamos con delivery en zonas de cobertura cercanas a nuestros locales. Tambien puedes realizar tu pedido en linea y coordinar recojo en tienda."
  },
  {
    id: "pagos",
    pregunta: "Cuales son los metodos de pago aceptados?",
    respuesta:
      "Aceptamos tarjetas, efectivo, Yape y Plin. En pedidos simulados puedes seleccionar el metodo preferido para coordinarlo con el local."
  },
  {
    id: "preparacion",
    pregunta: "Los sanguches se preparan al momento?",
    respuesta:
      "Si. La propuesta de La Lucha prioriza pan artesanal, insumos frescos y preparacion al momento para conservar sabor y textura."
  },
  {
    id: "vegetariano",
    pregunta: "Ofrecen opciones sin carne o vegetarianas?",
    respuesta:
      "Si. Puedes revisar acompanamientos y opciones de la carta, y usar las notas del pedido para indicar preferencias o restricciones."
  }
];

function limpiarTexto(texto) {
  return typeof texto === "string" ? texto.trim() : "";
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpiarTexto(correo));
}

function ContactoForm() {
  const valoresIniciales = {
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: ""
  };
  const [valores, setValores] = React.useState(valoresIniciales);
  const [errores, setErrores] = React.useState({});
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [nombreEnviado, setNombreEnviado] = React.useState("");

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setValores((actuales) => ({
      ...actuales,
      [name]: value
    }));

    setErrores((actuales) => ({
      ...actuales,
      [name]: ""
    }));
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (limpiarTexto(valores.nombre).length < 3) {
      nuevosErrores.nombre = "Ingresa tu nombre completo.";
    }

    if (!validarCorreo(valores.correo)) {
      nuevosErrores.correo = "Correo invalido.";
    }

    if (limpiarTexto(valores.asunto).length < 4) {
      nuevosErrores.asunto = "Ingresa un asunto.";
    }

    if (limpiarTexto(valores.mensaje).length < 10) {
      nuevosErrores.mensaje = "Escribe un mensaje mas claro.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (!validarFormulario()) return;

    setEnviando(true);

    window.setTimeout(function () {
      setNombreEnviado(limpiarTexto(valores.nombre));
      setValores(valoresIniciales);
      setEnviando(false);
      setEnviado(true);
    }, 700);
  }

  if (enviado) {
    return e(
      "div",
      { className: "contacto-exito", role: "status", "aria-live": "polite" },
      e(
        "div",
        { className: "exito-contenido" },
        e("span", { className: "material-symbols-rounded exito-icono", "aria-hidden": "true" }, "check_circle"),
        e("h2", { className: "contacto-form-titulo" }, "Mensaje enviado"),
        e(
          "p",
          { className: "contacto-exito-texto" },
          "Gracias, ",
          e("strong", null, nombreEnviado),
          ". Hemos recibido tu mensaje. Nuestro equipo se pondra en contacto contigo."
        ),
        e(
          "button",
          {
            type: "button",
            className: "contacto-btn contacto-btn--volver",
            onClick: function () {
              setEnviado(false);
            }
          },
          "Enviar otro mensaje"
        )
      )
    );
  }

  return e(
    React.Fragment,
    null,
    e("span", { className: "contacto-label" }, "Envianos un mensaje"),
    e("h2", { className: "contacto-form-titulo" }, "Tienes alguna consulta?"),
    e(
      "form",
      { className: "contacto-form", id: "form-contacto-react", noValidate: true, onSubmit: enviarFormulario },
      e(CampoTexto, {
        id: "contacto-nombre",
        label: "Nombre completo",
        name: "nombre",
        placeholder: "Ej: Juan Perez",
        value: valores.nombre,
        error: errores.nombre,
        onChange: actualizarCampo
      }),
      e(CampoTexto, {
        id: "contacto-correo",
        label: "Correo electronico",
        name: "correo",
        type: "email",
        placeholder: "Ej: juan@correo.com",
        value: valores.correo,
        error: errores.correo,
        onChange: actualizarCampo
      }),
      e(CampoTexto, {
        id: "contacto-asunto",
        label: "Asunto",
        name: "asunto",
        placeholder: "Ej: Consulta sobre locales",
        value: valores.asunto,
        error: errores.asunto,
        onChange: actualizarCampo
      }),
      e(CampoTexto, {
        id: "contacto-mensaje",
        label: "Mensaje",
        name: "mensaje",
        placeholder: "Escribe tu mensaje aqui...",
        value: valores.mensaje,
        error: errores.mensaje,
        onChange: actualizarCampo,
        multilinea: true
      }),
      e(
        "button",
        { type: "submit", className: "contacto-btn", disabled: enviando },
        enviando ? "Enviando..." : "Enviar mensaje"
      )
    )
  );
}

function CampoTexto(props) {
  const errorId = `${props.id}-error`;
  const atributos = {
    id: props.id,
    name: props.name,
    value: props.value,
    placeholder: props.placeholder,
    "aria-invalid": props.error ? "true" : "false",
    "aria-describedby": props.error ? errorId : undefined,
    onChange: props.onChange
  };

  return e(
    "div",
    { className: "form-grupo" },
    e("label", { htmlFor: props.id }, props.label),
    props.multilinea
      ? e("textarea", { ...atributos, rows: 5 })
      : e("input", { ...atributos, type: props.type || "text" }),
    e("small", { className: "form-error", id: errorId, "aria-live": "polite" }, props.error || "")
  );
}

function ContactoFaq() {
  const [abierta, setAbierta] = React.useState(null);

  return e(
    "div",
    { className: "faq-lista" },
    preguntasFrecuentes.map(function (item) {
      const estaAbierta = abierta === item.id;
      const respuestaId = `faq-${item.id}`;

      return e(
        "article",
        {
          key: item.id,
          className: estaAbierta ? "faq-item faq-item--active" : "faq-item"
        },
        e(
          "button",
          {
            type: "button",
            className: "faq-pregunta",
            "aria-expanded": String(estaAbierta),
            "aria-controls": respuestaId,
            onClick: function () {
              setAbierta(estaAbierta ? null : item.id);
            }
          },
          e("span", null, item.pregunta),
          e("span", { className: "material-symbols-rounded faq-icono", "aria-hidden": "true" }, "expand_more")
        ),
        e(
          "div",
          {
            id: respuestaId,
            className: "faq-respuesta",
            role: "region",
            style: {
              maxHeight: estaAbierta ? "12rem" : 0,
              opacity: estaAbierta ? 1 : 0
            }
          },
          e("p", null, item.respuesta)
        )
      );
    })
  );
}

const formRoot = document.getElementById("contacto-form-root");
const faqRoot = document.getElementById("contacto-faq-root");

if (formRoot) {
  ReactDOM.createRoot(formRoot).render(e(ContactoForm));
}

if (faqRoot) {
  ReactDOM.createRoot(faqRoot).render(e(ContactoFaq));
}
