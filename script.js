document.querySelectorAll('.section').forEach(section => {
  const track = section.querySelector('.experience-track, .project-track');
  if (!track) return;
  const cards = [...track.children]; let current = 0;
  const maxIndex = () => window.innerWidth <= 720 ? cards.length - 1 : cards.length - (track.classList.contains('experience-track') ? 3 : 2);
  const update = () => { current = Math.min(current, maxIndex()); const card = cards[0]; const gap = parseFloat(getComputedStyle(track).gap) || 0; const width = card.getBoundingClientRect().width + gap; track.style.transform = `translateX(-${current * width}px)`; section.querySelector('.count b').textContent = String(current + 1).padStart(2, '0'); };
  section.querySelector('.next').addEventListener('click', () => { current = current >= maxIndex() ? 0 : current + 1; update(); });
  section.querySelector('.prev').addEventListener('click', () => { current = current <= 0 ? maxIndex() : current - 1; update(); });
  let startX = 0; track.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true}); track.addEventListener('touchend', e => { const diff = startX - e.changedTouches[0].clientX; if (Math.abs(diff) > 45) { current = diff > 0 ? Math.min(current + 1, maxIndex()) : Math.max(current - 1, 0); update(); } });
  window.addEventListener('resize', update);
});
