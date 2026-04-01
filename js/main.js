/* ============================
   main.js — Armazém Jaguaribe
============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. CARROSSEL HORIZONTAL — Scroll + Setas + Dots
  ----------------------------------------------- */
  const track     = document.getElementById('produtoTrack');
  const prevBtn   = document.querySelector('.scroll-prev');
  const nextBtn   = document.querySelector('.scroll-next');
  const dotsWrap  = document.getElementById('trackDots');
  const cards     = track ? [...track.querySelectorAll('.produto-card')] : [];
  const cardCount = cards.length;

  // Criar dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'track-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para produto ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsWrap?.appendChild(dot);
  });

  function getCardWidth() {
    if (!cards[0]) return 260;
    const style = window.getComputedStyle(track);
    const gap   = parseFloat(style.getPropertyValue('gap')) || 20;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function scrollToCard(index) {
    if (!track) return;
    track.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
  }

  function getActiveIndex() {
    if (!track) return 0;
    return Math.round(track.scrollLeft / getCardWidth());
  }

  function updateDots(activeIdx) {
    const dots = dotsWrap?.querySelectorAll('.track-dot');
    dots?.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

  prevBtn?.addEventListener('click', () => {
    const cur = getActiveIndex();
    scrollToCard(Math.max(0, cur - 1));
  });
  nextBtn?.addEventListener('click', () => {
    const cur = getActiveIndex();
    scrollToCard(Math.min(cardCount - 1, cur + 1));
  });

  let scrollTimer;
  track?.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => updateDots(getActiveIndex()), 60);
  });

  // Arrow key support when hovering track
  track?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scrollToCard(Math.min(cardCount - 1, getActiveIndex() + 1));
    if (e.key === 'ArrowLeft')  scrollToCard(Math.max(0, getActiveIndex() - 1));
  });


  /* -----------------------------------------------
     2. POPUPS — abrir / fechar
  ----------------------------------------------- */

  function openPopup(id) {
    const el = document.getElementById(`popup-${id}`);
    if (!el) return;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup(el) {
    el.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Fechar ao clicar no overlay (fora do box)
  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closePopup(overlay);
    });
  });

  // Fechar ao clicar no botão X
  document.querySelectorAll('.popup-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.popup-overlay');
      if (overlay) closePopup(overlay);
    });
  });

  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay.active').forEach(closePopup);
    }
  });


  /* -----------------------------------------------
     3. BOTÕES "SAIBA MAIS" dos produtos
  ----------------------------------------------- */
  document.querySelectorAll('.btn-saiba').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.produto-card');
      const popupId = card?.dataset.popup;
      if (popupId) openPopup(popupId);
    });
  });

  // Clicar no card também abre (exceto se clicar no link "Ver Catálogo")
  document.querySelectorAll('.produto-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.btn-ver')) return; // deixa o link funcionar
      const popupId = card.dataset.popup;
      if (popupId) openPopup(popupId);
    });
  });


  /* -----------------------------------------------
     4. BOTÕES "VER DETALHES" das lojas
  ----------------------------------------------- */
  document.querySelectorAll('.btn-loja-detalhe').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.loja-card');
      const popupId = card?.dataset.popup;
      if (popupId) openPopup(popupId);
    });
  });

  // Clicar no card de loja também abre (exceto botão de mapa)
  document.querySelectorAll('.loja-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.btn-loja-mapa')) return;
      const popupId = card.dataset.popup;
      if (popupId) openPopup(popupId);
    });
  });


  /* -----------------------------------------------
     5. ENTRADA SUAVE DAS SEÇÕES (Intersection Observer)
  ----------------------------------------------- */
  const observerOpts = { threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.produto-card, .loja-card, .qn-item, .wpp-card, .prod-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // Adicionar classe .visible via CSS injection para animação
  const style = document.createElement('style');
  style.textContent = `
    .produto-card.visible,
    .loja-card.visible,
    .qn-item.visible,
    .wpp-card.visible,
    .prod-card.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  /* -----------------------------------------------
     6. MURAL HERO — 3D Carousel
  ----------------------------------------------- */
  const cardsMural = document.querySelectorAll('.mural-card');
  const btnLeft    = document.getElementById('muralLeft');
  const btnRight   = document.getElementById('muralRight');
  let muralIndex   = 0;

  function updateMural() {
    if (cardsMural.length === 0) return;
    
    cardsMural.forEach((card, i) => {
      card.classList.remove('active', 'next', 'prev');
      
      if (i === muralIndex) {
        card.classList.add('active');
        card.style.zIndex = '10';
      } else if (i === (muralIndex + 1) % cardsMural.length) {
        card.classList.add('next');
        card.style.zIndex = '5';
      } else {
        card.classList.add('prev');
        card.style.zIndex = '5';
      }
    });
  }

  btnLeft?.addEventListener('click', () => {
    muralIndex = (muralIndex - 1 + cardsMural.length) % cardsMural.length;
    updateMural();
  });

  btnRight?.addEventListener('click', () => {
    muralIndex = (muralIndex + 1) % cardsMural.length;
    updateMural();
  });

  // Auto-rotação a cada 5 segundos
  let muralInterval = setInterval(() => {
    muralIndex = (muralIndex + 1) % cardsMural.length;
    updateMural();
  }, 5000);

  // Pausa ao passar o mouse
  const muralHero = document.querySelector('.hero-mural');
  muralHero?.addEventListener('mouseenter', () => clearInterval(muralInterval));
  muralHero?.addEventListener('mouseleave', () => {
    muralInterval = setInterval(() => {
      muralIndex = (muralIndex + 1) % cardsMural.length;
      updateMural();
    }, 5000);
  });

});