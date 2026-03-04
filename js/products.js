/* ============================================
   PRODUCT MODALS
============================================ */
function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Zamknij klikając tło
  overlay.addEventListener('click', function handler(e) {
    if (e.target === overlay) {
      closeModal(id);
      overlay.removeEventListener('click', handler);
    }
  });
}

function closeModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;

  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================
   PRODUCT FILTERS
============================================ */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.product-card');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktywny przycisk
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card, i) => {
        const category = card.getAttribute('data-category') || '';
        const matches  = filter === 'all' || category.includes(filter);

        if (matches) {
          // Płynne pojawianie z opóźnieniem
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity  = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        } else {
          card.style.opacity  = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   GALLERY THUMBNAILS W MODALU
============================================ */
function initModalGallery() {
  document.querySelectorAll('.modal__gallery').forEach(gallery => {
    const mainImg = gallery.querySelector('img');
    const thumbs  = gallery.querySelectorAll('.modal__thumb');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.getAttribute('data-src');
        if (!newSrc) return;

        mainImg.style.opacity   = '0';
        mainImg.style.transition = 'opacity 0.3s';

        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 300);

        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });
}

/* ============================================
   STICKY FILTER BAR
============================================ */
function initStickyFilter() {
  const filterBar = document.querySelector('.products-filters');
  const navHeight = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')
  ) || 80;

  if (!filterBar) return;

  const originalTop = filterBar.getBoundingClientRect().top + window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > originalTop - navHeight) {
      filterBar.style.position   = 'sticky';
      filterBar.style.top        = navHeight + 'px';
      filterBar.style.zIndex     = '100';
      filterBar.style.background = 'rgba(245, 240, 232, 0.96)';
      filterBar.style.backdropFilter = 'blur(10px)';
      filterBar.style.boxShadow  = '0 1px 0 rgba(184, 150, 90, 0.1)';
    } else {
      filterBar.style.position   = '';
      filterBar.style.top        = '';
      filterBar.style.background = '';
      filterBar.style.backdropFilter = '';
      filterBar.style.boxShadow  = '';
    }
  }, { passive: true });
}

/* ============================================
   PRODUCT CARD TRANSITIONS
============================================ */
function initCardTransitions() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    // Inicjalne style dla filtrowania
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    card.style.opacity    = '1';
    card.style.transform  = 'translateY(0)';
  });
}

/* ============================================
   LAZY LOAD IMAGES
============================================ */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px' }
  );

  images.forEach(img => observer.observe(img));
}

/* ============================================
   WISHLIST (localStorage — wizualny)
============================================ */
function initWishlist() {
  let wishlist = JSON.parse(localStorage.getItem('ebruWishlist')) || [];

  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    const name = btn.getAttribute('data-wishlist');
    if (wishlist.includes(name)) btn.classList.add('wished');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (wishlist.includes(name)) {
        wishlist = wishlist.filter(n => n !== name);
        btn.classList.remove('wished');
      } else {
        wishlist.push(name);
        btn.classList.add('wished');
        showToast(`„${name}" dodano do listy życzeń ♡`);
      }
      localStorage.setItem('ebruWishlist', JSON.stringify(wishlist));
    });
  });
}

/* ============================================
   INIT PRODUCTS PAGE
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initModalGallery();
  initStickyFilter();
  initCardTransitions();
  initLazyLoad();
  initWishlist();
});
