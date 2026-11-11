(() => {
  const toggle=document.querySelector('.nav-toggle');
  const menu=document.getElementById('portfolio-menu');
  if(!toggle||!menu)return;
  document.documentElement.classList.add('nav-ready');
  function setOpen(open) {
    toggle.setAttribute('aria-expanded',String(open));
    menu.classList.toggle('is-open',open);
  }
  toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
  menu.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false);});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setOpen(false);toggle.focus();}
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.site-nav'))setOpen(false);});
  window.matchMedia('(min-width:901px)').addEventListener('change',()=>setOpen(false));
})();
