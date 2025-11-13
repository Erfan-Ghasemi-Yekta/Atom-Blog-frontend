// =========================
//   Blog Service Worker
// =========================

const CACHE_NAME = 'atom-blog-cache-v1';

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Only handle API requests related to the blog
  if (!url.includes('/api/blog/')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch (e) {
        const cached = await cache.match(event.request);
        return (
          cached ||
          new Response('Offline - Blog API not in cache', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          })
        );
      }
    })
  );
});
