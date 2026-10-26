import { $, copyText, debounce, store } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/~',
};

const AMBIGUOUS = new Set('il1Lo0O`|"\'{}[]()/\\');

const WORDS = `amber anchor atlas aurora autumn basil beach birch bloom breeze bridge
canyon cedar cherry cloud cobalt comet coral cosmos creek crystal dawn delta desert
dune echo ember falcon fern fjord flame forest frost galaxy garden glacier glow
granite grove harbor hazel horizon island ivory jade jasmine jungle juniper karma
lagoon lantern lava lemon lilac linen lunar maple marble meadow meteor mint mist
moon moss mountain nectar night north nova oak ocean olive onyx opal orbit orchid
pearl pepper pine planet plum polar pond prairie prism quartz quiet rain raven
reef river robin rocket root rose ruby sage sand sapphire sea shadow shell silver
sky snow solar spark spruce star stone storm stream summit sun swift tide tiger
topaz trail tulip tundra twilight valley velvet violet wave willow wind winter
wolf zen zephyr zenith zinnia`.split(/\s+/);

const HISTORY_KEY = 'wl.passwords.v1';

interface HistoryItem {
  value: string;
  entropy: number;
  mode: 'random' | 'passphrase';
  ts: number;
}

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function entropyOf(length: number, alphabet: number): number {
  if (length <= 0 || alphabet <= 0) return 0;
  return Math.round(length * Math.log2(alphabet));
}

function crackTime(bits: number): string {
  if (bits <= 0) return 'мгновенно';
  const seconds = 2 ** bits / 1e12; // 1 trillion guesses / second
  if (seconds < 1) return 'мгновенно';
  if (seconds < 60) return `${Math.round(seconds)} сек`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} мин`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} ч`;
  if (seconds < 31557600) return `${Math.round(seconds / 86400)} дн`;
  const years = seconds / 31557600;
  if (years < 1000) return `${Math.round(years)} лет`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)} тыс. лет`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} млн лет`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)} млрд лет`;
  return 'дольше Вселенной';
}

interface State {
  mode: 'random' | 'passphrase';
  length: number;
  opts: Record<keyof typeof SETS, boolean>;
  excludeAmbiguous: boolean;
  words: number;
  separator: string;
  capitalize: boolean;
  addNumber: boolean;
}

export function mount(root: HTMLElement): () => void {
  const saved = store<Partial<State>>('wl.passwords.opts', {});
  const state: State = {
    mode: 'random',
    length: 20,
    excludeAmbiguous: false,
    words: 4,
    separator: '-',
    capitalize: true,
    addNumber: true,
    ...saved.get(),
    opts: { lower: true, upper: true, digits: true, symbols: true, ...(saved.get().opts ?? {}) },
  };
  const history = store<HistoryItem[]>(HISTORY_KEY, []);

  root.innerHTML = `
    <div class="pw">
      <section class="pw-output panel">
        <div class="pw-output__top">
          <span class="panel__title">${icon('key')} ваш пароль</span>
          <span class="pw-output__mode">${state.mode === 'random' ? 'случайный' : 'passphrase'}</span>
        </div>
        <output class="pw-output__value" id="pw-value" aria-live="polite"></output>
        <div class="pw-output__actions">
          <button class="btn btn--sm btn--ghost" type="button" id="pw-copy">${icon('copy')} Копировать</button>
          <button class="btn btn--sm btn--primary" type="button" id="pw-regen">${icon('refresh')} Заново</button>
        </div>
        <div class="pw-meter">
          <div class="pw-meter__head">
            <span id="pw-strength-label">—</span>
            <span class="mono" id="pw-entropy">0 бит</span>
          </div>
          <div class="pw-meter__bar"><span id="pw-meter-fill"></span></div>
          <div class="pw-meter__stats">
            <span title="Оценка при 10¹² попытках в секунду">взлом: <b id="pw-crack">—</b></span>
            <span id="pw-alphabet">—</span>
          </div>
        </div>
      </section>

      <div class="pw-grid">
        <section class="panel pw-settings">
          <div class="panel__head">
            <span class="panel__title">${icon('filter')} настройки</span>
            <div class="segmented pw-mode" role="group" aria-label="Режим">
              <button type="button" data-mode="random" class="${state.mode === 'random' ? 'is-active' : ''}">Пароль</button>
              <button type="button" data-mode="passphrase" class="${state.mode === 'passphrase' ? 'is-active' : ''}">Passphrase</button>
            </div>
          </div>
          <div class="panel__body" id="pw-controls"></div>
        </section>

        <section class="panel pw-history">
          <div class="panel__head">
            <span class="panel__title">${icon('clock')} история</span>
            <button class="pw-clear" type="button" id="pw-clear">очистить</button>
          </div>
          <div class="panel__body">
            <ul class="pw-history__list" id="pw-history"></ul>
            <p class="help" style="margin-top:12px">${icon('lock')} Хранится только в localStorage этого браузера. Не используйте как менеджер паролей.</p>
          </div>
        </section>
      </div>
    </div>
  `;

  const controls = $('#pw-controls', root);
  const valueNode = $('#pw-value', root);
  const historyNode = $('#pw-history', root);

  const renderControls = () => {
    const isRandom = state.mode === 'random';
    controls.innerHTML = isRandom
      ? `
        <div class="range-row" style="margin-bottom:22px">
          <div class="range-row__head">
            <label for="pw-length">Длина пароля</label>
            <span class="range-row__value" id="pw-length-val">${state.length}</span>
          </div>
          <input class="range" id="pw-length" type="range" min="6" max="64" step="1" value="${state.length}" />
          <div class="pw-scale"><span>6</span><span>32</span><span>64</span></div>
        </div>

        <div class="section-label">Символы</div>
        <div class="pw-toggles">
          ${[
            ['lower', 'Строчные', 'a–z', SETS.lower.length],
            ['upper', 'Прописные', 'A–Z', SETS.upper.length],
            ['digits', 'Цифры', '0–9', SETS.digits.length],
            ['symbols', 'Символы', '!@#$', SETS.symbols.length],
          ]
            .map(
              ([key, label, sample, count]) => `
              <label class="switch pw-toggle">
                <input type="checkbox" data-opt="${key}" ${state.opts[key as keyof typeof SETS] ? 'checked' : ''} />
                <span class="switch__track"></span>
                <span class="switch__label">${label}</span>
                <span class="pw-toggle__sample mono">${sample}</span>
              </label>`,
            )
            .join('')}
        </div>

        <label class="switch pw-toggle" style="margin-top:14px">
          <input type="checkbox" id="pw-ambiguous" ${state.excludeAmbiguous ? 'checked' : ''} />
          <span class="switch__track"></span>
          <span class="switch__label">Исключить похожие символы</span>
          <span class="pw-toggle__sample mono">1lI0O</span>
        </label>

        <div class="pw-tip">
          ${icon('lightbulb')}
          <p>Для важных аккаунтов — от 20 символов и passphrase из 5–6 слов. Длина важнее «сложности».</p>
        </div>
      `
      : `
        <div class="range-row" style="margin-bottom:22px">
          <div class="range-row__head">
            <label for="pw-words">Количество слов</label>
            <span class="range-row__value" id="pw-words-val">${state.words}</span>
          </div>
          <input class="range" id="pw-words" type="range" min="3" max="8" step="1" value="${state.words}" />
          <div class="pw-scale"><span>3</span><span>5</span><span>8</span></div>
        </div>

        <div class="field">
          <span class="field__label">Разделитель</span>
          <div class="pw-seps" role="group" aria-label="Разделитель">
            ${[
              ['-', 'дефис'],
              ['.', 'точка'],
              ['_', 'нижнее'],
              [' ', 'пробел'],
            ]
              .map(
                ([sep, label]) =>
                  `<button type="button" class="pw-sep ${state.separator === sep ? 'is-active' : ''}" data-sep="${sep}" title="${label}">
                    <span class="mono">${sep === ' ' ? '␣' : sep}</span><small>${label}</small>
                  </button>`,
              )
              .join('')}
          </div>
        </div>

        <div class="pw-toggles" style="margin-top:20px">
          <label class="switch pw-toggle">
            <input type="checkbox" id="pw-cap" ${state.capitalize ? 'checked' : ''} />
            <span class="switch__track"></span>
            <span class="switch__label">С заглавной буквы</span>
          </label>
          <label class="switch pw-toggle">
            <input type="checkbox" id="pw-num" ${state.addNumber ? 'checked' : ''} />
            <span class="switch__track"></span>
            <span class="switch__label">Добавить число</span>
          </label>
        </div>

        <div class="pw-tip">
          ${icon('lightbulb')}
          <p>Словарь — ${WORDS.length} слов. Энтропия считается как log₂(${WORDS.length}^слов).</p>
        </div>
      `;

    bindControls();
  };

  const buildAlphabet = (): string => {
    let alphabet = '';
    (Object.keys(SETS) as (keyof typeof SETS)[]).forEach((key) => {
      if (!state.opts[key]) return;
      let set = SETS[key];
      if (state.excludeAmbiguous) set = [...set].filter((ch) => !AMBIGUOUS.has(ch)).join('');
      alphabet += set;
    });
    return alphabet;
  };

  const generateRandom = (): string => {
    let alphabet = buildAlphabet();
    if (!alphabet) {
      state.opts.lower = true;
      alphabet = SETS.lower;
    }
    const len = Math.max(state.length, Object.values(state.opts).filter(Boolean).length);
    const chars: string[] = [];

    // guarantee one char from every selected set, then fill freely
    (Object.keys(SETS) as (keyof typeof SETS)[]).forEach((key) => {
      if (!state.opts[key]) return;
      let set = SETS[key];
      if (state.excludeAmbiguous) set = [...set].filter((ch) => !AMBIGUOUS.has(ch)).join('');
      if (set) chars.push(set[randomInt(set.length)]);
    });

    while (chars.length < len) chars.push(alphabet[randomInt(alphabet.length)]);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.slice(0, len).join('');
  };

  const generatePassphrase = (): string => {
    const picked: string[] = [];
    const used = new Set<number>();
    while (picked.length < state.words) {
      const idx = randomInt(WORDS.length);
      if (used.has(idx)) continue;
      used.add(idx);
      const word = WORDS[idx];
      picked.push(state.capitalize ? word[0].toUpperCase() + word.slice(1) : word);
    }
    if (state.addNumber) picked[picked.length - 1] += String(randomInt(90) + 10);
    return picked.join(state.separator);
  };

  let current = '';

  const renderValue = (value: string, animate = true) => {
    current = value;
    const markup = [...value]
      .map((ch) => {
        if (/\d/.test(ch)) return `<span class="pw-ch pw-ch--num">${ch === ' ' ? '&nbsp;' : ch}</span>`;
        if (/[A-ZА-Я]/.test(ch)) return `<span class="pw-ch pw-ch--upper">${ch}</span>`;
        if (/[^a-zа-яё0-9]/i.test(ch)) return `<span class="pw-ch pw-ch--sym">${ch === ' ' ? '&nbsp;' : ch}</span>`;
        return `<span class="pw-ch">${ch}</span>`;
      })
      .join('');
    valueNode.innerHTML = markup;
    if (animate) {
      valueNode.classList.remove('is-fresh');
      void valueNode.offsetWidth;
      valueNode.classList.add('is-fresh');
    }
  };

  const updateMeta = () => {
    const alphabet = buildAlphabet();
    const bits =
      state.mode === 'random'
        ? entropyOf(Math.max(state.length, 1), alphabet.length)
        : Math.round(state.words * Math.log2(WORDS.length) + (state.addNumber ? 3.3 : 0));
    const strength = bits < 40 ? 1 : bits < 62 ? 2 : bits < 86 ? 3 : 4;
    const labels = ['', 'слабый', 'нормальный', 'надёжный', 'крепость'];
    const colors = ['#ff6b6b', '#ff6b6b', '#ffcb5c', '#6ee7a8', '#38e0f2'];

    const label = $('#pw-strength-label', root);
    const fill = $('#pw-meter-fill', root);
    const crack = $('#pw-crack', root);
    const entropy = $('#pw-entropy', root);
    const alphabetInfo = $('#pw-alphabet', root);

    if (label) {
      label.textContent = labels[strength];
      label.style.color = colors[strength];
    }
    if (fill) {
      fill.style.width = `${Math.min(100, (bits / 110) * 100)}%`;
      fill.style.background = `linear-gradient(90deg, ${colors[Math.max(1, strength - 1)]}, ${colors[strength]})`;
    }
    if (crack) crack.textContent = crackTime(bits);
    if (entropy) entropy.textContent = `${bits} бит`;
    if (alphabetInfo) {
      alphabetInfo.textContent =
        state.mode === 'random' ? `алфавит ${alphabet.length} симв.` : `словарь ${WORDS.length} слов`;
    }
  };

  const renderHistory = () => {
    const items = history.get();
    historyNode.innerHTML = items.length
      ? items
          .map(
            (item) => `
          <li class="pw-history__item" data-copy="${item.value.replace(/"/g, '&quot;')}">
            <code title="${item.value.replace(/"/g, '&quot;')}">${item.value.length > 26 ? `${item.value.slice(0, 26)}…` : item.value}</code>
            <span class="pw-history__bits">${item.entropy} бит</span>
            <button type="button" class="pw-history__remove" aria-label="Удалить" data-remove="${item.ts}">${icon('close')}</button>
          </li>`,
          )
          .join('')
      : `<li class="pw-history__empty">Сгенерированные пароли появятся здесь</li>`;
  };

  const pushHistory = (value: string, bits: number) => {
    const items = history.get().filter((item) => item.value !== value);
    items.unshift({ value, entropy: bits, mode: state.mode, ts: Date.now() });
    history.set(items.slice(0, 6));
    renderHistory();
  };

  const regenerate = (remember = true) => {
    const value = state.mode === 'random' ? generateRandom() : generatePassphrase();
    renderValue(value);
    updateMeta();
    if (remember) {
      const bits =
        state.mode === 'random'
          ? entropyOf(value.length, buildAlphabet().length)
          : Math.round(state.words * Math.log2(WORDS.length) + (state.addNumber ? 3.3 : 0));
      pushHistory(value, bits);
    }
  };

  const persist = () => {
    store<Partial<State>>('wl.passwords.opts', {}).set({
      mode: state.mode,
      length: state.length,
      opts: state.opts,
      excludeAmbiguous: state.excludeAmbiguous,
      words: state.words,
      separator: state.separator,
      capitalize: state.capitalize,
      addNumber: state.addNumber,
    });
  };

  function bindControls() {
    if (state.mode === 'random') {
      const length = $<HTMLInputElement>('#pw-length', root);
      length?.addEventListener('input', () => {
        state.length = Number(length.value);
        $('#pw-length-val', root)!.textContent = String(state.length);
        length.style.setProperty('--fill', `${((state.length - 6) / 58) * 100}%`);
        persist();
        debouncedGenerate();
      });
      length?.dispatchEvent(new Event('input'));

      root.querySelectorAll<HTMLInputElement>('[data-opt]').forEach((input) => {
        input.addEventListener('change', () => {
          state.opts[input.dataset.opt as keyof typeof SETS] = input.checked;
          if (!Object.values(state.opts).some(Boolean)) {
            input.checked = true;
            state.opts[input.dataset.opt as keyof typeof SETS] = true;
            toast('Нужен хотя бы один набор символов', 'error');
          }
          persist();
          regenerate();
        });
      });

      $('#pw-ambiguous', root)?.addEventListener('change', (event) => {
        state.excludeAmbiguous = (event.target as HTMLInputElement).checked;
        persist();
        regenerate();
      });
    } else {
      const words = $<HTMLInputElement>('#pw-words', root);
      words?.addEventListener('input', () => {
        state.words = Number(words.value);
        $('#pw-words-val', root)!.textContent = String(state.words);
        words.style.setProperty('--fill', `${((state.words - 3) / 5) * 100}%`);
        persist();
        debouncedGenerate();
      });
      words?.dispatchEvent(new Event('input'));

      root.querySelectorAll<HTMLButtonElement>('[data-sep]').forEach((button) => {
        button.addEventListener('click', () => {
          state.separator = button.dataset.sep ?? '-';
          root.querySelectorAll('[data-sep]').forEach((b) => b.classList.toggle('is-active', b === button));
          persist();
          regenerate();
        });
      });

      $('#pw-cap', root)?.addEventListener('change', (event) => {
        state.capitalize = (event.target as HTMLInputElement).checked;
        persist();
        regenerate();
      });
      $('#pw-num', root)?.addEventListener('change', (event) => {
        state.addNumber = (event.target as HTMLInputElement).checked;
        persist();
        regenerate();
      });
    }
  }

  const debouncedGenerate = debounce(() => regenerate(), 180);

  $('#pw-copy', root)?.addEventListener('click', async () => {
    const ok = await copyText(current);
    toast(ok ? 'Пароль скопирован' : 'Не удалось скопировать', ok ? 'success' : 'error');
  });

  $('#pw-regen', root)?.addEventListener('click', (event) => {
    regenerate();
    const button = event.currentTarget as HTMLButtonElement;
    button.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 320, easing: 'ease-out' });
  });

  $('#pw-clear', root)?.addEventListener('click', () => {
    history.set([]);
    renderHistory();
    toast('История очищена', 'success');
  });

  historyNode?.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const remove = target.closest<HTMLElement>('[data-remove]');
    if (remove) {
      event.stopPropagation();
      const ts = Number(remove.dataset.remove);
      history.set(history.get().filter((item) => item.ts !== ts));
      renderHistory();
      return;
    }
    const item = target.closest<HTMLElement>('[data-copy]');
    if (!item) return;
    const ok = await copyText(item.dataset.copy ?? '');
    toast(ok ? 'Скопировано из истории' : 'Не удалось скопировать', ok ? 'success' : 'error');
  });

  root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode as State['mode'];
      root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('is-active', b === button));
      renderControls();
      persist();
      regenerate();
    });
  });

  renderControls();
  renderHistory();
  regenerate(false);

  return () => {
    // listeners live inside the unmounted subtree
  };
}
