# How to Generate a Sitemap

Since this is a static site, a dynamic sitemap can't be generated on the fly.
However, you can generate one using a script that fetches all the games and posts
from the API.

## 1. Create a Sitemap Generation Script
Create a new Node.js script (e.g., `generate-sitemap.js`) in your project's root.
This script will:
  - Fetch all games from `/api/tournaments/games/`
  - Fetch all posts from `/api/blog/posts/`
  - Generate a sitemap in XML format.

## 2. Example `generate-sitemap.js`

```javascript
const { createWriteStream } = require('fs');
const { SitemapStream } = require('sitemap');
const fetch = require('node-fetch'); // or use the built-in fetch in Node 18+

const API_BASE_URL = 'http://atom-game.ir:8000/api';
const SITE_URL = 'https://atom-game.ir';

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);

  // Add static pages
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });

  // Add game pages
  const gamesRes = await fetch(`${API_BASE_URL}/tournaments/games/`);
  const games = await gamesRes.json();
  games.forEach(game => {
    sitemap.write({ url: `/games/${game.id}/`, changefreq: 'weekly', priority: 0.8 });
  });

  // Add post pages
  const postsRes = await fetch(`${API_BASE_URL}/blog/posts/`);
  const posts = await postsRes.json();
  posts.forEach(post => {
    sitemap.write({ url: `/blog/${post.slug}/`, changefreq: 'weekly', priority: 0.7 });
  });

  sitemap.end();
}

generateSitemap().catch(console.error);
```

## 3. Run the Script
Install dependencies:
`npm install sitemap node-fetch`

Run the script to generate the sitemap:
`node generate-sitemap.js`

This will create a `sitemap.xml` in your `public` directory. You should run this
script periodically or as part of your build process to keep the sitemap up-to-date.
