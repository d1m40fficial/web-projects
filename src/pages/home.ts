import { $, $$, escapeHtml } from '../core/dom';
import { icon } from '../core/icons';
import { bindTilt, observeCounters, observeReveals } from '../core/motion';
import { navigate } from '../core/router';
import { projects, legacyProjects, categories } from '../data/projects';
import { previewMarkup } from '../components/previews';
import { REPO_URL } from '../core/env';
import '../styles/home.css';

const ROTATING = ['живых', 'полезных', 'странных', 'красивых'];

function heroMarkup(): string {
  return `
    <section class="hero" id="top">
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <div class="eyebrow eyebrow--pill hero__eyebrow reveal">
            <span class="status-dot"></span>
            7 приложений · один репозиторий
          </div>

          <h1 class="hero__title">
            <span class="hero__line"><span class="hero__word">Семь</span></span>
            <span class="hero__line hero__line--rot">
              <span class="hero__rotator" aria-live="off">
                ${ROTATING.map((w, i) => `<span class="${i === 0 ? 'is-on' : ''}">${w}</span>`).join('')}
              </span>
            </span>
            <span class="hero__line"><span class="hero__word">веб-идей<span class="hero__dot">.</span></span></span>
          </h1>

          <p class="hero__lead reveal">
            Приложения и игры — от генератора паролей до 2048 и архива старых экспериментов.
            Всё работает прямо в браузере: без бэкенда, регистрации и API-ключей.
          </p>

          <div class="hero__actions reveal">
            <button class="btn btn--primary" type="button" data-scroll="projects">
              Смотреть проекты ${icon('arrow')}
            </button>
            <button class="btn btn--ghost" type="button" id="random-app">
              Мне повезёт ${icon('dice')}
            </button>
          </div>

          <div class="hero__chips reveal">
            <span class="tag">${icon('code')} TypeScript</span>
            <span class="tag">${icon('layers')} Canvas & SVG</span>
            <span class="tag">${icon('globe')} Web APIs</span>
            <span class="tag">${icon('lock')} 100% client-side</span>
          </div>
        </div>

        <div class="hero__visual reveal">
          <div class="stage" data-parallax>
            <div class="stage__glow"></div>
            <div class="stage__chrome">
              <span class="stage__dots"><i></i><i></i><i></i></span>
              <span class="stage__url">web-lab<span class="stage__slash">/</span>apps</span>
              <span class="stage__chrome-tag">${icon('lock')} live</span>
            </div>

            <div class="stage__screen">
              <div class="hero-scene is-active" data-scene="password">
                <div class="hs-head">
                  <span class="hs-label">пароль · 20 символов</span>
                  <span class="hs-live"><i></i> 131 бит</span>
                </div>
                <div class="hs-pass">N7$vK!mQ2#Lx<span class="hs-caret"></span></div>
                <div class="hs-pass__bar"><i></i><i></i><i></i><i></i></div>
                <div class="hs-pass__meta"><span>crypto.getRandomValues</span><span>взлом: дольше Вселенной</span></div>
              </div>

              <div class="hero-scene" data-scene="2048">
                <div class="hs-head"><span class="hs-label">2048 · рекорд 4 096</span><span class="hs-score">1 024</span></div>
                <div class="hs-2048">
                  ${[2, 4, 0, 8, 0, 16, 4, 0, 2, 8, 32, 4, 0, 64, 128, 256]
                    .map((v) => `<span class="${v ? `v${v}` : ''}">${v || ''}</span>`)
                    .join('')}
                </div>
                <p class="hs-hint">${icon('keyboard')} стрелки · свайпы · отмена</p>
              </div>

              <div class="hero-scene" data-scene="memory">
                <div class="hs-head"><span class="hs-label">memory · 4×4</span><span class="hs-score">12 ходов</span></div>
                <div class="hs-memory">
                  ${['◆', '●', '▲', '■', '◆', '●', '▲', '■', '✦', '✧', '✦', '✧', '◇', '◈', '◇', '◈']
                    .map((s, i) => `<span class="hs-mem ${i === 0 || i === 8 ? 'is-open' : ''} ${i === 2 || i === 3 ? 'is-done' : ''}">${s}</span>`)
                    .join('')}
                </div>
                <p class="hs-hint">3D-переворот · рекорды</p>
              </div>

              <div class="hero-scene" data-scene="palette">
                <div class="hs-head"><span class="hs-label">палитра · аналоговая</span><span class="hs-live">WCAG AA</span></div>
                <div class="hs-palette">
                  ${['#0b0b12', '#3b2f6b', '#8b6bff', '#38e0f2', '#c4f56a']
                    .map((c) => `<div style="background:${c}"><span>${c}</span></div>`)
                    .join('')}
                </div>
                <div class="hs-palette-foot">
                  <span class="tag">пробел — заново</span>
                  <span class="tag">экспорт CSS</span>
                </div>
              </div>
            </div>

            <div class="stage__tabs" role="tablist" aria-label="Превью приложений">
              <button class="stage__tab is-active" type="button" data-scene-btn="password" role="tab" aria-selected="true">пароль</button>
              <button class="stage__tab" type="button" data-scene-btn="2048" role="tab" aria-selected="false">2048</button>
              <button class="stage__tab" type="button" data-scene-btn="memory" role="tab" aria-selected="false">память</button>
              <button class="stage__tab" type="button" data-scene-btn="palette" role="tab" aria-selected="false">цвет</button>
            </div>
          </div>

          <div class="hero__float hero__float--a"><span class="tag">${icon('sparkles')} 7 apps</span></div>
          <div class="hero__float hero__float--b"><span class="tag">${icon('github')} open source</span></div>
        </div>
      </div>

      <div class="wrap hero__stats">
        <div class="stat reveal"><b><span data-count="7">0</span></b><span>интерактивных приложений</span></div>
        <div class="stat reveal"><b><span data-count="9">0</span></b><span>играбельных архивов</span></div>
        <div class="stat reveal"><b><span data-count="0">0</span></b><span>бэкенда в работе</span></div>
        <div class="stat reveal"><b><span data-count="100" data-suffix="%">0</span></b><span>работает в браузере</span></div>
      </div>
    </section>
  `;
}

function marqueeMarkup(): string {
  const items = [
    'TypeScript',
    'Canvas 2D',
    'Web Crypto',
    'localStorage',
    'SVG charts',
    'CSS 3D',
    'Vite',
    'Game logic',
    'Web Animations API',
    'WCAG contrast',
    'IntersectionObserver',
    'Responsive design',
    'prefers-reduced-motion',
  ];
  const row = (list: string[], reverse = false) => `
    <div class="marquee ${reverse ? 'marquee--reverse' : ''}">
      <div class="marquee__track">
        ${[...list, ...list].map((item) => `<span class="marquee__item"><i></i>${item}</span>`).join('')}
      </div>
    </div>`;
  return `
    <section class="tech-strip" aria-label="Технологии">
      ${row(items.slice(0, 8))}
      ${row(items.slice(8), true)}
    </section>
  `;
}

function cardMarkup(slug: string): string {
  const p = projects.find((x) => x.slug === slug)!;
  const search = `${p.title} ${p.tagline} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
  return `
    <a class="pcard reveal" href="#/app/${p.slug}" data-tilt data-cat="${p.category}" data-search="${escapeHtml(search)}"
       style="--c1:${p.c1};--c2:${p.c2}">
      <span class="pcard__spot"></span>
      <div class="pcard__thumb">
        ${previewMarkup(p.slug)}
        <span class="pcard__num">${p.index}</span>
        <span class="pcard__status"><i></i>живое</span>
      </div>
      <div class="pcard__body">
        <div class="pcard__heading">
          <span class="pcard__mini-icon">${icon(p.icon)}</span>
          <h3>${p.title}</h3>
          <span class="pcard__arrow">${icon('arrowUpRight')}</span>
        </div>
        <p>${p.tagline}</p>
        <div class="pcard__tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </a>`;
}

function projectsMarkup(): string {
  return `
    <section class="section" id="projects">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">коллекция</span>
            <h2 class="h2">Семь <span class="grad-text">живых</span> проектов</h2>
            <p class="lead" style="margin-top:16px">
              Каждая карточка — отдельное приложение со своей логикой, состоянием и визуальным языком.
              Нажмите, чтобы открыть вживую.
            </p>
          </div>
          <a class="link-arrow" href="${REPO_URL}" target="_blank" rel="noopener">
            Исходный код ${icon('github')}
          </a>
        </div>

        <div class="collection-bar reveal">
          <div class="filters" role="group" aria-label="Фильтр проектов">
            ${categories
              .map(
                (c) =>
                  `<button class="chip ${c.id === 'all' ? 'is-active' : ''}" type="button" data-filter="${c.id}">
                    ${c.label}<span class="chip__count">${c.id === 'all' ? projects.length : projects.filter((p) => p.category === c.id).length}</span>
                  </button>`,
              )
              .join('')}
          </div>
          <label class="search-box">
            ${icon('search')}
            <input type="search" id="project-search" placeholder="Фильтр по названию или технологии…" aria-label="Поиск по проектам" />
          </label>
        </div>

        <div class="project-grid" id="project-grid">
          ${projects.map((p) => cardMarkup(p.slug)).join('')}
        </div>
        <p class="grid-empty" id="grid-empty" hidden>Ничего не нашлось. Попробуйте «canvas» или сбросьте фильтр.</p>
      </div>
    </section>
  `;
}

function splitMarkup(): string {
  const separate = [
    { name: 'QR Studio', note: 'QR-коды · печатный стиль', href: 'https://d1m40fficial.github.io/qr-studio/', color: '#ff4b2b' },
    { name: 'Атмосфера', note: 'погода · Gismeteo', href: 'https://d1m40fficial.github.io/weather/', color: '#f2a65a' },
    { name: 'Orbita', note: 'карта звёздного неба', href: 'https://d1m40fficial.github.io/sky-map/', color: '#d7b56d' },
    { name: 'plain', note: 'минималистичный блокнот', href: 'https://d1m40fficial.github.io/notes/', color: '#8a857c' },
    { name: 'Расписание', note: 'пары преподавателей', href: 'https://d1m40fficial.github.io/teacher-schedule/', color: '#8c2f39' },
  ];
  return `
    <section class="section split" id="separate">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">отдельные репозитории</span>
            <h2 class="h2">Пять <span class="grad-text">отдельных</span> вселенных</h2>
            <p class="lead" style="margin-top:16px">
              QR, погода, небо, блокнот и расписание переехали в собственные репозитории — со своим характером и без общего дизайна.
            </p>
          </div>
        </div>
        <div class="split-grid">
          ${separate
            .map(
              (p) => `
              <a class="split-card" href="${p.href}" target="_blank" rel="noopener" style="--sc:${p.color}">
                <span class="split-card__dot"></span>
                <b>${p.name}</b>
                <span>${p.note}</span>
                <i>${icon('external')}</i>
              </a>`,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function archiveMarkup(): string {
  const playable = legacyProjects.filter((p) => p.playable);
  return `
    <section class="section archive-teaser" id="archive-teaser">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">из папки</span>
            <h2 class="h2">Локальный <span class="grad-text">архив</span></h2>
            <p class="lead" style="margin-top:16px">
              Проекты, которые жили на диске до этой витрины. Каждый запускается в песочнице прямо здесь.
            </p>
          </div>
          <a class="link-arrow" href="#/archive">Все ${legacyProjects.length} ${icon('archive')}</a>
        </div>

        <div class="archive-row">
          <div class="legacy-strip" id="legacy-strip">
            ${playable
              .map(
                (p) => `
                <a class="lcard" href="#/archive" style="--c1:${p.c1};--c2:${p.c2}">
                  <div class="lcard__art"><span>${p.emoji}</span><i class="lcard__scan"></i></div>
                  <div class="lcard__body">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="lcard__foot">
                      <span class="tag">${p.tech[0]}</span>
                      <span class="lcard__play">${icon('play')} играть</span>
                    </div>
                  </div>
                </a>`,
              )
              .join('')}
          </div>
          <div class="archive-row__nav">
            <button class="btn btn--icon" type="button" id="legacy-prev" aria-label="Назад">${icon('arrowLeft')}</button>
            <button class="btn btn--icon" type="button" id="legacy-next" aria-label="Вперёд">${icon('arrow')}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function principlesMarkup(): string {
  return `
    <section class="section principles">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">под капотом</span>
            <h2 class="h2">Красиво снаружи,<br /><span class="grad-text">честно внутри</span></h2>
          </div>
          <p class="lead" style="max-width:34ch">
            Никаких скриншотов вместо приложений и фейковых кнопок. Всё, что видно, действительно работает.
          </p>
        </div>
        <div class="principles__grid">
          <article class="principle reveal">
            <span class="principle__icon">${icon('globe')}</span>
            <h3>Ноль бэкенда</h3>
            <p>Состояние живёт в localStorage, данные приходят из открытых API, вычисления — на клиенте. GitHub Pages справляется.</p>
            <span class="principle__meta">static · offline-friendly</span>
          </article>
          <article class="principle reveal">
            <span class="principle__icon">${icon('code')}</span>
            <h3>Настоящие вычисления</h3>
            <p>Астрономия, геодезия, QR-кодирование, парсинг GPX и графики — написаны руками, а не спрятаны за чёрным ящиком.</p>
            <span class="principle__meta">math · parsers · canvas</span>
          </article>
          <article class="principle reveal">
            <span class="principle__icon">${icon('heart')}</span>
            <h3>Доступность и такт</h3>
            <p>Клавиатурная навигация, видимый фокус, контрастные палитры и уважение к prefers-reduced-motion.</p>
            <span class="principle__meta">a11y · motion-safe</span>
          </article>
        </div>
      </div>
    </section>
  `;
}

function ctaMarkup(): string {
  return `
    <section class="section section--tight">
      <div class="wrap">
        <div class="cta reveal">
          <div class="cta__noise"></div>
          <div class="cta__content">
            <span class="eyebrow eyebrow--pill">open source</span>
            <h2>Загляните <span class="grad-text">внутрь</span></h2>
            <p>Репозиторий, README и вся история — на GitHub. Форкайте, ломайте, улучшайте.</p>
          </div>
          <div class="cta__actions">
            <a class="btn btn--primary" href="${REPO_URL}" target="_blank" rel="noopener">${icon('github')} Открыть GitHub</a>
            <a class="btn btn--ghost" href="#/about">Как это сделано ${icon('arrow')}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountHome(root: HTMLElement): () => void {
  root.innerHTML = `
    ${heroMarkup()}
    ${marqueeMarkup()}
    ${projectsMarkup()}
    ${splitMarkup()}
    ${archiveMarkup()}
    ${principlesMarkup()}
    ${ctaMarkup()}
  `;

  observeReveals(root);
  observeCounters(root);
  bindTilt(root);

  /* rotating hero word */
  const words = $$<HTMLElement>('.hero__rotator span', root);
  let wordIndex = 0;
  const wordTimer = window.setInterval(() => {
    words[wordIndex]?.classList.remove('is-on');
    wordIndex = (wordIndex + 1) % words.length;
    words[wordIndex]?.classList.add('is-on');
  }, 2600);

  /* hero scene carousel */
  const scenes = $$<HTMLElement>('.hero-scene', root);
  const sceneButtons = $$<HTMLButtonElement>('[data-scene-btn]', root);
  let sceneIndex = 0;
  let sceneTimer = 0;

  const showScene = (name: string) => {
    scenes.forEach((scene) => scene.classList.toggle('is-active', scene.dataset.scene === name));
    sceneButtons.forEach((button) => {
      const active = button.dataset.sceneBtn === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    sceneIndex = Math.max(0, sceneButtons.findIndex((b) => b.dataset.sceneBtn === name));
  };

  const scheduleScenes = () => {
    window.clearInterval(sceneTimer);
    sceneTimer = window.setInterval(() => {
      const next = sceneButtons[(sceneIndex + 1) % sceneButtons.length];
      if (next?.dataset.sceneBtn) showScene(next.dataset.sceneBtn);
    }, 4600);
  };

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.sceneBtn) showScene(button.dataset.sceneBtn);
      scheduleScenes();
    });
  });
  scheduleScenes();

  /* random app */
  const random = $('#random-app', root);
  random?.addEventListener('click', () => {
    const choice = projects[Math.floor(Math.random() * projects.length)];
    random.animate(
      [
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-8deg) scale(0.96)' },
        { transform: 'rotate(6deg) scale(1.02)' },
        { transform: 'rotate(0deg) scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' },
    );
    window.setTimeout(() => navigate(`/app/${choice.slug}`), 180);
  });

  $$<HTMLElement>('[data-scroll="projects"]', root).forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* project filter + search */
  const grid = $('#project-grid', root);
  const cards = $$<HTMLElement>('.pcard', root);
  const empty = $('#grid-empty', root);
  const search = $<HTMLInputElement>('#project-search', root);
  const chips = $$<HTMLButtonElement>('[data-filter]', root);
  let category = 'all';
  let query = '';

  const applyFilter = () => {
    let visible = 0;
    cards.forEach((card) => {
      const catOk = category === 'all' || card.dataset.cat === category;
      const queryOk = !query || (card.dataset.search ?? '').includes(query);
      const show = catOk && queryOk;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        visible++;
        card.classList.add('is-in');
      }
    });
    if (empty) empty.hidden = visible > 0;
    if (grid) grid.style.setProperty('--count', String(visible));
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      category = chip.dataset.filter ?? 'all';
      applyFilter();
    });
  });

  search?.addEventListener('input', () => {
    query = search.value.trim().toLowerCase();
    applyFilter();
  });

  /* archive strip */
  const strip = $('#legacy-strip', root);
  $('#legacy-prev', root)?.addEventListener('click', () => strip?.scrollBy({ left: -340, behavior: 'smooth' }));
  $('#legacy-next', root)?.addEventListener('click', () => strip?.scrollBy({ left: 340, behavior: 'smooth' }));

  return () => {
    window.clearInterval(wordTimer);
    window.clearInterval(sceneTimer);
  };
}

