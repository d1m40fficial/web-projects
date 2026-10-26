import { $, $$, clamp, prefersReducedMotion, randInt, store } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';

type Dir = 'up' | 'down' | 'left' | 'right';

interface Tile {
  id: number;
  value: number;
  r: number;
  c: number;
}

interface Snapshot {
  tiles: Tile[];
  score: number;
}

interface Saved {
  tiles: Tile[];
  score: number;
  won: boolean;
  keepPlaying: boolean;
}

const SIZE = 4;
const STATE_KEY = 'wl.2048.state.v1';
const BEST_KEY = 'wl.2048.best.v1';

export function mount(root: HTMLElement): () => void {
  root.innerHTML = `
    <div class="g2048">
      <div class="g2048__stage">
        <div class="g2048__board" id="g-board" role="grid" aria-label="Игровое поле 2048">
          <div class="g2048__grid" aria-hidden="true">
            ${Array.from({ length: 16 }, () => '<span></span>').join('')}
          </div>
          <div class="g2048__tiles" id="g-tiles"></div>
          <div class="g2048__overlay" id="g-overlay" hidden>
            <span class="g2048__overlay-label" id="g-overlay-label">Игра окончена</span>
            <strong id="g-overlay-score">0</strong>
            <span class="g2048__overlay-sub" id="g-overlay-sub">очков</span>
            <div class="g2048__overlay-actions">
              <button class="btn btn--primary" type="button" id="g-again">${icon('refresh')} Ещё раз</button>
              <button class="btn" type="button" id="g-continue" hidden>${icon('arrow')} Продолжить</button>
            </div>
          </div>
        </div>
        <p class="g2048__hint">
          ${icon('keyboard')} стрелки / WASD · ${icon('mouse')} свайп по полю
        </p>
      </div>

      <aside class="g2048__side">
        <div class="g2048__scores">
          <div class="g2048__score"><span>очки</span><b id="g-score" aria-live="polite">0</b></div>
          <div class="g2048__score g2048__score--best"><span>рекорд</span><b id="g-best">0</b></div>
        </div>
        <div class="g2048__actions">
          <button class="btn btn--primary" type="button" id="g-new">${icon('plus')} Новая игра</button>
          <button class="btn btn--ghost" type="button" id="g-undo" disabled>${icon('undo')} Отменить</button>
        </div>
        <div class="g2048__rules">
          <span class="eyebrow">правила</span>
          <p>Стрелки двигают все плитки. Две одинаковые сливаются в одну, удваиваясь. Цель — <b>2048</b>, но игра продолжается и дальше.</p>
        </div>
        <div class="g2048__legend">
          ${[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
            .map((v) => `<span class="g2048__swatch tile--v${v}">${v}</span>`)
            .join('')}
        </div>
      </aside>
    </div>
  `;

  const board = $('#g-board', root)!;
  const tilesHost = $('#g-tiles', root)!;
  const scoreNode = $('#g-score', root)!;
  const bestNode = $('#g-best', root)!;
  const undoButton = $<HTMLButtonElement>('#g-undo', root)!;
  const overlay = $('#g-overlay', root)!;
  const overlayLabel = $('#g-overlay-label', root)!;
  const overlayScore = $('#g-overlay-score', root)!;
  const overlaySub = $('#g-overlay-sub', root)!;
  const againButton = $<HTMLButtonElement>('#g-again', root)!;
  const continueButton = $<HTMLButtonElement>('#g-continue', root)!;

  const saved = store<Saved | null>(STATE_KEY, null);
  const bestStore = store<number>(BEST_KEY, 0);

  let tiles: Tile[] = [];
  let score = 0;
  let best = bestStore.get() || 0;
  let won = false;
  let keepPlaying = false;
  let over = false;
  let busy = false;
  let nextId = 1;
  let history: Snapshot[] = [];
  let cell = 80;
  let gap = 10;
  let pad = 10;
  const elements = new Map<number, HTMLElement>();
  const timers = new Set<number>();

  const later = (fn: () => void, ms: number) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      fn();
    }, ms);
    timers.add(timer);
  };

  const clampTile = (value: number): string => (value > 2048 ? 'super' : String(value));

  const layout = () => {
    const width = board.clientWidth;
    if (!width) return;
    pad = Math.round(width * 0.024);
    gap = Math.round(width * 0.024);
    cell = (width - pad * 2 - gap * (SIZE - 1)) / SIZE;
    board.style.setProperty('--pad', `${pad}px`);
    board.style.setProperty('--gap', `${gap}px`);
    board.style.setProperty('--cell', `${cell}px`);
    for (const tile of tiles) {
      const el = elements.get(tile.id);
      if (el) position(el, tile.r, tile.c);
    }
    for (const [id, el] of elements) {
      const tile = tiles.find((t) => t.id === id);
      if (!tile) {
        const r = Number(el.dataset.r ?? 0);
        const c = Number(el.dataset.c ?? 0);
        position(el, r, c);
      }
    }
  };

  const position = (el: HTMLElement, r: number, c: number) => {
    el.style.width = `${cell}px`;
    el.style.height = `${cell}px`;
    el.style.transform = `translate3d(${pad + c * (cell + gap)}px, ${pad + r * (cell + gap)}px, 0)`;
    el.style.borderRadius = `${Math.max(6, cell * 0.13)}px`;
  };

  const tileElement = (tile: Tile): HTMLElement => {
    let el = elements.get(tile.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'tile';
      el.dataset.id = String(tile.id);
      el.dataset.r = String(tile.r);
      el.dataset.c = String(tile.c);
      el.setAttribute('role', 'gridcell');
      tilesHost.appendChild(el);
      elements.set(tile.id, el);
    }
    const digits = String(tile.value).length;
    el.textContent = String(tile.value);
    el.className = `tile tile--v${clampTile(tile.value)}${digits >= 4 ? ' tile--small' : ''}`;
    el.dataset.r = String(tile.r);
    el.dataset.c = String(tile.c);
    el.style.zIndex = String(2 + tile.r * SIZE + tile.c);
    el.style.fontSize = `${Math.round(cell * (digits >= 4 ? 0.27 : digits === 3 ? 0.33 : 0.41))}px`;
    position(el, tile.r, tile.c);
    return el;
  };

  const updateScore = () => {
    scoreNode.textContent = String(score);
    if (score > best) {
      best = score;
      bestStore.set(best);
    }
    bestNode.textContent = String(best);
  };

  const emptyCells = (): { r: number; c: number }[] => {
    const occupied = new Set(tiles.map((t) => `${t.r}:${t.c}`));
    const out: { r: number; c: number }[] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!occupied.has(`${r}:${c}`)) out.push({ r, c });
      }
    }
    return out;
  };

  const spawn = (): Tile | null => {
    const cells = emptyCells();
    if (!cells.length) return null;
    const { r, c } = cells[randInt(0, cells.length - 1)];
    const tile: Tile = { id: nextId++, value: Math.random() < 0.9 ? 2 : 4, r, c };
    tiles.push(tile);
    return tile;
  };

  const render = (spawnedId?: number) => {
    for (const tile of tiles) {
      const el = tileElement(tile);
      if (tile.id === spawnedId) {
        el.classList.add('is-new');
        later(() => el.classList.remove('is-new'), 260);
      }
    }
    updateScore();
  };

  const snapshot = (): Snapshot => ({ tiles: tiles.map((t) => ({ ...t })), score });

  const hasMoves = (): boolean => {
    if (tiles.length < SIZE * SIZE) return true;
    const grid: (Tile | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    for (const t of tiles) grid[t.r][t.c] = t;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = grid[r][c]?.value;
        if (c + 1 < SIZE && grid[r][c + 1]?.value === v) return true;
        if (r + 1 < SIZE && grid[r + 1][c]?.value === v) return true;
      }
    }
    return false;
  };

  const save = () => {
    store<Saved>(STATE_KEY, { tiles, score, won, keepPlaying }).set({ tiles: tiles.map((t) => ({ ...t })), score, won, keepPlaying });
  };

  const overlayShow = (kind: 'win' | 'over') => {
    over = kind === 'over';
    overlay.hidden = false;
    overlayLabel.textContent = kind === 'win' ? 'Плитка 2048 собрана' : 'Ходов больше нет';
    overlayScore.textContent = String(score);
    overlaySub.textContent = kind === 'win' ? 'победа' : 'очков';
    continueButton.hidden = kind !== 'win';
    againButton.innerHTML = `${icon('refresh')} ${kind === 'win' ? 'Заново' : 'Ещё раз'}`;
  };

  const hideOverlay = () => {
    overlay.hidden = true;
  };

  const checkEnd = () => {
    if (tiles.some((t) => t.value >= 2048) && !won) {
      won = true;
      save();
      if (!prefersReducedMotion()) overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
      overlayShow('win');
      return;
    }
    if (!hasMoves()) {
      over = true;
      save();
      overlayShow('over');
    }
  };

  const snapshotPush = () => {
    history.push(snapshot());
    if (history.length > 12) history.shift();
    undoButton.disabled = history.length === 0;
  };

  const undo = () => {
    if (!history.length || busy) return;
    const state = history.pop()!;
    tiles = state.tiles;
    score = state.score;
    won = false;
    over = false;
    keepPlaying = false;
    hideOverlay();
    // clear orphan elements
    for (const [id, el] of elements) {
      if (!tiles.some((t) => t.id === id)) {
        el.remove();
        elements.delete(id);
      }
    }
    render();
    undoButton.disabled = history.length === 0;
    save();
    toast('Ход отменён', 'success');
  };

  const move = (dir: Dir) => {
    if (busy || over || !overlay.hidden) return;
    const before = snapshot();
    const grid: (Tile | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    for (const t of tiles) grid[t.r][t.c] = t;

    const merged = new Set<number>();
    const absorbed: { tile: Tile; toR: number; toC: number }[] = [];
    let moved = false;
    let gained = 0;

    const vectors: Record<Dir, [number, number]> = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };
    const [dr, dc] = vectors[dir];

    const rows = [...Array(SIZE).keys()];
    const cols = [...Array(SIZE).keys()];
    if (dr > 0) rows.reverse();
    if (dc > 0) cols.reverse();

    for (const r of rows) {
      for (const c of cols) {
        const tile = grid[r][c];
        if (!tile) continue;
        let nr = r;
        let nc = c;
        let didMerge = false;
        while (true) {
          const tr = nr + dr;
          const tc = nc + dc;
          if (tr < 0 || tr >= SIZE || tc < 0 || tc >= SIZE) break;
          const next = grid[tr][tc];
          if (!next) {
            nr = tr;
            nc = tc;
            continue;
          }
          if (next.value === tile.value && !merged.has(next.id)) {
            next.value *= 2;
            merged.add(next.id);
            gained += next.value;
            absorbed.push({ tile, toR: tr, toC: tc });
            grid[r][c] = null;
            moved = true;
            didMerge = true;
            const targetEl = elements.get(next.id);
            if (targetEl) {
              targetEl.classList.remove('is-merged');
              // restart pop after the slide lands
              later(() => {
                targetEl.classList.add('is-merged');
                later(() => targetEl.classList.remove('is-merged'), 260);
              }, 120);
            }
          }
          break;
        }
        if (didMerge) continue;
        if (nr !== r || nc !== c) {
          grid[r][c] = null;
          grid[nr][nc] = tile;
          tile.r = nr;
          tile.c = nc;
          moved = true;
        }
      }
    }

    if (!moved) {
      board.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 180, easing: 'ease-in-out' },
      );
      return;
    }

    history.push(before);
    if (history.length > 12) history.shift();
    undoButton.disabled = false;

    // slide absorbed tiles into their targets, then drop them
    for (const item of absorbed) {
      const el = elements.get(item.tile.id);
      if (el) {
        el.style.zIndex = '1';
        el.classList.add('is-absorbed');
        position(el, item.toR, item.toC);
        later(() => {
          el.remove();
          elements.delete(item.tile.id);
        }, 170);
      }
    }

    tiles = tiles.filter((t) => !absorbed.some((a) => a.tile.id === t.id));
    score += gained;
    busy = true;
    render();
    save();

    if (gained > 0) {
      const pop = document.createElement('span');
      pop.className = 'score-pop';
      pop.textContent = `+${gained}`;
      root.querySelector('.g2048__score')?.appendChild(pop);
      later(() => pop.remove(), 700);
    }

    if (!prefersReducedMotion()) {
      // keep the controls responsive while tiles animate
    }

    later(() => {
      const tile = spawn();
      render(tile?.id);
      busy = false;
      checkEnd();
      save();
    }, 140);
  };

  const newGame = () => {
    for (const timer of timers) window.clearTimeout(timer);
    timers.clear();
    for (const [, el] of elements) el.remove();
    elements.clear();
    tiles = [];
    score = 0;
    won = false;
    keepPlaying = false;
    over = false;
    busy = false;
    history = [];
    undoButton.disabled = true;
    hideOverlay();
    spawn();
    spawn();
    render();
    save();
    updateScore();
    toast('Новая игра', 'success');
  };

  const continueGame = () => {
    keepPlaying = true;
    hideOverlay();
    over = false;
    save();
  };

  $('#g-new', root)?.addEventListener('click', newGame);
  undoButton.addEventListener('click', undo);
  againButton.addEventListener('click', newGame);
  continueButton.addEventListener('click', continueGame);

  const keyHandler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.matches('input, textarea, select')) return;
    const map: Record<string, Dir> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      ц: 'up',
      ы: 'down',
      ф: 'left',
      в: 'right',
    };
    const dir = map[event.key] ?? map[event.key.toLowerCase()];
    if (!dir) return;
    event.preventDefault();
    move(dir);
    if (over && over !== undefined) {
      // no-op: overlay handles restart
    }
  };
  window.addEventListener('keydown', keyHandler);

  let startX = 0;
  let startY = 0;
  let tracking = false;

  const onPointerDown = (event: PointerEvent) => {
    tracking = true;
    startX = event.clientX;
    startY = event.clientY;
    board.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };
  board.addEventListener('pointerdown', onPointerDown);
  board.addEventListener('pointerup', onPointerUp);
  board.addEventListener('pointercancel', () => {
    tracking = false;
  });

  const observer = new ResizeObserver(() => layout());
  observer.observe(board);

  // restore or create a game
  const restored = saved.get();
  bestNode.textContent = String(best);

  if (restored && Array.isArray(restored.tiles) && restored.tiles.length && restored.tiles.every((t) => Number.isFinite(t.r) && Number.isFinite(t.c))) {
    tiles = restored.tiles.map((t) => ({ ...t }));
    score = restored.score ?? 0;
    won = Boolean(restored.won);
    keepPlaying = Boolean(restored.keepPlaying);
    nextId = Math.max(0, ...tiles.map((t) => t.id)) + 1;
    render();
    setTimeout(() => {
      if (over) overlayShow('over');
      else if (tiles.every((t) => t.value < 2048) && !hasMoves()) {
        over = true;
        overlayShow('over');
      } else if (won && !keepPlaying) overlayShow('win');
    }, 60);
  } else {
    spawn();
    spawn();
    render();
    save();
  }
  updateScore();
  requestAnimationFrame(layout);

  return () => {
    window.removeEventListener('keydown', keyHandler);
    observer.disconnect();
    for (const timer of timers) window.clearTimeout(timer);
    timers.clear();
    void $$;
    void clamp;
  };
}

