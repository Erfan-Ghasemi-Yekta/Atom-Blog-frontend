const CACHE_NAME = 'atom-game-cache-v1';
const API_PREFIX = '/api/';

const PRECACHE_ASSETS = [
    // Add paths to static assets like CSS, JS, images if needed
    // e.g., '/css/style.css', '/js/main.js'
];

// On install, pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle API requests
  if (request.url.includes(API_PREFIX)) {
    // For list views: stale-while-revalidate
    if (request.url.endsWith('/') || request.url.includes('?')) {
      event.respondWith(staleWhileRevalidate(request));
    } else {
      // For detail views: network-first, fallback to cache
      event.respondWith(networkFirst(request));
    }
  }
});

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Network failed, try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Optional: Return a generic fallback response if not in cache
    return new Response(JSON.stringify({ error: 'Offline and not in cache' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
}
