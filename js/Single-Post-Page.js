// نمونه قرارداد با بک‌اند:
// انتظار می‌رود بک‌اند یک آبجکت JSON مشابه زیر بفرستد.
// فیلدهای ثابت: title, author{name, avatar, bio}, dateISO, cover{src, caption}, category, tags[], slug
// فیلد داینامیک: bodyMarkdown (متن کامل پست به صورت Markdown که شامل پاراگراف، تصویر، تیتر و ... است)
const samplePost = {
  title: "طراحی Single Post Page با ورودی Markdown",
  author: {
    name: "علی رضایی",
    avatar: "https://i.pravatar.cc/128?img=14",
    bio: "فرانت‌اند دولوپر و علاقه‌مند به طراحی رابط کاربری."
  },
  dateISO: "2025-11-01T10:15:00Z",
  cover: {
    src: "https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=1600&auto=format&fit=crop",
    caption: "عکس شاخص نمونه – Unsplash"
  },
  category: "طراحی وب",
  tags: ["#فرانت‌اند","#UI","#Markdown","#وبلاگ"],
  slug: "single-post-markdown-demo",
  bodyMarkdown: `> این یک نمونه از بدنهٔ پویا است که **با Markdown** رندر می‌شود.
  
## چرا Markdown؟
Markdown اجازه می‌دهد نویسنده با آزادی کامل ترتیب محتوا را تعیین کند:  
- یک پاراگراف بلند...
- سپس یک تصویر
- بعد دوباره پاراگراف، لیست، کد و غیره

![تصویر نمونه](https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop)

### مثال کد
\`\`\`js
function hello(name){
  console.log("سلام " + name + "!");
}
hello("دنیا");
\`\`\`

و یک لینک به [مستندات Marked](https://marked.js.org/).`
};

// --- ابزارهای کمکی ---
function formatDateFa(iso){
  try{
    const d = new Date(iso);
    const f = new Intl.DateTimeFormat('fa-IR', {
      year:'numeric', month:'long', day:'numeric'
    });
    return f.format(d);
  }catch{ return iso; }
}

function setShareLinks(url, title){
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  document.getElementById('share-x').href = x;
  document.getElementById('share-telegram').href = tg;
  document.getElementById('share-copy').addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(url);
      const btn = document.getElementById('share-copy');
      const old = btn.textContent;
      btn.textContent = 'کپی شد!';
      setTimeout(()=>btn.textContent = old, 1200);
    }catch(e){ alert('کپی لینک ناموفق بود'); }
  });
}

// --- رندر پست ---
function renderPost(post){
  // فیلدهای ثابت
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-author').textContent = post.author?.name ?? 'نامشخص';
  const avatar = post.author?.avatar || 'https://i.pravatar.cc/128?u=default';
  document.getElementById('post-author-avatar').src = avatar;
  document.getElementById('author-box-avatar').src = avatar;
  document.getElementById('author-box-name').textContent = post.author?.name ?? '—';
  document.getElementById('author-box-bio').textContent = post.author?.bio ?? '';
  document.getElementById('post-date').textContent = formatDateFa(post.dateISO);
  document.getElementById('post-date').setAttribute('datetime', post.dateISO);
  document.getElementById('post-category').textContent = post.category ?? '';
  document.getElementById('post-cover').src = post.cover?.src ?? '';
  document.getElementById('post-cover-caption').textContent = post.cover?.caption ?? '';

  // تگ‌ها
  const tagsEl = document.getElementById('post-tags');
  tagsEl.innerHTML = '';
  (post.tags || []).forEach(t => {
    const li = document.createElement('li'); li.textContent = t; tagsEl.appendChild(li);
  });

  // محتوای Markdown بدون اعمال ترتیب اضافی
  // هر ترتیبی که نویسنده در Markdown نوشته همان‌طور رندر می‌شود.
  // می‌توانید سطوح امنیتی بیشتر اضافه کنید:
  marked.setOptions({ breaks: true });
  const html = marked.parse(post.bodyMarkdown || '');
  const body = document.getElementById('post-body');
  body.innerHTML = html;

  // لینک‌های بدنه در تب جدید باز شوند
  body.querySelectorAll('a[href]').forEach(a => a.setAttribute('target','_blank'));

  // اشتراک‌گذاری
  const canonical = window.location.origin + window.location.pathname + '#' + (post.slug || '');
  setShareLinks(canonical, post.title);

  // پست‌های مرتبط (دمو)
  const related = [
    { title:"راهنمای سبک‌های تایپوگرافی در وب", cover:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
    { title:"بهترین الگوهای کارت برای موبایل", cover:"https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop" },
    { title:"آشنایی با ARIA برای دسترس‌پذیری", cover:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" }
  ];
  const grid = document.getElementById('related-list');
  grid.innerHTML = '';
  related.forEach(r => {
    const a = document.createElement('a');
    a.className = 'related__item';
    a.href = '#';
    a.innerHTML = `<img alt="" src="${r.cover}"><h3>${r.title}</h3>`;
    grid.appendChild(a);
  });

  // فرم نظر (دمو)
  document.getElementById('comment-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name'); const comment = fd.get('comment');
    const wrap = document.getElementById('comments');
    const item = document.createElement('div');
    item.className = 'comment__item';
    item.style.margin = '12px 0';
    item.style.padding = '12px';
    item.style.border = '1px solid var(--border)';
    item.style.borderRadius = '10px';
    item.innerHTML = `<b>${name}</b><p style="margin:6px 0 0;color:var(--muted)"></p>`;
    item.querySelector('p').textContent = comment;
    wrap.prepend(item);
    e.currentTarget.reset();
  });
}

// --- نقطهٔ شروع ---
// در عمل داده را از بک‌اند بگیرید (fetch) و به renderPost بدهید.
// اینجا برای دمو از samplePost استفاده می‌کنیم.
document.addEventListener('DOMContentLoaded', () => {
  renderPost(samplePost);

  // مثال ادغام با بک‌اند:
  // fetch('/api/posts/:slug').then(r => r.json()).then(renderPost);
});
