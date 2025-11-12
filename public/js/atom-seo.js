
function generateVideoGameJSONLD(game) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.name,
    "description": game.description
  };

  if (game.images && game.images.length > 0) {
    schema.image = game.images[0].image;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function generateArticleJSONLD(post) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "articleBody": post.content
  };

  if (post.author && post.author.display_name) {
    schema.author = {
        "@type": "Person",
        "name": post.author.display_name
    };
  }

  if (post.published_at) {
    schema.datePublished = post.published_at;
  }

  if (post.cover_media && post.cover_media.url) {
    schema.image = post.cover_media.url;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Example Snippets for documentation:
const exampleGameJSONLD = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Example Game",
  "description": "An exciting game of adventure.",
  "image": "http://example.com/game-cover.jpg",
  "genre": ["Action", "Adventure"],
  "publisher": "Example Studios",
  "gamePlatform": "PC",
  "releaseDate": "2023-01-01",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "120"
  }
};

const exampleArticleJSONLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Example Article Title",
    "author": {
        "@type": "Person",
        "name": "John Doe"
    },
    "datePublished": "2023-11-21T14:30:00Z",
    "image": "http://example.com/article-image.jpg",
    "articleBody": "This is the full text of the article.",
    "publisher": {
        "@type": "Organization",
        "name": "Your Site Name",
        "logo": {
            "@type": "ImageObject",
            "url": "your-logo-url.png"
        }
    }
};
