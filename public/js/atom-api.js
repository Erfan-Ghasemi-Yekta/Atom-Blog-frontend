const API_BASE_URL = 'https://atom-game.ir/api'; // ✅ دامنه درست و https
const PROXY_URL = '/api'; // Or your proxy server address
const CACHE_NAME = 'atom-game-cache-v1';

const FETCH_MODE = 'direct'; // 'direct' or 'proxy'

async function fetchFromApi(endpoint, options = {}) {
  const url = FETCH_MODE === 'direct'
    ? `${API_BASE_URL}${endpoint}`
    : `${PROXY_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    // Also update the cache with the new data
    const cache = await caches.open(CACHE_NAME);
    cache.put(url, new Response(JSON.stringify(data)));
    return data;
  } catch (error) {
    console.error('API request error:', error);
    // If the network request fails, try to get the data from the cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      console.log('Serving from cache:', url);
      return cachedResponse.json();
    }
    // If not in cache, throw the error to be handled by the UI
    throw new Error(`API request failed and no cache available for ${url}`);
  }
}

// Example usage:
// getGames();
// getGameDetails(1);

function getGames() {
  return fetchFromApi('/tournaments/games/');
}

function getGameDetails(gameId) {
  return fetchFromApi(`/tournaments/games/${gameId}/`);
}

function getTournaments(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return fetchFromApi(`/tournaments/tournaments/?${query}`);
}

function getTournamentDetails(tournamentId) {
  return fetchFromApi(`/tournaments/tournaments/${tournamentId}/`);
}

function getBlogPosts() {
  return fetchFromApi('/blog/posts/');
}

function getBlogPostDetails(postId) {
  return fetchFromApi(`/blog/posts/${postId}/`);
}
