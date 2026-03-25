/* ═══════════════════════════════════════════════════════════════
   🏴‍☠️  ONE PIECE EASTER EGGS — VERSION PREMIUM
   ⭐  JOJO'S BIZARRE ADVENTURE EASTER EGGS — VERSION PREMIUM
   Matthieu Doolaeghe Portfolio
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Keyboard sequence tracker ── */
  const SEQUENCES = {
    GEAR5:    ['g', 'e', 'a', 'r', '5'],
    ZORO:     ['z', 'o', 'r', 'o'],
    ROOM:     ['r', 'o', 'o', 'm'],
    ZAWARUDO: ['z', 'a', 'w', 'a', 'r', 'u', 'd', 'o'],
    ORA:      ['o', 'r', 'a'],
    KILLER:   ['k', 'i', 'l', 'l', 'e', 'r'],
    MENACE:   ['m', 'e', 'n', 'a', 'c', 'e'],
    D4C:      ['d', '4', 'c'],
  };

  let buffer = [];
  const MAX_LEN = 8;

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    buffer.push(key);
    if (buffer.length > MAX_LEN) buffer.shift();

    for (const [name, seq] of Object.entries(SEQUENCES)) {
      if (buffer.length >= seq.length) {
        const tail = buffer.slice(buffer.length - seq.length);
        if (tail.every((k, i) => k === seq[i])) {
          buffer = [];
          triggerEasterEgg(name);
          break;
        }
      }
    }
  });

  function triggerEasterEgg(name) {
    // Prevent stacking
    if (document.body.dataset.easterActive) return;
    if (name === 'GEAR5')    activateGear5();
    if (name === 'ZORO')     activateZoro();
    if (name === 'ROOM')     activateRoom();
    if (name === 'ZAWARUDO') activateZaWarudo();
    if (name === 'ORA')      activateOra();
    if (name === 'KILLER')   activateKillerQueen();
    if (name === 'MENACE')   activateMenace();
    if (name === 'D4C')      activateD4C();
  }

  /* ═══════════════════════════════════════════════════════════
     ⚡  1. GEAR 5 — Nika Awakening
  ═══════════════════════════════════════════════════════════ */
  function activateGear5() {
    document.body.dataset.easterActive = 'gear5';
    injectGear5Styles();

    // White flash
    const flash = document.createElement('div');
    flash.className = 'g5-flash';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.remove();
      launchGear5();
    }, 220);
  }

  function launchGear5() {
    document.body.classList.add('gear5-mode');

    // Clouds overlay
    const clouds = document.createElement('div');
    clouds.className = 'g5-clouds';
    for (let i = 0; i < 6; i++) {
      const c = document.createElement('div');
      c.className = 'g5-cloud';
      c.style.cssText = `
        top: ${Math.random() * 80}%;
        left: ${Math.random() * 110 - 10}%;
        animation-delay: ${Math.random() * 4}s;
        animation-duration: ${6 + Math.random() * 6}s;
        transform: scale(${0.5 + Math.random()});
        opacity: ${0.3 + Math.random() * 0.4};
      `;
      clouds.appendChild(c);
    }
    document.body.appendChild(clouds);

    // Lightning bolts
    const lightningContainer = document.createElement('div');
    lightningContainer.className = 'g5-lightning-container';
    document.body.appendChild(lightningContainer);
    spawnLightning(lightningContainer);

    // Floating texts
    const messages = ['Nika Mode Activated ☀️', 'Freedom Overdrive', 'This is fun!!', 'GEAR 5!', 'Nika!!'];
    spawnFloatingText(messages[0]);
    setTimeout(() => spawnFloatingText(messages[Math.floor(Math.random() * messages.length)]), 1800);
    setTimeout(() => spawnFloatingText(messages[Math.floor(Math.random() * messages.length)]), 3500);

    // Squash & stretch on cards
    const cards = document.querySelectorAll('.proj-card, .tile, .skill-bar, .xp-item, .contact-chip');
    cards.forEach((c, i) => {
      c.classList.add('g5-bounce');
      c.style.animationDelay = (i * 0.07) + 's';
    });

    // Cartoon cursor
    document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='14' fill='white' stroke='black' stroke-width='3'/%3E%3Ccircle cx='11' cy='13' r='3' fill='black'/%3E%3Ccircle cx='21' cy='13' r='3' fill='black'/%3E%3Cpath d='M10 21 Q16 26 22 21' stroke='black' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") 16 16, auto`;

    // Click mini-explosion
    document.addEventListener('click', g5ClickEffect);
    // Wavy hover
    document.addEventListener('mouseover', g5HoverEffect);
    // Elastic scroll
    enableElasticScroll();

    // Auto deactivate after 18s
    setTimeout(deactivateGear5, 18000);
  }

  function spawnLightning(container) {
    if (!document.body.classList.contains('gear5-mode')) return;
    const bolt = document.createElement('div');
    bolt.className = 'g5-bolt';
    bolt.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 80}%;
      transform: rotate(${-30 + Math.random() * 60}deg);
      animation-duration: ${0.3 + Math.random() * 0.4}s;
    `;
    bolt.textContent = '⚡';
    container.appendChild(bolt);
    setTimeout(() => bolt.remove(), 700);
    setTimeout(() => spawnLightning(container), 300 + Math.random() * 500);
  }

  function g5ClickEffect(e) {
    const pop = document.createElement('div');
    pop.className = 'g5-pop';
    pop.textContent = ['💥', '✨', '☀️', '💫'][Math.floor(Math.random() * 4)];
    pop.style.cssText = `left:${e.clientX}px; top:${e.clientY}px;`;
    document.body.appendChild(pop);
    // boing sound via AudioContext
    playCartoonSound('boing');
    setTimeout(() => pop.remove(), 600);
  }

  function g5HoverEffect(e) {
    const el = e.target;
    if (el.classList.contains('g5-wave')) return;
    if (!el.closest('.tile, .proj-card, .tag, .topbar-nav a')) return;
    el.classList.add('g5-wave');
    setTimeout(() => el.classList.remove('g5-wave'), 500);
  }

  let elasticScrollActive = false;
  function enableElasticScroll() {
    if (elasticScrollActive) return;
    elasticScrollActive = true;
    window.addEventListener('wheel', elasticScrollHandler, { passive: true });
  }
  function elasticScrollHandler(e) {
    document.documentElement.style.transition = 'transform 0.15s cubic-bezier(.36,.07,.19,.97)';
    document.documentElement.style.transform = `translateY(${e.deltaY > 0 ? -6 : 6}px)`;
    setTimeout(() => {
      document.documentElement.style.transform = '';
    }, 150);
  }

  function deactivateGear5() {
    document.body.classList.remove('gear5-mode');
    document.body.style.cursor = '';
    document.querySelectorAll('.g5-clouds, .g5-lightning-container').forEach(el => el.remove());
    document.querySelectorAll('.g5-bounce').forEach(el => { el.classList.remove('g5-bounce'); el.style.animationDelay = ''; });
    document.removeEventListener('click', g5ClickEffect);
    document.removeEventListener('mouseover', g5HoverEffect);
    window.removeEventListener('wheel', elasticScrollHandler);
    elasticScrollActive = false;
    delete document.body.dataset.easterActive;
    spawnFloatingText('Freedom restored... for now 😴');
  }

  function injectGear5Styles() {
    if (document.getElementById('g5-styles')) return;
    const s = document.createElement('style');
    s.id = 'g5-styles';
    s.textContent = `
      .g5-flash {
        position: fixed; inset: 0; background: #fff; z-index: 99999;
        animation: g5FlashAnim 0.22s ease-out forwards;
      }
      @keyframes g5FlashAnim { 0%{opacity:1} 100%{opacity:0} }

      body.gear5-mode {
        animation: g5Jitter 0.08s steps(2) infinite;
        --red: #ff2200;
        filter: saturate(1.4) contrast(1.1);
      }
      @keyframes g5Jitter {
        0%  { transform: translate(0,0) }
        25% { transform: translate(1px,-1px) }
        50% { transform: translate(-1px,1px) }
        75% { transform: translate(1px,1px) }
        100%{ transform: translate(0,0) }
      }

      .g5-clouds {
        position: fixed; inset: 0; pointer-events: none; z-index: 9000;
        overflow: hidden;
      }
      .g5-cloud {
        position: absolute;
        width: 180px; height: 60px;
        background: radial-gradient(ellipse, rgba(255,255,255,0.9) 40%, transparent 80%);
        border-radius: 50%;
        animation: g5CloudFloat linear infinite;
        filter: blur(8px);
      }
      @keyframes g5CloudFloat {
        from { transform: translateX(0) scaleY(1); }
        50%  { transform: translateX(40px) scaleY(1.1); }
        to   { transform: translateX(0) scaleY(1); }
      }

      .g5-lightning-container {
        position: fixed; inset: 0; pointer-events: none; z-index: 9001;
        overflow: hidden;
      }
      .g5-bolt {
        position: absolute; font-size: 28px; pointer-events: none;
        animation: g5BoltAnim ease-out forwards;
      }
      @keyframes g5BoltAnim {
        0%  { opacity:1; transform: scale(0.5) rotate(var(--r,0deg)); }
        50% { opacity:1; transform: scale(1.4) rotate(var(--r,0deg)); }
        100%{ opacity:0; transform: scale(0.8) rotate(var(--r,0deg)); }
      }

      .g5-bounce {
        animation: g5BounceCard 0.7s cubic-bezier(.36,.07,.19,.97) both !important;
      }
      @keyframes g5BounceCard {
        0%  { transform: scale(1) }
        20% { transform: scaleX(1.12) scaleY(0.88) }
        40% { transform: scaleX(0.92) scaleY(1.1) }
        60% { transform: scaleX(1.06) scaleY(0.96) }
        80% { transform: scaleX(0.97) scaleY(1.03) }
        100%{ transform: scale(1) }
      }

      .g5-wave {
        animation: g5WaveEl 0.5s ease-in-out !important;
      }
      @keyframes g5WaveEl {
        0%  { transform: rotate(0deg) scale(1) }
        25% { transform: rotate(-3deg) scale(1.05) }
        75% { transform: rotate(3deg) scale(1.05) }
        100%{ transform: rotate(0deg) scale(1) }
      }

      .g5-pop {
        position: fixed; pointer-events: none; font-size: 32px;
        z-index: 99998; transform: translate(-50%,-50%);
        animation: g5PopAnim 0.6s ease-out forwards;
      }
      @keyframes g5PopAnim {
        0%  { transform: translate(-50%,-50%) scale(0.3); opacity:1; }
        60% { transform: translate(-50%,-80%) scale(1.4); opacity:1; }
        100%{ transform: translate(-50%,-120%) scale(0.8); opacity:0; }
      }

      .g5-float-text {
        position: fixed; pointer-events: none; z-index: 99997;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 28px; letter-spacing: 3px;
        color: #fff;
        text-shadow: 3px 3px 0 #ff2200, -2px -2px 0 #000, 2px -2px 0 #000;
        animation: g5FloatText 3s ease-out forwards;
        white-space: nowrap;
      }
      @keyframes g5FloatText {
        0%  { opacity:0; transform: translateY(0) scale(0.8) rotate(-3deg); }
        15% { opacity:1; transform: translateY(-20px) scale(1.1) rotate(2deg); }
        80% { opacity:1; transform: translateY(-60px) scale(1) rotate(-1deg); }
        100%{ opacity:0; transform: translateY(-100px) scale(0.9) rotate(0deg); }
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     🗡️  2. ZORO — Lost Mode
  ═══════════════════════════════════════════════════════════ */
  let zoroActive = false;
  let zoroInputLag = null;
  let zoroScrollPivot = null;
  let zoroInsistCount = 0;

  function activateZoro() {
    document.body.dataset.easterActive = 'zoro';
    zoroActive = true;
    injectZoroStyles();

    // Screen freeze
    document.body.classList.add('zoro-freeze');
    playAmbientSound('wind');

    setTimeout(() => {
      document.body.classList.remove('zoro-freeze');
      document.body.classList.add('zoro-mode');
      launchZoro();
    }, 500);
  }

  function launchZoro() {
    // Global green tint
    const tint = document.createElement('div');
    tint.className = 'zoro-tint';
    tint.id = 'zoro-tint';
    document.body.appendChild(tint);

    // Compass UI
    const compass = document.createElement('div');
    compass.className = 'zoro-compass';
    compass.id = 'zoro-compass';
    compass.innerHTML = `
      <div class="zoro-compass-ring">
        <div class="zoro-compass-needle" id="zoro-needle">N</div>
        <div class="zoro-compass-dirs">
          <span class="zoro-d zoro-dn">N</span>
          <span class="zoro-d zoro-de">E</span>
          <span class="zoro-d zoro-ds">S</span>
          <span class="zoro-d zoro-dw">W</span>
        </div>
      </div>
      <div class="zoro-compass-label">RECALCUL...</div>
    `;
    document.body.appendChild(compass);

    // Spin compass randomly
    let compassAngle = 0;
    const spinCompass = setInterval(() => {
      if (!zoroActive) { clearInterval(spinCompass); return; }
      compassAngle += 15 + Math.random() * 45;
      const needle = document.getElementById('zoro-needle');
      if (needle) needle.style.transform = `rotate(${compassAngle}deg)`;
    }, 600);

    // Mini-map (mirrored)
    const minimap = document.createElement('div');
    minimap.className = 'zoro-minimap';
    minimap.innerHTML = '<div class="zoro-minimap-inner">🗺️ YOU ARE HERE<br><small>(probably not)</small></div>';
    document.body.appendChild(minimap);
    let mmFlip = false;
    setInterval(() => {
      if (!zoroActive) return;
      mmFlip = !mmFlip;
      minimap.style.transform = mmFlip ? 'scaleX(-1) rotate(180deg)' : 'scaleX(1) rotate(0deg)';
    }, 3000);

    // Message popups
    const msgs = [
      'Tu es sûr d\'aller dans la bonne direction ?',
      'Même moi je suis perdu…',
      'Recalcul de route… erreur.',
      'Nord… ou était-ce le Sud ?',
      'ERREUR GPS : ZORO_404',
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      if (!zoroActive) { clearInterval(msgInterval); return; }
      spawnFloatingText(msgs[msgIdx % msgs.length], 'zoro');
      msgIdx++;
    }, 3200);

    // Mouse input lag
    let realX = 0, realY = 0, displayX = 0, displayY = 0;
    const fakeCursor = document.createElement('div');
    fakeCursor.className = 'zoro-fake-cursor';
    document.body.appendChild(fakeCursor);
    document.body.style.cursor = 'none';

    const trackMouse = (e) => { realX = e.clientX; realY = e.clientY; };
    document.addEventListener('mousemove', trackMouse);

    zoroInputLag = setInterval(() => {
      if (!zoroActive) return;
      displayX += (realX - displayX) * 0.08;
      displayY += (realY - displayY) * 0.08;
      fakeCursor.style.left = displayX + 'px';
      fakeCursor.style.top = displayY + 'px';
    }, 16);

    // Scroll pivot
    let scrollPivotAngle = 0;
    const pivotEl = document.querySelector('.grid-container') || document.body;
    zoroScrollPivot = () => {
      scrollPivotAngle = (Math.random() * 10 - 5);
      pivotEl.style.transition = 'transform 0.3s ease';
      pivotEl.style.transform = `rotate(${scrollPivotAngle}deg)`;
      setTimeout(() => { if (pivotEl) pivotEl.style.transform = 'rotate(0deg)'; }, 400);
    };
    window.addEventListener('scroll', zoroScrollPivot, { passive: true });

    // Insist detection: clicking repeatedly
    document.addEventListener('click', zoroInsistCheck);

    // Auto deactivate after 20s
    setTimeout(deactivateZoro, 20000);
    // Store cleanup refs
    window.__zoroCleanup = { spinCompass, msgInterval, trackMouse, fakeCursor, pivotEl };
  }

  function zoroInsistCheck() {
    zoroInsistCount++;
    if (zoroInsistCount >= 5) {
      zoroInsistCount = 0;
      document.removeEventListener('click', zoroInsistCheck);
      // Secret: black screen with message
      const blackout = document.createElement('div');
      blackout.className = 'zoro-blackout';
      blackout.innerHTML = '<div class="zoro-blackout-text">Zoro a encore perdu le chemin…</div>';
      document.body.appendChild(blackout);
      setTimeout(() => {
        blackout.style.opacity = '0';
        setTimeout(() => blackout.remove(), 1000);
      }, 2500);
    }
  }

  function deactivateZoro() {
    zoroActive = false;
    document.body.classList.remove('zoro-mode', 'zoro-freeze');
    document.body.style.cursor = '';
    ['zoro-tint','zoro-compass'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });
    document.querySelectorAll('.zoro-minimap, .zoro-fake-cursor, .zoro-blackout').forEach(el => el.remove());
    if (zoroInputLag) { clearInterval(zoroInputLag); zoroInputLag = null; }
    if (zoroScrollPivot) { window.removeEventListener('scroll', zoroScrollPivot); zoroScrollPivot = null; }
    document.removeEventListener('click', zoroInsistCheck);
    const pivotEl = document.querySelector('.grid-container') || document.body;
    if (pivotEl) pivotEl.style.transform = '';
    if (window.__zoroCleanup) {
      clearInterval(window.__zoroCleanup.spinCompass);
      clearInterval(window.__zoroCleanup.msgInterval);
      document.removeEventListener('mousemove', window.__zoroCleanup.trackMouse);
      delete window.__zoroCleanup;
    }
    delete document.body.dataset.easterActive;
    spawnFloatingText('Tu as retrouvé ton chemin… cette fois. 🗡️', 'zoro');
  }

  function injectZoroStyles() {
    if (document.getElementById('zoro-styles')) return;
    const s = document.createElement('style');
    s.id = 'zoro-styles';
    s.textContent = `
      .zoro-freeze { animation: zoroFreeze 0.5s steps(1) forwards; pointer-events:none; }
      @keyframes zoroFreeze { 0%,100%{filter:none} 50%{filter:brightness(0.3) saturate(0) contrast(1.5)} }

      body.zoro-mode { filter: hue-rotate(85deg) saturate(0.7) brightness(0.9); transition: filter 0.5s; }

      .zoro-tint {
        position: fixed; inset: 0; pointer-events: none; z-index: 8000;
        background: rgba(0, 60, 10, 0.18);
        mix-blend-mode: color;
      }

      .zoro-compass {
        position: fixed; bottom: 80px; right: 24px; z-index: 9500;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .zoro-compass-ring {
        width: 80px; height: 80px; border-radius: 50%;
        border: 2px solid rgba(100,200,80,0.6);
        background: rgba(0,30,5,0.8);
        display: flex; align-items: center; justify-content: center;
        position: relative;
        box-shadow: 0 0 20px rgba(60,200,60,0.4);
      }
      .zoro-compass-needle {
        font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #4dff80;
        transition: transform 0.5s cubic-bezier(.36,.07,.19,.97);
        text-shadow: 0 0 8px #4dff80;
      }
      .zoro-compass-dirs { position: absolute; inset: 0; }
      .zoro-d { position: absolute; font-size: 9px; color: rgba(100,200,80,0.5); font-family: 'DM Mono', monospace; }
      .zoro-dn { top: 4px; left: 50%; transform: translateX(-50%); }
      .zoro-ds { bottom: 4px; left: 50%; transform: translateX(-50%); }
      .zoro-dw { left: 4px; top: 50%; transform: translateY(-50%); }
      .zoro-de { right: 4px; top: 50%; transform: translateY(-50%); }
      .zoro-compass-label { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(100,200,80,0.6); letter-spacing: 2px; animation: zoroBlink 1s steps(2) infinite; }
      @keyframes zoroBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }

      .zoro-minimap {
        position: fixed; bottom: 80px; left: 24px; z-index: 9500;
        width: 120px; height: 80px;
        background: rgba(0,30,5,0.85); border: 1px solid rgba(100,200,80,0.4);
        border-radius: 8px; display: flex; align-items:center; justify-content:center;
        font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(100,200,80,0.7);
        text-align: center; line-height: 1.5;
        transition: transform 0.8s cubic-bezier(.36,.07,.19,.97);
        box-shadow: 0 0 15px rgba(60,200,60,0.2);
      }

      .zoro-fake-cursor {
        position: fixed; width: 16px; height: 24px; pointer-events: none;
        z-index: 99999; transform: translate(-2px, 0);
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='24'%3E%3Cpolygon points='0,0 0,20 5,15 8,22 10,21 7,14 13,14' fill='%2300ff44' stroke='black' stroke-width='1'/%3E%3C/svg%3E") no-repeat;
      }

      .zoro-blackout {
        position: fixed; inset: 0; background: #000; z-index: 999999;
        display: flex; align-items:center; justify-content:center;
        transition: opacity 1s;
      }
      .zoro-blackout-text {
        font-family: 'Bebas Neue', sans-serif; font-size: 36px; color: #4dff80;
        letter-spacing: 4px; text-shadow: 0 0 20px #4dff80;
        animation: zoroTextReveal 2s ease-out forwards;
      }
      @keyframes zoroTextReveal {
        0%{opacity:0;letter-spacing:20px} 40%{opacity:1;letter-spacing:4px} 100%{opacity:1}
      }

      .g5-float-text.zoro, .ee-float-text.zoro {
        color: #4dff80 !important;
        text-shadow: 2px 2px 0 #003a00, -1px -1px 0 #000 !important;
      }
    `;
    document.head.appendChild(s);
  }


   /* ═══════════════════════════════════════════════════════════
     🌀  3. LAW — ROOM / Shambles System
  ═══════════════════════════════════════════════════════════ */
  let roomActive = false;
  let roomSphere = null;
  let roomDragging = null;
  let roomDragOffsetX = 0, roomDragOffsetY = 0;
  let roomSphereCx = 0, roomSphereCy = 0;
  let roomSphereR = 220;
  let lastSwapTargets = [];

  function activateRoom() {
    document.body.dataset.easterActive = 'room';
    roomActive = true;
    injectRoomStyles();
    playCartoonSound('scan');

    // Create ROOM sphere
    roomSphere = document.createElement('div');
    roomSphere.className = 'room-sphere';
    roomSphere.id = 'room-sphere';
    roomSphereCx = window.innerWidth / 2;
    roomSphereCy = window.innerHeight / 2;
    updateSpherePosition();
    document.body.appendChild(roomSphere);

    // Shambles button
    const shamblesBtn = document.createElement('button');
    shamblesBtn.className = 'room-shambles-btn';
    shamblesBtn.id = 'room-shambles-btn';
    shamblesBtn.textContent = 'SHAMBLES';
    shamblesBtn.addEventListener('click', doShambles);
    document.body.appendChild(shamblesBtn);

    // Exit button
    const exitBtn = document.createElement('button');
    exitBtn.className = 'room-exit-btn';
    exitBtn.textContent = '× EXIT ROOM';
    exitBtn.addEventListener('click', deactivateRoom);
    document.body.appendChild(exitBtn);

    // Scan text
    spawnFloatingText('ROOM', 'room');
    setTimeout(() => spawnFloatingText('Scan complete', 'room'), 1000);
    setTimeout(() => spawnFloatingText('Shambles ready...', 'room'), 2200);

    // Sphere follows mouse
    const sphereFollow = (e) => {
      if (!roomActive) return;
      roomSphereCx = e.clientX;
      roomSphereCy = e.clientY;
      updateSpherePosition();
      highlightElementsInRoom();
    };
    document.addEventListener('mousemove', sphereFollow);
    window.__roomCleanup = { sphereFollow };

    // Elements inside ROOM become draggable
    document.addEventListener('mousedown', roomMouseDown);
    document.addEventListener('mousemove', roomMouseMove);
    document.addEventListener('mouseup', roomMouseUp);

    // Auto-deactivate after 30s
    setTimeout(deactivateRoom, 30000);
  }

  function updateSpherePosition() {
    if (!roomSphere) return;
    roomSphere.style.left = (roomSphereCx - roomSphereR) + 'px';
    roomSphere.style.top  = (roomSphereCy - roomSphereR) + 'px';
  }

  function isInsideRoom(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - roomSphereCx;
    const dy = cy - roomSphereCy;
    return (dx * dx + dy * dy) < (roomSphereR * roomSphereR);
  }

  function highlightElementsInRoom() {
    const targets = document.querySelectorAll('.tile, .proj-card, .xp-item, .tag');
    targets.forEach(el => {
      if (isInsideRoom(el)) {
        el.classList.add('room-highlight');
      } else {
        el.classList.remove('room-highlight');
        el.classList.remove('room-dragging');
      }
    });
  }

  function roomMouseDown(e) {
    if (!roomActive) return;
    const el = e.target.closest('.tile, .proj-card');
    if (!el || !isInsideRoom(el)) return;
    roomDragging = el;
    const rect = el.getBoundingClientRect();
    roomDragOffsetX = e.clientX - rect.left;
    roomDragOffsetY = e.clientY - rect.top;
    el.classList.add('room-dragging');
    el.classList.add('room-ghost');
    // Save original position in DOM flow via a placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'room-placeholder';
    placeholder.style.cssText = `
      width: ${rect.width}px;
      height: ${rect.height}px;
      display: inline-block;
      pointer-events: none;
      opacity: 0;
      flex-shrink: 0;
    `;
    el.parentNode.insertBefore(placeholder, el);
    el.__roomPlaceholder = placeholder;
    // Detach to body for free movement
    el.style.position = 'fixed';
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.width = rect.width + 'px';
    el.style.height = rect.height + 'px';
    el.style.zIndex = '9800';
    el.style.margin = '0';
    document.body.appendChild(el);
    e.preventDefault();
    playCartoonSound('whoosh');
  }

  function roomMouseMove(e) {
    if (!roomActive || !roomDragging) return;
    const el = roomDragging;
    el.style.left = (e.clientX - roomDragOffsetX) + 'px';
    el.style.top  = (e.clientY - roomDragOffsetY) + 'px';
    el.style.transition = 'none';

    // Check for magnetic snap to another element
    const targets = document.querySelectorAll('.tile, .proj-card');
    let closestTarget = null;
    let closestDist = Infinity;
    targets.forEach(other => {
      if (other === el) return;
      const rect1 = el.getBoundingClientRect();
      const rect2 = other.getBoundingClientRect();
      const dx = (rect1.left + rect1.width/2) - (rect2.left + rect2.width/2);
      const dy = (rect1.top  + rect1.height/2) - (rect2.top  + rect2.height/2);
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 120) {
        other.classList.add('room-snap-target');
        if (dist < closestDist) { closestDist = dist; closestTarget = other; }
      } else {
        other.classList.remove('room-snap-target');
      }
    });
    lastSwapTargets = closestTarget ? [el, closestTarget] : [];
  }

  function roomMouseUp(e) {
    if (!roomActive || !roomDragging) return;
    const el = roomDragging;
    roomDragging = null;

    // Remove all snap-target highlights
    document.querySelectorAll('.room-snap-target').forEach(t => t.classList.remove('room-snap-target'));

    const placeholder = el.__roomPlaceholder;
    delete el.__roomPlaceholder;

    // Reset inline styles applied during drag
    el.style.position = '';
    el.style.left = ''; el.style.top = '';
    el.style.width = ''; el.style.height = '';
    el.style.zIndex = '';
    el.style.margin = '';
    el.style.transition = '';
    el.classList.remove('room-dragging', 'room-ghost');

    if (lastSwapTargets.length === 2) {
      // Swap: put el where target is, target where placeholder is
      const [, swapWith] = lastSwapTargets;
      lastSwapTargets = [];

      // Insert el before swapWith
      swapWith.parentNode.insertBefore(el, swapWith);
      // Put swapWith where placeholder was
      placeholder.parentNode.insertBefore(swapWith, placeholder);
      placeholder.remove();

      // Animate both
      el.classList.add('room-shambles-anim');
      swapWith.classList.add('room-shambles-anim');
      setTimeout(() => {
        el.classList.remove('room-shambles-anim');
        swapWith.classList.remove('room-shambles-anim');
      }, 300);
      playCartoonSound('slice');
      spawnFloatingText('Shambles ✓', 'room');
    } else {
      // No swap target — put el back at its original placeholder position
      placeholder.parentNode.insertBefore(el, placeholder);
      placeholder.remove();
    }
  }

  function doShambles() {
    const tiles = Array.from(document.querySelectorAll('.tile, .proj-card')).filter(el => isInsideRoom(el));
    if (tiles.length < 2) {
      spawnFloatingText('Not enough elements in ROOM', 'room');
      return;
    }
    // Pick two random tiles inside ROOM
    const shuffled = tiles.sort(() => Math.random() - 0.5);
    const [a, b] = shuffled;
    playCartoonSound('slice');
    spawnFloatingText('Shambles', 'room');
    a.classList.add('room-shambles-anim');
    b.classList.add('room-shambles-anim');
    setTimeout(() => {
      swapElements(a, b);
      a.classList.remove('room-shambles-anim');
      b.classList.remove('room-shambles-anim');
    }, 220);
  }

  function swapElements(a, b) {
    const aParent = a.parentNode, aNext = a.nextSibling;
    const bParent = b.parentNode, bNext = b.nextSibling;
    // After-image clones
    const ghostA = a.cloneNode(true);
    const ghostB = b.cloneNode(true);
    ghostA.classList.add('room-after-image');
    ghostB.classList.add('room-after-image');
    const rA = a.getBoundingClientRect();
    const rB = b.getBoundingClientRect();
    ghostA.style.cssText = `position:fixed;left:${rA.left}px;top:${rA.top}px;width:${rA.width}px;height:${rA.height}px;`;
    ghostB.style.cssText = `position:fixed;left:${rB.left}px;top:${rB.top}px;width:${rB.width}px;height:${rB.height}px;`;
    document.body.appendChild(ghostA);
    document.body.appendChild(ghostB);
    setTimeout(() => { ghostA.remove(); ghostB.remove(); }, 500);

    if (aParent === bParent) {
      aParent.insertBefore(b, aNext === b ? a : aNext);
      bParent.insertBefore(a, bNext === a ? b : bNext);
    } else {
      if (bNext) bParent.insertBefore(a, bNext); else bParent.appendChild(a);
      if (aNext) aParent.insertBefore(b, aNext); else aParent.appendChild(b);
    }
  }

  function deactivateRoom() {
    roomActive = false;
    if (roomSphere) { roomSphere.remove(); roomSphere = null; }
    document.querySelectorAll('.room-shambles-btn, .room-exit-btn').forEach(el => el.remove());
    document.querySelectorAll('.room-highlight, .room-dragging, .room-ghost, .room-snap-target, .room-shambles-anim, .room-placeholder').forEach(el => {
      el.classList.remove('room-highlight','room-dragging','room-ghost','room-snap-target','room-shambles-anim');
      if (el.classList.contains('room-placeholder')) el.remove();
    });
    document.removeEventListener('mousedown', roomMouseDown);
    document.removeEventListener('mousemove', roomMouseMove);
    document.removeEventListener('mouseup', roomMouseUp);
    if (window.__roomCleanup) {
      document.removeEventListener('mousemove', window.__roomCleanup.sphereFollow);
      delete window.__roomCleanup;
    }
    delete document.body.dataset.easterActive;
    spawnFloatingText('ROOM dissolved.', 'room');
  }

  function injectRoomStyles() {
    if (document.getElementById('room-styles')) return;
    const s = document.createElement('style');
    s.id = 'room-styles';
    s.textContent = `
      .room-sphere {
        position: fixed; pointer-events: none; z-index: 8500;
        width: ${roomSphereR * 2}px; height: ${roomSphereR * 2}px;
        border-radius: 50%;
        border: 2px solid rgba(0, 210, 255, 0.55);
        background: radial-gradient(ellipse, rgba(0,180,255,0.07) 0%, rgba(0,80,180,0.04) 60%, transparent 80%);
        box-shadow: 0 0 40px rgba(0,200,255,0.25), inset 0 0 60px rgba(0,120,255,0.08);
        animation: roomSphereAppear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
        /* Subtle grid */
        background-image:
          radial-gradient(ellipse, rgba(0,180,255,0.07) 0%, rgba(0,80,180,0.04) 60%, transparent 80%),
          repeating-linear-gradient(0deg, rgba(0,200,255,0.03) 0px, transparent 1px, transparent 30px, rgba(0,200,255,0.03) 30px),
          repeating-linear-gradient(90deg, rgba(0,200,255,0.03) 0px, transparent 1px, transparent 30px, rgba(0,200,255,0.03) 30px);
        transition: left 0.05s linear, top 0.05s linear;
      }
      @keyframes roomSphereAppear {
        0%  { transform: scale(0); opacity: 0; }
        100%{ transform: scale(1); opacity: 1; }
      }

      .room-highlight {
        outline: 1.5px solid rgba(0,220,255,0.7) !important;
        box-shadow: 0 0 18px rgba(0,200,255,0.35), 0 0 4px rgba(0,200,255,0.5) inset !important;
        transition: box-shadow 0.2s, outline 0.2s !important;
      }

      .room-dragging {
        opacity: 0.7; transform: scale(1.03) !important;
        transition: none !important;
        cursor: grabbing !important;
      }
      .room-ghost {
        filter: drop-shadow(0 0 14px rgba(0,200,255,0.8));
      }

      .room-snap-target {
        outline: 2px dashed rgba(0,255,220,0.9) !important;
        animation: roomSnapPulse 0.3s steps(2) infinite !important;
      }
      @keyframes roomSnapPulse { 0%,100%{box-shadow:0 0 20px rgba(0,255,200,0.5)} 50%{box-shadow:0 0 4px rgba(0,255,200,0.1)} }

      .room-shambles-anim {
        animation: roomShambles 0.22s ease-in-out forwards !important;
      }
      @keyframes roomShambles {
        0%  { filter:none; transform:scale(1) }
        40% { filter:blur(8px) brightness(2); transform:scale(0.9) skewX(8deg) }
        70% { filter:blur(4px); transform:scale(1.05) skewX(-4deg) }
        100%{ filter:none; transform:scale(1) }
      }

      .room-after-image {
        pointer-events: none; z-index: 8800;
        opacity: 0.5; filter: blur(3px) brightness(1.5) hue-rotate(180deg);
        animation: roomAfterFade 0.5s ease-out forwards;
        border-radius: 12px;
        overflow: hidden;
      }
      @keyframes roomAfterFade {
        0%  { opacity: 0.55; transform: scale(1); }
        100%{ opacity: 0; transform: scale(0.8); }
      }

      .room-shambles-btn {
        position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
        z-index: 9600; padding: 12px 36px;
        background: rgba(0,20,40,0.9);
        border: 2px solid #00d4ff; border-radius: 4px;
        color: #00d4ff; font-family: 'Bebas Neue', sans-serif;
        font-size: 22px; letter-spacing: 5px; cursor: pointer;
        box-shadow: 0 0 20px rgba(0,200,255,0.4), inset 0 0 10px rgba(0,200,255,0.1);
        transition: all 0.15s;
        text-shadow: 0 0 10px rgba(0,200,255,0.8);
      }
      .room-shambles-btn:hover {
        background: rgba(0,200,255,0.15);
        box-shadow: 0 0 40px rgba(0,200,255,0.7), inset 0 0 20px rgba(0,200,255,0.2);
        transform: translateX(-50%) scale(1.04);
      }
      .room-shambles-btn:active { transform: translateX(-50%) scale(0.97); }

      .room-exit-btn {
        position: fixed; bottom: 28px; right: 24px; z-index: 9600;
        padding: 8px 16px; background: rgba(0,20,40,0.85);
        border: 1px solid rgba(0,200,255,0.3); border-radius: 4px;
        color: rgba(0,200,255,0.5); font-family: 'DM Mono', monospace;
        font-size: 11px; letter-spacing: 2px; cursor: pointer;
        transition: all 0.15s;
      }
      .room-exit-btn:hover { border-color: rgba(0,200,255,0.7); color: #00d4ff; }

      .ee-float-text.room {
        color: #00d4ff !important;
        text-shadow: 2px 2px 0 #003060, 0 0 20px rgba(0,200,255,0.8) !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     🔊  Sound utilities (Web Audio API — no external files)
  ═══════════════════════════════════════════════════════════ */
  let _audioCtx = null;
  function getAudioCtx() {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  }

  function playCartoonSound(type) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);

      if (type === 'boing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(); osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'scan') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'whoosh') {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = 'bandpass'; filt.frequency.value = 2000; filt.Q.value = 0.5;
        src.connect(filt); filt.connect(gain);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        src.start(); src.stop(ctx.currentTime + 0.3);
        return;
      } else if (type === 'slice') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
      }
    } catch(e) { /* AudioContext blocked — silent fallback */ }
  }

  function playAmbientSound(type) {
    try {
      const ctx = getAudioCtx();
      if (type === 'wind') {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass'; filt.frequency.value = 600;
        const gain = ctx.createGain();
        src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        src.start(); src.stop(ctx.currentTime + 2.1);
      }
    } catch(e) {}
  }


  /* ═══════════════════════════════════════════════════════════
     🗒️  Shared: floating text utility
  ═══════════════════════════════════════════════════════════ */
  function spawnFloatingText(text, theme) {
    const el = document.createElement('div');
    el.className = 'ee-float-text' + (theme ? ' ' + theme : '');
    el.textContent = text;
    el.style.cssText = `
      left: ${15 + Math.random() * 60}%;
      top: ${20 + Math.random() * 55}%;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  
  /* ═══════════════════════════════════════════════════════════
     🧠  JOJO #1. ZA WARUDO — Time Stop (DIO)
     Trigger: zawarudo
  ═══════════════════════════════════════════════════════════ */
  let zawarudoActive = false;
  let zawarudoFrozenElements = [];
  let zawarudoScrollLocked = false;
  let zawarudoMovableClickHandler = null;

  function activateZaWarudo() {
    document.body.dataset.easterActive = 'zawarudo';
    zawarudoActive = true;
    injectZaWarudoStyles();

    // Yellow flash
    const flash = document.createElement('div');
    flash.className = 'zw-flash';
    document.body.appendChild(flash);

    // "ZA WARUDO!" text slam
    const title = document.createElement('div');
    title.className = 'zw-title';
    title.textContent = '「ZA WARUDO」';
    document.body.appendChild(title);

    // Sound: dramatic stab
    playZaWarudoSound('timestop');

    setTimeout(() => {
      flash.remove();
      // Freeze everything
      document.body.classList.add('zw-frozen');

      // Freeze all animations
      document.querySelectorAll('*').forEach(el => {
        const style = getComputedStyle(el);
        if (style.animationName !== 'none') {
          el.style.animationPlayState = 'paused';
          zawarudoFrozenElements.push(el);
        }
      });

      // Lock scroll
      zawarudoScrollLocked = true;
      const scrollY = window.scrollY;
      const lockScroll = () => { if (zawarudoScrollLocked) window.scrollTo(0, scrollY); };
      window.addEventListener('scroll', lockScroll, { passive: true });
      window.__zwScrollLock = lockScroll;

      // Yellow VHS overlay
      const overlay = document.createElement('div');
      overlay.id = 'zw-overlay';
      overlay.className = 'zw-overlay';
      document.body.appendChild(overlay);

      // Subtitle
      const sub = document.createElement('div');
      sub.className = 'zw-subtitle';
      sub.textContent = 'Le temps s\'est arrêté…';
      document.body.appendChild(sub);

      // Clickable frozen elements — they can be nudged
      zawarudoMovableClickHandler = (e) => {
        const card = e.target.closest('.proj-card, .tile, .tag, .skill-bar');
        if (!card) return;
        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 40;
        const rot = (Math.random() - 0.5) * 20;
        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        card.dataset.zwMoved = 'true';
        // tiny impact ripple
        const ripple = document.createElement('div');
        ripple.className = 'zw-impact';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        playZaWarudoSound('crack');
      };
      document.addEventListener('click', zawarudoMovableClickHandler);

    }, 300);

    // Auto resume after 9 seconds (DIO can stop time for 9 seconds 😉)
    setTimeout(resumeZaWarudo, 9000);
  }

  function resumeZaWarudo() {
    if (!zawarudoActive) return;
    zawarudoActive = false;

    // "Time resumes" sound
    playZaWarudoSound('resume');

    // Slam back all moved elements
    document.querySelectorAll('[data-zw-moved]').forEach(el => {
      el.style.transition = 'transform 0.08s steps(1)';
      el.style.transform = '';
      delete el.dataset.zwMoved;
      // snap jolt
      el.classList.add('zw-snap');
      setTimeout(() => el.classList.remove('zw-snap'), 300);
    });

    // Unfreeze
    zawarudoFrozenElements.forEach(el => { el.style.animationPlayState = ''; });
    zawarudoFrozenElements = [];
    document.body.classList.remove('zw-frozen');

    // Remove overlay
    document.getElementById('zw-overlay')?.remove();
    document.querySelectorAll('.zw-subtitle, .zw-title').forEach(el => el.remove());

    // Unlock scroll
    zawarudoScrollLocked = false;
    if (window.__zwScrollLock) {
      window.removeEventListener('scroll', window.__zwScrollLock);
      delete window.__zwScrollLock;
    }
    if (zawarudoMovableClickHandler) {
      document.removeEventListener('click', zawarudoMovableClickHandler);
      zawarudoMovableClickHandler = null;
    }

    spawnFloatingText('…Toki wo ugokidasu.', 'zw');
    delete document.body.dataset.easterActive;
  }

  function playZaWarudoSound(type) {
    try {
      const ctx = getAudioCtx();
      if (type === 'timestop') {
        // Deep dramatic BWAAAAM
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination);
        osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(60, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);
        osc2.type = 'square';  osc2.frequency.setValueAtTime(120, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc1.start(); osc2.start();
        osc1.stop(ctx.currentTime + 1.5); osc2.stop(ctx.currentTime + 1.5);
      } else if (type === 'crack') {
        // Quick knife-stab click
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = ctx.createBufferSource(); src.buffer = buf;
        const gain = ctx.createGain();
        src.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        src.start();
      } else if (type === 'resume') {
        // Fast frequency sweep up
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      }
    } catch(e) {}
  }

  function injectZaWarudoStyles() {
    if (document.getElementById('zw-styles')) return;
    const s = document.createElement('style');
    s.id = 'zw-styles';
    s.textContent = `
      .zw-flash {
        position: fixed; inset: 0; z-index: 99999;
        background: #ffe500;
        animation: zwFlashAnim 0.3s ease-out forwards;
      }
      @keyframes zwFlashAnim { 0%{opacity:1} 100%{opacity:0} }

      .zw-title {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
        z-index: 99998; pointer-events: none;
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(36px, 8vw, 96px);
        color: #ffe500;
        text-shadow: 4px 4px 0 #000, -2px -2px 0 #000, 6px 0 0 #b8a000;
        letter-spacing: 6px;
        animation: zwTitleSlam 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        white-space: nowrap;
      }
      @keyframes zwTitleSlam {
        0%  { opacity:0; transform: translate(-50%,-50%) scale(2.5); }
        100%{ opacity:1; transform: translate(-50%,-50%) scale(1); }
      }

      body.zw-frozen * {
        cursor: crosshair !important;
      }
      body.zw-frozen .proj-card,
      body.zw-frozen .tile,
      body.zw-frozen .tag,
      body.zw-frozen .skill-bar {
        filter: grayscale(0.6) brightness(0.85) !important;
        cursor: pointer !important;
      }

      .zw-overlay {
        position: fixed; inset: 0; z-index: 9900; pointer-events: none;
        background: rgba(255, 229, 0, 0.06);
        mix-blend-mode: color-dodge;
        animation: zwVHS 0.12s steps(2) infinite;
      }
      @keyframes zwVHS {
        0%  { opacity:1; transform: translate(0,0); }
        25% { opacity:0.8; transform: translate(2px, -1px); }
        50% { opacity:1; transform: translate(-1px, 2px); }
        75% { opacity:0.9; transform: translate(1px, 1px); }
        100%{ opacity:1; transform: translate(0,0); }
      }

      .zw-subtitle {
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        z-index: 99998; pointer-events: none;
        font-family: 'DM Mono', monospace;
        font-size: 14px; letter-spacing: 4px;
        color: rgba(255,229,0,0.8);
        text-shadow: 0 0 12px rgba(255,229,0,0.6);
        animation: zwBlink 1.5s steps(2) infinite;
      }
      @keyframes zwBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }

      .zw-impact {
        position: fixed; z-index: 99999; pointer-events: none;
        width: 60px; height: 60px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 3px solid #ffe500;
        animation: zwImpactAnim 0.6s ease-out forwards;
      }
      @keyframes zwImpactAnim {
        0%  { transform: translate(-50%,-50%) scale(0.2); opacity:1; }
        100%{ transform: translate(-50%,-50%) scale(2.5); opacity:0; }
      }

      .zw-snap {
        animation: zwSnapAnim 0.2s steps(3) forwards !important;
      }
      @keyframes zwSnapAnim {
        0%  { transform: translate(4px,-4px) skewX(-5deg); }
        33% { transform: translate(-3px, 3px) skewX(3deg); }
        66% { transform: translate(2px,-2px); }
        100%{ transform: translate(0,0); }
      }

      .ee-float-text.zw {
        color: #ffe500 !important;
        text-shadow: 2px 2px 0 #000, 0 0 16px rgba(255,220,0,0.7) !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     👊  JOJO #2. ORA ORA ORA — Star Platinum Rush
     Trigger: ora
  ═══════════════════════════════════════════════════════════ */
  let oraActive = false;
  let oraCombo = 0;
  let oraComboDecayTimer = null;
  let oraClickHandler = null;
  let oraInterval = null;

  function activateOra() {
    document.body.dataset.easterActive = 'ora';
    oraActive = true;
    oraCombo = 0;
    injectOraStyles();

    // Motion blur overlay
    document.body.classList.add('ora-mode');

    // Combo meter UI
    const meter = document.createElement('div');
    meter.id = 'ora-meter';
    meter.className = 'ora-meter';
    meter.innerHTML = `
      <div class="ora-meter-label">COMBO</div>
      <div class="ora-meter-count" id="ora-count">0</div>
      <div class="ora-meter-bar-wrap"><div class="ora-meter-bar" id="ora-bar"></div></div>
    `;
    document.body.appendChild(meter);

    spawnFloatingText('「ORA ORA ORA!」', 'ora');

    // Cards shake from the start
    shakeCardsOra(1);

    // Click = punch
    oraClickHandler = (e) => {
      if (!oraActive) return;
      oraCombo++;
      updateOraMeter();

      // ORA floating text
      const ora = document.createElement('div');
      ora.className = 'ora-hit';
      ora.textContent = ['ORA!', 'ORA!!', 'ORAAAA!', '👊', '💥'][Math.floor(Math.random() * 5)];
      ora.style.left = e.clientX + 'px';
      ora.style.top  = e.clientY + 'px';
      document.body.appendChild(ora);
      setTimeout(() => ora.remove(), 700);

      // Screen micro-shake
      document.body.style.animation = 'none';
      requestAnimationFrame(() => {
        document.body.style.animation = '';
        document.body.classList.add('ora-shake');
        setTimeout(() => document.body.classList.remove('ora-shake'), 150);
      });

      // Shake cards harder based on combo
      shakeCardsOra(Math.min(oraCombo / 5 + 1, 4));
      playOraSound();

      // Reset decay timer
      clearTimeout(oraComboDecayTimer);
      oraComboDecayTimer = setTimeout(() => {
        if (oraActive) deactivateOra();
      }, 4000);
    };
    document.addEventListener('click', oraClickHandler);

    // Auto deactivate if inactive too long
    oraComboDecayTimer = setTimeout(() => { if (oraActive) deactivateOra(); }, 5000);
  }

  function updateOraMeter() {
    const count = document.getElementById('ora-count');
    const bar   = document.getElementById('ora-bar');
    if (count) count.textContent = oraCombo;
    if (bar) {
      const pct = Math.min((oraCombo / 50) * 100, 100);
      bar.style.width = pct + '%';
      // Color escalation
      bar.style.background = oraCombo < 15
        ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
        : oraCombo < 30
        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
        : 'linear-gradient(90deg, #ef4444, #f97316)';
    }
    // Escalate animations
    if (oraCombo > 20) document.body.classList.add('ora-overdrive');
    if (oraCombo > 40) document.body.classList.add('ora-max');
  }

  function shakeCardsOra(intensity) {
    const cards = document.querySelectorAll('.proj-card, .tile');
    cards.forEach((c, i) => {
      c.style.setProperty('--ora-intensity', intensity);
      c.classList.remove('ora-card-shake');
      void c.offsetWidth; // reflow
      c.classList.add('ora-card-shake');
      c.style.animationDelay = (i * 0.04) + 's';
    });
  }

  function playOraSound() {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      const baseFreq = 180 + Math.min(oraCombo * 8, 400);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  }

  function deactivateOra() {
    oraActive = false;
    clearTimeout(oraComboDecayTimer);
    document.body.classList.remove('ora-mode', 'ora-overdrive', 'ora-max', 'ora-shake');
    document.querySelectorAll('.proj-card, .tile').forEach(c => {
      c.classList.remove('ora-card-shake');
      c.style.animationDelay = '';
    });
    document.getElementById('ora-meter')?.remove();
    if (oraClickHandler) {
      document.removeEventListener('click', oraClickHandler);
      oraClickHandler = null;
    }
    if (oraCombo > 30) spawnFloatingText(`${oraCombo} hits! STAR PLATINUM! ⭐`, 'ora');
    else spawnFloatingText('やれやれだぜ… ' + oraCombo + ' hits', 'ora');
    oraCombo = 0;
    delete document.body.dataset.easterActive;
  }

  function injectOraStyles() {
    if (document.getElementById('ora-styles')) return;
    const s = document.createElement('style');
    s.id = 'ora-styles';
    s.textContent = `
      body.ora-mode {
        --ora-blur: 1px;
        filter: contrast(1.05);
      }
      body.ora-overdrive { filter: contrast(1.15) saturate(1.3); }
      body.ora-max { filter: contrast(1.3) saturate(1.6) brightness(1.1); }

      body.ora-shake {
        animation: oraScreenShake 0.15s cubic-bezier(.36,.07,.19,.97) both !important;
      }
      @keyframes oraScreenShake {
        0%  { transform: translate(0,0); }
        20% { transform: translate(-4px, 2px); }
        40% { transform: translate(4px, -3px); }
        60% { transform: translate(-3px, 4px); }
        80% { transform: translate(3px, -2px); }
        100%{ transform: translate(0,0); }
      }

      .ora-card-shake {
        animation: oraCardShake calc(0.12s / max(var(--ora-intensity,1),1)) steps(3) 3 !important;
      }
      @keyframes oraCardShake {
        0%  { transform: translate(0,0) scale(1); }
        25% { transform: translate(calc(-5px * var(--ora-intensity,1)), 2px) scale(0.97); }
        50% { transform: translate(calc(5px * var(--ora-intensity,1)), -2px) scale(1.02); }
        75% { transform: translate(calc(-3px * var(--ora-intensity,1)), 1px) scale(0.99); }
        100%{ transform: translate(0,0) scale(1); }
      }

      .ora-hit {
        position: fixed; pointer-events: none; z-index: 99998;
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(20px, 4vw, 42px);
        color: #fff;
        text-shadow: 2px 2px 0 #1d4ed8, -1px -1px 0 #000;
        transform: translate(-50%, -50%);
        animation: oraHitAnim 0.7s ease-out forwards;
        white-space: nowrap;
        letter-spacing: 2px;
      }
      @keyframes oraHitAnim {
        0%  { opacity:1; transform: translate(-50%,-50%) scale(0.5) rotate(-8deg); }
        30% { opacity:1; transform: translate(-50%,-80%) scale(1.3) rotate(4deg); }
        100%{ opacity:0; transform: translate(-50%,-140%) scale(0.9) rotate(-2deg); }
      }

      .ora-meter {
        position: fixed; top: 24px; right: 24px; z-index: 9999;
        background: rgba(10, 15, 40, 0.92);
        border: 1.5px solid rgba(59,130,246,0.6);
        border-radius: 8px; padding: 12px 20px; min-width: 140px;
        font-family: 'Bebas Neue', sans-serif;
        box-shadow: 0 0 24px rgba(59,130,246,0.3);
        animation: oraMeterIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }
      @keyframes oraMeterIn {
        0%  { opacity:0; transform: scale(0.5) translateX(30px); }
        100%{ opacity:1; transform: scale(1) translateX(0); }
      }
      .ora-meter-label {
        font-size: 10px; letter-spacing: 4px; color: rgba(147,197,253,0.7);
      }
      .ora-meter-count {
        font-size: 48px; line-height: 1; color: #fff;
        text-shadow: 0 0 20px rgba(59,130,246,0.8);
        transition: transform 0.05s;
      }
      .ora-meter-bar-wrap {
        height: 4px; background: rgba(255,255,255,0.1);
        border-radius: 2px; margin-top: 6px; overflow: hidden;
      }
      .ora-meter-bar {
        height: 100%; width: 0%; border-radius: 2px;
        background: linear-gradient(90deg, #3b82f6, #60a5fa);
        transition: width 0.1s, background 0.3s;
      }

      .ee-float-text.ora {
        color: #fff !important;
        text-shadow: 2px 2px 0 #1d4ed8, -1px -1px 0 #000, 0 0 18px rgba(59,130,246,0.8) !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     💣  JOJO #3. KILLER QUEEN — Explosion System
     Trigger: killer
  ═══════════════════════════════════════════════════════════ */
  let killerActive = false;
  let killerBombClickHandler = null;
  let killerBombCards = new Set();

  function activateKillerQueen() {
    document.body.dataset.easterActive = 'killer';
    killerActive = true;
    injectKillerStyles();

    document.body.classList.add('killer-mode');

    // Plant bombs on all cards
    const cards = document.querySelectorAll('.proj-card, .tile');
    cards.forEach(card => {
      if (killerBombCards.has(card)) return;
      killerBombCards.add(card);
      const bomb = document.createElement('div');
      bomb.className = 'killer-bomb-icon';
      bomb.textContent = '💣';
      card.style.position = 'relative';
      card.appendChild(bomb);
    });

    spawnFloatingText('「KILLER QUEEN」', 'killer');
    setTimeout(() => spawnFloatingText('すべてを爆破する…', 'killer'), 1200);

    killerBombClickHandler = (e) => {
      if (!killerActive) return;
      const card = e.target.closest('.proj-card, .tile');
      if (!card || card.dataset.killerExploding) return;
      card.dataset.killerExploding = 'true';

      const rect = card.getBoundingClientRect();
      doKillerExplosion(rect.left + rect.width/2, rect.top + rect.height/2);

      // Hide card briefly
      card.style.transition = 'opacity 0.05s, transform 0.05s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';

      playKillerSound();

      // Come back like nothing happened
      setTimeout(() => {
        card.style.transition = 'opacity 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        card.style.opacity = '';
        card.style.transform = '';
        delete card.dataset.killerExploding;
        // Replant bomb
        const bomb = card.querySelector('.killer-bomb-icon');
        if (bomb) { bomb.remove(); }
        const newBomb = document.createElement('div');
        newBomb.className = 'killer-bomb-icon';
        newBomb.textContent = '💣';
        card.appendChild(newBomb);
      }, 1200);
    };
    document.addEventListener('click', killerBombClickHandler);

    // Auto deactivate after 20s
    setTimeout(deactivateKillerQueen, 20000);
  }

  function doKillerExplosion(cx, cy) {
    // CSS explosion ring
    const exp = document.createElement('div');
    exp.className = 'killer-explosion';
    exp.style.left = cx + 'px';
    exp.style.top  = cy + 'px';
    document.body.appendChild(exp);

    // Particles
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'killer-particle';
      const angle = (i / 14) * Math.PI * 2;
      const dist  = 60 + Math.random() * 80;
      p.style.left = cx + 'px';
      p.style.top  = cy + 'px';
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.textContent = ['💥', '🔥', '✨', '💨'][Math.floor(Math.random() * 4)];
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }

    // Distortion flash
    const distort = document.createElement('div');
    distort.className = 'killer-distort';
    distort.style.left = (cx - 100) + 'px';
    distort.style.top  = (cy - 100) + 'px';
    document.body.appendChild(distort);

    setTimeout(() => { exp.remove(); distort.remove(); }, 1000);
  }

  function playKillerSound() {
    try {
      const ctx = getAudioCtx();
      // Click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(); osc.stop(ctx.currentTime + 0.08);

      // Boom
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5) * 0.6;
      }
      const src = ctx.createBufferSource(); src.buffer = buf;
      const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 300;
      const g2   = ctx.createGain();
      src.connect(filt); filt.connect(g2); g2.connect(ctx.destination);
      g2.gain.setValueAtTime(0.5, ctx.currentTime + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      src.start(ctx.currentTime + 0.06);
    } catch(e) {}
  }

  function deactivateKillerQueen() {
    killerActive = false;
    document.body.classList.remove('killer-mode');
    killerBombCards.forEach(card => {
      const bomb = card.querySelector('.killer-bomb-icon');
      if (bomb) bomb.remove();
      card.style.opacity = '';
      card.style.transform = '';
    });
    killerBombCards.clear();
    if (killerBombClickHandler) {
      document.removeEventListener('click', killerBombClickHandler);
      killerBombClickHandler = null;
    }
    spawnFloatingText('Yoshikage Kira s\'éloigne tranquillement… 🧨', 'killer');
    delete document.body.dataset.easterActive;
  }

  function injectKillerStyles() {
    if (document.getElementById('killer-styles')) return;
    const s = document.createElement('style');
    s.id = 'killer-styles';
    s.textContent = `
      body.killer-mode .proj-card,
      body.killer-mode .tile {
        cursor: pointer !important;
      }

      .killer-bomb-icon {
        position: absolute; top: 8px; right: 10px;
        font-size: 20px; z-index: 10; pointer-events: none;
        animation: killerBombPulse 1.5s ease-in-out infinite;
        filter: drop-shadow(0 0 6px rgba(255,100,0,0.7));
      }
      @keyframes killerBombPulse {
        0%,100%{ transform: scale(1); filter: drop-shadow(0 0 4px rgba(255,100,0,0.5)); }
        50%    { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(255,60,0,0.9)); }
      }

      .killer-explosion {
        position: fixed; z-index: 99999; pointer-events: none;
        transform: translate(-50%, -50%);
        width: 20px; height: 20px; border-radius: 50%;
        background: radial-gradient(circle, #fff 0%, #ff8c00 30%, #ff2200 60%, transparent 80%);
        animation: killerExpAnim 0.8s ease-out forwards;
      }
      @keyframes killerExpAnim {
        0%  { transform: translate(-50%,-50%) scale(0.1); opacity:1; }
        40% { transform: translate(-50%,-50%) scale(8);   opacity:1; }
        100%{ transform: translate(-50%,-50%) scale(14);  opacity:0; }
      }

      .killer-particle {
        position: fixed; z-index: 99998; pointer-events: none;
        font-size: 18px;
        transform: translate(-50%,-50%);
        animation: killerParticleAnim 0.9s ease-out forwards;
      }
      @keyframes killerParticleAnim {
        0%  { opacity:1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
        100%{ opacity:0; transform: translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(0.3); }
      }

      .killer-distort {
        position: fixed; z-index: 99997; pointer-events: none;
        width: 200px; height: 200px; border-radius: 50%;
        border: 3px solid rgba(255,140,0,0.7);
        animation: killerDistortAnim 0.6s ease-out forwards;
      }
      @keyframes killerDistortAnim {
        0%  { transform: scale(0.3); opacity:1; }
        100%{ transform: scale(2.5); opacity:0; }
      }

      .ee-float-text.killer {
        color: #ff8c00 !important;
        text-shadow: 2px 2px 0 #000, 0 0 16px rgba(255,100,0,0.8) !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     ゴゴゴ  JOJO #4. MENACING — Ambient Horror
     Trigger: menace
  ═══════════════════════════════════════════════════════════ */
  let menaceActive = false;
  let menaceSpawnInterval = null;
  let menaceZoomInterval = null;

  function activateMenace() {
    document.body.dataset.easterActive = 'menace';
    menaceActive = true;
    injectMenaceStyles();

    // Vignette + dark overlay
    const overlay = document.createElement('div');
    overlay.id = 'menace-overlay';
    overlay.className = 'menace-overlay';
    document.body.appendChild(overlay);

    document.body.classList.add('menace-mode');

    // Spawn ゴゴゴゴ everywhere
    menaceSpawnInterval = setInterval(() => {
      if (!menaceActive) return;
      spawnGogogo();
    }, 400);

    // Slow creeping zoom
    let zoom = 1;
    const zoomDir = 1;
    menaceZoomInterval = setInterval(() => {
      if (!menaceActive) return;
      zoom = 1 + 0.003 * Math.sin(Date.now() / 2000);
      document.body.style.transform = `scale(${zoom})`;
    }, 50);

    playMenaceSound();

    // Auto deactivate after 15s
    setTimeout(deactivateMenace, 15000);
  }

  function spawnGogogo() {
    const glyphs = ['ゴ', 'ゴゴゴ', 'ゴゴゴゴ', 'ゴ ゴ ゴ'];
    const el = document.createElement('div');
    el.className = 'menace-gogo';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = (5 + Math.random() * 85) + '%';
    el.style.top  = (5 + Math.random() * 85) + '%';
    el.style.fontSize = (14 + Math.random() * 28) + 'px';
    el.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
    el.style.animationDuration = (2 + Math.random() * 3) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  function playMenaceSound() {
    try {
      const ctx = getAudioCtx();
      // Low ominous drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.setValueAtTime(50, ctx.currentTime + 0.5);
      osc.frequency.setValueAtTime(58, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
      osc.start(); osc.stop(ctx.currentTime + 4.1);
    } catch(e) {}
  }

  function deactivateMenace() {
    menaceActive = false;
    clearInterval(menaceSpawnInterval);
    clearInterval(menaceZoomInterval);
    document.body.classList.remove('menace-mode');
    document.body.style.transform = '';
    document.getElementById('menace-overlay')?.remove();
    document.querySelectorAll('.menace-gogo').forEach(el => el.remove());
    spawnFloatingText('…ゴゴゴゴゴゴ', 'menace');
    delete document.body.dataset.easterActive;
  }

  function injectMenaceStyles() {
    if (document.getElementById('menace-styles')) return;
    const s = document.createElement('style');
    s.id = 'menace-styles';
    s.textContent = `
      .menace-overlay {
        position: fixed; inset: 0; z-index: 9800; pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 35%, rgba(10,0,30,0.75) 100%);
        animation: menaceVignette 3s ease-in-out infinite alternate;
      }
      @keyframes menaceVignette {
        0%  { opacity: 0.7; }
        100%{ opacity: 1; }
      }

      body.menace-mode {
        filter: brightness(0.75) saturate(0.5) sepia(0.3);
        transition: filter 1.5s ease;
      }

      .menace-gogo {
        position: fixed; z-index: 9900; pointer-events: none;
        font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
        font-weight: 900;
        color: rgba(180, 100, 220, 0.55);
        text-shadow: 1px 1px 0 rgba(80,0,120,0.8);
        animation: menaceGogoAnim linear forwards;
      }
      @keyframes menaceGogoAnim {
        0%  { opacity: 0; transform: scale(0.6) rotate(var(--r, 0deg)); }
        20% { opacity: 1; }
        80% { opacity: 0.8; }
        100%{ opacity: 0; transform: scale(1.1) rotate(var(--r, 0deg)); }
      }

      .ee-float-text.menace {
        color: rgba(200,120,255,1) !important;
        text-shadow: 2px 2px 0 #000, 0 0 20px rgba(180,60,255,0.7) !important;
        font-size: 20px !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════
     🪞  JOJO #5. D4C — Mirror World
     Trigger: d4c
  ═══════════════════════════════════════════════════════════ */
  let d4cActive = false;
  let d4cMirrorState = false;
  let d4cDuplicates = [];

  function activateD4C() {
    document.body.dataset.easterActive = 'd4c';
    d4cActive = true;
    injectD4CStyles();

    // Dramatic flash
    const flash = document.createElement('div');
    flash.className = 'd4c-flash';
    document.body.appendChild(flash);

    spawnFloatingText('「DIRTY DEEDS DONE DIRT CHEAP」', 'd4c');

    setTimeout(() => {
      flash.remove();
      // Mirror the site
      d4cMirrorState = true;
      document.body.classList.add('d4c-mirror');

      // Altered color palette
      document.body.classList.add('d4c-colors');

      // Duplicate a few cards as "parallel universe" ghosts
      const cards = Array.from(document.querySelectorAll('.proj-card, .tile')).slice(0, 3);
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const ghost = card.cloneNode(true);
        ghost.className += ' d4c-duplicate';
        ghost.style.cssText = `
          position: fixed;
          left: ${window.innerWidth - rect.right}px;
          top: ${rect.top}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          z-index: 9700;
          pointer-events: none;
        `;
        document.body.appendChild(ghost);
        d4cDuplicates.push(ghost);
      });

      setTimeout(() => spawnFloatingText('Univers parallèle activé… t es con salod de laissé un odinateur ouvert', 'd4c'), 1000);
      setTimeout(() => spawnFloatingText('Funny Valentine says hello 🇺🇸', 'd4c'), 2500);

    }, 250);

    // Auto deactivate after 15s
    setTimeout(deactivateD4C, 15000);
  }

  function deactivateD4C() {
    d4cActive = false;
    document.body.classList.remove('d4c-mirror', 'd4c-colors');
    d4cDuplicates.forEach(el => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    });
    d4cDuplicates = [];
    spawnFloatingText('Retour à la réalité… pour l\'instant. 🪞', 'd4c');
    delete document.body.dataset.easterActive;
  }

  function injectD4CStyles() {
    if (document.getElementById('d4c-styles')) return;
    const s = document.createElement('style');
    s.id = 'd4c-styles';
    s.textContent = `
      .d4c-flash {
        position: fixed; inset: 0; z-index: 99999;
        background: linear-gradient(135deg, #fff 0%, #e0f0ff 50%, #fff 100%);
        animation: d4cFlashAnim 0.25s ease-out forwards;
      }
      @keyframes d4cFlashAnim { 0%{opacity:1} 100%{opacity:0} }

      body.d4c-mirror {
        transform: scaleX(-1);
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      }

      body.d4c-colors {
        filter: hue-rotate(185deg) saturate(1.3) contrast(1.05);
        transition: filter 0.5s;
      }

      .d4c-duplicate {
        border-radius: 12px;
        overflow: hidden;
        opacity: 0.45;
        filter: hue-rotate(185deg) saturate(0.7) blur(1px);
        transform: scaleX(-1);
        animation: d4cDupIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        border: 1px solid rgba(180,220,255,0.4);
        box-shadow: 0 0 30px rgba(100,180,255,0.3);
      }
      @keyframes d4cDupIn {
        0%  { opacity: 0; transform: scaleX(-1) scale(0.8); }
        100%{ opacity: 0.45; transform: scaleX(-1) scale(1); }
      }

      .ee-float-text.d4c {
        color: #a0d0ff !important;
        text-shadow: 2px 2px 0 #000, 0 0 20px rgba(100,180,255,0.9) !important;
      }
    `;
    document.head.appendChild(s);
  }


  /* Shared float text base styles */
  (function injectSharedStyles() {
    if (document.getElementById('ee-shared-styles')) return;
    const s = document.createElement('style');
    s.id = 'ee-shared-styles';
    s.textContent = `
      .ee-float-text {
        position: fixed; pointer-events: none; z-index: 99997;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 26px; letter-spacing: 3px;
        color: #fff;
        text-shadow: 3px 3px 0 rgba(0,0,0,0.8);
        animation: eeFloatBase 3.2s ease-out forwards;
        white-space: nowrap;
      }
      @keyframes eeFloatBase {
        0%  { opacity: 0; transform: translateY(10px) scale(0.85); }
        12% { opacity: 1; transform: translateY(-10px) scale(1.05); }
        80% { opacity: 1; transform: translateY(-50px) scale(1); }
        100%{ opacity: 0; transform: translateY(-80px) scale(0.95); }
      }
      .g5-float-text { /* legacy alias kept for compat */ }
    `;
    document.head.appendChild(s);
  })();

})();