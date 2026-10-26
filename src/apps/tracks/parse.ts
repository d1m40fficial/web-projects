export interface TrackPoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: number;
}

export interface Track {
  name: string;
  source: 'gpx' | 'geojson' | 'csv' | 'demo';
  points: TrackPoint[];
  hasTime: boolean;
  hasEle: boolean;
}

export interface TrackAnalysis {
  distance: number; // metres
  duration: number; // seconds
  avgSpeed: number; // km/h
  maxSpeed: number;
  gain: number;
  loss: number;
  minEle: number;
  maxEle: number;
  cumulative: number[];
  segmentSpeeds: number[];
  pointTimes: number[];
}

const R = 6371000;

export function haversine(a: TrackPoint, b: TrackPoint): number {
  const toRad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRad;
  const dLon = (b.lon - a.lon) * toRad;
  const lat1 = a.lat * toRad;
  const lat2 = b.lat * toRad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function parseTime(raw: string | null | undefined): number | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric) && /^\d+(\.\d+)?$/.test(trimmed)) {
    return numeric < 1e12 ? numeric * 1000 : numeric;
  }
  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function clean(points: TrackPoint[]): TrackPoint[] {
  return points
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180)
    .map((p) => ({
      lat: p.lat,
      lon: p.lon,
      ...(Number.isFinite(p.ele) ? { ele: p.ele } : {}),
      ...(Number.isFinite(p.time) ? { time: p.time } : {}),
    }));
}

export function analyze(track: Track): TrackAnalysis {
  const pts = track.points;
  const cumulative: number[] = [0];
  const segmentSpeeds: number[] = [];
  let gain = 0;
  let loss = 0;

  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const d = haversine(a, b);
    cumulative.push(cumulative[i - 1] + d);

    if (a.ele !== undefined && b.ele !== undefined) {
      const delta = b.ele - a.ele;
      if (delta > 0) gain += delta;
      else loss += -delta;
    }

    if (a.time !== undefined && b.time !== undefined) {
      const dt = (b.time - a.time) / 1000;
      if (dt > 0.2 && dt < 3600) {
        const speed = (d / dt) * 3.6;
        if (speed < 180) segmentSpeeds.push(speed);
        else segmentSpeeds.push(0);
      } else {
        segmentSpeeds.push(segmentSpeeds[segmentSpeeds.length - 1] ?? 0);
      }
    } else {
      segmentSpeeds.push(0);
    }
  }

  const duration = track.hasTime && pts.length > 1 ? Math.max(0, ((pts[pts.length - 1].time ?? 0) - (pts[0].time ?? 0)) / 1000) : 0;
  const distance = cumulative[cumulative.length - 1] ?? 0;
  const avgSpeed = duration > 0 ? (distance / duration) * 3.6 : 0;

  // smoothed max to avoid GPS spikes
  let maxSpeed = 0;
  const window = 5;
  for (let i = 0; i < segmentSpeeds.length; i++) {
    const slice = segmentSpeeds.slice(Math.max(0, i - window), i + window + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    if (avg > maxSpeed) maxSpeed = avg;
  }

  const elevations = pts.map((p) => p.ele).filter((v): v is number => v !== undefined);
  const pointTimes = pts.map((p) => p.time ?? 0);

  return {
    distance,
    duration,
    avgSpeed,
    maxSpeed,
    gain,
    loss,
    minEle: elevations.length ? Math.min(...elevations) : 0,
    maxEle: elevations.length ? Math.max(...elevations) : 0,
    cumulative,
    segmentSpeeds,
    pointTimes,
  };
}

export function parseGpx(name: string, text: string): Track {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('GPX не читается: проверьте XML');
  const nodes = Array.from(doc.getElementsByTagName('trkpt'));
  const fallback = Array.from(doc.getElementsByTagName('rtept'));
  const list = nodes.length ? nodes : fallback;
  if (!list.length) throw new Error('В GPX не найдено точек трека');

  const points: TrackPoint[] = list.map((node) => {
    const ele = node.querySelector('ele')?.textContent ?? undefined;
    const time = node.querySelector('time')?.textContent ?? undefined;
    return {
      lat: Number(node.getAttribute('lat')),
      lon: Number(node.getAttribute('lon')),
      ...(ele !== undefined ? { ele: Number(ele) } : {}),
      ...(time !== undefined ? { time: parseTime(time) } : {}),
    };
  });

  return finalize(name, 'gpx', points);
}

export function parseGeoJson(name: string, text: string): Track {
  const json = JSON.parse(text) as { type?: string; geometry?: { type?: string; coordinates?: unknown }; features?: { geometry?: { type?: string; coordinates?: unknown } }[]; coordinates?: unknown };
  const geometries = json.features?.map((f) => f.geometry) ?? (json.type === 'Feature' ? [json.geometry] : [json]);
  const points: TrackPoint[] = [];

  const addLine = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    for (const item of coords) {
      if (!Array.isArray(item)) continue;
      if (typeof item[0] === 'number' && typeof item[1] === 'number') {
        points.push({
          lon: item[0],
          lat: item[1],
          ...(typeof item[2] === 'number' ? { ele: item[2] } : {}),
        });
      } else {
        addLine(item);
      }
    }
  };

  for (const geometry of geometries) {
    addLine(geometry?.coordinates);
  }

  if (!points.length) throw new Error('В GeoJSON не найдено LineString-координат');
  return finalize(name, 'geojson', points);
}

export function parseCsv(name: string, text: string): Track {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error('В CSV слишком мало строк');
  const delimiter = [',', ';', '\t'].sort((a, b) => lines[0].split(b).length - lines[0].split(a).length)[0];
  const rows = lines.map((line) => line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, '')));
  const header = rows[0].map((h) => h.toLowerCase());
  const find = (...names: string[]) => header.findIndex((h) => names.some((n) => h === n || h.includes(n)));

  let latIdx = find('lat');
  let lonIdx = find('lon', 'lng');
  let eleIdx = find('ele', 'alt', 'height');
  let timeIdx = find('time', 'date', 'timestamp');
  let start = 1;

  if (latIdx === -1 || lonIdx === -1) {
    // positional fallback: lat, lon, ele, time
    latIdx = 0;
    lonIdx = 1;
    eleIdx = 2;
    timeIdx = 3;
    start = /^[-+]?\d/.test(rows[0][0] ?? '') ? 0 : 1;
  }

  const points: TrackPoint[] = [];
  for (let i = start; i < rows.length; i++) {
    const row = rows[i];
    const lat = Number(row[latIdx]);
    const lon = Number(row[lonIdx]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const ele = eleIdx >= 0 ? Number(row[eleIdx]) : NaN;
    const time = timeIdx >= 0 ? parseTime(row[timeIdx]) : undefined;
    points.push({
      lat,
      lon,
      ...(Number.isFinite(ele) ? { ele } : {}),
      ...(time !== undefined ? { time } : {}),
    });
  }

  return finalize(name, 'csv', points);
}

function finalize(name: string, source: Track['source'], raw: TrackPoint[]): Track {
  const points = clean(raw);
  if (points.length < 2) throw new Error('Нужно минимум две корректные точки');
  const withTime = points.filter((p) => p.time !== undefined).length;
  const withEle = points.filter((p) => p.ele !== undefined).length;
  return {
    name,
    source,
    points,
    hasTime: withTime >= Math.max(2, points.length * 0.9),
    hasEle: withEle >= Math.max(2, points.length * 0.9),
  };
}

export function demoTrack(): Track {
  const points: TrackPoint[] = [];
  const centerLat = 45.9237;
  const centerLon = 6.8694;
  const now = Date.now() - 3 * 3600 * 1000;
  const count = 460;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const radiusLat = 0.022 + 0.008 * Math.sin(3 * t + 0.6);
    const radiusLon = 0.03 + 0.01 * Math.cos(2 * t);
    const lat = centerLat + radiusLat * Math.sin(t) + 0.002 * Math.sin(9 * t);
    const lon = centerLon + (radiusLon * Math.cos(t)) / Math.cos((centerLat * Math.PI) / 180);
    const ele = 1180 + 260 * Math.sin(2 * t + 1.2) + 70 * Math.sin(7 * t) + 25 * Math.sin(19 * t);
    points.push({
      lat,
      lon,
      ele: Math.round(ele * 10) / 10,
      time: now + i * 14000,
    });
  }

  return {
    name: 'Демо-трек · Шамони',
    source: 'demo',
    points,
    hasTime: true,
    hasEle: true,
  };
}
