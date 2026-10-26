import { $, $$, formatDuration, plural, shuffle, store } from '../../core/dom';
import { fireConfetti } from '../../core/confetti';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';

type Difficulty = 'easy' | 'medium' | 'hard';
type ThemeId = 'space' | 'food' | 'animals' | 'tech';

interface Theme {
  label: string;
  emoji: string;
  icons: string[];
}

const THEMES: Record<ThemeId, Theme> = {
  space: {
    label: 'Космос',
    emoji: '🚀',
    icons: ['🚀', '🪐', '🌙', '⭐', '☄️', '🛰️', '👽', '🔭', '🌌', '🧑‍🚀', '🌍', '🌞', '🌠', '🛸', '✨'],
  },
  food: {
    label: 'Еда',
    emoji: '🍕',
    icons: ['🍕', '🍣', '🍩', '🍓', '🥑', '🍋', '🍪', '🌮', '🍉', '🧁', '🍔', '🥐', '🍇', '🍜', '🍫'],
  },
  animals: {
    label: 'Животные',
    emoji: '🦊',
    icons: ['🦊', '🐼', '🦄', '🐙', '🦋', '🐸', '🦉', '🐢', '🦜', '🐳', '🦁', '🐝', '🦩', '🐧', '🦔'],
  },
  tech: {
    label: 'Техно',
    emoji: '🖥️',
    icons: ['💾', '🖥️', '⌨️', '🖱️', '📱', '🔋', '💡', '🔌', '🎧', '🕹️', '📷', '☎️', '📼', '🔦', '🤖'],
  },
};

const DIFFICULTIES: Record<Difficulty, { label: string; pairs: number; cols: number; name: string }> = {
  easy: { label: '4 × 4', pairs: 8, cols: 4, name: 'лёгкое' },
  medium: { label: '4 × 5', pairs: 10, cols: 5, name: 'среднее' },
  hard: { label: '5 × 6', pairs: 15, cols: 5, name: 'сложное' },
};

interface Card {
  uid: number;
  emoji: string;
  matched: boolean;
}

interface Best {
  time: number;
  moves: number;
}

const BEST_KEY = 'wl.memory.best.v2';

export function mount(root: HTMLElement): () => void {
  let difficulty: Difficulty = 'easy';
  let themeId: ThemeId = 'space';
  let cards: Card[] = [];
  let flipped = new Set<number>();
  let matchedPairs = 0;
  let moves = 0;
  let first: number | null = null;
  let lock = false;
  let startTime: number | null = null;
  let elapsed = 0;
  let timer = 0;
  let over = false;
  let uid = 1;
  let generation = 0;
  const bestStore = store<Record<string, Best>>(BEST_KEY, {});

  root.innerHTML = `
    <div class="mem">
      <div class="mem__stage">
        <div class="mem__board" id="mem-board" style="--cols:4"></div>
        <div class="mem__overlay" id="mem-overlay" hidden>
          <span class="mem__overlay-label">поле собрано</span>
          <strong id="mem-overlay-time">00:00</strong>
          <p id="mem-overlay-sub">0 ходов</p>
          <div class="mem__overlay-actions">
            <button class="btn btn--primary" type="button" id="mem-again">${icon('refresh')} Ещё раз</button>
            <button class="btn" type="button" id="mem-close">Посмотреть поле</button>
          </div>
        </div>
        <p class="mem__hint">${icon('cards')} две одинаковые карточки — пара</p>
      </div>

      <aside class="mem__side">
        <div class="mem__stats">
          <div class="mem__stat"><span>ходы</span><b id="mem-moves">0</b></div>
          <div class="mem__stat"><span>пары</span><b id="mem-pairs">0 / 8</b></div>
          <div class="mem__stat"><span>время</span><b id="mem-time">0:00</b></div>
        </div>

        <div class="mem__best">
          <span class="eyebrow">рекорд поля</span>
          <p id="mem-best">—</p>
        </div>

        <div class="mem__group">
          <span class="section-label">сложность</span>
          <div class="segmented mem__difficulty" role="group" aria-label="Сложность">
            ${(Object.keys(DIFFICULTIES) as Difficulty[])
              .map((key) => `<button type="button" data-diff="${key}" class="${key === difficulty ? 'is-active' : ''}">${DIFFICULTIES[key].label}</button>`)
              .join('')}
          </div>
        </div>

        <div class="mem__group">
          <span class="section-label">набор</span>
          <div class="mem__themes" role="group" aria-label="Набор карточек">
            ${(Object.keys(THEMES) as ThemeId[])
              .map(
                (key) =>
                  `<button type="button" class="mem__theme ${key === themeId ? 'is-active' : ''}" data-theme-id="${key}" title="${THEMES[key].label}">
                    <span>${THEMES[key].emoji}</span><small>${THEMES[key].label}</small>
                  </button>`,
              )
              .join('')}
          </div>
        </div>

        <button class="btn btn--ghost btn--block" type="button" id="mem-new">${icon('refresh')} Перемешать заново</button>
        <p class="help">Рекорд считается по времени, затем по ходам. Таймер стартует с первого переворота.</p>
      </aside>
    </div>
  `;

  const board = $('#mem-board', root)!;
  const overlay = $('#mem-overlay', root)!;
  const overlayTime = $('#mem-overlay-time', root)!;
  const overlaySub = $('#mem-overlay-sub', root)!;
  const movesNode = $('#mem-moves', root)!;
  const pairsNode = $('#mem-pairs', root)!;
  const timeNode = $('#mem-time', root)!;
  const bestNode = $('#mem-best', root)!;

  const bestFor = (): Best | undefined => bestStore.get()[difficulty];

  const updateBest = () => {
    const best = bestFor();
    bestNode.textContent = best ? `${formatDuration(best.time)} · ${best.moves} ${plural(best.moves, 'ход', 'хода', 'ходов')}` : 'ещё не установлен';
  };

  const updateStats = () => {
    movesNode.textContent = String(moves);
    pairsNode.textContent = `${matchedPairs} / ${DIFFICULTIES[difficulty].pairs}`;
    timeNode.textContent = formatDuration(elapsed);
  };

  const tick = () => {
    if (startTime === null) return;
    elapsed = (Date.now() - startTime) / 1000;
    timeNode.textContent = formatDuration(elapsed);
  };

  const startTimer = () => {
    if (startTime !== null) return;
    startTime = Date.now();
    timer = window.setInterval(tick, 250);
  };

  const stopTimer = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
    if (startTime !== null) elapsed = (Date.now() - startTime) / 1000;
    timeNode.textContent = formatDuration(elapsed);
  };

  const cardMarkup = (card: Card, index: number): string => `
    <button class="mem-card" type="button" data-card="${index}" aria-label="Карточка ${index + 1}, закрыта">
      <span class="mem-card__inner">
        <span class="mem-card__face mem-card__face--front"><span class="mem-card__pattern"></span></span>
        <span class="mem-card__face mem-card__face--back">${card.emoji}</span>
      </span>
    </button>`;

  const renderCard = (index: number) => {
    const node = board.querySelector<HTMLElement>(`[data-card="${index}"]`);
    const card = cards[index];
    if (!node || !card) return;
    const open = flipped.has(index) || card.matched;
    node.classList.toggle('is-flipped', open);
    node.classList.toggle('is-matched', card.matched);
    node.setAttribute('aria-label', card.matched ? `Карточка ${index + 1}, пара найдена` : open ? `Карточка ${index + 1}, ${card.emoji}` : `Карточка ${index + 1}, закрыта`);
  };

  const deal = () => {
    generation++;
    uid = 1;
    const icons = shuffle(THEMES[themeId].icons).slice(0, DIFFICULTIES[difficulty].pairs);
    cards = shuffle([...icons, ...icons]).map((emoji) => ({ uid: uid++, emoji, matched: false }));
    flipped = new Set();
    matchedPairs = 0;
    moves = 0;
    first = null;
    lock = false;
    over = false;
    startTime = null;
    elapsed = 0;
    if (timer) window.clearInterval(timer);
    timer = 0;
    overlay.hidden = true;
    board.style.setProperty('--cols', String(DIFFICULTIES[difficulty].cols));
    board.innerHTML = cards.map(cardMarkup).join('');
    updateStats();
    updateBest();
  };

  const win = () => {
    over = true;
    lock = true;
    stopTimer();
    const best = bestFor();
    const isBest = !best || elapsed < best.time - 0.5 || (Math.abs(elapsed - best.time) < 0.5 && moves < best.moves);
    if (isBest) {
      const next = { ...bestStore.get(), [difficulty]: { time: elapsed, moves } };
      bestStore.set(next);
      updateBest();
    }
    overlayTime.textContent = formatDuration(elapsed);
    overlaySub.textContent = `${moves} ${plural(moves, 'ход', 'хода', 'ходов')} · ${DIFFICULTIES[difficulty].name} поле${isBest ? ' · новый рекорд' : ''}`;
    const gen = generation;
    window.setTimeout(() => {
      if (gen !== generation) return;
      overlay.hidden = false;
      fireConfetti(150);
    }, 420);
    toast(isBest ? 'Новый рекорд поля!' : 'Поле собрано!', 'success');
  };

  board.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-card]');
    if (!button || lock || over) return;
    const index = Number(button.dataset.card);
    const card = cards[index];
    if (!card || card.matched || flipped.has(index)) return;

    startTimer();
    flipped.add(index);
    renderCard(index);

    if (first === null) {
      first = index;
      return;
    }

    const second = index;
    moves++;
    updateStats();
    const firstCard = cards[first];
    const firstIndex = first;
    const gen = generation;
    lock = true;

    if (firstCard.emoji === card.emoji) {
      firstCard.matched = true;
      card.matched = true;
      matchedPairs++;
      window.setTimeout(() => {
        if (gen !== generation) return;
        renderCard(firstIndex);
        renderCard(second);
        updateStats();
        first = null;
        lock = false;
        if (matchedPairs === DIFFICULTIES[difficulty].pairs) win();
      }, 380);
      window.setTimeout(() => {
        if (gen !== generation) return;
        flipped.delete(firstIndex);
        flipped.delete(second);
        renderCard(firstIndex);
        renderCard(second);
      }, 1150);
    } else {
      window.setTimeout(() => {
        if (gen !== generation) return;
        flipped.delete(firstIndex);
        flipped.delete(second);
        renderCard(firstIndex);
        renderCard(second);
        first = null;
        lock = false;
      }, 760);
    }
  });

  const restart = () => {
    deal();
    toast('Карточки перемешаны', 'success');
  };

  $('#mem-new', root)?.addEventListener('click', restart);
  $('#mem-again', root)?.addEventListener('click', restart);
  $('#mem-close', root)?.addEventListener('click', () => {
    overlay.hidden = true;
  });

  $$<HTMLButtonElement>('[data-diff]', root).forEach((button) => {
    button.addEventListener('click', () => {
      difficulty = button.dataset.diff as Difficulty;
      $$('[data-diff]', root).forEach((b) => b.classList.toggle('is-active', b === button));
      restart();
    });
  });

  $$<HTMLButtonElement>('[data-theme-id]', root).forEach((button) => {
    button.addEventListener('click', () => {
      themeId = button.dataset.themeId as ThemeId;
      $$('[data-theme-id]', root).forEach((b) => b.classList.toggle('is-active', b === button));
      restart();
    });
  });

  deal();

  return () => {
    if (timer) window.clearInterval(timer);
  };
}
