// از POSTS_API_URL جهانی (تعریف‌شده در box.js) استفاده می‌کنیم، اگر نبود fallback داریم
const WIDGET_POSTS_API_URL =
  typeof POSTS_API_URL !== "undefined"
    ? POSTS_API_URL
    : "https://atom-game.ir/api/blog/posts/";

const CATEGORIES_API_URL = "https://atom-game.ir/api/blog/categories/";

document.addEventListener("DOMContentLoaded", () => {
  initBlogCategoriesWidget();
  initBlogSearchWidget();
  initRecommendedPostsWidget();
});

// ------------------------------------------
// Helpers عمومی
// ------------------------------------------

// گرفتن همه پست‌ها از API
async function fetchAllPosts() {
  const res = await fetch(WIDGET_POSTS_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت پست‌ها");
  }

  const data = await res.json();

  // هم آرایه مستقیم و هم حالت {results: []} رو ساپورت می‌کنیم
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

// گرفتن دسته‌بندی‌ها از API
async function fetchCategories() {
  const res = await fetch(CATEGORIES_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت دسته‌بندی‌ها");
  }

  const data = await res.json();
  return Array.isArray(data)
    ? data
    : Array.isArray(data.results)
    ? data.results
    : [];
}

// ساخت لینک هر پست برای ویجت‌ها
function getPostLink(post) {
  if (post.canonical_url) return post.canonical_url;
  if (post.slug) return `/blog/${post.slug}/`;
  return `/blog/post.html?id=${post.id}`;
}

// گرفتن آدرس کاور هر پست
function getPostCoverUrl(post) {
  // ساختار معمول: post.cover_media.url
  if (post.cover_media && post.cover_media.url) {
    return post.cover_media.url;
  }

  // بعضی بک‌اندها ممکن است cover_image داشته باشند
  if (post.cover_image) {
    return post.cover_image;
  }

  // اگر هیچ‌چیزی نبود، null برمی‌گردانیم تا پلاسبُر رندر شود
  return null;
}

// فرمت تاریخ انتشار برای نمایش در ویجت
function formatPostDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  try {
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch (e) {
    // اگر مرورگر ساپورت نکرد، یک فرمت ساده برمی‌گردانیم
    return d.toISOString().slice(0, 10);
  }
}

// رندر لیست ساده پست‌ها (برای latest / استفاده‌های آینده)
function renderPostList(container, posts) {
  if (!posts || posts.length === 0) {
    container.innerHTML = "<p>هیچ پستی یافت نشد.</p>";
    return;
  }

  let html = "<ul class='blog-widget-list'>";
  posts.forEach((post) => {
    const link = getPostLink(post);
    html += `
      <li>
        <a href="${link}">
          ${post.title}
        </a>
      </li>`;
  });
  html += "</ul>";
  container.innerHTML = html;
}

// ==========================================
// 1) Latest Posts (آخرین پست‌ها)
// (فعلاً استفاده نمی‌شود ولی renderPostList آماده است)
// ==========================================

// ==========================================
// 2) Blog Categories (دسته‌بندی‌ها + اتصال به box.js)
// ==========================================
async function initBlogCategoriesWidget() {
  const container = document.querySelector('[data-widget="blog-categories"]');
  if (!container) return;

  container.innerHTML = "<p>در حال بارگذاری...</p>";

  try {
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
      container.innerHTML = "<p>دسته‌بندی یافت نشد.</p>";
      return;
    }

    let html = "<ul class='blog-widget-list'>";

    // آیتم "همه مقالات"
    html += `
      <li>
        <button type="button" class="category-btn" data-category="__all__">
          همه مقالات
        </button>
      </li>
    `;

    categories.forEach((cat) => {
      const categoryValue = cat.slug || cat.id; // ترجیحاً slug
      html += `
        <li>
          <button type="button" class="category-btn" data-category="${categoryValue}">
            ${cat.name}
          </button>
        </li>`;
    });
    html += "</ul>";

    container.innerHTML = html;

    // وصل‌کردن کلیک‌ها به box.js + مدیریت حالت active
    const buttons = container.querySelectorAll(".category-btn");

    // به‌صورت پیش‌فرض "همه مقالات" active باشد
    const allButton = container.querySelector(
      '.category-btn[data-category="__all__"]'
    );
    if (allButton) {
      allButton.classList.add("active");
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // 1) حذف active از همه دکمه‌ها
        buttons.forEach((b) => b.classList.remove("active"));

        // 2) active روی دکمه کلیک‌شده
        btn.classList.add("active");

        // 3) منطق قبلی فیلترها (بدون تغییر)
        const value = btn.getAttribute("data-category");

        if (value === "__all__") {
          if (typeof resetFilters === "function") {
            resetFilters();
          } else {
            console.warn("resetFilters در box.js تعریف نشده است.");
          }
          return;
        }

        if (typeof onCategoryClick === "function") {
          onCategoryClick(value);
        } else {
          console.warn("onCategoryClick در box.js تعریف نشده است.");
        }
      });
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>خطا در دریافت دسته‌بندی‌ها.</p>";
  }
}

// ==========================================
// 3) Blog Search (جستجو + اتصال به box.js)
// ==========================================
function initBlogSearchWidget() {
  const container = document.querySelector('[data-widget="blog-search"]');
  if (!container) return;

  container.innerHTML = `
    <form id="blog-search-form">
      <input type="search" id="blog-search-input" placeholder="جستجو در وبلاگ..." />
      <button type="submit">جستجو</button>
    </form>
    <div id="blog-search-results"></div>
  `;

  const form = document.getElementById("blog-search-form");
  const input = document.getElementById("blog-search-input");
  const results = document.getElementById("blog-search-results");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    if (typeof onSearchSubmit === "function") {
      onSearchSubmit(query);
    } else {
      console.warn("onSearchSubmit در box.js تعریف نشده است.");
    }

    results.innerHTML = `<p>در حال نمایش نتایج برای: «${query}»</p>`;
  });
}

// ==========================================
// 4) Recommended / Random Posts (پست‌های پیشنهادی)
// ==========================================
async function initRecommendedPostsWidget() {
  const container = document.querySelector('[data-widget="recommended-posts"]');
  if (!container) return;

  container.innerHTML = "<p>در حال بارگذاری...</p>";

  try {
    const posts = await fetchAllPosts();
    const list = posts.slice();

    if (!list || list.length === 0) {
      container.innerHTML = "<p>پستی برای پیشنهاد یافت نشد.</p>";
      return;
    }

    // چند پست رندوم انتخاب می‌کنیم (۳ تا)
    const shuffled = list.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    let html = '<div class="recommended-posts-list">';

    selected.forEach((post) => {
      const link = getPostLink(post);
      const coverUrl = getPostCoverUrl(post);
      const dateStr = formatPostDate(post.created_at);
      const title = post.title || "بدون عنوان";
      const firstChar = title.trim().charAt(0) || "پ";

      html += `
        <div class="recommended-post-item">
          <a href="${link}" class="recommended-post-link">
            <div class="recommended-post-thumb-wrap">
              ${
                coverUrl
                  ? `<img src="${coverUrl}" alt="${title}" class="recommended-post-thumb" loading="lazy" />`
                  : `<span class="recommended-post-thumb-placeholder">${firstChar}</span>`
              }
            </div>
            <div class="recommended-post-content">
              <h4 class="recommended-post-title">${title}</h4>
              ${
                dateStr
                  ? `<span class="recommended-post-date">${dateStr}</span>`
                  : ""
              }
            </div>
          </a>
        </div>
      `;
    });

    html += "</div>";
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>خطای دریافت پست‌های پیشنهادی.</p>";
  }
}
