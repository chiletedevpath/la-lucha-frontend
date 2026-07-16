# La Lucha Sanguchería Criolla - Frontend académico

Proyecto frontend desarrollado para el curso **Taller de Programación Web**. La aplicación simula una experiencia web para consultar carta, promociones, locales, contacto y solicitudes de pedido.

> Aviso: este sitio tiene fines académicos. No es un canal oficial de La Lucha Sanguchería Criolla, no procesa pagos y no registra compras reales.

## Tecnologías

- HTML5 semántico
- CSS3 modular
- JavaScript puro
- React 18.3.1 por CDN para secciones interactivas
- PWA básica con `site.webmanifest` y `sw.js`
- Netlify para despliegue
- API pública en Render consumida mediante proxy de Netlify

## Estructura principal

```text
.
|-- assets/              # Imágenes, banners e iconos
|-- components/          # Navbar, hero y footer reutilizables
|-- css/                 # Estilos por página y componentes
|-- js/                  # Lógica de API, carta, pedido, contacto, locales y PWA
|-- scripts/             # Build de producción
|-- carta.html           # Carta dinámica
|-- pedido.html          # Solicitud simulada de pedido
|-- promociones.html     # Promociones dinámicas
|-- locales.html         # Locales
|-- contacto.html        # Formulario de contacto simulado
|-- netlify.toml         # Hosting, proxy, headers y build
|-- site.webmanifest     # Manifest PWA
`-- sw.js                # Service worker
```

## Instalación local

1. Clonar el repositorio.
2. Instalar dependencias de build:

```bash
npm install
```

3. Abrir `index.html` en el navegador, o levantar un servidor estático local:

```bash
npx serve .
```

## Build de producción

El código fuente queda legible en la raíz del proyecto. Para producción se genera una carpeta `dist/` con HTML, CSS y JavaScript minificados:

```bash
npm run build
```

Netlify ejecuta ese comando automáticamente y publica `dist/`.

## API pública

El frontend consume la API mediante una ruta relativa:

```js
baseUrl: "/api"
```

En producción, Netlify redirige esa ruta hacia Render:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://utp-la-lucha-bd-backend.onrender.com/api/:splat"
  status = 200
  force = true
```

Esto evita problemas de CORS en el navegador y mantiene el dominio público como punto único de consumo.

Endpoints usados según la página:

- `/api/productos`
- `/api/categorias`
- `/api/promociones`
- `/api/locales`

No se consulta toda la API en todas las páginas; cada sección solicita solo lo que necesita.

## Funcionamiento

### Carta

`js/productos.js` carga productos y categorías desde la API pública. Incluye:

- búsqueda por nombre, descripción o categoría
- filtros por categoría
- paginación
- skeleton loader
- reintento si la API demora
- cache local temporal
- solicitud compartida con `localStorage`

### Pedido

`pedido.html` y `js/pedido.js` permiten armar una solicitud simulada con varios productos.

Incluye:

- resumen con cantidades
- cálculo de total e IGV incluido
- modalidad recojo o delivery
- validación frontend de celular, correo y campos requeridos
- confirmación simulada

No envía ni almacena pedidos en backend.

### Promociones

`js/promociones.js` consume promociones desde la API pública. Si la conexión demora, muestra estados visuales de carga, caché temporal o datos de respaldo académico.

### Locales

`js/locales.js` combina datos demostrativos con información actualizada desde la API. La renderización se realiza con creación segura de nodos DOM y `textContent`, evitando insertar datos externos mediante `innerHTML`.

### Contacto

`js/contacto.js` valida el formulario en frontend. No envía mensajes reales ni almacena información en backend.

## Cache y PWA

El service worker cachea archivos estáticos principales para mejorar carga y experiencia offline básica. Las rutas `/api/*` se manejan con estrategia `networkFirst` para priorizar datos actualizados.

La caché de datos de API en `localStorage` tiene vencimiento de 30 minutos.

## Seguridad aplicada

- Proxy Netlify para evitar CORS directo en navegador.
- Headers de seguridad en `netlify.toml`.
- `Content-Security-Policy`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- React y ReactDOM con versión exacta.
- Renderizado seguro de datos externos en locales.
- No se exponen claves privadas.

## Despliegue

El sitio está desplegado en Netlify:

```text
https://la-lucha.chiletedevpath.com
```

Cada cambio en la rama `main` se publica automáticamente.

## Limitaciones académicas

- No hay procesamiento real de pagos.
- No hay registro real de pedidos o mensajes.
- La validación de formularios es frontend.
- La marca/local real se menciona solo como referencia académica.
