import type { Forecast, Place } from './types';

/**
 * Gismeteo public "inform-service" feed (the one its own widgets use).
 * It sends `Access-Control-Allow-Origin: *`, so it works from a static page.
 * No token or key is required.
 */
const SERVICE = 'https://services.gismeteo.ru/inform-service/inf_chrome';

const WIND_DIRECTIONS = [0, 0, 45, 90, 135, 180, 225, 270, 315];
const CLOUD_COVER = [0, 30, 65, 100];

function num(value: string | null | undefined, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseXml(text: string): Document {
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  if (doc.querySelector('parsererror') || doc.querySelector('errorCode')) {
    throw new Error('Gismeteo вернул некорректный ответ');
  }
  return doc;
}

async function fetchXml(url: string, signal?: AbortSignal): Promise<Document> {
  const response = await fetch(url, { signal, headers: { Accept: 'text/xml, application/xml' } });
  if (!response.ok) throw new Error(`Gismeteo: HTTP ${response.status}`);
  return parseXml(await response.text());
}

/** Gismeteo icon codes (d.c3.r1, n, c4, …) → WMO codes used by the UI. */
function wmoFromIcon(icon: string): number {
  const parts = icon.toLowerCase().split('.');
  const has = (value: string) => parts.includes(value);
  if (has('ts')) return 95;
  if (has('f')) return 45;
  if (has('rs3')) return 67;
  if (has('rs2') || has('rs1')) return 66;
  if (has('s3')) return 75;
  if (has('s2')) return 73;
  if (has('s1')) return 71;
  if (has('r3')) return 65;
  if (has('r2')) return 63;
  if (has('r1')) return 61;
  if (has('c4') || has('c3')) return 3;
  if (has('c2')) return 2;
  return 0;
}

/**
 * Gismeteo publishes precipitation amounts (mm) but not probabilities, so the
 * chance shown in the UI is derived from the amount and the WMO code.
 */
function precipChance(mm: number, code: number): number {
  if (mm <= 0) return code >= 51 ? 35 : 0;
  if (code >= 95) return 90;
  if (mm >= 5) return 90;
  if (mm >= 2) return 80;
  if (mm >= 0.5) return 70;
  return 55;
}

function addHours(iso: string, hours: number): string {
  return new Date(Date.parse(`${iso}Z`) + hours * 3600_000).toISOString().slice(0, 19);
}

/**
 * Gismeteo is inconsistent: `cur_time` is UTC, while the `sunrise`/`sunset`
 * epoch values already carry local wall-clock time in a "fake UTC" field.
 * `tzone` (minutes east of UTC) therefore only applies to `cur_time`.
 */
function isoFromEpoch(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 19);
}

function utcToLocalIso(iso: string, offsetMinutes: number): string {
  return new Date(Date.parse(`${iso}Z`) + offsetMinutes * 60_000).toISOString().slice(0, 19);
}

function offsetLabel(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  const minutes = abs % 60;
  return `UTC${sign}${Math.floor(abs / 60)}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
}

/** Find the Gismeteo settlement id for a place, caching it on the object. */
export async function resolveGismeteoId(place: Place, signal?: AbortSignal): Promise<number> {
  if (place.gismeteoId) return place.gismeteoId;
  const url = `${SERVICE}/cities/?lat=${place.latitude.toFixed(3)}&lng=${place.longitude.toFixed(3)}&lang=ru`;
  const doc = await fetchXml(url, signal);

  let bestId = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const item of Array.from(doc.querySelectorAll('item'))) {
    if (item.getAttribute('kind') !== 'T') continue; // T — город, P — аэропорт
    const id = num(item.getAttribute('id'));
    const distance = num(item.getAttribute('distance'), Number.POSITIVE_INFINITY);
    if (id && distance < bestDistance) {
      bestDistance = distance;
      bestId = id;
    }
  }
  if (!bestId) throw new Error('Gismeteo не нашёл этот город');
  place.gismeteoId = bestId;
  return bestId;
}

export async function fetchGismeteoForecast(place: Place, signal?: AbortSignal): Promise<Forecast> {
  const id = await resolveGismeteoId(place, signal);
  const doc = await fetchXml(`${SERVICE}/forecast/?city=${id}&lang=ru`, signal);

  const location = doc.querySelector('location');
  if (!location) throw new Error('Gismeteo вернул пустой прогноз');

  const offset = num(location.getAttribute('tzone'));
  const curTime = location.getAttribute('cur_time') ?? new Date().toISOString().slice(0, 19);

  const fact = doc.querySelector('fact');
  const values = fact?.querySelector('values');
  if (!fact || !values) throw new Error('Gismeteo не отдал текущую погоду');

  const icon = values.getAttribute('icon') ?? 'd';
  const sunrise = num(fact.getAttribute('sunrise'));
  const sunset = num(fact.getAttribute('sunset'));
  const curLocal = utcToLocalIso(curTime, offset);
  const curMin = Number(curLocal.slice(11, 13)) * 60 + Number(curLocal.slice(14, 16));
  const riseMin = sunrise ? Number(isoFromEpoch(sunrise).slice(11, 13)) * 60 + Number(isoFromEpoch(sunrise).slice(14, 16)) : 0;
  const setMin = sunset ? Number(isoFromEpoch(sunset).slice(11, 13)) * 60 + Number(isoFromEpoch(sunset).slice(14, 16)) : 0;
  const isDay = sunrise && sunset ? curMin >= riseMin && curMin <= setMin : icon.split('.')[0] !== 'n';

  const factPrecip = values.getAttribute('prflt') ?? values.getAttribute('pr');
  const code = wmoFromIcon(icon);

  // Hourly: the feed gives 3-hour steps for two days. Expand each step to three
  // hourly slots so the existing 24-hour chart keeps working unchanged.
  const hourly = new Map<string, { temp: number; precip: number; code: number }>();
  for (const forecast of Array.from(doc.querySelectorAll('day > forecast'))) {
    const valid = forecast.getAttribute('valid');
    const node = forecast.querySelector('values');
    if (!valid || !node) continue;
    const code = wmoFromIcon(node.getAttribute('icon') ?? '');
    const slot = {
      temp: num(node.getAttribute('t')),
      precip: precipChance(num(node.getAttribute('pr')), code),
      code,
    };
    for (let hour = 0; hour < 3; hour++) hourly.set(addHours(valid, hour), slot);
  }
  const hourlyTimes = Array.from(hourly.keys()).sort();
  if (!hourlyTimes.length) throw new Error('Gismeteo не отдал почасовой прогноз');

  const days = Array.from(doc.querySelectorAll('day'));
  const daily = {
    time: [] as string[],
    weather_code: [] as number[],
    temperature_2m_max: [] as number[],
    temperature_2m_min: [] as number[],
    sunrise: [] as string[],
    sunset: [] as string[],
    precipitation_probability_max: [] as number[],
  };

  for (const day of days) {
    const date = day.getAttribute('date');
    if (!date) continue;
    daily.time.push(date);
    const dayCode = wmoFromIcon(day.getAttribute('icon') ?? '');
    daily.weather_code.push(dayCode);
    daily.temperature_2m_max.push(num(day.getAttribute('tmax')));
    daily.temperature_2m_min.push(num(day.getAttribute('tmin')));
    daily.sunrise.push(isoFromEpoch(num(day.getAttribute('sunrise'))));
    daily.sunset.push(isoFromEpoch(num(day.getAttribute('sunset'))));
    daily.precipitation_probability_max.push(precipChance(num(day.getAttribute('pr')), dayCode));
  }

  if (!daily.time.length) throw new Error('Gismeteo не отдал прогноз по дням');

  return {
    current: {
      time: curLocal,
      temperature_2m: num(values.getAttribute('t')),
      relative_humidity_2m: num(values.getAttribute('hum')),
      apparent_temperature: num(values.getAttribute('tflt'), num(values.getAttribute('t'))),
      is_day: isDay ? 1 : 0,
      precipitation: factPrecip !== null ? num(factPrecip) : 0,
      weather_code: code,
      cloud_cover: CLOUD_COVER[Math.min(3, num(values.getAttribute('cl')))] ?? 0,
      pressure_msl: Math.round(num(values.getAttribute('p')) * 1.33322),
      wind_speed_10m: num(values.getAttribute('ws')) * 3.6,
      wind_direction_10m: WIND_DIRECTIONS[Math.min(8, num(values.getAttribute('wd')))] ?? 0,
    },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTimes.map((time) => hourly.get(time)!.temp),
      precipitation_probability: hourlyTimes.map((time) => hourly.get(time)!.precip),
      weather_code: hourlyTimes.map((time) => hourly.get(time)!.code),
    },
    daily,
    timezone: place.timezone ?? 'UTC',
    timezone_abbreviation: offsetLabel(offset),
  };
}
