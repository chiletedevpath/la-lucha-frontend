const CACHE_NAME = "la-lucha-cache-v17-clear-request";
const API_ORIGIN = "https://utp-la-lucha-bd-backend.onrender.com";

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
  "./js/api-client.js",
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
  "./assets/img/banners/Contactanos-banner.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => null))))
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

  const url = new URL(event.request.url);

  if ((url.origin === API_ORIGIN || url.origin === self.location.origin) && url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(navigationFirst(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request));
  }
});

function putInCache(request, response) {
  if (!response || response.status !== 200) {
    return response;
  }

  const responseCopy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
  return response;
}

function cacheFirst(request) {
  return caches
    .match(request)
    .then((cachedResponse) => cachedResponse || fetch(request).then((response) => putInCache(request, response)))
    .catch(() => caches.match("./offline.html"));
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => putInCache(request, response))
    .catch(() => caches.match(request));
}

function navigationFirst(request) {
  return fetch(request)
    .then((response) => putInCache(request, response))
    .catch(() => caches.match(request).then((cachedResponse) => cachedResponse || caches.match("./offline.html")));
}
