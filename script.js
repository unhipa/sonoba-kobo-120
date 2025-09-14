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

// // Netlifyフォーム誤送信防止（必要時のみON）
// // document.querySelector('form[name="contact"]')?.addEventListener('submit', (e)=>{ e.preventDefault(); alert('送信（デモ）'); });
