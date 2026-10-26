import { $, clamp, debounce, store } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';
import { constellations, starById, starColor, stars, type Star } from '../../data/stars';
import {
  formatLocal,
  formatUT,
  fromZonedInput,
  galacticToEquatorial,
  horizontal,
  localSiderealTime,
  moonPhase,
  moonPosition,
  sunPosition,
  toZonedInput,
  type Equatorial,
} from './astro';

interface SkyPlace {
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

const DEFAULT_PLACE: SkyPlace = {
  name: 'Москва',
  country: 'Россия',
  country_code: 'RU',
  admin1: 'Москва',
  latitude: 55.7558,
  longitude: 37.6173,
  timezone: 'Europe/Moscow',
};

const FALLBACK: SkyPlace[] = [
  { name: 'Москва', country: 'Россия', country_code: 'RU', admin1: 'Москва', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Санкт-Петербург', country: 'Россия', country_code: 'RU', admin1: 'Ленинградская область', latitude: 59.9343, longitude: 30.3351, timezone: 'Europe/Moscow' },
  { name: 'Сочи', country: 'Россия', country_code: 'RU', admin1: 'Краснодарский край', latitude: 43.6028, longitude: 39.7342, timezone: 'Europe/Moscow' },
  { name: 'Екатеринбург', country: 'Россия', country_code: 'RU', admin1: 'Свердловская область', latitude: 56.8389, longitude: 60.6057, timezone: 'Asia/Yekaterinburg' },
  { name: 'Новосибирск', country: 'Россия', country_code: 'RU', admin1: 'Новосибирская область', latitude: 55.0084, longitude: 82.9357, timezone: 'Asia/Novosibirsk' },
  { name: 'Токио', country: 'Япония', country_code: 'JP', admin1: 'Токио', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Лондон', country: 'Великобритания', country_code: 'GB', admin1: 'England', latitude: 51.5072, longitude: -0.1276, timezone: 'Europe/London' },
  { name: 'Нью-Йорк', country: 'США', country_code: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Сидней', country: 'Австралия', country_code: 'AU', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Кейптаун', country: 'ЮАР', country_code: 'ZA', admin1: 'Western Cape', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
  { name: 'Рейкьявик', country: 'Исландия', country_code: 'IS', admin1: 'Capital Region', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { name: 'Сингапур', country: 'Сингапур', country_code: 'SG', admin1: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
];

const CONSTELLATION_NAMES = new Map(constellations.map((c) => [c.id, c.name]));
const placeStore = store<SkyPlace>('wl.sky.place.v1', DEFAULT_PLACE);

// Pre-compute the Milky Way band once: galactic plane → equatorial coordinates.
const MILKY_WAY: Equatorial[] = [];
{
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 780; i++) {
    const l = rnd() * 360;
    const b = (rnd() + rnd() + rnd() - 1.5) * 14;
    MILKY_WAY.push(galacticToEquatorial(l, b));
  }
}

interface Projected {
  x: number;
  y: number;
  visible: boolean;
  alt: number;
  az: number;
}

export function mount(root: HTMLElement): () => void {
  let place = placeStore.get() ?? DEFAULT_PLACE;
  let timestamp = Date.now();
  let camAz = place.latitude >= 0 ? 180 : 0;
  let zoom = 1;
  let playing = false;
  let speed = 600;
  let selected: Star | null = null;
  let hovered: Star | null = null;
  let showLines = true;
  let showLabels = true;
  let showMilky = true;
  let visibleCount = 0;
  let sunAlt = 0;
  let lastHud = 0;

  root.innerHTML = `
    <div class="sky">
      <div class="sky-bar">
        <div class="sky-search">
          ${icon('search')}
          <input type="text" id="sky-city" placeholder="Город наблюдателя" autocomplete="off" spellcheck="false" aria-label="Город наблюдателя" />
          <div class="sky-results" id="sky-results" hidden></div>
        </div>
        <div class="sky-time">
          ${icon('clock')}
          <input type="datetime-local" id="sky-datetime" aria-label="Дата и время" />
          <button class="btn btn--sm btn--ghost" type="button" id="sky-now">Сейчас</button>
          <button class="btn btn--sm btn--primary" type="button" id="sky-play">${icon('play')} <span>Пуск</span></button>
          <select class="select sky-speed" id="sky-speed" aria-label="Скорость времени">
            <option value="60">×60</option>
            <option value="600" selected>×600</option>
            <option value="3600">×3600</option>
          </select>
        </div>
        <button class="btn btn--sm btn--icon" type="button" id="sky-reset" title="Сбросить вид (двойной клик)">${icon('refresh')}</button>
      </div>

      <div class="sky-stage" id="sky-stage">
        <canvas id="sky-canvas" aria-label="Интерактивная карта звёздного неба"></canvas>

        <div class="sky-hud sky-hud--tl">
          <div class="sky-place">
            <span class="wx-flag mono">${(place.country_code || '--').toUpperCase()}</span>
            <b id="sky-place-name">${place.name}</b>
          </div>
          <div class="sky-hud__sub">
            <span id="sky-local">—</span>
            <span class="sky-dot"></span>
            <span id="sky-coords">${place.latitude.toFixed(2)}°, ${place.longitude.toFixed(2)}°</span>
          </div>
        </div>

        <div class="sky-hud sky-hud--tr">
          <button class="sky-toggle is-on" type="button" data-toggle="lines" aria-pressed="true">${icon('stars')} <span>линии</span></button>
          <button class="sky-toggle is-on" type="button" data-toggle="labels" aria-pressed="true">${icon('keyboard')} <span>подписи</span></button>
          <button class="sky-toggle is-on" type="button" data-toggle="milky" aria-pressed="true">${icon('sparkles')} <span>Млечный Путь</span></button>
        </div>

        <div class="sky-info" id="sky-info" hidden></div>

        <div class="sky-hint" id="sky-hint">${icon('mouse')}<span>перетащите небо · колесо — масштаб</span></div>

        <div class="sky-legend">
          <span>m</span>
          <i style="--s:2px"></i><i style="--s:3.4px"></i><i style="--s:4.6px"></i><i style="--s:6px"></i>
          <span>яркость</span>
        </div>

        <div class="sky-tooltip" id="sky-tooltip" hidden></div>
      </div>

      <div class="sky-foot">
        <div class="sky-stat"><span>над горизонтом</span><b id="sky-visible">—</b></div>
        <div class="sky-stat"><span>высота Солнца</span><b id="sky-sun">—</b></div>
        <div class="sky-stat"><span>Луна</span><b id="sky-moon">—</b></div>
        <div class="sky-stat"><span>звёздное время</span><b id="sky-lst">—</b></div>
        <div class="sky-stat"><span>UTC</span><b id="sky-utc">—</b></div>
        <div class="sky-foot__note">${icon('info')} расчёт для широты ${place.latitude.toFixed(2)}°</div>
      </div>
    </div>
  `;

  const canvas = $<HTMLCanvasElement>('#sky-canvas', root)!;
  const ctx = canvas.getContext('2d')!;
  const stage = $('#sky-stage', root)!;
  const info = $('#sky-info', root)!;
  const tooltip = $('#sky-tooltip', root)!;
  const cityInput = $<HTMLInputElement>('#sky-city', root)!;
  const results = $('#sky-results', root)!;
  const datetime = $<HTMLInputElement>('#sky-datetime', root)!;
  const playButton = $<HTMLButtonElement>('#sky-play', root)!;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let horizonRadius = 200;
  let centerX = 0;
  let centerY = 0;
  let projected: { star: Star; x: number; y: number }[] = [];
  let lastFrame = performance.now();
  let raf = 0;
  let disposed = false;
  let hudTick = 0;

  const applyPlace = (p: SkyPlace, silent = false) => {
    place = p;
    placeStore.set(p);
    camAz = p.latitude >= 0 ? 180 : 0;
    $('#sky-place-name', root)!.textContent = p.name;
    $('#sky-coords', root)!.textContent = `${p.latitude.toFixed(2)}°, ${p.longitude.toFixed(2)}°`;
    const flag = root.querySelector('.sky-place .wx-flag');
    if (flag) flag.textContent = (p.country_code || '--').toUpperCase();
    cityInput.value = p.name;
    datetime.value = toZonedInput(timestamp, p.timezone);
    selected = null;
    info.hidden = true;
    updateHud(true);
    if (!silent) toast(`Наблюдатель: ${p.name}`, 'success');
  };

  cityInput.value = place.name;

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const updateHud = (force = false) => {
    const now = performance.now();
    if (!force && now - lastHud < 350) return;
    lastHud = now;
    const local = $('#sky-local', root);
    if (local) local.textContent = formatLocal(timestamp, place.timezone);
    const visible = $('#sky-visible', root);
    if (visible) visible.textContent = String(visibleCount);
    const sun = $('#sky-sun', root);
    if (sun) sun.textContent = `${sunAlt >= 0 ? '+' : ''}${sunAlt.toFixed(1)}°`;
    const moon = $('#sky-moon', root);
    if (moon) {
      const phase = moonPhase(timestamp);
      moon.textContent = `${phase.name} · ${Math.round(phase.illumination * 100)}%`;
    }
    const lst = $('#sky-lst', root);
    if (lst) lst.textContent = `${localSiderealTime(timestamp, place.longitude).toFixed(2)}h`;
    const utc = $('#sky-utc', root);
    if (utc) utc.textContent = `${formatUT(timestamp)} UTC`;
    if (document.activeElement !== datetime) datetime.value = toZonedInput(timestamp, place.timezone);
  };

  const project = (alt: number, az: number): Projected => {
    const r = ((90 - alt) / 90) * horizonRadius;
    const a = (az - camAz) * (Math.PI / 180);
    return {
      x: centerX + r * Math.sin(a),
      y: centerY - r * Math.cos(a),
      visible: alt >= 0,
      alt,
      az,
    };
  };

  const draw = (now: number) => {
    if (!width || !height) return;

    const lst = localSiderealTime(timestamp, place.longitude);
    const sunEq = sunPosition(timestamp);
    const sunH = horizontal(sunEq.ra, sunEq.dec, place.latitude, lst);
    const moonEq = moonPosition(timestamp);
    const moonH = horizontal(moonEq.ra, moonEq.dec, place.latitude, lst);
    const phase = moonPhase(timestamp);
    sunAlt = sunH.alt;

    const day = sunH.alt > 0;
    const twilight = sunH.alt > -12 && sunH.alt <= 0;

    horizonRadius = Math.min(width, height) * 0.465 * zoom;
    centerX = width / 2;
    centerY = height / 2;

    // ----- background / sky dome -----
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const ground = ctx.createLinearGradient(0, 0, 0, height);
    ground.addColorStop(0, '#05050b');
    ground.addColorStop(1, '#080812');
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, width, height);

    const zenithColor = day ? '#245184' : twilight ? '#080714' : '#020208';
    const horizonColor = day ? '#7ba6c8' : twilight ? '#2a1738' : '#0b0e22';
    const skyGrad = ctx.createRadialGradient(centerX, centerY, horizonRadius * 0.05, centerX, centerY, horizonRadius);
    skyGrad.addColorStop(0, zenithColor);
    skyGrad.addColorStop(0.72, day ? '#3f6e9c' : twilight ? '#141029' : '#06060f');
    skyGrad.addColorStop(1, horizonColor);
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = skyGrad;
    ctx.fill();

    if (twilight) {
      const sunPoint = project(sunH.alt, sunH.az);
      const glow = ctx.createRadialGradient(sunPoint.x, sunPoint.y, 0, sunPoint.x, sunPoint.y, horizonRadius * 0.7);
      glow.addColorStop(0, 'rgba(255,140,90,0.3)');
      glow.addColorStop(0.4, 'rgba(255,100,130,0.1)');
      glow.addColorStop(1, 'rgba(255,90,80,0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // ----- atmosphere vignette -----
    const vign = ctx.createRadialGradient(centerX, centerY, horizonRadius * 0.55, centerX, centerY, horizonRadius * 1.02);
    vign.addColorStop(0, 'rgba(0,0,0,0)');
    vign.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = vign;
    ctx.fill();

    // ----- Milky Way -----
    if (showMilky && !day) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalCompositeOperation = 'lighter';
      for (const point of MILKY_WAY) {
        const h = horizontal(point.ra, point.dec, place.latitude, lst);
        if (h.alt < 0) continue;
        const p = project(h.alt, h.az);
        const alpha = 0.07 + Math.min(0.12, Math.max(0, (h.alt / 90) * 0.1));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#aebcff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // ----- grid -----
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = day ? 'rgba(10,30,60,0.12)' : 'rgba(160,180,255,0.07)';
    ctx.lineWidth = 1;
    for (const alt of [30, 60]) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, ((90 - alt) / 90) * horizonRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let az = 0; az < 360; az += 45) {
      const outer = project(0, az);
      const angle = (az - camAz) * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + horizonRadius * Math.sin(angle), centerY - horizonRadius * Math.cos(angle));
      ctx.strokeStyle = day ? 'rgba(10,30,60,0.08)' : 'rgba(160,180,255,0.045)';
      ctx.stroke();
      void outer;
    }
    ctx.restore();

    // ----- constellation lines -----
    const lineColor = day ? 'rgba(20,30,60,0.35)' : 'rgba(155,128,255,0.55)';
    const labelColor = day ? 'rgba(10,20,40,0.55)' : 'rgba(210,218,255,0.7)';

    if (showLines) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.2;
      for (const constellation of constellations) {
        for (const [aId, bId] of constellation.lines) {
          const a = starById.get(aId);
          const b = starById.get(bId);
          if (!a || !b) continue;
          const ha = horizontal(a.ra, a.dec, place.latitude, lst);
          const hb = horizontal(b.ra, b.dec, place.latitude, lst);
          if (ha.alt < 0 || hb.alt < 0) continue;
          const pa = project(ha.alt, ha.az);
          const pb = project(hb.alt, hb.az);
          ctx.globalAlpha = clamp(Math.min(ha.alt, hb.alt) / 18, 0.18, 1);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    if (showLines) {
      ctx.font = '600 10px "JetBrains Mono Variable", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = labelColor;
      for (const constellation of constellations) {
        const points = constellation.stars
          .map((id) => starById.get(id))
          .filter((s): s is Star => Boolean(s))
          .map((s) => horizontal(s.ra, s.dec, place.latitude, lst))
          .filter((h) => h.alt > 8)
          .map((h) => project(h.alt, h.az));
        if (points.length < 2) continue;
        const x = points.reduce((acc, p) => acc + p.x, 0) / points.length;
        const y = points.reduce((acc, p) => acc + p.y, 0) / points.length;
        ctx.globalAlpha = 0.72;
        ctx.fillText(constellation.name.toUpperCase(), x, y - 6);
      }
      ctx.globalAlpha = 1;
    }

    // ----- stars -----
    projected = [];
    visibleCount = 0;
    const dayAlpha = day ? 0.18 : 1;

    for (const star of stars) {
      const h = horizontal(star.ra, star.dec, place.latitude, lst);
      if (h.alt < -1) continue;
      const p = project(h.alt, h.az);
      if (p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) continue;
      visibleCount++;
      projected.push({ star, x: p.x, y: p.y });

      const twinkle = day ? 0.7 : 0.86 + Math.sin(now / 950 + star.ra * 8) * 0.14;
      const baseSize = clamp(3.5 - star.mag * 0.48, 0.8, 4.6) * (0.9 + zoom * 0.12);
      const isSelected = selected?.id === star.id;
      const isHover = hovered?.id === star.id;
      const alpha = (star.mag > 3 ? 0.65 : 1) * dayAlpha * twinkle;

      ctx.globalAlpha = isSelected || isHover ? 1 : alpha;
      ctx.fillStyle = starColor(star.bv);
      ctx.shadowBlur = day ? 0 : star.mag < 1.4 ? 9 : star.mag < 2.6 ? 4 : 0;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, baseSize * (isSelected || isHover ? 1.45 : 1), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isSelected) {
        ctx.strokeStyle = '#c4f56a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseSize + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x + baseSize + 7, p.y);
        ctx.lineTo(p.x + baseSize + 20, p.y - 16);
        ctx.stroke();
      }

      const showName =
        showLabels &&
        (isSelected || isHover || star.mag < 1.55 || (star.mag < 2.2 && zoom > 1.35) || (star.mag < 2.6 && zoom > 1.9));
      if (showName) {
        ctx.globalAlpha = day ? 0.45 : isSelected || isHover ? 1 : 0.8;
        ctx.fillStyle = day ? '#0b1730' : '#eef1ff';
        ctx.font = `${isSelected || isHover ? '600 12px' : '500 10.5px'} "Manrope Variable", sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(star.name, p.x + baseSize + 5, p.y + 3.5);
      }
    }
    ctx.globalAlpha = 1;

    // ----- Sun -----
    if (sunH.alt > -1) {
      const sp = project(Math.max(sunH.alt, 0), sunH.az);
      const glow = ctx.createRadialGradient(sp.x, sp.y, 2, sp.x, sp.y, 54);
      glow.addColorStop(0, 'rgba(255,246,216,0.9)');
      glow.addColorStop(0.18, 'rgba(255,203,92,0.6)');
      glow.addColorStop(1, 'rgba(255,160,60,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 54, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff6d8';
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ----- Moon with phase -----
    if (moonH.alt > -1) {
      const mp = project(Math.max(moonH.alt, 0), moonH.az);
      const radius = 10 + (zoom - 1) * 3;
      ctx.save();
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#e8ecff';
      ctx.fillRect(mp.x - radius, mp.y - radius, radius * 2, radius * 2);
      const shift = 2 * radius * phase.illumination;
      ctx.fillStyle = '#0a0a16';
      ctx.beginPath();
      ctx.arc(mp.x + (phase.waxing ? -shift : shift), mp.y, radius * 1.01, 0, Math.PI * 2);
      ctx.fill();
      // little craters on the lit side
      ctx.fillStyle = 'rgba(80,90,120,0.18)';
      ctx.beginPath();
      ctx.arc(mp.x + radius * 0.25, mp.y - radius * 0.25, radius * 0.16, 0, Math.PI * 2);
      ctx.arc(mp.x + radius * 0.4, mp.y + radius * 0.3, radius * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = 'rgba(220,230,255,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      if (showLabels) {
        ctx.fillStyle = day ? '#0b1730' : 'rgba(220,230,255,0.65)';
        ctx.font = '500 10px "Manrope Variable", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Луна', mp.x + radius + 5, mp.y + 3);
      }
    }

    // ----- horizon ring + cardinal directions -----
    ctx.strokeStyle = day ? 'rgba(10,30,60,0.3)' : 'rgba(139,107,255,0.42)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '600 10px "JetBrains Mono Variable", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cardinals: [string, number][] = [
      ['С', 0],
      ['В', 90],
      ['Ю', 180],
      ['З', 270],
    ];
    for (let az = 0; az < 360; az += 15) {
      const angle = (az - camAz) * (Math.PI / 180);
      const inner = horizonRadius - (az % 45 === 0 ? 7 : 3);
      const x1 = centerX + inner * Math.sin(angle);
      const y1 = centerY - inner * Math.cos(angle);
      const x2 = centerX + horizonRadius * Math.sin(angle);
      const y2 = centerY - horizonRadius * Math.cos(angle);
      ctx.globalAlpha = az % 45 === 0 ? 0.5 : 0.22;
      ctx.strokeStyle = day ? 'rgba(10,30,60,0.5)' : '#bcc6ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    for (const [label, az] of cardinals) {
      const angle = (az - camAz) * (Math.PI / 180);
      const rr = horizonRadius - 20;
      const x = centerX + rr * Math.sin(angle);
      const y = centerY - rr * Math.cos(angle);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = day ? '#0b1730' : label === 'С' ? '#c4f56a' : '#dfe4ff';
      ctx.font = label === 'С' ? '700 12px "JetBrains Mono Variable", monospace' : '600 10px "JetBrains Mono Variable", monospace';
      ctx.fillText(label, x, y);
    }
    ctx.globalAlpha = 1;

    // zenith
    ctx.strokeStyle = day ? 'rgba(10,30,60,0.3)' : 'rgba(200,210,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY);
    ctx.lineTo(centerX + 5, centerY);
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX, centerY + 5);
    ctx.stroke();

    updateHud();
  };

  const loop = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (now - lastFrame < 30) return;
    const dt = Math.min(120, now - lastFrame);
    lastFrame = now;
    if (playing) timestamp += dt * speed;
    draw(now);
    void hudTick;
  };

  const nearestStar = (x: number, y: number): Star | null => {
    let best: Star | null = null;
    let bestDist = 16;
    for (const item of projected) {
      const dx = item.x - x;
      const dy = item.y - y;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        best = item.star;
      }
    }
    return best;
  };

  const showInfo = (star: Star) => {
    selected = star;
    const h = horizontal(star.ra, star.dec, place.latitude, localSiderealTime(timestamp, place.longitude));
    info.hidden = false;
    info.innerHTML = `
      <button class="sky-info__close" type="button" aria-label="Закрыть">${icon('close')}</button>
      <span class="eyebrow">звезда</span>
      <h3>${star.name}</h3>
      <p>${star.desig ?? '—'} · ${CONSTELLATION_NAMES.get(star.con) ?? star.con}</p>
      <dl>
        <div><dt>высота</dt><dd>${h.alt.toFixed(1)}°</dd></div>
        <div><dt>азимут</dt><dd>${h.az.toFixed(0)}°</dd></div>
        <div><dt>зв. величина</dt><dd>${star.mag.toFixed(2)}</dd></div>
        <div><dt>цвет</dt><dd><i class="sky-color" style="background:${starColor(star.bv)}"></i>${star.bv.toFixed(2)}</dd></div>
      </dl>
    `;
    info.querySelector('.sky-info__close')?.addEventListener('click', () => {
      selected = null;
      info.hidden = true;
    });
  };

  let dragging = false;
  let moved = 0;
  let startX = 0;
  let startAz = 0;

  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    moved = 0;
    startX = event.clientX;
    startAz = camAz;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
    $('#sky-hint', root)?.classList.add('is-hidden');
  });

  canvas.addEventListener('pointermove', (event) => {
    if (dragging) {
      const dx = event.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      camAz = (((startAz - dx * (0.32 / zoom)) % 360) + 360) % 360;
      tooltip.hidden = true;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const star = nearestStar(event.clientX - rect.left, event.clientY - rect.top);
    if (star !== hovered) {
      hovered = star;
      canvas.style.cursor = star ? 'pointer' : 'grab';
    }
    if (star) {
      const rect2 = canvas.getBoundingClientRect();
      tooltip.hidden = false;
      tooltip.innerHTML = `<b>${star.name}</b><span>${star.desig ?? ''} · m ${star.mag.toFixed(1)}</span>`;
      tooltip.style.left = `${clamp(event.clientX - rect2.left, 70, width - 70)}px`;
      tooltip.style.top = `${clamp(event.clientY - rect2.top - 14, 40, height - 20)}px`;
    } else {
      tooltip.hidden = true;
    }
  });

  const endDrag = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('is-dragging');
    const rect = canvas.getBoundingClientRect();
    if (moved < 5) {
      const star = nearestStar(event.clientX - rect.left, event.clientY - rect.top);
      if (star) showInfo(star);
      else {
        selected = null;
        info.hidden = true;
      }
    }
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => {
    dragging = false;
    canvas.classList.remove('is-dragging');
  });
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    tooltip.hidden = true;
  });

  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      zoom = clamp(zoom * Math.exp(-event.deltaY * 0.0012), 0.6, 2.6);
    },
    { passive: false },
  );

  canvas.addEventListener('dblclick', () => {
    zoom = 1;
    camAz = place.latitude >= 0 ? 180 : 0;
  });

  const toggleButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-toggle]'));
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.toggle;
      const on = !button.classList.contains('is-on');
      button.classList.toggle('is-on', on);
      button.setAttribute('aria-pressed', String(on));
      if (key === 'lines') showLines = on;
      if (key === 'labels') showLabels = on;
      if (key === 'milky') showMilky = on;
    });
  });

  const search = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      results.hidden = true;
      return;
    }
    results.hidden = false;
    results.innerHTML = `<div class="wx-results__loading">${icon('refresh')} ищем города…</div>`;
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=ru&format=json`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error('http');
      const json = (await response.json()) as { results?: SkyPlace[] };
      renderResults(json.results ?? []);
    } catch {
      const q = query.trim().toLowerCase();
      renderResults(
        FALLBACK.filter((c) => c.name.toLowerCase().includes(q) || (c.country ?? '').toLowerCase().includes(q)).slice(0, 6),
      );
    }
  }, 320);

  const renderResults = (items: SkyPlace[]) => {
    if (!items.length) {
      results.innerHTML = `<div class="wx-results__empty">Ничего не найдено</div>`;
      return;
    }
    results.innerHTML = items
      .map(
        (p, i) => `
        <button class="wx-result" type="button" data-city="${i}">
          <span class="wx-result__flag"><span class="wx-flag mono">${(p.country_code || '--').toUpperCase()}</span></span>
          <span class="wx-result__text"><b>${p.name}</b><small>${[p.admin1, p.country].filter(Boolean).join(', ')}</small></span>
          <span class="wx-result__coords mono">${p.latitude.toFixed(1)}, ${p.longitude.toFixed(1)}</span>
        </button>`,
      )
      .join('');
    results.querySelectorAll<HTMLButtonElement>('[data-city]').forEach((button) => {
      button.addEventListener('click', () => {
        const p = items[Number(button.dataset.city)];
        results.hidden = true;
        applyPlace(p);
      });
    });
  };

  cityInput.addEventListener('input', () => void search(cityInput.value));
  cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') results.hidden = true;
    if (event.key === 'Enter') {
      $<HTMLButtonElement>('[data-city]', results)?.click();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!root.querySelector('.sky-search')?.contains(event.target as Node)) results.hidden = true;
  });

  datetime.addEventListener('change', () => {
    const parsed = fromZonedInput(datetime.value, place.timezone);
    if (Number.isFinite(parsed)) timestamp = parsed;
  });

  $('#sky-now', root)?.addEventListener('click', () => {
    timestamp = Date.now();
    updateHud(true);
  });

  playButton.addEventListener('click', () => {
    playing = !playing;
    playButton.classList.toggle('is-playing', playing);
    playButton.innerHTML = playing ? `${icon('pause')} <span>Пауза</span>` : `${icon('play')} <span>Пуск</span>`;
  });

  $('#sky-speed', root)?.addEventListener('change', (event) => {
    speed = Number((event.target as HTMLSelectElement).value);
  });

  $('#sky-reset', root)?.addEventListener('click', () => {
    zoom = 1;
    camAz = place.latitude >= 0 ? 180 : 0;
  });

  const observer = new ResizeObserver(() => resize());
  observer.observe(stage);
  resize();
  applyPlace(place, true);
  updateHud(true);
  datetime.value = toZonedInput(timestamp, place.timezone);
  raf = requestAnimationFrame(loop);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
  };
}


