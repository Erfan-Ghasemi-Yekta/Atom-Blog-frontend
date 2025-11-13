// ==========================================
//    Blog Widgets (Final Clean Version)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initLatestPostsWidget();
  initBlogCategoriesWidget();
  initBlogSearchWidget();
  initRecommendedPostsWidget();
});

// ------------------------------------------
// RENDER: List Renderer
// ------------------------------------------
function renderPostList(container, posts) {
  if (!posts || posts.length === 0) {
    container.innerHTML = "<p>هیچ پستی یافت نشد.</p>";
    return;
  }

  let html = "<ul class='blog-widget-list'>";
  posts.forEach((post) => {
    html += `
      <li>
        <a href="/blog/post.html?id=${post.id}">
          ${post.title}
        </a>
      </li>`;
  });
  html += "</ul>";
  container.innerHTML = html;
}

// ------------------------------------------
// 1) Latest Posts
// ------------------------------------------
async function initLatestPostsWidget() {
  const container = document.querySelector('[data-widget="latest-posts"]');
  if (!container) return;

  try {
    const posts = await getBlogPosts();
    const latest = posts.results?.slice(0, 5) || posts.slice(0, 5);
    renderPostList(container, latest);
  } catch (err) {
    container.innerHTML = "<p>خطا در دریافت آخرین پست‌ها.</p>";
  }
}

// ------------------------------------------
// 2) Blog Categories
// ------------------------------------------
async function initBlogCategoriesWidget() {
  const container = document.querySelector('[data-widget="blog-categories"]');
  if (!container) return;

  try {
    const categories = await getBlogCategories();

    if (!categories || categories.length === 0) {
      container.innerHTML = "<p>دسته‌بندی یافت نشد.</p>";
      return;
    }

    let html = "<ul class='blog-widget-list'>";
    categories.forEach((cat) => {
      html += `
        <li>
          <a href="/blog/category.html?id=${cat.id}">
            ${cat.name}
          </a>
        </li>`;
    });
    html += "</ul>";

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = "<p>خطا در دریافت دسته‌بندی‌ها.</p>";
  }
}

// ------------------------------------------
// 3) Blog Search
// ------------------------------------------
function initBlogSearchWidget() {
  const container = document.querySelector('[data-widget="blog-search"]');
  if (!container) return;

  container.innerHTML = `
    <form id="blog-search-form">
      <input type="search" id="blog-search-input" placeholder="جستجو در بلاگ..." />
      <button type="submit">جستجو</button>
    </form>
    <div id="blog-search-results"></div>
  `;

  const form = document.getElementById("blog-search-form");
  const input = document.getElementById("blog-search-input");
  const results = document.getElementById("blog-search-results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    try {
      const posts = await getBlogPosts();
      const filtered = posts.results?.filter((p) =>
        p.title.includes(query)
      );

      renderPostList(results, filtered);
    } catch (err) {
      results.innerHTML = "<p>خطا در جستجو.</p>";
    }
  });
}

// ------------------------------------------
// 4) Recommended / Random Posts
// ------------------------------------------
async function initRecommendedPostsWidget() {
  const container = document.querySelector('[data-widget="recommended-posts"]');
  if (!container) return;

  try {
    const posts = await getBlogPosts();
    const list = posts.results || posts;

    if (list.length === 0) {
      container.innerHTML = "<p>پستی برای پیشنهاد یافت نشد.</p>";
      return;
    }

    // انتخاب ۳ پست تصادفی
    const shuffled = list.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    renderPostList(container, selected);
  } catch (err) {
    container.innerHTML = "<p>خطای دریافت پست‌های پیشنهادی.</p>";
  }
}
