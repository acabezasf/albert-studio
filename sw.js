const CACHE_NAME = 'albert-studio-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Devuelve del cache si existe, si no, baja de red (ideal offline-first mix)
      return response || fetch(event.request);
    }).catch(() => {
        return caches.match('./index.html');
    })
  );
});
