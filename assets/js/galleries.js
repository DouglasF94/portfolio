(() => {
  const galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'gallery-lightbox';
  dialog.innerHTML = '<div class="lightbox-top"><p aria-live="polite"></p><button type="button" data-close aria-label="Fechar imagem ampliada">Fechar ×</button></div><div class="lightbox-image"><img alt=""></div><div class="lightbox-controls"><button type="button" data-prev aria-label="Imagem anterior">← Anterior</button><span></span><button type="button" data-next aria-label="Próxima imagem">Próxima →</button></div>';
  document.body.append(dialog);
  let current = null;
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; current = null; });
  dialog.querySelector('[data-prev]').onclick = () => current?.move(-1);
  dialog.querySelector('[data-next]').onclick = () => current?.move(1);
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); current?.move(e.key === 'ArrowLeft' ? -1 : 1); }
  });
  function swipe(el, move) {
    let start = null;
    el.addEventListener('touchstart', e => { start = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}; }, {passive:true});
    el.addEventListener('touchend', e => {
      if (!start) return;
      const dx=e.changedTouches[0].clientX-start.x, dy=e.changedTouches[0].clientY-start.y;
      if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) move(dx<0?1:-1);
      start=null;
    }, {passive:true});
  }
  swipe(dialog.querySelector('.lightbox-image'), d => current?.move(d));
  galleries.forEach(gallery => {
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const thumbs = [...gallery.querySelectorAll('[data-slide]')];
    const stage = gallery.querySelector('.gallery-stage');
    let index = 0;
    const title = () => `${slides[index].dataset.title} · ${slides[index].dataset.kind}`;
    function render() {
      slides.forEach((slide,i) => { slide.hidden = i !== index; });
      thumbs.forEach((thumb,i) => thumb.setAttribute('aria-pressed', String(i===index)));
      gallery.querySelector('.gallery-caption').textContent = title();
      gallery.querySelector('.gallery-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      if (current === api && dialog.open) {
        const image = slides[index].querySelector('img');
        const large = dialog.querySelector('img');
        large.src=image.src; large.alt=image.alt;
        dialog.querySelector('p').textContent=title();
        dialog.querySelector('.lightbox-controls span').textContent=`${index+1} / ${slides.length}`;
      }
    }
    const api = {move(d) { index=(index+d+slides.length)%slides.length; render(); }};
    function open() {
      current=api;
      dialog.showModal(); document.body.style.overflow='hidden'; render();
    }
    gallery.classList.add('gallery-ready');
    gallery.querySelector('.gallery-toolbar').hidden=false;
    gallery.querySelector('.gallery-thumbnails').hidden=false;
    gallery.querySelector('[data-prev]').onclick=()=>api.move(-1);
    gallery.querySelector('[data-next]').onclick=()=>api.move(1);
    gallery.querySelector('[data-expand]').onclick=open;
    thumbs.forEach((thumb,i)=>thumb.onclick=()=>{index=i;render();});
    slides.forEach(slide=>slide.querySelector('a').addEventListener('click',e=>{e.preventDefault();open();}));
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();api.move(e.key==='ArrowLeft'?-1:1);}});
    swipe(stage, d=>api.move(d));
    render();
  });
})();
