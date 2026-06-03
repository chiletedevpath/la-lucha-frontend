const CACHE_NAME = "la-lucha-v24";

const APP_SHELL = [
  "./",
  "./index.html",
  "./carta.html",
  "./locales.html",
  "./promociones.html",
  "./contacto.html",
  "./nosotros.html",
  "./offline.html",
  "./site.webmanifest",
  "./components/navbar.html",
  "./components/footer.html",
  "./components/hero.html",
  "./pedido.html",
  "./css/variables.css",
  "./css/layout.css",
  "./css/navbar.css",
  "./css/footer.css",
  "./css/hero.css",
  "./css/index.css",
  "./css/cards.css",
  "./css/carta.css",
  "./css/locales.css",
  "./css/promociones.css",
  "./css/contacto.css",
  "./css/nosotros.css",
  "./css/animations.css",
  "./css/pedido.css",
  "./js/main.js",
  "./js/menu.js",
  "./js/pedido.js",
  "./js/productos.js",
  "./js/locales.js",
  "./js/promociones.js",
  "./js/animaciones.js",
  "./data/productos.js",
  "./data/locales.js",
  "./data/promociones.js",
  "./assets/img/banners/hero-banner.webp",
  "./assets/img/productos/sanguches/chicharron.jpg",
  "./assets/img/productos/sanguches/pavo.jpg",
  "./assets/img/productos/bebidas/chicha.jpg",
  "./assets/img/locales/miraflores.webp",
  "./assets/img/promos/combocriollo.webp",
  "./assets/img/promos/dondecomen.webp",
  "./assets/img/promos/familiar.webp",
  "./assets/img/promos/full.webp",
  "./assets/img/promos/labrava.webp",
  "./assets/img/promos/martes.webp",
  "./assets/img/promos/universitario.webp",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
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
    event.respondWith(fetch(event.request).catch(() => caches.match("./offline.html")));
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
