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
  if (btn) btn.textContent = isVisible ? t('cv_preview_long') : ('✕ ' + (appSettings.lang === 'fr' ? "Masquer l'aperçu" : appSettings.lang === 'en' ? 'Hide preview' : appSettings.lang === 'nl' ? 'Verbergen' : 'Ocultar'));
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
    if (btn) btn.textContent = t('cv_preview_long');
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
function switchProjTab(tabName, btn) {
  // Onglets
  document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  // Panneaux
  document.querySelectorAll('.proj-tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('proj-panel-' + tabName);
  if (panel) panel.classList.add('active');
}

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
  const animDisabled = !appSettings.anim;
  currentSection.classList.add('is-leaving', goRight ? 'slide-out-right' : 'slide-out-left');
  currentSection.classList.remove('active');
  if (animDisabled) {
    currentSection.classList.remove('is-leaving', 'slide-out-left', 'slide-out-right');
  } else {
    currentSection.addEventListener('animationend', () => {
      currentSection.classList.remove('is-leaving', 'slide-out-left', 'slide-out-right');
    }, { once: true });
  }
  targetSection.classList.add('active', goRight ? 'slide-in-left' : 'slide-in-right');
  if (animDisabled) {
    targetSection.classList.remove('slide-in-right', 'slide-in-left');
  } else {
    targetSection.addEventListener('animationend', () => {
      targetSection.classList.remove('slide-in-right', 'slide-in-left');
    }, { once: true });
  }
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
  setGhStatus('loading', t('gh_status_loading'));
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
    setGhStatus('', t('gh_status_active'));

  } catch (err) {
    console.warn('[GH tile]', err);
    setGhStatus('error', t('gh_status_error'));
    const g = document.getElementById('gh-contribution-graph');
    if (g) renderGraphFallback(g);
    const l = document.getElementById('gh-tile-repos-list');
    if (l) l.innerHTML = `<div style="font-family:'DM Mono',monospace;font-size:9px;color:#ff6b5e;letter-spacing:1px;padding:8px 0;">${t('gh_data_unavail')}</div>`;
  }
}

/* ══════════════════════════════════════════════════════════
   GRAPHIQUE — Proxy contributions (données réelles)
   ══════════════════════════════════════════════════════════ */
async function buildContributionGraph() {
  const graphEl = document.getElementById('gh-contribution-graph');
  if (!graphEl) return;

  graphEl.innerHTML = `<div class="gh-graph-loading">${t('gh_loading_contrib')}</div>`;

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
  const MONTHS = t('gh_months');

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
    span.textContent = MONTHS[m];
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
  t('gh_days').forEach((l, i) => {
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
        const dateFormatted = new Date(day.date + 'T12:00:00').toLocaleDateString(t('gh_locale'), {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        cell.title = day.count > 0
          ? `${day.count} contribution${day.count > 1 ? 's' : ''} · ${dateFormatted}`
          : `${t('gh_no_contrib')} · ${dateFormatted}`;
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
    <span class="gh-legend-label">${t('gh_less')}</span>
    <span class="gh-graph-cell"></span>
    <span class="gh-graph-cell l1"></span>
    <span class="gh-graph-cell l2"></span>
    <span class="gh-graph-cell l3"></span>
    <span class="gh-graph-cell l4"></span>
    <span class="gh-legend-label">${t('gh_more')}</span>`;
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
        const updated = new Date(r.updated_at).toLocaleDateString(t('gh_locale'), { day: 'numeric', month: 'short', year: 'numeric' });
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
  graphEl.innerHTML = `<div class="gh-graph-loading">${t('gh_loading_contrib')}</div>`;

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
    const contribLabelEl = totalEl ? totalEl.nextSibling : null;
    if (contribLabelEl && contribLabelEl.nodeType === 3) { /* text node handled by data-i18n */ }
  }

  if (commitsByDate && Object.keys(commitsByDate).length > 0) {
    const weeks = buildWeeksGrid(commitsByDate);
    renderGraphCells(graphEl, weeks);
  } else {
    renderGraphFallback(graphEl);
  }
}
/* ══════════════════════════════════════════════════════════
   I18N — Système de traduction
   ══════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  fr: {
    /* Navigation */
    nav_about:    'À PROPOS',
    nav_projects: 'PROJETS',
    nav_skills:   'COMPÉTENCES',
    nav_xp:       'EXPÉRIENCES',
    nav_design:   'GRAPHISME',
    nav_cv:       'CV',
    nav_contact:  'CONTACT',

    /* Tile headers */
    tile_about:    'À PROPOS DE MOI',
    tile_projects: 'MES PROJETS',
    tile_skills:   'COMPÉTENCES',
    tile_xp:       'EXPÉRIENCES',
    tile_cv:       'CURRICULUM VITAE',
    tile_contact:  'CONTACT',

    /* About tile */
    about_role:    'Développeur Web & Applicatif · 20 ans',
    about_bio:     "Passionné par la création de projets qui mélangent technique, créativité et univers qui m'animent — football, mangas, jeux vidéo.",
    tag_games:     '🎮 Jeux-vidéos',

    /* FM card */
    fm_now:          'EN CE MOMENT',
    fm_idle:         'INACTIF',
    fm_idle_sub:     "Rien en cours pour l'instant.<br>Repassez plus tard !",
    fm_profile:      'PROFIL',
    fm_age:          'Âge',
    fm_age_val:      '20 ans',
    fm_nat:          'Nationalité',
    fm_nat_val:      '🇫🇷 Français',
    fm_edu:          'Formation',
    fm_role:         'Poste',
    fm_role_val:     'Dév. Web & App',
    fm_missions:     'Missions',
    fm_missions_val: '3 réalisées',
    fm_status:       'Statut',
    fm_available:    'Disponible',

    /* Settings tile */
    settings_tile_title: 'PARAMÈTRES <span class="red">ACTIFS</span>',
    settings_tile_label: 'Vos paramètres actifs',
    settings_hint: 'Cliquez sur la flèche pour modifier',

    /* GitHub tile */
    gh_loading:       'CHARGEMENT',
    gh_contrib_label: 'CONTRIBUTIONS · 52 SEMAINES',
    gh_graph_loading: 'Chargement du graphique…',
    gh_recent_repos:  'REPOS RÉCENTS',

    /* Skills tile */
    skills_stack: 'Stack & Outils',
    skills_langs: 'Langues',
    soft_skills:  'SOFT SKILLS',
    ss_autonomy:     'Autonomie',
    ss_curiosity:    'Curiosité',
    ss_creativity:   'Créativité',
    ss_problem:      'Résolution de problèmes',
    ss_adaptability: 'Adaptabilité',
    ss_invest:       'Investissement',
    lang_pro:    'PROFESSIONNEL',
    lang_school: 'SCOLAIRE',
    lang_basics: 'NOTIONS',

    /* XP tile */
    xp_missions: 'Missions réalisées',
    xp1_co:    'Dév. Apps · Jan–Fév',
    xp2_co:    'CM & Dév · Mai–Juin',
    xp3_co:    'Graphiste · Été 2024',
    xp_dev:    '⌨ Développement',
    xp_design: '🎨 Graphisme',

    /* CV tile */
    cv_dl:      '↓ Télécharger PDF',
    cv_preview: '👁 Apercevoir',
    cv_format:  'Format PDF · A4',
    cv_updated: 'Mis à jour en 2026',
    cv_langs:   'FR · EN disponible',

    /* Contact tile */
    contact_cta: 'Travaillons<br>ensemble',

    /* Design tile */
    design_label: 'PORTFOLIO GRAPHISME',
    design_title: 'Projets<br>Graphiques',
    design_count: '13 créations · Photoshop',

    /* Footer tile */
    footer_sub: 'Portfolio · Développeur Web & Applicatif · Graphiste',

    /* Projects tile */
    proj_done:  'Projets réalisés',
    proj_techs: 'TECHNOS UTILISÉES',

    /* About popup */
    about_popup_title: 'À PROPOS DE MOI',
    about_popup_sub:   'Matthieu Doolaeghe · Développeur Web & Applicatif · 20 ans · France',
    stat_age:       'Ans',
    stat_projects:  'Projets',
    stat_xp:        'Expériences',
    stat_curiosity: 'Curiosité',
    about_intro:    'Présentation',
    about_passions: 'Passions',
    about_text1:    "Salut ! Moi c'est <strong style=\"color:var(--text)\">Matthieu Doolaeghe</strong>, j'ai 20 ans et je suis développeur passionné basé en France. Actuellement orienté développement web et applicatif, j'aime créer des projets qui mélangent technique, créativité et univers qui me passionnent — notamment le football, les mangas et les jeux vidéo.<br><br>Je développe principalement en HTML, CSS, JavaScript et PHP, mais j'explore aussi des technologies comme Flutter, C#, NodeJS, PostgreSQL et Docker. J'aime construire des applications complètes, du front-end jusqu'à la base de données, en passant par l'API et l'architecture backend.",
    about_text2:    "En dehors du code, je suis passionné par le football, le graphisme, les jeux vidéo et la musique. Ces univers influencent fortement mes projets et ma créativité.<br><br>Chaque projet est pour moi une opportunité d'apprendre, d'expérimenter et de repousser mes limites.<br><br>Actuellement <strong style=\"color:var(--green)\">disponible</strong> pour des missions freelance ou des opportunités en CDI.",

    /* Projects popup */
    proj_sub:   '9 projets réalisés · Web · Mobile · Desktop · Discord',
    proj_all:   'Tous les projets',
    proj_demo:  '↗ Démo',
    proj_psgdle: 'Jeu web quotidien de type Wordle sur le Paris Saint-Germain. Devinez le joueur du PSG chaque jour.',
    proj_jojodl: "Jeu web quotidien de type Wordle sur l'univers de JoJo's Bizarre Adventure. Devinez le personnage du jour.",
    proj_tbay:  "Marketplace e-commerce inspirée de One Piece. Panier, commande, authentification et panel admin inclus.",
    proj_wenp:  "Journal en ligne inspiré du journal de Big News Morgans dans One Piece.",
    proj_devi:  "Application Windows Forms C# pour rechercher et consulter les Fruits du Démon de One Piece, avec filtres et fiches détaillées.",
    proj_fm:    "Générateur aléatoire pour Football Manager. Découvrez votre prochain club à diriger selon le championnat souhaité.",
    proj_jojo:  "Collection de 7 bots Discord thématiques inspirés des Stands de JoJo's Bizarre Adventure.",
    proj_manga: "App Flutter de lecture manga multi-sources. Téléchargement hors-ligne, zoom, historique, stats et thèmes. Architecture Provider + web scraping.",
    proj_code:  "Site web pour encoder et décoder des messages facilement via différents algorithmes de chiffrement.",

    /* Skills popup */
    skills_sub:       'Langages · Frameworks · Outils · Technologies',
    skills_langs_tech:'Langages & Technologies',
    skills_cat1:      'Web & Frontend',
    skills_cat2:      'Backend, Mobile & Outils',

    /* Languages popup */
    langs_title:  'LANGUES',
    langs_sub:    'Langues parlées & niveaux',
    langs_levels: 'Niveaux linguistiques',
    lang_fr_level:'100% — Langue maternelle',
    lang_en_level:'70% — Niveau intermédiaire (B1/B2)',
    lang_es_level:'40% — Niveau scolaire (A2)',
    lang_nl_level:'10% — Notions de base',

    /* XP popup */
    xp_sub:     'Stages · Missions · Bénévolat',
    xp_section: 'Parcours',
    xp1_role:   "Développeur d'applications — Stage",
    xp2_role:   'Community Manager & Gestion Web — Stage',
    xp3_role:   'Graphiste Football',
    xp1_date:   'Jan — Fév',
    xp2_date:   'Mai — Juin',
    xp3_date:   'Été 2024',
    xp1_desc:   "Animal'And est une association d'aide animalière implantée dans le Nord de la France, dédiée à la protection et au bien-être des animaux. Durant ce stage, j'ai conçu et développé deux applications internes : une <strong style=\"color:var(--text)\">application de messagerie interne</strong> permettant aux membres de l'association de communiquer entre eux en temps réel, et une <strong style=\"color:var(--text)\">application boutique interne</strong> permettant aux membres d'acheter des produits et articles proposés par l'association. Ces deux projets m'ont permis de travailler sur la gestion d'authentification, les bases de données et le développement full-stack.",
    xp2_desc:   "Cadre Perso est une entreprise spécialisée dans la création de cadres de football personnalisés aux couleurs du club de son choix. Ma mission principale était la <strong style=\"color:var(--text)\">gestion des réseaux sociaux</strong> (community management) : création de contenu, planification de publications, animation de la communauté et suivi des statistiques. J'ai également participé à la <strong style=\"color:var(--text)\">gestion et à l'amélioration du site web</strong>, en proposant des optimisations UX/UI et en effectuant des mises à jour régulières pour améliorer l'expérience utilisateur et la visibilité en ligne.",
    xp3_desc:   "Paris Team est un média principalement présent sur Twitter (aujourd'hui X), comptant plus de 100 000 abonnés, dédié à l'actualité du Paris Saint-Germain. Ma mission consistait à <strong style=\"color:var(--text)\">créer des affiches et visuels graphiques</strong> sur le thème du PSG : compositions de matchs, annonces de transferts, mises en avant de joueurs. Cette expérience m'a permis d'affiner mes compétences en design graphique dans un environnement médiatique dynamique avec des contraintes de temps fortes.",

    /* CV popup */
    cv_title:       'MON CV',
    cv_sub:         'Curriculum Vitae · Matthieu Doolaeghe · 2026',
    cv_doc:         'Document',
    cv_dl_long:     '↓ Télécharger le CV (PDF)',
    cv_preview_long:'👁 Apercevoir le CV',
    cv_close:       '✕ FERMER',
    cv_date:        'PDF · Dernière mise à jour : 2026',

    /* Contact popup */
    contact_sub:   'Disponible pour missions freelance & opportunités',
    contact_links: 'Liens directs',
    contact_msg:   'Message rapide',
    contact_name:  'Votre nom',
    contact_email: 'Votre email',
    contact_msgph: 'Votre message...',
    contact_send:  '↗ Envoyer',
    contact_alert: 'Message envoyé !',

    /* Design popup */
    design_popup_title: 'PORTFOLIO GRAPHISME',
    design_sub:         'Créations Design · Football · Miniatures · Identités visuelles',
    design_exp:         'Expérience & Outils',
    design_tag_mini:    '🎨 Miniatures YouTube/Réseaux',
    design_trust:       "Ils m'ont fait confiance",
    design_gallery:     'Galerie — Toutes les créations',

    /* Footer/Story popup */
    footer_breadcrumb: "L'histoire",
    story_title: "⚽ L'HISTOIRE DERRIÈRE",
    story_sub:   'Comment Football Manager 2026 a inspiré ce portfolio',

    /* GitHub popup */
    gh_popup_title:    'GITHUB ACTIVITY',
    gh_profile:        'Profil',
    gh_view_profile:   '↗ Voir le profil GitHub',
    gh_contrib_section:'Contributions — 52 dernières semaines',
    gh_repos:          'Repositories',
    gh_langs_used:     'Langages utilisés',
    gh_contrib_total:  'contributions cette année',
    gh_updated:        'Mis à jour',
    gh_no_contrib:     'Aucune contribution',

    /* Settings popup */
    settings_title:       'Paramètres',
    settings_title_upper: 'PARAMÈTRES',
    settings_sub:         'Personnalisez votre expérience · Les réglages sont sauvegardés',
    settings_lang:        'Langue',
    settings_color1:      'Couleur principale',
    settings_color2:      'Couleur secondaire',
    settings_size:        'Taille du texte',
    settings_theme:       'Thème',
    settings_anim:        'Animations',
    settings_anim_toggle: 'Activer les animations de transitions',
    settings_hover_toggle:'Effets au survol des tuiles',
    settings_reset:       '↺ Réinitialiser',

    /* Settings tile display keys */
    st_lang:   'Langue',
    st_main:   'Principale',
    st_second: 'Secondaire',
    st_text:   'Texte',
    st_theme:  'Thème',
    st_anim:   'Animations',
    st_hover:  'Survol',
    st_on:     'Activées',
    st_off:    'Désactivées',
    st_on2:    'Activé',
    st_off2:   'Désactivé',

    /* GitHub graph */
    gh_months: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
    gh_days:   ['', 'Lun', '', 'Mer', '', 'Ven', ''],
    gh_less:   'Moins',
    gh_more:   'Plus',
    gh_locale: 'fr-FR',
    gh_status_active: 'ACTIF',
    gh_status_error:  'ERREUR API',
    gh_status_loading:'CHARGEMENT',
    gh_loading_contrib:'Chargement des contributions…',
    gh_data_unavail:  'Données indisponibles.',
    story_body: `<p>Pour mon portfolio, je ne voulais pas juste faire un site pour <em>"cocher la case"</em>.</p>
        <p>Je voulais créer quelque chose d'original. Quelque chose qui me ressemble vraiment, autour d'un univers que j'aime.</p>
        <p>Franchement, je suis passé par plein d'idées… Des concepts trop classiques, d'autres beaucoup trop ambitieux, certains carrément bancals. À chaque fois, il manquait un truc. Ça faisait <em>"projet"</em>, mais pas <em>"moi"</em>.</p>
        <div class="footer-story-divider"></div>
        <p class="footer-story-highlight">Et puis l'idée est venue presque par hasard.</p>
        <p>C'était pendant une carrière en ligne sur <strong style="color:var(--red)">Football Manager 2026</strong>, en Ligue 1, avec des potes. On était à fond dedans : mercato, tactiques, analyses des stats, petits chambrages sur Discord… Le genre de soirée qui finit beaucoup trop tard.</p>
        <p>À un moment, je me retrouve devant le tableau de bord du jeu.</p>
        <div class="footer-story-quote"><span>Minimaliste. Propre. Structuré.</span><span>Mais derrière cette interface sobre, une quantité énorme d'informations.</span></div>
        <p>Et là, ça a fait <strong style="color:var(--accent-light)">tilt</strong>.</p>
        <p>Je me suis dit : pourquoi ne pas faire un portfolio comme ça ? Un tableau de bord simple en apparence. Quelque chose de clair, presque discret au premier regard. Mais quand on explore, on découvre beaucoup plus : mes projets, mes compétences, mon évolution, mes choix techniques…</p>
        <div class="footer-story-divider"></div>
        <p>Ce n'est pas juste un site vitrine.</p>
        <p class="footer-story-highlight">C'est un mélange entre ma passion pour le foot et mon parcours de développeur.</p>
        <p style="color:var(--muted);font-size:12px;margin-top:18px;font-family:'DM Mono',monospace;letter-spacing:1px;">UN PORTFOLIO QUI SE PARCOURT COMME UNE CARRIÈRE.</p>`,

    /* Tile inline labels */
    skills_web:   'WEB & BACKEND',
    skills_mobile:'MOBILE & OUTILS',
    about_role_text: 'Développeur Web & Applicatif · 20 ans',
    footer_sub_text: 'Portfolio · Développeur Web & Applicatif · Graphiste',

    /* About popup */
    about_popup_subtitle: 'Matthieu Doolaeghe · Développeur Web & Applicatif · 20 ans · France',

    /* Projects popup */
    proj_popup_sub: 'Projets personnels · Stage · Scolaire',
    proj_internship_title: 'Projets réalisés en stage',
    proj_ap_title: 'Projet AP 2025-2026 — BTS SIO',
    proj_screenshots: 'Captures d\'écran',

    /* Skills popup */
    skills_langs_tech_title: 'Langages & Technologies',
    skills_web_label: 'WEB & BACKEND',
    skills_mobile_label: 'MOBILE & OUTILS',
    skills_cert_label: 'CERTIFICATIONS',

    /* BTS SIO */
    bts_title: 'Compétences BTS SIO — SLAM',
    bts_b1_title: 'Support & mise à disposition',
    bts_b1_sub:   'Services informatiques',
    bts_b1_1: 'Gérer le patrimoine informatique',
    bts_b1_2: 'Répondre aux incidents & demandes',
    bts_b1_3: 'Développer la présence en ligne',
    bts_b1_4: 'Travailler en mode projet',
    bts_b1_5: 'Mettre à disposition un service informatique',
    bts_b1_6: 'Organiser son développement professionnel',
    bts_b2_title: 'Conception & développement',
    bts_b2_sub:   'Applications — SLAM',
    bts_b2_1: 'Concevoir & développer une solution applicative',
    bts_b2_2: 'Assurer la maintenance corrective ou évolutive',
    bts_b2_3: 'Gérer les données (BDD, SQL, modélisation)',
    bts_b3_title: 'Cybersécurité',
    bts_b3_sub:   'Services informatiques',
    bts_b3_1: 'Protéger les données à caractère personnel',
    bts_b3_2: 'Préserver l\'identité numérique',
    bts_b3_3: 'Sécuriser les équipements & usages',
    bts_b3_4: 'Garantir disponibilité, intégrité & confidentialité',
    bts_b3_5: 'Cybersécurité d\'une solution applicative',

    /* Languages popup */
    langs_popup_sub: 'Langues parlées & niveaux',

    /* CV tile */
    cv_format_text:  'Format PDF · A4',
    cv_updated_text: 'Mis à jour en 2026',
    cv_langs_text:   'FR · EN disponible',
    cv_popup_role:   'Développeur Web & Applicatif · 20 ans · France',

    /* Contact popup */
    contact_popup_sub: 'Disponible pour missions freelance & opportunités',

    /* GitHub popup */
    gh_popup_sub: 'ItsMattrijk · github.com/ItsMattrijk · Activité publique',
    gh_contrib_total_label: 'contributions cette année',

    /* Design popup */
    design_exp_title: 'Expérience & Outils',

    /* COLOR/SIZE/THEME labels */
    color_blue:   'Bleu (défaut)',
    color_red:    'Rouge',
    color_green:  'Vert',
    color_purple: 'Violet',
    color_orange: 'Orange',
    color_cyan:   'Cyan',
    color_custom: 'Personnalisé',
    size_medium:  'Basique · 15px',
    size_large:   'Grand · 17px',
    size_xlarge:  'Plus Grand · 19px',
    theme_dark:   'Sombre',
    theme_darker: 'Très sombre',
    theme_dim:    'Tamisé',
  },

  en: {
    nav_about:    'ABOUT',
    nav_projects: 'PROJECTS',
    nav_skills:   'SKILLS',
    nav_xp:       'EXPERIENCE',
    nav_design:   'DESIGN',
    nav_cv:       'RESUME',
    nav_contact:  'CONTACT',

    tile_about:    'ABOUT ME',
    tile_projects: 'MY PROJECTS',
    tile_skills:   'SKILLS',
    tile_xp:       'EXPERIENCE',
    tile_cv:       'CURRICULUM VITAE',
    tile_contact:  'CONTACT',

    about_role:    'Web & App Developer · 20 y/o',
    about_bio:     'Passionate about building projects that blend technical skills, creativity, and the worlds I love — football, manga, video games.',
    tag_games:     '🎮 Video Games',

    fm_now:          'RIGHT NOW',
    fm_idle:         'INACTIVE',
    fm_idle_sub:     'Nothing going on right now.<br>Check back later!',
    fm_profile:      'PROFILE',
    fm_age:          'Age',
    fm_age_val:      '20 y/o',
    fm_nat:          'Nationality',
    fm_nat_val:      '🇫🇷 French',
    fm_edu:          'Education',
    fm_role:         'Role',
    fm_role_val:     'Web & App Dev',
    fm_missions:     'Missions',
    fm_missions_val: '3 completed',
    fm_status:       'Status',
    fm_available:    'Available',

    settings_tile_title: 'ACTIVE <span class="red">SETTINGS</span>',
    settings_tile_label: 'Your active settings',
    settings_hint: 'Click the arrow to edit settings',

    gh_loading:       'LOADING',
    gh_contrib_label: 'CONTRIBUTIONS · 52 WEEKS',
    gh_graph_loading: 'Loading graph…',
    gh_recent_repos:  'RECENT REPOS',

    skills_stack: 'Stack & Tools',
    skills_langs: 'Languages',
    soft_skills:  'SOFT SKILLS',
    ss_autonomy:     'Autonomy',
    ss_curiosity:    'Curiosity',
    ss_creativity:   'Creativity',
    ss_problem:      'Problem Solving',
    ss_adaptability: 'Adaptability',
    ss_invest:       'Dedication',
    lang_pro:    'PROFESSIONAL',
    lang_school: 'ACADEMIC',
    lang_basics: 'BASICS',

    xp_missions: 'Completed Missions',
    xp1_co:    'App Dev · Jan–Feb',
    xp2_co:    'SM & Dev · May–Jun',
    xp3_co:    'Designer · Summer 2024',
    xp_dev:    '⌨ Development',
    xp_design: '🎨 Design',

    cv_dl:      '↓ Download PDF',
    cv_preview: '👁 Preview',
    cv_format:  'PDF Format · A4',
    cv_updated: 'Updated in 2026',
    cv_langs:   'FR · EN available',

    contact_cta: "Let's work<br>together",

    design_label: 'DESIGN PORTFOLIO',
    design_title: 'Graphic<br>Projects',
    design_count: '13 creations · Photoshop',

    footer_sub: 'Portfolio · Web & App Developer · Graphic Designer',

    proj_done:  'Completed Projects',
    proj_techs: 'TECHNOLOGIES USED',

    about_popup_title: 'ABOUT ME',
    about_popup_sub:   'Matthieu Doolaeghe · Web & App Developer · 20 y/o · France',
    stat_age:       'Years',
    stat_projects:  'Projects',
    stat_xp:        'Experiences',
    stat_curiosity: 'Curiosity',
    about_intro:    'Introduction',
    about_passions: 'Passions',
    about_text1:    "Hey! I'm <strong style=\"color:var(--text)\">Matthieu Doolaeghe</strong>, a 20-year-old passionate developer based in France. Focused on web and application development, I love building projects that blend technical skills, creativity, and the worlds I'm passionate about — especially football, manga, and video games.<br><br>I mainly work with HTML, CSS, JavaScript and PHP, but I also explore technologies like Flutter, C#, NodeJS, PostgreSQL, and Docker. I enjoy building full-stack applications, from the front-end all the way to the database, including the API and backend architecture.",
    about_text2:    "Outside of coding, I'm passionate about football, graphic design, video games, and music. These worlds strongly influence my projects and creativity.<br><br>Every project is an opportunity for me to learn, experiment, and push my limits.<br><br>Currently <strong style=\"color:var(--green)\">available</strong> for freelance missions or full-time opportunities.",

    proj_sub:   '9 completed projects · Web · Mobile · Desktop · Discord',
    proj_all:   'All Projects',
    proj_demo:  '↗ Demo',
    proj_psgdle: 'A daily Wordle-style web game about Paris Saint-Germain. Guess the PSG player each day.',
    proj_jojodl: "A daily Wordle-style web game set in the JoJo's Bizarre Adventure universe. Guess the character of the day.",
    proj_tbay:  "A One Piece-inspired e-commerce marketplace. Includes shopping cart, orders, authentication, and admin panel.",
    proj_wenp:  "An online newspaper inspired by Big News Morgans' journal from One Piece.",
    proj_devi:  "A C# Windows Forms app to search and browse One Piece Devil Fruits, with filters and detailed info sheets.",
    proj_fm:    "A random club picker for Football Manager. Discover your next club to manage by choosing the desired league.",
    proj_jojo:  "A collection of 7 themed Discord bots inspired by the Stands from JoJo's Bizarre Adventure.",
    proj_manga: "A multi-source Flutter manga reading app. Offline download, zoom, history, stats, and themes. Provider architecture + web scraping.",
    proj_code:  "A web tool to easily encode and decode messages using various encryption algorithms.",

    skills_sub:       'Languages · Frameworks · Tools · Technologies',
    skills_langs_tech:'Languages & Technologies',
    skills_cat1:      'Web & Frontend',
    skills_cat2:      'Backend, Mobile & Tools',

    langs_title:  'LANGUAGES',
    langs_sub:    'Spoken languages & levels',
    langs_levels: 'Language levels',
    lang_fr_level:'100% — Native language',
    lang_en_level:'70% — Intermediate level (B1/B2)',
    lang_es_level:'40% — Academic level (A2)',
    lang_nl_level:'10% — Basic notions',

    xp_sub:     'Internships · Missions · Volunteering',
    xp_section: 'Background',
    xp1_role:   'Application Developer — Internship',
    xp2_role:   'Community Manager & Web Management — Internship',
    xp3_role:   'Football Graphic Designer',
    xp1_date:   'Jan — Feb',
    xp2_date:   'May — Jun',
    xp3_date:   'Summer 2024',
    xp1_desc:   "Animal'And is an animal welfare association based in Northern France, dedicated to protecting and caring for animals. During this internship, I designed and developed two internal applications: an <strong style=\"color:var(--text)\">internal messaging app</strong> allowing association members to communicate in real time, and an <strong style=\"color:var(--text)\">internal shop app</strong> enabling members to purchase products and goods offered by the association. Both projects helped me work on authentication management, databases, and full-stack development.",
    xp2_desc:   "Cadre Perso is a company specialized in creating personalized football frames in the colors of your chosen club. My main mission was <strong style=\"color:var(--text)\">social media management</strong>: content creation, post scheduling, community engagement, and stats tracking. I also participated in <strong style=\"color:var(--text)\">managing and improving the website</strong>, proposing UX/UI optimizations and making regular updates to enhance the user experience and online visibility.",
    xp3_desc:   "Paris Team is a media outlet primarily on Twitter (now X), with over 100,000 followers, dedicated to Paris Saint-Germain news. My mission was to <strong style=\"color:var(--text)\">create posters and graphic visuals</strong> on PSG themes: match lineups, transfer announcements, and player highlights. This experience helped me sharpen my graphic design skills in a fast-paced media environment with tight deadlines.",

    cv_title:       'MY RESUME',
    cv_sub:         'Curriculum Vitae · Matthieu Doolaeghe · 2026',
    cv_doc:         'Document',
    cv_dl_long:     '↓ Download Resume (PDF)',
    cv_preview_long:'👁 Preview Resume',
    cv_close:       '✕ CLOSE',
    cv_date:        'PDF · Last updated: 2026',

    contact_sub:   'Available for freelance missions & opportunities',
    contact_links: 'Direct links',
    contact_msg:   'Quick message',
    contact_name:  'Your name',
    contact_email: 'Your email',
    contact_msgph: 'Your message...',
    contact_send:  '↗ Send',
    contact_alert: 'Message sent!',

    design_popup_title: 'DESIGN PORTFOLIO',
    design_sub:         'Design Creations · Football · Thumbnails · Visual Identities',
    design_exp:         'Experience & Tools',
    design_tag_mini:    '🎨 YouTube/Social Thumbnails',
    design_trust:       'They trusted me',
    design_gallery:     'Gallery — All Creations',

    footer_breadcrumb: 'The Story',
    story_title: '⚽ THE STORY BEHIND',
    story_sub:   'How Football Manager 2026 inspired this portfolio',

    gh_popup_title:    'GITHUB ACTIVITY',
    gh_profile:        'Profile',
    gh_view_profile:   '↗ View GitHub Profile',
    gh_contrib_section:'Contributions — Last 52 weeks',
    gh_repos:          'Repositories',
    gh_langs_used:     'Languages used',
    gh_contrib_total:  'contributions this year',
    gh_updated:        'Updated',
    gh_no_contrib:     'No contributions',

    settings_title:       'Settings',
    settings_title_upper: 'SETTINGS',
    settings_sub:         'Customize your experience · Settings are saved',
    settings_lang:        'Language',
    settings_color1:      'Primary Color',
    settings_color2:      'Secondary Color',
    settings_size:        'Text Size',
    settings_theme:       'Theme',
    settings_anim:        'Animations',
    settings_anim_toggle: 'Enable transition animations',
    settings_hover_toggle:'Tile hover effects',
    settings_reset:       '↺ Reset',

    st_lang:   'Language',
    st_main:   'Primary',
    st_second: 'Secondary',
    st_text:   'Text',
    st_theme:  'Theme',
    st_anim:   'Animations',
    st_hover:  'Hover',
    st_on:     'Enabled',
    st_off:    'Disabled',
    st_on2:    'Enabled',
    st_off2:   'Disabled',

    gh_months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    gh_days:   ['', 'Mon', '', 'Wed', '', 'Fri', ''],
    gh_less:   'Less',
    gh_more:   'More',
    gh_locale: 'en-US',
    gh_status_active: 'ACTIVE',
    gh_status_error:  'API ERROR',
    gh_status_loading:'LOADING',
    gh_loading_contrib:'Loading contributions…',
    gh_data_unavail:  'Data unavailable.',
    story_body: `<p>For my portfolio, I didn't just want to build a site to <em>"check the box"</em>.</p>
        <p>I wanted to create something original. Something that truly represents me, built around a world I love.</p>
        <p>Honestly, I went through a lot of ideas… Concepts too generic, others way too ambitious, some just plain wonky. Every time, something was missing. It felt like a <em>"project"</em>, but not like <em>"me"</em>.</p>
        <div class="footer-story-divider"></div>
        <p class="footer-story-highlight">And then the idea came almost by accident.</p>
        <p>It was during an online career on <strong style="color:var(--red)">Football Manager 2026</strong>, in Ligue 1, with some friends. We were fully into it: transfers, tactics, stat breakdowns, friendly trash-talk on Discord… The kind of evening that goes way too late.</p>
        <p>At some point, I found myself staring at the game's dashboard.</p>
        <div class="footer-story-quote"><span>Minimalist. Clean. Structured.</span><span>But behind this understated interface, a huge amount of information.</span></div>
        <p>And that's when it <strong style="color:var(--accent-light)">clicked</strong>.</p>
        <p>I thought: why not build a portfolio like that? A dashboard simple on the surface. Something clean, almost understated at first glance. But when you explore, you discover much more: my projects, my skills, my journey, my technical choices…</p>
        <div class="footer-story-divider"></div>
        <p>This isn't just a showcase website.</p>
        <p class="footer-story-highlight">It's a blend of my passion for football and my developer journey.</p>
        <p style="color:var(--muted);font-size:12px;margin-top:18px;font-family:'DM Mono',monospace;letter-spacing:1px;">A PORTFOLIO EXPLORED LIKE A CAREER.</p>`,

    /* Tile inline labels */
    skills_web:   'WEB & BACKEND',
    skills_mobile:'MOBILE & TOOLS',
    about_role_text: 'Web & App Developer · 20 y/o',
    footer_sub_text: 'Portfolio · Web & App Developer · Graphic Designer',

    /* About popup */
    about_popup_subtitle: 'Matthieu Doolaeghe · Web & App Developer · 20 y/o · France',

    /* Projects popup */
    proj_popup_sub: 'Personal Projects · Internship · Academic',
    proj_internship_title: 'Internship Projects',
    proj_ap_title: 'AP Project 2025-2026 — BTS SIO',
    proj_screenshots: 'Screenshots',

    /* Skills popup */
    skills_langs_tech_title: 'Languages & Technologies',
    skills_web_label: 'WEB & BACKEND',
    skills_mobile_label: 'MOBILE & TOOLS',
    skills_cert_label: 'CERTIFICATIONS',

    /* BTS SIO */
    bts_title: 'BTS SIO Skills — SLAM',
    bts_b1_title: 'Support & Deployment',
    bts_b1_sub:   'IT Services',
    bts_b1_1: 'Manage IT assets',
    bts_b1_2: 'Respond to incidents & requests',
    bts_b1_3: 'Develop online presence',
    bts_b1_4: 'Work in project mode',
    bts_b1_5: 'Deploy an IT service',
    bts_b1_6: 'Organize professional development',
    bts_b2_title: 'Design & Development',
    bts_b2_sub:   'Applications — SLAM',
    bts_b2_1: 'Design & develop an application',
    bts_b2_2: 'Ensure corrective or adaptive maintenance',
    bts_b2_3: 'Manage data (DB, SQL, modeling)',
    bts_b3_title: 'Cybersecurity',
    bts_b3_sub:   'IT Services',
    bts_b3_1: 'Protect personal data',
    bts_b3_2: 'Preserve digital identity',
    bts_b3_3: 'Secure equipment & usage',
    bts_b3_4: 'Ensure availability, integrity & confidentiality',
    bts_b3_5: 'Cybersecurity of an application',

    /* Languages popup */
    langs_popup_sub: 'Spoken languages & levels',

    /* CV tile */
    cv_format_text:  'PDF Format · A4',
    cv_updated_text: 'Updated in 2026',
    cv_langs_text:   'FR · EN available',
    cv_popup_role:   'Web & App Developer · 20 y/o · France',

    /* Contact popup */
    contact_popup_sub: 'Available for freelance missions & opportunities',

    /* GitHub popup */
    gh_popup_sub: 'ItsMattrijk · github.com/ItsMattrijk · Public activity',
    gh_contrib_total_label: 'contributions this year',

    /* Design popup */
    design_exp_title: 'Experience & Tools',

    color_blue:   'Blue (default)',
    color_red:    'Red',
    color_green:  'Green',
    color_purple: 'Purple',
    color_orange: 'Orange',
    color_cyan:   'Cyan',
    color_custom: 'Custom',
    size_medium:  'Basic · 15px',
    size_large:   'Large · 17px',
    size_xlarge:  'Extra Large · 19px',
    theme_dark:   'Dark',
    theme_darker: 'Very Dark',
    theme_dim:    'Dim',
  },

  nl: {
    nav_about:    'OVER MIJ',
    nav_projects: 'PROJECTEN',
    nav_skills:   'VAARDIGHEDEN',
    nav_xp:       'ERVARINGEN',
    nav_design:   'DESIGN',
    nav_cv:       'CV',
    nav_contact:  'CONTACT',

    tile_about:    'OVER MIJ',
    tile_projects: 'MIJN PROJECTEN',
    tile_skills:   'VAARDIGHEDEN',
    tile_xp:       'ERVARINGEN',
    tile_cv:       'CURRICULUM VITAE',
    tile_contact:  'CONTACT',

    about_role:    'Web- & App-ontwikkelaar · 20 jaar',
    about_bio:     'Gepassioneerd door het bouwen van projecten die techniek, creativiteit en mijn interesses combineren — voetbal, manga, videogames.',
    tag_games:     '🎮 Videogames',

    fm_now:          'OP DIT MOMENT',
    fm_idle:         'INACTIEF',
    fm_idle_sub:     'Niets gaande op dit moment.<br>Kom later terug!',
    fm_profile:      'PROFIEL',
    fm_age:          'Leeftijd',
    fm_age_val:      '20 jaar',
    fm_nat:          'Nationaliteit',
    fm_nat_val:      '🇫🇷 Frans',
    fm_edu:          'Opleiding',
    fm_role:         'Functie',
    fm_role_val:     'Web & App Dev',
    fm_missions:     'Missies',
    fm_missions_val: '3 voltooid',
    fm_status:       'Status',
    fm_available:    'Beschikbaar',

    settings_tile_title: 'ACTIEVE <span class="red">INSTELLINGEN</span>',
    settings_tile_label: 'Uw actieve instellingen',
    settings_hint: 'Klik op de pijl om instellingen te wijzigen',

    gh_loading:       'LADEN',
    gh_contrib_label: 'BIJDRAGEN · 52 WEKEN',
    gh_graph_loading: 'Grafiek laden…',
    gh_recent_repos:  'RECENTE REPOS',

    skills_stack: 'Stack & Tools',
    skills_langs: 'Talen',
    soft_skills:  'SOFT SKILLS',
    ss_autonomy:     'Autonomie',
    ss_curiosity:    'Nieuwsgierigheid',
    ss_creativity:   'Creativiteit',
    ss_problem:      'Probleemoplossing',
    ss_adaptability: 'Aanpassingsvermogen',
    ss_invest:       'Toewijding',
    lang_pro:    'PROFESSIONEEL',
    lang_school: 'SCHOOL',
    lang_basics: 'BASIS',

    xp_missions: 'Voltooide missies',
    xp1_co:    'App-ontwikkeling · Jan–Feb',
    xp2_co:    'CM & Dev · Mei–Jun',
    xp3_co:    'Designer · Zomer 2024',
    xp_dev:    '⌨ Ontwikkeling',
    xp_design: '🎨 Design',

    cv_dl:      '↓ PDF downloaden',
    cv_preview: '👁 Bekijken',
    cv_format:  'PDF-formaat · A4',
    cv_updated: 'Bijgewerkt in 2026',
    cv_langs:   'FR · EN beschikbaar',

    contact_cta: 'Laten we<br>samenwerken',

    design_label: 'DESIGN PORTFOLIO',
    design_title: 'Grafische<br>Projecten',
    design_count: '13 creaties · Photoshop',

    footer_sub: 'Portfolio · Web- & App-ontwikkelaar · Grafisch ontwerper',

    proj_done:  'Voltooide projecten',
    proj_techs: 'GEBRUIKTE TECHNOLOGIEËN',

    about_popup_title: 'OVER MIJ',
    about_popup_sub:   'Matthieu Doolaeghe · Web- & App-ontwikkelaar · 20 jaar · Frankrijk',
    stat_age:       'Jaar',
    stat_projects:  'Projecten',
    stat_xp:        'Ervaringen',
    stat_curiosity: 'Nieuwsgierigheid',
    about_intro:    'Introductie',
    about_passions: 'Passies',
    about_text1:    "Hé! Ik ben <strong style=\"color:var(--text)\">Matthieu Doolaeghe</strong>, een 20-jarige gepassioneerde ontwikkelaar uit Frankrijk. Ik focus mij op web- en app-ontwikkeling en hou van projecten die techniek, creativiteit en mijn passies combineren — voetbal, manga en videogames.<br><br>Ik werk voornamelijk met HTML, CSS, JavaScript en PHP, maar verken ook Flutter, C#, NodeJS, PostgreSQL en Docker. Ik bouw graag complete applicaties, van front-end tot database.",
    about_text2:    "Buiten het coderen ben ik gepassioneerd door voetbal, grafisch ontwerp, videogames en muziek.<br><br>Elk project is een kans om te leren, te experimenteren en mijn grenzen te verleggen.<br><br>Momenteel <strong style=\"color:var(--green)\">beschikbaar</strong> voor freelance opdrachten of vaste functies.",

    proj_sub:   '9 voltooide projecten · Web · Mobile · Desktop · Discord',
    proj_all:   'Alle projecten',
    proj_demo:  '↗ Demo',
    proj_psgdle: 'Een dagelijks Wordle-spel over Paris Saint-Germain. Raad de PSG-speler van de dag.',
    proj_jojodl: "Een dagelijks Wordle-spel in het universum van JoJo's Bizarre Adventure. Raad het personage van de dag.",
    proj_tbay:  "Een One Piece-geïnspireerde e-commerce marktplaats met winkelwagen, bestellingen, authenticatie en beheerpaneel.",
    proj_wenp:  "Een online krant geïnspireerd op het dagblad van Big News Morgans uit One Piece.",
    proj_devi:  "Een C# Windows Forms app om One Piece Duivelsvruchten te zoeken en te bekijken, met filters en gedetailleerde fiches.",
    proj_fm:    "Een willekeurige clubkiezer voor Football Manager. Ontdek je volgende club op basis van het gewenste kampioenschap.",
    proj_jojo:  "Een collectie van 7 thematische Discord-bots geïnspireerd op de Stands uit JoJo's Bizarre Adventure.",
    proj_manga: "Een multi-source Flutter manga-leesapp. Offline download, zoom, geschiedenis, statistieken en thema's. Provider-architectuur + web scraping.",
    proj_code:  "Een webtool om berichten eenvoudig te versleutelen en ontsleutelen via verschillende algoritmen.",

    skills_sub:       'Talen · Frameworks · Tools · Technologieën',
    skills_langs_tech:'Talen & Technologieën',
    skills_cat1:      'Web & Frontend',
    skills_cat2:      'Backend, Mobiel & Tools',

    langs_title:  'TALEN',
    langs_sub:    'Gesproken talen & niveaus',
    langs_levels: 'Taalniveaus',
    lang_fr_level:'100% — Moedertaal',
    lang_en_level:'70% — Gemiddeld niveau (B1/B2)',
    lang_es_level:'40% — Schoolniveau (A2)',
    lang_nl_level:'10% — Basiskennis',

    xp_sub:     'Stages · Missies · Vrijwilligerswerk',
    xp_section: 'Achtergrond',
    xp1_role:   'App-ontwikkelaar — Stage',
    xp2_role:   'Community Manager & Webbeheer — Stage',
    xp3_role:   'Voetbal Grafisch Ontwerper',
    xp1_date:   'Jan — Feb',
    xp2_date:   'Mei — Jun',
    xp3_date:   'Zomer 2024',
    xp1_desc:   "Animal'And is een dierenwelzijnsvereniging in Noord-Frankrijk. Tijdens deze stage ontwikkelde ik twee interne applicaties: een <strong style=\"color:var(--text)\">interne berichtenapp</strong> voor realtime communicatie en een <strong style=\"color:var(--text)\">interne winkelapp</strong> voor leden.",
    xp2_desc:   "Cadre Perso is gespecialiseerd in gepersonaliseerde voetballijsten. Mijn taak was <strong style=\"color:var(--text)\">social media management</strong>: contentcreatie, publicatieplanning en statistieken. Ik werkte ook aan <strong style=\"color:var(--text)\">websiteverbetering</strong>.",
    xp3_desc:   "Paris Team is een PSG-medium op Twitter/X met meer dan 100.000 volgers. Ik maakte <strong style=\"color:var(--text)\">wedstrijdposters en grafische visuals</strong> over transfers en spelers.",

    cv_title:       'MIJN CV',
    cv_sub:         'Curriculum Vitae · Matthieu Doolaeghe · 2026',
    cv_doc:         'Document',
    cv_dl_long:     '↓ CV downloaden (PDF)',
    cv_preview_long:'👁 CV bekijken',
    cv_close:       '✕ SLUITEN',
    cv_date:        'PDF · Laatst bijgewerkt: 2026',

    contact_sub:   'Beschikbaar voor freelance opdrachten & kansen',
    contact_links: 'Directe links',
    contact_msg:   'Snel bericht',
    contact_name:  'Uw naam',
    contact_email: 'Uw e-mail',
    contact_msgph: 'Uw bericht...',
    contact_send:  '↗ Verzenden',
    contact_alert: 'Bericht verzonden!',

    design_popup_title: 'DESIGN PORTFOLIO',
    design_sub:         'Design creaties · Voetbal · Miniaturen · Visuele identiteiten',
    design_exp:         'Ervaring & Tools',
    design_tag_mini:    '🎨 YouTube/Social miniaturen',
    design_trust:       'Ze vertrouwden mij',
    design_gallery:     'Galerij — Alle creaties',

    footer_breadcrumb: 'Het Verhaal',
    story_title: '⚽ HET VERHAAL ERACHTER',
    story_sub:   'Hoe Football Manager 2026 dit portfolio inspireerde',

    gh_popup_title:    'GITHUB ACTIVITEIT',
    gh_profile:        'Profiel',
    gh_view_profile:   '↗ GitHub-profiel bekijken',
    gh_contrib_section:'Bijdragen — Laatste 52 weken',
    gh_repos:          'Repositories',
    gh_langs_used:     'Gebruikte talen',
    gh_contrib_total:  'bijdragen dit jaar',
    gh_updated:        'Bijgewerkt',
    gh_no_contrib:     'Geen bijdragen',

    settings_title:       'Instellingen',
    settings_title_upper: 'INSTELLINGEN',
    settings_sub:         'Pas uw ervaring aan · Instellingen worden opgeslagen',
    settings_lang:        'Taal',
    settings_color1:      'Primaire kleur',
    settings_color2:      'Secundaire kleur',
    settings_size:        'Tekstgrootte',
    settings_theme:       'Thema',
    settings_anim:        'Animaties',
    settings_anim_toggle: 'Overgangsanimaties inschakelen',
    settings_hover_toggle:'Hover-effecten op tegels',
    settings_reset:       '↺ Opnieuw instellen',

    st_lang:   'Taal',
    st_main:   'Primair',
    st_second: 'Secundair',
    st_text:   'Tekst',
    st_theme:  'Thema',
    st_anim:   'Animaties',
    st_hover:  'Hover',
    st_on:     'Ingeschakeld',
    st_off:    'Uitgeschakeld',
    st_on2:    'Ingeschakeld',
    st_off2:   'Uitgeschakeld',

    gh_months: ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
    gh_days:   ['', 'Ma', '', 'Wo', '', 'Vr', ''],
    gh_less:   'Minder',
    gh_more:   'Meer',
    gh_locale: 'nl-NL',
    gh_status_active: 'ACTIEF',
    gh_status_error:  'API FOUT',
    gh_status_loading:'LADEN',
    gh_loading_contrib:'Bijdragen laden…',
    gh_data_unavail:  'Gegevens niet beschikbaar.',
    story_body: `<p>Voor mijn portfolio wilde ik niet zomaar een site maken om <em>"het vakje aan te vinken"</em>.</p>
        <p>Ik wilde iets origineels creëren. Iets dat echt bij mij past, rond een wereld die ik liefheb.</p>
        <p>Eerlijk gezegd ben ik door veel ideeën gegaan… Sommige te gewoon, andere veel te ambitieus. Elke keer ontbrak er iets. Het voelde als een <em>"project"</em>, maar niet als <em>"ik"</em>.</p>
        <div class="footer-story-divider"></div>
        <p class="footer-story-highlight">En toen kwam het idee bijna per ongeluk.</p>
        <p>Het was tijdens een online carrière op <strong style="color:var(--red)">Football Manager 2026</strong>, in Ligue 1, met vrienden. We waren er helemaal in: transfers, tactiek, statistieken, grappige discussies op Discord… Het soort avond dat veel te laat eindigt.</p>
        <p>Op een gegeven moment keek ik naar het dashboard van het spel.</p>
        <div class="footer-story-quote"><span>Minimalistisch. Strak. Gestructureerd.</span><span>Maar achter deze sobere interface, een enorme hoeveelheid informatie.</span></div>
        <p>En toen <strong style="color:var(--accent-light)">klikte</strong> het.</p>
        <p>Ik dacht: waarom geen portfolio als dit maken? Een eenvoudig dashboard aan de oppervlakte. Iets overzichtelijks, bijna onopvallend op het eerste gezicht. Maar als je verder kijkt, ontdek je veel meer: mijn projecten, mijn vaardigheden, mijn groei, mijn technische keuzes…</p>
        <div class="footer-story-divider"></div>
        <p>Dit is niet zomaar een visitekaartje.</p>
        <p class="footer-story-highlight">Het is een mix van mijn passie voor voetbal en mijn ontwikkelaarsreis.</p>
        <p style="color:var(--muted);font-size:12px;margin-top:18px;font-family:'DM Mono',monospace;letter-spacing:1px;">EEN PORTFOLIO ONTDEKT ALS EEN CARRIÈRE.</p>`,

    color_blue:   'Blauw (standaard)',
    color_red:    'Rood',
    color_green:  'Groen',
    color_purple: 'Paars',
    color_orange: 'Oranje',
    color_cyan:   'Cyaan',
    color_custom: 'Aangepast',
    size_medium:  'Basis · 15px',
    size_large:   'Groot · 17px',
    size_xlarge:  'Extra Groot · 19px',
    theme_dark:   'Donker',
    theme_darker: 'Zeer donker',
    theme_dim:    'Gedimd',

    /* Tile inline labels */
    skills_web:   'WEB & BACKEND',
    skills_mobile:'MOBILE & TOOLS',
    about_role_text: 'Web- & App-ontwikkelaar · 20 jaar',
    footer_sub_text: 'Portfolio · Web- & App-ontwikkelaar · Grafisch ontwerper',

    /* About popup */
    about_popup_subtitle: 'Matthieu Doolaeghe · Web- & App-ontwikkelaar · 20 jaar · Frankrijk',

    /* Projects popup */
    proj_popup_sub: 'Persoonlijke projecten · Stage · Schoolproject',
    proj_internship_title: 'Stage-projecten',
    proj_ap_title: 'AP-project 2025-2026 — BTS SIO',
    proj_screenshots: 'Schermafbeeldingen',

    /* Skills popup */
    skills_langs_tech_title: 'Talen & Technologieën',
    skills_web_label: 'WEB & BACKEND',
    skills_mobile_label: 'MOBILE & TOOLS',
    skills_cert_label: 'CERTIFICATEN',

    /* BTS SIO */
    bts_title: 'BTS SIO-vaardigheden — SLAM',
    bts_b1_title: 'Support & Implementatie',
    bts_b1_sub:   'IT-diensten',
    bts_b1_1: 'IT-beheer',
    bts_b1_2: 'Reageren op incidenten & verzoeken',
    bts_b1_3: 'Online aanwezigheid ontwikkelen',
    bts_b1_4: 'Werken in projectmodus',
    bts_b1_5: 'Een IT-dienst beschikbaar stellen',
    bts_b1_6: 'Professionele ontwikkeling organiseren',
    bts_b2_title: 'Ontwerp & Ontwikkeling',
    bts_b2_sub:   'Applicaties — SLAM',
    bts_b2_1: 'Een applicatie ontwerpen & ontwikkelen',
    bts_b2_2: 'Correctief of evolutief onderhoud uitvoeren',
    bts_b2_3: 'Gegevens beheren (DB, SQL, modellering)',
    bts_b3_title: 'Cyberbeveiliging',
    bts_b3_sub:   'IT-diensten',
    bts_b3_1: 'Persoonsgegevens beschermen',
    bts_b3_2: 'Digitale identiteit bewaren',
    bts_b3_3: 'Apparatuur & gebruik beveiligen',
    bts_b3_4: 'Beschikbaarheid, integriteit & vertrouwelijkheid garanderen',
    bts_b3_5: 'Cyberbeveiliging van een applicatie',

    /* Languages popup */
    langs_popup_sub: 'Gesproken talen & niveaus',

    /* CV tile */
    cv_format_text:  'PDF-formaat · A4',
    cv_updated_text: 'Bijgewerkt in 2026',
    cv_langs_text:   'FR · EN beschikbaar',
    cv_popup_role:   'Web- & App-ontwikkelaar · 20 jaar · Frankrijk',

    /* Contact popup */
    contact_popup_sub: 'Beschikbaar voor freelance opdrachten & kansen',

    /* GitHub popup */
    gh_popup_sub: 'ItsMattrijk · github.com/ItsMattrijk · Openbare activiteit',
    gh_contrib_total_label: 'bijdragen dit jaar',

    /* Design popup */
    design_exp_title: 'Ervaring & Tools',
  },

  es: {
    nav_about:    'SOBRE MÍ',
    nav_projects: 'PROYECTOS',
    nav_skills:   'HABILIDADES',
    nav_xp:       'EXPERIENCIAS',
    nav_design:   'DISEÑO',
    nav_cv:       'CV',
    nav_contact:  'CONTACTO',

    tile_about:    'SOBRE MÍ',
    tile_projects: 'MIS PROYECTOS',
    tile_skills:   'HABILIDADES',
    tile_xp:       'EXPERIENCIAS',
    tile_cv:       'CURRICULUM VITAE',
    tile_contact:  'CONTACTO',

    about_role:    'Desarrollador Web & App · 20 años',
    about_bio:     'Apasionado por crear proyectos que combinan técnica, creatividad y mis mundos favoritos — fútbol, manga, videojuegos.',
    tag_games:     '🎮 Videojuegos',

    fm_now:          'AHORA MISMO',
    fm_idle:         'INACTIVO',
    fm_idle_sub:     'Nada en curso por ahora.<br>¡Vuelve más tarde!',
    fm_profile:      'PERFIL',
    fm_age:          'Edad',
    fm_age_val:      '20 años',
    fm_nat:          'Nacionalidad',
    fm_nat_val:      '🇫🇷 Francés',
    fm_edu:          'Formación',
    fm_role:         'Puesto',
    fm_role_val:     'Dev. Web & App',
    fm_missions:     'Misiones',
    fm_missions_val: '3 completadas',
    fm_status:       'Estado',
    fm_available:    'Disponible',

    settings_tile_title: 'AJUSTES <span class="red">ACTIVOS</span>',
    settings_tile_label: 'Tus ajustes activos',
    settings_hint: 'Haz clic en la flecha para editar',

    gh_loading:       'CARGANDO',
    gh_contrib_label: 'CONTRIBUCIONES · 52 SEMANAS',
    gh_graph_loading: 'Cargando gráfico…',
    gh_recent_repos:  'REPOS RECIENTES',

    skills_stack: 'Stack & Herramientas',
    skills_langs: 'Idiomas',
    soft_skills:  'SOFT SKILLS',
    ss_autonomy:     'Autonomía',
    ss_curiosity:    'Curiosidad',
    ss_creativity:   'Creatividad',
    ss_problem:      'Resolución de problemas',
    ss_adaptability: 'Adaptabilidad',
    ss_invest:       'Dedicación',
    lang_pro:    'PROFESIONAL',
    lang_school: 'ESCOLAR',
    lang_basics: 'NOCIONES',

    xp_missions: 'Misiones completadas',
    xp1_co:    'Dev. Apps · Ene–Feb',
    xp2_co:    'CM & Dev · May–Jun',
    xp3_co:    'Diseñador · Verano 2024',
    xp_dev:    '⌨ Desarrollo',
    xp_design: '🎨 Diseño',

    cv_dl:      '↓ Descargar PDF',
    cv_preview: '👁 Vista previa',
    cv_format:  'Formato PDF · A4',
    cv_updated: 'Actualizado en 2026',
    cv_langs:   'FR · EN disponible',

    contact_cta: 'Trabajemos<br>juntos',

    design_label: 'PORTFOLIO DE DISEÑO',
    design_title: 'Proyectos<br>Gráficos',
    design_count: '13 creaciones · Photoshop',

    footer_sub: 'Portfolio · Desarrollador Web & App · Diseñador gráfico',

    proj_done:  'Proyectos realizados',
    proj_techs: 'TECNOLOGÍAS USADAS',

    about_popup_title: 'SOBRE MÍ',
    about_popup_sub:   'Matthieu Doolaeghe · Desarrollador Web & App · 20 años · Francia',
    stat_age:       'Años',
    stat_projects:  'Proyectos',
    stat_xp:        'Experiencias',
    stat_curiosity: 'Curiosidad',
    about_intro:    'Presentación',
    about_passions: 'Pasiones',
    about_text1:    "¡Hola! Soy <strong style=\"color:var(--text)\">Matthieu Doolaeghe</strong>, desarrollador apasionado de 20 años con base en Francia. Me especializo en desarrollo web y de aplicaciones, y me encanta crear proyectos que combinan técnica, creatividad y mis pasiones — especialmente el fútbol, el manga y los videojuegos.<br><br>Trabajo principalmente con HTML, CSS, JavaScript y PHP, pero también exploro Flutter, C#, NodeJS, PostgreSQL y Docker. Me gusta construir aplicaciones completas, desde el front-end hasta la base de datos.",
    about_text2:    "Fuera del código, me apasionan el fútbol, el diseño gráfico, los videojuegos y la música.<br><br>Cada proyecto es una oportunidad para aprender, experimentar y superar mis límites.<br><br>Actualmente <strong style=\"color:var(--green)\">disponible</strong> para misiones freelance u oportunidades a tiempo completo.",

    proj_sub:   '9 proyectos realizados · Web · Móvil · Desktop · Discord',
    proj_all:   'Todos los proyectos',
    proj_demo:  '↗ Demo',
    proj_psgdle: 'Un juego web diario tipo Wordle sobre el Paris Saint-Germain. Adivina el jugador del PSG cada día.',
    proj_jojodl: "Un juego web diario tipo Wordle en el universo de JoJo's Bizarre Adventure. Adivina el personaje del día.",
    proj_tbay:  "Una tienda e-commerce inspirada en One Piece con carrito, pedidos, autenticación y panel de administración.",
    proj_wenp:  "Un periódico en línea inspirado en el diario de Big News Morgans de One Piece.",
    proj_devi:  "Una app C# Windows Forms para buscar y consultar las Frutas del Diablo de One Piece, con filtros y fichas detalladas.",
    proj_fm:    "Un generador aleatorio para Football Manager. Descubre tu próximo club según el campeonato deseado.",
    proj_jojo:  "Una colección de 7 bots de Discord temáticos inspirados en los Stands de JoJo's Bizarre Adventure.",
    proj_manga: "Una app Flutter de lectura de manga multi-fuente. Descarga offline, zoom, historial, estadísticas y temas. Arquitectura Provider + web scraping.",
    proj_code:  "Una web para codificar y decodificar mensajes fácilmente mediante diferentes algoritmos de cifrado.",

    skills_sub:       'Lenguajes · Frameworks · Herramientas · Tecnologías',
    skills_langs_tech:'Lenguajes & Tecnologías',
    skills_cat1:      'Web & Frontend',
    skills_cat2:      'Backend, Móvil & Herramientas',

    langs_title:  'IDIOMAS',
    langs_sub:    'Idiomas hablados & niveles',
    langs_levels: 'Niveles lingüísticos',
    lang_fr_level:'100% — Lengua materna',
    lang_en_level:'70% — Nivel intermedio (B1/B2)',
    lang_es_level:'40% — Nivel escolar (A2)',
    lang_nl_level:'10% — Nociones básicas',

    xp_sub:     'Prácticas · Misiones · Voluntariado',
    xp_section: 'Trayectoria',
    xp1_role:   'Desarrollador de aplicaciones — Prácticas',
    xp2_role:   'Community Manager & Gestión Web — Prácticas',
    xp3_role:   'Diseñador Gráfico de Fútbol',
    xp1_date:   'Ene — Feb',
    xp2_date:   'May — Jun',
    xp3_date:   'Verano 2024',
    xp1_desc:   "Animal'And es una asociación de bienestar animal en el norte de Francia. Durante estas prácticas, diseñé y desarrollé dos aplicaciones internas: una <strong style=\"color:var(--text)\">app de mensajería interna</strong> y una <strong style=\"color:var(--text)\">app de tienda interna</strong> para los miembros.",
    xp2_desc:   "Cadre Perso es una empresa especializada en marcos de fútbol personalizados. Mi misión principal fue la <strong style=\"color:var(--text)\">gestión de redes sociales</strong>: creación de contenido, publicaciones y estadísticas. También participé en la <strong style=\"color:var(--text)\">mejora del sitio web</strong>.",
    xp3_desc:   "Paris Team es un medio sobre el PSG en Twitter/X con más de 100.000 seguidores. Mi misión consistía en <strong style=\"color:var(--text)\">crear carteles y visuales gráficos</strong> sobre el PSG: composiciones de partidos, anuncios de fichajes y destacados de jugadores.",

    cv_title:       'MI CV',
    cv_sub:         'Curriculum Vitae · Matthieu Doolaeghe · 2026',
    cv_doc:         'Documento',
    cv_dl_long:     '↓ Descargar CV (PDF)',
    cv_preview_long:'👁 Vista previa del CV',
    cv_close:       '✕ CERRAR',
    cv_date:        'PDF · Última actualización: 2026',

    contact_sub:   'Disponible para misiones freelance & oportunidades',
    contact_links: 'Enlaces directos',
    contact_msg:   'Mensaje rápido',
    contact_name:  'Tu nombre',
    contact_email: 'Tu email',
    contact_msgph: 'Tu mensaje...',
    contact_send:  '↗ Enviar',
    contact_alert: '¡Mensaje enviado!',

    design_popup_title: 'PORTFOLIO DE DISEÑO',
    design_sub:         'Creaciones de diseño · Fútbol · Miniaturas · Identidades visuales',
    design_exp:         'Experiencia & Herramientas',
    design_tag_mini:    '🎨 Miniaturas YouTube/Redes',
    design_trust:       'Confiaron en mí',
    design_gallery:     'Galería — Todas las creaciones',

    footer_breadcrumb: 'La Historia',
    story_title: '⚽ LA HISTORIA DETRÁS',
    story_sub:   'Cómo Football Manager 2026 inspiró este portfolio',

    gh_popup_title:    'ACTIVIDAD GITHUB',
    gh_profile:        'Perfil',
    gh_view_profile:   '↗ Ver perfil de GitHub',
    gh_contrib_section:'Contribuciones — Últimas 52 semanas',
    gh_repos:          'Repositorios',
    gh_langs_used:     'Lenguajes utilizados',
    gh_contrib_total:  'contribuciones este año',
    gh_updated:        'Actualizado',
    gh_no_contrib:     'Sin contribuciones',

    settings_title:       'Ajustes',
    settings_title_upper: 'AJUSTES',
    settings_sub:         'Personaliza tu experiencia · Los ajustes se guardan',
    settings_lang:        'Idioma',
    settings_color1:      'Color principal',
    settings_color2:      'Color secundario',
    settings_size:        'Tamaño del texto',
    settings_theme:       'Tema',
    settings_anim:        'Animaciones',
    settings_anim_toggle: 'Activar animaciones de transición',
    settings_hover_toggle:'Efectos al pasar el cursor',
    settings_reset:       '↺ Restablecer',

    st_lang:   'Idioma',
    st_main:   'Principal',
    st_second: 'Secundario',
    st_text:   'Texto',
    st_theme:  'Tema',
    st_anim:   'Animaciones',
    st_hover:  'Cursor',
    st_on:     'Activadas',
    st_off:    'Desactivadas',
    st_on2:    'Activado',
    st_off2:   'Desactivado',

    gh_months: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    gh_days:   ['', 'Lun', '', 'Mié', '', 'Vie', ''],
    gh_less:   'Menos',
    gh_more:   'Más',
    gh_locale: 'es-ES',
    gh_status_active: 'ACTIVO',
    gh_status_error:  'ERROR API',
    gh_status_loading:'CARGANDO',
    gh_loading_contrib:'Cargando contribuciones…',
    gh_data_unavail:  'Datos no disponibles.',
    story_body: `<p>Para mi portfolio, no quería simplemente hacer un sitio para <em>"marcar la casilla"</em>.</p>
        <p>Quería crear algo original. Algo que me represente de verdad, construido alrededor de un mundo que amo.</p>
        <p>La verdad es que pasé por muchas ideas… Conceptos demasiado clásicos, otros demasiado ambiciosos, algunos directamente fallidos. Siempre faltaba algo. Se sentía como un <em>"proyecto"</em>, pero no como <em>"yo"</em>.</p>
        <div class="footer-story-divider"></div>
        <p class="footer-story-highlight">Y entonces la idea llegó casi por casualidad.</p>
        <p>Fue durante una carrera online en <strong style="color:var(--red)">Football Manager 2026</strong>, en la Ligue 1, con amigos. Estábamos totalmente metidos: mercado, tácticas, análisis de estadísticas, bromas en Discord… El tipo de noche que acaba demasiado tarde.</p>
        <p>En un momento, me encontré mirando el panel del juego.</p>
        <div class="footer-story-quote"><span>Minimalista. Limpio. Estructurado.</span><span>Pero detrás de esta interfaz sobria, una enorme cantidad de información.</span></div>
        <p>Y ahí fue cuando <strong style="color:var(--accent-light)">encajó todo</strong>.</p>
        <p>Pensé: ¿por qué no hacer un portfolio así? Un panel simple en apariencia. Algo claro, casi discreto a primera vista. Pero cuando lo exploras, descubres mucho más: mis proyectos, mis habilidades, mi evolución, mis decisiones técnicas…</p>
        <div class="footer-story-divider"></div>
        <p>Esto no es solo un sitio de presentación.</p>
        <p class="footer-story-highlight">Es una mezcla entre mi pasión por el fútbol y mi trayectoria como desarrollador.</p>
        <p style="color:var(--muted);font-size:12px;margin-top:18px;font-family:'DM Mono',monospace;letter-spacing:1px;">UN PORTFOLIO QUE SE RECORRE COMO UNA CARRERA.</p>`,

    color_blue:   'Azul (defecto)',
    color_red:    'Rojo',
    color_green:  'Verde',
    color_purple: 'Morado',
    color_orange: 'Naranja',
    color_cyan:   'Cian',
    color_custom: 'Personalizado',
    size_medium:  'Básico · 15px',
    size_large:   'Grande · 17px',
    size_xlarge:  'Muy Grande · 19px',
    theme_dark:   'Oscuro',
    theme_darker: 'Muy oscuro',
    theme_dim:    'Tenue',

    /* Tile inline labels */
    skills_web:   'WEB & BACKEND',
    skills_mobile:'MOBILE & HERRAMIENTAS',
    about_role_text: 'Desarrollador Web & App · 20 años',
    footer_sub_text: 'Portfolio · Desarrollador Web & App · Diseñador Gráfico',

    /* About popup */
    about_popup_subtitle: 'Matthieu Doolaeghe · Desarrollador Web & App · 20 años · Francia',

    /* Projects popup */
    proj_popup_sub: 'Proyectos personales · Prácticas · Escolar',
    proj_internship_title: 'Proyectos de prácticas',
    proj_ap_title: 'Proyecto AP 2025-2026 — BTS SIO',
    proj_screenshots: 'Capturas de pantalla',

    /* Skills popup */
    skills_langs_tech_title: 'Lenguajes & Tecnologías',
    skills_web_label: 'WEB & BACKEND',
    skills_mobile_label: 'MOBILE & HERRAMIENTAS',
    skills_cert_label: 'CERTIFICACIONES',

    /* BTS SIO */
    bts_title: 'Competencias BTS SIO — SLAM',
    bts_b1_title: 'Soporte & puesta en disposición',
    bts_b1_sub:   'Servicios informáticos',
    bts_b1_1: 'Gestionar el patrimonio informático',
    bts_b1_2: 'Responder a incidencias & solicitudes',
    bts_b1_3: 'Desarrollar la presencia en línea',
    bts_b1_4: 'Trabajar en modo proyecto',
    bts_b1_5: 'Poner a disposición un servicio informático',
    bts_b1_6: 'Organizar el desarrollo profesional',
    bts_b2_title: 'Concepción & desarrollo',
    bts_b2_sub:   'Aplicaciones — SLAM',
    bts_b2_1: 'Concebir & desarrollar una solución aplicativa',
    bts_b2_2: 'Asegurar el mantenimiento correctivo o evolutivo',
    bts_b2_3: 'Gestionar los datos (BDD, SQL, modelización)',
    bts_b3_title: 'Ciberseguridad',
    bts_b3_sub:   'Servicios informáticos',
    bts_b3_1: 'Proteger los datos de carácter personal',
    bts_b3_2: 'Preservar la identidad digital',
    bts_b3_3: 'Proteger los equipos & usos',
    bts_b3_4: 'Garantizar disponibilidad, integridad & confidencialidad',
    bts_b3_5: 'Ciberseguridad de una solución aplicativa',

    /* Languages popup */
    langs_popup_sub: 'Idiomas hablados & niveles',

    /* CV tile */
    cv_format_text:  'Formato PDF · A4',
    cv_updated_text: 'Actualizado en 2026',
    cv_langs_text:   'FR · EN disponible',
    cv_popup_role:   'Desarrollador Web & App · 20 años · Francia',

    /* Contact popup */
    contact_popup_sub: 'Disponible para misiones freelance & oportunidades',

    /* GitHub popup */
    gh_popup_sub: 'ItsMattrijk · github.com/ItsMattrijk · Actividad pública',
    gh_contrib_total_label: 'contribuciones este año',

    /* Design popup */
    design_exp_title: 'Experiencia & Herramientas',
  },
};

function t(key) {
  const lang = appSettings.lang || 'fr';
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.fr[key] || key);
}

function applyLang() {
  const lang = appSettings.lang || 'fr';
  document.documentElement.lang = lang;

  /* innerHTML elements (support HTML inside translations) */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val !== undefined) el.innerHTML = val;
  });

  /* Placeholder attributes */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = t(key);
    if (val !== undefined) el.placeholder = val;
  });

  /* Update COLOR_MAP labels to current language */
  COLOR_MAP.blue.label    = t('color_blue');
  COLOR_MAP.red.label     = t('color_red');
  COLOR_MAP.green.label   = t('color_green');
  COLOR_MAP.purple.label  = t('color_purple');
  COLOR_MAP.orange.label  = t('color_orange');
  COLOR_MAP.cyan.label    = t('color_cyan');
  if (COLOR_MAP.custom)  COLOR_MAP.custom.label  = t('color_custom');
  if (COLOR_MAP.custom2) COLOR_MAP.custom2.label = t('color_custom');

  /* Update SIZE_MAP labels */
  SIZE_MAP.medium.label = t('size_medium');
  SIZE_MAP.large.label  = t('size_large');
  SIZE_MAP.xlarge.label = t('size_xlarge');

  /* Update THEME_MAP labels */
  THEME_MAP.dark.label   = t('theme_dark');
  THEME_MAP.darker.label = t('theme_darker');
  THEME_MAP.dim.label    = t('theme_dim');

  /* CV preview button (dynamic) */
  const cvBtn = document.querySelector('.cv-preview-btn');
  if (cvBtn) cvBtn.textContent = t('cv_preview_long');
  const cvContainer = document.getElementById('cv-iframe-container');
  if (cvContainer && cvContainer.style.display === 'block') {
    if (cvBtn) cvBtn.textContent = '✕ ' + (lang === 'fr' ? "Masquer l'aperçu" : lang === 'en' ? 'Hide preview' : lang === 'nl' ? 'Verbergen' : 'Ocultar');
  }

  /* Refresh settings tile display with new labels */
  updateSettingsTileDisplay();

  /* Refresh color name labels in settings popup */
  const nameEl = document.getElementById('settings-color-name');
  if (nameEl) nameEl.textContent = (COLOR_MAP[appSettings.color] || COLOR_MAP.blue).label;
  const name2El = document.getElementById('settings-color2-name');
  if (name2El) name2El.textContent = (COLOR_MAP[appSettings.color2] || COLOR_MAP.red).label;

  /* Reset GitHub loaded flag so graph re-renders with new locale */
  ghLoaded = false;
  ghpLoaded = false;
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
  custom: { label: 'Personnalisé',   accent: '#004170', light: '#0062aa' },
  custom2:{ label: 'Personnalisé',   accent: '#7a1510', light: '#DA291C' },
};
// Labels are overridden by applyLang()

const SIZE_MAP = {
  small:  { label: 'Basique · 15px',  size: '15px' },
  medium: { label: 'Basique · 15px',  size: '15px' },
  large:  { label: 'Grand · 17px',  size: '17px' },
  xlarge: { label: 'Plus Grand · 19px', size: '19px' },
};

/* ── FONT SIZE SLIDER ── */
function _getFontSizePx() {
  const raw = appSettings.size;
  const parsed = parseFloat(raw);
  if (!isNaN(parsed)) return parsed;
  const map = { small: 15, medium: 15, large: 17, xlarge: 19 };
  return map[raw] || 15;
}
function _applyFsMul(px) {
  const mul = px / 15;
  document.documentElement.style.setProperty('--fs-mul', mul.toFixed(4));
  // Active fs-scaled uniquement si on dépasse la taille de base
  if (mul > 1.001) {
    document.body.classList.add('fs-scaled');
  } else {
    document.body.classList.remove('fs-scaled');
  }
}
function _syncSizeSlider() {
  const px = _getFontSizePx();
  const slider   = document.getElementById('settings-size-range');
  const valLabel = document.getElementById('settings-size-val');
  const preview  = document.getElementById('settings-size-preview');
  if (slider)   slider.value = px;
  if (valLabel) valLabel.textContent = px + 'px';
  if (preview)  preview.style.fontSize = px + 'px';
  if (slider)   _updateSliderTrack(slider);
}
function _updateSliderTrack(slider) {
  const min = parseFloat(slider.min), max = parseFloat(slider.max), val = parseFloat(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--accent-light) 0%, var(--accent-light) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
}
function previewFontSize(val) {
  const px = parseFloat(val);
  const valLabel = document.getElementById('settings-size-val');
  const preview  = document.getElementById('settings-size-preview');
  const slider   = document.getElementById('settings-size-range');
  if (valLabel) valLabel.textContent = px + 'px';
  if (preview)  preview.style.fontSize = px + 'px';
  if (slider)   _updateSliderTrack(slider);
  _applyFsMul(px);
}
function applyFontSizeFromSlider(val) {
  const px = parseFloat(val);
  appSettings.size = String(px);
  _applyFsMul(px);
  saveSettings();
  _syncSizeSlider();
}

const THEME_MAP = {
  dark:   { label: 'Sombre',    bg: '#0a0e14', tile: '#0f1520' },
  darker: { label: 'Très sombre', bg: '#050709', tile: '#090d13' },
  dim:    { label: 'Tamisé',    bg: '#0e1218', tile: '#161e2a' },
};

const LANG_MAP = {
  fr: 'Français 🇫🇷',
  en: 'English 🇬🇧',
  nl: 'Nederlands 🇳🇱',
  es: 'Español 🇪🇸',
};

/* Default settings */
let appSettings = {
  lang:   'fr',
  color:  'blue',
  color2: 'red',
  size:   'medium',
  theme:  'dark',
  anim:   true,
  hover:  true,
  customColor:  null,
  customColor2: null,
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

  // Primary Color
  if (appSettings.color === 'custom' && appSettings.customColor) {
    const hex = appSettings.customColor;
    root.style.setProperty('--accent', darkenHex(hex, 0.5));
    root.style.setProperty('--accent-light', hex);
  } else {
    const c = COLOR_MAP[appSettings.color] || COLOR_MAP.blue;
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-light', c.light);
  }

  // Secondary Color (--red / --red-light)
  if (appSettings.color2 === 'custom2' && appSettings.customColor2) {
    const hex2 = appSettings.customColor2;
    root.style.setProperty('--red', hex2);
    root.style.setProperty('--red-light', lightenHex(hex2, 0.15));
  } else {
    const c2 = COLOR_MAP[appSettings.color2] || COLOR_MAP.red;
    root.style.setProperty('--red', c2.light);
    root.style.setProperty('--red-light', lightenHex(c2.light, 0.15));
  }

  // Size
  const pxVal = _getFontSizePx();
  _applyFsMul(pxVal);
  setTimeout(_syncSizeSlider, 0);

  // Theme
  const th = THEME_MAP[appSettings.theme] || THEME_MAP.dark;
  root.style.setProperty('--bg', th.bg);
  root.style.setProperty('--tile', th.tile);

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

/* Utility: darken/lighten hex color */
function darkenHex(hex, amount) {
  let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  r = Math.round(r * (1 - amount)); g = Math.round(g * (1 - amount)); b = Math.round(b * (1 - amount));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}
function lightenHex(hex, amount) {
  let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  r = Math.min(255, Math.round(r + (255 - r) * amount));
  g = Math.min(255, Math.round(g + (255 - g) * amount));
  b = Math.min(255, Math.round(b + (255 - b) * amount));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

/* Custom color picker */
function openCustomColor(which) {
  const inputId = which === 'primary' ? 'color-custom-input' : 'color2-custom-input';
  const input = document.getElementById(inputId);
  if (input) input.click();
}

function applyCustomColor(which, hex) {
  if (which === 'primary') {
    appSettings.customColor = hex;
    appSettings.color = 'custom';
    COLOR_MAP.custom = { label: 'Personnalisé (' + hex + ')', accent: darkenHex(hex, 0.5), light: hex };
    // Update custom btn color
    const btn = document.getElementById('color-custom-btn');
    if (btn) { btn.style.background = hex; btn.classList.add('active'); }
    document.querySelectorAll('[data-group="color"]:not(#color-custom-btn)').forEach(b => b.classList.remove('active'));
    const nameEl = document.getElementById('settings-color-name');
    if (nameEl) nameEl.textContent = 'Personnalisé (' + hex + ')';
  } else {
    appSettings.customColor2 = hex;
    appSettings.color2 = 'custom2';
    COLOR_MAP.custom2 = { label: 'Personnalisé (' + hex + ')', accent: darkenHex(hex, 0.5), light: hex };
    const btn = document.getElementById('color2-custom-btn');
    if (btn) { btn.style.background = hex; btn.classList.add('active'); }
    document.querySelectorAll('[data-group="color2"]:not(#color2-custom-btn)').forEach(b => b.classList.remove('active'));
    const nameEl = document.getElementById('settings-color2-name');
    if (nameEl) nameEl.textContent = 'Personnalisé (' + hex + ')';
  }
  saveSettings();
  applySettings();
}

function updateSettingsTileDisplay() {
  const el = document.getElementById('settings-active-display');
  if (!el) return;

  const c  = appSettings.color  === 'custom'  ? COLOR_MAP.custom  : (COLOR_MAP[appSettings.color]  || COLOR_MAP.blue);
  const c2 = appSettings.color2 === 'custom2' ? COLOR_MAP.custom2 : (COLOR_MAP[appSettings.color2] || COLOR_MAP.red);
  const s  = SIZE_MAP[appSettings.size]   || SIZE_MAP.medium;
  const th = THEME_MAP[appSettings.theme] || THEME_MAP.dark;

  const items = [
    { key: t('st_lang'),   val: LANG_MAP[appSettings.lang] || appSettings.lang, dot: '#5aaff5' },
    { key: t('st_main'),   val: c.label,   dot: c.light },
    { key: t('st_second'), val: c2.label,  dot: c2.light },
    { key: t('st_text'),   val: s.label,   dot: '#22c55e' },
    { key: t('st_theme'),  val: th.label,  dot: '#8b5cf6' },
    { key: t('st_anim'),   val: appSettings.anim  ? t('st_on')  : t('st_off'),  dot: appSettings.anim  ? '#22c55e' : '#ff6b5e' },
    { key: t('st_hover'),  val: appSettings.hover ? t('st_on2') : t('st_off2'), dot: appSettings.hover ? '#22c55e' : '#ff6b5e' },
  ];

  /* Compact rows */
  el.innerHTML = items.map(i => `
    <div class="stile-card" style="--card-color:${i.dot}">
      <span class="stile-dot" style="background:${i.dot};box-shadow:0 0 5px ${i.dot}99;"></span>
      <span class="stile-key">${i.key}</span>
      <span class="stile-val">${i.val}</span>
    </div>`).join('');

  /* Status bar */
  const bar = document.getElementById('settings-status-bar');
  if (bar) bar.innerHTML = items.map(i =>
    `<span style="flex:1;height:100%;background:${i.dot};border-radius:1px;opacity:.7;"></span>`
  ).join('');
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
  if (group === 'color2') {
    const nameEl = document.getElementById('settings-color2-name');
    if (nameEl) nameEl.textContent = COLOR_MAP[value]?.label || value;
  }
  saveSettings();
  applySettings();
  if (group === 'lang') applyLang();
}

function toggleSetting(key, val) {
  appSettings[key] = val;
  saveSettings();
  applySettings();
}

function resetSettings() {
  appSettings = { lang: 'fr', color: 'blue', color2: 'red', size: '15', theme: 'dark', anim: true, hover: true, customColor: null, customColor2: null };
  saveSettings();
  applySettings();
  applyLang();
  syncSettingsPopupUI();
  setTimeout(_syncSizeSlider, 0);
}

function syncSettingsPopupUI() {
  // Sync all option buttons (size est maintenant un slider)
  ['lang','color','color2','theme'].forEach(group => {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === appSettings[group]);
    });
  });
  // Color labels
  const nameEl = document.getElementById('settings-color-name');
  if (nameEl) {
    const c = appSettings.color === 'custom' ? COLOR_MAP.custom : (COLOR_MAP[appSettings.color] || COLOR_MAP.blue);
    nameEl.textContent = c.label;
  }
  const name2El = document.getElementById('settings-color2-name');
  if (name2El) {
    const c2 = appSettings.color2 === 'custom2' ? COLOR_MAP.custom2 : (COLOR_MAP[appSettings.color2] || COLOR_MAP.red);
    name2El.textContent = c2.label;
  }
  // Restore custom btn colors if set
  if (appSettings.customColor) {
    const btn = document.getElementById('color-custom-btn');
    if (btn) btn.style.background = appSettings.customColor;
  }
  if (appSettings.customColor2) {
    const btn = document.getElementById('color2-custom-btn');
    if (btn) btn.style.background = appSettings.customColor2;
  }
  // Toggles
  const animToggle = document.getElementById('toggle-anim');
  if (animToggle) animToggle.checked = appSettings.anim;
  const hoverToggle = document.getElementById('toggle-hover');
  if (hoverToggle) hoverToggle.checked = appSettings.hover;
}

function openSettingsPopup() {
  syncSettingsPopupUI();
  openPopup('settings');
  setTimeout(_syncSizeSlider, 50);
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
  applyLang();
});