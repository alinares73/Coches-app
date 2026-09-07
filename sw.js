const CACHE_NAME = 'coches-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación y almacenamiento en caché de los archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para servir desde caché si no hay red
self.addEventListener('fetch', event => {
  // Ignoramos las llamadas al servidor de Apps Script (no se deben cachear los POST)
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Limpieza de cachés antiguas al actualizar la PWA
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});