/* ============================================
   KILE CONSTRUCTION — 2026 Modern JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header scroll effect ---- */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  if (header) {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Navigation ---- */
  const hamburger = document.querySelector('.hamburger');
  const navWrap = document.querySelector('.nav-desktop-wrap');
  const overlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navWrap.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navWrap.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navWrap.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* ---- Mobile dropdown toggles ---- */
  const menuItems = document.querySelectorAll('.nav-desktop > li');
  menuItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    const sub = item.querySelector('.sub-menu');
    if (sub && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
          e.preventDefault();
          sub.classList.toggle('open');
        }
      });
    }
  });

  /* ---- Scroll animations (IntersectionObserver) ---- */
  const animateEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .reveal-card, .scale-in');
  if (animateEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(el => observer.observe(el));
  }

  /* ---- Parallax hero background ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const heroSection = heroBg.closest('.hero');
    const onHeroScroll = () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0) {
        const scrolled = -rect.top;
        heroBg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.05)`;
      }
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });
  }

  /* ---- Gallery Carousel (homepage) ---- */
  const carousel = document.getElementById('homeCarousel');
  if (carousel) {
    const track = carousel.querySelector('.gallery-track');
    const slides = carousel.querySelectorAll('.slide');
    const thumbs = carousel.querySelectorAll('.thumb');
    let currentSlide = 0;
    let autoplayTimer;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      thumbs.forEach(t => t.classList.remove('active'));
      if (thumbs[index]) thumbs[index].classList.add('active');
    }

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.index, 10);
        goToSlide(idx);
        resetAutoplay();
      });
    });

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    resetAutoplay();
  }

  /* ---- Lightbox (gallery page) ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length) {
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  /* ---- Contact form validation ---- */
  const forms = document.querySelectorAll('#intakeForm, #contactForm');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#B87347';
          field.style.boxShadow = '0 0 0 3px rgba(184,115,71,0.15)';
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });
      if (valid) {
        alert('Thank you for your submission! We will be in touch soon.');
        form.reset();
      }
    });
  });

  /* ---- File upload label ---- */
  const fileInput = document.getElementById('fileUpload');
  const fileLabel = document.getElementById('fileLabel');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        fileLabel.textContent = Array.from(fileInput.files).map(f => f.name).join(', ');
      } else {
        fileLabel.textContent = 'Click to upload photos and blueprints (Max 100 MB)';
      }
    });
  }

  /* ---- Staggered card animations ---- */
  const svcCards = document.querySelectorAll('.svc-card');
  svcCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  /* ---- Counter animation for stats ---- */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/^([\d.]+)(.*)$/);
          if (match) {
            const target = parseFloat(match[1]);
            const suffix = match[2];
            const isDecimal = text.includes('.');
            const duration = 1500;
            const start = performance.now();

            function animate(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;
              el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
              if (progress < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObserver.observe(el));
  }

});
