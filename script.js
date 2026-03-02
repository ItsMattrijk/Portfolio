/* Ouvre le bon popup selon la section active de la tile Compétences/Langues */
function openSkillsPopup() {
  const activeSection = document.querySelector('#tile-skills-wrapper .skills-section.active');
  if (activeSection && activeSection.id === 'tile-skills-1') {
    openPopup('languages');
  } else {
    openPopup('skills');
  }
}

/* ── DRAG-TO-SCROLL SUR LE STRIP GRAPHISME ── */
document.addEventListener('DOMContentLoaded', () => {
  const strip = document.querySelector('.graphisme-preview-strip');
  if (!strip) return;
  let isDown = false, startX, scrollLeft;
  strip.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
  strip.addEventListener('mouseleave', () => { isDown = false; });
  strip.addEventListener('mouseup', () => { isDown = false; });
  strip.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - strip.offsetLeft; strip.scrollLeft = scrollLeft - (x - startX) * 1.5; });
});

function toggleCvPreview() {
  const container = document.getElementById('cv-iframe-container');
  const btn = document.querySelector('.cv-preview-btn');
  if (!container) return;
  const isVisible = container.style.display === 'block';
  container.style.display = isVisible ? 'none' : 'block';
  if (btn) btn.textContent = isVisible ? '👁 Apercevoir le CV' : '✕ Masquer l\'aperçu';
}

function openPopup(id) {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  const el = document.getElementById('popup-' + id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePopup(id) {
  const el = document.getElementById('popup-' + id);
  if (el) {
    el.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (id === 'cv') {
    const container = document.getElementById('cv-iframe-container');
    const btn = document.querySelector('.cv-preview-btn');
    if (container) container.style.display = 'none';
    if (btn) btn.textContent = '👁 Apercevoir le CV';
  }
}

function closeOnOverlay(e, id) {
  if (e.target === e.currentTarget) closePopup(id);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.overlay.active').forEach(o => o.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

/* ── FM-STYLE TILE SECTION SWITCHER ── */
function switchTileSection(tileId, sectionIndex) {
  const activeDot = event.target;
  const allSections = document.querySelectorAll(`[id^="tile-${tileId}-"]`);

  let currentSection = null;
  let currentIndex = 0;
  allSections.forEach((s, i) => {
    if (s.classList.contains('active')) { currentSection = s; currentIndex = i; }
  });

  const targetSection = document.getElementById(`tile-${tileId}-${sectionIndex}`);
  if (!targetSection || currentSection === targetSection) return;

  const goRight = sectionIndex < currentIndex;

  // 1. La section sortante passe en absolute (is-leaving) pour ne pas pousser la nouvelle
  currentSection.classList.add('is-leaving', goRight ? 'slide-out-right' : 'slide-out-left');

  // 2. Retirer .active de l'ancienne MAINTENANT → la nouvelle prend sa place dans le flux
  currentSection.classList.remove('active');

  // 3. Nettoyer la sortante après l'animation
  currentSection.addEventListener('animationend', () => {
    currentSection.classList.remove('is-leaving', 'slide-out-left', 'slide-out-right');
  }, { once: true });

  // 4. Afficher et animer la nouvelle
  targetSection.classList.add('active', goRight ? 'slide-in-left' : 'slide-in-right');
  targetSection.addEventListener('animationend', () => {
    targetSection.classList.remove('slide-in-right', 'slide-in-left');
  }, { once: true });

  // 5. Mettre à jour les dots
  activeDot.closest('.tile-dots').querySelectorAll('.tile-dot').forEach(d => d.classList.remove('active'));
  activeDot.classList.add('active');
}