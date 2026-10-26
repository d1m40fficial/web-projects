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
