// =========================
//   Atom-Blog API (Final)
// =========================

const API_BASE_URL = 'https://atom-game.ir/api';
const CACHE_NAME = 'atom-blog-cache-v1';

/**
 * Fetch API + Cache (Network-first with cache fallback)
 */
async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network error');

    const data = await response.json();

    // Store in cache
    const cache = await caches.open(CACHE_NAME);
    cache.put(url, new Response(JSON.stringify(data)));

    return data;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      return cachedResponse.json();
    }

    throw new Error('API failed and no cache available');
  }
}

/**
 * Blog Endpoints (Only Required)
 */
function getBlogPosts() {
  return fetchFromApi('/blog/posts/');
}

function getBlogPostDetails(id) {
  return fetchFromApi(`/blog/posts/${id}/`);
}

function getBlogCategories() {
  return fetchFromApi('/blog/categories/');
}
