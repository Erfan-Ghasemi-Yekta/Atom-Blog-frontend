// =====================
// Config
// =====================
const API_BASE = "https://atom-game.ir"; 
// حالا GET /api/blog/posts/{slug}/ => https://atom-game.ir/api/blog/posts/{slug}/

// =====================
// Helpers
// =====================
const $ = (sel) => document.querySelector(sel);

function getSlugFromUrl() {
  const url = new URL(window.location.href);
  const qSlug = url.searchParams.get("slug");
  if (qSlug) return qSlug;

  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

function readingTimeFromSeconds(sec) {
  if (!sec && sec !== 0) return "—";
  const min = Math.max(1, Math.ceil(sec / 60));
  return `${min} دقیقه`;
}

function safeText(x, fallback="") {
  return (x === null || x === undefined) ? fallback : x;
}

// فقط برای content (که Markdown است) استفاده می‌کنیم
function renderMarkdown(mdText) {
  if (!mdText) return "";
  const rawHtml = marked.parse(mdText, { breaks: true, gfm: true });
  return DOMPurify.sanitize(rawHtml);
}

async function apiGet(path) {
  const res = await fetch(API_BASE + path, { headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
      // اگر auth دارید:
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${t}`);
  }
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

// =====================
// Renderers
// =====================
function renderBreadcrumb(post) {
  const bc = $("#breadcrumb");
  const category = safeText(post.category, "وبلاگ");

  bc.innerHTML = `
    <a href="/" class="breadcrumb-link">خانه</a>
    <span class="breadcrumb-separator">/</span>
    <a href="/blog" class="breadcrumb-link">وبلاگ</a>
    <span class="breadcrumb-separator">/</span>
    <a href="/blog?category=${encodeURIComponent(category)}" class="breadcrumb-link">${category}</a>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-current">${safeText(post.title)}</span>
  `;
}

function renderPost(post) {
  $("#page-title").textContent = safeText(post.seo_title || post.title || "پست وبلاگ");
  $("#post-title").textContent = safeText(post.title, "—");
  $("#category-badge").textContent = safeText(post.category, "—");

  const author = post.author || {};
  $("#author-name").textContent = safeText(author.full_name || author.username || author.name, "—");
  $("#publish-date").textContent = formatDate(post.published_at);
  $("#reading-time").textContent = readingTimeFromSeconds(post.reading_time_sec);
  $("#views-count").textContent = safeText(post.views_count, 0);

  const cover = post.cover_media || post.og_image;
  if (cover && cover.url) {
    $("#cover-image").src = cover.url;
    $("#cover-image").alt = safeText(cover.alt_text || post.title, "");
    $("#cover-caption").textContent = safeText(cover.caption, "");
    $("#cover-figure").style.display = "block";
  } else {
    $("#cover-figure").style.display = "none";
  }

  // Content is Markdown
  $("#post-content").innerHTML = renderMarkdown(post.content);

  const tags = post.tags || [];
  if (tags.length) {
    $("#tags-section").style.display = "block";
    $("#tags-list").innerHTML = tags.map(t =>
      `<a href="/blog?tag=${encodeURIComponent(t.slug || t.title || t.name)}" class="tag">${safeText(t.title || t.name)}</a>`
    ).join("");
  } else {
    $("#tags-section").style.display = "none";
  }

  const comments = post.comments || [];
  $("#comments-title").textContent = `نظرات (${comments.length})`;
  renderComments(comments);
}

function renderComments(comments) {
  const list = $("#comments-list");
  if (!comments.length) {
    list.innerHTML = `<p style="opacity:.7">هنوز نظری ثبت نشده.</p>`;
    return;
  }

  list.innerHTML = comments.map(c => {
    const user = c.user || c.author || {};
    return `
      <article class="comment" data-comment-id="${c.id}">
        <div class="comment-header">
          <img src="${safeText(user.avatar || "/placeholder.svg?height=40&width=40")}" alt="کاربر" class="comment-avatar">
          <div class="comment-author">
            <h4 class="comment-name">${safeText(user.full_name || user.username || "کاربر")}</h4>
            <time class="comment-date">${formatDate(c.created_at)}</time>
          </div>
        </div>
        <p class="comment-text">${safeText(c.content, "")}</p>
        <button class="comment-reply">پاسخ</button>
      </article>
    `;
  }).join("");

  bindReplyButtons();
}

function renderRelated(related) {
  const sec = $("#related-posts");
  const grid = $("#related-grid");

  if (!related || !related.length) {
    sec.style.display = "none";
    return;
  }

  sec.style.display = "block";
  grid.innerHTML = related.map(p => {
    const img = p.cover_media?.url || "/placeholder.svg?height=200&width=300";
    const excerpt = safeText(p.excerpt, "").slice(0, 120); // excerpt متن ساده است
    return `
      <article class="related-post">
        <img src="${img}" alt="${safeText(p.title)}" class="related-image">
        <div class="related-content">
          <h3 class="related-title">${safeText(p.title)}</h3>
          <p class="related-excerpt">${excerpt}${excerpt.length ? "..." : ""}</p>
          <a href="/single-post-page.html?slug=${encodeURIComponent(p.slug)}" class="read-more">مطالعه بیشتر →</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderHotPosts(posts) {
  const cont = $("#hot-posts");
  if (!posts || !posts.length) {
    cont.innerHTML = `<p style="opacity:.7">مطلب داغی پیدا نشد.</p>`;
    return;
  }

  cont.innerHTML = posts.map(p => {
    const img = p.cover_media?.url || "/placeholder.svg?height=100&width=100";
    return `
      <article class="hot-post">
        <img src="${img}" alt="${safeText(p.title)}" class="hot-post-image">
        <div>
          <h4 class="hot-post-title">${safeText(p.title)}</h4>
          <p class="hot-post-meta">${safeText(p.views_count, 0)} بازدید</p>
          <a class="read-more" href="/single-post-page.html?slug=${encodeURIComponent(p.slug)}">باز کردن</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderCategories(cats) {
  const ul = $("#categories-list");
  if (!cats || !cats.length) {
    ul.innerHTML = `<li style="opacity:.7">دسته‌بندی ندارد</li>`;
    return;
  }

  ul.innerHTML = cats.map(c => `
    <li><a href="/blog?category=${encodeURIComponent(c.slug || c.title || c.name)}">${safeText(c.title || c.name)}</a> (${safeText(c.posts_count, 0)})</li>
  `).join("");
}

// =====================
// Fetchers
// =====================
async function loadPostAndPage(slug) {
  const post = await apiGet(`/api/blog/posts/${slug}/`);
  renderBreadcrumb(post);
  renderPost(post);
  bindShareButtons();
  bindCommentForm(post);
  return post;
}

async function loadRelated(slug) {
  try {
    const related = await apiGet(`/api/blog/posts/${slug}/related/`);
    renderRelated(Array.isArray(related) ? related : related?.results || []);
  } catch (e) {
    console.warn("related fetch failed:", e.message);
    renderRelated([]);
  }
}

async function loadHotPosts() {
  try {
    const data = await apiGet(`/api/blog/posts/?ordering=-views_count&page_size=3`);
    renderHotPosts(data?.results || []);
  } catch (e) {
    console.warn("hot posts fetch failed:", e.message);
  }
}

async function loadCategories() {
  try {
    const data = await apiGet(`/api/blog/categories/?page_size=50`);
    renderCategories(data?.results || []);
  } catch (e) {
    console.warn("categories fetch failed:", e.message);
  }
}

// =====================
// Bindings
// =====================
function bindShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', function(e) {
      e.preventDefault();

      const shareType = this.className.match(/share-(\w+)/)[1];
      const title = document.querySelector('.article-title').textContent;
      const url = window.location.href;
      const text = `${title} - ${window.location.hostname}`;

      const shareUrls = {
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        copy: null
      };

      if (shareType === 'copy') {
        navigator.clipboard.writeText(url).then(() => alert('لینک کپی شد!'));
      } else if (shareUrls[shareType]) {
        window.open(shareUrls[shareType], '_blank', 'width=600,height=400');
      }
    });
  });
}

function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  console.log('[newsletter] subscription:', email);
  alert('با تشکر! شما برای خبرنامه ثبت‌نام کردید.');
  e.target.reset();
}

function bindReplyButtons() {
  document.querySelectorAll('.comment-reply').forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const commentForm = $('.comment-form');
      commentForm.scrollIntoView({ behavior: 'smooth' });
      commentForm.querySelector('textarea').focus();
    });
  });
}

function bindCommentForm(post) {
  const form = $("#comment-form");
  const msg = $("#comment-form-msg");

  const postId = post.id;
  if (!postId) {
    msg.textContent = "⚠️ ارسال نظر فعلاً ممکن نیست (شناسه‌ی پست از API نیامده).";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    if (!postId) {
      msg.textContent = "شناسه‌ی پست موجود نیست؛ لطفاً به بک‌اند بگو id را در PostDetail برگرداند.";
      return;
    }

    const name = $("#comment-name").value.trim();
    const email = $("#comment-email").value.trim();
    const content = $("#comment-content").value.trim();

    try {
      form.querySelector("button[type=submit]").disabled = true;
      msg.textContent = "در حال ارسال…";

      await apiPost(`/api/blog/comments/`, {
        post: postId,
        content,
        parent: null
      });

      msg.textContent = "✅ نظر شما با موفقیت ارسال شد.";
      form.reset();

      const freshPost = await apiGet(`/api/blog/posts/${post.slug}/`);
      renderComments(freshPost.comments || []);
      $("#comments-title").textContent = `نظرات (${(freshPost.comments || []).length})`;

      console.log("[comment] sent by", { name, email });
    } catch (err) {
      console.error(err);
      msg.textContent = "❌ ارسال نظر خطا داشت. دوباره تلاش کنید.";
    } finally {
      form.querySelector("button[type=submit]").disabled = false;
    }
  });
}

// =====================
// Init
// =====================
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const slug = getSlugFromUrl();
    if (!slug) throw new Error("slug not found");

    await loadPostAndPage(slug);
    loadRelated(slug);
    loadHotPosts();
    loadCategories();
  } catch (e) {
    console.error(e);
    $("#post-title").textContent = "پست پیدا نشد یا خطا در دریافت اطلاعات.";
    $("#post-content").innerHTML = `<p style="opacity:.7">${e.message}</p>`;
  }
});

// Image lazy logging (kept)
const images = document.querySelectorAll('img');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('[img] loaded:', entry.target.alt);
        imageObserver.unobserve(entry.target);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
