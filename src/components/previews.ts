/** Tiny, hand-built previews shown on the project cards. */


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
