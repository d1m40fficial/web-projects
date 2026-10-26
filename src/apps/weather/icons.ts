export type WeatherGroup = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

export function weatherGroup(code: number): WeatherGroup {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
}

export function weatherLabel(code: number): string {
  const labels: Record<number, string> = {
    0: 'Ясно',
    1: 'Преимущественно ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Слабая морось',
    53: 'Морось',
    55: 'Сильная морось',
    56: 'Ледяная морось',
    57: 'Сильная ледяная морось',
    61: 'Небольшой дождь',
    63: 'Дождь',
    65: 'Сильный дождь',
    66: 'Ледяной дождь',
    67: 'Сильный ледяной дождь',
    71: 'Небольшой снег',
    73: 'Снег',
    75: 'Сильный снег',
    77: 'Снежные зёрна',
    80: 'Небольшой ливень',
    81: 'Ливень',
    82: 'Сильный ливень',
    85: 'Снегопад',
    86: 'Сильный снегопад',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  };
  return labels[code] ?? 'Облачно';
}

let iconSeq = 0;

export function weatherIcon(code: number, isDay = true, extraClass = ''): string {
  const group = weatherGroup(code);
  const uid = ++iconSeq;
  const sun =
    group === 'clear' || group === 'partly'
      ? isDay
        ? `<g class="wi__sun"><circle cx="25" cy="24" r="8" fill="url(#wi-sun-${uid})"/>${Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 25 + Math.cos(a) * 12;
            const y1 = 24 + Math.sin(a) * 12;
            const x2 = 25 + Math.cos(a) * 16;
            const y2 = 24 + Math.sin(a) * 16;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ffcb5c" stroke-width="2.2" stroke-linecap="round"/>`;
          }).join('')}</g>`
        : `<g class="wi__moon"><path d="M34 14a11 11 0 1 0 8 18 9 9 0 0 1-8-18Z" fill="#dfe6ff"/><circle cx="18" cy="17" r="1.2" fill="#fff" opacity=".7"/><circle cx="14" cy="26" r=".9" fill="#fff" opacity=".5"/></g>`
      : '';

  const cloud =
    group === 'clear'
      ? ''
      : `<path class="wi__cloud" d="M19 44h27a8 8 0 0 0 .8-16 11.5 11.5 0 0 0-22-2.6A9 9 0 0 0 19 44Z" fill="url(#wi-cloud-${uid})" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`;

  const rain =
    group === 'rain' || group === 'drizzle'
      ? `<g class="wi__rain" stroke="#38e0f2" stroke-width="2" stroke-linecap="round">
          ${[
            [24, 48, 21, 53],
            [32, 50, 29, 55],
            [40, 48, 37, 53],
            [28, 54, 25, 59],
            [36, 56, 33, 61],
          ]
            .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`)
            .join('')}
        </g>`
      : '';

  const snow =
    group === 'snow'
      ? `<g class="wi__snow" fill="#dff3ff">
          ${[
            [24, 51],
            [34, 54],
            [42, 50],
            [29, 59],
            [39, 60],
          ]
            .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.8"/>`)
            .join('')}
        </g>`
      : '';

  const bolt =
    group === 'storm'
      ? `<path class="wi__bolt" d="M33 46l-5 9h5l-2 7 9-11h-5l3-5Z" fill="#ffcb5c"/>`
      : '';

  const fog =
    group === 'fog'
      ? `<g class="wi__fog" stroke="rgba(220,230,255,.7)" stroke-width="2.2" stroke-linecap="round">
          <line x1="18" y1="50" x2="46" y2="50"/><line x1="22" y1="56" x2="42" y2="56"/><line x1="16" y1="44" x2="40" y2="44"/>
        </g>`
      : '';

  return `
    <span class="wi ${extraClass}" data-group="${group}" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <defs>
          <radialGradient id="wi-sun-${uid}" cx="35%" cy="30%" r="70%">
            <stop offset="0" stop-color="#fff6d8"/><stop offset=".55" stop-color="#ffcb5c"/><stop offset="1" stop-color="#ff9d4d"/>
          </radialGradient>
          <linearGradient id="wi-cloud-${uid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f4f7ff"/><stop offset="1" stop-color="#b9c6e6"/>
          </linearGradient>
        </defs>
        ${sun}
        ${cloud}
        ${rain}${snow}${bolt}${fog}
      </svg>
    </span>`;
}

