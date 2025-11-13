// =========================
//   Blog SEO (Final)
// =========================

function generateArticleJSONLD(post) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "articleBody": post.content
  };

  if (post.author?.display_name) {
    schema.author = {
      "@type": "Person",
      "name": post.author.display_name
    };
  }

  if (post.published_at) {
    schema.datePublished = post.published_at;
  }

  if (post.cover_media?.url) {
    schema.image = post.cover_media.url;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
