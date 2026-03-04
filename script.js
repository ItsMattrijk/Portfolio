/* ── ABOUT POPUP ── */
function openAboutPopup() {
  const activeSection = document.querySelector('#tile-about-wrapper .skills-section.active');
  if (activeSection && activeSection.id === 'tile-about-1') {
    openPopup('github');
  } else {
    openPopup('about');
  }
}

/* ── SKILLS POPUP ── */
function openSkillsPopup() {
  const activeSection = document.querySelector('#tile-skills-wrapper .skills-section.active');
  if (activeSection && activeSection.id === 'tile-skills-1') {
    openPopup('languages');
  } else {
    openPopup('skills');
  }
}


/* ── DRAG-TO-SCROLL ── */
document.addEventListener('DOMContentLoaded', () => {
  const strip = document.querySelector('.graphisme-preview-strip');
  if (!strip) return;
  let isDown = false, startX, scrollLeft;
  strip.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
  strip.addEventListener('mouseleave', () => { isDown = false; });
  strip.addEventListener('mouseup', () => { isDown = false; });
  strip.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - strip.offsetLeft; strip.scrollLeft = scrollLeft - (x - startX) * 1.5; });
});

/* ── CV ── */
function toggleCvPreview() {
  const container = document.getElementById('cv-iframe-container');
  const btn = document.querySelector('.cv-preview-btn');
  if (!container) return;
  const isVisible = container.style.display === 'block';
  container.style.display = isVisible ? 'none' : 'block';
  if (btn) btn.textContent = isVisible ? '👁 Apercevoir le CV' : '✕ Masquer l\'aperçu';
}

/* ── POPUPS ── */
function openPopup(id) {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  const el = document.getElementById('popup-' + id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  /* Charger les données GitHub au premier affichage du popup */
  if (id === 'github') populateGithubPopup();
  
  /* Charger GitHub s'il est sur la section GitHub du tile about */
  if (id === 'about') {
    const activeSection = document.querySelector('#tile-about-wrapper .skills-section.active');
    if (activeSection && activeSection.id === 'tile-about-1') {
      fetchGitHubData();
    }
  }
}

function closePopup(id) {
  const el = document.getElementById('popup-' + id);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
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

/* ── TILE SECTION SWITCHER ── */
function switchTileSection(tileId, sectionIndex) {
  const activeDot = event.target;
  const allSections = document.querySelectorAll(`[id^="tile-${tileId}-"]`);
  let currentSection = null, currentIndex = 0;
  allSections.forEach((s, i) => {
    if (s.classList.contains('active')) { currentSection = s; currentIndex = i; }
  });
  const targetSection = document.getElementById(`tile-${tileId}-${sectionIndex}`);
  if (!targetSection || currentSection === targetSection) return;
  const goRight = sectionIndex < currentIndex;
  currentSection.classList.add('is-leaving', goRight ? 'slide-out-right' : 'slide-out-left');
  currentSection.classList.remove('active');
  currentSection.addEventListener('animationend', () => {
    currentSection.classList.remove('is-leaving', 'slide-out-left', 'slide-out-right');
  }, { once: true });
  targetSection.classList.add('active', goRight ? 'slide-in-left' : 'slide-in-right');
  targetSection.addEventListener('animationend', () => {
    targetSection.classList.remove('slide-in-right', 'slide-in-left');
  }, { once: true });
  activeDot.closest('.tile-dots').querySelectorAll('.tile-dot').forEach(d => d.classList.remove('active'));
  activeDot.classList.add('active');

  // Charger GitHub au premier affichage de la section about GitHub
  if (tileId === 'about' && sectionIndex === 1 && !ghLoaded) {
    ghLoaded = true;
    fetchGitHubData();
  }
}

/* ══════════════════════════════════════════════════════════
   GITHUB ACTIVITY
   ══════════════════════════════════════════════════════════ */

const GH_USER = 'ItsMattrijk';
let ghLoaded = false;

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', PHP: '#8892be',
  HTML: '#e44d26', CSS: '#563d7c', Python: '#3572a5',
  Dart: '#00b4ab', 'C#': '#178600', Shell: '#89e051',
  Vue: '#41b883', default: '#5a7a9a'
};

function getLangColor(lang) {
  return lang ? (LANG_COLORS[lang] || LANG_COLORS.default) : LANG_COLORS.default;
}

function setGhStatus(state, label) {
  const el = document.getElementById('gh-tile-status');
  if (!el) return;
  el.className = 'gh-tile-status' + (state ? ' ' + state : '');
  el.querySelector('.gh-status-text').textContent = label;
}

async function fetchGitHubData() {
  setGhStatus('loading', 'CHARGEMENT');
  try {
    /* ── Profil ── */
    const profileRes = await fetch(`https://api.github.com/users/${GH_USER}`);
    if (!profileRes.ok) throw new Error('profile ' + profileRes.status);
    const profile = await profileRes.json();
    document.getElementById('gh-stat-repos').textContent     = profile.public_repos ?? '—';
    document.getElementById('gh-stat-followers').textContent = profile.followers    ?? '—';

    /* ── Repos ── */
    const reposRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
    const repos    = await reposRes.json();
    const totalStars = Array.isArray(repos) ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0) : 0;
    document.getElementById('gh-stat-stars').textContent = totalStars;

    /* ── Repos récents ── */
    const listEl = document.getElementById('gh-tile-repos-list');
    if (listEl && Array.isArray(repos)) {
      listEl.innerHTML = repos.slice(0, 4).map(r => {
        const color = getLangColor(r.language);
        const stars = r.stargazers_count > 0 ? `<span class="gh-repo-stars">★ ${r.stargazers_count}</span>` : '';
        return `<a class="gh-tile-repo-item" href="${r.html_url}" target="_blank" onclick="event.stopPropagation()">
          <span class="gh-repo-dot" style="background:${color};box-shadow:0 0 5px ${color}88;"></span>
          <span class="gh-repo-name">${r.name}</span>
          ${stars}
          <span class="gh-repo-lang">${r.language || '—'}</span>
        </a>`;
      }).join('');
    }

    /* ── Graphique ── */
    await buildContributionGraph();
    setGhStatus('', 'ACTIF');

  } catch (err) {
    console.warn('[GH tile]', err);
    setGhStatus('error', 'ERREUR API');
    const g = document.getElementById('gh-contribution-graph');
    if (g) renderGraphFallback(g);
    const l = document.getElementById('gh-tile-repos-list');
    if (l) l.innerHTML = `<div style="font-family:'DM Mono',monospace;font-size:9px;color:#ff6b5e;letter-spacing:1px;padding:8px 0;">Données indisponibles.</div>`;
  }
}

/* ══════════════════════════════════════════════════════════
   GRAPHIQUE — Proxy contributions (données réelles)
   ══════════════════════════════════════════════════════════ */
async function buildContributionGraph() {
  const graphEl = document.getElementById('gh-contribution-graph');
  if (!graphEl) return;

  graphEl.innerHTML = '<div class="gh-graph-loading">Chargement des contributions…</div>';

  /* On essaie plusieurs proxies dans l'ordre */
  const proxies = [
    () => fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(d => parseJogruber(d)),
    () => fetch(`https://contributionapi.vercel.app/api/${GH_USER}`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(d => parseVercel(d)),
  ];

  let commitsByDate = null;

  for (const tryProxy of proxies) {
    try {
      commitsByDate = await tryProxy();
      if (commitsByDate && Object.keys(commitsByDate).length > 0) break;
    } catch (e) {
      console.warn('[proxy fail]', e);
    }
  }

  if (commitsByDate && Object.keys(commitsByDate).length > 0) {
    const weeks = buildWeeksGrid(commitsByDate);
    renderGraphCells(graphEl, weeks);
  } else {
    /* Fallback visuel si tous les proxies échouent */
    renderGraphFallback(graphEl);
  }
}

/* Parser pour jogruber.de — retourne { 'YYYY-MM-DD': count } */
function parseJogruber(data) {
  const result = {};
  if (!data || !Array.isArray(data.contributions)) return result;
  data.contributions.forEach(day => {
    if (day.date && typeof day.count === 'number') {
      result[day.date] = day.count;
    }
  });
  return result;
}

/* Parser pour contributionapi.vercel.app */
function parseVercel(data) {
  const result = {};
  if (!data) return result;
  /* Format: { contributions: { '2024-10-01': 3, ... } } ou tableau */
  const raw = data.contributions || data;
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    Object.entries(raw).forEach(([date, val]) => {
      result[date] = typeof val === 'number' ? val : (val?.count || 0);
    });
  } else if (Array.isArray(raw)) {
    raw.forEach(d => {
      if (d.date) result[d.date] = d.count || 0;
    });
  }
  return result;
}

/* ── Construit 52 semaines depuis aujourd'hui ── */
function buildWeeksGrid(commitsByDate) {
  const today  = new Date();
  const weeks  = [];

  /* Début = dimanche d'il y a ~52 semaines */
  const start  = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); /* aligne sur dimanche */

  const cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const count   = commitsByDate[dateStr] || 0;
      const level   = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
      week.push({ date: dateStr, count, level, future: cursor > today });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/* ── Rendu HTML ── */
function renderGraphCells(graphEl, weeks) {
  const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  const wrapper = document.createElement('div');
  wrapper.className = 'gh-graph-wrapper';

/* ── Labels mois ── */
const monthsRow = document.createElement('div');
monthsRow.className = 'gh-graph-months';

let lastMonth = -1;
let lastYear  = -1;

weeks.forEach((week, wi) => {
  const first = week.find(d => !d.future);
  if (!first) return;

  const date = new Date(first.date + 'T12:00:00');
  const m    = date.getMonth();
  const y    = date.getFullYear();

  if (m !== lastMonth || y !== lastYear) {
    const span = document.createElement('span');
    span.className = 'gh-graph-month-label';
    span.textContent = MONTHS_FR[m];
    span.style.gridColumn = `${wi + 1}`;
    monthsRow.appendChild(span);
    lastMonth = m;
    lastYear  = y;
  }
});

wrapper.appendChild(monthsRow);

  /* ── Ligne : labels jours + grille ── */
  const gridWrap = document.createElement('div');
  gridWrap.className = 'gh-graph-grid-wrap';

  /* Labels jours */
  const dayLabels = document.createElement('div');
  dayLabels.className = 'gh-graph-day-labels';
  ['', 'Lun', '', 'Mer', '', 'Ven', ''].forEach((l, i) => {
    const s = document.createElement('span');
    s.textContent = l;
    dayLabels.appendChild(s);
  });
  gridWrap.appendChild(dayLabels);

  /* Grille */
  const grid = document.createElement('div');
  grid.className = 'gh-graph-grid';

  weeks.forEach(week => {
    const col = document.createElement('div');
    col.className = 'gh-graph-week';
    week.forEach(day => {
      const cell = document.createElement('div');
      if (day.future) {
        cell.className = 'gh-graph-cell gh-graph-cell-future';
      } else {
        const lvl = Math.min(day.level, 4);
        cell.className = `gh-graph-cell${lvl > 0 ? ' l' + lvl : ''}`;
        const dateFormatted = new Date(day.date + 'T12:00:00').toLocaleDateString('fr-FR', {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        cell.title = day.count > 0
          ? `${day.count} contribution${day.count > 1 ? 's' : ''} · ${dateFormatted}`
          : `Aucune contribution · ${dateFormatted}`;
      }
      col.appendChild(cell);
    });
    grid.appendChild(col);
  });

  gridWrap.appendChild(grid);
  wrapper.appendChild(gridWrap);

  /* ── Légende ── */
  const legend = document.createElement('div');
  legend.className = 'gh-graph-legend';
  legend.innerHTML = `
    <span class="gh-legend-label">Moins</span>
    <span class="gh-graph-cell"></span>
    <span class="gh-graph-cell l1"></span>
    <span class="gh-graph-cell l2"></span>
    <span class="gh-graph-cell l3"></span>
    <span class="gh-graph-cell l4"></span>
    <span class="gh-legend-label">Plus</span>`;
  wrapper.appendChild(legend);

  graphEl.innerHTML = '';
  graphEl.appendChild(wrapper);
}

/* ── Fallback visuel ── */
function renderGraphFallback(graphEl) {
  const fake = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const prob = i < 90 ? 0.45 : 0.15;
    if (Math.random() < prob) fake[ds] = Math.floor(Math.random() * 8) + 1;
  }
  const weeks = buildWeeksGrid(fake);
  renderGraphCells(graphEl, weeks);
}

/* ══════════════════════════════════════════════════════════
   GITHUB POPUP — données enrichies
   ══════════════════════════════════════════════════════════ */
let ghpLoaded = false;

async function populateGithubPopup() {
  if (ghpLoaded) return;
  ghpLoaded = true;

  try {
    /* ── Profil ── */
    const profileRes = await fetch(`https://api.github.com/users/${GH_USER}`);
    const profile    = await profileRes.json();

    document.getElementById('ghp-stat-repos').textContent     = profile.public_repos ?? '—';
    document.getElementById('ghp-stat-followers').textContent = profile.followers    ?? '—';
    document.getElementById('ghp-stat-following').textContent = profile.following    ?? '—';

    /* ── Repos ── */
    const reposRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
    const repos    = await reposRes.json();
    const totalStars = Array.isArray(repos) ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0) : 0;
    document.getElementById('ghp-stat-stars').textContent = totalStars;

    /* ── Repos grid (top 6 par stars) ── */
    const gridEl = document.getElementById('ghp-repos-grid');
    if (gridEl && Array.isArray(repos)) {
      const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at));
      gridEl.innerHTML = sorted.slice(0, 6).map(r => {
        const color   = getLangColor(r.language);
        const updated = new Date(r.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        const stars   = r.stargazers_count > 0 ? `<span class="ghp-repo-stars">★ ${r.stargazers_count}</span>` : '';
        const forks   = r.forks_count > 0 ? `<span class="ghp-repo-forks">⑂ ${r.forks_count}</span>` : '';
        const desc    = r.description ? `<div class="ghp-repo-desc">${r.description}</div>` : '';
        const topics  = r.topics?.length ? `<div class="ghp-repo-topics">${r.topics.slice(0,3).map(t => `<span class="ghp-topic">${t}</span>`).join('')}</div>` : '';
        return `
          <a class="ghp-repo-card" href="${r.html_url}" target="_blank">
            <div class="ghp-repo-card-header">
              <span class="ghp-repo-name">⌘ ${r.name}</span>
              ${r.visibility === 'public' ? '<span class="ghp-repo-badge">PUBLIC</span>' : ''}
            </div>
            ${desc}
            ${topics}
            <div class="ghp-repo-card-footer">
              <span class="ghp-repo-lang-dot" style="background:${color};box-shadow:0 0 5px ${color}88;"></span>
              <span class="ghp-repo-lang-name">${r.language || '—'}</span>
              ${stars}${forks}
              <span class="ghp-repo-updated">Mis à jour ${updated}</span>
            </div>
          </a>`;
      }).join('');
    }

    /* ── Langues ── */
    const langsEl = document.getElementById('ghp-langs');
    if (langsEl && Array.isArray(repos)) {
      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const total = Object.values(langCount).reduce((a, b) => a + b, 0);
      const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);

      langsEl.innerHTML = `
        <div class="ghp-lang-bar">
          ${sorted.map(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const color = getLangColor(lang);
            return `<div class="ghp-lang-bar-segment" style="width:${pct}%;background:${color};" title="${lang} · ${pct}%"></div>`;
          }).join('')}
        </div>
        <div class="ghp-lang-list">
          ${sorted.map(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const color = getLangColor(lang);
            return `<div class="ghp-lang-item">
              <span class="ghp-lang-dot" style="background:${color};"></span>
              <span class="ghp-lang-name">${lang}</span>
              <span class="ghp-lang-pct">${pct}%</span>
            </div>`;
          }).join('')}
        </div>`;
    }

    /* ── Graphique contributions (réutilise la même fonction) ── */
    const graphEl = document.getElementById('ghp-contribution-graph');
    if (graphEl) {
      await buildContributionGraphInto(graphEl);
    }

  } catch (err) {
    console.warn('[GH popup]', err);
  }
}

/* Version de buildContributionGraph qui prend l'élément en paramètre */
async function buildContributionGraphInto(graphEl) {
  graphEl.innerHTML = '<div class="gh-graph-loading">Chargement des contributions…</div>';

  const proxies = [
    () => fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(d => parseJogruber(d)),
    () => fetch(`https://contributionapi.vercel.app/api/${GH_USER}`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(d => parseVercel(d)),
  ];

  let commitsByDate = null;
  for (const tryProxy of proxies) {
    try {
      commitsByDate = await tryProxy();
      if (commitsByDate && Object.keys(commitsByDate).length > 0) break;
    } catch (e) { console.warn('[proxy]', e); }
  }

  /* Total contributions */
  if (commitsByDate) {
    const total = Object.values(commitsByDate).reduce((a, b) => a + b, 0);
    const totalEl = document.getElementById('ghp-total-contributions');
    if (totalEl) totalEl.textContent = total;
  }

  if (commitsByDate && Object.keys(commitsByDate).length > 0) {
    const weeks = buildWeeksGrid(commitsByDate);
    renderGraphCells(graphEl, weeks);
  } else {
    renderGraphFallback(graphEl);
  }
}
/* ══════════════════════════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════════════════════════ */

const COLOR_MAP = {
  blue:   { label: 'Bleu (défaut)',   accent: '#004170', light: '#0062aa' },
  red:    { label: 'Rouge',           accent: '#7a1510', light: '#DA291C' },
  green:  { label: 'Vert',           accent: '#14532d', light: '#22c55e' },
  purple: { label: 'Violet',         accent: '#4c1d95', light: '#8b5cf6' },
  orange: { label: 'Orange',         accent: '#78350f', light: '#f59e0b' },
  cyan:   { label: 'Cyan',           accent: '#164e63', light: '#06b6d4' },
};

const SIZE_MAP = {
  small:  { label: 'Petit · 13px',  size: '13px' },
  medium: { label: 'Moyen · 15px',  size: '15px' },
  large:  { label: 'Grand · 17px',  size: '17px' },
};

const THEME_MAP = {
  dark:   { label: 'Sombre',    bg: '#0a0e14', tile: '#0f1520' },
  darker: { label: 'Très sombre', bg: '#050709', tile: '#090d13' },
  dim:    { label: 'Tamisé',    bg: '#0e1218', tile: '#161e2a' },
};

const LANG_MAP = {
  fr: 'Français 🇫🇷',
  en: 'English 🇬🇧',
  nl: 'Nederlands 🇳🇱',
};

/* Default settings */
let appSettings = {
  lang:  'fr',
  color: 'blue',
  size:  'medium',
  theme: 'dark',
  anim:  true,
  hover: true,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('portfolioSettings');
    if (saved) appSettings = { ...appSettings, ...JSON.parse(saved) };
  } catch(e) {}
}

function saveSettings() {
  try { localStorage.setItem('portfolioSettings', JSON.stringify(appSettings)); } catch(e) {}
}

function applySettings() {
  const root = document.documentElement;

  // Color
  const c = COLOR_MAP[appSettings.color] || COLOR_MAP.blue;
  root.style.setProperty('--accent', c.accent);
  root.style.setProperty('--accent-light', c.light);

  // Size
  const s = SIZE_MAP[appSettings.size] || SIZE_MAP.medium;
  document.body.style.fontSize = s.size;

  // Theme
  const t = THEME_MAP[appSettings.theme] || THEME_MAP.dark;
  root.style.setProperty('--bg', t.bg);
  root.style.setProperty('--tile', t.tile);

  // Animations
  if (!appSettings.anim) {
    document.body.classList.add('no-anim');
  } else {
    document.body.classList.remove('no-anim');
  }

  // Hover
  if (!appSettings.hover) {
    document.body.classList.add('no-hover');
  } else {
    document.body.classList.remove('no-hover');
  }

  updateSettingsTileDisplay();
}

function updateSettingsTileDisplay() {
  const el = document.getElementById('settings-active-display');
  if (!el) return;

  const c = COLOR_MAP[appSettings.color] || COLOR_MAP.blue;
  const s = SIZE_MAP[appSettings.size] || SIZE_MAP.medium;
  const t = THEME_MAP[appSettings.theme] || THEME_MAP.dark;

  const items = [
    { key: 'Langue',    val: LANG_MAP[appSettings.lang] || appSettings.lang,  dot: '#5aaff5' },
    { key: 'Couleur',   val: c.label,   dot: c.light },
    { key: 'Texte',     val: s.label,   dot: '#22c55e' },
    { key: 'Thème',     val: t.label,   dot: '#8b5cf6' },
    { key: 'Animations',val: appSettings.anim  ? 'Activées' : 'Désactivées', dot: appSettings.anim  ? '#22c55e' : '#ff6b5e' },
    { key: 'Survol',    val: appSettings.hover ? 'Activé'  : 'Désactivé',  dot: appSettings.hover ? '#22c55e' : '#ff6b5e' },
  ];

  el.innerHTML = items.map(i => `
    <div class="settings-active-item">
      <span class="settings-active-item-dot" style="background:${i.dot};box-shadow:0 0 5px ${i.dot}88;"></span>
      <span class="settings-active-item-key">${i.key}</span>
      <span class="settings-active-item-val">${i.val}</span>
    </div>
  `).join('');
}

function selectSetting(group, value, btn) {
  appSettings[group] = value;
  // Update active class
  document.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Update color name label
  if (group === 'color') {
    const nameEl = document.getElementById('settings-color-name');
    if (nameEl) nameEl.textContent = COLOR_MAP[value]?.label || value;
  }
  saveSettings();
  applySettings();
}

function toggleSetting(key, val) {
  appSettings[key] = val;
  saveSettings();
  applySettings();
}

function resetSettings() {
  appSettings = { lang: 'fr', color: 'blue', size: 'medium', theme: 'dark', anim: true, hover: true };
  saveSettings();
  applySettings();
  syncSettingsPopupUI();
}

function syncSettingsPopupUI() {
  // Sync all option buttons
  ['lang','color','size','theme'].forEach(group => {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === appSettings[group]);
    });
  });
  // Color label
  const nameEl = document.getElementById('settings-color-name');
  if (nameEl) nameEl.textContent = COLOR_MAP[appSettings.color]?.label || 'Bleu (défaut)';
  // Toggles
  const animToggle = document.getElementById('toggle-anim');
  if (animToggle) animToggle.checked = appSettings.anim;
  const hoverToggle = document.getElementById('toggle-hover');
  if (hoverToggle) hoverToggle.checked = appSettings.hover;
}

function openSettingsPopup() {
  syncSettingsPopupUI();
  openPopup('settings');
}

/* Update openAboutPopup to handle section 2 */
const _origOpenAboutPopup = openAboutPopup;
window.openAboutPopup = function() {
  const activeSection = document.querySelector('#tile-about-wrapper .skills-section.active');
  if (activeSection && activeSection.id === 'tile-about-2') {
    openSettingsPopup();
  } else {
    _origOpenAboutPopup();
  }
};

/* Init on load */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applySettings();
});