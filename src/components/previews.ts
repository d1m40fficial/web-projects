/** Tiny, hand-built previews shown on the project cards. */

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function qrSvg(): string {
  const n = 21;
  const rnd = mulberry32(42);
  const cells: string[] = [];
  const finder = (x: number, y: number) => {
    cells.push(`<rect x="${x}" y="${y}" width="7" height="7" fill="none" stroke="#0a0a12" stroke-width="1"/>`);
    cells.push(`<rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="none" stroke="#0a0a12" stroke-width="1.4"/>`);
    cells.push(`<rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0a0a12"/>`);
  };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (inFinder) continue;
      if (x === 6 || y === 6) {
        if (rnd() > 0.25) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#0a0a12"/>`);
        continue;
      }
      if (rnd() > 0.52) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#0a0a12"/>`);
    }
  }
  finder(0, 0);
  finder(14, 0);
  finder(0, 14);
  return `<svg viewBox="-1 -1 23 23" width="100%" height="100%" shape-rendering="crispEdges">${cells.join('')}</svg>`;
}

const stars = [
  [12, 20], [26, 12], [38, 26], [54, 16], [68, 24], [82, 12], [20, 46], [34, 58], [50, 44],
  [64, 54], [78, 42], [88, 62], [14, 74], [30, 84], [46, 70], [62, 86], [76, 74], [90, 84],
];

export function previewMarkup(slug: string): string {
  switch (slug) {
    case 'password':
      return `
        <div class="pv pv--pass">
          <div class="pv__label">сгенерировано сейчас</div>
          <div class="pv-pass__value">N7$vK<span class="pv-pass__accent">!mQ2</span>#Lx<span class="pv-caret"></span></div>
          <div class="pv-pass__bar"><i></i><i></i><i></i><i></i></div>
          <div class="pv__row"><span>энтропия</span><b>131 бит</b></div>
        </div>`;

    case 'qr':
      return `
        <div class="pv pv--qr">
          <div class="pv-qr__code">${qrSvg()}</div>
          <div class="pv-qr__meta">
            <span class="pv-dot"></span>
            <span>d1m40fficial.github.io</span>
          </div>
        </div>`;

    case 'weather':
      return `
        <div class="pv pv--weather">
          <div class="pv-weather__art">
            <div class="pv-sun"></div>
            <div class="pv-cloud"></div>
          </div>
          <div class="pv-weather__temp">18<span>°</span></div>
          <div class="pv-weather__city">Москва · ясно</div>
          <div class="pv-weather__days">
            <span><i>пт</i><b>21°</b></span><span><i>сб</i><b>19°</b></span><span><i>вс</i><b>24°</b></span>
          </div>
        </div>`;

    case 'sky':
      return `
        <div class="pv pv--sky">
          <svg class="pv-sky__const" viewBox="0 0 120 80" aria-hidden="true">
            <polyline points="20,26 34,18 48,28 42,44 26,42" fill="none" stroke="rgba(139,107,255,.55)" stroke-width=".8"/>
            <polyline points="62,52 74,42 88,50 84,62 70,64" fill="none" stroke="rgba(56,224,242,.4)" stroke-width=".8"/>
            <circle cx="20" cy="26" r="1.4" fill="#fff"/><circle cx="34" cy="18" r="2" fill="#cfe4ff"/>
            <circle cx="48" cy="28" r="1.2" fill="#fff"/><circle cx="42" cy="44" r="1.6" fill="#ffe9c9"/>
            <circle cx="26" cy="42" r="1" fill="#fff"/><circle cx="62" cy="52" r="1.3" fill="#fff"/>
            <circle cx="74" cy="42" r="1.8" fill="#d8ecff"/><circle cx="88" cy="50" r="1.1" fill="#fff"/>
            <circle cx="84" cy="62" r="1.5" fill="#ffd9e8"/><circle cx="70" cy="64" r="1" fill="#fff"/>
          </svg>
          ${stars.map(([x, y], i) => `<span class="pv-star" style="left:${x}%;top:${y}%;animation-delay:${(i * 0.23).toFixed(2)}s;opacity:${0.35 + (i % 5) * 0.12}"></span>`).join('')}
          <div class="pv-sky__moon"></div>
          <div class="pv-sky__hud"><span>Alt 42°</span><span>Az 128°</span><span>LST 21:04</span></div>
        </div>`;

    case 'notes':
      return `
        <div class="pv pv--notes">
          <div class="pv-note__head"><span>идеи для лаборатории</span><span>•</span></div>
          <div class="pv-note__line pv-note__line--title"></div>
          <div class="pv-note__line" style="width:88%"></div>
          <div class="pv-note__line" style="width:72%"></div>
          <div class="pv-note__line" style="width:94%"></div>
          <div class="pv-note__tags"><i>#pet</i><i>#frontend</i></div>
        </div>`;

    case '2048':
      return `
        <div class="pv pv--g2048">
          <div class="pv-2048__head"><span>2048</span><b>1 024</b></div>
          <div class="pv-2048__grid">
            ${[2, 0, 4, 0, 8, 16, 0, 4, 0, 32, 8, 2, 0, 4, 64, 128]
              .map((v) => `<span class="pv-2048__cell ${v ? `v${v}` : ''}">${v || ''}</span>`)
              .join('')}
          </div>
        </div>`;

    case 'memory':
      return `
        <div class="pv pv--memory">
          <div class="pv-mem__head"><span>ходы <b>12</b></span><span>01:42</span></div>
          <div class="pv-mem__grid">
            <div class="pv-mem__card is-open">🚀</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card is-match">🌙</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card is-open">🌙</div>
          </div>
        </div>`;

    case 'tracks':
      return `
        <div class="pv pv--tracks">
          <svg viewBox="0 0 220 90" aria-hidden="true">
            <defs><linearGradient id="pv-track" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/></linearGradient></defs>
            <path d="M8 70 C 34 64, 28 40, 52 38 S 84 58, 104 48 S 128 18, 154 26 S 190 44, 212 18" fill="none" stroke="url(#pv-track)" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M8 70 C 34 64, 28 40, 52 38 S 84 58, 104 48 S 128 18, 154 26 S 190 44, 212 18" fill="none" stroke="url(#pv-track)" stroke-width="7" stroke-linecap="round" opacity=".12"/>
            <circle cx="154" cy="26" r="4" fill="#fff"/><circle cx="154" cy="26" r="8" fill="none" stroke="#c4f56a" stroke-width="1" opacity=".5"/>
            <path d="M8 82 L 40 78 L 70 80 L 100 72 L 130 76 L 160 66 L 190 70 L 212 62 L 212 90 L 8 90 Z" fill="rgba(56,224,242,.12)"/>
          </svg>
          <div class="pv-tracks__stats"><span>12.4 км</span><span>+640 м</span><span>1:58</span></div>
        </div>`;

    case 'palette':
      return `
        <div class="pv pv--palette">
          ${['#0b0b12', '#8b6bff', '#38e0f2', '#c4f56a', '#ffcb5c']
            .map((c, i) => `<div class="pv-pal__swatch" style="background:${c}"><span style="color:${i === 0 ? '#fff' : '#0b0b12'}">${c}</span></div>`)
            .join('')}
        </div>`;

    case 'ratings':
      return `
        <div class="pv pv--ratings">
          <div class="pv-ratings__head"><span>топ жанров</span><b>8.4</b></div>
          <div class="pv-ratings__bars">
            ${[
              [72, '#ffcb5c'],
              [54, '#6ee7a8'],
              [88, '#38e0f2'],
              [40, '#8b6bff'],
              [66, '#ff6aa8'],
              [30, '#c4f56a'],
            ]
              .map(([h, c]) => `<i style="height:${h}%;background:${c}"></i>`)
              .join('')}
          </div>
          <div class="pv-ratings__axis"><span>драма</span><span>фантастика</span><span>док</span></div>
        </div>`;

    case 'motion':
      return `
        <div class="pv pv--motion">
          <div class="pv-motion__orb"></div>
          <div class="pv-motion__ring"></div>
          <div class="pv-motion__chips">
            <span>scale</span><span>blur</span><span>ease</span>
          </div>
          <div class="pv-motion__cursor">↖</div>
        </div>`;

    case 'archive':
      return `
        <div class="pv pv--archive">
          <div class="pv-arch__win pv-arch__win--back"><span>🕹️</span></div>
          <div class="pv-arch__win pv-arch__win--mid"><span>🐍</span></div>
          <div class="pv-arch__win pv-arch__win--front">
            <div class="pv-arch__bar"><i></i><i></i><i></i><em>raft.html</em></div>
            <div class="pv-arch__body"><span>🪵</span><b>Raft Survival</b><small>canvas · 1280×720</small></div>
          </div>
        </div>`;

    default:
      return `<div class="pv"><div class="pv__label">web/lab</div></div>`;
  }
}
