// Asynchronously injects the shared header markup and wires up interactions.
(function () {
  const HEADER_TEMPLATE = `
<header id="siteHeader">
  <a href="header.html">
    <img src="../img/logo.png" alt="لوگوی Atomgame" class="brand-logo">
  </a>
  <nav id="mainNav">
    <a href="index.html" class="active">خانه</a>
    <a href="categories.html">دسته‌بندی‌ها</a>
    <a href="tags.html">برچسب‌ها</a>
    <a href="archive.html">آرشیو</a>
    <a href="about.html">درباره وبلاگ</a>
    <a href="contact.html">تماس</a>
  </nav>

  <div class="header-actions" dir="ltr">
    <button class="icon-btn" id="accountBtn" aria-label="حساب کاربری" title="حساب کاربری">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </button>
    <button class="icon-btn" id="searchBtn" aria-label="جستجو" title="جستجو">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-3.6-3.6"></path>
      </svg>
    </button>
    <div class="search-inline" id="searchInline" dir="rtl">
      <form id="headerSearchForm" action="./index.html" method="get" role="search">
        <span class="search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-3.6-3.6"></path>
          </svg>
        </span>
        <input type="search" id="headerSearch" name="q" placeholder="جستجو در وبلاگ..." autocomplete="off" />
      </form>
    </div>
  </div>

  <button class="menu-btn" id="menuBtn" aria-label="باز کردن منو">
    <span></span><span></span><span></span>
  </button>
</header>
`;

  const STYLE_SHEETS = [
    { href: '../css/header.css', marker: 'header-css' },
    { href: '../fonts/font.css', marker: 'header-font' },
  ];
  const HEADER_SRC_DEFAULT = './header.html';
  const MOUNT_SELECTOR = '[data-header-mount]';

  function ensureStyles() {
    if (!document.head) return;
    STYLE_SHEETS.forEach(({ href, marker }) => {
      if (document.querySelector(`link[data-header-style="${marker}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.headerStyle = marker;
      document.head.appendChild(link);
    });
  }

  function getHeaderSource() {
    const current = document.currentScript;
    if (current) {
      const attr = current.getAttribute('data-header-src');
      if (attr) return attr;
    }
    return HEADER_SRC_DEFAULT;
  }

  async function loadHeaderMarkup() {
    if (typeof fetch !== 'function') return null;
    try {
      const response = await fetch(getHeaderSource(), { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Failed to load header (${response.status})`);
      const raw = await response.text();
      return extractHeaderMarkup(raw);
    } catch (error) {
      console.warn('[header] Falling back to inline template:', error);
      return null;
    }
  }

  function extractHeaderMarkup(raw) {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('<header')) return trimmed;
    try {
      const doc = new DOMParser().parseFromString(trimmed, 'text/html');
      const header = doc.querySelector('#siteHeader');
      return header ? header.outerHTML : null;
    } catch (error) {
      return null;
    }
  }

  function mountHeader(markup) {
    let header = document.getElementById('siteHeader');
    if (header) return header;
    const mountPoint = document.querySelector(MOUNT_SELECTOR);
    if (mountPoint) {
      mountPoint.insertAdjacentHTML('beforebegin', markup);
      mountPoint.remove();
    } else if (document.body) {
      document.body.insertAdjacentHTML('afterbegin', markup);
    } else {
      return null;
    }
    return document.getElementById('siteHeader');
  }

  async function ensureHeader() {
    let header = document.getElementById('siteHeader');
    if (header) return header;
    let markup = await loadHeaderMarkup();
    if (!markup) markup = HEADER_TEMPLATE;
    return mountHeader(markup);
  }

  function initMenuToggle(doc) {
    const nav = doc.getElementById('mainNav');
    const btn = doc.getElementById('menuBtn');
    if (!btn || !nav || btn.dataset.menuToggleBound === 'true') return;
    btn.dataset.menuToggleBound = 'true';
    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function initSearch(doc) {
    const btn = doc.getElementById('searchBtn');
    const box = doc.getElementById('searchInline');
    const input = doc.getElementById('headerSearch');
    const form = doc.getElementById('headerSearchForm');
    const innerIcon = box ? box.querySelector('.search-icon svg') : null;
    if (!btn || !box || !input || !innerIcon || btn.dataset.searchBound === 'true') return;

    btn.dataset.searchBound = 'true';

    const openSearch = () => {
      box.classList.add('open');
      btn.classList.add('hidden');
      requestAnimationFrame(() => input.focus());
    };

    const flyIconToButton = (done) => {
      try {
        const from = innerIcon.getBoundingClientRect();
        const to = btn.getBoundingClientRect();
        const clone = innerIcon.cloneNode(true);
        clone.classList.add('flying-icon');
        clone.style.left = from.left + 'px';
        clone.style.top = from.top + 'px';
        clone.style.width = from.width + 'px';
        clone.style.height = from.height + 'px';
        if (doc.body) doc.body.appendChild(clone);
        innerIcon.style.visibility = 'hidden';
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        clone.getBoundingClientRect();
        clone.style.transform = `translate(${dx}px, ${dy}px)`;
        const cleanup = () => {
          clone.removeEventListener('transitionend', cleanup);
          clone.remove();
          innerIcon.style.visibility = '';
          if (typeof done === 'function') done();
        };
        clone.addEventListener('transitionend', cleanup);
        setTimeout(cleanup, 500);
      } catch (error) {
        if (typeof done === 'function') done();
      }
    };

    const closeSearch = () => {
      flyIconToButton(() => {
        btn.classList.remove('hidden');
        input.blur();
      });
      requestAnimationFrame(() => {
        box.classList.remove('open');
      });
    };

    btn.addEventListener('click', (event) => {
      event.preventDefault();
      openSearch();
    });

    if (!doc.__headerSearchDocumentBound) {
      doc.__headerSearchDocumentBound = true;
      doc.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeSearch();
      });
      doc.addEventListener(
        'click',
        (event) => {
          if (!box.classList.contains('open')) return;
          const clickedInsideBox = box.contains(event.target);
          const clickedBtn = btn.contains(event.target);
          if (!clickedInsideBox && !clickedBtn) closeSearch();
        },
        true
      );
    }

    if (form && form.dataset.searchSubmitBound !== 'true') {
      form.dataset.searchSubmitBound = 'true';
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const q = input.value.trim();
        closeSearch();
        setTimeout(() => {
          window.location.href =
            './index.html' + (q ? '?q=' + encodeURIComponent(q) : '');
        }, 350);
      });
    }
  }

  async function bootstrap() {
    ensureStyles();
    const header = await ensureHeader();
    if (!header) return;
    initMenuToggle(document)
initSearch(document);
  }

  function start() {
    bootstrap().catch((error) => console.error('[header] Failed to initialise', error));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
