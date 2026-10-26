(function () {
  'use strict';

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var W = 1280, H = 720, WATER_Y = 600, GRAVITY = 1400;
  var OUTLINE = '#3b2a1e';

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sign(v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function rr(g, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y);
    g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r);
    g.quadraticCurveTo(x, y, x + r, y);
    g.closePath();
  }

  var audioCtx = null, muted = false;

  function ensureAudio() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { try { audioCtx = new AC(); } catch (e) { audioCtx = null; } }
    }
    if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); }
  }

  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!audioCtx || muted) return;
    var t0 = audioCtx.currentTime + (delay || 0);
    var osc = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(dur, vol, hp, lp, delay) {
    if (!audioCtx || muted) return;
    var t0 = audioCtx.currentTime + (delay || 0);
    var n = Math.floor(audioCtx.sampleRate * dur);
    var buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var src = audioCtx.createBufferSource();
    src.buffer = buf;
    var f = audioCtx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = lp || 700;
    f.Q.value = 0.9;
    var g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(audioCtx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.03);
  }

  var sfx = {
    cannon: function () { tone(88, 0.4, 'sine', 0.5, 38); noise(0.28, 0.35, 140, 1100); },
    hit: function () { noise(0.11, 0.34, 260, 2400); tone(190, 0.09, 'square', 0.13, 120); },
    broken: function () { noise(0.34, 0.5, 120, 3200); tone(130, 0.3, 'sawtooth', 0.18, 46); },
    splash: function () { noise(0.42, 0.42, 500, 4200); tone(320, 0.28, 'sine', 0.12, 90); },
    jump: function () { tone(520, 0.12, 'square', 0.1, 900); },
    start: function () { tone(440, 0.12, 'square', 0.14); tone(660, 0.16, 'square', 0.14, null, 0.11); },
    over: function () { tone(392, 0.28, 'sawtooth', 0.2, 300); tone(294, 0.32, 'sawtooth', 0.2, 210, 0.24); tone(196, 0.5, 'sawtooth', 0.22, 120, 0.5); },
    click: function () { tone(660, 0.05, 'square', 0.1); }
  };

  var keys = { left: false, right: false, jump: false };
  var jumpQueued = false;
  var touchMode = false;

  var G = {
    state: 'title',
    clock: 0,
    time: 0,
    best: 0,
    planks: [],
    sheep: null,
    ships: [],
    balls: [],
    marks: [],
    parts: [],
    debris: [],
    clouds: [],
    shake: 0,
    flash: 0,
    newBest: false
  };

  var BEST_KEY = 'raftSurvival.best';

  function loadBest() {
    try { G.best = parseFloat(window.localStorage.getItem(BEST_KEY)) || 0; }
    catch (e) { G.best = 0; }
  }
  function saveBest() {
    try { window.localStorage.setItem(BEST_KEY, String(G.best)); } catch (e) {}
  }

  function makePlanks() {
    G.planks = [];
    var count = 5, pw = 64, ph = 24;
    for (var i = 0; i < count; i++) {
      G.planks.push({
        lx: (i - (count - 1) / 2) * pw,
        cx: 640, cy: 572, ang: 0,
        w: pw, h: ph, hp: 2, alive: true, flash: 0
      });
    }
    G.raft = { cx: 640, cy: 572, vy: 0, ang: 0, angVel: 0, baseY: 572, targetAng: 0 };
    updatePlankWorld();
  }

  function updatePlankWorld() {
    var raft = G.raft;
    var ca = Math.cos(raft.ang), sa = Math.sin(raft.ang);
    for (var i = 0; i < G.planks.length; i++) {
      var p = G.planks[i];
      p.cx = raft.cx + p.lx * ca;
      p.cy = raft.cy + p.lx * sa;
      p.ang = raft.ang;
    }
  }

  function updateRaftPhysics(dt) {
    var raft = G.raft;
    var wave = Math.sin(G.clock * 1.1) * 3 + Math.sin(G.clock * 0.53 + 1.3) * 1.6;
    var targetY = raft.baseY + wave;
    raft.vy += ((targetY - raft.cy) * 70 - raft.vy * 7) * dt;
    raft.cy += raft.vy * dt;

    var left = 0, right = 0;
    for (var i = 0; i < G.planks.length; i++) {
      if (!G.planks[i].alive) continue;
      if (G.planks[i].lx < 0) left++; else if (G.planks[i].lx > 0) right++;
    }
    var bias = (left - right) * 0.03;
    raft.targetAng = Math.sin(G.clock * 0.9) * 0.02 + bias;
    raft.angVel += ((raft.targetAng - raft.ang) * 42 - raft.angVel * 4.0) * dt;
    raft.ang += raft.angVel * dt;
    raft.ang = clamp(raft.ang, -0.3, 0.3);

    raft.cx = 640 + Math.sin(G.clock * 0.4) * 5;
    updatePlankWorld();
  }

  function makeShip(side) {
    var left = side === 'left';
    return {
      side: side,
      ax: left ? 262 : 1018,
      ay: 600,
      dir: left ? 1 : -1,
      bob: 0,
      phase: rand(0, 6.28),
      cool: left ? 2.6 : 4.4,
      recoil: 0,
      mode: 'idle'
    };
  }

  function makeClouds() {
    G.clouds = [];
    for (var i = 0; i < 7; i++) {
      G.clouds.push({
        x: rand(-100, W + 100),
        y: rand(40, 330),
        s: rand(0.55, 1.5),
        sp: rand(4, 13)
      });
    }
  }

  function resetGame() {
    makePlanks();
    G.sheep = {
      x: 640, y: 560, vx: 0, vy: 0, w: 28, h: 48,
      onGround: true, facing: 1, animT: 0, state: 'idle',
      squash: 1, dead: false, deadT: 0, rot: 0
    };
    G.ships = [makeShip('left'), makeShip('right')];
    G.balls = [];
    G.marks = [];
    G.parts = [];
    G.debris = [];
    G.time = 0;
    G.shake = 0;
    G.flash = 0;
    G.newBest = false;
    if (!G.clouds.length) makeClouds();
  }

  function start() {
    ensureAudio();
    resetGame();
    G.state = 'playing';
    sfx.start();
  }

  function gameOver() {
    if (G.state === 'gameover') return;
    G.state = 'gameover';
    G.marks = [];
    if (G.time > G.best) { G.best = G.time; G.newBest = true; saveBest(); }
    sfx.over();
  }

  function togglePause() {
    if (G.state === 'playing') { G.state = 'paused'; sfx.click(); }
    else if (G.state === 'paused') { G.state = 'playing'; sfx.click(); }
  }

  function supportAt(x) {
    var best = null;
    for (var i = 0; i < G.planks.length; i++) {
      var p = G.planks[i];
      if (!p.alive) continue;
      var ca = Math.cos(p.ang), sa = Math.sin(p.ang);
      if (Math.abs(ca) < 0.001) continue;
      var lx = (x - p.cx - 12 * sa) / ca;
      if (lx < -p.w / 2 || lx > p.w / 2) continue;
      var y = p.cy + lx * sa - 12 * ca;
      if (best === null || y < best) best = y;
    }
    return best;
  }

  function muzzle(ship) {
    var lx = 58 - ship.recoil * 16;
    var ly = -58;
    if (ship.dir > 0) return { x: ship.ax + lx, y: ship.ay + ship.bob + ly };
    return { x: ship.ax - lx, y: ship.ay + ship.bob + ly };
  }

  function nextCooldown() {
    var t = clamp(G.time / 150, 0, 1);
    var base = lerp(3.6, 2.1, t);
    var j = lerp(0.9, 0.45, t);
    return base + rand(-j, j);
  }

  function pickTarget() {
    var alive = G.planks.filter(function (p) { return p.alive; });
    if (!alive.length) return null;
    var sx = G.sheep.x;
    var near = alive[0];
    for (var i = 1; i < alive.length; i++) {
      if (Math.abs(alive[i].cx - sx) < Math.abs(near.cx - sx)) near = alive[i];
    }
    if (Math.random() < 0.5) return near;
    return pick(alive);
  }

  function updateSheep(dt) {
    var s = G.sheep;
    s.animT += dt;

    if (s.dead) {
      s.deadT += dt;
      s.vy = Math.min(s.vy + GRAVITY * 0.25 * dt, 70);
      s.y += s.vy * dt;
      s.rot = lerp(s.rot, 0.5, dt * 2);
      if (Math.random() < 0.25) spawnBubble(s.x + rand(-10, 10), s.y - 20);
      return;
    }

    var dir = 0;
    if (keys.left) dir -= 1;
    if (keys.right) dir += 1;

    if (dir !== 0) {
      s.vx += dir * 2000 * dt;
      s.facing = dir;
    } else {
      var f = 1500 * dt;
      if (Math.abs(s.vx) <= f) s.vx = 0; else s.vx -= sign(s.vx) * f;
    }
    s.vx = clamp(s.vx, -300, 300);
    s.x += s.vx * dt;
    s.x = clamp(s.x, 30, W - 30);

    if (jumpQueued && s.onGround) {
      s.vy = -450;
      s.onGround = false;
      s.squash = 1.18;
      sfx.jump();
    }
    jumpQueued = false;

    s.vy += GRAVITY * dt;
    s.y += s.vy * dt;

    var gy = supportAt(s.x);
    if (gy !== null && s.y >= gy && s.vy >= 0) {
      if (!s.onGround) s.squash = 0.8;
      s.y = gy; s.vy = 0; s.onGround = true;
    } else {
      s.onGround = false;
    }

    if (s.onGround) {
      s.vx += Math.sin(G.raft.ang) * GRAVITY * 0.55 * dt;
      if (gy !== null && Math.abs(s.vx) > 10 && Math.abs(s.vx) < 46 && dir === 0) {
        s.vx = sign(s.vx) * 46;
      }
      s.vx = clamp(s.vx, -340, 340);
    }

    s.squash = lerp(s.squash, 1, dt * 10);

    if (!s.onGround) s.state = s.vy < 0 ? 'jump' : 'fall';
    else s.state = Math.abs(s.vx) > 12 ? 'run' : 'idle';

    if (s.y > 620) {
      s.dead = true;
      s.deadT = 0;
      spawnSplash(s.x, WATER_Y, 22);
      G.shake = Math.max(G.shake, 5);
      sfx.splash();
    }
  }

  function updateShips(dt) {
    for (var i = 0; i < G.ships.length; i++) {
      var ship = G.ships[i];
      if (ship.mode === 'aiming') continue;
      ship.cool -= dt;
      if (ship.cool <= 0) {
        var alive = G.planks.some(function (p) { return p.alive; });
        if (!alive) { ship.cool = 1; continue; }
        var p = pickTarget();
        if (!p) { ship.cool = 1; continue; }
        ship.mode = 'aiming';
        G.marks.push({ ship: ship, tx: p.cx, ty: p.cy - 12 * Math.cos(p.ang), t: 0, total: 0.6 });
      }
    }
  }

  function fire(ship, tx, ty) {
    var m = muzzle(ship);
    var t = 1.15;
    var vx = (tx - m.x) / t;
    var vy = (ty - m.y) / t - 0.5 * GRAVITY * t;
    G.balls.push({ x: m.x, y: m.y, vx: vx, vy: vy, r: 12, spin: 0, age: 0 });
    ship.recoil = 1;
    G.shake = Math.max(G.shake, 4);
    var k;
    for (k = 0; k < 9; k++) spawnSmoke(m.x + rand(-8, 8), m.y + rand(-8, 8), true);
    for (k = 0; k < 5; k++) spawnSpark(m.x, m.y);
    sfx.cannon();
  }

  function updateMarks(dt) {
    for (var i = G.marks.length - 1; i >= 0; i--) {
      var m = G.marks[i];
      m.t += dt;
      if (m.t >= m.total) {
        fire(m.ship, m.tx, m.ty);
        m.ship.mode = 'idle';
        m.ship.cool = nextCooldown();
        G.marks.splice(i, 1);
      }
    }
  }

  function circleLocal(r, lx, ly, hw, hh) {
    var cxl = clamp(lx, -hw, hw), cyl = clamp(ly, -hh, hh);
    var dx = lx - cxl, dy = ly - cyl;
    return dx * dx + dy * dy <= r * r;
  }

  function ballHitsPlank(b, p) {
    if (!p.alive) return false;
    var ca = Math.cos(p.ang), sa = Math.sin(p.ang);
    var dx = b.x - p.cx, dy = b.y - p.cy;
    var lx = dx * ca + dy * sa;
    var ly = -dx * sa + dy * ca;
    return circleLocal(b.r, lx, ly, p.w / 2, p.h / 2);
  }

  function damagePlank(p, x, y) {
    if (!p.alive) return;
    p.hp -= 1;
    p.flash = 1;
    if (p.hp <= 0) {
      p.alive = false;
      spawnWood(x, y, 16);
      for (var i = 0; i < 6; i++) spawnSmoke(x + rand(-20, 20), y + rand(-10, 6), false);
      G.debris.push({
        x: p.cx, y: p.cy, w: p.w, h: p.h,
        vx: rand(-30, 30), vy: -90 - rand(0, 40), rot: p.ang, spin: rand(-2.5, 2.5),
        life: 8, t: 0, float: false
      });
      G.raft.vy += 2.4;
      G.raft.angVel += (p.lx / 128) * 0.6;
      G.shake = Math.max(G.shake, 12);
      G.flash = Math.max(G.flash, 0.35);
      sfx.broken();
    } else {
      spawnWood(x, y, 9);
      G.raft.vy += 0.7;
      G.raft.angVel += (p.lx / 128) * 0.2;
      G.shake = Math.max(G.shake, 6);
      sfx.hit();
    }
  }

  function updateBalls(dt) {
    for (var i = G.balls.length - 1; i >= 0; i--) {
      var b = G.balls[i];
      b.age += dt;
      b.vy += GRAVITY * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.spin += dt * 6;
      if (Math.random() < 0.7 && b.age > 0.05) spawnTrailSmoke(b.x, b.y);

      var hit = false;
      for (var j = 0; j < G.planks.length; j++) {
        var p = G.planks[j];
        if (ballHitsPlank(b, p)) {
          damagePlank(p, b.x, b.y + 6);
          hit = true;
          break;
        }
      }
      if (hit) { G.balls.splice(i, 1); continue; }

      if (b.y > WATER_Y + 4) {
        spawnSplash(b.x, WATER_Y, 14);
        sfx.splash();
        G.balls.splice(i, 1);
        continue;
      }
      if (b.x < -60 || b.x > W + 60 || b.y > H + 60) G.balls.splice(i, 1);
    }
  }

  function spawnWood(x, y, n) {
    for (var i = 0; i < n; i++) {
      G.parts.push({
        type: 'wood', x: x + rand(-8, 8), y: y + rand(-6, 6),
        vx: rand(-180, 180), vy: rand(-260, -40), grav: 1000,
        life: rand(0.45, 1.05), max: 1.05, size: rand(3, 8),
        rot: rand(0, 6.28), spin: rand(-9, 9), col: pick(['#c69a5c', '#b07f45', '#9a6a38'])
      });
    }
  }
  function spawnSmoke(x, y, big) {
    G.parts.push({
      type: 'smoke', x: x, y: y, vx: rand(-30, 30), vy: rand(-60, -20), grav: -25,
      life: big ? rand(0.7, 1.2) : rand(0.5, 0.9), max: 1.2,
      size: big ? rand(10, 18) : rand(7, 12), grow: big ? 34 : 22,
      col: '#ddd6c4', a: big ? 0.85 : 0.6
    });
  }
  function spawnTrailSmoke(x, y) {
    G.parts.push({
      type: 'smoke', x: x, y: y, vx: rand(-12, 12), vy: rand(-16, 2), grav: -10,
      life: rand(0.25, 0.5), max: 0.5, size: rand(3, 6), grow: 16, col: '#cfc7b4', a: 0.5
    });
  }
  function spawnSpark(x, y) {
    G.parts.push({
      type: 'spark', x: x, y: y, vx: rand(60, 240), vy: rand(-140, 80), grav: 500,
      life: rand(0.15, 0.35), max: 0.35, size: rand(2, 4), col: pick(['#ffd24a', '#ff9a2a', '#fff2b0'])
    });
  }
  function spawnSplash(x, y, n) {
    for (var i = 0; i < n; i++) {
      G.parts.push({
        type: 'drop', x: x + rand(-14, 14), y: y + rand(-6, 4),
        vx: rand(-170, 170), vy: rand(-320, -110), grav: 1300,
        life: rand(0.4, 0.95), max: 0.95, size: rand(3, 7), col: '#eaf7f6'
      });
    }
    for (var k = 0; k < 6; k++) {
      G.parts.push({
        type: 'foam', x: x + rand(-20, 20), y: y + rand(-4, 6),
        vx: rand(-20, 20), vy: rand(-40, -8), grav: 0,
        life: rand(0.4, 0.8), max: 0.8, size: rand(5, 11), col: '#ffffff', a: 0.85
      });
    }
  }
  function spawnBubble(x, y) {
    G.parts.push({
      type: 'foam', x: x, y: y, vx: rand(-8, 8), vy: rand(-60, -30), grav: -20,
      life: rand(0.4, 0.8), max: 0.8, size: rand(2, 5), col: '#eaf7f6', a: 0.8
    });
  }

  function updateParts(dt) {
    for (var i = G.parts.length - 1; i >= 0; i--) {
      var p = G.parts[i];
      p.life -= dt;
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'wood') p.rot += p.spin * dt;
      if (p.type === 'smoke') p.size += p.grow * dt;
      if (p.life <= 0 || p.x < -60 || p.x > W + 60 || p.y > H + 80) G.parts.splice(i, 1);
    }
    if (G.parts.length > 460) G.parts.splice(0, G.parts.length - 460);
  }

  function updateDebris(dt) {
    for (var i = G.debris.length - 1; i >= 0; i--) {
      var d = G.debris[i];
      d.t += dt;
      if (!d.float) {
        d.vy += GRAVITY * 0.55 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.rot += d.spin * dt;
        if (d.y > WATER_Y + 4) { d.float = true; spawnSplash(d.x, WATER_Y, 9); sfx.splash(); }
      } else {
        var target = waveY(d.x, 0, 5, 0) + 6 + Math.sin(G.clock * 1.3 + d.x * 0.05) * 3;
        d.y = lerp(d.y, target, dt * 3);
        d.x += d.vx * dt;
        d.vx *= (1 - 1.4 * dt);
        d.rot = lerp(d.rot, Math.sin(G.clock * 1.2 + d.x * 0.03) * 0.3, dt * 2);
        if (Math.random() < 0.03) spawnBubble(d.x + rand(-16, 16), WATER_Y);
      }
      if (d.t > d.life || d.y > H + 60 || d.x < -80 || d.x > W + 80) G.debris.splice(i, 1);
    }
  }

  function updateClouds(dt) {
    for (var i = 0; i < G.clouds.length; i++) {
      var c = G.clouds[i];
      c.x -= c.sp * (0.6 + c.s) * dt;
      if (c.x < -260) { c.x = W + 200; c.y = rand(40, 330); c.s = rand(0.55, 1.5); }
    }
  }

  function update(dt) {
    G.clock += dt;
    updateClouds(dt);
    for (var i = 0; i < G.ships.length; i++) {
      var ship = G.ships[i];
      ship.bob = Math.sin(G.clock * 1.3 + ship.phase) * 6;
      ship.recoil = Math.max(0, ship.recoil - dt * 4);
    }
    updateRaftPhysics(dt);
    if (G.state === 'playing') {
      G.time += dt;
      updateSheep(dt);
      updateShips(dt);
      updateMarks(dt);
      updateDebris(dt);
      if (G.sheep.dead && G.sheep.deadT > 0.9) gameOver();
    }
    updateBalls(dt);
    updateParts(dt);
    for (var j = 0; j < G.planks.length; j++) {
      if (G.planks[j].flash > 0) G.planks[j].flash = Math.max(0, G.planks[j].flash - dt * 3);
    }
    G.shake = Math.max(0, G.shake - dt * 28);
    G.flash = Math.max(0, G.flash - dt * 2.5);
  }

  function drawSky() {
    var g = ctx;
    var grad = g.createLinearGradient(0, 0, 0, WATER_Y);
    grad.addColorStop(0, '#8ed0d0');
    grad.addColorStop(0.55, '#b2ddcf');
    grad.addColorStop(1, '#dcecd6');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, WATER_Y + 4);
  }

  function drawSun() {
    var g = ctx;
    var sx = 250, sy = 150;
    var grad = g.createRadialGradient(sx, sy, 8, sx, sy, 150);
    grad.addColorStop(0, 'rgba(255,250,225,0.9)');
    grad.addColorStop(0.4, 'rgba(255,245,205,0.35)');
    grad.addColorStop(1, 'rgba(255,245,205,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(sx, sy, 150, 0, 6.2832);
    g.fill();
    g.fillStyle = 'rgba(255,252,238,0.75)';
    g.beginPath();
    g.arc(sx, sy, 46, 0, 6.2832);
    g.fill();
  }

  function puff(cx, cy, r) {
    var g = ctx;
    var offs = [[0, 0, 1], [-0.85, 0.18, 0.72], [0.85, 0.16, 0.75], [-0.42, -0.42, 0.7], [0.45, -0.4, 0.68], [0, 0.42, 0.7]];
    g.fillStyle = '#f4f0e4';
    for (var i = 0; i < offs.length; i++) {
      g.beginPath();
      g.arc(cx + offs[i][0] * r, cy + offs[i][1] * r, r * offs[i][2], 0, 6.2832);
      g.fill();
    }
    g.fillStyle = 'rgba(210,220,210,0.5)';
    for (var k = 0; k < offs.length; k++) {
      g.beginPath();
      g.arc(cx + offs[k][0] * r, cy + (offs[k][1] + 0.34) * r, r * offs[k][2] * 0.8, 0, 6.2832);
      g.fill();
    }
    g.fillStyle = '#f4f0e4';
    for (var m = 0; m < offs.length; m++) {
      g.beginPath();
      g.arc(cx + offs[m][0] * r, cy + offs[m][1] * r, r * offs[m][2], 0, 6.2832);
      g.fill();
    }
  }

  function drawClouds() {
    for (var i = 0; i < G.clouds.length; i++) {
      var c = G.clouds[i];
      puff(c.x, c.y, 46 * c.s);
    }
  }

  function drawMountain() {
    var g = ctx;

    g.fillStyle = '#a6c48c';
    g.beginPath();
    g.moveTo(420, WATER_Y);
    g.quadraticCurveTo(560, 400, 700, WATER_Y);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(760, WATER_Y);
    g.quadraticCurveTo(940, 380, 1140, WATER_Y);
    g.closePath();
    g.fill();

    g.beginPath();
    g.moveTo(610, WATER_Y);
    g.quadraticCurveTo(760, 460, 872, 352);
    g.quadraticCurveTo(990, 462, 1140, WATER_Y);
    g.closePath();
    g.fillStyle = '#6f9a5c';
    g.fill();
    g.lineWidth = 6;
    g.strokeStyle = OUTLINE;
    g.lineJoin = 'round';
    g.stroke();

    g.save();
    g.clip();
    g.fillStyle = 'rgba(45,72,42,0.18)';
    g.fillRect(880, 340, 320, 320);
    g.fillStyle = 'rgba(255,255,255,0.12)';
    g.fillRect(560, 340, 240, 320);
    g.restore();

    g.beginPath();
    g.moveTo(806, 472);
    g.lineTo(872, 352);
    g.lineTo(946, 472);
    g.closePath();
    g.fillStyle = '#6d5a44';
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.beginPath();
    g.moveTo(852, 378);
    g.quadraticCurveTo(872, 358, 896, 378);
    g.quadraticCurveTo(872, 392, 852, 378);
    g.closePath();
    g.fillStyle = '#ff7a2a';
    g.fill();

    g.strokeStyle = '#ff8a33';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(866, 384);
    g.quadraticCurveTo(856, 410, 848, 442);
    g.moveTo(884, 386);
    g.quadraticCurveTo(896, 414, 902, 440);
    g.stroke();

    for (var i = 0; i < 7; i++) {
      var t = (G.clock * 22 + i * 30) % 190;
      var yy = 356 - t;
      var rad = 9 + t * 0.16;
      g.globalAlpha = clamp(0.55 - t / 320, 0, 0.55);
      g.fillStyle = '#e6e0d0';
      g.beginPath();
      g.arc(872 + Math.sin(t * 0.05) * 20, yy, rad, 0, 6.2832);
      g.fill();
    }
    g.globalAlpha = 1;

    for (var k = 0; k < 5; k++) {
      var bx = 640 + k * 96 + Math.sin(k * 2.1) * 20;
      var by = 500 + Math.cos(k * 1.7) * 22;
      g.beginPath();
      g.moveTo(bx, by);
      g.lineTo(bx - 7, by + 26);
      g.lineTo(bx + 7, by + 26);
      g.closePath();
      g.fillStyle = '#40663a';
      g.fill();
      g.lineWidth = 3;
      g.strokeStyle = OUTLINE;
      g.stroke();
    }
  }

  function waveY(x, phase, amp, freq) {
    return WATER_Y + Math.sin(x * 0.018 + G.clock * 1.2 + phase) * amp + Math.sin(x * 0.05 - G.clock * 1.7 + phase) * (amp * 0.4) + Math.sin((x + freq) * 0.006 + G.clock * 0.5) * 2;
  }

  function drawWater() {
    var g = ctx;
    var grad = g.createLinearGradient(0, WATER_Y - 6, 0, H);
    grad.addColorStop(0, '#5cb2b2');
    grad.addColorStop(0.45, '#41a0a2');
    grad.addColorStop(1, '#2a757a');
    g.beginPath();
    g.moveTo(0, H);
    g.lineTo(0, waveY(0, 0, 5, 0));
    for (var x = 0; x <= W; x += 10) g.lineTo(x, waveY(x, 0, 5, 0));
    g.lineTo(W, H);
    g.closePath();
    g.fillStyle = grad;
    g.fill();

    g.strokeStyle = 'rgba(28,68,70,0.5)';
    g.lineWidth = 3;
    g.beginPath();
    for (var x2 = 0; x2 <= W; x2 += 10) {
      var yy = waveY(x2, 0, 5, 0);
      if (x2 === 0) g.moveTo(x2, yy); else g.lineTo(x2, yy);
    }
    g.stroke();

    for (var i = 1; i <= 5; i++) {
      g.beginPath();
      for (var x3 = 0; x3 <= W; x3 += 12) {
        var y3 = WATER_Y + 30 + i * 26 + Math.sin(x3 * 0.02 + G.clock * 1.1 + i) * 5;
        if (x3 === 0) g.moveTo(x3, y3); else g.lineTo(x3, y3);
      }
      g.strokeStyle = 'rgba(190,235,232,' + (0.16 - i * 0.02) + ')';
      g.lineWidth = 4;
      g.stroke();
    }
  }

  function drawSubmerged() {
    var g = ctx;
    var grad = g.createLinearGradient(0, WATER_Y - 2, 0, WATER_Y + 150);
    grad.addColorStop(0, 'rgba(70,165,166,0.9)');
    grad.addColorStop(0.6, 'rgba(52,140,142,0.72)');
    grad.addColorStop(1, 'rgba(42,120,124,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(0, WATER_Y + 150);
    g.lineTo(0, waveY(0, 0, 5, 0));
    for (var x = 0; x <= W; x += 10) g.lineTo(x, waveY(x, 0, 5, 0));
    g.lineTo(W, WATER_Y + 150);
    g.closePath();
    g.fill();
  }

  var SHIP_PAL = {
    left: { hull: '#a8402d', hullD: '#7c2c1f', trim: '#e7c887', sail: '#f3ead0', sailS: '#ddcfa4' },
    right: { hull: '#c6a24e', hullD: '#9a7a30', trim: '#f2e0a8', sail: '#f5eeda', sailS: '#e2d6b4' }
  };

  function drawShip(ship) {
    var g = ctx;
    var p = SHIP_PAL[ship.side];
    g.save();
    g.translate(ship.ax, ship.ay + ship.bob);
    if (ship.dir < 0) g.scale(-1, 1);

    g.lineJoin = 'round';

    g.beginPath();
    g.moveTo(-380, -140);
    g.quadraticCurveTo(-200, -166, -30, -174);
    g.quadraticCurveTo(32, -166, 28, -70);
    g.quadraticCurveTo(24, 20, -20, 60);
    g.quadraticCurveTo(-160, 106, -300, 72);
    g.quadraticCurveTo(-402, 42, -380, -140);
    g.closePath();
    g.fillStyle = p.hull;
    g.fill();

    g.save();
    g.clip();
    g.fillStyle = p.trim;
    g.fillRect(-410, -156, 470, 26);
    g.fillStyle = p.hullD;
    g.fillRect(-410, -130, 470, 14);
    g.strokeStyle = 'rgba(60,30,15,0.32)';
    g.lineWidth = 2;
    for (var i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(-400, -78 + i * 36);
      g.quadraticCurveTo(-160, -58 + i * 36, 24, -110 + i * 42);
      g.stroke();
    }
    g.restore();

    g.lineWidth = 6;
    g.strokeStyle = OUTLINE;
    g.stroke();

    for (var px = -92; px >= -332; px -= 52) {
      g.beginPath();
      g.arc(px, -56, 14, 0, 6.2832);
      g.fillStyle = '#3a2c22';
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = OUTLINE;
      g.stroke();
      g.beginPath();
      g.arc(px, -56, 8.5, 0, 6.2832);
      g.fillStyle = '#f2c469';
      g.fill();
    }

    g.beginPath();
    g.moveTo(-380, -140);
    g.lineTo(-380, -256);
    g.lineTo(-250, -256);
    g.lineTo(-214, -140);
    g.closePath();
    g.fillStyle = p.hull;
    g.fill();
    g.lineWidth = 6;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.beginPath();
    g.moveTo(-394, -256);
    g.lineTo(-236, -256);
    g.lineTo(-236, -276);
    g.lineTo(-394, -276);
    g.closePath();
    g.fillStyle = p.hullD;
    g.fill();
    g.stroke();

    for (var wi = 0; wi < 3; wi++) {
      g.beginPath();
      g.arc(-352 + wi * 54, -198, 13, 0, 6.2832);
      g.fillStyle = '#f2c469';
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = OUTLINE;
      g.stroke();
    }

    g.strokeStyle = OUTLINE;
    g.lineWidth = 11;
    g.beginPath();
    g.moveTo(-150, -150);
    g.lineTo(-150, -468);
    g.stroke();
    g.strokeStyle = '#6b4a2a';
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(-150, -150);
    g.lineTo(-150, -468);
    g.stroke();

    g.beginPath();
    g.moveTo(-150, -436);
    g.quadraticCurveTo(-40, -424, 22, -402);
    g.quadraticCurveTo(30, -328, 8, -252);
    g.quadraticCurveTo(-72, -258, -150, -272);
    g.closePath();
    g.fillStyle = p.sail;
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();
    g.fillStyle = 'rgba(0,0,0,0.07)';
    g.beginPath();
    g.moveTo(-150, -272);
    g.quadraticCurveTo(-72, -258, 8, -252);
    g.quadraticCurveTo(0, -300, -6, -338);
    g.quadraticCurveTo(-80, -330, -150, -330);
    g.closePath();
    g.fill();

    g.beginPath();
    g.moveTo(-150, -462);
    g.quadraticCurveTo(-70, -454, -8, -440);
    g.quadraticCurveTo(0, -396, -14, -364);
    g.quadraticCurveTo(-80, -368, -150, -376);
    g.closePath();
    g.fillStyle = p.sail;
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.strokeStyle = 'rgba(40,25,15,0.5)';
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(-150, -466);
    g.lineTo(16, -150);
    g.moveTo(-150, -430);
    g.lineTo(-372, -150);
    g.stroke();

    g.strokeStyle = OUTLINE;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(-150, -468);
    g.lineTo(-150, -540);
    g.stroke();
    g.beginPath();
    g.moveTo(-150, -540);
    g.lineTo(-62, -524);
    g.quadraticCurveTo(-92, -512, -62, -500);
    g.lineTo(-150, -500);
    g.closePath();
    g.fillStyle = '#2b2b2b';
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = OUTLINE;
    g.stroke();
    g.fillStyle = '#f4f2ea';
    g.beginPath();
    g.arc(-120, -521, 7, 0, 6.2832);
    g.fill();
    g.fillRect(-128, -517, 16, 4);
    g.strokeStyle = '#f4f2ea';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-133, -509);
    g.lineTo(-107, -529);
    g.moveTo(-107, -509);
    g.lineTo(-133, -529);
    g.stroke();

    var rec = ship.recoil * 16;
    g.fillStyle = '#6b4a2a';
    g.strokeStyle = OUTLINE;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(-70, -70);
    g.lineTo(-6, -70);
    g.lineTo(-2, -30);
    g.lineTo(-64, -34);
    g.closePath();
    g.fill();
    g.stroke();

    g.save();
    g.translate(-rec, -58);
    g.beginPath();
    g.moveTo(-26, -14);
    g.lineTo(46, -18);
    g.lineTo(46, 14);
    g.lineTo(-26, 14);
    g.closePath();
    g.fillStyle = '#4a4a52';
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();
    g.beginPath();
    g.moveTo(46, -20);
    g.lineTo(60, -21);
    g.lineTo(60, 17);
    g.lineTo(46, 18);
    g.closePath();
    g.fillStyle = '#3a3a42';
    g.fill();
    g.stroke();
    g.beginPath();
    g.arc(55, -2, 7, 0, 6.2832);
    g.fillStyle = '#141414';
    g.fill();
    g.restore();

    if (ship.recoil > 0.55) {
      var mx = 62 - rec, my = -58;
      var burst = (ship.recoil - 0.55) / 0.45;
      g.save();
      g.translate(mx, my);
      g.globalAlpha = burst;
      g.fillStyle = '#ffd24a';
      g.beginPath();
      for (var s = 0; s < 10; s++) {
        var a = (s / 10) * 6.2832;
        var rad = s % 2 === 0 ? 26 * burst + 10 : 11;
        g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      g.closePath();
      g.fill();
      g.fillStyle = '#fff6cf';
      g.beginPath();
      g.arc(0, 0, 12 * burst + 4, 0, 6.2832);
      g.fill();
      g.globalAlpha = 1;
      g.restore();
    }

    g.restore();
  }

  function drawRaft() {
    var g = ctx;
    var raft = G.raft;
    g.save();
    g.translate(raft.cx, raft.cy);
    g.rotate(raft.ang);

    g.fillStyle = '#8a6a3e';
    g.strokeStyle = OUTLINE;
    g.lineWidth = 5;
    rr(g, -174, 22, 348, 24, 12);
    g.fill();
    g.stroke();
    g.fillStyle = '#7a5c34';
    rr(g, -170, 34, 340, 12, 6);
    g.fill();

    for (var pi = 0; pi < G.planks.length; pi++) {
      var p = G.planks[pi];
      if (!p.alive) continue;
      drawPlank(p);
    }

    for (var k = 0; k < G.planks.length - 1; k++) {
      var a = G.planks[k], c = G.planks[k + 1];
      if (!a.alive || !c.alive) continue;
      var seam = (a.lx + c.lx) / 2;
      g.strokeStyle = '#6b4a2a';
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(seam, 4);
      g.lineTo(seam, 20);
      g.moveTo(seam - 6, 8);
      g.lineTo(seam + 6, 16);
      g.stroke();
    }
    g.restore();
  }

  function drawPlank(p) {
    var g = ctx;
    g.save();
    g.translate(p.lx, 0);
    var w = p.w, h = p.h;
    rr(g, -w / 2, -h / 2, w, h, 5);
    g.fillStyle = p.hp >= 2 ? '#c69a5c' : '#b07f45';
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.strokeStyle = 'rgba(90,60,30,0.32)';
    g.lineWidth = 1.6;
    for (var i = -1; i <= 1; i++) {
      g.beginPath();
      g.moveTo(-w / 2 + 6, i * 6);
      g.lineTo(w / 2 - 6, i * 6);
      g.stroke();
    }

    if (p.hp === 1) {
      g.strokeStyle = '#4a3018';
      g.lineWidth = 2.2;
      g.beginPath();
      g.moveTo(-w * 0.28, -h / 2 + 2);
      g.lineTo(-w * 0.14, -2);
      g.lineTo(-w * 0.22, h / 2 - 2);
      g.moveTo(w * 0.14, -h / 2 + 2);
      g.lineTo(w * 0.06, 0);
      g.lineTo(w * 0.18, h / 2 - 2);
      g.stroke();
    }

    if (p.flash > 0) {
      g.globalAlpha = p.flash * 0.6;
      rr(g, -w / 2, -h / 2, w, h, 5);
      g.fillStyle = '#fff4d6';
      g.fill();
      g.globalAlpha = 1;
    }
    g.restore();
  }

  function drawDebris() {
    var g = ctx;
    for (var i = 0; i < G.debris.length; i++) {
      var d = G.debris[i];
      g.save();
      g.translate(d.x, d.y);
      g.rotate(d.rot);
      g.globalAlpha = clamp(d.life - d.t, 0, 1) * 0.95 + 0.05;
      rr(g, -d.w / 2, -d.h / 2, d.w, d.h, 5);
      g.fillStyle = '#a87942';
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = OUTLINE;
      g.stroke();
      g.globalAlpha = 1;
      g.restore();
    }
  }

  function drawTelegraphs() {
    var g = ctx;
    var pulse = 0.5 + 0.5 * Math.sin(G.clock * 12);
    for (var i = 0; i < G.marks.length; i++) {
      var m = G.marks[i];
      var mz = muzzle(m.ship);
      var t = 1.15;
      var vx = (m.tx - mz.x) / t;
      var vy = (m.ty - mz.y) / t - 0.5 * GRAVITY * t;
      g.fillStyle = 'rgba(220,70,50,0.55)';
      for (var s = 0; s <= 1.001; s += 0.07) {
        var tt = s * t;
        var px = mz.x + vx * tt;
        var py = mz.y + vy * tt + 0.5 * GRAVITY * tt * tt;
        g.beginPath();
        g.arc(px, py, 3, 0, 6.2832);
        g.fill();
      }

      g.globalAlpha = 0.28 + 0.5 * pulse;
      g.strokeStyle = '#e0402c';
      g.lineWidth = 5;
      g.beginPath();
      g.arc(m.tx, m.ty + 4, 30 + pulse * 4, 0, 6.2832);
      g.stroke();
      g.fillStyle = 'rgba(224,64,44,0.22)';
      g.beginPath();
      g.arc(m.tx, m.ty + 4, 26 + pulse * 4, 0, 6.2832);
      g.fill();

      g.fillStyle = '#e0402c';
      g.beginPath();
      g.moveTo(m.tx - 12, m.ty - 46);
      g.lineTo(m.tx + 12, m.ty - 46);
      g.lineTo(m.tx, m.ty - 30);
      g.closePath();
      g.fill();
      g.globalAlpha = 1;
    }
  }

  function drawBalls() {
    var g = ctx;
    for (var i = 0; i < G.balls.length; i++) {
      var b = G.balls[i];
      g.beginPath();
      g.arc(b.x, b.y, b.r, 0, 6.2832);
      g.fillStyle = '#2f2f36';
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = '#141418';
      g.stroke();
      g.beginPath();
      g.arc(b.x - b.r * 0.32, b.y - b.r * 0.34, b.r * 0.28, 0, 6.2832);
      g.fillStyle = 'rgba(180,180,200,0.7)';
      g.fill();
      var a = b.spin;
      g.strokeStyle = '#ffb648';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(b.x + Math.cos(a) * b.r, b.y + Math.sin(a) * b.r);
      g.lineTo(b.x + Math.cos(a) * (b.r + 8), b.y + Math.sin(a) * (b.r + 8));
      g.stroke();
      g.fillStyle = '#fff2b0';
      g.beginPath();
      g.arc(b.x + Math.cos(a) * (b.r + 9), b.y + Math.sin(a) * (b.r + 9), 2.5, 0, 6.2832);
      g.fill();
    }
  }

  function drawParts() {
    var g = ctx;
    for (var i = 0; i < G.parts.length; i++) {
      var p = G.parts[i];
      var a = clamp(p.life / p.max, 0, 1);
      if (p.type === 'wood') {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.globalAlpha = a;
        g.fillStyle = p.col;
        g.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        g.lineWidth = 1.5;
        g.strokeStyle = OUTLINE;
        g.strokeRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        g.globalAlpha = 1;
        g.restore();
      } else if (p.type === 'smoke') {
        g.globalAlpha = a * (p.a || 0.6);
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, p.size, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
      } else if (p.type === 'spark') {
        g.globalAlpha = a;
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, p.size, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
      } else if (p.type === 'drop') {
        g.globalAlpha = a;
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, p.size, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
      } else if (p.type === 'foam') {
        g.globalAlpha = a * (p.a || 0.8);
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, p.size, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
      }
    }
  }

  function drawSheepSprite(x, y, facing, state, animT, squash, rot, dead, deadT) {
    var g = ctx;
    var wool = [
      [-8, -40, 13], [6, -41, 12], [14, -30, 11], [-16, -30, 11],
      [-4, -24, 14], [10, -22, 12], [-14, -18, 10], [2, -14, 12], [16, -18, 9]
    ];
    g.save();
    g.translate(x, y);
    if (rot) g.rotate(rot * facing);
    g.scale(facing * (1 + (1 - squash) * 0.35), squash);

    var legPhase = state === 'run' ? animT * 16 : 0;
    var legs = [-10, -4, 4, 9];
    for (var i = 0; i < legs.length; i++) {
      var lx = legs[i];
      var swing = 0;
      if (state === 'run') swing = Math.sin(legPhase + i * 1.9) * 5;
      else if (state === 'jump') swing = -3;
      else if (state === 'fall') swing = 3;
      g.strokeStyle = OUTLINE;
      g.lineWidth = 6.5;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(lx, -14);
      g.lineTo(lx + swing, 0);
      g.stroke();
      g.strokeStyle = '#4a4038';
      g.lineWidth = 3.5;
      g.beginPath();
      g.moveTo(lx, -14);
      g.lineTo(lx + swing, 0);
      g.stroke();
    }

    var bodyBob = state === 'run' ? Math.abs(Math.sin(legPhase)) * 1.6 : 0;
    g.save();
    g.translate(0, -bodyBob);

    g.lineWidth = 6;
    g.strokeStyle = OUTLINE;
    for (var w = 0; w < wool.length; w++) {
      g.beginPath();
      g.arc(wool[w][0], wool[w][1], wool[w][2], 0, 6.2832);
      g.stroke();
    }
    for (var w2 = 0; w2 < wool.length; w2++) {
      g.beginPath();
      g.arc(wool[w2][0], wool[w2][1], wool[w2][2] * 0.96, 0, 6.2832);
      g.fillStyle = '#f7f2e6';
      g.fill();
    }

    g.beginPath();
    g.arc(-24, -28, 8, 0, 6.2832);
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();
    g.fillStyle = '#f7f2e6';
    g.fill();

    g.save();
    g.translate(16, -32);
    g.beginPath();
    g.ellipse(0, 0, 12, 13, 0, 0, 6.2832);
    g.fillStyle = '#40382f';
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.beginPath();
    g.ellipse(-11, -6, 5, 7, -0.4, 0, 6.2832);
    g.fillStyle = '#4a4038';
    g.fill();
    g.lineWidth = 3;
    g.stroke();
    g.beginPath();
    g.ellipse(12, -8, 4.5, 6.5, 0.4, 0, 6.2832);
    g.fillStyle = '#4a4038';
    g.fill();
    g.stroke();

    g.beginPath();
    g.arc(1, -6, 4.4, 0, 6.2832);
    g.fillStyle = '#fdfbf4';
    g.fill();
    g.beginPath();
    g.arc(9, -5, 4.4, 0, 6.2832);
    g.fill();

    if (dead) {
      g.strokeStyle = '#101010';
      g.lineWidth = 2.4;
      g.beginPath();
      g.moveTo(-3, -10);
      g.lineTo(5, -2);
      g.moveTo(5, -10);
      g.lineTo(-3, -2);
      g.moveTo(5, -9);
      g.lineTo(13, -1);
      g.moveTo(13, -9);
      g.lineTo(5, -1);
      g.stroke();
    } else {
      g.fillStyle = '#151515';
      g.beginPath();
      g.arc(2.4, -5.4, 2.1, 0, 6.2832);
      g.fill();
      g.beginPath();
      g.arc(10.4, -4.4, 2.1, 0, 6.2832);
      g.fill();
    }

    g.beginPath();
    g.arc(6, 5, 3, 0, 6.2832);
    g.fillStyle = '#c98f8f';
    g.fill();
    g.fillStyle = '#f7f2e6';
    g.beginPath();
    g.arc(-3, -20, 6, 0, 6.2832);
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = OUTLINE;
    g.stroke();

    g.fillStyle = '#c0392b';
    g.beginPath();
    g.moveTo(-9, -20);
    g.quadraticCurveTo(0, -30, 12, -22);
    g.lineTo(13, -14);
    g.quadraticCurveTo(0, -22, -9, -12);
    g.closePath();
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = OUTLINE;
    g.stroke();
    g.beginPath();
    g.moveTo(-8, -18);
    g.quadraticCurveTo(-20, -24, -26, -14);
    g.quadraticCurveTo(-18, -14, -14, -18);
    g.closePath();
    g.fill();
    g.stroke();

    g.restore();
    g.restore();
    g.restore();
  }

  function drawSheep() {
    var s = G.sheep;
    drawSheepSprite(s.x, s.y, s.facing, s.state, s.animT, s.squash, s.rot, s.dead, s.deadT);
  }

  function drawFoam() {
    var g = ctx;
    g.strokeStyle = 'rgba(255,255,255,0.75)';
    g.lineWidth = 3;
    for (var x = 0; x <= W; x += 24) {
      var y = waveY(x, 0, 5, 0) + 8;
      g.beginPath();
      g.arc(x, y, 4, 0, 3.1416);
      g.stroke();
    }
  }

  function drawText(str, x, y, size, color, align, family, weight, strokeW) {
    ctx.save();
    ctx.font = (weight || '700') + ' ' + size + 'px ' + (family || "Georgia, 'Times New Roman', serif");
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    if (strokeW) {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = OUTLINE;
      ctx.lineJoin = 'round';
      ctx.strokeText(str, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.restore();
  }

  function fmt(t) {
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    var ms = Math.floor((t - Math.floor(t)) * 1000);
    function pad(n, l) { var r = String(n); while (r.length < l) r = '0' + r; return r; }
    return pad(m, 2) + ':' + pad(s, 2) + '.' + pad(ms, 3);
  }

  function signPanel(x, y, w, h) {
    ctx.save();
    rr(ctx, x, y, w, h, 12);
    ctx.fillStyle = 'rgba(139,90,43,0.94)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
    rr(ctx, x + 6, y + 6, w - 12, h - 12, 8);
    ctx.strokeStyle = 'rgba(231,200,135,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawHUD() {
    if (G.state === 'title') return;
    signPanel(22, 18, 250, 62);
    drawText('SURVIVED', 34, 36, 16, '#e7c887', 'left');
    drawText(fmt(G.time), 34, 60, 30, '#fdf6e3', 'left', "Consolas, 'Courier New', monospace", '700');

    signPanel(W - 272, 18, 250, 62);
    drawText('BEST', W - 260, 36, 16, '#e7c887', 'left');
    drawText(fmt(G.best), W - 260, 60, 30, '#fdf6e3', 'left', "Consolas, 'Courier New', monospace", '700');

    var remaining = G.planks.filter(function (p) { return p.alive; }).length;
    drawText('PLANKS ' + remaining + ' / ' + G.planks.length, W / 2, 34, 20, '#fdf6e3', 'center', "Georgia, serif", '700', 4);

    if (muted) drawText('MUTE (M)', W / 2, H - 26, 15, 'rgba(253,246,227,0.7)', 'center', "Georgia, serif", '700');
  }

  function drawOverlays() {
    if (G.state === 'title') {
      ctx.fillStyle = 'rgba(20,40,45,0.35)';
      ctx.fillRect(0, 0, W, H);

      var bob = Math.sin(G.clock * 2) * 4;
      drawText('RAFT SURVIVAL', W / 2, 176 + bob, 86, '#fdf6e3', 'center', "Georgia, serif", '800', 12);
      drawText('FAN RECREATION', W / 2, 232 + bob, 20, '#e7c887', 'center', "Georgia, serif", '700', 4);
      drawText('TRY NOT TO SINK', W / 2, 316, 46, '#ffffff', 'center', "Georgia, serif", '800', 7);
      drawText('HOW LONG CAN YOU SURVIVE?', W / 2, 366, 34, '#ffffff', 'center', "Georgia, serif", '700', 6);

      var pulse = 0.55 + 0.45 * Math.sin(G.clock * 4);
      drawText('PRESS SPACE OR CLICK TO START', W / 2, 452, 28, 'rgba(253,246,227,' + pulse + ')', 'center', "Georgia, serif", '700', 5);

      drawText('MOVE  A / D  or  \u2190 \u2192      JUMP  SPACE      PAUSE  ESC      RESTART  R      MUTE  M',
        W / 2, 528, 18, '#e7c887', 'center', "Georgia, serif", '700', 3);

      drawText('BEST TIME: ' + fmt(G.best), W / 2, 576, 22, '#fdf6e3', 'center', "Consolas, 'Courier New', monospace", '700', 4);

      drawText('Raft Survival \u2014 fan recreation. Original idea: \u201cPirate Raft\u201d bonus level (Home Sheep Home 2 / The Pirates!).',
        W / 2, H - 30, 14, 'rgba(253,246,227,0.66)', 'center', "Georgia, serif", '600', 2);
      return;
    }

    if (G.state === 'paused') {
      ctx.fillStyle = 'rgba(20,40,45,0.55)';
      ctx.fillRect(0, 0, W, H);
      drawText('PAUSED', W / 2, H / 2 - 30, 76, '#fdf6e3', 'center', "Georgia, serif", '800', 10);
      drawText('ESC to resume      R to restart', W / 2, H / 2 + 50, 24, '#e7c887', 'center', "Georgia, serif", '700', 4);
      return;
    }

    if (G.state === 'gameover') {
      ctx.fillStyle = 'rgba(20,40,45,0.5)';
      ctx.fillRect(0, 0, W, H);
      drawText('YOU SANK!', W / 2, 226, 82, '#e0402c', 'center', "Georgia, serif", '800', 12);
      drawText('SURVIVAL TIME', W / 2, 306, 24, '#e7c887', 'center', "Georgia, serif", '700', 4);
      drawText(fmt(G.time), W / 2, 356, 54, '#fdf6e3', 'center', "Consolas, 'Courier New', monospace", '700', 6);
      if (G.newBest) {
        var pulse = 0.5 + 0.5 * Math.sin(G.clock * 8);
        drawText('NEW BEST!', W / 2, 410, 34, 'rgba(255,213,74,' + pulse + ')', 'center', "Georgia, serif", '800', 6);
      } else {
        drawText('BEST  ' + fmt(G.best), W / 2, 410, 26, '#e7c887', 'center', "Consolas, 'Courier New', monospace", '700', 4);
      }
      var p2 = 0.55 + 0.45 * Math.sin(G.clock * 4);
      drawText('PRESS R OR CLICK TO SAIL AGAIN', W / 2, 494, 28, 'rgba(253,246,227,' + p2 + ')', 'center', "Georgia, serif", '700', 5);
      return;
    }
  }

  var grainPat = null;
  function makeGrain() {
    var c = document.createElement('canvas');
    c.width = 160; c.height = 160;
    var g = c.getContext('2d');
    var img = g.createImageData(160, 160);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = (Math.random() * 255) | 0;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 16;
    }
    g.putImageData(img, 0, 0);
    grainPat = ctx.createPattern(c, 'repeat');
  }

  function drawVignette() {
    var g = ctx;
    var vg = g.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 0.98);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(40,25,15,0.38)');
    g.fillStyle = vg;
    g.fillRect(0, 0, W, H);
    if (grainPat) {
      g.save();
      g.globalAlpha = 0.5;
      g.fillStyle = grainPat;
      g.fillRect(0, 0, W, H);
      g.restore();
    }
    if (G.flash > 0) {
      g.fillStyle = 'rgba(255,230,180,' + (G.flash * 0.5) + ')';
      g.fillRect(0, 0, W, H);
    }
  }

  function render() {
    ctx.save();
    var sh = G.shake;
    if (sh > 0.3) ctx.translate(rand(-sh, sh) * 0.5, rand(-sh, sh) * 0.5);

    drawSky();
    drawSun();
    drawClouds();
    drawMountain();
    drawWater();
    drawShip(G.ships[0]);
    drawShip(G.ships[1]);
    drawSubmerged();
    drawRaft();
    drawTelegraphs();
    drawDebris();
    drawSheep();
    drawBalls();
    drawParts();
    drawFoam();
    ctx.restore();

    drawVignette();
    drawHUD();
    drawOverlays();
  }

  var lastT = 0, acc = 0;
  function loop(now) {
    var dt = (now - lastT) / 1000;
    lastT = now;
    if (dt > 0.05) dt = 0.05;
    if (dt < 0) dt = 0;
    acc += dt;
    var step = 1 / 60, guard = 0;
    while (acc >= step && guard < 5) { update(step); acc -= step; guard++; }
    if (guard >= 5) acc = 0;
    render();
    requestAnimationFrame(loop);
  }

  function resize() {
    var scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    canvas.style.width = Math.floor(W * scale) + 'px';
    canvas.style.height = Math.floor(H * scale) + 'px';
  }

  window.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    if (['arrowleft', 'a'].indexOf(k) >= 0) keys.left = true;
    if (['arrowright', 'd'].indexOf(k) >= 0) keys.right = true;

    if (k === ' ' || k === 'arrowup' || k === 'w' || k === 'enter') {
      e.preventDefault();
      if (G.state === 'title' || G.state === 'gameover') { start(); return; }
      if (G.state === 'playing' && !e.repeat) jumpQueued = true;
      keys.jump = true;
    }
    if (k === 'escape') togglePause();
    if (k === 'r') { if (G.state !== 'title') start(); }
    if (k === 'm') { muted = !muted; }
    ensureAudio();
  });

  window.addEventListener('keyup', function (e) {
    var k = e.key.toLowerCase();
    if (['arrowleft', 'a'].indexOf(k) >= 0) keys.left = false;
    if (['arrowright', 'd'].indexOf(k) >= 0) keys.right = false;
    if ([' ', 'arrowup', 'w', 'enter'].indexOf(k) >= 0) keys.jump = false;
  });

  canvas.addEventListener('pointerdown', function (e) {
    ensureAudio();
    if (G.state === 'title' || G.state === 'gameover') start();
    else if (G.state === 'playing') jumpQueued = true;
  });

  function bindTouchButton(id, on, off) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', function (e) { e.preventDefault(); ensureAudio(); if (G.state === 'title' || G.state === 'gameover') start(); on(); }, { passive: false });
    el.addEventListener('touchend', function (e) { e.preventDefault(); off(); }, { passive: false });
    el.addEventListener('touchcancel', function () { off(); });
  }
  bindTouchButton('btnLeft',
    function () { keys.left = true; },
    function () { keys.left = false; });
  bindTouchButton('btnRight',
    function () { keys.right = true; },
    function () { keys.right = false; });
  bindTouchButton('btnJump',
    function () { jumpQueued = true; keys.jump = true; },
    function () { keys.jump = false; });

  if ('ontouchstart' in window) {
    touchMode = true;
    document.body.classList.add('touch-on');
  }

  window.addEventListener('resize', resize);

  loadBest();
  makeClouds();
  resetGame();
  makeGrain();
  resize();
  lastT = performance.now();
  requestAnimationFrame(loop);
})();
