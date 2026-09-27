// Slide engine shared by every lesson.
// A lesson page puts its <section class="slide"> elements inside <div id="deck">
// and loads this file. The script adds the counter, progress bar and arrow
// buttons itself, so lesson pages carry no navigation markup.
//
// Navigation: arrow keys, space, swipe. `#3` jumps to slide 3; `#some-id`
// jumps to the slide with that id. `?all` reveals every build step.

(() => {
  const deck = document.getElementById('deck');
  const REVEAL_ALL = new URLSearchParams(window.location.search).has('all');
  let slides = [];
  let current = 0;

  // ---- chrome -------------------------------------------------------------
  const arrow = (points) =>
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${points}"></polyline></svg>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="slide-counter"><span id="current">1</span> / <span id="total">1</span></div>
    <div class="keyboard-hint">Use arrow keys to navigate</div>
    <div class="progress-bar" id="progress"></div>
    <div class="nav-controls">
      <button class="nav-btn" id="prevBtn" aria-label="Previous">${arrow('15 18 9 12 15 6')}</button>
      <button class="nav-btn" id="nextBtn" aria-label="Next">${arrow('9 18 15 12 9 6')}</button>
    </div>`);

  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const progressEl = document.getElementById('progress');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // ---- build steps --------------------------------------------------------
  // Elements with data-step="N" stay hidden until step N is reached on that slide.
  function maxStep(slide) {
    let max = 0;
    slide.querySelectorAll('[data-step]').forEach((el) => {
      max = Math.max(max, Number(el.dataset.step) || 0);
    });
    return max;
  }

  function setStep(slide, n) {
    const clamped = Math.max(0, Math.min(maxStep(slide), n));
    slide.dataset.build = clamped;
    slide.querySelectorAll('[data-step]').forEach((el) => {
      el.classList.toggle('is-revealed', (Number(el.dataset.step) || 0) <= clamped);
    });
  }

  function currentStep(slide) {
    return Number(slide.dataset.build) || 0;
  }

  // ---- navigation ---------------------------------------------------------
  function goTo(index, { revealAll = false } = {}) {
    if (!slides.length) return;
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.classList.toggle('is-prev', i < current);
    });
    setStep(slides[current], revealAll || REVEAL_ALL ? maxStep(slides[current]) : 0);
    updateChrome();
  }

  // Counter, progress bar and arrow buttons. Buttons follow build steps, so they
  // disable only at the very first step of the deck and the very last one.
  function updateChrome() {
    const slide = slides[current];
    currentEl.textContent = current + 1;
    totalEl.textContent = slides.length;
    progressEl.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevBtn.disabled = current === 0 && currentStep(slide) === 0;
    nextBtn.disabled = current === slides.length - 1 && currentStep(slide) === maxStep(slide);
  }

  function next() {
    const slide = slides[current];
    if (currentStep(slide) < maxStep(slide)) {
      setStep(slide, currentStep(slide) + 1);
      updateChrome();
    } else if (current < slides.length - 1) {
      goTo(current + 1);
    }
  }

  function prev() {
    const slide = slides[current];
    if (currentStep(slide) > 0) {
      setStep(slide, currentStep(slide) - 1);
      updateChrome();
    } else if (current > 0) {
      goTo(current - 1, { revealAll: true });
    }
  }

  function startFromHash() {
    const hash = decodeURIComponent(window.location.hash.replace('#', '')).trim();
    if (!hash) { goTo(0); return; }
    const asNumber = parseInt(hash, 10);
    if (!Number.isNaN(asNumber)) { goTo(asNumber - 1); return; }
    const idx = slides.findIndex((s) => s.id === hash);
    goTo(idx === -1 ? 0 : idx);
  }

  window.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(event.key)) { event.preventDefault(); next(); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); prev(); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(slides.length - 1, { revealAll: true }); }
  });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  let touchStartX = 0;
  document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (event) => {
    const diff = touchStartX - event.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
  }, { passive: true });
  window.addEventListener('hashchange', startFromHash);

  slides = Array.from(deck.querySelectorAll('.slide'));
  startFromHash();
})();
