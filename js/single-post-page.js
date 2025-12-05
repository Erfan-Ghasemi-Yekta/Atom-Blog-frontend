// single-post-page.js — وصل به https://atom-game.ir/api/blog و بدون placeholder

const $ = (sel) => document.querySelector(sel);

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function safeText(x, fallback = "") {
  return x === null || x === undefined ? fallback : x;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return ch;
    }
  });
}

function renderMarkdown(mdText) {
  if (!mdText) return "";
  let html = "";

  if (typeof marked !== "undefined") {
    const rawHtml = marked.parse(mdText, { breaks: true, gfm: true });
    html = rawHtml;
  } else {
    html = escapeHtml(mdText).replace(/\n/g, "<br>");
  }

  // همه عکس‌ها lazy
  html = html.replace(/<img /g, '<img loading="lazy" ');

  if (typeof DOMPurify !== "undefined") {
    return DOMPurify.sanitize(html);
  }
  return html;
}

// ------------------ Breadcrumb & main rendering ------------------

function renderBreadcrumb(post) {
  const bc = $("#breadcrumb");
  if (!bc) return;

  const category = safeText(post.category, "وبلاگ");

  bc.innerHTML = `
    <a href="/" class="breadcrumb-link">اتم گیم</a>
    <span class="breadcrumb-separator">/</span>
    <a href="/blog" class="breadcrumb-link">وبلاگ</a>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-category">${category}</span>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-current">${safeText(post.title)}</span>
  `;
}

function renderPost(post) {
  const pageTitleEl = document.getElementById("page-title");
  if (pageTitleEl) {
    pageTitleEl.textContent = safeText(
      post.seo_title || post.title || "پست وبلاگ"
    );
  }

  $("#post-title").textContent = safeText(post.title, "—");
  $("#category-badge").textContent = safeText(post.category, "—");

  const author = post.author || {};
  $("#author-name").textContent = safeText(
    author.full_name || author.display_name || author.username || author.name,
    "—"
  );
  $("#publish-date").textContent = formatDate(post.published_at);
  $("#views-count").textContent = safeText(post.views_count, 0);

  // آواتار نویسنده (بدون placeholder)
  const avatarEl = $("#author-avatar");
  if (avatarEl) {
    let avatarSrc = null;
    if (author.avatar && typeof author.avatar === "object" && author.avatar.url) {
      avatarSrc = author.avatar.url;
    } else if (typeof author.avatar === "string") {
      avatarSrc = author.avatar;
    } else if (author.avatar_url) {
      avatarSrc = author.avatar_url;
    }

    if (avatarSrc) {
      avatarEl.src = avatarSrc;
      avatarEl.style.display = "block";
    } else {
      avatarEl.style.display = "none";
    }
  }

  // تصویر کاور
  const cover = post.cover_media || post.og_image;
  const coverFigure = $("#cover-figure");

  if (cover && cover.url) {
    const imgEl = $("#cover-image");
    if (imgEl) {
      imgEl.src = cover.url;
      imgEl.alt = safeText(cover.alt_text || post.title, "");
      imgEl.loading = "lazy";
    }
    const captionEl = $("#cover-caption");
    if (captionEl) {
      captionEl.textContent = safeText(cover.caption || cover.title, "");
    }
    if (coverFigure) {
      coverFigure.style.display = "block";
    }
  } else if (coverFigure) {
    coverFigure.style.display = "none";
  }

  $("#post-content").innerHTML = renderMarkdown(post.content);

  const comments = Array.isArray(post.comments) ? post.comments : [];
  $("#comments-title").textContent = `نظرات (${
    post.comments_count ?? comments.length
  })`;
  renderComments(comments);
}

function renderComments(comments) {
  const list = $("#comments-list");
  if (!list) return;

  if (!comments.length) {
    list.innerHTML = `<p style="opacity:.7">هنوز نظری ثبت نشده.</p>`;
    return;
  }

  list.innerHTML = comments
    .map((c) => {
      const user = c.user || c.author || {};
      const name =
        user.full_name ||
        user.display_name ||
        user.username ||
        c.user_display ||
        "کاربر";

      let avatarSrc = null;
      if (user.avatar && typeof user.avatar === "object" && user.avatar.url) {
        avatarSrc = user.avatar.url;
      } else if (typeof user.avatar === "string") {
        avatarSrc = user.avatar;
      } else if (user.avatar_url) {
        avatarSrc = user.avatar_url;
      }

      const avatarHtml = avatarSrc
        ? `<img src="${avatarSrc}" alt="${escapeHtml(
            name
          )}" class="comment-avatar" loading="lazy">`
        : "";

      return `
      <article class="comment" data-comment-id="${c.id}">
        <div class="comment-header">
          ${avatarHtml}
          <div class="comment-author">
            <h4 class="comment-name">${escapeHtml(name)}</h4>
            <time class="comment-date">${formatDate(c.created_at)}</time>
          </div>
        </div>
        <p class="comment-text">${escapeHtml(c.content || "")}</p>
        <button class="comment-reply">پاسخ</button>
      </article>
    `;
    })
    .join("");

  bindReplyButtons();
}

// ------------------ Related posts (main) ------------------

function renderRelated(related) {
  const sec = $("#related-posts");
  const grid = $("#related-grid");

  if (!sec || !grid) return;

  if (!related || !related.length) {
    sec.style.display = "none";
    return;
  }

  sec.style.display = "block";

  grid.innerHTML = related
    .map((p) => {
      const img = p.cover_media?.url || null;
      const excerpt = safeText(p.excerpt, "").slice(0, 120);
      const dateRaw = p.published_at || p.created_at;
      const dateText = dateRaw ? formatDate(dateRaw) : "";
      const slug = encodeURIComponent(p.slug || "");
      const url = `/html/single-post-page.html?slug=${slug}`;

      const imgHtml = img
        ? `<a href="${url}" class="related-image-link">
             <img src="${img}" alt="${escapeHtml(
            safeText(p.title)
          )}" class="related-image" loading="lazy">
           </a>`
        : "";

      return `
      <article class="related-post">
        ${imgHtml}
        <div class="related-content">
          <a href="${url}" class="related-title-link">
            <h3 class="related-title">${escapeHtml(safeText(p.title))}</h3>
          </a>

          <p class="related-excerpt">${escapeHtml(excerpt)}${
        excerpt.length ? "..." : ""
      }</p>

          ${
            dateText
              ? `<p class="related-meta">
                   <span class="related-date">تاریخ انتشار: ${dateText}</span>
                 </p>`
              : ""
          }
        </div>
      </article>
    `;
    })
    .join("");
}

// ------------------ Sidebar lists ------------------

function renderRelatedSidebarPosts(posts) {
  const cont = $("#related-posts-widget");
  if (!cont) return;

  if (!posts || !posts.length) {
    cont.innerHTML = `<p style="opacity:.7">مطلبی پیدا نشد.</p>`;
    return;
  }

  cont.innerHTML = posts
    .map((p) => {
      const img = p.cover_media?.url || null;
      const slug = encodeURIComponent(p.slug || "");
      const url = `/html/single-post-page.html?slug=${slug}`;

      const imgHtml = img
        ? `<img src="${img}" alt="${escapeHtml(
            safeText(p.title)
          )}" class="related-post-image" loading="lazy">`
        : "";

      return `
      <article class="related-post-item" data-url="${url}">
        ${imgHtml}
        <div>
          <h4 class="related-post-title">${escapeHtml(
            safeText(p.title)
          )}</h4>
          <p class="related-post-meta">${safeText(
            p.views_count,
            0
          )} بازدید</p>
        </div>
      </article>
    `;
    })
    .join("");

  bindRelatedSidebarPostClicks();
}

function renderMostViewedSidebarPosts(posts) {
  const cont = $("#most-viewed-widget");
  if (!cont) return;

  if (!posts || !posts.length) {
    cont.innerHTML = `<p style="opacity:.7">مطلبی پیدا نشد.</p>`;
    return;
  }

  cont.innerHTML = posts
    .map((p) => {
      const img = p.cover_media?.url || null;
      const slug = encodeURIComponent(p.slug || "");
      const url = `/html/single-post-page.html?slug=${slug}`;

      const imgHtml = img
        ? `<img src="${img}" alt="${escapeHtml(
            safeText(p.title)
          )}" class="related-post-image" loading="lazy">`
        : "";

      return `
      <article class="related-post-item" data-url="${url}">
        ${imgHtml}
        <div>
          <h4 class="related-post-title">${escapeHtml(
            safeText(p.title)
          )}</h4>
          <p class="related-post-meta">${safeText(
            p.views_count,
            0
          )} بازدید</p>
        </div>
      </article>
    `;
    })
    .join("");

  bindRelatedSidebarPostClicks();
}

function bindRelatedSidebarPostClicks() {
  document.querySelectorAll(".related-post-item").forEach((item) => {
    const url = item.getAttribute("data-url");
    if (!url) return;

    const img = item.querySelector(".related-post-image");
    const title = item.querySelector(".related-post-title");

    [img, title].forEach((el) => {
      if (!el) return;
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        window.location.href = url;
      });
    });
  });
}

// ------------------ Share & reply buttons ------------------

function bindShareButtons() {
  document.querySelectorAll(".share-btn").forEach((btn) => {
    btn.onclick = null;
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const shareTypeMatch = this.className.match(/share-(\w+)/);
      if (!shareTypeMatch) return;
      const shareType = shareTypeMatch[1];

      const title =
        document.querySelector(".article-title")?.textContent || document.title;
      const url = window.location.href;
      const text = `${title} - ${window.location.hostname}`;

      const shareUrls = {
        telegram: `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          text + " " + url
        )}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`,
        copy: null,
      };

      if (shareType === "copy") {
        navigator.clipboard
          .writeText(url)
          .then(() => alert("لینک کپی شد!"));
      } else if (shareUrls[shareType]) {
        window.open(shareUrls[shareType], "_blank", "width=600,height=400");
      }
    });
  });
}

function bindReplyButtons() {
  document.querySelectorAll(".comment-reply").forEach((btn) => {
    btn.onclick = null;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const commentForm = $(".comment-form");
      if (!commentForm) return;
      commentForm.scrollIntoView({ behavior: "smooth" });
      const textarea = commentForm.querySelector("textarea");
      if (textarea) textarea.focus();
    });
  });
}

// ------------------ API helpers ------------------

const BLOG_API_BASE = "https://atom-game.ir/api/blog";

function getAuthHeaders({ json = false } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const possibleKeys = ["accessToken", "access", "token", "authToken"];
    let token = null;
    for (const key of possibleKeys) {
      const val = window.localStorage?.getItem(key);
      if (val) {
        token = val;
        break;
      }
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // ...
  }

  return headers;
}

async function apiGet(path) {
  const url = path.startsWith("http") ? path : `${BLOG_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: getAuthHeaders({ json: false }),
  });

  if (!res.ok) {
    throw new Error(`خطا در دریافت داده از سرور (${res.status})`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function apiPost(path, body) {
  const url = path.startsWith("http") ? path : `${BLOG_API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders({ json: true }),
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && data.detail) ||
      (typeof data === "string" ? data : "") ||
      `خطای ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function getSlugFromLocation() {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("slug");
    if (fromQuery) return fromQuery;
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

// ------------------ Comment form ------------------

function bindCommentForm(post) {
  const form = $("#comment-form");
  const msg = $("#comment-form-msg");

  if (!form || !msg) return;

  const postId = post.id;
  if (!postId) {
    msg.textContent =
      "⚠️ ارسال نظر فعلاً ممکن نیست (شناسه‌ی پست از API برنمی‌گردد).";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    if (!postId) {
      msg.textContent =
        "شناسه‌ی پست موجود نیست؛ لطفاً در بک‌اند فیلد id را به PostDetail اضافه کنید.";
      return;
    }

    const content = $("#comment-content")?.value.trim();

    if (!content) {
      msg.textContent = "متن نظر نمی‌تواند خالی باشد.";
      return;
    }

    try {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = true;
      msg.textContent = "در حال ارسال…";

      const payload = {
        post: postId,
        content,
      };

      await apiPost(`/comments/`, payload);

      msg.textContent = "✅ نظر شما با موفقیت ثبت شد.";
      form.reset();

      try {
        const refreshed = await apiGet(
          `/posts/${encodeURIComponent(post.slug)}/`
        );
        if (refreshed && Array.isArray(refreshed.comments)) {
          renderComments(refreshed.comments);
          $("#comments-title").textContent = `نظرات (${
            refreshed.comments_count ?? refreshed.comments.length
          })`;
        }
      } catch (e) {
        console.warn("خطا در تازه‌سازی نظرات:", e);
      }
    } catch (err) {
      console.error(err);
      msg.textContent =
        "❌ ارسال نظر با خطا مواجه شد: " + (err.message || "مشکل ناشناخته");
    } finally {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ------------------ Init ------------------

document.addEventListener("DOMContentLoaded", async function () {
  const slug = getSlugFromLocation();

  if (!slug) {
    $("#post-title").textContent = "پست پیدا نشد";
    $("#post-content").innerHTML =
      "<p style='opacity:.7'>اسلاگ پست در آدرس صفحه پیدا نشد.</p>";
    return;
  }

  try {
    const post = await apiGet(`/posts/${encodeURIComponent(slug)}/`);
    if (!post || !post.slug) {
      throw new Error("پست موردنظر پیدا نشد.");
    }

    renderBreadcrumb(post);
    renderPost(post);
    bindShareButtons();
    bindCommentForm(post);

    // -------- مطالب مرتبط: ساده، همه‌چیز با بک‌اند --------
    let related = [];
    try {
      const rel = await apiGet(`/posts/${encodeURIComponent(slug)}/related/`);
      if (Array.isArray(rel)) {
        related = rel;
      } else if (rel && Array.isArray(rel.results)) {
        related = rel.results;
      }
    } catch (e) {
      console.warn("خطا در دریافت مطالب مرتبط:", e);
    }

    renderRelated(related);
    renderRelatedSidebarPosts(related);

    // -------- پر بازدیدترین‌ها --------
    try {
      const mv = await apiGet(`/posts/?ordering=-views_count&page_size=5`);
      let mostViewed = [];
      if (Array.isArray(mv)) {
        mostViewed = mv;
      } else if (mv && Array.isArray(mv.results)) {
        mostViewed = mv.results;
      }
      renderMostViewedSidebarPosts(mostViewed);
    } catch (e) {
      console.warn("خطا در دریافت پر بازدیدترین‌ها:", e);
      if (related.length) {
        renderMostViewedSidebarPosts(related);
      }
    }
  } catch (e) {
    console.error(e);
    $("#post-title").textContent = "خطا در بارگذاری پست";
    $("#post-content").innerHTML = `<p style="opacity:.7">${escapeHtml(
      e.message || "مشکلی در ارتباط با سرور پیش آمد."
    )}</p>`;
  }
});

// لاگ ساده برای لود شدن تصاویر (اختیاری)
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(
            "[img] in view:",
            entry.target.alt || entry.target.src
          );
          imageObserver.unobserve(entry.target);
        }
      });
    });
    images.forEach((img) => imageObserver.observe(img));
  }
});
