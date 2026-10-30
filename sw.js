/* Service worker — Levantamiento Planimétrico · GPS (v2)
   Caché mínima y parsimoniosa: la app y sus librerías, nada más.
   NO se cachean teselas satelitales (miles de imágenes, demasiado peso
   para un trabajo cuyo centro es calcular y exportar).
   Si un recurso no se puede cachear, la instalación NO falla por eso:
   se cachea lo que se pudo y la app sigue funcionando con internet. */
const CACHE_NAME = 'levantamiento-planimetrico-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
const CDN_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.2/proj4.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of [...APP_SHELL, ...CDN_LIBS]){
      try { await cache.add(url); } catch (err){ /* se sigue con el resto */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((k) => k.startsWith('levantamiento-planimetrico-') && k !== CACHE_NAME)
      .map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isApp = url.origin === self.location.origin;
  const isCdn = url.href.startsWith('https://cdnjs.cloudflare.com/ajax/libs/');
  // Teselas y cualquier otro origen: no se interceptan. Con internet van
  // por red; sin internet, Leaflet muestra el fondo vacío y la app sigue.
  if (!isApp && !isCdn) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(event.request);
      if (res && (res.ok || res.type === 'opaque')){
        try { await cache.put(event.request, res.clone()); } catch (err){}
      }
      return res;
    } catch (err){
      if (cached) return cached;
      throw err;
    }
  })());
});
