/* Carga componentes HTML dinámicamente */
async function cargarComponente(idContenedor, rutaArchivo) {
  /* Busca el contenedor en el HTML */
  const contenedor = document.getElementById(idContenedor);

  /* Evita error si el contenedor no existe */
  if (!contenedor) return;

  try {
    /* Obtiene el archivo HTML */
    const respuesta = await fetch(rutaArchivo);

    /* Convierte respuesta a texto */
    const contenido = await respuesta.text();

    /* Inserta el HTML en el contenedor */
    contenedor.innerHTML = contenido;
  } catch (error) {
    /* Muestra error en consola */
    console.error("Error al cargar componente:", rutaArchivo, error);
  }
}

/* Navbar */
cargarComponente("navbar-container", "components/navbar.html");

/* Hero principal */
cargarComponente("hero-container", "components/hero.html");

/* Footer */
cargarComponente("footer-container", "components/footer.html");
