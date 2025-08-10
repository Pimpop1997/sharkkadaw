/*
  Service Worker for same-origin offline and caching
  - Precache core shell
  - Runtime cache /data/* and static assets with cache-first, SWR
  - HTML uses network-first with cache fallback
*/
const CACHE_VERSION = 'v1';
const CACHE_NAME = `site-${CACHE_VERSION}`;

// Core shell to precache (adjust as needed)
const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/SBG.png',
  '/BG/BG.webp',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return; // let the browser handle cross-origin

  const accept = req.headers.get('accept') || '';

  // HTML: network-first, fallback cache, then offline page
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match('/offline.html')))
    );
    return;
  }

  // Static assets and /data/*: cache-first with stale-while-revalidate
  const isStatic =
    url.pathname.startsWith('/data/') ||
    /\.(?:png|jpe?g|webp|gif|svg|ico|css|js|woff2?|ttf|otf|mp4|webm)$/i.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: try network, fallback cache if available
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
