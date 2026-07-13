const CACHE_NAME = "la-lucha-cache-v4-react-contacto";

const APP_SHELL = [
  "./",
  "./index.html",
  "./carta.html",
  "./pedido.html",
  "./promociones.html",
  "./locales.html",
  "./nosotros.html",
  "./contacto.html",
  "./offline.html",
  "./site.webmanifest",
  "./components/navbar.html",
  "./components/hero.html",
  "./components/footer.html",
  "./css/variables.css",
  "./css/layout.css",
  "./css/navbar.css",
  "./css/footer.css",
  "./css/hero.css",
  "./css/cards.css",
  "./css/animations.css",
  "./css/index.css",
  "./css/carta.css",
  "./css/pedido.css",
  "./css/promociones.css",
  "./css/locales.css",
  "./css/nosotros.css",
  "./css/contacto.css",
  "./js/api-config.js",
  "./js/main.js",
  "./js/menu.js",
  "./js/productos.js",
  "./js/pedido.js",
  "./js/promociones.js",
  "./js/locales.js",
  "./js/nosotros.js",
  "./js/contacto.js",
  "./js/solicitud-store.js",
  "./js/animaciones.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/img/banners/hero-banner.webp",
  "./assets/img/banners/Contactanos-banner.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseCopy = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });

          return networkResponse;
        })
        .catch(() => caches.match("./offline.html"));
    })
  );
});
