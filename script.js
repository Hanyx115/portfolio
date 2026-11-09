const menuButton = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

const closeMenu = () => {
  primaryNavigation.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  primaryNavigation.classList.toggle('is-open', !isOpen);
  menuButton.classList.toggle('is-open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
});

primaryNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('.section').forEach(section => {
  const track = section.querySelector('.experience-track, .project-track');
  if (!track) return;

  const cards = [...track.children];
  const viewport = track.parentElement;
  const previousButton = section.querySelector('.prev');
  const nextButton = section.querySelector('.next');
  const counter = section.querySelector('.count b');
  let current = 0;
  let startX = 0;

  const maxIndex = () => Math.max(0, window.innerWidth <= 720 ? cards.length - 1 : cards.length - (track.classList.contains('experience-track') ? 3 : 2));
  const update = () => {
    current = Math.min(current, maxIndex());
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${current * step}px)`;
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
  };
  const next = () => {
    current = current >= maxIndex() ? 0 : current + 1;
    update();
  };
  const previous = () => {
    current = current <= 0 ? maxIndex() : current - 1;
    update();
  };

  nextButton?.addEventListener('click', next);
  previousButton?.addEventListener('click', previous);
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }
  });
  track.addEventListener('touchstart', event => {
    startX = event.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', event => {
    const difference = startX - event.changedTouches[0].clientX;
    if (Math.abs(difference) > 45) difference > 0 ? next() : previous();
  });
  window.addEventListener('resize', update);
  update();
});

const navigationLinks = [...primaryNavigation.querySelectorAll('a')];
const observedSections = navigationLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navigationLinks.forEach(link => {
    if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-25% 0px -60%', threshold: [0, 0.2, 0.5] });
observedSections.forEach(section => sectionObserver.observe(section));

const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 700);
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
