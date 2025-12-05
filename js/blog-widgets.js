// از POSTS_API_URL جهانی (تعریف‌شده در box.js) استفاده می‌کنیم، اگر نبود fallback داریم
const WIDGET_POSTS_API_URL =
  typeof POSTS_API_URL !== "undefined"
    ? POSTS_API_URL
    : "https://atom-game.ir/api/blog/posts/";

const CATEGORIES_API_URL = "https://atom-game.ir/api/blog/categories/";

document.addEventListener("DOMContentLoaded", () => {
  initBlogCategoriesWidget();
  initBlogSearchWidget();
  initRecommendedPostsWidget(); // الان: پر بازدیدترین‌ها
});

// ------------------------------------------
// Helpers عمومی
// ------------------------------------------

// گرفتن همه پست‌ها از API (استفاده عمومی – الان برای این ویجت لازم نیست ولی می‌ذاریم بمونه)
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

// گرفتن «پر بازدیدترین پست‌ها» مستقیماً از API با ordering=-views_count
async function fetchTopViewedPosts(limit = 5) {
  const baseUrl = WIDGET_POSTS_API_URL || "/api/blog/posts/";
  const url = new URL(baseUrl, window.location.origin);

  // اگر POSTS_API_URL خودش query داشته باشد، این‌ها را override می‌کنیم
  url.searchParams.set("ordering", "-views_count");
  if (limit) {
    url.searchParams.set("page_size", String(limit));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت پر بازدیدترین پست‌ها");
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    return limit ? data.slice(0, limit) : data;
  }
  if (Array.isArray(data.results)) {
    return limit ? data.results.slice(0, limit) : data.results;
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
  const slug = post.slug || null;

  // ✅ همه کلیک‌ها برن به صفحه single-post-page با اسلاگ
  if (slug) {
    return `/html/single-post-page.html?slug=${encodeURIComponent(slug)}`;
  }

  // 🔁 اگر اسلاگ نداشت، از canonical_url استفاده کن (فقط برای سازگاری)
  if (post.canonical_url) {
    return post.canonical_url;
  }

  // آخرین fallback
  return "#";
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

// فرمت تاریخ انتشار برای نمایش در ویجت (اگر جای دیگری لازم شد)
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

// گرفتن تعداد بازدید از آبجکت پست (طبق API: views_count)
function getPostViews(post) {
  if (!post || typeof post !== "object") return 0;

  if (typeof post.views_count === "number") return post.views_count;

  // حالت‌های احتمالی دیگر برای احتیاط
  if (typeof post.views === "number") return post.views;
  if (typeof post.view_count === "number") return post.view_count;

  return 0;
}

// فرمت کردن تعداد بازدید با اعداد فارسی و کاما
function formatViewsCount(views) {
  const safe = typeof views === "number" && !isNaN(views) ? views : 0;
  try {
    return safe.toLocaleString("fa-IR");
  } catch (e) {
    return String(safe);
  }
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

  container.innerHTML = "<p>در حال بارگذاری.</p>";

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
      <input type="search" id="blog-search-input" placeholder="جستجو در وبلاگ." />
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
// 4) Recommended Posts → Top Viewed (پر بازدیدترین‌ها)
// ==========================================
async function initRecommendedPostsWidget() {
  const container = document.querySelector('[data-widget="recommended-posts"]');
  if (!container) return;

  container.innerHTML = "<p>در حال بارگذاری پر بازدیدترین پست‌ها...</p>";

  try {
    // ۵ تا پست با بیشترین views_count
    const posts = await fetchTopViewedPosts(5);

    if (!posts || posts.length === 0) {
      container.innerHTML = "<p>پستی برای نمایش یافت نشد.</p>";
      return;
    }

    let html = '<div class="recommended-posts-list">';

    posts.forEach((post) => {
      const link = getPostLink(post);
      const coverUrl = getPostCoverUrl(post);
      const title = post.title || "بدون عنوان";
      const firstChar = title.trim().charAt(0) || "پ";

      const views = getPostViews(post);
      const viewsText = formatViewsCount(views);

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
              <div class="recommended-post-meta">
                <span class="recommended-post-views">${viewsText} بازدید</span>
              </div>
            </div>
          </a>
        </div>
      `;
    });

    html += "</div>";
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p>خطا در دریافت پر بازدیدترین پست‌ها.</p>";
  }
}
