const mobileToggle = document.querySelector('.mobile-toggle');
const mobilePanel = document.querySelector('.mobile-panel');

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('open');
  });

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const cards = Array.from(document.querySelectorAll('.testimonials .testimonial-card'));
const track = document.querySelector('.testimonials [data-carousel-track]');
const dotsContainer = document.querySelector('.testimonials [data-carousel-dots]');
const prevButton = document.querySelector('.testimonials .carousel-arrow--left');
const nextButton = document.querySelector('.testimonials .carousel-arrow--right');

let currentIndex = 0;
let carouselInterval;

function buildDots() {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';

  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.toggle('is-active', index === currentIndex);
  });

  const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentIndex);
  });
}

function goToSlide(index) {
  if (!cards.length) return;
  currentIndex = (index + cards.length) % cards.length;
  updateCarousel();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

function startAutoPlay() {
  if (cards.length < 2) return;
  carouselInterval = setInterval(nextSlide, 4800);
}

function resetAutoPlay() {
  clearInterval(carouselInterval);
  startAutoPlay();
}

if (cards.length) {
  buildDots();
  updateCarousel();
  startAutoPlay();

  nextButton?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prevButton?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  track?.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  track?.addEventListener('mouseleave', startAutoPlay);
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}


const topbar = document.querySelector('.navbar');

function getTopbarOffset() {
  return topbar ? topbar.offsetHeight + 18 : 104;
}

function scrollToHashTarget(hash, updateHistory = true) {
  if (!hash || hash === '#') return;
  const target = document.querySelector(hash);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });

  if (updateHistory) {
    history.replaceState(null, '', hash);
  }
}

document.querySelectorAll('.nav-menu a, .mobile-panel a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    event.preventDefault();
    if (mobilePanel) mobilePanel.classList.remove('open');
    scrollToHashTarget(href, true);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
  }
});
