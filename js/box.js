// box.js
// -----------------------------
// لیست مقالات + دکمه «مشاهده بیشتر»
// با pagination سمت سرور + فیلتر دسته‌بندی و جستجو
// -----------------------------

// آدرس API پست‌ها (در صورت نیاز این رو تنظیم کن)
const POSTS_API_URL = 'https://atom-game.ir/api/blog/posts/';

// تنظیمات pagination
let currentPage = 1;
const PAGE_SIZE = 9;

let isLoading = false;
let hasNextPage = true;

// فیلترها
let currentCategory = null; // مثلا 'action-games' یا id دسته
let currentSearch = '';     // متن جستجو

// -----------------------------
// Helpers
// -----------------------------

// هدایت به صفحه‌ی جزئیات پست
function goToReadMore(link) {
    if (!link) return;
    window.location.href = link;
}

// فرمت تاریخ (ISO -> fa-IR)
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

// تبدیل داده‌ی Post از API به ساختار کارت
function normalizePost(post) {
    // 👇 لینک «بیشتر بخوانید» -> همیشه به صفحه سینگل
    const slug = post.slug || null;
    const readMoreLink = slug
        ? `/html/single-post-page.html?slug=${encodeURIComponent(slug)}`
        : '#';

    // تگ‌ها (متن کنار تصویر)
    let tagText = '';
    if (Array.isArray(post.tags) && post.tags.length > 0) {
        tagText = post.tags.map(t => t.name).join(' | ');
    }

    // تصویر کاور - چند حالت متداول
    let imageUrl = '';

    if (post.cover && post.cover.url) {
        imageUrl = post.cover.url;
    } else if (post.og_image && post.og_image.url) {
        imageUrl = post.og_image.url;
    } else if (post.cover_media && typeof post.cover_media === 'object' && post.cover_media.url) {
        imageUrl = post.cover_media.url;
    } else if (typeof post.image === 'string') {
        imageUrl = post.image;
    } else {
        // اگر پروژه‌ت تصویر پیش‌فرض داره، اینو عوض کن
        imageUrl = 'https://atom-game.ir/img/default-game-banner.svg';
    }

    // ✅ تبدیل آدرس نسبی به آدرس کامل روی دامین atom-game.ir
    if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = 'https://atom-game.ir' + imageUrl;
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

// ساخت HTML کارت وبلاگ
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

// چسباندن لیست پست‌ها به container
function appendPostsToContainer(posts) {
    const container = document.getElementById('blogContainer');
    if (!container) return;

    if (!Array.isArray(posts) || posts.length === 0) return;

    const normalized = posts.map(normalizePost);
    const html = normalized.map(p => createBlogCard(p)).join('');

    container.insertAdjacentHTML('beforeend', html);
}

// بروزرسانی وضعیت دکمه «مشاهده بیشتر»
function updateLoadMoreButtonState() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;

    if (isLoading) {
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'در حال بارگذاری...';
        return;
    }

    if (!hasNextPage) {
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'مورد دیگری وجود ندارد';
        return;
    }

    btn.removeAttribute('disabled');
    btn.textContent = 'مشاهده بیشتر';
}

// ساخت URL بر اساس صفحه + فیلترها (category, search)
function buildPostsUrl(page) {
    const params = new URLSearchParams();

    params.set('page', page);
    params.set('page_size', PAGE_SIZE);

    if (currentCategory) {
        params.set('category', currentCategory);
    }

    if (currentSearch) {
        params.set('search', currentSearch);
    }

    return `${POSTS_API_URL}?${params.toString()}`;
}

// گرفتن یک صفحه از پست‌ها از سرور
async function fetchPostsPage(page) {
    const url = buildPostsUrl(page);

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('خطا در دریافت داده‌های وبلاگ');
    }

    const data = await res.json();

    // دو حالت را ساپورت می‌کنیم:
    // 1) حالت DRF pagination: { count, next, previous, results: [...] }
    // 2) حالت بدون pagination: [ ... ]
    let postsArray = [];
    if (Array.isArray(data)) {
        postsArray = data;
        hasNextPage = data.length === PAGE_SIZE;
    } else {
        postsArray = Array.isArray(data.results) ? data.results : [];
        hasNextPage = Boolean(data.next);
    }

    return postsArray;
}

// بارگذاری یک صفحه و رندر آن
async function loadPage(page) {
    if (isLoading) return;
    if (!hasNextPage && page !== 1) return;

    isLoading = true;
    updateLoadMoreButtonState();

    const container = document.getElementById('blogContainer');

    try {
        const posts = await fetchPostsPage(page);

        if (posts.length === 0 && page === 1) {
            if (container) {
                container.innerHTML = '<p class="blog-error">هیچ مقاله‌ای یافت نشد.</p>';
            }
            hasNextPage = false;
            updateLoadMoreButtonState();
            return;
        }

        appendPostsToContainer(posts);
    } catch (err) {
        console.error(err);
        if (container && container.children.length === 0) {
            container.innerHTML = '<p class="blog-error">خطایی در بارگذاری مقالات رخ داد. لطفاً دوباره تلاش کنید.</p>';
        }

        const btn = document.getElementById('loadMoreBtn');
        if (btn) {
            btn.setAttribute('disabled', 'disabled');
            btn.textContent = 'خطا در بارگذاری';
        }
        hasNextPage = false;
    } finally {
        isLoading = false;
        updateLoadMoreButtonState();
    }
}

// -----------------------------
// فیلتر دسته‌بندی و جستجو
// -----------------------------

// وقتی روی یک دسته کلیک می‌کنی، اینو صدا بزن
// مثلا: onCategoryClick('action-games') یا onCategoryClick(3)
function onCategoryClick(slugOrId) {
    currentCategory = slugOrId;
    currentPage = 1;
    hasNextPage = true;

    const container = document.getElementById('blogContainer');
    if (container) {
        container.innerHTML = '';
    }

    loadPage(currentPage);
}

// وقتی فرم جستجو submit می‌شه، اینو صدا بزن
// مثلا: onSearchSubmit(searchInput.value)
function onSearchSubmit(term) {
    currentSearch = (term || '').trim();
    currentPage = 1;
    hasNextPage = true;

    const container = document.getElementById('blogContainer');
    if (container) {
        container.innerHTML = '';
    }

    loadPage(currentPage);
}

// اگر خواستی ریست کنی (بدون فیلتر)
function resetFilters() {
    currentCategory = null;
    currentSearch = '';
    currentPage = 1;
    hasNextPage = true;

    const container = document.getElementById('blogContainer');
    if (container) {
        container.innerHTML = '';
    }

    loadPage(currentPage);
}

// -----------------------------
// Event handlers
// -----------------------------

// بارگذاری اولیه صفحه
async function initBlogListing() {
    const container = document.getElementById('blogContainer');
    if (container) {
        container.innerHTML = '';
    }

    currentPage = 1;
    hasNextPage = true;

    await loadPage(currentPage);
}

// کلیک روی "مشاهده بیشتر"
async function onLoadMoreClicked() {
    if (isLoading || !hasNextPage) return;

    currentPage += 1;
    await loadPage(currentPage);
}

// -----------------------------
// DOM ready
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        btn.addEventListener('click', onLoadMoreClicked);
        btn.setAttribute('disabled', 'disabled');
        btn.textContent = 'در حال بارگذاری...';
    }

    initBlogListing();
});
