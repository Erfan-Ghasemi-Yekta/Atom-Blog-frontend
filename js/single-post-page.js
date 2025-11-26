// =====================
// Local Data
// =====================
const localData = {
  post: {
    id: 1,
    slug: "local-post-slug",
    title: "این یک پست محلی است",
    seo_title: "پست محلی برای تست",
    category: "تکنولوژی",
    author: {
      full_name: "نویسنده تستی",
      username: "test-author",
      avatar: "../img/logo.png"
    },
    published_at: new Date().toISOString(),
    reading_time_sec: 180,
    views_count: 1234,
    cover_media: {
      url: "../img/blog/post-1.jpg",
      alt_text: "تصویر اصلی پست",
      caption: "این یک تصویر تستی است"
    },
    content: `
این یک متن **تستی** برای نمایش محتوای پست است.

## عنوان تستی

- لیست ۱
- لیست ۲
- لیست ۳

لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
`,
    tags: [
      { name: "تگ ۱", slug: "tag-1" },
      { name: "تگ ۲", slug: "tag-2" }
    ],
    comments: [
      {
        id: 1,
        user: { full_name: "کاربر ۱", avatar: "../img/logo.png" },
        created_at: new Date().toISOString(),
        content: "این یک کامنت تستی است."
      },
      {
        id: 2,
        user: { full_name: "کاربر ۲", avatar: "../img/logo.png" },
        created_at: new Date().toISOString(),
        content: "این هم یک کامنت دیگر."
      }
    ]
  },
  relatedPosts: [
    {
      slug: "related-1",
      title: "پست مرتبط ۱",
      excerpt: "خلاصه پست مرتبط ۱...",
      cover_media: { url: "../img/blog/post-2.jpg" }
    },
    {
      slug: "related-2",
      title: "پست مرتبط ۲",
      excerpt: "خلاصه پست مرتبط ۲...",
      cover_media: { url: "../img/blog/post-3.jpg" }
    }
  ],
  hotPosts: [
    {
      slug: "hot-1",
      title: "پست داغ ۱",
      views_count: 9876,
      cover_media: { url: "../img/blog/post-4.jpg" }
    },
    {
      slug: "hot-2",
      title: "پست داغ ۲",
      views_count: 5432,
      cover_media: { url: "../img/blog/post-5.jpg" }
    },
    {
      slug: "hot-3",
      title: "پست داغ ۳",
      views_count: 1234,
      cover_media: { url: "../img/blog/post-6.jpg" }
    }
  ],
  categories: [
    { name: "دسته ۱", slug: "cat-1", posts_count: 10 },
    { name: "دسته ۲", slug: "cat-2", posts_count: 5 },
    { name: "دسته ۳", slug: "cat-3", posts_count: 2 }
  ]
};

// =====================
// Helpers
// =====================
const $ = (sel) => document.querySelector(sel);

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

      // Mocking comment submission
      console.log("Mock comment submission:", { name, email, content });
      msg.textContent = "✅ نظر شما با موفقیت ارسال شد (شبیه‌سازی شده).";
      form.reset();

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
document.addEventListener('DOMContentLoaded', function() {
  try {
    renderBreadcrumb(localData.post);
    renderPost(localData.post);
    bindShareButtons();
    bindCommentForm(localData.post);

    renderRelated(localData.relatedPosts);
    renderHotPosts(localData.hotPosts);
    renderCategories(localData.categories);
  } catch (e) {
    console.error(e);
    $("#post-title").textContent = "پست پیدا نشد یا خطا در بارگذاری اطلاعات.";
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
