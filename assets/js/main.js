/* ============================================
   KILE CONSTRUCTION — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

  /* ---- Scroll animations (fade-up) ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => observer.observe(el));
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
      autoplayTimer = setInterval(nextSlide, 4000);
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
  const form = document.getElementById('intakeForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (valid) {
        alert('Thank you for your submission! We will be in touch soon.');
        form.reset();
      }
    });
  }

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
});
