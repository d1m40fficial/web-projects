import { $, clamp, debounce, escapeHtml, store } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';
import { weatherGroup, weatherIcon, weatherLabel } from './icons';
import { demoForecast } from './demo';
import { fetchGismeteoForecast } from './gismeteo';
import type { Forecast, Place, WeatherSource } from './types';

interface Cached {
  place: Place;
  data: Forecast;
  ts: number;
  source?: WeatherSource;
}

const DEFAULT_PLACE: Place = {
  name: 'Москва',
  country: 'Россия',
  country_code: 'RU',
  admin1: 'Москва',
  latitude: 55.7558,
  longitude: 37.6173,
  timezone: 'Europe/Moscow',
  gismeteoId: 4368,
};

const FALLBACK_CITIES: Place[] = [
  { name: 'Москва', country: 'Россия', country_code: 'RU', admin1: 'Москва', latitude: 55.7558, longitude: 37.6173, gismeteoId: 4368 },
  { name: 'Санкт-Петербург', country: 'Россия', country_code: 'RU', admin1: 'Ленинградская область', latitude: 59.9343, longitude: 30.3351, gismeteoId: 4079 },
  { name: 'Казань', country: 'Россия', country_code: 'RU', admin1: 'Татарстан', latitude: 55.7961, longitude: 49.1064, gismeteoId: 4364 },
  { name: 'Екатеринбург', country: 'Россия', country_code: 'RU', admin1: 'Свердловская область', latitude: 56.8389, longitude: 60.6057, gismeteoId: 4517 },
  { name: 'Новосибирск', country: 'Россия', country_code: 'RU', admin1: 'Новосибирская область', latitude: 55.0084, longitude: 82.9357, gismeteoId: 4690 },
  { name: 'Сочи', country: 'Россия', country_code: 'RU', admin1: 'Краснодарский край', latitude: 43.6028, longitude: 39.7342, gismeteoId: 5233 },
  { name: 'Владивосток', country: 'Россия', country_code: 'RU', admin1: 'Приморский край', latitude: 43.1155, longitude: 131.8855, gismeteoId: 4877 },
  { name: 'Калининград', country: 'Россия', country_code: 'RU', admin1: 'Калининградская область', latitude: 54.7104, longitude: 20.4522, gismeteoId: 4225 },
  { name: 'Токио', country: 'Япония', country_code: 'JP', admin1: 'Токио', latitude: 35.6762, longitude: 139.6503, gismeteoId: 5924 },
  { name: 'Нью-Йорк', country: 'США', country_code: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.006, gismeteoId: 7190 },
  { name: 'Лондон', country: 'Великобритания', country_code: 'GB', admin1: 'England', latitude: 51.5072, longitude: -0.1276, gismeteoId: 744 },
  { name: 'Париж', country: 'Франция', country_code: 'FR', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, gismeteoId: 1623 },
  { name: 'Берлин', country: 'Германия', country_code: 'DE', admin1: 'Berlin', latitude: 52.52, longitude: 13.405, gismeteoId: 2391 },
  { name: 'Рим', country: 'Италия', country_code: 'IT', admin1: 'Lazio', latitude: 41.9028, longitude: 12.4964, gismeteoId: 3561 },
  { name: 'Барселона', country: 'Испания', country_code: 'ES', admin1: 'Catalonia', latitude: 41.3874, longitude: 2.1686, gismeteoId: 1948 },
  { name: 'Дубай', country: 'ОАЭ', country_code: 'AE', admin1: 'Dubai', latitude: 25.2048, longitude: 55.2708, gismeteoId: 5529 },
  { name: 'Сеул', country: 'Южная Корея', country_code: 'KR', admin1: 'Seoul', latitude: 37.5665, longitude: 126.978, gismeteoId: 5861 },
  { name: 'Сингапур', country: 'Сингапур', country_code: 'SG', admin1: 'Singapore', latitude: 1.3521, longitude: 103.8198, gismeteoId: 6022 },
  { name: 'Сидней', country: 'Австралия', country_code: 'AU', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, gismeteoId: 10719 },
  { name: 'Сан-Франциско', country: 'США', country_code: 'US', admin1: 'California', latitude: 37.7749, longitude: -122.4194, gismeteoId: 7355 },
  { name: 'Нижний Новгород', country: 'Россия', country_code: 'RU', admin1: 'Нижегородская область', latitude: 56.3269, longitude: 44.0059, gismeteoId: 4355 },
  { name: 'Самара', country: 'Россия', country_code: 'RU', admin1: 'Самарская область', latitude: 53.1959, longitude: 50.1002, gismeteoId: 4618 },
  { name: 'Омск', country: 'Россия', country_code: 'RU', admin1: 'Омская область', latitude: 54.9885, longitude: 73.3242, gismeteoId: 4578 },
  { name: 'Ростов-на-Дону', country: 'Россия', country_code: 'RU', admin1: 'Ростовская область', latitude: 47.2357, longitude: 39.7015, gismeteoId: 5110 },
  { name: 'Уфа', country: 'Россия', country_code: 'RU', admin1: 'Башкортостан', latitude: 54.7388, longitude: 55.9721, gismeteoId: 4588 },
  { name: 'Красноярск', country: 'Россия', country_code: 'RU', admin1: 'Красноярский край', latitude: 56.0153, longitude: 92.8932, gismeteoId: 4674 },
  { name: 'Воронеж', country: 'Россия', country_code: 'RU', admin1: 'Воронежская область', latitude: 51.672, longitude: 39.1843, gismeteoId: 5026 },
  { name: 'Пермь', country: 'Россия', country_code: 'RU', admin1: 'Пермский край', latitude: 58.0105, longitude: 56.2502, gismeteoId: 4476 },
  { name: 'Волгоград', country: 'Россия', country_code: 'RU', admin1: 'Волгоградская область', latitude: 48.708, longitude: 44.5133, gismeteoId: 5089 },
  { name: 'Краснодар', country: 'Россия', country_code: 'RU', admin1: 'Краснодарский край', latitude: 45.0355, longitude: 38.9753, gismeteoId: 5136 },
  { name: 'Саратов', country: 'Россия', country_code: 'RU', admin1: 'Саратовская область', latitude: 51.5336, longitude: 46.0343, gismeteoId: 5032 },
  { name: 'Тюмень', country: 'Россия', country_code: 'RU', admin1: 'Тюменская область', latitude: 57.1522, longitude: 65.5272, gismeteoId: 4501 },
  { name: 'Иркутск', country: 'Россия', country_code: 'RU', admin1: 'Иркутская область', latitude: 52.287, longitude: 104.281, gismeteoId: 4787 },
  { name: 'Хабаровск', country: 'Россия', country_code: 'RU', admin1: 'Хабаровский край', latitude: 48.4827, longitude: 135.0838, gismeteoId: 4862 },
  { name: 'Мурманск', country: 'Россия', country_code: 'RU', admin1: 'Мурманская область', latitude: 68.9585, longitude: 33.0827, gismeteoId: 3903 },
  { name: 'Владимир', country: 'Россия', country_code: 'RU', admin1: 'Владимирская область', latitude: 56.129, longitude: 40.407, gismeteoId: 4350 },
  { name: 'Ярославль', country: 'Россия', country_code: 'RU', admin1: 'Ярославская область', latitude: 57.6261, longitude: 39.8845, gismeteoId: 4313 },
  { name: 'Минск', country: 'Беларусь', country_code: 'BY', admin1: 'Минск', latitude: 53.9006, longitude: 27.559, gismeteoId: 4248 },
  { name: 'Киев', country: 'Украина', country_code: 'UA', admin1: 'Киев', latitude: 50.4501, longitude: 30.5234, gismeteoId: 4944 },
  { name: 'Алматы', country: 'Казахстан', country_code: 'KZ', admin1: 'Алматы', latitude: 43.2389, longitude: 76.8897, gismeteoId: 5205 },
  { name: 'Тбилиси', country: 'Грузия', country_code: 'GE', admin1: 'Тбилиси', latitude: 41.7151, longitude: 44.8271, gismeteoId: 5277 },
  { name: 'Ереван', country: 'Армения', country_code: 'AM', admin1: 'Ереван', latitude: 40.1792, longitude: 44.4991, gismeteoId: 5298 },
  { name: 'Ташкент', country: 'Узбекистан', country_code: 'UZ', admin1: 'Ташкент', latitude: 41.2995, longitude: 69.2401, gismeteoId: 5331 },
  { name: 'Бишкек', country: 'Кыргызстан', country_code: 'KG', admin1: 'Бишкек', latitude: 42.8746, longitude: 74.5698, gismeteoId: 5327 },
];

const CITY_TIMEZONES: Record<string, string> = {
  'Москва': 'Europe/Moscow',
  'Санкт-Петербург': 'Europe/Moscow',
  'Казань': 'Europe/Moscow',
  'Екатеринбург': 'Asia/Yekaterinburg',
  'Новосибирск': 'Asia/Novosibirsk',
  'Сочи': 'Europe/Moscow',
  'Владивосток': 'Asia/Vladivostok',
  'Калининград': 'Europe/Kaliningrad',
  'Токио': 'Asia/Tokyo',
  'Нью-Йорк': 'America/New_York',
  'Лондон': 'Europe/London',
  'Париж': 'Europe/Paris',
  'Берлин': 'Europe/Berlin',
  'Рим': 'Europe/Rome',
  'Барселона': 'Europe/Madrid',
  'Дубай': 'Asia/Dubai',
  'Сеул': 'Asia/Seoul',
  'Сингапур': 'Asia/Singapore',
  'Сидней': 'Australia/Sydney',
  'Сан-Франциско': 'America/Los_Angeles',
  'Нижний Новгород': 'Europe/Moscow',
  'Самара': 'Europe/Samara',
  'Омск': 'Asia/Omsk',
  'Ростов-на-Дону': 'Europe/Moscow',
  'Уфа': 'Asia/Yekaterinburg',
  'Красноярск': 'Asia/Krasnoyarsk',
  'Воронеж': 'Europe/Moscow',
  'Пермь': 'Asia/Yekaterinburg',
  'Волгоград': 'Europe/Volgograd',
  'Краснодар': 'Europe/Moscow',
  'Саратов': 'Europe/Saratov',
  'Тюмень': 'Asia/Yekaterinburg',
  'Иркутск': 'Asia/Irkutsk',
  'Хабаровск': 'Asia/Vladivostok',
  'Мурманск': 'Europe/Moscow',
  'Владимир': 'Europe/Moscow',
  'Ярославль': 'Europe/Moscow',
  'Минск': 'Europe/Minsk',
  'Киев': 'Europe/Kyiv',
  'Алматы': 'Asia/Almaty',
  'Тбилиси': 'Asia/Tbilisi',
  'Ереван': 'Asia/Yerevan',
  'Ташкент': 'Asia/Tashkent',
  'Бишкек': 'Asia/Bishkek',
};
FALLBACK_CITIES.forEach((city) => {
  city.timezone = CITY_TIMEZONES[city.name] ?? 'UTC';
});

const cache = store<Cached | null>('wl.weather.v2', null);
const recentsStore = store<Place[]>('wl.weather.places.v1', []);

function countryBadge(code?: string): string {
  return `<span class="wx-flag mono">${(code || '--').toUpperCase()}</span>`;
}

function windDirection(deg: number): string {
  const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'З', 'СЗ', 'С'];
  return dirs[Math.round(deg / 45) % 8];
}

function hhmm(iso: string): string {
  return iso?.split('T')[1]?.slice(0, 5) ?? '—';
}

function dayName(iso: string, index: number): string {
  if (index === 0) return 'Сегодня';
  if (index === 1) return 'Завтра';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { weekday: 'short' });
}

function dateLabel(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function smoothPath(points: [number, number][]): string {
  if (!points.length) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = (x0 + x1) / 2;
    d += ` Q ${mx} ${y0}, ${mx} ${(y0 + y1) / 2} T ${x1} ${y1}`;
  }
  return d;
}

export function mount(root: HTMLElement): () => void {
  let place: Place = cache.get()?.place ?? DEFAULT_PLACE;
  let data: Forecast | null = cache.get()?.data ?? null;
  let unit: 'c' | 'f' = 'c';
  let lastUpdated = cache.get()?.ts ?? 0;
  let source: WeatherSource = cache.get()?.source ?? 'gismeteo';
  let gismeteoOk: boolean | null = null;
  let controller: AbortController | null = null;
  let demoMode = false;
  let disposed = false;

  const temp = (value: number): string => {
    const v = unit === 'c' ? value : value * 1.8 + 32;
    return `${Math.round(v)}°`;
  };
  const tempUnit = (): string => (unit === 'c' ? 'C' : 'F');
  const wind = (value: number): string => (unit === 'c' ? `${Math.round(value)} км/ч` : `${Math.round(value * 0.621371)} mph`);

  root.innerHTML = `
    <div class="wx">
      <div class="wx-top">
        <div class="wx-search">
          ${icon('search')}
          <input type="text" id="wx-input" placeholder="Город, например Токио" autocomplete="off" spellcheck="false" aria-label="Поиск города" />
          <div class="wx-results" id="wx-results" hidden></div>
        </div>
        <div class="wx-actions">
          <button class="btn btn--sm btn--ghost" type="button" id="wx-geo" title="Определить местоположение">${icon('map')} <span class="wx-geo-label">Рядом</span></button>
          <div class="segmented" role="group" aria-label="Единицы температуры">
            <button type="button" data-unit="c" class="is-active">°C</button>
            <button type="button" data-unit="f">°F</button>
          </div>
          <button class="btn btn--sm btn--icon" type="button" id="wx-refresh" title="Обновить">${icon('refresh')}</button>
        </div>
      </div>

      <div class="wx-demo" id="wx-demo-banner" hidden>
        ${icon('info')}
        <span>Показаны <b>демо-данные</b>: Gismeteo и Open-Meteo недоступны из этой сети. Логика интерфейса настоящая, цифры — сгенерированные.</span>
        <button class="wx-demo__retry" type="button" id="wx-demo-retry">Повторить</button>
      </div>
      <div id="wx-body"></div>
    </div>
  `;

  const body = $('#wx-body', root);
  const input = $<HTMLInputElement>('#wx-input', root);
  const results = $('#wx-results', root);

  const renderSkeleton = () => {
    body.innerHTML = `
      <div class="wx-skeleton">
        <div class="wx-sk wx-sk--hero"></div>
        <div class="wx-sk-row">${Array.from({ length: 4 }, () => '<div class="wx-sk"></div>').join('')}</div>
        <div class="wx-sk wx-sk--chart"></div>
      </div>`;
  };

  const renderError = (message: string) => {
    body.innerHTML = `
      <div class="wx-error panel">
        <span class="wx-error__icon">${icon('warning')}</span>
        <h2>Погода не отвечает</h2>
        <p>${escapeHtml(message)}</p>
        <div class="wx-error__actions">
          <button class="btn btn--primary" type="button" id="wx-retry">${icon('refresh')} Попробовать снова</button>
          <button class="btn btn--ghost" type="button" id="wx-demo-city">Москва</button>
        </div>
        <small>Источник: Gismeteo (резерв — Open-Meteo). Проверьте соединение или попробуйте позже.</small>
      </div>`;
    $('#wx-retry', root)?.addEventListener('click', () => void load(place));
    $('#wx-demo-city', root)?.addEventListener('click', () => {
      place = DEFAULT_PLACE;
      void load(place);
    });
  };

  const saveRecent = (p: Place) => {
    const list = recentsStore.get().filter((r) => Math.abs(r.latitude - p.latitude) > 0.01 || Math.abs(r.longitude - p.longitude) > 0.01);
    list.unshift(p);
    recentsStore.set(list.slice(0, 5));
  };

  const render = () => {
    if (!data) return;
    const demoBanner = $('#wx-demo-banner', root);
    if (demoBanner) demoBanner.hidden = !demoMode;
    const cur = data.current;
    const day = data.daily;
    const group = weatherGroup(cur.weather_code);
    const isNight = cur.is_day === 0;
    const sky = isNight ? 'night' : group;

    const sunrise = hhmm(day.sunrise[0]);
    const sunset = hhmm(day.sunset[0]);
    const uv = day.uv_index_max?.[0];
    const nowMin = Number(cur.time.split('T')[1].slice(0, 2)) * 60 + Number(cur.time.split('T')[1].slice(3, 5));
    const riseMin = Number(sunrise.split(':')[0]) * 60 + Number(sunrise.split(':')[1]);
    const setMin = Number(sunset.split(':')[0]) * 60 + Number(sunset.split(':')[1]);
    const daylight = setMin > riseMin ? setMin - riseMin : 1;
    const progress = clamp((nowMin - riseMin) / daylight, 0, 1);
    const sunX = 100 - 78 * Math.cos(Math.PI * progress);
    const sunY = 88 - 64 * Math.sin(Math.PI * progress);

    // next 24 hours
    const startIndex = Math.max(0, data.hourly.time.findIndex((t) => t.slice(0, 13) >= cur.time.slice(0, 13)));
    const hours = data.hourly.time.slice(startIndex, startIndex + 24);
    const hourTemps = data.hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const hourPrecip = data.hourly.precipitation_probability.slice(startIndex, startIndex + 24);
    const hourCodes = data.hourly.weather_code.slice(startIndex, startIndex + 24);

    const minT = Math.min(...hourTemps);
    const maxT = Math.max(...hourTemps);
    const w = 720;
    const h = 176;
    const padX = 16;
    const padTop = 30;
    const padBottom = 40;
    const chartH = h - padTop - padBottom;
    const points = hourTemps.map((t, i) => {
      const x = padX + (i / Math.max(1, hourTemps.length - 1)) * (w - padX * 2);
      const y = padTop + (1 - (t - minT + 1) / (maxT - minT + 2)) * chartH;
      return [x, y] as [number, number];
    });
    const line = smoothPath(points);
    const area = `${line} L ${points[points.length - 1][0]} ${h - padBottom} L ${padX} ${h - padBottom} Z`;

    const labelEvery = 4;
    const xLabels = hours
      .map((time, i) => {
        if (i % labelEvery !== 0) return '';
        const hh = time.slice(11, 16);
        return `<text x="${points[i][0]}" y="${h - 12}" text-anchor="middle" class="wx-axis">${hh}</text>`;
      })
      .join('');

    const tempLabels = hourTemps
      .map((t, i) => {
        if (i % labelEvery !== 0) return '';
        return `<text x="${points[i][0]}" y="${points[i][1] - 12}" text-anchor="middle" class="wx-temp-label">${temp(t)}</text>`;
      })
      .join('');

    const pointDots = points
      .filter((_, i) => i % 3 === 0)
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#0b0b14" stroke="var(--wx-accent)" stroke-width="2" opacity="${i === 0 ? 1 : 0.6}"/>`)
      .join('');

    const precipBars = hourPrecip
      .map((p, i) => {
        if (p < 12) return '';
        const bh = (p / 100) * 26;
        return `<rect x="${points[i][0] - 4}" y="${h - padBottom - bh}" width="8" height="${bh}" rx="2" fill="rgba(56,224,242,.28)"/>`;
      })
      .join('');

    const highlight = [0, 3, 6, 9, 12, 18].filter((i) => i < hours.length);

    body.innerHTML = `
      <section class="wx-now" data-sky="${sky}">
        <div class="wx-now__bg"></div>
        <div class="wx-now__main">
          <div class="wx-now__place">
            <span class="wx-now__flag">${countryBadge(place.country_code)}</span>
            <div>
              <h2>${escapeHtml(place.name)}</h2>
              <p>${[place.admin1, place.country].filter(Boolean).join(', ') || 'ваше местоположение'} · местное время ${cur.time.slice(11, 16)}</p>
            </div>
            <span class="pill wx-now__updated">${icon('clock')} ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString('ru-RU', { timeZone: place.timezone, hour: '2-digit', minute: '2-digit' }) : '—'}</span>
          </div>

          <div class="wx-now__row">
            <div class="wx-now__temp">
              <div class="wx-now__value">${temp(cur.temperature_2m)}<span>${tempUnit()}</span></div>
              <div class="wx-now__cond">${weatherLabel(cur.weather_code)}</div>
              <div class="wx-now__feels">ощущается ${temp(cur.apparent_temperature)} · ${isNight ? 'ночь' : 'день'}</div>
            </div>
            <div class="wx-now__icon">${weatherIcon(cur.weather_code, cur.is_day === 1)}</div>
          </div>

          <div class="wx-now__range">
            <span>${icon('arrowUpRight')} ${temp(day.temperature_2m_max[0])}</span>
            <span>${icon('arrow')} ${temp(day.temperature_2m_min[0])}</span>
            <span>${icon('weather')} осадки ${day.precipitation_probability_max[0]}%</span>
          </div>
        </div>

        <div class="wx-sun">
          <svg viewBox="0 0 200 110" aria-hidden="true">
            <defs>
              <linearGradient id="wx-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#ff9d4d"/><stop offset=".5" stop-color="#ffcb5c"/><stop offset="1" stop-color="#38e0f2"/>
              </linearGradient>
            </defs>
            <path d="M22 88 A 78 64 0 0 1 178 88" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5" stroke-dasharray="4 5"/>
            <path d="M22 88 A 78 64 0 0 1 178 88" fill="none" stroke="url(#wx-arc)" stroke-width="2.5" stroke-dasharray="${progress * 220} 300" stroke-linecap="round"/>
            <circle cx="${sunX}" cy="${sunY}" r="5" fill="${isNight ? '#dfe6ff' : '#ffcb5c'}" stroke="${isNight ? '#8b6bff' : '#fff6d8'}" stroke-width="2"/>
            <line x1="22" y1="88" x2="178" y2="88" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
            <text x="22" y="104" class="wx-sun__time">${sunrise}</text>
            <text x="178" y="104" text-anchor="end" class="wx-sun__time">${sunset}</text>
          </svg>
          <div class="wx-sun__label">${isNight ? 'солнце за горизонтом' : `световой день ${Math.floor(daylight / 60)} ч ${daylight % 60} мин`}</div>
        </div>

        <div class="wx-metrics">
          ${[
            [icon('weather'), 'ветер', `${wind(cur.wind_speed_10m)}`, `${windDirection(cur.wind_direction_10m)} · ${Math.round(cur.wind_direction_10m)}°`],
            [icon('weather'), 'влажность', `${cur.relative_humidity_2m}%`, 'относительная'],
            [icon('chart'), 'давление', `${Math.round(cur.pressure_msl)} hPa`, 'на уровне моря'],
            [icon('weather'), 'осадки', `${cur.precipitation.toFixed(1)} мм`, 'по данным сервиса'],
            [icon('sun'), 'УФ-индекс', uv == null ? '—' : uv.toFixed(1), uv == null ? 'нет в источнике' : uv > 5 ? 'высокий' : 'умеренный'],
            [icon('weather'), 'облачность', `${cur.cloud_cover}%`, isNight ? 'ночное небо' : 'днём'],
          ]
            .map(
              ([ic, label, value, sub]) => `
              <div class="wx-metric">
                <span class="wx-metric__icon">${ic}</span>
                <div><span>${label}</span><b>${value}</b><small>${sub}</small></div>
              </div>`,
            )
            .join('')}
        </div>
      </section>

      <div class="wx-grid">
        <section class="panel wx-hourly">
          <div class="panel__head">
            <span class="panel__title">${icon('clock')} 24 часа</span>
            <span class="wx-hourly__legend"><i></i> температура <i class="wx-hourly__precip"></i> осадки</span>
          </div>
          <div class="panel__body">
            <div class="wx-chart" id="wx-chart">
              <svg viewBox="0 0 ${w} ${h}" aria-label="График температуры на 24 часа">
                <defs>
                  <linearGradient id="wx-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="var(--wx-accent)" stop-opacity=".28"/>
                    <stop offset="1" stop-color="var(--wx-accent)" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="wx-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="${isNight ? '#38e0f2' : '#ffcb5c'}"/><stop offset="1" stop-color="#c4f56a"/>
                  </linearGradient>
                </defs>
                ${precipBars}
                <path d="${area}" fill="url(#wx-area)"/>
                <path d="${line}" fill="none" stroke="url(#wx-stroke)" stroke-width="2.4" stroke-linecap="round"/>
                ${tempLabels}
                ${pointDots}
                ${xLabels}
                <line class="wx-hover-line" x1="0" y1="${padTop - 8}" x2="0" y2="${h - padBottom}" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 4" opacity="0"/>
                <g class="wx-hover-dot" opacity="0"><circle r="4.5" fill="#fff"/><circle r="8" fill="none" stroke="rgba(255,255,255,.4)"/></g>
              </svg>
              <div class="wx-tip" id="wx-tip" hidden></div>
            </div>
            <div class="wx-hours">
              ${highlight
                .map(
                  (i) => `
                <div class="wx-hour">
                  <span>${i === 0 ? 'сейчас' : hours[i].slice(11, 16)}</span>
                  ${weatherIcon(hourCodes[i], true, 'wi--xs')}
                  <b>${temp(hourTemps[i])}</b>
                  <small>${hourPrecip[i]}%</small>
                </div>`,
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="panel wx-week">
          <div class="panel__head">
            <span class="panel__title">${icon('weather')} 7 дней</span>
            <span class="wx-week__tz mono">${data.timezone_abbreviation}</span>
          </div>
          <div class="panel__body">
            <ul class="wx-days">
              ${day.time
                .map((d, i) => {
                  const a = day.temperature_2m_min[i];
                  const b = day.temperature_2m_max[i];
                  const globalMin = Math.min(...day.temperature_2m_min);
                  const globalMax = Math.max(...day.temperature_2m_max);
                  const left = ((a - globalMin) / Math.max(1, globalMax - globalMin)) * 100;
                  const width = ((b - a) / Math.max(1, globalMax - globalMin)) * 100;
                  return `
                    <li class="wx-day ${i === 0 ? 'is-today' : ''}">
                      <span class="wx-day__name">${dayName(d, i)}<small>${dateLabel(d)}</small></span>
                      <span class="wx-day__icon">${weatherIcon(day.weather_code[i], true, 'wi--sm')}</span>
                      <span class="wx-day__precip">${day.precipitation_probability_max[i]}%</span>
                      <span class="wx-day__min">${temp(a)}</span>
                      <span class="wx-day__bar"><i style="left:${left}%;width:${Math.max(6, width)}%"></i></span>
                      <span class="wx-day__max">${temp(b)}</span>
                    </li>`;
                })
                .join('')}
            </ul>
          </div>
        </section>
      </div>

      <div class="wx-recents">
        <span class="section-label">недавние города</span>
        <div class="wx-recents__list">
          ${recentsStore
            .get()
            .map(
              (p) => `<button class="chip" type="button" data-place="${encodeURIComponent(JSON.stringify(p))}">
                ${countryBadge(p.country_code)} ${escapeHtml(p.name)}</button>`,
            )
            .join('')}
          <span class="wx-source">данные: <a href="${source === 'gismeteo' ? 'https://www.gismeteo.ru/' : 'https://open-meteo.com/'}" target="_blank" rel="noopener">${source === 'gismeteo' ? 'Gismeteo' : source === 'open-meteo' ? 'Open-Meteo' : 'демо'}</a></span>
        </div>
      </div>
    `;

    bindChart(hours, hourTemps, hourPrecip, hourCodes, points, w, h, padTop, padBottom, isNight);

    body.querySelectorAll<HTMLButtonElement>('[data-place]').forEach((button) => {
      button.addEventListener('click', () => {
        try {
          const p = JSON.parse(decodeURIComponent(button.dataset.place ?? '')) as Place;
          place = p;
          input.value = p.name;
          void load(p);
        } catch {
          /* ignore */
        }
      });
    });
  };

  const bindChart = (
    hours: string[],
    temps: number[],
    precip: number[],
    codes: number[],
    points: [number, number][],
    w: number,
    h: number,
    padTop: number,
    padBottom: number,
    isNight: boolean,
  ) => {
    const chart = $('#wx-chart', root);
    const svg = chart?.querySelector('svg');
    const line = chart?.querySelector<SVGLineElement>('.wx-hover-line');
    const dot = chart?.querySelector<SVGGElement>('.wx-hover-dot');
    const tip = $('#wx-tip', root);
    if (!chart || !svg || !line || !dot || !tip) return;

    const move = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const index = Math.round(ratio * (hours.length - 1));
      const [x, y] = points[index];
      line.setAttribute('x1', String(x));
      line.setAttribute('x2', String(x));
      line.setAttribute('opacity', '1');
      dot.setAttribute('transform', `translate(${x} ${y})`);
      dot.setAttribute('opacity', '1');
      tip.hidden = false;
      tip.innerHTML = `<b>${temp(temps[index])}</b><span>${hours[index].slice(11, 16)} · ${weatherLabel(codes[index])}</span><span>осадки ${precip[index]}%</span>`;
      const left = (x / w) * rect.width;
      tip.style.left = `${clamp(left, 46, rect.width - 46)}px`;
      tip.style.top = `${(y / h) * rect.height - 10}px`;
      void isNight;
    };

    const leave = () => {
      line.setAttribute('opacity', '0');
      dot.setAttribute('opacity', '0');
      tip.hidden = true;
    };

    chart.addEventListener('pointermove', move);
    chart.addEventListener('pointerleave', leave);
    // mobile: tap to inspect
    chart.addEventListener('pointerdown', move);
  };

  const renderSearchResults = (items: Place[], query: string) => {
    if (!results) return;
    if (!items.length) {
      results.hidden = false;
      results.innerHTML = `<div class="wx-results__empty">Ничего не найдено по «${escapeHtml(query)}»</div>`;
      return;
    }
    results.hidden = false;
    results.innerHTML = items
      .map(
        (p) => `
        <button class="wx-result" type="button" data-result="${encodeURIComponent(JSON.stringify(p))}">
          <span class="wx-result__flag">${countryBadge(p.country_code)}</span>
          <span class="wx-result__text"><b>${escapeHtml(p.name)}</b><small>${[p.admin1, p.country].filter(Boolean).join(', ')}</small></span>
          <span class="wx-result__coords mono">${p.latitude.toFixed(1)}, ${p.longitude.toFixed(1)}</span>
        </button>`,
      )
      .join('');

    results.querySelectorAll<HTMLButtonElement>('[data-result]').forEach((button) => {
      button.addEventListener('click', () => {
        const p = JSON.parse(decodeURIComponent(button.dataset.result ?? '')) as Place;
        place = p;
        input.value = p.name;
        results.hidden = true;
        void load(p);
      });
    });
  };

  const search = debounce(async (query: string) => {
    if (!results) return;
    if (query.trim().length < 2) {
      results.hidden = true;
      return;
    }
    results.hidden = false;
    results.innerHTML = `<div class="wx-results__loading">${icon('refresh')} ищем города…</div>`;
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=ru&format=json`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { results?: Place[] };
      renderSearchResults(json.results ?? [], query);
    } catch {
      const q = query.trim().toLowerCase();
      const local = FALLBACK_CITIES.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.country ?? '').toLowerCase().includes(q) || (c.admin1 ?? '').toLowerCase().includes(q),
      ).slice(0, 6);
      if (local.length) {
        renderSearchResults(local, query);
      } else {
        results.innerHTML = `<div class="wx-results__empty">Не удалось найти города. Проверьте сеть.</div>`;
      }
    }
  }, 320);

  input?.addEventListener('input', () => void search(input.value));
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      results!.hidden = true;
      input.blur();
    }
    if (event.key === 'Enter') {
      $<HTMLButtonElement>('.wx-result', results!)?.click();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    const target = event.target as Node;
    if (!root.querySelector('.wx-search')?.contains(target)) {
      if (results) results.hidden = true;
    }
  });

  const fetchOpenMeteo = async (p: Place, signal: AbortSignal): Promise<Forecast> => {
    const params = new URLSearchParams({
      latitude: p.latitude.toFixed(4),
      longitude: p.longitude.toFixed(4),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max',
      timezone: 'auto',
      forecast_days: '7',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
    if (!response.ok) throw new Error(`Open-Meteo вернул ${response.status}`);
    return (await response.json()) as Forecast;
  };

  const load = async (p: Place, opts: { silent?: boolean } = {}) => {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller?.abort();
    }, 7000);
    if (!opts.silent) renderSkeleton();
    const refresh = $('#wx-refresh', root);
    refresh?.classList.add('is-spinning');

    try {
      // Gismeteo is the primary source: its public feed sends CORS headers and is
      // reachable where Open-Meteo is not. Open-Meteo stays as a fallback.
      const providers: { id: WeatherSource; run: () => Promise<Forecast> }[] =
        gismeteoOk === false
          ? [
              { id: 'open-meteo', run: () => fetchOpenMeteo(p, signal) },
              { id: 'gismeteo', run: () => fetchGismeteoForecast(p, signal) },
            ]
          : [
              { id: 'gismeteo', run: () => fetchGismeteoForecast(p, signal) },
              { id: 'open-meteo', run: () => fetchOpenMeteo(p, signal) },
            ];

      let json: Forecast | null = null;
      let used: WeatherSource = 'gismeteo';
      let lastError: unknown = null;
      for (const provider of providers) {
        try {
          json = await provider.run();
          used = provider.id;
          if (provider.id === 'gismeteo') gismeteoOk = true;
          break;
        } catch (error) {
          lastError = error;
          if (signal.aborted) throw error;
          if (provider.id === 'gismeteo') gismeteoOk = false;
        }
      }
      if (!json) throw lastError ?? new Error('Нет источника погоды');

      data = json;
      place = p;
      source = used;
      demoMode = false;
      lastUpdated = Date.now();
      cache.set({ place: p, data: json, ts: lastUpdated, source: used });
      saveRecent(p);
      render();
      toast(`${p.name}: ${weatherLabel(json.current.weather_code).toLowerCase()}, ${temp(json.current.temperature_2m)}`, 'success');
    } catch (error) {
      if (disposed) return;
      if ((error as Error).name === 'AbortError' && !timedOut) return;
      if (!data) {
        data = demoForecast(p);
        place = p;
        source = 'demo';
        demoMode = true;
        lastUpdated = Date.now();
        saveRecent(p);
        render();
        toast('Gismeteo и Open-Meteo недоступны — включён демо-режим', 'error');
      } else {
        render();
        toast('Не удалось обновить — показаны последние данные', 'error');
      }
    } finally {
      window.clearTimeout(timeout);
      refresh?.classList.remove('is-spinning');
    }
  };

  root.querySelectorAll<HTMLButtonElement>('[data-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      unit = button.dataset.unit as 'c' | 'f';
      root.querySelectorAll('[data-unit]').forEach((b) => b.classList.toggle('is-active', b === button));
      if (data) render();
    });
  });

  $('#wx-refresh', root)?.addEventListener('click', () => void load(place));
  $('#wx-demo-retry', root)?.addEventListener('click', () => void load(place));

  $('#wx-geo', root)?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      toast('Геолокация недоступна в этом браузере', 'error');
      return;
    }
    const button = $('#wx-geo', root);
    button?.classList.add('is-spinning');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        button?.classList.remove('is-spinning');
        const p: Place = {
          name: 'Моё местоположение',
          country: 'геолокация',
          admin1: 'рядом с вами',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        place = p;
        input.value = '';
        void load(p);
      },
      () => {
        button?.classList.remove('is-spinning');
        toast('Не удалось получить геолокацию', 'error');
      },
      { timeout: 8000, maximumAge: 600000 },
    );
  });

  input.value = place.name === 'Моё местоположение' ? '' : place.name;

  if (data) {
    render();
    // refresh quietly in the background if the cache is older than 15 minutes
    if (Date.now() - lastUpdated > 15 * 60 * 1000) void load(place, { silent: true });
  } else {
    renderSkeleton();
    void load(place);
  }

  return () => {
    disposed = true;
    controller?.abort();
  };
}


