/**
 * Service Worker
 * Cache-first strategy for static assets, network-first for HTML.
 * IMPORTANT: bump CACHE_NAME (e.g. v1 -> v2) whenever you ship changes
 * so old caches are invalidated.
 */

const CACHE_NAME = 'site-cache-v21';
const RUNTIME_CACHE = 'site-runtime-v17';

// Critical assets cached on install. Edit this list for your site.
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'js/site.js',
  'js/cookie-consent.js',
  'manifest.json',
  // 'assets/logos/logo.png',
  // 'assets/fotos/hero.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME && n !== RUNTIME_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for HTML pages
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Cache-first for static assets
  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Fallback
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
