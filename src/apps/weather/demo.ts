import type { Forecast } from './types';

/** Deterministic pseudo-random generator so demo data stays stable per city/day. */
function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoHour(d: Date): string {
  return `${isoDate(d)}T${pad(d.getHours())}:00`;
}

function nowInZone(timeZone?: string): Date {
  const now = new Date();
  if (!timeZone) return now;
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return new Date(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));
  } catch {
    return now;
  }
}

function timeOfDay(hours: number): string {
  const h = Math.floor(hours) % 24;
  const m = Math.round((hours % 1) * 60);
  return `${pad(h)}:${pad(m)}`;
}

/**
 * Offline demo forecast. This is *not* real weather — the UI marks it clearly.
 * It is used when both weather providers are unreachable (offline preview, restricted networks).
 */
export function demoForecast(place: { name: string; latitude: number; longitude: number; timezone?: string }): Forecast {
  const now = nowInZone(place.timezone);
  const seed = hashString(`${place.name}:${isoDate(now)}`);
  const month = now.getMonth() + 1;
  const seasonalMonth = place.latitude < 0 ? month + 6 : month;
  const seasonal = 14 - 16 * Math.cos((2 * Math.PI * (seasonalMonth - 7)) / 12);
  const latitudePenalty = Math.max(0, Math.abs(place.latitude) - 20) * 0.28;
  const base = seasonal - latitudePenalty;
  const isDay = now.getHours() >= 6 && now.getHours() < 19;

  const codeFor = (temp: number, salt: number): number => {
    const r = rand(seed + salt);
    if (temp < 0) return r < 0.35 ? 71 : r < 0.6 ? 73 : r < 0.78 ? 75 : 3;
    if (temp > 27) return r < 0.55 ? 0 : r < 0.75 ? 1 : r < 0.9 ? 2 : 95;
    if (r < 0.28) return 0;
    if (r < 0.48) return 1;
    if (r < 0.66) return 2;
    if (r < 0.8) return 3;
    if (r < 0.93) return 61;
    return 80;
  };

  const tempAt = (date: Date, salt: number): number => {
    const hour = date.getHours() + date.getMinutes() / 60;
    const diurnal = 6.5 * Math.cos((2 * Math.PI * (hour - 15)) / 24);
    return Math.round((base + diurnal + (rand(seed + salt + date.getDate()) - 0.5) * 2.4) * 10) / 10;
  };

  const hourlyTimes: string[] = [];
  const hourlyTemps: number[] = [];
  const hourlyPrecip: number[] = [];
  const hourlyCodes: number[] = [];

  const start = new Date(now);
  start.setMinutes(0, 0, 0);

  for (let i = 0; i < 48; i++) {
    const d = new Date(start.getTime() + i * 3600_000);
    hourlyTimes.push(isoHour(d));
    const t = tempAt(d, i);
    hourlyTemps.push(t);
    const code = codeFor(t, i * 7 + d.getHours());
    hourlyCodes.push(code);
    const wet = code === 0 ? 2 : code === 1 ? 6 : code === 2 ? 14 : code === 3 ? 24 : code === 61 ? 58 : 44;
    hourlyPrecip.push(Math.min(96, Math.round(wet + (rand(seed + i * 13) - 0.5) * 22)));
  }

  const dayLength = Math.max(6.5, Math.min(17, 12 + 4 * Math.sin((2 * Math.PI * (seasonalMonth - 3)) / 12) * (Math.abs(place.latitude) / 60)));
  const sunriseHour = 12.4 - dayLength / 2;
  const sunsetHour = 12.4 + dayLength / 2;

  const daily = {
    time: [] as string[],
    weather_code: [] as number[],
    temperature_2m_max: [] as number[],
    temperature_2m_min: [] as number[],
    sunrise: [] as string[],
    sunset: [] as string[],
    precipitation_probability_max: [] as number[],
    uv_index_max: [] as number[],
  };

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const tempMax = Math.round(base + 6.5 + (rand(seed + i * 31) - 0.5) * 3);
    const tempMin = Math.round(base - 6 + (rand(seed + i * 17) - 0.5) * 3);
    const code = codeFor((tempMax + tempMin) / 2, i * 11 + 3);
    daily.time.push(isoDate(d));
    daily.weather_code.push(code);
    daily.temperature_2m_max.push(tempMax);
    daily.temperature_2m_min.push(tempMin);
    daily.sunrise.push(`${isoDate(d)}T${timeOfDay(sunriseHour)}`);
    daily.sunset.push(`${isoDate(d)}T${timeOfDay(sunsetHour)}`);
    daily.precipitation_probability_max.push(
      code >= 61 ? Math.round(45 + rand(seed + i) * 45) : Math.round(4 + rand(seed + i * 5) * 22),
    );
    daily.uv_index_max.push(Math.round((2 + rand(seed + i * 7) * 5) * 10) / 10);
  }

  const currentTemp = tempAt(now, 0);
  return {
    current: {
      time: `${isoDate(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}`,
      temperature_2m: currentTemp,
      relative_humidity_2m: Math.round(58 + rand(seed + 3) * 30),
      apparent_temperature: Math.round((currentTemp - (isDay ? 0.5 : 1.4)) * 10) / 10,
      is_day: isDay ? 1 : 0,
      precipitation: daily.weather_code[0] >= 61 ? Math.round(rand(seed + 9) * 30) / 10 : 0,
      weather_code: daily.weather_code[0],
      cloud_cover: Math.round(20 + rand(seed + 4) * 70),
      pressure_msl: Math.round(1004 + rand(seed + 6) * 22),
      wind_speed_10m: Math.round(4 + rand(seed + 5) * 17),
      wind_direction_10m: Math.round(rand(seed + 8) * 360),
    },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTemps,
      precipitation_probability: hourlyPrecip,
      weather_code: hourlyCodes,
    },
    daily,
    timezone: 'Europe/Moscow',
    timezone_abbreviation: 'MSK',
  };
}
