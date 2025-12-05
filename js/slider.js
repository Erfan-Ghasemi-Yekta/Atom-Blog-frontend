(function () {
  const root = document.getElementById('hero-slides');
  if (!root) return;

  const ASSET_BASE = (document.querySelector('meta[name="asset-base"]')?.content || '.').replace(/\/$/, '');
  const srcUrl = (u) => {
    if (!u) return '';
    if (/^https?:|^\/?data:/.test(u)) return u;
    return ASSET_BASE + '/' + u.replace(/^\.\//, '').replace(/^\//, '');
  };

  // === NEW: detect RTL once ===
  const isRTL = (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl';

  // Data now comes from API (no hardcoded array anymore)
  let dataAll = [];
  let newsData = [];

  /**
   * Format ISO datetime to a Persian-friendly date string.
   * Uses browser Intl; falls back to ISO date if needed.
   */
  function formatFaDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    try {
      return d.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return d.toISOString().slice(0, 10);
    }
  }

  /**
   * Fetch posts from the blog API and map them into
   * the structure that the slider expects.
   *
   * Uses: GET /api/blog/posts/
   */
async function fetchSliderData() {
  try {
    const res = await fetch('https://atom-game.ir/api/blog/posts/');
    if (!res.ok) throw new Error('Failed to load posts for slider');

    const payload = await res.json();
    console.log('[slider] raw blog payload:', payload);

    // ۱) اگر مستقیم آرایه بود
    let posts = Array.isArray(payload) ? payload : null;

    // ۲) اگر شبیه DRF بود: { results: [...] }
    if (!posts && Array.isArray(payload.results)) {
      posts = payload.results;
    }

    // ۳) اگر هنوز پیدا نشد، بی‌خیال
    if (!posts) {
      console.warn('Unexpected posts payload for slider:', payload);
      return [];
    }

    // فقط ۵ تای اول برای اسلایدر
    const topPosts = posts.slice(0, 5);

const mapped = topPosts.map((post) => {
  const titleFa =
    post.title_fa ||
    post.title_fa_ir ||
    post.title ||
    '';

  const publishedAt =
    post.published_at ||
    post.publish_date ||
    post.created_at ||
    null;

  const imageUrl =
    (post.cover_media && post.cover_media.url) ||
    post.cover_image ||
    post.featured_image ||
    post.image ||
    post.thumbnail ||
    null;

  // 👇 اسلاگ را از API می‌گیریم
  const slug = post.slug || null;

  // 👇 لینک فرانت برای صفحه‌ی جزئیات
  const postUrl = slug
    ? `/html/single-post-page.html?slug=${encodeURIComponent(slug)}`
    : '#';

  return {
    id: post.id ?? String(slug ?? Math.random()),
    title_fa: titleFa,
    date_fa: formatFaDate(publishedAt),
    image_url: imageUrl,
    thumb_url: imageUrl,
    category_fa: null,
    slug: slug,
    post_url: postUrl,   // ⚠️ مهم
  };
});


    // اینجا دیگر فقط آن‌هایی که *واقعاً* هیچ عنوانی ندارند حذف می‌شوند
    return mapped.filter(item => item.title_fa && item.title_fa.trim().length > 0);
  } catch (e) {
    console.error('Error fetching slider posts:', e);
    return [];
  }
}



  function buildDots() {
    const pagRoot = document.getElementById('pagination');
    if (!pagRoot) return;
    pagRoot.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'dots';
    newsData.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', `رفتن به اسلاید ${i + 1}`);
      b.addEventListener('click', () => { go(i); restartTimer(); });
      wrap.appendChild(b);
    });
    pagRoot.appendChild(wrap);
  }
  function syncDots(index){
    const pagRoot = document.getElementById('pagination');
    if (!pagRoot) return;
    pagRoot.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;
  const cache = new Set();

  function preload(url) {
    if (cache.has(url)) return;
    const img = new Image();
    img.src = url;
    cache.add(url);
  }

  function build() {
    // Layout wrapper
    const layout = document.createElement('div');
    layout.className = 'slider-layout';
    root.appendChild(layout);

    // Sidebar (right in RTL)
    const sidebar = document.createElement('div');
    sidebar.tabIndex = 0; // enable keyboard focus for horizontal scroll
    sidebar.className = 'slider-sidebar';
    sidebar.setAttribute('aria-label', 'فهرست خبرها');

    // Hero area
    const hero = document.createElement('div');
    hero.className = 'slider-hero';
    hero.setAttribute('role', 'region');
    hero.setAttribute('aria-roledescription', 'carousel');
    hero.setAttribute('aria-label', 'اسلایدر اخبار داغ');
    hero.setAttribute('aria-live', 'polite');

    // Build slides
    newsData.forEach((item, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide' + (i === 0 ? ' active' : '');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' از ' + newsData.length);
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

      slide.innerHTML = `
        <img src="${srcUrl(item.image_url)}" alt="${item.title_fa}" ${i === 0 ? 'loading="eager"' : 'loading="lazy"'} onerror="this.onerror=null;this.src=srcUrl('logo.png');" />
        <div class="slide-overlay">
          <div class="content">
            ${item.category_fa ? `<span class="badge">${item.category_fa}</span>` : ''}
            <h2>${item.title_fa}</h2>
            <a class="btn" href="${item.post_url}">ادامه مطلب</a>
          </div>
        </div>
      `;
      slide.addEventListener('click', (ev) => {
        if (ev.target && ev.target.closest('a')) return; // skip button links
        const imgLink = newsData[i]?.post_url;
        if (imgLink) window.location.href = imgLink;
      });
      hero.appendChild(slide);

      // Click on slide image or overlay to go to its post_url
      const imgEl = slide.querySelector('img');
      const overlayEl = slide.querySelector('.slide-overlay');
      const goTo = () => {
        const target = newsData[i] && newsData[i].post_url;
        if (target) window.location.href = target;
      };
      [imgEl, overlayEl].forEach(el => el && el.addEventListener('click', (ev) => {
        if (ev.target.closest('a')) return;
        goTo();
      }));
    });

    // Controls inside hero
    const ctrls = document.createElement('div');
    ctrls.className = 'slider-controls';
    ctrls.innerHTML = `
      <!-- در RTL: فلش راست = حرکت به باکس پایینی (next)، فلش چپ = باکس بالایی (prev) -->
      <button class="icon-btn next" aria-label="آیتم بعدی (باکس پایینی)"><i data-feather="chevron-right"></i></button>
      <button class="icon-btn prev" aria-label="آیتم قبلی (باکس بالایی)"><i data-feather="chevron-left"></i></button>
    `;
    hero.appendChild(ctrls);

    // Build 5 equal-height cards in sidebar (image background + overlay text)
    newsData.forEach((item, i) => {
      const card = document.createElement('button');
      card.className = 'news-card' + (i === 0 ? ' active-card' : '');
      card.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      card.setAttribute('type', 'button');
      card.style.backgroundImage = `url('${srcUrl(item.thumb_url)}')`;

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const title = document.createElement('h3');
      title.className = 'title';
      title.textContent = item.title_fa;

      const date = document.createElement('span');
      date.className = 'date';
      date.textContent = item.date_fa || '';

      overlay.appendChild(title);
      overlay.appendChild(date);
      card.appendChild(overlay);

      card.addEventListener('click', () => { go(i); restartTimer(); centerActiveCard(i); });
      sidebar.appendChild(card);
    });

    // Append to layout (order matters in RTL grid: sidebar then hero → sidebar appears at right)
    layout.appendChild(sidebar);
    layout.appendChild(hero);

    // Mark sidebar as having an active card (for CSS dimming fallback)
    buildDots();
    sidebar.classList.add('has-active');

    if (window.feather) feather.replace();

    // === Buttons
    ctrls.querySelector('.prev').addEventListener('click', () => { go(current - 1); restartTimer(); });
    ctrls.querySelector('.next').addEventListener('click', () => { go(current + 1); restartTimer(); });
    // Touch support (prevent ghost click)
    ctrls.querySelector('.prev').addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); go(current - 1); restartTimer(); }, { passive: false });
    ctrls.querySelector('.next').addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); go(current + 1); restartTimer(); }, { passive: false });

    // Pause on hover (hero only)
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    // === Keyboard on hero (RTL-aware)
    hero.tabIndex = 0;
    hero.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        isRTL ? go(current + 1) : go(current - 1);
        restartTimer();
      }
      if (e.key === 'ArrowRight') {
        isRTL ? go(current - 1) : go(current + 1);
        restartTimer();
      }
    });

    // === Touch swipe (hero only, RTL-aware)
    let sx = 0, dx = 0, touchFromLink = false;
    hero.addEventListener('touchstart', (e) => {
      sx = e.touches[0].clientX;
      dx = sx;
      touchFromLink = !!(e.target && e.target.closest('a'));
    }, { passive: true });

    hero.addEventListener('touchmove', (e) => {
      dx = e.touches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', () => {
      const delta = dx - sx; // >0 = moved right
      if (touchFromLink && Math.abs(delta) < 10) {
        sx = dx = 0;
        touchFromLink = false;
        return;
      }
      if (Math.abs(delta) > 40) {
        // در RTL: حرکت به راست (delta>0) یعنی «بعدی»، در LTR «قبلی»
        if (delta > 0) {
          isRTL ? go(current + 1) : go(current - 1);
        } else {
          isRTL ? go(current - 1) : go(current + 1);
        }
        restartTimer();
      } else if (Math.abs(delta) <= 20 && !touchFromLink) {
        // tap → باز شدن لینک اسلاید فعال
        const activeSlide = hero.querySelector('.slide.active');
        const url = activeSlide ? (newsData[current]?.post_url) : null;
        if (url) window.location.href = url;
      }
      sx = dx = 0;
      touchFromLink = false;
    });

    start();
  }

  function go(index) {
    const slides = root.querySelectorAll('.slide');
    const cards = root.querySelectorAll('.news-card');
    const len = slides.length;
    if (len === 0) return;

    index = (index + len) % len;

    syncDots(index);

    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    cards.forEach((c, i) => {
      const active = i === index;
      c.classList.toggle('active-card', active);
      c.setAttribute('aria-current', active ? 'true' : 'false');
    });

    const next = (index + 1) % len;
    const nextUrl = ((root.__newsData || [])[next]?.image_url) || null;
    if (nextUrl) preload(nextUrl);

    current = index;
    centerActiveCard(index);
  }

  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => go(current + 1), 6000);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restartTimer() {
    stop();
    start();
  }

  function centerActiveCard(index){
    const scope = document;
    const sidebar = scope.querySelector('.slider-sidebar');
    if(!sidebar) return;
    const cards = sidebar.querySelectorAll('.news-card');
    const card = cards[index];
    if(!card) return;
    if (window.innerWidth <= 768){
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // expose data for preload helper AFTER we load from API
  async function initSlider() {
    try {
      const apiData = await fetchSliderData();
      if (!apiData || !apiData.length) {
        console.warn('No data returned for slider');
        return;
      }

      // پر کردن داده‌ی داخلی اسلایدر
      dataAll = apiData;
      newsData = dataAll.slice(0, 5);

      // برای preload داخلی خود اسلایدر
      root.__newsData = newsData;

      // حالا کل UI اسلایدر را بساز
      build();
    } catch (e) {
      console.error('Failed to initialize slider:', e);
    }
  }

  // شروع کار اسلایدر
  initSlider();
})();



// === Disable slider controls on small screens ===
function handleControlsVisibility(){
  const controls = document.querySelector('.slider-controls');
  if(!controls) return;
  if(window.innerWidth <= 768){
    controls.style.display = 'none';
    const nextBtn = controls.querySelector('.next');
    const prevBtn = controls.querySelector('.prev');
    if(nextBtn) nextBtn.onclick = null;
    if(prevBtn) prevBtn.onclick = null;
  } else {
    controls.style.display = '';
  }
}

window.addEventListener('resize', handleControlsVisibility);
window.addEventListener('DOMContentLoaded', handleControlsVisibility);

// keep centering active card on resize (mobile)
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768){
    try {
      // current is scoped inside IIFE; here فقط fallback بی‌ضرر داریم
      const sidebar = document.querySelector('.slider-sidebar');
      const active = sidebar?.querySelector('.news-card.active-card');
      if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch(e){}
  }
});
