// Asynchronously injects the shared header markup and wires up interactions.
(function () {
  // Static header template used on all pages
  const HEADER_TEMPLATE = `
<header id="siteHeader">
  <a href="index.html">
    <img src="../img/logo.png" alt="لوگوی Atomgame" class="brand-logo">
  </a>

  <nav id="mainNav">
    <a href="index.html">وبلاگ</a>
    <a href="about.html">درباره ما</a>
    <a href="https://atom-game.ir">صفحه اتم تورنومنت</a>
  </nav>

  <div class="header-actions" dir="ltr">
    <button class="icon-btn" id="accountBtn" aria-label="حساب کاربری" title="حساب کاربری">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </button>
  </div>

  <button class="menu-btn" id="menuBtn" aria-label="باز کردن منو" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>
`;

  const STYLE_SHEETS = [
    { href: "../css/header.css", marker: "header-css" },
    { href: "../fonts/font.css", marker: "header-font" },
  ];

  const MOUNT_SELECTOR = "[data-header-mount]";

  function ensureStyles() {
    if (!document.head) return;
    STYLE_SHEETS.forEach(({ href, marker }) => {
      if (document.querySelector(`link[data-header-style="${marker}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.headerStyle = marker;
      document.head.appendChild(link);
    });
  }

  // چون دیگه header.html جدا نداریم، همیشه از TEMPLATE داخلی استفاده می‌کنیم
  async function loadHeaderMarkup() {
    return HEADER_TEMPLATE;
  }

  function mountHeader(markup) {
    let header = document.getElementById("siteHeader");
    if (header) return header;

    const mountPoint = document.querySelector(MOUNT_SELECTOR);
    if (mountPoint) {
      mountPoint.insertAdjacentHTML("beforebegin", markup);
      mountPoint.remove();
    } else if (document.body) {
      document.body.insertAdjacentHTML("afterbegin", markup);
    } else {
      return null;
    }
    return document.getElementById("siteHeader");
  }

  async function ensureHeader() {
    let header = document.getElementById("siteHeader");
    if (header) return header;
    const markup = await loadHeaderMarkup();
    return mountHeader(markup);
  }

  // فعلاً منوی همبرگری استفاده نمی‌شود، ولی توابع پایه برای آینده می‌مانند
  function initMenuToggle(doc) {
    const nav = doc.getElementById("mainNav");
    const btn = doc.getElementById("menuBtn");
    if (!btn || !nav || btn.dataset.menuToggleBound === "true") return;

    btn.dataset.menuToggleBound = "true";

    const setOpen = (isOpen) => {
      nav.classList.toggle("open", isOpen);
      btn.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    };

    btn.addEventListener("click", () => {
      const isOpen = !nav.classList.contains("open");
      setOpen(isOpen);
    });
  }

  async function bootstrap() {
    ensureStyles();
    const header = await ensureHeader();
    if (!header) return;
    initMenuToggle(document);
  }

  function start() {
    bootstrap().catch((error) =>
      console.error("[header] Failed to initialise", error)
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
