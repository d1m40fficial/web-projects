import { $, clamp, formatDuration, plural } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';
import { analyze, demoTrack, parseCsv, parseGeoJson, parseGpx, type Track, type TrackAnalysis } from './parse';

interface Projection {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  scale: number;
  midLat: number;
  ox: number;
  oy: number;
  w: number;
  h: number;
}

const COLORS: [number, number, number][] = [
  [56, 224, 242],
  [196, 245, 106],
  [255, 203, 92],
  [255, 106, 168],
];

const colorAt = (t: number, alpha = 1): string => {
  const x = clamp(t, 0, 1) * (COLORS.length - 1);
  const i = Math.min(COLORS.length - 2, Math.floor(x));
  const f = x - i;
  const a = COLORS[i];
  const b = COLORS[i + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgba(${r},${g},${bl},${alpha})`;
};

const percentile = (values: number[], p: number): number => {
  const sorted = [...values].filter((v) => v > 0).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const index = clamp(Math.round((sorted.length - 1) * p), 0, sorted.length - 1);
  return sorted[index];
};

export function mount(root: HTMLElement): () => void {
  root.innerHTML = `
    <div class="trk">
      <div class="trk-drop" id="trk-drop">
        <input type="file" id="trk-file" accept=".gpx,.geojson,.json,.csv,.txt" hidden />
        <span class="trk-drop__icon">${icon('route')}</span>
        <div class="trk-drop__text">
          <b>Перетащите трек сюда</b>
          <span>GPX, GeoJSON или CSV · вычисление дистанции, профиля и скорости</span>
        </div>
        <div class="trk-drop__actions">
          <button class="btn btn--sm btn--primary" type="button" id="trk-pick">${icon('plus')} Выбрать файл</button>
          <button class="btn btn--sm btn--ghost" type="button" id="trk-demo">${icon('sparkles')} Демо-трек</button>
        </div>
      </div>
      <p class="trk-error" id="trk-error" hidden></p>

      <div class="trk-stats" id="trk-stats">
        ${[
          ['distance', 'дистанция', '0.0', 'км', 'route'],
          ['duration', 'время', '—', '', 'clock'],
          ['avg', 'средняя', '—', 'км/ч', 'chart'],
          ['max', 'максимум', '—', 'км/ч', 'sparkles'],
          ['gain', 'набор', '—', 'м', 'arrowUpRight'],
          ['loss', 'сброс', '—', 'м', 'arrow'],
        ]
          .map(
            ([id, label, value, unit, ic]) => `
            <div class="trk-stat">
              <span class="trk-stat__icon">${icon(ic)}</span>
              <div><span>${label}</span><b id="trk-${id}">${value}</b><small>${unit}</small></div>
            </div>`,
          )
          .join('')}
      </div>

      <div class="trk-panel trk-map-panel">
        <div class="trk-panel__head">
          <span class="trk-panel__title">${icon('map')} <b id="trk-name">карта маршрута</b></span>
          <span class="trk-panel__meta" id="trk-meta">—</span>
        </div>
        <div class="trk-map" id="trk-map">
          <canvas id="trk-map-canvas"></canvas>
          <div class="trk-map__grid" aria-hidden="true"></div>
          <div class="trk-map__empty" id="trk-empty">
            <span>${icon('route')}</span>
            <b>Здесь появится маршрут</b>
            <small>загрузите файл или нажмите «Демо-трек»</small>
          </div>
          <div class="trk-tip trk-tip--map" id="trk-map-tip" hidden></div>
          <div class="trk-map__scale" id="trk-scale"></div>
          <div class="trk-map__north" aria-hidden="true"><span>С</span><i></i></div>
        </div>
        <div class="trk-controls">
          <button class="trk-play" type="button" id="trk-play" disabled aria-label="Воспроизвести">${icon('play')}</button>
          <input class="range trk-scrub" id="trk-scrub" type="range" min="0" max="1000" value="0" disabled aria-label="Позиция трека" />
          <span class="trk-time mono" id="trk-time">0:00 / 0:00</span>
          <div class="segmented trk-speed" role="group" aria-label="Скорость воспроизведения">
            <button type="button" data-speed="1" class="is-active">×1</button>
            <button type="button" data-speed="2">×2</button>
            <button type="button" data-speed="4">×4</button>
          </div>
          <button class="btn btn--sm btn--icon" type="button" id="trk-reset" disabled aria-label="Сбросить">${icon('undo')}</button>
        </div>
      </div>

      <div class="trk-panel trk-elev-panel">
        <div class="trk-panel__head">
          <span class="trk-panel__title">${icon('mountain')} профиль высоты</span>
          <div class="trk-legend">
            <span><i class="trk-legend__ele"></i> высота</span>
            <span><i class="trk-legend__speed"></i> скорость</span>
          </div>
        </div>
        <div class="trk-elev" id="trk-elev">
          <canvas id="trk-elev-canvas"></canvas>
          <div class="trk-tip trk-tip--elev" id="trk-elev-tip" hidden></div>
        </div>
      </div>
    </div>
  `;

  const mapHost = $('#trk-map', root)!;
  const mapCanvas = $<HTMLCanvasElement>('#trk-map-canvas', root)!;
  const elevHost = $('#trk-elev', root)!;
  const elevCanvas = $<HTMLCanvasElement>('#trk-elev-canvas', root)!;
  const mapTip = $('#trk-map-tip', root)!;
  const elevTip = $('#trk-elev-tip', root)!;
  const mapEmpty = $('#trk-empty', root)!;
  const playButton = $<HTMLButtonElement>('#trk-play', root)!;
  const scrub = $<HTMLInputElement>('#trk-scrub', root)!;
  const timeNode = $('#trk-time', root)!;
  const resetButton = $<HTMLButtonElement>('#trk-reset', root)!;
  const fileInput = $<HTMLInputElement>('#trk-file', root)!;
  const errorNode = $('#trk-error', root)!;

  let track: Track | null = null;
  let analysis: TrackAnalysis | null = null;
  let progress = 0;
  let playing = false;
  let speed = 1;
  let raf = 0;
  let last = performance.now();
  let dirty = true;
  let mapW = 0;
  let mapH = 0;
  let elevW = 0;
  let elevH = 0;
  let projection: Projection | null = null;
  let screenPoints: { x: number; y: number }[] = [];
  let hoverMap: number | null = null;
  let hoverElev: number | null = null;
  let mapTipNode = mapTip;
  let elevTipNode = elevTip;

  const mapCtx = mapCanvas.getContext('2d')!;
  const elevCtx = elevCanvas.getContext('2d')!;

  const setError = (message: string | null) => {
    errorNode.hidden = !message;
    errorNode.innerHTML = message ? `${icon('warning')} ${message}` : '';
  };

  const sizeCanvas = (canvas: HTMLCanvasElement, host: HTMLElement) => {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: rect.height };
  };

  const buildProjection = (w: number, h: number): Projection | null => {
    if (!track || track.points.length < 2) return null;
    const lats = track.points.map((p) => p.lat);
    const lons = track.points.map((p) => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const midLat = (minLat + maxLat) / 2;
    const lonSpan = Math.max(1e-6, (maxLon - minLon) * Math.cos((midLat * Math.PI) / 180));
    const latSpan = Math.max(1e-6, maxLat - minLat);
    const padX = Math.min(72, w * 0.1);
    const padY = Math.min(60, h * 0.12);
    const scale = Math.min((w - padX * 2) / lonSpan, (h - padY * 2) / latSpan);
    const ox = (w - lonSpan * scale) / 2;
    const oy = (h - latSpan * scale) / 2;
    return { minLat, maxLat, minLon, maxLon, scale, midLat, ox, oy, w, h };
  };

  const project = (proj: Projection, lat: number, lon: number): { x: number; y: number } => ({
    x: proj.ox + (lon - proj.minLon) * Math.cos((proj.midLat * Math.PI) / 180) * proj.scale,
    y: proj.oy + (proj.maxLat - lat) * proj.scale,
  });

  const niceDistance = (metresPerPx: number): number => {
    const target = metresPerPx * 90;
    const options = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    return options.reduce((best, option) => (Math.abs(option - target) < Math.abs(best - target) ? option : best), options[0]);
  };

  const drawMap = () => {
    const w = mapW;
    const h = mapH;
    if (!w || !h) return;
    mapCtx.clearRect(0, 0, w, h);
    const bg = mapCtx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    bg.addColorStop(0, '#0b0b18');
    bg.addColorStop(1, '#05050b');
    mapCtx.fillStyle = bg;
    mapCtx.fillRect(0, 0, w, h);

    // grid
    mapCtx.strokeStyle = 'rgba(160, 180, 255, 0.05)';
    mapCtx.lineWidth = 1;
    const step = 46;
    mapCtx.beginPath();
    for (let x = 0; x <= w; x += step) {
      mapCtx.moveTo(x, 0);
      mapCtx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += step) {
      mapCtx.moveTo(0, y);
      mapCtx.lineTo(w, y);
    }
    mapCtx.stroke();

    if (!track || !analysis) {
      projection = null;
      screenPoints = [];
      return;
    }

    projection = buildProjection(w, h);
    if (!projection) return;
    const proj = projection;
    screenPoints = track.points.map((p) => project(proj, p.lat, p.lon));

    const speeds = analysis.segmentSpeeds;
    const p10 = percentile(speeds, 0.1);
    const p90 = percentile(speeds, 0.9);
    const hasSpeed = track.hasTime && p90 > 0;
    const elevations = track.points.map((p) => p.ele ?? 0);
    const eMin = Math.min(...elevations);
    const eMax = Math.max(...elevations);

    // route glow
    mapCtx.beginPath();
    screenPoints.forEach((p, i) => (i ? mapCtx.lineTo(p.x, p.y) : mapCtx.moveTo(p.x, p.y)));
    mapCtx.strokeStyle = 'rgba(56, 224, 242, 0.14)';
    mapCtx.lineWidth = 12;
    mapCtx.lineJoin = 'round';
    mapCtx.lineCap = 'round';
    mapCtx.stroke();

    // thin base
    mapCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    mapCtx.lineWidth = 4;
    mapCtx.stroke();

    // colored segments
    mapCtx.lineWidth = 2.4;
    mapCtx.lineCap = 'round';
    for (let i = 1; i < screenPoints.length; i++) {
      const a = screenPoints[i - 1];
      const b = screenPoints[i];
      let t = 0;
      if (hasSpeed) {
        t = clamp((speeds[i - 1] - p10) / Math.max(1, p90 - p10), 0, 1);
      } else if (eMax > eMin) {
        t = clamp(((elevations[i] + elevations[i - 1]) / 2 - eMin) / (eMax - eMin), 0, 1);
      }
      mapCtx.strokeStyle = colorAt(t);
      mapCtx.beginPath();
      mapCtx.moveTo(a.x, a.y);
      mapCtx.lineTo(b.x, b.y);
      mapCtx.stroke();
    }

    // start / finish
    const start = screenPoints[0];
    const end = screenPoints[screenPoints.length - 1];
    const marker = (x: number, y: number, color: string, label: string, diamond = false, dy = 3) => {
      mapCtx.save();
      mapCtx.translate(x, y);
      mapCtx.shadowBlur = 14;
      mapCtx.shadowColor = color;
      mapCtx.fillStyle = color;
      mapCtx.beginPath();
      if (diamond) {
        mapCtx.moveTo(0, -7);
        mapCtx.lineTo(7, 0);
        mapCtx.lineTo(0, 7);
        mapCtx.lineTo(-7, 0);
        mapCtx.closePath();
      } else {
        mapCtx.arc(0, 0, 6, 0, Math.PI * 2);
      }
      mapCtx.fill();
      mapCtx.restore();
      mapCtx.font = '600 10px "JetBrains Mono Variable", monospace';
      mapCtx.fillStyle = 'rgba(235, 240, 255, 0.8)';
      mapCtx.textAlign = 'left';
      mapCtx.fillText(label, x + 10, y + dy);
    };
    marker(start.x, start.y, '#c4f56a', 'старт', false, -7);
    marker(end.x, end.y, '#ff6aa8', 'финиш', true, 14);

    // playback marker
    const index = clamp(Math.round(progress * (screenPoints.length - 1)), 0, screenPoints.length - 1);
    const cur = screenPoints[index];
    mapCtx.save();
    mapCtx.shadowBlur = 18;
    mapCtx.shadowColor = '#ffffff';
    mapCtx.fillStyle = '#ffffff';
    mapCtx.beginPath();
    mapCtx.arc(cur.x, cur.y, 4.6, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.restore();
    mapCtx.strokeStyle = 'rgba(255,255,255,.35)';
    mapCtx.lineWidth = 1.2;
    mapCtx.beginPath();
    mapCtx.arc(cur.x, cur.y, 10 + Math.sin(performance.now() / 400) * 1.5, 0, Math.PI * 2);
    mapCtx.stroke();

    if (hoverMap !== null) {
      const p = screenPoints[hoverMap];
      mapCtx.strokeStyle = 'rgba(255,255,255,.65)';
      mapCtx.lineWidth = 1;
      mapCtx.beginPath();
      mapCtx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      mapCtx.stroke();
      mapCtx.beginPath();
      mapCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      mapCtx.fillStyle = '#fff';
      mapCtx.fill();
    }

    // scale bar
    const metresPerPx = 111320 / proj.scale;
    const metres = niceDistance(metresPerPx);
    const barPx = metres / metresPerPx;
    const scaleNode = $('#trk-scale', root);
    if (scaleNode) scaleNode.innerHTML = `<i style="width:${barPx.toFixed(0)}px"></i><span>${metres >= 1000 ? `${metres / 1000} км` : `${metres} м`}</span>`;
  };

  const drawElevation = () => {
    const w = elevW;
    const h = elevH;
    if (!w || !h) return;
    elevCtx.clearRect(0, 0, w, h);
    elevCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    elevCtx.fillRect(0, 0, w, h);

    const m = { l: 44, r: 16, t: 16, b: 24 };
    const pw = w - m.l - m.r;
    const ph = h - m.t - m.b;

    if (!track || !analysis || !track.points.length) {
      elevCtx.fillStyle = 'rgba(160, 168, 200, 0.35)';
      elevCtx.font = '11px "JetBrains Mono Variable", monospace';
      elevCtx.textAlign = 'center';
      elevCtx.fillText('профиль появится после загрузки трека', w / 2, h / 2);
      return;
    }

    const cumulative = analysis.cumulative;
    const total = Math.max(1, analysis.distance);
    const elevs = track.points.map((p) => p.ele ?? 0);
    const hasEle = track.hasEle;
    const minE = hasEle ? Math.min(...elevs) - 8 : 0;
    const maxE = hasEle ? Math.max(...elevs) + 8 : 1;
    const speeds = analysis.segmentSpeeds;
    const maxS = Math.max(5, percentile(speeds, 0.95) * 1.15);

    const xAt = (i: number) => m.l + (cumulative[i] / total) * pw;
    const yAt = (ele: number) => m.t + (1 - (ele - minE) / (maxE - minE)) * ph;

    // horizontal grid + labels
    elevCtx.font = '9px "JetBrains Mono Variable", monospace';
    elevCtx.textAlign = 'right';
    elevCtx.textBaseline = 'middle';
    for (let i = 0; i <= 3; i++) {
      const y = m.t + (i / 3) * ph;
      elevCtx.strokeStyle = 'rgba(255,255,255,.06)';
      elevCtx.beginPath();
      elevCtx.moveTo(m.l, y);
      elevCtx.lineTo(w - m.r, y);
      elevCtx.stroke();
      if (hasEle) {
        const value = maxE - (i / 3) * (maxE - minE);
        elevCtx.fillStyle = 'rgba(160,168,200,.45)';
        elevCtx.fillText(`${Math.round(value)}`, m.l - 6, y);
      }
    }

    // x labels
    elevCtx.textAlign = 'center';
    elevCtx.textBaseline = 'top';
    elevCtx.fillStyle = 'rgba(160,168,200,.4)';
    for (let i = 0; i <= 4; i++) {
      const x = m.l + (i / 4) * pw;
      const km = (total / 1000) * (i / 4);
      elevCtx.textAlign = i === 4 ? 'right' : 'center';
      elevCtx.fillText(`${km.toFixed(km < 10 ? 1 : 0)}${i === 4 ? ' км' : ''}`, x, h - m.b + 7);
    }
    elevCtx.textAlign = 'right';
    elevCtx.textBaseline = 'alphabetic';
    elevCtx.fillStyle = 'rgba(160,168,200,.35)';
    elevCtx.fillText('м', m.l - 6, m.t - 4);

    if (hasEle) {
      // elevation area
      const area = elevCtx.createLinearGradient(0, m.t, 0, m.t + ph);
      area.addColorStop(0, 'rgba(110, 231, 168, 0.32)');
      area.addColorStop(1, 'rgba(110, 231, 168, 0)');
      elevCtx.beginPath();
      elevCtx.moveTo(xAt(0), yAt(elevs[0]));
      for (let i = 1; i < track.points.length; i++) elevCtx.lineTo(xAt(i), yAt(elevs[i]));
      elevCtx.lineTo(xAt(track.points.length - 1), m.t + ph);
      elevCtx.lineTo(xAt(0), m.t + ph);
      elevCtx.closePath();
      elevCtx.fillStyle = area;
      elevCtx.fill();

      elevCtx.beginPath();
      for (let i = 0; i < track.points.length; i++) {
        const x = xAt(i);
        const y = yAt(elevs[i]);
        if (i === 0) elevCtx.moveTo(x, y);
        else elevCtx.lineTo(x, y);
      }
      elevCtx.strokeStyle = '#6ee7a8';
      elevCtx.lineWidth = 1.7;
      elevCtx.stroke();
    }

    // speed line
    if (track.hasTime && speeds.length) {
      elevCtx.beginPath();
      let started = false;
      for (let i = 0; i < speeds.length; i++) {
        if (!speeds[i]) continue;
        const x = xAt(i + 1);
        const y = m.t + (1 - clamp(speeds[i] / maxS, 0, 1)) * ph;
        if (!started) {
          elevCtx.moveTo(x, y);
          started = true;
        } else elevCtx.lineTo(x, y);
      }
      elevCtx.strokeStyle = 'rgba(255, 203, 92, 0.75)';
      elevCtx.lineWidth = 1.2;
      elevCtx.setLineDash([3, 3]);
      elevCtx.stroke();
      elevCtx.setLineDash([]);
    }

    const index = clamp(Math.round(progress * (track.points.length - 1)), 0, track.points.length - 1);
    const px = xAt(index);

    // hover
    if (hoverElev !== null) {
      const hx = xAt(hoverElev);
      elevCtx.strokeStyle = 'rgba(255,255,255,.25)';
      elevCtx.beginPath();
      elevCtx.moveTo(hx, m.t);
      elevCtx.lineTo(hx, m.t + ph);
      elevCtx.stroke();
    }

    // progress
    elevCtx.strokeStyle = 'rgba(255,255,255,.7)';
    elevCtx.lineWidth = 1;
    elevCtx.beginPath();
    elevCtx.moveTo(px, m.t - 2);
    elevCtx.lineTo(px, m.t + ph);
    elevCtx.stroke();
    if (hasEle) {
      elevCtx.fillStyle = '#ffffff';
      elevCtx.beginPath();
      elevCtx.arc(px, yAt(elevs[index]), 3.2, 0, Math.PI * 2);
      elevCtx.fill();
    }
  };

  const updateStats = () => {
    if (!track || !analysis) {
      $('#trk-name', root)!.textContent = 'карта маршрута';
      $('#trk-meta', root)!.textContent = '—';
      ['distance', 'duration', 'avg', 'max', 'gain', 'loss'].forEach((key) => {
        const node = $(`#trk-${key}`, root);
        if (node) node.textContent = key === 'distance' ? '0.0' : '—';
      });
      return;
    }
    $('#trk-name', root)!.textContent = track.name;
    $('#trk-meta', root)!.textContent = `${track.points.length} ${plural(track.points.length, 'точка', 'точки', 'точек')} · ${track.source.toUpperCase()}`;
    $('#trk-distance', root)!.textContent = (analysis.distance / 1000).toFixed(1);
    $('#trk-duration', root)!.textContent = track.hasTime ? formatDuration(analysis.duration) : '—';
    $('#trk-avg', root)!.textContent = track.hasTime ? analysis.avgSpeed.toFixed(1) : '—';
    $('#trk-max', root)!.textContent = track.hasTime ? analysis.maxSpeed.toFixed(1) : '—';
    $('#trk-gain', root)!.textContent = track.hasEle ? `+${Math.round(analysis.gain)}` : '—';
    $('#trk-loss', root)!.textContent = track.hasEle ? `−${Math.round(analysis.loss)}` : '—';
  };

  const updateControls = () => {
    scrub.value = String(Math.round(progress * 1000));
    scrub.style.setProperty('--fill', `${progress * 100}%`);
    if (track && analysis) {
      const current = analysis.duration * progress;
      timeNode.textContent = track.hasTime ? `${formatDuration(current)} / ${formatDuration(analysis.duration)}` : `${Math.round(progress * 100)}%`;
    } else {
      timeNode.textContent = '0:00 / 0:00';
    }
    playButton.innerHTML = playing ? icon('pause') : icon('play');
    playButton.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
  };

  const setTrack = (next: Track, silent = false) => {
    track = next;
    analysis = analyze(next);
    progress = 0;
    playing = false;
    hoverMap = null;
    hoverElev = null;
    mapTip.hidden = true;
    elevTip.hidden = true;
    mapEmpty.hidden = true;
    playButton.disabled = false;
    scrub.disabled = false;
    resetButton.disabled = false;
    setError(null);
    updateStats();
    updateControls();
    dirty = true;
    if (!silent) {
      toast(`Трек загружен: ${next.name}`, 'success');
    }
  };

  const handleFile = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      setError('Файл больше 15 МБ — уменьшите трек.');
      return;
    }
    try {
      const text = await file.text();
      const lower = file.name.toLowerCase();
      let parsed: Track;
      if (lower.endsWith('.gpx') || text.trimStart().startsWith('<?xml') || text.includes('<gpx')) {
        parsed = parseGpx(file.name.replace(/\.[^.]+$/, ''), text);
      } else if (lower.endsWith('.geojson') || lower.endsWith('.json') || text.trimStart().startsWith('{')) {
        parsed = parseGeoJson(file.name.replace(/\.[^.]+$/, ''), text);
      } else {
        parsed = parseCsv(file.name.replace(/\.[^.]+$/, ''), text);
      }
      setTrack(parsed);
    } catch (error) {
      const message = (error as Error).message || 'Не удалось прочитать трек';
      setError(message);
      toast(message, 'error');
    } finally {
      fileInput.value = '';
    }
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) void handleFile(file);
  });

  $('#trk-pick', root)?.addEventListener('click', () => fileInput.click());
  $('#trk-demo', root)?.addEventListener('click', () => setTrack(demoTrack()));

  const drop = $('#trk-drop', root)!;
  ['dragenter', 'dragover'].forEach((type) => {
    drop.addEventListener(type, (event) => {
      event.preventDefault();
      drop.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach((type) => {
    drop.addEventListener(type, (event) => {
      event.preventDefault();
      drop.classList.remove('is-dragover');
    });
  });
  drop.addEventListener('drop', (event) => {
    const file = (event as DragEvent).dataTransfer?.files?.[0];
    if (file) void handleFile(file);
  });
  drop.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('button')) return;
    fileInput.click();
  });

  playButton.addEventListener('click', () => {
    if (!track) return;
    playing = !playing;
    if (playing && progress >= 1) progress = 0;
    updateControls();
    last = performance.now();
  });

  scrub.addEventListener('input', () => {
    progress = Number(scrub.value) / 1000;
    playing = false;
    updateControls();
    dirty = true;
  });

  resetButton.addEventListener('click', () => {
    progress = 0;
    playing = false;
    updateControls();
    dirty = true;
  });

  root.querySelectorAll<HTMLButtonElement>('[data-speed]').forEach((button) => {
    button.addEventListener('click', () => {
      speed = Number(button.dataset.speed);
      root.querySelectorAll('[data-speed]').forEach((b) => b.classList.toggle('is-active', b === button));
      updateControls();
    });
  });

  const nearestMapPoint = (x: number, y: number): number | null => {
    let best: number | null = null;
    let bestDist = 18;
    for (let i = 0; i < screenPoints.length; i++) {
      const d = Math.hypot(screenPoints[i].x - x, screenPoints[i].y - y);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const showTip = (tip: HTMLElement, index: number, x: number, y: number, hostW: number) => {
    if (!track || !analysis) return;
    const p = track.points[index];
    const km = analysis.cumulative[index] / 1000;
    const speedVal = analysis.segmentSpeeds[index - 1] ?? analysis.segmentSpeeds[index] ?? 0;
    tip.hidden = false;
    tip.innerHTML = `
      <b>${km.toFixed(2)} км</b>
      <span>${p.ele !== undefined ? `${Math.round(p.ele)} м` : 'высота —'}${track.hasTime ? ` · ${speedVal.toFixed(1)} км/ч` : ''}</span>
      <span>${p.time ? new Date(p.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : `точка ${index + 1}`}</span>`;
    tip.style.left = `${clamp(x, 80, hostW - 80)}px`;
    tip.style.top = `${y}px`;
  };

  mapCanvas.addEventListener('pointermove', (event) => {
    if (!track) return;
    const rect = mapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const found = nearestMapPoint(x, y);
    hoverMap = found;
    if (found !== null) {
      showTip(mapTipNode, found, x, y - 12, rect.width);
    } else {
      mapTipNode.hidden = true;
    }
    dirty = true;
  });

  mapCanvas.addEventListener('pointerleave', () => {
    hoverMap = null;
    mapTipNode.hidden = true;
    dirty = true;
  });

  mapCanvas.addEventListener('click', (event) => {
    if (!track || !screenPoints.length) return;
    const rect = mapCanvas.getBoundingClientRect();
    const found = nearestMapPoint(event.clientX - rect.left, event.clientY - rect.top);
    if (found !== null) {
      progress = found / (track.points.length - 1);
      playing = false;
      updateControls();
      dirty = true;
    }
  });

  elevHost.addEventListener('pointermove', (event) => {
    if (!track || !analysis) return;
    const rect = elevHost.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const plotW = rect.width - 44 - 16;
    const ratio = clamp((x - 44) / plotW, 0, 1);
    const index = Math.round(ratio * (track.points.length - 1));
    hoverElev = index;
    const p = track.points[index];
    const km = analysis.cumulative[index] / 1000;
    elevTipNode.hidden = false;
    elevTipNode.innerHTML = `<b>${km.toFixed(2)} км</b><span>${p.ele !== undefined ? `${Math.round(p.ele)} м` : ''}${track.hasTime ? ` · ${(analysis.segmentSpeeds[index - 1] ?? 0).toFixed(1)} км/ч` : ''}</span>`;
    elevTipNode.style.left = `${clamp(x, 70, rect.width - 70)}px`;
    elevTipNode.style.top = `${18}px`;
    dirty = true;
  });

  elevHost.addEventListener('pointerleave', () => {
    hoverElev = null;
    elevTipNode.hidden = true;
    dirty = true;
  });

  elevHost.addEventListener('click', (event) => {
    if (!track) return;
    const rect = elevHost.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left - 44) / (rect.width - 60), 0, 1);
    progress = ratio;
    playing = false;
    updateControls();
    dirty = true;
  });

  const resize = () => {
    const mapSize = sizeCanvas(mapCanvas, mapHost);
    mapW = mapSize.w;
    mapH = mapSize.h;
    const elevSize = sizeCanvas(elevCanvas, elevHost);
    elevW = elevSize.w;
    elevH = elevSize.h;
    dirty = true;
  };

  const observer = new ResizeObserver(resize);
  observer.observe(mapHost);
  observer.observe(elevHost);

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(100, now - last);
    last = now;
    if (playing && track) {
      progress = Math.min(1, progress + dt / (30000 / speed));
      updateControls();
      dirty = true;
      if (progress >= 1) {
        playing = false;
        updateControls();
      }
    }
    if (dirty) {
      drawMap();
      drawElevation();
      dirty = false;
    }
  };

  resize();
  updateStats();
  updateControls();
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
  };
}

