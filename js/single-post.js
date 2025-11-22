
const API_BASE_URL = "https://atom-game.ir/api/blog/posts/"; 

// کمک‌تابع: گرفتن اسلاگ از URL
function getSlugFromLocation() {
    const url = new URL(window.location.href);
    const qpSlug = url.searchParams.get("slug");
    if (qpSlug) return qpSlug;

    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
}

// کمک‌تابع: فرمت زمان مطالعه
function formatReadingTime(seconds) {
    if (!seconds && seconds !== 0) return "";
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} دقیقه مطالعه`;
}

// کمک‌تابع: فرمت تاریخ به شمسی (تقریبی با toLocaleDateString)
function formatDate(isoStr) {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// کمک‌تابع: ساخت متن کوتاه‌تر
function truncate(text, max) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
}

// رندر داده‌ها
function renderPost(mainPost, relatedPosts) {
    const loadingEl = document.getElementById("sp-loading");
    const errorEl = document.getElementById("sp-error");
    const headerEl = document.getElementById("sp-header");
    const coverWrapperEl = document.getElementById("sp-cover-wrapper");
    const contentEl = document.getElementById("sp-content");

    loadingEl.hidden = true;
    errorEl.hidden = true;

    if (!mainPost) {
        errorEl.hidden = false;
        errorEl.textContent = "مقاله پیدا نشد.";
        return;
    }

    // Header
    headerEl.hidden = false;

    const categoryLabel = mainPost.category ? mainPost.category.name : "";
    document.getElementById("sp-category").textContent = categoryLabel || "بدون دسته‌بندی";

    if (mainPost.series) {
        const seriesEl = document.getElementById("sp-series");
        seriesEl.hidden = false;
        seriesEl.textContent = mainPost.series.title || mainPost.series.name || "";
    }

    document.getElementById("sp-title").textContent = mainPost.title || "";

    // Meta / author
    const author = mainPost.author || {};
    const authorAvatar = author.avatar || {};
    const avatarUrl = authorAvatar.url || "";

    const defaultAvatar =
        "https://cdn.atom-game.ir/media/avatars/default.png"; // اگر نداری عوضش کن یا حذفش کن

    const avatarSrc = avatarUrl || defaultAvatar;

    const authorAvatarEls = [
        document.getElementById("sp-author-avatar"),
        document.getElementById("sp-sidebar-avatar")
    ];
    authorAvatarEls.forEach((img) => {
        if (!img) return;
        img.src = avatarSrc;
        img.alt = authorAvatar.alt_text || author.display_name || "نویسنده";
    });

    document.getElementById("sp-author-name").textContent =
        author.display_name || "نویسنده نامشخص";
    document.getElementById("sp-author-bio").textContent = truncate(author.bio, 80);

    document.getElementById("sp-sidebar-name").textContent =
        author.display_name || "نویسنده نامشخص";
    document.getElementById("sp-sidebar-bio").textContent = truncate(author.bio, 120);

    const publishedDate = formatDate(mainPost.published_at);
    const readingTime = formatReadingTime(mainPost.reading_time_sec);

    document.getElementById("sp-date").textContent = publishedDate;
    document.getElementById("sp-reading-time").textContent = readingTime;
    document.getElementById("sp-sidebar-date").textContent = publishedDate;
    document.getElementById("sp-sidebar-reading-time").textContent = readingTime;

    const viewsCount = mainPost.views_count ?? 0;
    const likesCount = mainPost.likes_count ?? 0;
    const commentsCount = mainPost.comments_count ?? 0;

    document.getElementById("sp-views").textContent = `${viewsCount} بازدید`;
    document.getElementById("sp-likes").textContent = `${likesCount} لایک`;
    document.getElementById("sp-comments").textContent = `${commentsCount} نظر`;

    // Sidebar meta
    document.getElementById("sp-sidebar-category").textContent =
        mainPost.category?.name || "بدون دسته‌بندی";

    if (mainPost.series) {
        document.getElementById("sp-sidebar-series-row").hidden = false;
        document.getElementById("sp-sidebar-series").textContent =
            mainPost.series.title || mainPost.series.name || "";
    }

    // Social links نویسنده
    const socialsEl = document.getElementById("sp-sidebar-socials");
    socialsEl.innerHTML = "";
    if (author.social_links) {
        Object.entries(author.social_links).forEach(([key, url]) => {
            if (!url) return;
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener";
            a.className = "sp-sidebar-social-link";
            const labelMap = {
                twitter: "توییتر",
                x: "X",
                instagram: "اینستاگرام",
                linkedin: "لینکدین"
            };
            a.textContent = labelMap[key] || key;
            socialsEl.appendChild(a);
        });
    }

    // Cover
    const cover = mainPost.cover_media || {};
    if (cover.url) {
        coverWrapperEl.hidden = false;
        const coverImg = document.getElementById("sp-cover");
        coverImg.src = cover.url;
        coverImg.alt = cover.alt_text || mainPost.title || "";
    }

    // Content (HTML از بک‌اند)
    contentEl.innerHTML = mainPost.content || "";

    // Tags
    const tagsSectionEl = document.getElementById("sp-tags-section");
    const tagsEl = document.getElementById("sp-tags");
    tagsEl.innerHTML = "";

    if (Array.isArray(mainPost.tags) && mainPost.tags.length > 0) {
        tagsSectionEl.hidden = false;
        mainPost.tags.forEach((tag) => {
            const span = document.createElement("span");
            span.className = "sp-tag";
            span.textContent = tag.name || tag.slug;
            // اینجا فقط نمایش می‌دیم، ولی می‌تونی ریدایرکت به صفحه تگ هم اضافه کنی
            tagsEl.appendChild(span);
        });
    } else {
        tagsSectionEl.hidden = true;
    }

    // Share links
    const shareUrl = mainPost.canonical_url || window.location.href;
    const shareText = encodeURIComponent(mainPost.title || "اشتراک‌گذاری از اتم گیم");
    const encodedUrl = encodeURIComponent(shareUrl);

    document.getElementById("sp-share-telegram").href =
        `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
    document.getElementById("sp-share-x").href =
        `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;

    const shareCopyBtn = document.getElementById("sp-share-copy");
    const shareFeedback = document.getElementById("sp-share-feedback");
    shareCopyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            shareFeedback.hidden = false;
            setTimeout(() => {
                shareFeedback.hidden = true;
            }, 2000);
        });
    });

    // Related posts
    const relatedSection = document.getElementById("sp-related-section");
    const relatedGrid = document.getElementById("sp-related-grid");
    relatedGrid.innerHTML = "";

    if (Array.isArray(relatedPosts) && relatedPosts.length > 0) {
        relatedSection.hidden = false;
        relatedPosts.forEach((post) => {
            const card = document.createElement("a");
            card.className = "sp-related-card";
            card.href = post.canonical_url || `?slug=${encodeURIComponent(post.slug)}`;

            const media = document.createElement("div");
            media.className = "sp-related-media";
            if (post.cover_media?.url) {
                const img = document.createElement("img");
                img.src = post.cover_media.url;
                img.alt = post.cover_media.alt_text || post.title || "";
                img.loading = "lazy";
                media.appendChild(img);
            }

            const body = document.createElement("div");
            body.className = "sp-related-body";

            const cat = document.createElement("div");
            cat.className = "sp-related-category";
            cat.textContent = post.category?.name || "مقاله";

            const title = document.createElement("h3");
            title.className = "sp-related-title";
            title.textContent = truncate(post.title, 70);

            const meta = document.createElement("div");
            meta.className = "sp-related-meta";
            const dateText = formatDate(post.published_at);
            const readingText = formatReadingTime(post.reading_time_sec);
            meta.innerHTML = `<span>${dateText}</span><span>${readingText}</span>`;

            body.appendChild(cat);
            body.appendChild(title);
            body.appendChild(meta);

            card.appendChild(media);
            card.appendChild(body);
            relatedGrid.appendChild(card);
        });
    } else {
        relatedSection.hidden = true;
    }
}

// درخواست به API
async function fetchPost() {
    const loadingEl = document.getElementById("sp-loading");
    const errorEl = document.getElementById("sp-error");
    loadingEl.hidden = false;
    errorEl.hidden = true;

    const slug = getSlugFromLocation();
    if (!slug) {
        loadingEl.hidden = true;
        errorEl.hidden = false;
        errorEl.textContent = "اسلاگ مقاله در آدرس پیدا نشد.";
        return;
    }

    try {
        // اینجا بسته به بکندت می‌تونی ساختار URL را تغییر بدهی
        // سناریو ۱: /api/blog/single-post?slug=...
        const url = `${API_BASE_URL}?slug=${encodeURIComponent(slug)}`;

        const resp = await fetch(url, {
            headers: {
                Accept: "application/json"
            }
        });

        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();

        let mainPost = null;
        let relatedPosts = [];

        // حالت نمونه‌ای که دادی: آرایه‌ای از پست‌ها
        if (Array.isArray(data)) {
            mainPost = data[0] || null;
            relatedPosts = data.slice(1);
        }
        // حالت { results: [...] }
        else if (Array.isArray(data.results)) {
            mainPost = data.results[0] || null;
            relatedPosts = data.results.slice(1);
        }
        // حالت { post: {...}, related_posts: [...] }
        else if (data.post) {
            mainPost = data.post;
            relatedPosts = data.related_posts || [];
        } else {
            // فرض: خود پاسخ یک پست تکی است
            mainPost = data;
        }

        renderPost(mainPost, relatedPosts);
    } catch (err) {
        console.error(err);
        loadingEl.hidden = true;
        errorEl.hidden = false;
        errorEl.textContent = "در بارگذاری مقاله مشکلی پیش آمد.";
    }
}

document.addEventListener("DOMContentLoaded", fetchPost);
