// ===== Mobile nav =====
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => nav.classList.toggle('open'));

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
      nav.classList.remove('open');
    }
  });
});

// ===== To top =====
const toTop = document.querySelector('.to-top');
const onScroll = () => { toTop.style.display = window.scrollY > 400 ? 'grid' : 'none'; };
window.addEventListener('scroll', onScroll);
toTop?.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
onScroll();

// ===== News rail arrows =====
const rail = document.getElementById('newsRail');
document.querySelector('.news-prev')?.addEventListener('click', () => rail?.scrollBy({left: -320, behavior: 'smooth'}));
document.querySelector('.news-next')?.addEventListener('click', () => rail?.scrollBy({left: 320, behavior: 'smooth'}));

// ===== Helper =====
function escapeHtml(s){return s.replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

// ===== Render News (with fallback & no-cache) =====
async function renderNews(){
  const railEl = document.getElementById('newsRail');
  if(!railEl) return;

  // ローディング骨組み
  railEl.innerHTML = Array.from({length:4}).map(()=>(
    `<div class="news-card skeleton" aria-hidden="true" style="height:220px;width:260px;border-radius:14px;"></div>`
  )).join('');

  // 1st: 相対パス（通常）
  // 2nd: プロジェクトページ用のフォールバック（/sonoba-kobo-120/）
  const ts = Date.now();
  const projectBase = '/sonoba-kobo-120';
  const paths = [
    `data/news.json?ts=${ts}`,
    `${projectBase}/data/news.json?ts=${ts}`
  ];

  let json = null, lastErr = null;
  for (const url of paths){
    try{
      console.log('[news] try:', url);
      const res = await fetch(url, {cache:'no-store'});
      if(!res.ok) { lastErr = new Error(res.status + ' ' + res.statusText); continue; }
      json = await res.json();
      console.log('[news] loaded from:', url, 'items:', Array.isArray(json)? json.length : 'N/A');
      break;
    }catch(e){
      lastErr = e;
      console.warn('[news] failed:', url, e);
    }
  }
  if(!json){
    railEl.innerHTML = `<div style="opacity:.9">ニュースを読み込めませんでした。<br>Networkタブで <code>data/news.json</code> の状況を確認してください。</div>`;
    console.error('[news] all attempts failed:', paths, lastErr);
    return;
  }

  // 型安全：配列以外は空扱い
  const items = Array.isArray(json) ? json : [];
  // 日付降順
  items.sort((a,b)=> new Date(b.date) - new Date(a.date));
  // 必要なら最大件数を制限
  // const list = items.slice(0, 12);
  const list = items;

  railEl.innerHTML = list.map(item=>{
    const href = item.url ? ` href="${escapeHtml(item.url)}"` : '';
    const ext  = item.url && /^https?:\/\//.test(item.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    const thumb = item.thumb ? escapeHtml(item.thumb) : 'assets/eyecatch-desktop.png';
    const date  = item.date ? escapeHtml(item.date) : '';
    const title = item.title ? escapeHtml(item.title) : '(無題)';
    return `
      <a class="news-card"${href}${ext} aria-label="${title}">
        <div class="news-thumb"><img loading="lazy" src="${thumb}" alt=""></div>
        <div class="news-meta">${date}</div>
        <h4>${title}</h4>
      </a>
    `;
  }).join('');
}
document.addEventListener('DOMContentLoaded', renderNews);
