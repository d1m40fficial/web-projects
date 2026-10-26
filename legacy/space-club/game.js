(() => {
'use strict';

const $ = s => document.querySelector(s);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rand = (a, b) => a + Math.random() * (b - a);
const irand = (a, b) => Math.floor(rand(a, b + 1));
const TAU = Math.PI * 2;
const fmt = n => Math.floor(n).toLocaleString('ru-RU');

const Sfx = {
  ctx: null, muted: false,
  ensure() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) {}
  },
  blip(f0, f1, dur, type, vol) {
    if (this.muted || !this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur);
  },
  shoot() { this.blip(880, 340, 0.06, 'square', 0.015); },
  boom() { this.blip(200, 45, 0.22, 'sawtooth', 0.06); },
  pick() { this.blip(700, 1400, 0.08, 'sine', 0.045); },
  hurt() { this.blip(130, 40, 0.3, 'square', 0.08); },
  buy() { this.blip(520, 1180, 0.14, 'triangle', 0.05); },
  over() { this.blip(320, 55, 0.7, 'sawtooth', 0.07); }
};

const SHOP = [
  { id: 'fireRate', name: 'СКОРОСТРЕЛЬНОСТЬ', desc: 'плазменная пушка стреляет чаще', base: 55, max: 8 },
  { id: 'damage',   name: 'МОЩЬ ПУШКИ',       desc: 'снаряды пробивают крепче',        base: 75, max: 8 },
  { id: 'speed',    name: 'ДВИГАТЕЛЬ',        desc: 'корабль послушнее и шустрее',     base: 45, max: 6 },
  { id: 'hull',     name: 'БРОНЯ КОРПУСА',    desc: '+1 очко прочности',               base: 130, max: 3 },
  { id: 'magnet',   name: 'ГРАВИ-МАГНИТ',     desc: 'притягивает звёзды издалека',     base: 40, max: 5 }
];
const MAXLVL = {};
for (const s of SHOP) MAXLVL[s.id] = s.max;

function costOf(id, lvl) {
  const s = SHOP.find(x => x.id === id);
  return Math.round(s.base * Math.pow(1.65, lvl));
}

const SAVE_KEY = 'superspaceclub_progress_v1';
let serverSave = true;
let progress = null;

function defaults() {
  const u = {};
  for (const s of SHOP) u[s.id] = 0;
  return { credits: 0, best: 0, totalRuns: 0, upgrades: u };
}

function normalize(d) {
  const p = defaults();
  if (!d || typeof d !== 'object') return p;
  const num = v => { v = Number(v); return Number.isFinite(v) && v > 0 ? v : 0; };
  p.credits = num(d.credits);
  p.best = num(d.best);
  p.totalRuns = Math.floor(num(d.totalRuns));
  const u = d.upgrades && typeof d.upgrades === 'object' ? d.upgrades : {};
  for (const s of SHOP) p.upgrades[s.id] = clamp(Math.floor(num(u[s.id])), 0, MAXLVL[s.id]);
  return p;
}

async function loadProgress() {
  let loaded;
  try {
    const r = await fetch('/api/progress', { cache: 'no-store' });
    if (r.ok) loaded = await r.json();
  } catch (e) { serverSave = false; }
  if (loaded == null) {
    try { loaded = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) {}
  }
  progress = normalize(loaded);
}

function doSave() {
  clearTimeout(saveTimer);
  const body = JSON.stringify(progress);
  try { localStorage.setItem(SAVE_KEY, body); } catch (e) {}
  if (!serverSave) return;
  fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).catch(() => { serverSave = false; updateSaveLine(); });
}

let saveTimer = null;
function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, 350);
}

addEventListener('beforeunload', () => { if (progress) doSave(); });

function updateSaveLine() {
  const el = $('#save-mode');
  el.textContent = serverSave ? 'файл progress.json' : 'localStorage (сервер недоступен)';
  el.style.color = serverSave ? '' : '#ffd23d';
}

const Stats = {
  fireDelay: 0.34, bulletDmg: 1, maxHull: 3, maxV: 430, magnetR: 70,
  recalc() {
    const u = progress.upgrades;
    this.fireDelay = 0.34 * Math.pow(0.87, u.fireRate);
    this.bulletDmg = 1 + u.damage;
    this.maxHull = 3 + u.hull;
    this.maxV = 430 * (1 + 0.13 * u.speed);
    this.magnetR = 70 + u.magnet * 34;
  }
};

const ST = { MENU: 0, PLAY: 1, PAUSE: 2, OVER: 3, SHOP: 4 };
let state = ST.MENU;
let shopReturn = 'menu';

const cv = $('#game'), ctx = cv.getContext('2d');
const hud = $('#hud');
const screens = {
  menu: $('#screen-menu'), shop: $('#screen-shop'),
  over: $('#screen-over'), pause: $('#screen-pause')
};

let W = 0, H = 0, idleT = 0;
let bgStars = [], nebula = null;

function makeNebula() {
  nebula = document.createElement('canvas');
  nebula.width = Math.max(1, W); nebula.height = Math.max(1, H);
  const g = nebula.getContext('2d');
  const hues = [[252, 70, 58], [192, 80, 50], [312, 80, 58], [168, 70, 45]];
  for (let i = 0; i < 6; i++) {
    const h = hues[i % hues.length];
    const x = rand(0, W), y = rand(0, H);
    const r = rand(Math.min(W, H) * 0.22, Math.min(W, H) * 0.55);
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `hsla(${h[0]},${h[1]}%,${h[2]}%,0.09)`);
    rg.addColorStop(1, 'hsla(0,0%,0%,0)');
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

function makeStarsBg() {
  bgStars = [];
  const n = Math.round(W * H / 3600);
  for (let i = 0; i < n; i++) {
    const z = Math.random();
    bgStars.push({
      x: rand(0, W), y: rand(0, H), z,
      r: z > 0.85 ? rand(1.3, 2.2) : rand(0.4, 1.1),
      tw: rand(0, TAU)
    });
  }
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  makeNebula(); makeStarsBg();
}
addEventListener('resize', resize);

const player = { x: -100, y: -100, vx: 0, vy: 0, r: 15, hull: 3, inv: 0, fireT: 0, tilt: 0 };
let bullets = [], foes = [], orbs = [], parts = [], rings = [];
let runT = 0, score = 0, creditsRun = 0, streak = 0, streakT = 0, mult = 1;
let spawnT = 1, shake = 0, flash = 0, engineT = 0;

const keys = {};
let px = null, py = null, usingPointer = false;

addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  if (e.code === 'KeyP') togglePause();
  if (e.code === 'Escape') onEsc();
  if (e.code === 'KeyM') toggleMute();
});
addEventListener('keyup', e => { keys[e.code] = false; });
cv.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; usingPointer = true; });
cv.addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; Sfx.ensure(); });
addEventListener('pointerdown', () => Sfx.ensure(), { once: true });

function showScreen(name) {
  for (const k in screens) screens[k].classList.toggle('hidden', k !== name);
}

function refreshMenu() {
  $('#menu-best').textContent = fmt(progress.best);
  $('#menu-bank').textContent = fmt(progress.credits);
  $('#menu-runs').textContent = fmt(progress.totalRuns);
}

function startRun() {
  bullets = []; foes = []; orbs = []; parts = []; rings = [];
  runT = 0; score = 0; creditsRun = 0; streak = 0; streakT = 0; mult = 1;
  spawnT = 0.9; shake = 0; flash = 0;
  Stats.recalc();
  player.x = W * 0.24; player.y = H / 2;
  player.vx = 0; player.vy = 0; player.tilt = 0;
  player.hull = Stats.maxHull; player.inv = 1.2; player.fireT = 0.25;
  state = ST.PLAY;
  showScreen(null);
  hud.classList.remove('hidden');
  hudCache.hull = -1;
  updateHud(true);
}

function gameOver() {
  state = ST.OVER;
  progress.credits += creditsRun;
  progress.totalRuns += 1;
  const nb = Math.floor(score) > progress.best;
  if (nb) progress.best = Math.floor(score);
  doSave();
  $('#over-score').textContent = fmt(score);
  $('#over-stars').textContent = '+' + fmt(creditsRun);
  $('#over-best').textContent = fmt(progress.best);
  $('#over-newbest').classList.toggle('hidden', !nb);
  hud.classList.add('hidden');
  showScreen('over');
  Sfx.over();
}

function togglePause() {
  if (state === ST.PLAY) { state = ST.PAUSE; showScreen('pause'); }
  else if (state === ST.PAUSE) { state = ST.PLAY; showScreen(null); }
}

function onEsc() {
  if (state === ST.PLAY || state === ST.PAUSE) togglePause();
  else if (state === ST.SHOP) closeShop();
}

function openShop(from) {
  shopReturn = from;
  renderShop();
  state = ST.SHOP;
  showScreen('shop');
}

function closeShop() {
  if (shopReturn === 'over') { state = ST.OVER; showScreen('over'); }
  else { state = ST.MENU; refreshMenu(); showScreen('menu'); }
}

function renderShop() {
  $('#shop-bank').textContent = fmt(progress.credits);
  const list = $('#shop-list');
  list.innerHTML = '';
  for (const s of SHOP) {
    const lvl = progress.upgrades[s.id];
    const maxed = lvl >= s.max;
    const row = document.createElement('div');
    row.className = 'shop-row';
    const info = document.createElement('div');
    info.className = 'shop-info';
    const dots = '●'.repeat(lvl) + '○'.repeat(s.max - lvl);
    info.innerHTML = `<div class="shop-name">${s.name}<span class="shop-dots">${dots}</span></div><div class="shop-desc">${s.desc}</div>`;
    const btn = document.createElement('button');
    btn.className = 'shop-buy';
    btn.textContent = maxed ? 'MAX' : '★ ' + fmt(costOf(s.id, lvl));
    btn.disabled = maxed || progress.credits < costOf(s.id, lvl);
    btn.onclick = () => {
      const cur = progress.upgrades[s.id];
      if (cur >= s.max) return;
      const c = costOf(s.id, cur);
      if (progress.credits < c) return;
      progress.credits -= c;
      progress.upgrades[s.id] += 1;
      Stats.recalc();
      queueSave();
      Sfx.buy();
      renderShop();
    };
    row.appendChild(info);
    row.appendChild(btn);
    list.appendChild(row);
  }
}

function toggleMute() {
  Sfx.muted = !Sfx.muted;
  const b = $('#btn-mute');
  b.classList.toggle('off', Sfx.muted);
  b.textContent = Sfx.muted ? '✕' : '♪';
}

const hudCache = { score: -1, cr: -1, mult: -1, hull: -1 };
function updateHud(force) {
  const sc = Math.floor(score);
  if (force || sc !== hudCache.score) { hudCache.score = sc; $('#hud-score').textContent = fmt(sc); }
  if (force || creditsRun !== hudCache.cr) { hudCache.cr = creditsRun; $('#hud-credits').textContent = fmt(creditsRun); }
  if (force || mult !== hudCache.mult) { hudCache.mult = mult; $('#hud-mult').textContent = mult > 1 ? 'КОМБО ×' + mult : ''; }
  if (force || player.hull !== hudCache.hull) {
    hudCache.hull = player.hull;
    const el = $('#hud-hull');
    el.innerHTML = '';
    for (let i = 0; i < Stats.maxHull; i++) {
      const p = document.createElement('i');
      p.className = 'pip' + (i < player.hull ? ' on' : '');
      el.appendChild(p);
    }
  }
}

function makeRock(x, y, r, vx, vy) {
  const verts = [];
  const n = irand(8, 12);
  for (let i = 0; i < n; i++) verts.push(rand(0.72, 1.28));
  const hp = Math.max(1, Math.round(r / 7));
  return { kind: 'rock', x, y, vx, vy, hp, maxHp: hp, r, verts, rot: rand(0, TAU), spin: rand(-1.2, 1.2), flash: 0 };
}

function spawnFoe(sf) {
  const roll = Math.random();
  const y = rand(46, H - 46);
  if (runT > 25 && roll < 0.16) {
    const hp = 5 + Math.floor(runT / 50);
    foes.push({ kind: 'hunter', x: W + 40, y, vx: -(150 + runT * 0.8), vy: 0, hp, maxHp: hp, r: 15, rot: 0, spin: 0, flash: 0 });
  } else if (runT > 15 && roll < 0.26) {
    const hp = 12 + Math.floor(runT / 30);
    foes.push({ kind: 'cargo', x: W + 50, y, vx: -65 * sf, vy: rand(-12, 12), hp, maxHp: hp, r: 22, rot: rand(0, TAU), spin: 0.7, flash: 0 });
  } else {
    foes.push(makeRock(W + 60, y, rand(13, 40), -rand(85, 175) * sf, rand(-34, 34)));
  }
}

function spark(x, y, color, n, pow) {
  n = n || 5; pow = pow || 160;
  for (let i = 0; i < n; i++) {
    const a = rand(0, TAU), v = rand(pow * 0.3, pow);
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.2, 0.5), max: 0.5, color, size: rand(1, 2.6) });
  }
}

function explode(f) {
  const col = f.kind === 'hunter' ? '#ff9df9' : f.kind === 'cargo' ? '#9dffb9' : '#ffd9a0';
  spark(f.x, f.y, col, Math.round(8 + f.r * 0.6), 220 + f.r * 4);
  rings.push({
    x: f.x, y: f.y, r: f.r * 0.6, maxR: f.r * 2.4, a: 1,
    color: f.kind === 'hunter' ? '#ff3df5' : f.kind === 'cargo' ? '#3dff88' : '#7fa8ff'
  });
}

function killFoe(f) {
  if (f.dead) return;
  f.dead = true;
  streak++; streakT = 2.2;
  mult = clamp(1 + Math.floor(streak / 4), 1, 8);
  const base = f.kind === 'hunter' ? 60 : f.kind === 'cargo' ? 45 : Math.round(10 + f.r);
  score += base * mult;
  explode(f);
  Sfx.boom();
  if (f.kind === 'rock' && f.r >= 24) {
    for (const side of [-1, 1]) {
      const cr = Math.max(9, f.r * rand(0.5, 0.62));
      foes.push(makeRock(
        f.x + side * f.r * 0.45,
        clamp(f.y + rand(-10, 10), 40, H - 40),
        cr,
        f.vx * rand(0.7, 0.95),
        side * rand(50, 130)
      ));
    }
  }
  const drops = f.kind === 'cargo' ? irand(5, 7) : f.kind === 'hunter' ? 2 : (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < drops; i++) {
    orbs.push({ x: f.x + rand(-8, 8), y: f.y + rand(-8, 8), vx: rand(-60, -10), vy: rand(-40, 40), life: 11, ph: rand(0, TAU) });
  }
}

const RAM_DMG = 2;

function hitPlayer(f) {
  player.inv = 1.8;
  player.hull -= 1;
  streak = 0; mult = 1;
  shake = Math.max(shake, 13);
  flash = 0.55;

  const dx = f.x - player.x, dy = f.y - player.y;
  const d = Math.hypot(dx, dy) || 1;
  const nx = dx / d, ny = dy / d;
  f.vx += nx * 220; f.vy += ny * 220;
  player.vx -= nx * 170; player.vy -= ny * 170;

  f.hp -= RAM_DMG;
  f.flash = 0.12;
  spark((f.x + player.x) / 2, (f.y + player.y) / 2, '#ffb14a', 10, 260);
  if (f.hp <= 0) killFoe(f);
  Sfx.hurt();

  if (player.hull <= 0) {
    spark(player.x, player.y, '#bffcff', 44, 420);
    rings.push({ x: player.x, y: player.y, r: 10, maxR: 130, a: 1, color: '#22e0ff' });
    shake = 22;
    gameOver();
  }
}

function update(dt) {
  runT += dt;
  const sf = 1 + Math.min(1.5, runT * 0.012);

  let ix = 0, iy = 0;
  if (keys.KeyA || keys.ArrowLeft) ix -= 1;
  if (keys.KeyD || keys.ArrowRight) ix += 1;
  if (keys.KeyW || keys.ArrowUp) iy -= 1;
  if (keys.KeyS || keys.ArrowDown) iy += 1;

  let dvx = 0, dvy = 0;
  if (ix || iy) {
    const m = Math.hypot(ix, iy);
    dvx = ix / m * Stats.maxV; dvy = iy / m * Stats.maxV;
  } else if (usingPointer && px != null) {
    const lim = Stats.maxV * 1.35;
    dvx = clamp((px - player.x) * 6, -lim, lim);
    dvy = clamp((py - player.y) * 6, -lim, lim);
  }
  const k = 1 - Math.pow(0.002, dt);
  player.vx += (dvx - player.vx) * k;
  player.vy += (dvy - player.vy) * k;
  player.x = clamp(player.x + player.vx * dt, 26, W - 26);
  player.y = clamp(player.y + player.vy * dt, 26, H - 26);
  player.tilt = clamp(player.vy * 0.0012, -0.4, 0.4);

  engineT -= dt;
  if (engineT <= 0) {
    engineT = 0.03;
    parts.push({ x: player.x - 13, y: player.y + rand(-3, 3), vx: -rand(120, 220) - player.vx * 0.15, vy: rand(-16, 16), life: 0.3, max: 0.3, color: '#2fd4ef', size: rand(1.2, 2.6) });
  }

  player.fireT -= dt;
  if (player.fireT <= 0) {
    player.fireT = Stats.fireDelay;
    bullets.push({ x: player.x + 18, y: player.y, vx: 1150, vy: 0, dmg: Stats.bulletDmg, r: 4 });
    Sfx.shoot();
  }

  player.inv = Math.max(0, player.inv - dt);
  streakT -= dt;
  if (streakT <= 0 && streak > 0) { streak = 0; mult = 1; }

  spawnT -= dt;
  if (spawnT <= 0) {
    spawnT = Math.max(0.3, 1.15 - runT * 0.007) * rand(0.65, 1.35);
    spawnFoe(sf);
  }

  for (const f of foes) {
    f.x += f.vx * dt; f.y += f.vy * dt;
    f.rot += (f.spin || 0) * dt;
    f.flash = Math.max(0, f.flash - dt);
    if (f.kind === 'hunter') {
      f.vy = clamp(f.vy + Math.sign(player.y - f.y) * 300 * dt, -230, 230);
    }
    if (f.x < -80) f.dead = true;
  }

  for (const b of bullets) {
    b.x += b.vx * dt;
    if (b.x > W + 30) b.dead = true;
  }

  for (const b of bullets) {
    if (b.dead) continue;
    for (const f of foes) {
      if (f.dead) continue;
      const dx = f.x - b.x, dy = f.y - b.y;
      const rr = f.r + b.r;
      if (dx * dx + dy * dy < rr * rr) {
        b.dead = true;
        f.hp -= b.dmg;
        f.flash = 0.09;
        spark(b.x, b.y, '#aef4ff', 4, 120);
        if (f.hp <= 0) killFoe(f);
        break;
      }
    }
  }

  if (player.inv <= 0 && player.hull > 0) {
    for (const f of foes) {
      if (f.dead) continue;
      const dx = f.x - player.x, dy = f.y - player.y;
      const rr = f.r + player.r * 0.8;
      if (dx * dx + dy * dy < rr * rr) { hitPlayer(f); break; }
    }
  }

  for (const s of orbs) {
    s.life -= dt; s.ph += dt * 4;
    if (s.life <= 0) { s.dead = true; continue; }
    s.x += s.vx * dt; s.y += s.vy * dt;
    const dx = player.x - s.x, dy = player.y - s.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < Stats.magnetR * Stats.magnetR) {
      const d = Math.sqrt(d2) || 1;
      s.vx += dx / d * 1500 * dt;
      s.vy += dy / d * 1500 * dt;
    }
    if (d2 < (player.r + 12) * (player.r + 12)) {
      s.dead = true;
      creditsRun++;
      score += 15 * mult;
      spark(s.x, s.y, '#ffe27a', 4, 90);
      Sfx.pick();
    }
  }

  for (const p of parts) {
    p.life -= dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
    const dr = Math.pow(0.15, dt);
    p.vx *= dr; p.vy *= dr;
  }
  for (const r of rings) {
    r.r += (r.maxR - r.r) * Math.min(1, 12 * dt);
    r.a -= 2.6 * dt;
  }

  score += 8 * dt * mult;

  bullets = bullets.filter(b => !b.dead);
  foes = foes.filter(f => !f.dead);
  orbs = orbs.filter(s => !s.dead);
  parts = parts.filter(p => p.life > 0);
  rings = rings.filter(r => r.a > 0);

  updateHud(false);
}

function drawBg(dt) {
  ctx.fillStyle = '#05060f';
  ctx.fillRect(0, 0, W, H);
  const mv = state === ST.PLAY ? 1 : 0.3;
  if (nebula) {
    const off = (idleT * 7 * mv) % W;
    ctx.drawImage(nebula, -off, 0);
    ctx.drawImage(nebula, W - off, 0);
  }
  for (const st of bgStars) {
    st.x -= (10 + st.z * 95) * mv * dt;
    if (st.x < -2) { st.x = W + 2; st.y = rand(0, H); }
    const twk = 0.55 + 0.45 * Math.sin(idleT * 2.2 + st.tw);
    ctx.globalAlpha = (0.25 + st.z * 0.75) * twk;
    ctx.fillStyle = st.z > 0.85 ? '#cfeaff' : '#8ea6cf';
    ctx.fillRect(st.x, st.y, st.r, st.r);
  }
  ctx.globalAlpha = 1;
}

function drawOrb(s) {
  const a = s.life < 2 ? (Math.sin(idleT * 20) > 0 ? 0.35 : 1) : 1;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.ph * 0.5);
  ctx.globalAlpha = a;
  ctx.shadowColor = '#ffd23d';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffe27a';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const ang = i * TAU / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(ang) * 6, Math.sin(ang) * 6);
    const ang2 = ang + TAU / 10;
    ctx.lineTo(Math.cos(ang2) * 2.6, Math.sin(ang2) * 2.6);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBullets() {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#d9fbff';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#22e0ff';
  ctx.shadowBlur = 9;
  ctx.beginPath();
  for (const b of bullets) {
    if (b.dead) continue;
    ctx.moveTo(b.x - 9, b.y);
    ctx.lineTo(b.x + 5, b.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawFoes() {
  for (const f of foes) {
    if (f.dead) continue;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.strokeStyle = f.flash > 0 ? '#ffffff' : '';
    if (f.kind === 'rock') {
      ctx.rotate(f.rot);
      ctx.shadowColor = '#7fa8ff';
      ctx.shadowBlur = 10;
      if (!f.flash) ctx.strokeStyle = '#93a7d6';
      ctx.fillStyle = '#0d162e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < f.verts.length; i++) {
        const a = i / f.verts.length * TAU;
        const rr = f.r * f.verts[i];
        const vx = Math.cos(a) * rr, vy = Math.sin(a) * rr;
        if (i) ctx.lineTo(vx, vy); else ctx.moveTo(vx, vy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (f.kind === 'hunter') {
      ctx.shadowColor = '#ff3df5';
      ctx.shadowBlur = 12;
      if (!f.flash) ctx.strokeStyle = '#ff5bf2';
      ctx.fillStyle = '#2a0f33';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -f.r);
      ctx.lineTo(f.r * 0.75, 0);
      ctx.lineTo(0, f.r);
      ctx.lineTo(-f.r * 0.75, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffd23d';
      ctx.beginPath();
      ctx.arc(0, 0, 3 + Math.sin(idleT * 9 + f.x * 0.01) * 1.6, 0, TAU);
      ctx.fill();
    } else {
      ctx.rotate(f.rot * 0.4);
      ctx.shadowColor = '#3dff88';
      ctx.shadowBlur = 12;
      if (!f.flash) ctx.strokeStyle = '#3dff88';
      ctx.fillStyle = '#0f2b1c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU;
        const vx = Math.cos(a) * f.r, vy = Math.sin(a) * f.r;
        if (i) ctx.lineTo(vx, vy); else ctx.moveTo(vx, vy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeRect(-7, -7, 14, 14);
    }
    ctx.restore();
  }
}

function drawPlayer() {
  if (player.inv > 0 && Math.floor(idleT * 18) % 2 === 0) return;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.tilt);
  const fl = rand(8, 15);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#ffb14a';
  ctx.shadowColor = '#ffd23d';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.lineTo(-9 - fl, 0);
  ctx.lineTo(-9, 4);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowColor = '#22e0ff';
  ctx.shadowBlur = 16;
  ctx.strokeStyle = '#bffcff';
  ctx.fillStyle = '#0b2740';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-12, -11);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-12, 11);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ff3df5';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(4, 0, 3.4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawParts() {
  ctx.save();
  ctx.shadowBlur = 0;
  for (const p of parts) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  for (const r of rings) {
    ctx.globalAlpha = clamp(r.a, 0, 1);
    ctx.strokeStyle = r.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = r.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHpBars() {
  for (const f of foes) {
    if (f.dead || f.hp >= f.maxHp) continue;
    const w = Math.max(18, f.r * 1.6);
    const x = f.x - w / 2, y = f.y - f.r - 10;
    const ratio = clamp(f.hp / f.maxHp, 0, 1);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = 'rgba(8,14,30,.9)';
    ctx.fillRect(x - 1, y - 1, w + 2, 5);
    ctx.fillStyle = ratio > 0.55 ? '#3dff88' : ratio > 0.25 ? '#ffd23d' : '#ff5b5b';
    ctx.fillRect(x, y, w * ratio, 3);
    ctx.globalAlpha = 1;
  }
}

function drawWorld() {
  ctx.save();
  if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
  for (const s of orbs) if (!s.dead) drawOrb(s);
  drawBullets();
  drawFoes();
  drawHpBars();
  if (player.hull > 0) drawPlayer();
  drawParts();
  ctx.restore();
  if (flash > 0) {
    ctx.fillStyle = `rgba(255,64,96,${(flash * 0.4).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
}

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  idleT += dt;
  if (state === ST.PLAY) update(dt);
  shake *= Math.pow(0.02, dt);
  if (shake < 0.1) shake = 0;
  flash = Math.max(0, flash - dt * 1.4);
  drawBg(dt);
  if (state !== ST.MENU) drawWorld();
}

$('#btn-start').onclick = () => startRun();
$('#btn-shop').onclick = () => openShop('menu');
$('#btn-shop-back').onclick = () => closeShop();
$('#btn-retry').onclick = () => startRun();
$('#btn-over-shop').onclick = () => openShop('over');
$('#btn-menu').onclick = () => { state = ST.MENU; refreshMenu(); showScreen('menu'); };
$('#btn-resume').onclick = () => togglePause();
$('#btn-quit').onclick = () => gameOver();
$('#btn-mute').onclick = () => toggleMute();

async function boot() {
  resize();
  await loadProgress();
  Stats.recalc();
  refreshMenu();
  updateSaveLine();
  $('#btn-start').disabled = false;
}
boot();
requestAnimationFrame(t => { last = t; requestAnimationFrame(loop); });
})();
