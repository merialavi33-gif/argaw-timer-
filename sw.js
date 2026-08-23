const CACHE_NAME = 'task-control-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// 1. Install & Cache Local Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 2. Activate & Clear Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Smart Fetch Strategy (Cache First for static, Network for Firebase/APIs)
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Firebase ወይም የውጭ CDN ጥሪ ከሆነ ቀጥታ ከኔትወርክ እንዲያመጣ ማድረግ
  if (requestUrl.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // የራሳችን लोकल ፋይሎች ከሆኑ ከ Cache እንዲያነብ ማድረግ
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});

// 4. Local Notification Handler
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: './icon.svg',
      badge: './icon.svg',
      tag: 'task-reminder',
      requireInteraction: true
    });
  }
});
