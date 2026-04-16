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

  /* ---- Contact form submission (Cloudflare Worker form-relay) ---- */
  const WORKER_URL = 'https://form-relay.chuck-84d.workers.dev';

  function showFormMessage(form, type, message) {
    const existing = form.parentNode.querySelector('.form-message');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'form-message form-message--' + type;
    div.textContent = message;
    div.style.padding = '12px 16px';
    div.style.marginTop = '16px';
    div.style.borderRadius = '6px';
    div.style.fontWeight = '500';
    if (type === 'success') {
      div.style.background = '#d4edda';
      div.style.color = '#155724';
      div.style.border = '1px solid #c3e6cb';
    } else {
      div.style.background = '#f8d7da';
      div.style.color = '#721c24';
      div.style.border = '1px solid #f5c6cb';
    }
    form.parentNode.insertBefore(div, form.nextSibling);
    setTimeout(() => div.remove(), 8000);
  }

  function submitAdaptForm(form) {
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) {
      window.location.href = 'thank-you.html';
      return;
    }

    const btn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = btn ? btn.textContent : '';

    const data = {};
    new FormData(form).forEach((value, key) => {
      if (key !== '_honey') data[key] = value;
    });
    data._page = window.location.pathname;

    const errors = [];
    if (!data.first_name || !data.first_name.trim()) errors.push('First name is required');
    if (!data.last_name || !data.last_name.trim()) errors.push('Last name is required');
    if (!data.phone || !data.phone.trim()) errors.push('Phone number is required');
    if (!data.email || !data.email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push('Please enter a valid email address');

    if (errors.length > 0) {
      showFormMessage(form, 'error', errors.join('. '));
      return;
    }

    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          window.location.href = 'thank-you.html';
        } else {
          showFormMessage(form, 'error', result.error || 'Something went wrong. Please try again.');
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        }
      })
      .catch(() => {
        showFormMessage(form, 'error', 'Network error. Please try again.');
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      });
  }

  document.querySelectorAll('#intakeForm, #contactForm').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitAdaptForm(form);
    });
  });

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
