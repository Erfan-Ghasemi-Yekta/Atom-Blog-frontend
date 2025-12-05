// Updated single-post-page.js — نسخهٔ به‌روز شده با محتوای غنی‌تر و تصاویر از طریق CDN

// Helpers for CDN
function cdn(src, opts = {}) {
  if (!src) return src;
  try {
    const params = new URLSearchParams();
    if (opts.w) params.set('w', String(opts.w));
    if (opts.h) params.set('h', String(opts.h));
    if (opts.fit) params.set('fit', opts.fit);
    if (opts.output) params.set('output', opts.output);
    if (opts.q) params.set('q', String(opts.q));
    const encoded = encodeURIComponent(src);
    const base = `https://images.weserv.nl/?url=${encoded}`;
    const suffix = params.toString();
    return suffix ? `${base}&${suffix}` : base;
  } catch (e) {
    return src;
  }
}

// =====================
// Local Data
// =====================
const localData = {
  post: {
    id: 1,
    slug: "local-post-slug",
    title: "چگونه یک وبلاگ حرفه‌ای بسازیم — تجربه و نکات عملی",
    seo_title: "راهنمای جامع ساخت وبلاگ حرفه‌ای",
    category: "تکنولوژی",
    author: {
      full_name: "نویسنده تستی",
      username: "test-author",
      avatar: cdn('https://picsum.photos/id/1005/80/80', {
        w: 80,
        h: 80,
        fit: 'cover',
        output: 'webp',
        q: 80
      })
    },
    published_at: new Date().toISOString(),
    reading_time_sec: 720,
    views_count: 1234,
    cover_media: {
      url: cdn('https://picsum.photos/id/1015/1200/600', {
        w: 1200,
        h: 600,
        fit: 'cover',
        output: 'webp',
        q: 80
      }),
      alt_text: "تصویر اصلی پست - نمایی از کد و کار در لپ‌تاپ",
    },
    content: `
این مقاله راهنمای عملی و واقعی برای ساخت و مدیریت یک **وبلاگ حرفه‌ای** است. هدف ما این است که از صفر تا صد، نکات قابل اجرا، ابزارها و اشتباهات رایج را پوشش دهیم.

## چرا وبلاگ؟
وبلاگ‌نویسی هنوز هم یکی از بهترین روش‌ها برای ساخت برند شخصی، نشان دادن نمونه‌کارها و جذب مخاطب هدف است. در این راهنما موارد زیر را یاد می‌گیرید:

- انتخاب پلتفرم مناسب
- نوشتن محتوای خواندنی و قابل اشتراک‌گذاری
- بهینه‌سازی برای موتورهای جستجو (SEO)
- انتشار منظم و برنامه‌ریزی محتوا


![کار با لپ‌تاپ و کد](${cdn('https://picsum.photos/id/1025/1000/500', {
      w: 1000,
      h: 500,
      fit: 'cover',
      output: 'webp',
      q: 80
    })})

### انتخاب پلتفرم
برای شروع، بین دو گزینهٔ رایج یکی را انتخاب کنید: سایت‌سازهای آماده (مثل Ghost، WordPress.com) یا سایت خود میزبانی‌شده که کنترل کامل دارد (مثل WordPress.org، Static sites با Netlify). اگر بهینه‌سازی و سرعت برایتان مهم است، سایت استاتیک + CDN گزینهٔ بسیار خوبی است.

#### نکات تجربه کاربری (UX)
- منوی ساده و قابل‌خواندن داشته باشید.
- فونت مناسب و اندازهٔ متن را رعایت کنید.
- برای تصاویر از فرمت‌های بهینه مثل WebP استفاده کنید.

![نمونهٔ تصویر کوچک داخل مطلب](${cdn('https://picsum.photos/id/1035/800/450', {
      w: 800,
      h: 450,
      fit: 'cover',
      output: 'webp',
      q: 80
    })})

### تولید محتوا — ساختار یک پست
یک پست خوب معمولاً شامل بخش‌های زیر است:

1. لید قدرتمند — چند جملهٔ اول که مخاطب را جذب کند.
2. تیترها و زیرتیترهای واضح — برای اسکن شدن سریع متن.
3. تصاویر و کد نمونه — برای بهبود درک مطلب.
4. بخش نتیجه‌گیری و فراخوان به عمل (CTA).

> نکته: همیشه متن را قبل از انتشار یک بار بلندخوانی کنید.

### بهینه‌سازی تصاویر
برای اینکه صفحات سریع لود شوند:

- تصاویر را قبل از آپلود فشرده کنید.
- از lazy-loading استفاده کنید.
- از CDN برای تحویل تصاویر استفاده کنید.

![نحوهٔ بهینه‌سازی تصویر](${cdn('https://picsum.photos/id/1043/900/500', {
      w: 900,
      h: 500,
      fit: 'cover',
      output: 'webp',
      q: 80
    })})

### مثال عملی — افزودن تصویر و تگ‌ها
در بخش کد یا CMS خود کافی است در Markdown بنویسید:

\`\`\`
![توضیح تصویر](${cdn('https://picsum.photos/id/1050/1200/600', {
      w: 1200,
      h: 600,
      fit: 'cover',
      output: 'webp',
      q: 80
    })})
\`\`\`

## نتیجه‌گیری
وبلاگ‌نویسی ترکیبی از خلاقیت، نظم و اصلاح مستمر است. با تمرکز روی کیفیت و تجربهٔ خواننده، در بلندمدت نتیجهٔ بهتری خواهید گرفت.

---
`,
    comments: [
      {
        id: 1,
        user: {
          full_name: "کاربر ۱",
          avatar: cdn('https://picsum.photos/id/1011/64/64', {
            w: 64,
            h: 64,
            fit: 'cover',
            output: 'webp',
            q: 80
          })
        },
        created_at: new Date().toISOString(),
        content: "این یک کامنت تستی است. مقاله عالی و کاربردی بود!"
      },
      {
        id: 2,
        user: {
          full_name: "کاربر ۲",
          avatar: cdn('https://picsum.photos/id/1001/64/64', {
            w: 64,
            h: 64,
            fit: 'cover',
            output: 'webp',
            q: 80
          })
        },
        created_at: new Date().toISOString(),
        content: "ممنون! لینک منابع خارجی هم دارید؟"
      }
    ]
  },
  relatedPosts: [
    {
      slug: "related-1",
      title: "پست مرتبط: طراحی تجربه کاربری",
      excerpt: "اصول طراحی تجربه کاربری که باید بدانید...",
      published_at: new Date().toISOString(),
      cover_media: {
        url: cdn('https://picsum.photos/id/1003/600/350', {
          w: 600,
          h: 350,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "related-2",
      title: "پست مرتبط: بهینه‌سازی تصاویر برای وب",
      excerpt: "چگونه تصاویر را برای وب بهینه کنیم...",
      published_at: new Date().toISOString(),
      cover_media: {
        url: cdn('https://picsum.photos/id/1019/600/350', {
          w: 600,
          h: 350,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    }
  ],

  // این آرایه الان ۵ تا آیتم داره تا توی سایدبار ۵ پست مرتبط نشان دهد
  relatedSidebarPosts: [
    {
      slug: "sidebar-related-1",
      title: "پست مرتبط ۱: افزایش سرعت سایت",
      views_count: 9876,
      cover_media: {
        url: cdn('https://picsum.photos/id/1020/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "sidebar-related-2",
      title: "پست مرتبط ۲: انتخاب هاست مناسب",
      views_count: 5432,
      cover_media: {
        url: cdn('https://picsum.photos/id/1027/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "sidebar-related-3",
      title: "پست مرتبط ۳: سئو در 2025",
      views_count: 4321,
      cover_media: {
        url: cdn('https://picsum.photos/id/1032/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "sidebar-related-4",
      title: "پست مرتبط ۴: تولید محتوای ماندگار",
      views_count: 3980,
      cover_media: {
        url: cdn('https://picsum.photos/id/1040/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "sidebar-related-5",
      title: "پست مرتبط ۵: لینک‌سازی هوشمند",
      views_count: 3655,
      cover_media: {
        url: cdn('https://picsum.photos/id/1045/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    }
  ],

  // آرایه‌ی مخصوص «پر بازدید ترین‌ها» در سایدبار (۵ آیتم)
  mostViewedSidebarPosts: [
    {
      slug: "most-viewed-1",
      title: "پر بازدید ۱: ۱۰ ترفند سئو",
      views_count: 15000,
      cover_media: {
        url: cdn('https://picsum.photos/id/1050/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "most-viewed-2",
      title: "پر بازدید ۲: ساخت استراتژی محتوا",
      views_count: 13250,
      cover_media: {
        url: cdn('https://picsum.photos/id/1060/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "most-viewed-3",
      title: "پر بازدید ۳: اشتباهات مرگبار در وبلاگ",
      views_count: 12010,
      cover_media: {
        url: cdn('https://picsum.photos/id/1070/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "most-viewed-4",
      title: "پر بازدید ۴: افزایش نرخ کلیک",
      views_count: 11005,
      cover_media: {
        url: cdn('https://picsum.photos/id/1080/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    },
    {
      slug: "most-viewed-5",
      title: "پر بازدید ۵: انتخاب کلمات کلیدی",
      views_count: 10550,
      cover_media: {
        url: cdn('https://picsum.photos/id/1090/200/120', {
          w: 200,
          h: 120,
          fit: 'cover',
          output: 'webp',
          q: 80
        })
      }
    }
  ]
}; // ✅ این براکت و سمی‌کالن مهم بود

// =====================
// Helpers & Rendering
// =====================
const $ = (sel) => document.querySelector(sel);

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

function readingTimeFromSeconds(sec) {
  if (!sec && sec !== 0) return "—";
  const min = Math.max(1, Math.ceil(sec / 60));
  return `${min} دقیقه`;
}

function safeText(x, fallback = "") {
  return (x === null || x === undefined) ? fallback : x;
}

function renderMarkdown(mdText) {
  if (!mdText) return "";
  const rawHtml = marked.parse(mdText, { breaks: true, gfm: true });
  const withLazy = rawHtml.replace(/<img /g, '<img loading="lazy" ');
  return DOMPurify.sanitize(withLazy);
}

function renderBreadcrumb(post) {
  const bc = $("#breadcrumb");
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
    const imgEl = $("#cover-image");
    imgEl.src = cover.url;
    imgEl.alt = safeText(cover.alt_text || post.title, "");
    imgEl.setAttribute('loading', 'lazy');
    $("#cover-caption").textContent = safeText(cover.caption, "");
    $("#cover-figure").style.display = "block";
  } else {
    $("#cover-figure").style.display = "none";
  }

  $("#post-content").innerHTML = renderMarkdown(post.content);

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
          <img src="${safeText(user.avatar || "/placeholder.svg?height=40&width=40")}" alt="کاربر" class="comment-avatar" loading="lazy">
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

// ✅ نسخه جدید رندر «مطالب مرتبط» با:
// - نمایش تایتل، خلاصه، تصویر، تاریخ انتشار
// - حذف دکمه «مطالعه بیشتر»
// - لینک شدن عکس و تایتل به صفحه پست
// - تاریخ انتشار زیر excerpt قرار گرفته
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
    const excerpt = safeText(p.excerpt, "").slice(0, 120);
    const dateRaw = p.published_at || p.created_at;
    const dateText = dateRaw ? formatDate(dateRaw) : "";
    const slug = encodeURIComponent(p.slug || "");
    const url = `/single-post-page.html?slug=${slug}`;

    return `
      <article class="related-post">
        <a href="${url}" class="related-image-link">
          <img src="${img}" alt="${safeText(p.title)}" class="related-image" loading="lazy">
        </a>
        <div class="related-content">
          <a href="${url}" class="related-title-link">
            <h3 class="related-title">${safeText(p.title)}</h3>
          </a>

          <p class="related-excerpt">${excerpt}${excerpt.length ? "..." : ""}</p>

          ${dateText
            ? `<p class="related-meta">
                 <span class="related-date">تاریخ انتشار: ${dateText}</span>
               </p>`
            : ""
          }
        </div>
      </article>
    `;
  }).join("");
}

// ✅ نسخه جدید رندر سایدبار بدون دکمه «باز کردن»
// و با امکان کلیک روی عکس و عنوان برای رفتن به صفحه‌ی پست
function renderRelatedSidebarPosts(posts) {
  const cont = $("#related-posts-widget");
  if (!posts || !posts.length) {
    cont.innerHTML = `<p style="opacity:.7">مطلبی پیدا نشد.</p>`;
    return;
  }

  cont.innerHTML = posts.map(p => {
    const img = p.cover_media?.url || "/placeholder.svg?height=100&width=100";
    const slug = encodeURIComponent(p.slug);
    const url = `/single-post-page.html?slug=${slug}`;
    return `
      <article class="related-post-item" data-url="${url}">
        <img src="${img}" alt="${safeText(p.title)}" class="related-post-image" loading="lazy">
        <div>
          <h4 class="related-post-title">${safeText(p.title)}</h4>
          <p class="related-post-meta">${safeText(p.views_count, 0)} بازدید</p>
        </div>
      </article>
    `;
  }).join("");

  bindRelatedSidebarPostClicks();
}

// ✅ رندر باکس «پر بازدید ترین‌ها» زیر سایدبار، با همان استایل
function renderMostViewedSidebarPosts(posts) {
  const cont = $("#most-viewed-widget");
  if (!cont) return;

  if (!posts || !posts.length) {
    cont.innerHTML = `<p style="opacity:.7">مطلبی پیدا نشد.</p>`;
    return;
  }

  cont.innerHTML = posts.map(p => {
    const img = p.cover_media?.url || "/placeholder.svg?height=100&width=100";
    const slug = encodeURIComponent(p.slug);
    const url = `/single-post-page.html?slug=${slug}`;
    return `
      <article class="related-post-item" data-url="${url}">
        <img src="${img}" alt="${safeText(p.title)}" class="related-post-image" loading="lazy">
        <div>
          <h4 class="related-post-title">${safeText(p.title)}</h4>
          <p class="related-post-meta">${safeText(p.views_count, 0)} بازدید</p>
        </div>
      </article>
    `;
  }).join("");

  // همان هندل کلیک را استفاده می‌کنیم
  bindRelatedSidebarPostClicks();
}

// این تابع روی عکس و متن هر آیتم سایدبار کلیک‌هندلر می‌گذارد
function bindRelatedSidebarPostClicks() {
  const items = document.querySelectorAll('.related-post-item');
  items.forEach(item => {
    const url = item.getAttribute('data-url');
    if (!url) return;

    const img = item.querySelector('.related-post-image');
    const title = item.querySelector('.related-post-title');

    [img, title].forEach(el => {
      if (!el) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.location.href = url;
      });
    });
  });
}

function bindShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const shareTypeMatch = this.className.match(/share-(\w+)/);
      if (!shareTypeMatch) return;
      const shareType = shareTypeMatch[1];

      const title = document.querySelector('.article-title')?.textContent || document.title;
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

function bindReplyButtons() {
  document.querySelectorAll('.comment-reply').forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const commentForm = $('.comment-form');
      if (!commentForm) return;
      commentForm.scrollIntoView({ behavior: 'smooth' });
      const textarea = commentForm.querySelector('textarea');
      if (textarea) textarea.focus();
    });
  });
}

function bindCommentForm(post) {
  const form = $("#comment-form");
  const msg = $("#comment-form-msg");

  if (!form || !msg) return;

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

    const name = $("#comment-name")?.value.trim();
    const email = $("#comment-email")?.value.trim();
    const content = $("#comment-content")?.value.trim();

    try {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = true;
      msg.textContent = "در حال ارسال…";

      console.log("Mock comment submission:", { name, email, content });
      msg.textContent = "✅ نظر شما با موفقیت ارسال شد (شبیه‌سازی شده).";
      form.reset();

    } catch (err) {
      console.error(err);
      msg.textContent = "❌ ارسال نظر خطا داشت. دوباره تلاش کنید.";
    } finally {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    renderBreadcrumb(localData.post);
    renderPost(localData.post);
    bindShareButtons();
    bindCommentForm(localData.post);

    renderRelated(localData.relatedPosts);
    renderRelatedSidebarPosts(localData.relatedSidebarPosts); // سایدبار: پست‌های مرتبط
    renderMostViewedSidebarPosts(localData.mostViewedSidebarPosts); // سایدبار: پر بازدید ترین‌ها
  } catch (e) {
    console.error(e);
    $("#post-title").textContent = "پست پیدا نشد یا خطا در بارگذاری اطلاعات.";
    $("#post-content").innerHTML = `<p style="opacity:.7">${e.message}</p>`;
  }
});

// Optional: log when images come into view
const images = document.querySelectorAll('img');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('[img] loaded:', entry.target.alt || entry.target.src);
        imageObserver.unobserve(entry.target);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
