const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export interface Horizontal {
  alt: number;
  az: number;
}

export interface Equatorial {
  ra: number;
  dec: number;
}

export function julianDate(ms: number): number {
  return ms / 86400000 + 2440587.5;
}

/** Greenwich mean sidereal time in hours. */
export function gmstHours(ms: number): number {
  const d = julianDate(ms) - 2451545.0;
  const gmst = 18.697374558 + 24.06570982441908 * d;
  return ((gmst % 24) + 24) % 24;
}

export function localSiderealTime(ms: number, lon: number): number {
  return ((gmstHours(ms) + lon / 15) % 24 + 24) % 24;
}

/** RA in hours → altitude/azimuth in degrees (azimuth measured from north, eastward). */
export function horizontal(raH: number, decDeg: number, latDeg: number, lstH: number): Horizontal {
  const ha = ((lstH - raH) * 15) * DEG;
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const denom = Math.cos(alt) * Math.cos(lat);
  let az: number;
  if (Math.abs(denom) < 1e-8) {
    az = Math.PI;
  } else {
    const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / denom;
    az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (Math.sin(ha) > 0) az = 2 * Math.PI - az;
  }
  return { alt: alt * RAD, az: az * RAD };
}

export function sunPosition(ms: number): Equatorial & { lambda: number; eps: number } {
  const n = julianDate(ms) - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360) + 360) % 360;
  const lambda = (L + 1.915 * Math.sin(g * DEG) + 0.02 * Math.sin(2 * g * DEG)) * DEG;
  const eps = (23.439 - 0.0000004 * n) * DEG;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) * RAD;
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda)) * RAD;
  return { ra: ((ra % 360) + 360) % 360 / 15, dec, lambda: lambda * RAD, eps };
}

export function moonPosition(ms: number): Equatorial & { lambda: number } {
  const n = julianDate(ms) - 2451545.0;
  const L = ((218.316 + 13.176396 * n) % 360 + 360) % 360;
  const M = (((134.963 + 13.064993 * n) % 360) + 360) % 360;
  const F = (((93.272 + 13.22935 * n) % 360) + 360) % 360;
  const lambda = (L + 6.289 * Math.sin(M * DEG)) * DEG;
  const beta = 5.128 * Math.sin(F * DEG) * DEG;
  const eps = (23.439 - 0.0000004 * n) * DEG;
  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec))) * RAD;
  const ra =
    Math.atan2(
      Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps),
      Math.cos(lambda),
    ) * RAD;
  return { ra: (((ra % 360) + 360) % 360) / 15, dec, lambda: ((lambda * RAD) % 360 + 360) % 360 };
}

export type MoonPhaseName =
  | 'новолуние'
  | 'молодая луна'
  | 'первая четверть'
  | 'растущая луна'
  | 'полнолуние'
  | 'убывающая луна'
  | 'последняя четверть'
  | 'старая луна';

export function moonPhase(ms: number): { illumination: number; waxing: boolean; angle: number; name: MoonPhaseName } {
  const sun = sunPosition(ms);
  const moon = moonPosition(ms);
  const angle = ((moon.lambda - sun.lambda) % 360 + 360) % 360;
  const illumination = (1 - Math.cos(angle * DEG)) / 2;
  const waxing = angle < 180;
  let name: MoonPhaseName;
  if (angle < 22.5 || angle >= 337.5) name = 'новолуние';
  else if (angle < 67.5) name = 'молодая луна';
  else if (angle < 112.5) name = 'первая четверть';
  else if (angle < 157.5) name = 'растущая луна';
  else if (angle < 202.5) name = 'полнолуние';
  else if (angle < 247.5) name = 'убывающая луна';
  else if (angle < 292.5) name = 'последняя четверть';
  else name = 'старая луна';
  return { illumination, waxing, angle, name };
}

/**
 * Galactic → equatorial (J2000). Used to draw the Milky Way band.
 * Matrix from the IAU galactic coordinate definition.
 */
export function galacticToEquatorial(lDeg: number, bDeg: number): Equatorial {
  const l = lDeg * DEG;
  const b = bDeg * DEG;
  const xg = Math.cos(b) * Math.cos(l);
  const yg = Math.cos(b) * Math.sin(l);
  const zg = Math.sin(b);

  const x = -0.0548755604 * xg - 0.8734370902 * yg - 0.4838350155 * zg;
  const y = 0.4941094279 * xg - 0.44482963 * yg + 0.7469822445 * zg;
  const z = -0.867666149 * xg - 0.1980763734 * yg + 0.4559837762 * zg;

  const ra = (Math.atan2(y, x) * RAD + 360) % 360;
  const dec = Math.asin(Math.max(-1, Math.min(1, z))) * RAD;
  return { ra: ra / 15, dec };
}

export function formatLocal(ms: number, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}

export function formatTime(ms: number, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
}

export function formatUT(ms: number): string {
  return new Date(ms).toLocaleTimeString('ru-RU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
}

export interface Planet extends Equatorial {
  id: string;
  name: string;
  mag: number;
  color: string;
}

interface OrbitElements {
  N: number;
  dN: number;
  i: number;
  di: number;
  w: number;
  dw: number;
  a: number;
  da: number;
  e: number;
  de: number;
  M: number;
  dM: number;
}

/** Low-precision orbital elements (Paul Schlyter's method, epoch J2000). */
const PLANET_ELEMENTS: (OrbitElements & { id: string; name: string; color: string; base: number; phase: number })[] = [
  { id: 'mercury', name: 'Меркурий', color: '#d8cfc4', base: -0.36, phase: 0.027, N: 48.3313, dN: 3.24587e-5, i: 7.0047, di: 5.0e-8, w: 29.1241, dw: 1.01444e-5, a: 0.387098, da: 0, e: 0.205635, de: 5.59e-10, M: 168.6562, dM: 4.0923344368 },
  { id: 'venus', name: 'Венера', color: '#fff2c8', base: -4.34, phase: 0.013, N: 76.6799, dN: 2.4659e-5, i: 3.3946, di: 2.75e-8, w: 54.891, dw: 1.38374e-5, a: 0.72333, da: 0, e: 0.006773, de: -1.302e-9, M: 48.0052, dM: 1.6021302244 },
  { id: 'mars', name: 'Марс', color: '#ff8a66', base: -1.51, phase: 0.016, N: 49.5574, dN: 2.11081e-5, i: 1.8497, di: -1.78e-8, w: 286.5016, dw: 2.92961e-5, a: 1.523688, da: 0, e: 0.093405, de: 2.516e-9, M: 18.6021, dM: 0.5240207766 },
  { id: 'jupiter', name: 'Юпитер', color: '#ffd7a0', base: -9.25, phase: 0.014, N: 100.4542, dN: 2.76854e-5, i: 1.303, di: -1.557e-7, w: 273.8777, dw: 1.64505e-5, a: 5.20256, da: 0, e: 0.048498, de: 4.469e-9, M: 19.895, dM: 0.0830853001 },
  { id: 'saturn', name: 'Сатурн', color: '#ffe2a6', base: -9.0, phase: 0.044, N: 113.6634, dN: 2.3898e-5, i: 2.4886, di: -1.081e-7, w: 339.3939, dw: 2.97661e-5, a: 9.55475, da: 0, e: 0.055546, de: -9.499e-9, M: 316.967, dM: 0.0334442282 },
  { id: 'uranus', name: 'Уран', color: '#a8ecff', base: -7.15, phase: 0.001, N: 74.0005, dN: 1.3978e-5, i: 0.7733, di: 1.9e-8, w: 96.6612, dw: 3.0565e-5, a: 19.18171, da: -1.55e-8, e: 0.047318, de: 7.45e-9, M: 142.5905, dM: 0.011725806 },
  { id: 'neptune', name: 'Нептун', color: '#7aa8ff', base: -6.9, phase: 0.001, N: 131.7806, dN: 3.0173e-5, i: 1.77, di: -2.55e-7, w: 272.8461, dw: -6.027e-6, a: 30.05826, da: 3.313e-8, e: 0.008606, de: 2.15e-9, M: 260.2471, dM: 0.005995147 },
];

function eccentricAnomaly(mean: number, e: number): number {
  let E = mean + e * Math.sin(mean) * (1 + e * Math.cos(mean));
  for (let i = 0; i < 6; i++) {
    const delta = (E - e * Math.sin(E) - mean) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-7) break;
  }
  return E;
}

/** Heliocentric ecliptic coordinates in AU. */
function heliocentric(el: OrbitElements, d: number): [number, number, number] {
  const N = (el.N + el.dN * d) * DEG;
  const inc = (el.i + el.di * d) * DEG;
  const w = (el.w + el.dw * d) * DEG;
  const a = el.a + el.da * d;
  const e = el.e + el.de * d;
  const M = (((el.M + el.dM * d) % 360) + 360) % 360 * DEG;
  const E = eccentricAnomaly(M, e);
  const x = a * (Math.cos(E) - e);
  const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const cn = Math.cos(N);
  const sn = Math.sin(N);
  const ci = Math.cos(inc);

  return [
    x * (cw * cn - sw * sn * ci) - y * (sw * cn + cw * sn * ci),
    x * (cw * sn + sw * cn * ci) + y * (cw * cn * ci - sw * sn),
    x * sw * Math.sin(inc) + y * cw * Math.sin(inc),
  ];
}

/** Apparent geocentric positions of the visible planets (≈1 arcminute accuracy). */
export function planetPositions(ms: number): Planet[] {
  const d = julianDate(ms) - 2451543.5;
  const eps = (23.4393 - 3.563e-7 * d) * DEG;

  const sunM = (((356.047 + 0.9856002585 * d) % 360) + 360) % 360 * DEG;
  const sunW = (282.9404 + 4.70935e-5 * d) * DEG;
  const sunE = 0.016709 - 1.151e-9 * d;
  const Es = eccentricAnomaly(sunM, sunE);
  const xv = Math.cos(Es) - sunE;
  const yv = Math.sqrt(1 - sunE * sunE) * Math.sin(Es);
  const sunLon = Math.atan2(yv, xv) + sunW;
  const sunR = Math.hypot(xv, yv);
  const xs = sunR * Math.cos(sunLon);
  const ys = sunR * Math.sin(sunLon);

  return PLANET_ELEMENTS.map((el) => {
    const [xh, yh, zh] = heliocentric(el, d);
    const xg = xh + xs;
    const yg = yh + ys;
    const zg = zh;

    const rHelio = Math.hypot(xh, yh, zh);
    const rGeo = Math.hypot(xg, yg, zg);
    const phase = Math.acos(Math.max(-1, Math.min(1, (rHelio * rHelio + rGeo * rGeo - sunR * sunR) / (2 * rHelio * rGeo)))) * RAD;

    const xe = xg;
    const ye = yg * Math.cos(eps) - zg * Math.sin(eps);
    const ze = yg * Math.sin(eps) + zg * Math.cos(eps);
    const ra = ((Math.atan2(ye, xe) * RAD) % 360 + 360) % 360;
    const dec = Math.atan2(ze, Math.hypot(xe, ye)) * RAD;
    const mag = el.base + 5 * Math.log10(Math.max(1e-6, rHelio * rGeo)) + el.phase * phase;

    return { id: el.id, name: el.name, ra: ra / 15, dec, mag, color: el.color };
  });
}

function partsInZone(ms: number, timeZone: string): Record<string, number> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(ms));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { y: get('year'), m: get('month'), d: get('day'), hh: get('hour') % 24, mm: get('minute'), ss: get('second') };
}

function zoneOffset(ms: number, timeZone: string): number {
  const p = partsInZone(ms, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss) - ms;
}

/** Format an instant as a `datetime-local` value in the observer's timezone. */
export function toZonedInput(ms: number, timeZone?: string): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  if (!timeZone) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  try {
    const p = partsInZone(ms, timeZone);
    return `${p.y}-${pad(p.m)}-${pad(p.d)}T${pad(p.hh)}:${pad(p.mm)}`;
  } catch {
    const d = new Date(ms);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}

/** Parse a `datetime-local` value as a wall-clock time in the observer's timezone. */
export function fromZonedInput(value: string, timeZone?: string): number {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  if (!timeZone) {
    return new Date(y, m - 1, d, hh, mm).getTime();
  }
  try {
    const offset = zoneOffset(guess, timeZone);
    return guess - offset;
  } catch {
    return new Date(y, m - 1, d, hh, mm).getTime();
  }
}
