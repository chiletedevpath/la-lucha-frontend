const CACHE_NAME = "la-luchona-v9";

const APP_SHELL = [
  "./",
  "./index.html",
  "./carta.html",
  "./locales.html",
  "./promociones.html",
  "./contacto.html",
  "./nosotros.html",
  "./detalle-producto.html",
  "./offline.html",
  "./site.webmanifest",
  "./components/navbar.html",
  "./components/footer.html",
  "./components/hero.html",
  "./css/variables.css",
  "./css/layout.css",
  "./css/navbar.css",
  "./css/footer.css",
  "./css/hero.css",
  "./css/inicio.css",
  "./css/cards.css",
  "./css/carta.css",
  "./css/locales.css",
  "./css/promociones.css",
  "./css/contacto.css",
  "./css/nosotros.css",
  "./css/pages.css",
  "./css/animations.css",
  "./js/main.js",
  "./js/menu.js",
  "./js/productos.js",
  "./js/locales.js",
  "./js/promociones.js",
  "./js/detalle-producto.js",
  "./js/animaciones.js",
  "./data/productos.js",
  "./data/categorias.js",
  "./data/locales.js",
  "./data/promociones.js",
  "./assets/img/banners/hero-banner.png",
  "./assets/img/promos/combocriollo.jpg",
  "./assets/img/promos/dondecomen.jpg",
  "./assets/img/promos/familiar.jpg",
  "./assets/img/promos/full.jpg",
  "./assets/img/promos/labrava.jpg",
  "./assets/img/promos/martes.jpg",
  "./assets/img/promos/universitario.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return networkResponse;
      });
    })
  );
});
