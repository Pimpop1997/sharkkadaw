const CACHE_NAME = 'sharkkadaw-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  // เพิ่มไฟล์พื้นหลังที่ใช้ใน BG
  '/BG/BG.webp',
  '/BG/BG2.webp',
  // สามารถเพิ่มไฟล์อื่นๆ ที่ต้องการ cache ได้ที่นี่
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache if found, else fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // ถ้า offline และหาไม่ได้ใน cache สามารถแสดง fallback ได้ที่นี่
      })
  );
});
