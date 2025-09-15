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
document.querySelector('.news-prev')?.addEventListener('click', () => {
  rail?.scrollBy({left: -320, behavior: 'smooth'});
});
document.querySelector('.news-next')?.addEventListener('click', () => {
  rail?.scrollBy({left: 320, behavior: 'smooth'});
});

// ===== News: JSON から描画（キャッシュバスター付き） =====
function escapeHtml(s){return s.replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

async function renderNews(){
  const railEl = document.getElementById('newsRail');
  if(!railEl) return;

  // ローディング骨組み
  railEl.innerHTML = Array.from({length:4}).map(()=>(
    `<div class="news-card skeleton" aria-hidden="true" style="height:220px;width:260px;border-radius:14px;"></div>`
  )).join('');

  try{
    // ★ キャッシュ回避用に現在時刻を付与
    const res = await fetch('data/news.json?ts=' + Date.now(), {cache:'no-store'});
    if(!res.ok) throw new Error('failed to load news.json');
    const items = await res.json();

    // 日付降順
    items.sort((a,b)=> new Date(b.date) - new Date(a.date));

    // 必要なら最大件数を制限 → const list = items.slice(0, 12);
    const list = items;

    // 描画
    railEl.innerHTML = list.map(item=>{
      const href = item.url ? ` href="${escapeHtml(item.url)}"` : '';
      const ext = item.url && /^https?:\/\//.test(item.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      const thumb = item.thumb ? escapeHtml(item.thumb) : 'assets/eyecatch-desktop.png';
      return `
        <a class="news-card"${href}${ext} aria-label="${escapeHtml(item.title)}">
          <div class="news-thumb"><img loading="lazy" src="${thumb}" alt=""></div>
          <div class="news-meta">${escapeHtml(item.date)}</div>
          <h4>${escapeHtml(item.title)}</h4>
        </a>
      `;
    }).join('');

  }catch(err){
    console.error(err);
    railEl.innerHTML = `<div style="opacity:.8">ニュースを読み込めませんでした。JSONの形式やパスを確認してください。</div>`;
  }
}
document.addEventListener('DOMContentLoaded', renderNews);
