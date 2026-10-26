import { $, $$, clamp, escapeHtml, plural } from '../../core/dom';
import { icon } from '../../core/icons';
import { titles, type Kind, type RatedTitle } from '../../data/ratings';

type KindFilter = 'all' | Kind;
type SortKey = 'rating' | 'year' | 'votes' | 'title';

const KIND_LABEL: Record<Kind, string> = { movie: 'фильм', book: 'книга' };
const KIND_COLOR: Record<Kind, string> = { movie: '#ffcb5c', book: '#38e0f2' };
const GENRE_COLORS = ['#ffcb5c', '#38e0f2', '#8b6bff', '#6ee7a8', '#ff6aa8', '#c4f56a', '#f2b179', '#9fb4ff'];

const formatVotes = (votes: number): string => (votes >= 1000 ? `${(votes / 1000).toFixed(1)} млн` : `${votes} тыс.`);

export function mount(root: HTMLElement): () => void {
  let kind: KindFilter = 'all';
  let genre = 'all';
  let query = '';
  let sort: SortKey = 'rating';

  root.innerHTML = `
    <div class="rt">
      <div class="rt-bar">
        <div class="segmented rt-kinds" role="group" aria-label="Тип">
          <button type="button" data-kind="all" class="is-active">Всё <span class="chip__count">${titles.length}</span></button>
          <button type="button" data-kind="movie">Фильмы <span class="chip__count">${titles.filter((t) => t.kind === 'movie').length}</span></button>
          <button type="button" data-kind="book">Книги <span class="chip__count">${titles.filter((t) => t.kind === 'book').length}</span></button>
        </div>
        <label class="rt-search">
          ${icon('search')}
          <input type="search" id="rt-query" placeholder="Название, автор, режиссёр…" aria-label="Поиск по каталогу" />
        </label>
        <select class="select rt-sort" id="rt-sort" aria-label="Сортировка">
          <option value="rating">по рейтингу</option>
          <option value="votes">по числу оценок</option>
          <option value="year">по году</option>
          <option value="title">по названию</option>
        </select>
        <button class="rt-reset" type="button" id="rt-reset" title="Сбросить фильтры">${icon('refresh')}</button>
      </div>

      <div class="rt-genres" id="rt-genres" role="group" aria-label="Жанры"></div>
      <div class="rt-kpis" id="rt-kpis"></div>

      <div class="rt-grid" id="rt-grid">
        <section class="panel rt-panel rt-panel--top">
          <div class="panel__head">
            <span class="panel__title">${icon('chart')} топ-8</span>
            <span class="rt-panel__hint" id="rt-top-hint">по рейтингу</span>
          </div>
          <div class="panel__body rt-top" id="rt-top"></div>
        </section>

        <section class="panel rt-panel rt-panel--donut">
          <div class="panel__head">
            <span class="panel__title">${icon('palette')} жанры</span>
            <span class="rt-panel__hint" id="rt-donut-hint">доля в выборке</span>
          </div>
          <div class="panel__body rt-donut" id="rt-donut"></div>
        </section>

        <section class="panel rt-panel rt-panel--scatter">
          <div class="panel__head">
            <span class="panel__title">${icon('sparkles')} год × рейтинг</span>
            <span class="rt-panel__legend"><i style="background:${KIND_COLOR.movie}"></i> фильмы <i style="background:${KIND_COLOR.book}"></i> книги</span>
          </div>
          <div class="panel__body">
            <div class="rt-scatter" id="rt-scatter"></div>
          </div>
        </section>

        <section class="panel rt-panel rt-panel--hist">
          <div class="panel__head">
            <span class="panel__title">${icon('chart')} распределение</span>
            <span class="rt-panel__hint" id="rt-hist-hint">оценки</span>
          </div>
          <div class="panel__body rt-hist" id="rt-hist"></div>
        </section>
      </div>

      <div class="rt-empty" id="rt-empty" hidden>
        ${icon('search')}
        <b>Ничего не найдено</b>
        <span>Попробуйте другой жанр или сбросьте фильтры.</span>
        <button class="btn btn--sm" type="button" id="rt-empty-reset">Сбросить</button>
      </div>

      <p class="rt-note">${icon('info')} Демо-каталог: ${titles.length} фильмов и книг, оценки округлены и собраны для визуализации. Не официальные данные IMDb или Goodreads.</p>
      <div class="rt-tip" id="rt-tip" hidden></div>
    </div>
  `;

  const genresNode = $('#rt-genres', root)!;
  const kpisNode = $('#rt-kpis', root)!;
  const topNode = $('#rt-top', root)!;
  const donutNode = $('#rt-donut', root)!;
  const scatterNode = $('#rt-scatter', root)!;
  const histNode = $('#rt-hist', root)!;
  const emptyNode = $('#rt-empty', root)!;
  const grid = $('#rt-grid', root)!;
  const tip = $('#rt-tip', root)!;

  const poolForKind = (): RatedTitle[] => titles.filter((t) => kind === 'all' || t.kind === kind);

  const genreCounts = (list: RatedTitle[]): { genre: string; count: number }[] => {
    const map = new Map<string, number>();
    list.forEach((t) => map.set(t.genre, (map.get(t.genre) ?? 0) + 1));
    return [...map.entries()].map(([g, count]) => ({ genre: g, count })).sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
  };

  const filtered = (): RatedTitle[] => {
    const q = query.trim().toLowerCase();
    const list = titles.filter((t) => {
      if (kind !== 'all' && t.kind !== kind) return false;
      if (genre !== 'all' && t.genre !== genre) return false;
      if (!q) return true;
      return `${t.title} ${t.creator} ${t.genre}`.toLowerCase().includes(q);
    });
    return list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating || b.votes - a.votes;
      if (sort === 'votes') return b.votes - a.votes;
      if (sort === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title, 'ru');
    });
  };

  const renderGenres = () => {
    const counts = genreCounts(poolForKind());
    const all = { genre: 'all', count: poolForKind().length };
    genresNode.innerHTML = [all, ...counts]
      .map(
        (item) =>
          `<button class="chip ${genre === item.genre ? 'is-active' : ''}" type="button" data-genre="${escapeHtml(item.genre)}">
            ${item.genre === 'all' ? 'Все жанры' : item.genre}<span class="chip__count">${item.count}</span>
          </button>`,
      )
      .join('');
  };

  const showTip = (id: string, x: number, y: number) => {
    const item = titles.find((t) => t.id === id);
    if (!item) return;
    tip.hidden = false;
    tip.innerHTML = `
      <b>${escapeHtml(item.title)}</b>
      <span>${escapeHtml(item.creator)} · ${item.year}</span>
      <span class="rt-tip__meta"><em style="background:${KIND_COLOR[item.kind]}"></em>${item.genre} · ${item.rating.toFixed(1)} · ${formatVotes(item.votes)} оценок</span>`;
    const left = clamp(x + 14, 12, window.innerWidth - 260);
    const top = clamp(y - 12, 12, window.innerHeight - 90);
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };

  const hideTip = () => {
    tip.hidden = true;
  };

  const renderKpis = (list: RatedTitle[]) => {
    if (!list.length) {
      kpisNode.innerHTML = '';
      return;
    }
    const avg = list.reduce((a, t) => a + t.rating, 0) / list.length;
    const votes = list.reduce((a, t) => a + t.votes, 0);
    const genreTop = genreCounts(list)[0];
    const best = [...list].sort((a, b) => b.rating - a.rating)[0];
    const movies = list.filter((t) => t.kind === 'movie').length;
    const books = list.filter((t) => t.kind === 'book').length;
    const cards = [
      ['тайтлов', String(list.length), `${movies} ${plural(movies, 'фильм', 'фильма', 'фильмов')} · ${books} ${plural(books, 'книга', 'книги', 'книг')}`, 'layers'],
      ['средняя оценка', avg.toFixed(2), 'из 10 возможных', 'star'],
      ['частый жанр', genreTop?.genre ?? '—', `${genreTop?.count ?? 0} тайтлов`, 'palette'],
      ['всего оценок', formatVotes(votes), 'в тысячах голосов', 'chart'],
    ] as const;
    kpisNode.innerHTML = cards
      .map(
        ([label, value, sub, ic]) => `
        <div class="rt-kpi">
          <span class="rt-kpi__icon">${icon(ic)}</span>
          <div><span>${label}</span><b>${value}</b><small>${sub}</small></div>
        </div>`,
      )
      .join('');
    void best;
  };

  const renderTop = (list: RatedTitle[]) => {
    const top = list.slice(0, 8);
    const hint = $('#rt-top-hint', root);
    if (hint) {
      hint.textContent =
        sort === 'rating' ? 'по рейтингу' : sort === 'votes' ? 'по числу оценок' : sort === 'year' ? 'по году' : 'по названию';
    }
    if (!top.length) {
      topNode.innerHTML = `<p class="rt-chart-empty">Нет данных</p>`;
      return;
    }
    topNode.innerHTML = top
      .map((item, index) => {
        const width = clamp(((item.rating - 6) / 4) * 100, 8, 100);
        const color = item.kind === 'movie' ? 'linear-gradient(90deg,#ffcb5c,#ff6aa8)' : 'linear-gradient(90deg,#38e0f2,#c4f56a)';
        return `
          <div class="rt-top__row" data-id="${item.id}" tabindex="0" role="button" aria-label="${escapeHtml(item.title)}, ${item.rating.toFixed(1)}">
            <span class="rt-top__rank">${String(index + 1).padStart(2, '0')}</span>
            <span class="rt-top__main">
              <span class="rt-top__label"><b>${escapeHtml(item.title)}</b><span>${item.year} · ${item.genre} · ${KIND_LABEL[item.kind]}</span></span>
              <span class="rt-top__bar"><i style="width:${width}%;background:${color}"></i></span>
            </span>
            <span class="rt-top__score">${item.rating.toFixed(1)}</span>
          </div>`;
      })
      .join('');

    $$<HTMLElement>('.rt-top__row', topNode).forEach((row) => {
      row.addEventListener('pointerenter', (event) => showTip(row.dataset.id ?? '', event.clientX, event.clientY));
      row.addEventListener('pointermove', (event) => showTip(row.dataset.id ?? '', event.clientX, event.clientY));
      row.addEventListener('pointerleave', hideTip);
      row.addEventListener('focus', () => {
        const rect = row.getBoundingClientRect();
        showTip(row.dataset.id ?? '', rect.right - 40, rect.top);
      });
      row.addEventListener('blur', hideTip);
    });
  };

  const renderDonut = (list: RatedTitle[]) => {
    if (!list.length) {
      donutNode.innerHTML = `<p class="rt-chart-empty">Нет данных</p>`;
      return;
    }
    const groups = genreCounts(list);
    const top = groups.slice(0, 6);
    const rest = groups.slice(6);
    if (rest.length) top.push({ genre: 'другие', count: rest.reduce((a, b) => a + b.count, 0) });
    const total = top.reduce((a, b) => a + b.count, 0);
    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const segments = top
      .map((group, index) => {
        const fraction = group.count / total;
        const dash = fraction * circumference;
        const color = GENRE_COLORS[index % GENRE_COLORS.length];
        const seg = `<circle cx="90" cy="90" r="${radius}" fill="none" stroke="${color}" stroke-width="20" stroke-dasharray="${dash.toFixed(2)} ${(circumference - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 90 90)"><title>${group.genre}: ${group.count}</title></circle>`;
        offset += dash;
        return seg;
      })
      .join('');

    donutNode.innerHTML = `
      <div class="rt-donut__chart">
        <svg viewBox="0 0 180 180" role="img" aria-label="Распределение по жанрам">
          <circle cx="90" cy="90" r="${radius}" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="20"/>
          ${segments}
          <text x="90" y="85" text-anchor="middle" class="rt-donut__total">${list.length}</text>
          <text x="90" y="99" text-anchor="middle" class="rt-donut__label">тайтлов</text>
        </svg>
      </div>
      <ul class="rt-donut__legend">
        ${top
          .map(
            (group, index) => `
            <li><i style="background:${GENRE_COLORS[index % GENRE_COLORS.length]}"></i>
              <span>${group.genre}</span><small>${group.count}</small>
            </li>`,
          )
          .join('')}
      </ul>`;
  };

  const renderHist = (list: RatedTitle[]) => {
    if (!list.length) {
      histNode.innerHTML = `<p class="rt-chart-empty">Нет данных</p>`;
      return;
    }
    const buckets = [
      { label: '< 7', test: (r: number) => r < 7 },
      { label: '7–7.5', test: (r: number) => r >= 7 && r < 7.5 },
      { label: '7.5–8', test: (r: number) => r >= 7.5 && r < 8 },
      { label: '8–8.5', test: (r: number) => r >= 8 && r < 8.5 },
      { label: '8.5–9', test: (r: number) => r >= 8.5 && r < 9 },
      { label: '9–9.5', test: (r: number) => r >= 9 && r < 9.5 },
      { label: '9.5+', test: (r: number) => r >= 9.5 },
    ];
    const counts = buckets.map((b) => list.filter((t) => b.test(t.rating)).length);
    const max = Math.max(1, ...counts);
    histNode.innerHTML = `
      <div class="rt-hist__chart">
        ${counts
          .map(
            (count, i) => `
            <div class="rt-hist__col" title="${count} тайтлов">
              <span class="rt-hist__count">${count || ''}</span>
              <i style="height:${(count / max) * 100}%;animation-delay:${i * 45}ms"></i>
              <span class="rt-hist__label">${buckets[i].label}</span>
            </div>`,
          )
          .join('')}
      </div>`;
  };

  const renderScatter = (list: RatedTitle[]) => {
    if (!list.length) {
      scatterNode.innerHTML = `<p class="rt-chart-empty">Нет данных</p>`;
      return;
    }
    const w = 640;
    const h = 300;
    const m = { l: 34, r: 16, t: 16, b: 30 };
    const minYear = Math.min(...list.map((t) => t.year)) - 6;
    const maxYear = Math.max(...list.map((t) => t.year)) + 6;
    const minRating = 6.8;
    const maxRating = 9.6;
    const x = (year: number) => m.l + ((year - minYear) / Math.max(1, maxYear - minYear)) * (w - m.l - m.r);
    const y = (rating: number) => m.t + (1 - (rating - minRating) / (maxRating - minRating)) * (h - m.t - m.b);

    const grid = [7, 8, 9].map((r) => {
      const yy = y(r);
      return `<line x1="${m.l}" y1="${yy}" x2="${w - m.r}" y2="${yy}" stroke="rgba(255,255,255,.06)"/>
        <text x="${m.l - 8}" y="${yy + 3}" text-anchor="end" class="rt-axis">${r}</text>`;
    });
    const actualMinYear = Math.min(...list.map((t) => t.year));
    const actualMaxYear = Math.max(...list.map((t) => t.year));
    const yearTicks = Array.from({ length: 4 }, (_, i) =>
      Math.round(actualMinYear + (i / 3) * (actualMaxYear - actualMinYear)),
    );
    const xTicks = yearTicks
      .map((yr) => `<text x="${x(yr)}" y="${h - 10}" text-anchor="middle" class="rt-axis">${yr}</text>`)
      .join('');

    const dots = list
      .map((t) => {
        const r = clamp(2.4 + Math.sqrt(t.votes) / 26, 2.5, 7.5);
        return `<circle cx="${x(t.year).toFixed(1)}" cy="${y(t.rating).toFixed(1)}" r="${r.toFixed(1)}" fill="${KIND_COLOR[t.kind]}" fill-opacity=".72" stroke="${KIND_COLOR[t.kind]}" stroke-width=".6" data-id="${t.id}" tabindex="0" style="animation-delay:${Math.round((x(t.year) / w) * 300)}ms"><title>${escapeHtml(t.title)} — ${t.rating.toFixed(1)} (${t.year})</title></circle>`;
      })
      .join('');

    scatterNode.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Рейтинг по годам">
        ${grid}
        ${xTicks}
        <line x1="${m.l}" y1="${h - m.b}" x2="${w - m.r}" y2="${h - m.b}" stroke="rgba(255,255,255,.12)"/>
        ${dots}
      </svg>`;

    $$<SVGCircleElement>('circle[data-id]', scatterNode).forEach((dot) => {
      dot.addEventListener('pointerenter', (event) => showTip(dot.dataset.id ?? '', event.clientX, event.clientY));
      dot.addEventListener('pointermove', (event) => showTip(dot.dataset.id ?? '', event.clientX, event.clientY));
      dot.addEventListener('pointerleave', hideTip);
      dot.addEventListener('focus', () => {
        const rect = dot.getBoundingClientRect();
        showTip(dot.dataset.id ?? '', rect.right, rect.top);
      });
      dot.addEventListener('blur', hideTip);
    });
  };

  const render = () => {
    const list = filtered();
    renderGenres();
    renderKpis(list);
    if (!list.length) {
      grid.hidden = true;
      emptyNode.hidden = false;
      return;
    }
    emptyNode.hidden = true;
    grid.hidden = false;
    renderTop(list);
    renderDonut(list);
    renderHist(list);
    renderScatter(list);
  };

  root.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((button) => {
    button.addEventListener('click', () => {
      kind = button.dataset.kind as KindFilter;
      root.querySelectorAll('[data-kind]').forEach((b) => b.classList.toggle('is-active', b === button));
      if (genre !== 'all' && !titles.some((t) => (kind === 'all' || t.kind === kind) && t.genre === genre)) {
        genre = 'all';
      }
      render();
    });
  });

  genresNode.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-genre]');
    if (!button) return;
    genre = button.dataset.genre ?? 'all';
    render();
  });

  $('#rt-query', root)?.addEventListener('input', (event) => {
    query = (event.target as HTMLInputElement).value;
    render();
  });

  $('#rt-sort', root)?.addEventListener('change', (event) => {
    sort = (event.target as HTMLSelectElement).value as SortKey;
    render();
  });

  const reset = () => {
    kind = 'all';
    genre = 'all';
    query = '';
    sort = 'rating';
    const search = $<HTMLInputElement>('#rt-query', root);
    if (search) search.value = '';
    const sortSelect = $<HTMLSelectElement>('#rt-sort', root);
    if (sortSelect) sortSelect.value = 'rating';
    root.querySelectorAll('[data-kind]').forEach((b) => b.classList.toggle('is-active', (b as HTMLElement).dataset.kind === 'all'));
    render();
  };

  $('#rt-reset', root)?.addEventListener('click', reset);
  $('#rt-empty-reset', root)?.addEventListener('click', reset);

  document.addEventListener('scroll', hideTip, { passive: true });

  render();

  return () => {
    document.removeEventListener('scroll', hideTip);
  };
}

