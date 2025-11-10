// داده های نمونه برای وبلاگ (اکنون 24 آیتم: 7 اصلی + 17 برای تست)
const blogData = [
    {
        id: 1,
        title: "این نمونه ای از یک تابش اصلی هست",
        excerpt: "این یک نمونه متن خلاصه برای محتوای وبلاگ است که می‌تواند اطلاعات بیشتری در مورد پست ارائه دهد.",
        image: "../img/img-for-test/img-6.jpg",
        tag: "تگ | تگ",
        date: "۱۴۰۳/۰۷/۰۳",
        readMoreLink: "../html/test.html"
    },
    {
        id: 2,
        title: "آموزش طراحی وب ریسپانسیو",
        excerpt: "در این پست به بررسی روش‌های مختلف برای طراحی وبسایت‌های ریسپانسیو می‌پردازیم.",
        image: "../img/img-for-test/img-7.jpg",
        tag: "آموزش",
        date: "۱۴۰۳/۰۷/۰۲",
        readMoreLink: "#"
    },
    {
        id: 3,
        title: "بهترین ابزارهای توسعه Frontend در سال ۲۰۲۴",
        excerpt: "مروری بر ابزارها و تکنولوژی‌های جدید در زمینه توسعه فرانت‌اند.",
        image: "../img/img-for-test/img-8.jpg",
        tag: "تکنولوژی",
        date: "۱۴۰۳/۰۷/۰۱",
        readMoreLink: "#"
    },
    {
        id: 4,
        title: "اخرین اخبار THE LAST OF US",
        excerpt: "the last of us که یکی از بهترین بازی های جهان است ",
        image: "../img/img-for-test/img-9.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۰۱",
        readMoreLink: "#"
    },
    {
        id: 5,
        title: "اخرین اخبار THE LAST OF US",
        excerpt: "the last of us که یکی از بهترین بازی های جهان است ",
        image: "../img/img-for-test/img-10.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۰۱",
        readMoreLink: "#"
    },
    {
        id: 6,
        title: "اخرین اخبار THE LAST OF US",
        excerpt: "the last of us که یکی از بهترین بازی های جهان است ",
        image: "../img/img-for-test/img-3.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۰۱",
        readMoreLink: "#"
    },
    {
        id: 7,
        title: "اخرین اخبار THE LAST OF US",
        excerpt: "the last of us که یکی از بهترین بازی های جهان است ",
        image: "../img/img-for-test/img-4.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۰۱",
        readMoreLink: "#"
    },
    // --- 17 آیتم تست اضافه (می‌چرخونیم بین تصاویر موجود) ---
    {
        id: 8,
        title: "بررسی عملکرد موتور رندر جدید",
        excerpt: "تجربه‌ای از عملکرد سریع و روان رندر در مرورگرهای معاصر.",
        image: "../img/img-for-test/img-1.jpg",
        tag: "تکنولوژی",
        date: "۱۴۰۳/۰۷/۰۵",
        readMoreLink: "#"
    },
    {
        id: 9,
        title: "طراحی رابط کاربری برای گیمرها",
        excerpt: "نکاتی برای ساخت تجربه‌ی کاربری بهتر در سایت‌های بازی.",
        image: "../img/img-for-test/img-2.jpg",
        tag: "طراحی",
        date: "۱۴۰۳/۰۷/۰۵",
        readMoreLink: "#"
    },
    {
        id: 10,
        title: "راهنمای شروع Unity برای مبتدیان",
        excerpt: "یک راهنمای سریع برای کسانی که می‌خواهند بازی‌سازی را آغاز کنند.",
        image: "../img/img-for-test/img-3.jpg",
        tag: "آموزش",
        date: "۱۴۰۳/۰۷/۰۶",
        readMoreLink: "#"
    },
    {
        id: 11,
        title: "بهینه‌سازی تصاویر وب",
        excerpt: "چطور تصاویر را بدون افت کیفیت بهینه کنیم تا صفحات سریعتر بارگذاری شوند.",
        image: "../img/img-for-test/img-4.jpg",
        tag: "عملکرد",
        date: "۱۴۰۳/۰۷/۰۶",
        readMoreLink: "#"
    },
    {
        id: 12,
        title: "افزایش نرخ فریم با تغییر تنظیمات بازی",
        excerpt: "تغییرات ساده‌ای که FPS را در بازی‌ها بهبود می‌بخشد.",
        image: "../img/img-for-test/img-5.jpg",
        tag: "گیمینگ",
        date: "۱۴۰۳/۰۷/۰۷",
        readMoreLink: "#"
    },
    {
        id: 13,
        title: "شخصیت‌پردازی در بازی‌های مدرن",
        excerpt: "چگونه داستان و شخصیت‌پردازی تجربه بازی را ارتقا می‌دهد.",
        image: "../img/img-for-test/img-6.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۰۷",
        readMoreLink: "#"
    },
    {
        id: 14,
        title: "بهترین شیوه‌های تایپوگرافی وب",
        excerpt: "قواعد و نکات عملی برای خوانایی و هارمونی متون.",
        image: "../img/img-for-test/img-7.jpg",
        tag: "طراحی",
        date: "۱۴۰۳/۰۷/۰۸",
        readMoreLink: "#"
    },
    {
        id: 15,
        title: "استفاده از CSS Grid در پروژه‌های واقعی",
        excerpt: "نمونه‌هایی از چیدمان‌های پیچیده که با CSS Grid ساده می‌شوند.",
        image: "../img/img-for-test/img-8.jpg",
        tag: "فنی",
        date: "۱۴۰۳/۰۷/۰۸",
        readMoreLink: "#"
    },
    {
        id: 16,
        title: "الگوریتم‌های مسیر‌یابی در بازی‌ها",
        excerpt: "آشنایی با A* و سایر الگوریتم‌های مسیر‌یابی.",
        image: "../img/img-for-test/img-9.jpg",
        tag: "تکنولوژی",
        date: "۱۴۰۳/۰۷/۰۹",
        readMoreLink: "#"
    },
    {
        id: 17,
        title: "آموزش سریع WebGL",
        excerpt: "شروع سریع با WebGL برای رندر سه‌بعدی در مرورگر.",
        image: "../img/img-for-test/img-10.jpg",
        tag: "آموزش",
        date: "۱۴۰۳/۰۷/۰۹",
        readMoreLink: "#"
    },
    {
        id: 18,
        title: "نکته‌های مفید برای نگهداری سرور بازی",
        excerpt: "رویه‌های عملی برای کاهش تأخیر و خطا در سرورهای بازی.",
        image: "../img/img-for-test/img-1.jpg",
        tag: "سرور",
        date: "۱۴۰۳/۰۷/۱۰",
        readMoreLink: "#"
    },
    {
        id: 19,
        title: "چالش‌های طراحی UI برای راست‌به‌چپ",
        excerpt: "مشکلات رایج و راه‌حل‌های آن‌ها در وب‌های RTL.",
        image: "../img/img-for-test/img-2.jpg",
        tag: "طراحی",
        date: "۱۴۰۳/۰۷/۱۰",
        readMoreLink: "#"
    },
    {
        id: 20,
        title: "پیش‌نمایش امکانات نسخه جدید موتور بازی",
        excerpt: "ویژگی‌هایی که در آپدیت جدید موتور اضافه شده‌اند.",
        image: "../img/img-for-test/img-3.jpg",
        tag: "بازی",
        date: "۱۴۰۳/۰۷/۱۱",
        readMoreLink: "#"
    },
    {
        id: 21,
        title: "افزایش امنیت وب‌سایت‌های وردپرسی",
        excerpt: "راهکارهای ساده برای سخت‌تر کردن سایت نسبت به حملات ساده.",
        image: "../img/img-for-test/img-4.jpg",
        tag: "امنیت",
        date: "۱۴۰۳/۰۷/۱۱",
        readMoreLink: "#"
    },
    {
        id: 22,
        title: "چطور با تیم کوچک بازی بسازیم",
        excerpt: "تجربه‌هایی که نشان می‌دهد یک تیم کوچک چگونه محصول موفق بسازد.",
        image: "../img/img-for-test/img-5.jpg",
        tag: "تجربه",
        date: "۱۴۰۳/۰۷/۱۲",
        readMoreLink: "#"
    },
    {
        id: 23,
        title: "ابزارهای مورد علاقه توسعه‌دهندگان فرانت",
        excerpt: "لیستی از افزونه‌ها و ابزارهایی که روند توسعه را تسهیل می‌کنند.",
        image: "../img/img-for-test/img-6.jpg",
        tag: "ابزار",
        date: "۱۴۰۳/۰۷/۱۲",
        readMoreLink: "#"
    },
    {
        id: 24,
        title: "مقایسه فریم‌ورک‌های محبوب UI در ۲۰۲۴",
        excerpt: "خلاصه‌ای از مزایا و معایب فریم‌ورک‌های مطرح.",
        image: "../img/img-for-test/img-7.jpg",
        tag: "مقایسه",
        date: "۱۴۰۳/۰۷/۱۳",
        readMoreLink: "#"
    }
];

// تنظیمات بارگذاری
const PAGE_SIZE = 9; // تعداد کارت‌ها برای هر بار نمایش
let currentIndex = 0; // تا این ایندکس لود شده

// تابع برای رفتن به صفحه بیشتر بخوانید
function goToReadMore(link) {
    window.location.href = link;
}

// تابع برای ایجاد کارت وبلاگ (همان قالب قدیمی)
function createBlogCard(blog) {
    return `
        <div class="blog-card fade-in">
            <div class="blog-image" onclick="goToReadMore('${blog.readMoreLink}')">
                <img src="${blog.image}" alt="${blog.title}" onerror="this.onerror=null;this.src='../img/logo.png'">
                <span class="blog-tag">${blog.tag}</span>
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-meta">
                    <span class="blog-date">تاریخ انتشار: ${blog.date}</span>
                    <button class="blog-read-more" onclick="goToReadMore('${blog.readMoreLink}')">بیشتر بخوانید</button>
                </div>
            </div>
        </div>
    `;
}

// رندر کارت‌ها (اضافه میکند به container به جای بازنویسی کامل برای انیمیشن و حفظ وضعیت)
function appendBlogCards(fromIndex, count) {
    const container = document.getElementById('blogContainer');
    if (!container) return;

    const slice = blogData.slice(fromIndex, fromIndex + count);
    if (slice.length === 0) return;

    // ایجاد HTML و append
    const html = slice.map(b => createBlogCard(b)).join('');
    container.insertAdjacentHTML('beforeend', html);

    // آپدیت ایندکس
    currentIndex += slice.length;

    // اگر دیگر چیزی برای لود نیست، دکمه را غیرفعال کن
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        if (currentIndex >= blogData.length) {
            btn.setAttribute('disabled', 'disabled');
            btn.textContent = 'مورد دیگری وجود ندارد';
        } else {
            btn.removeAttribute('disabled');
            btn.textContent = 'مشاهده بیشتر';
        }
    }
}

// نمایش اولیه اولین صفحه
function renderInitialCards() {
    // پاک کن (اگر از قبل چیزی باشه)
    const container = document.getElementById('blogContainer');
    if (!container) return;
    container.innerHTML = '';
    currentIndex = 0;
    appendBlogCards(0, PAGE_SIZE);
}

// تابع برای افزودن پست جدید (ماندگار با پیاده‌سازی قبلی)
function addNewBlog(blog) {
    blogData.push(blog);
    // اگر تا الان تمام آیتم‌ها لود شده باشه، کارت جدید را هم اضافه کن
    const btn = document.getElementById('loadMoreBtn');
    if (currentIndex >= blogData.length - 1) {
        // هنوز دکمه غیرفعال نشده یا آخرین بار لود نمایش
        appendBlogCards(currentIndex, 1);
    }
}

// handler دکمه مشاهده بیشتر
function onLoadMoreClicked() {
    appendBlogCards(currentIndex, PAGE_SIZE);
}

// نمایش اولیه کارت‌ها و وصل کردن دکمه
document.addEventListener('DOMContentLoaded', function () {
    renderInitialCards();
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        btn.addEventListener('click', onLoadMoreClicked);
        // اگر کمتر یا مساوی PAGE_SIZE اطلاعات باشه، دکمه رو مدیریت کن
        if (blogData.length <= PAGE_SIZE) {
            btn.setAttribute('disabled', 'disabled');
            btn.textContent = 'مورد دیگری وجود ندارد';
        }
    }
});