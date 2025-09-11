// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => nav.classList.toggle('open'));

// Smooth scroll (internal links)
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

// To top button
const toTop = document.querySelector('.to-top');
const onScroll = () => {
  if (window.scrollY > 400) { toTop.style.display='grid'; }
  else { toTop.style.display='none'; }
};
window.addEventListener('scroll', onScroll);
toTop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
onScroll();

// Small: prevent form submission on demo unless hosted with Netlify forms
document.querySelector('form[name="contact"]')?.addEventListener('submit', (e)=>{
  // そのままNetlifyに載せる場合は以下2行をコメントアウト
  // e.preventDefault();
  // alert('送信しました（デモ）');
});
