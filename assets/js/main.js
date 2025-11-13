// assets/js/main.js
(function(){
  (function setActiveNav(){
    try {
      const navLinks = document.querySelectorAll('.main-nav a');
      const path = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        a.classList.toggle('active', href.split('/').pop() === path);
      });
    } catch (e) { console.warn(e); }
  })();

  const slider = document.getElementById('slider');
  if (slider) {
    const slidesWrap = document.getElementById('slides');
    const slides = Array.from(slidesWrap.children);
    const total = slides.length;
    let current = 0;
    let autoplayDelay = 4000;
    let timer = null;
    let isPaused = false;

    const dotsContainer = document.getElementById('dots');
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', `Go to slide ${i+1}`);
      d.dataset.index = i;
      d.type = 'button';
      dotsContainer.appendChild(d);
    });
    const dots = Array.from(dotsContainer.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function update(){
      slidesWrap.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach(d=>d.classList.remove('active'));
      if (dots[current]) dots[current].classList.add('active');
    }
    function goTo(i){ current = ((i % total) + total) % total; update(); }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }
    function startAutoplay(){ stopAutoplay(); timer = setInterval(()=>{ if(!isPaused) next(); }, autoplayDelay); }
    function stopAutoplay(){ if(timer){ clearInterval(timer); timer = null; } }

    dots.forEach(d=> d.addEventListener('click', e => { goTo(Number(e.currentTarget.dataset.index)); startAutoplay(); }));
    if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); startAutoplay(); });
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); startAutoplay(); });

    slider.addEventListener('mouseenter', ()=> isPaused = true);
    slider.addEventListener('mouseleave', ()=> isPaused = false);
    slider.addEventListener('focusin', ()=> isPaused = true);
    slider.addEventListener('focusout', ()=> isPaused = false);

    (function(){
      let startX=0, endX=0;
      slider.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; }, {passive:true});
      slider.addEventListener('touchmove', e=>{ endX = e.touches[0].clientX; }, {passive:true});
      slider.addEventListener('touchend', ()=>{ const dx = endX - startX; if(Math.abs(dx) > 40){ if(dx < 0) next(); else prev(); startAutoplay(); } startX=0; endX=0; });
    })();

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      stopAutoplay();
      slidesWrap.style.transition = 'none';
    } else {
      startAutoplay();
    }
    goTo(0);
  }

  (function setupContactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = { name: form.name.value || '', email: form.email.value || '', message: form.message.value || '', createdAt: new Date().toISOString() };
      if (window.db && typeof window.db.collection === 'function') {
        window.db.collection('messages').add(data)
          .then(()=>{ alert('Message sent — saved to Firestore'); form.reset(); })
          .catch(err=>{ console.warn(err); saveLocal(data); alert('Saved locally (Firestore error)'); form.reset(); });
      } else { saveLocal(data); alert('Saved locally (no Firestore)'); form.reset(); }
    });
    function saveLocal(d){ const msgs = JSON.parse(localStorage.getItem('asc_messages')||'[]'); msgs.push(d); localStorage.setItem('asc_messages', JSON.stringify(msgs)); }
  })();

  document.querySelectorAll('.marquee').forEach(m => { m.addEventListener('mouseenter', ()=> m.style.animationPlayState='paused'); m.addEventListener('mouseleave', ()=> m.style.animationPlayState='running'); });
})();
