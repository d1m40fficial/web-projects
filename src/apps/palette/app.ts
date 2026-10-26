import { $, clamp, contrastRatio, copyText, hexToRgb, hslToHex, rand, randInt } from '../../core/dom';
import { icon } from '../../core/icons';
import { openModal } from '../../core/modal';
import { toast } from '../../core/toast';

type Mode = 'analogous' | 'complementary' | 'triadic' | 'monochrome' | 'random';

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: 'analogous', label: 'Аналог', hint: 'соседние оттенки' },
  { id: 'complementary', label: 'Комплемент', hint: 'противоположные' },
  { id: 'triadic', label: 'Триада', hint: 'через 120°' },
  { id: 'monochrome', label: 'Моно', hint: 'один тон' },
  { id: 'random', label: 'Рандом', hint: 'свободная схема' },
];

interface SavedPalette {
  colors: string[];
  mode: Mode;
}

const HISTORY_KEY = 'wl.palettes.v1';

const hueOf = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};

const textOn = (hex: string): string => (contrastRatio(hex, '#ffffff') >= 4.5 ? '#ffffff' : '#0b0b12');

const shade = (hex: string, amount: number): string => {
  const [r, g, b] = hexToRgb(hex);
  const mix = (v: number) => Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount));
  return `#${[mix(r), mix(g), mix(b)].map((v) => clamp(v, 0, 255).toString(16).padStart(2, '0')).join('')}`;
};

export function mount(root: HTMLElement): () => void {
  let mode: Mode = 'analogous';
  let baseHue = randInt(220, 300);
  let colors: string[] = [];
  let locks: boolean[] = [false, false, false, false, false];
  let history: SavedPalette[] = [];
  let applied = false;

  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) history = JSON.parse(raw) as SavedPalette[];
  } catch {
    history = [];
  }

  root.innerHTML = `
    <div class="pal">
      <div class="pal__bar">
        <div class="pal__modes" role="group" aria-label="Схема гармонии">
          ${MODES.map(
            (m) =>
              `<button type="button" data-mode="${m.id}" class="${m.id === mode ? 'is-active' : ''}" title="${m.hint}">${m.label}</button>`,
          ).join('')}
        </div>
        <label class="pal__base" title="Базовый цвет">
          <input type="color" id="pal-base" value="${hslToHex(baseHue, 70, 55)}" aria-label="Базовый цвет" />
          <span>база</span>
        </label>
        <div class="pal__bar-actions">
          <button class="btn btn--sm btn--primary" type="button" id="pal-generate">${icon('refresh')} Сгенерировать</button>
          <span class="pal__space kbd-hint"><kbd>Space</kbd></span>
          <button class="btn btn--sm btn--ghost" type="button" id="pal-export">${icon('code')} Экспорт</button>
        </div>
      </div>

      <div class="pal__swatches" id="pal-swatches"></div>

      <div class="pal__toolbar">
        <button class="btn btn--sm" type="button" id="pal-apply">${icon('palette')} Примерить на сайт</button>
        <span class="pal__apply-note" id="pal-apply-note" hidden>
          палитра применена к интерфейсу
          <button type="button" id="pal-reset">сбросить</button>
        </span>
        <span class="pal__hint">клик по цвету — копировать · замок сохраняет оттенок</span>
      </div>

      <div class="pal__grid">
        <div class="panel pal__contrast">
          <div class="panel__head">
            <span class="panel__title">${icon('eye')} контраст WCAG</span>
            <span class="pal__contrast-legend">AA 4.5 · AAA 7</span>
          </div>
          <div class="panel__body">
            <div class="pal__table" id="pal-table"></div>
          </div>
        </div>

        <div class="panel pal__history">
          <div class="panel__head">
            <span class="panel__title">${icon('clock')} история</span>
            <button class="pw-clear" type="button" id="pal-clear">очистить</button>
          </div>
          <div class="panel__body">
            <div class="pal__history-list" id="pal-history"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const swatchesNode = $('#pal-swatches', root);
  const tableNode = $('#pal-table', root);
  const historyNode = $('#pal-history', root);
  const baseInput = $<HTMLInputElement>('#pal-base', root);

  const randomPalette = (): string[] => {
    const offsets: Record<Mode, number[]> = {
      analogous: [-36, -18, 0, 18, 36],
      complementary: [0, 0, 180, 180, 0],
      triadic: [0, 120, 240, 120, 240],
      monochrome: [0, 0, 0, 0, 0],
      random: [0, 0, 0, 0, 0],
    };
    const lights: Record<Mode, number[]> = {
      analogous: [20, 34, 50, 68, 84],
      complementary: [16, 32, 52, 72, 88],
      triadic: [18, 34, 54, 72, 88],
      monochrome: [10, 26, 46, 68, 90],
      random: [22, 38, 55, 72, 86],
    };
    const baseSat = rand(58, 82);
    const out: string[] = [];
    const start = baseHue;

    for (let i = 0; i < 5; i++) {
      if (locks[i] && colors[i]) {
        out.push(colors[i]);
        continue;
      }
      let hue = start + (offsets[mode][i] ?? 0) + rand(-7, 7);
      if (mode === 'random') hue = rand(0, 360);
      hue = ((hue % 360) + 360) % 360;
      const sat = clamp(baseSat + rand(-14, 10), 32, 94);
      const light = clamp(lights[mode][i] + rand(-4, 4), 8, 94);
      out.push(hslToHex(hue, sat, light));
    }
    return out;
  };

  const saveHistory = () => {
    const entry: SavedPalette = { colors: [...colors], mode };
    const last = history[0];
    if (last && last.colors.join() === entry.colors.join()) return;
    history = [entry, ...history].slice(0, 8);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      /* ignore */
    }
  };

  const renderSwatches = () => {
    if (!swatchesNode) return;
    swatchesNode.innerHTML = colors
      .map((color, i) => {
        const [r, g, b] = hexToRgb(color);
        const light = textOn(color);
        const onWhite = contrastRatio(color, '#ffffff');
        const onBlack = contrastRatio(color, '#0b0b12');
        return `
          <div class="pal__swatch" style="background:${color};color:${light}" data-color="${color}" data-index="${i}" role="group" aria-label="Цвет ${color}">
            <div class="pal__swatch-top">
              <span class="pal__num">${String(i + 1).padStart(2, '0')}</span>
              <span class="pal__swatch-actions">
                <button class="pal__icon ${locks[i] ? 'is-locked' : ''}" type="button" data-lock="${i}" aria-pressed="${locks[i]}" title="${locks[i] ? 'Разблокировать' : 'Заблокировать'}">${icon('lock')}</button>
                <button class="pal__icon" type="button" data-copy="${color}" title="Скопировать">${icon('copy')}</button>
              </span>
            </div>
            <div class="pal__swatch-text" style="color:${light}">
              <b>${color.toUpperCase()}</b>
              <span>rgb(${r}, ${g}, ${b})</span>
              <span class="pal__ratio">${onWhite >= onBlack ? `на белом ${onWhite.toFixed(1)}` : `на тёмном ${onBlack.toFixed(1)}`}</span>
            </div>
          </div>`;
      })
      .join('');
  };

  const renderTable = () => {
    if (!tableNode) return;
    tableNode.innerHTML = colors
      .map((color) => {
        const white = contrastRatio(color, '#ffffff');
        const black = contrastRatio(color, '#0b0b12');
        const badge = (value: number) =>
          value >= 7 ? `<span class="pill pill--ok">AAA ${value.toFixed(1)}</span>` : value >= 4.5 ? `<span class="pill pill--warn">AA ${value.toFixed(1)}</span>` : `<span class="pill pill--bad">${value.toFixed(1)}</span>`;
        return `
          <div class="pal__row">
            <span class="pal__dot" style="background:${color}"></span>
            <code>${color.toUpperCase()}</code>
            <span class="pal__row-label">белый</span>${badge(white)}
            <span class="pal__row-label">тёмный</span>${badge(black)}
          </div>`;
      })
      .join('');
  };

  const renderHistory = () => {
    if (!historyNode) return;
    historyNode.innerHTML = history.length
      ? history
          .map(
            (entry, i) => `
            <button class="pal__history-item" type="button" data-history="${i}" title="${entry.mode}">
              <span class="pal__history-colors">${entry.colors.map((c) => `<i style="background:${c}"></i>`).join('')}</span>
              <small>${MODES.find((m) => m.id === entry.mode)?.label ?? entry.mode}</small>
            </button>`,
          )
          .join('')
      : `<p class="help">Палитры, которые вы сгенерируете, появятся здесь.</p>`;
  };

  const renderAll = () => {
    renderSwatches();
    renderTable();
    renderHistory();
    baseInput.value = colors[2] ?? hslToHex(baseHue, 70, 55);
  };

  const generate = (remember = true) => {
    if (locks.every(Boolean) && colors.length) {
      toast('Все цвета заблокированы — снимите замок', 'error');
      return;
    }
    colors = randomPalette();
    if (!locks.some(Boolean)) {
      baseHue = hueOf(colors[2]);
    }
    renderAll();
    if (remember) saveHistory();
  };

  const applyPalette = () => {
    if (!colors.length) return;
    applied = true;
    const style = document.documentElement.style;
    style.setProperty('--violet', colors[0]);
    style.setProperty('--cyan', colors[1]);
    style.setProperty('--lime', colors[3]);
    style.setProperty('--amber', colors[4]);
    style.setProperty('--grad', `linear-gradient(105deg, ${colors[0]}, ${colors[1]} 45%, ${colors[3]})`);
    $('#pal-apply-note', root)!.hidden = false;
    toast('Палитра применена к интерфейсу', 'success');
  };

  const resetPalette = () => {
    applied = false;
    const style = document.documentElement.style;
    ['--violet', '--cyan', '--lime', '--amber', '--grad'].forEach((name) => style.removeProperty(name));
    $('#pal-apply-note', root)!.hidden = true;
    toast('Вернули стандартные акценты', 'info');
  };

  const exportModal = () => {
    const css = `:root {\n${colors.map((c, i) => `  --palette-${i + 1}: ${c};`).join('\n')}\n  --gradient: linear-gradient(105deg, ${colors[0]}, ${colors[2]}, ${colors[4]});\n}`;
    const json = JSON.stringify(
      {
        mode,
        colors,
        contrast: colors.map((c) => ({ color: c, onWhite: Number(contrastRatio(c, '#ffffff').toFixed(2)), onBlack: Number(contrastRatio(c, '#0b0b12').toFixed(2)) })),
      },
      null,
      2,
    );
    const tailwind = `colors: {\n${colors.map((c, i) => `  palette${i + 1}: '${c}',`).join('\n')}\n}`;

    const modal = openModal({
      title: 'Экспорт палитры',
      subtitle: MODES.find((m) => m.id === mode)?.label,
      body: `
        <div class="pal__export">
          ${[
            ['CSS variables', css],
            ['JSON', json],
            ['Tailwind', tailwind],
          ]
            .map(
              ([label, code]) => `
              <section class="pal__export-block">
                <div class="pal__export-head"><span>${label}</span><button class="btn btn--sm btn--ghost" type="button" data-copy-code>${icon('copy')} копировать</button></div>
                <pre><code>${code.replace(/</g, '&lt;')}</code></pre>
              </section>`,
            )
            .join('')}
        </div>`,
      footer: `<button class="btn btn--sm" type="button" data-close>Закрыть</button>`,
    });

    modal.body.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach((button, index) => {
      button.addEventListener('click', async () => {
        const code = [css, json, tailwind][index];
        const ok = await copyText(code);
        toast(ok ? 'Скопировано' : 'Не удалось скопировать', ok ? 'success' : 'error');
      });
    });
    modal.root.querySelector('[data-close]')?.addEventListener('click', () => modal.close());
  };

  swatchesNode?.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const lock = target.closest<HTMLButtonElement>('[data-lock]');
    if (lock) {
      const index = Number(lock.dataset.lock);
      locks[index] = !locks[index];
      renderSwatches();
      return;
    }
    const copy = target.closest<HTMLButtonElement>('[data-copy]');
    if (copy) {
      const ok = await copyText(copy.dataset.copy ?? '');
      toast(ok ? `${copy.dataset.copy} скопирован` : 'Не удалось скопировать', ok ? 'success' : 'error');
      return;
    }
    const swatch = target.closest<HTMLElement>('[data-color]');
    if (swatch) {
      const ok = await copyText(swatch.dataset.color ?? '');
      toast(ok ? `${swatch.dataset.color} скопирован` : 'Не удалось скопировать', ok ? 'success' : 'error');
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.mode as Mode;
      root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('is-active', b === button));
      generate();
    });
  });

  baseInput?.addEventListener('input', () => {
    baseHue = hueOf(baseInput.value);
    generate(false);
  });

  $('#pal-generate', root)?.addEventListener('click', () => generate());
  $('#pal-export', root)?.addEventListener('click', exportModal);
  $('#pal-apply', root)?.addEventListener('click', applyPalette);
  $('#pal-reset', root)?.addEventListener('click', resetPalette);

  $('#pal-clear', root)?.addEventListener('click', () => {
    history = [];
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
    renderHistory();
    toast('История очищена', 'success');
  });

  historyNode?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-history]');
    if (!button) return;
    const entry = history[Number(button.dataset.history)];
    if (!entry) return;
    colors = entry.colors;
    mode = entry.mode;
    root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('is-active', (b as HTMLElement).dataset.mode === mode));
    renderAll();
    toast('Палитра восстановлена', 'success');
  });

  const spaceHandler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (event.code !== 'Space' || target.matches('input, textarea, select, button, [contenteditable="true"]')) return;
    event.preventDefault();
    generate();
  };
  window.addEventListener('keydown', spaceHandler);

  colors = randomPalette();
  saveHistory();
  renderAll();

  return () => {
    window.removeEventListener('keydown', spaceHandler);
    if (applied) resetPalette();
    void shade;
  };
}

