// box.js
// -----------------------------
// لیست مقالات + دکمه «مشاهده بیشتر» متصل به API
// -----------------------------

// آدرس پایه‌ی API پست‌ها (در صورت نیاز این را تغییر بده)
const POSTS_API_URL = 'https://atom-game.ir/api/blog/posts/';

// تنظیمات بارگذاری
const PAGE_SIZE = 9; // تعداد کارت‌ها برای هر بار نمایش
let blogData = [];   // داده‌های دریافت‌شده از سرور، نرمال‌شده برای کارت‌ها
let currentIndex = 0;
let isLoading = false;

// کمکی: رفتن به صفحه «بیشتر بخوانید»
function goToReadMore(link) {
    if (!link) return;
    window.location.href = link;
}

// کمکی: فرمت تاریخ از ISO به تاریخ شمسی (fa-IR)
function formatPostDate(post) {
    const raw =
        post.published_at ||
        post.created_at ||
        post.updated_at ||
        null;

    if (!raw) return '';

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return '';

    return d.toLocaleDateString('fa-IR');
}

// کمکی: تبدیل یک Post از API به ساختار مورد نیاز کارت وبلاگ
function normalizePost(post) {
    // لینک «بیشتر بخوانید»
    const readMoreLink =
        post.canonical_url ||
        (post.slug ? `/blog/${post.slug}/` : `#/posts/${post.id}`);

    // برچسب/تگ‌ها (مثلاً "تگ۱ | تگ۲")
    let tagText = '';
    if (Array.isArray(post.tags) && post.tags.length > 0) {
        tagText = post.tags.map(t => t.name).join(' | ');
    }

    // تصویر کاور:
    // بسته به پیاده‌سازی بک‌اند، ممکن است یکی از این حالت‌ها وجود داشته باشد؛
    // اینجا چند حالت متداول در نظر گرفته شده و در نهایت اگر چیزی نبود، یک Placeholder استفاده می‌شود.
    let imageUrl = '';

    if (post.cover && post.cover.url) {
        imageUrl = post.cover.url;
    } else if (post.og_image && post.og_image.url) {
        imageUrl = post.og_image.url;
    } else if (post.cover_media && typeof post.cover_media === 'object' && post.cover_media.url) {
        imageUrl = post.cover_media.url;
    } else if (post.image && typeof post.image === 'string') {
        imageUrl = post.image;
    } else {
        // TODO: در صورت داشتن آدرس تصویر پیش‌فرض پروژه، اینجا جایگزین کن
        imageUrl = '../img/placeholders/blog-cover-placeholder.jpg';
    }

    return {
        id: post.id,
        title: post.title || '',
        excerpt: post.excerpt || '',
        image: imageUrl,
        tag: tagText,
        date: formatPostDate(post),
        readMoreLink: readMoreLink
    };
}

// ساخت کارت وبلاگ
function createBlogCard(blog) {
    const safeTitle = blog.title ? blog.title.replace(/"/g, '&quot;') : '';

    return `
        <div class="blog-card fade-in">
            <div class="blog-image" onclick="goToReadMore('${blog.readMoreLink}')">
                <img src="${blog.image}" alt="${safeTitle}">
                ${blog.tag ? `<span class="blog-tag">${blog.tag}</span>` : ''}
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-meta">
                    ${blog.date ? `<span class="blog-date">تاریخ انتشار: ${blog.date}</span>` : ''}
                    <button class="blog-read-more" onclick="goToReadMore('${blog.readMoreLink}')">
                        بیشتر بخوانید
                    </button>
                </div>
            </div>
        </div>
    `;
}

// append کردن کارت‌ها به container
function appendBlogCards(fromIndex, count) {
    const container = document.getElementById('blogContainer');
    if (!container) return;

    const slice = blogData.slice(fromIndex, fromIndex + count);
    if (slice.length === 0) return;

    const html = slice.map(b => createBlogCard(b)).join('');
    container.insertAdjacentHTML('beforeend', html);

    currentIndex += slice.length;

    updateLoadMoreButtonState();
}

// بروزرسانی وضعیت دکمه "مشاهده بیشتر"
function updateLoadMoreButtonState() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;

    if (currentIndex >= blogData.length) {
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'مورد دیگری وجود ندارد';
    } else {
        btn.removeAttribute('disabled');
        btn.textContent = 'مشاهده بیشتر';
    }
}

// گرفتن داده‌ها از API
async function fetchPostsFromApi() {
    if (isLoading) return;
    isLoading = true;

    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'در حال بارگذاری...';
    }

    try {
        const res = await fetch(POSTS_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('خطا در دریافت داده‌های وبلاگ');
        }

        const data = await res.json();

        // طبق OpenAPI، این endpoint یک آرایه از Post برمی‌گرداند
        const postsArray = Array.isArray(data)
            ? data
            : (Array.isArray(data.results) ? data.results : []);

        blogData = postsArray.map(normalizePost);
    } catch (err) {
        console.error(err);

        const container = document.getElementById('blogContainer');
        if (container && container.children.length === 0) {
            container.insertAdjacentHTML(
                'beforeend',
                '<p class="blog-error">خطایی در بارگذاری مقالات رخ داد. لطفاً دوباره تلاش کنید.</p>'
            );
        }

        if (btn) {
            btn.setAttribute('disabled', 'disabled');
            btn.textContent = 'خطا در بارگذاری';
        }
    } finally {
        isLoading = false;
    }
}

// بارگذاری اولیه صفحه
async function initBlogListing() {
    const container = document.getElementById('blogContainer');
    if (container) {
        container.innerHTML = '';
    }

    await fetchPostsFromApi();

    // اگر داده‌ای آمد، اولین PAGE_SIZE عدد را نمایش بده
    if (blogData.length > 0) {
        appendBlogCards(0, PAGE_SIZE);
    } else {
        // اگر هیچ پستی نبود، دکمه را هم غیرفعال کن
        updateLoadMoreButtonState();
    }
}

// کلیک روی "مشاهده بیشتر"
function onLoadMoreClicked() {
    if (isLoading) return;
    appendBlogCards(currentIndex, PAGE_SIZE);
}

// رویداد آماده‌شدن DOM
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        btn.addEventListener('click', onLoadMoreClicked);
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'در حال بارگذاری...';
    }

    initBlogListing();
});
