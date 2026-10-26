import { icon } from '../core/icons';
import { observeReveals } from '../core/motion';
import { REPO_URL, PAGES_URL } from '../core/env';
import '../styles/about.css';

const stack = [
  {
    icon: 'code',
    title: 'TypeScript, strict',
    text: 'Ни одного any в прикладной логике. Модули, типы домена, аккуратные границы между UI и вычислениями.',
    tags: ['TS 5', 'ES2022', 'typed DOM'],
  },
  {
    icon: 'layers',
    title: 'Vite без фреймворка',
    text: 'Свой hash-роутер, реестр приложений и ленивая загрузка чанков. Ни React, ни Vue — только платформа.',
    tags: ['Vite', 'code splitting', 'SPA'],
  },
  {
    icon: 'stars',
    title: 'Canvas и SVG',
    text: 'Звёздное небо, треки, 2048 и графики рисуются вручную: никаких готовых чарт-библиотек.',
    tags: ['Canvas 2D', 'SVG', 'DPR'],
  },
  {
    icon: 'globe',
    title: 'Настоящие Web APIs',
    text: 'Fetch, Web Crypto, Geolocation, Clipboard, FileReader, IntersectionObserver, Web Animations.',
    tags: ['fetch', 'crypto', 'files'],
  },
  {
    icon: 'palette',
    title: 'Дизайн-система на CSS',
    text: 'Токены, тёмная и светлая темы, адаптив, motion-safe режим и переиспользуемые компоненты.',
    tags: ['custom properties', 'a11y', 'responsive'],
  },
  {
    icon: 'archive',
    title: 'Ноль бэкенда',
    text: 'GitHub Pages раздаёт статику. Данные — публичные API и localStorage, поэтому демо живёт бесплатно.',
    tags: ['static', 'localStorage', 'Open-Meteo'],
  },
];

const skills = [
  'Архитектура SPA и ленивая загрузка модулей',
  'Canvas-рендеринг с devicePixelRatio и ResizeObserver',
  'Астрономические и геодезические расчёты',
  'Парсинг GPX, GeoJSON, CSV и Markdown',
  'Криптографически стойкая генерация',
  'Визуализация данных на чистом SVG',
  'Состояние, отмена действий и восстановление',
  'Доступность, фокус-менеджмент, reduced motion',
];

export function mountAbout(root: HTMLElement): void {
  root.innerHTML = `
    <section class="section about-hero">
      <div class="wrap">
        <span class="eyebrow">о проекте</span>
        <h1 class="about-title">Витрина, которая <span class="grad-text">не врёт</span></h1>
        <p class="about-lead">
          web/lab — не набор скриншотов и не мокапы. Это двенадцать работающих приложений,
          собранных в одном статическом сайте. Каждое можно открыть, потрогать и посмотреть,
          как оно устроено.
        </p>
        <div class="about-stats">
          <div><b>12</b><span>приложений</span></div>
          <div><b>11</b><span>архивных проектов</span></div>
          <div><b>0</b><span>бэкенда</span></div>
          <div><b>1</b><span>репозиторий</span></div>
        </div>
      </div>
    </section>

    <section class="section about-arch">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">архитектура</span>
            <h2 class="h2">Один вход, <span class="grad-text">много вселенных</span></h2>
          </div>
          <p class="lead" style="max-width:38ch">Каждое приложение — независимый модуль с функцией mount и очисткой ресурсов. Роутер подгружает только то, что нужно.</p>
        </div>

        <div class="arch">
          <div class="arch__node arch__node--browser">
            <span class="arch__icon">${icon('globe')}</span>
            <b>Браузер</b>
            <small>index.html + hash</small>
          </div>
          <span class="arch__arrow">→</span>
          <div class="arch__node arch__node--router">
            <span class="arch__icon">${icon('route')}</span>
            <b>Hash-роутер</b>
            <small>#/app/:slug</small>
          </div>
          <span class="arch__arrow">→</span>
          <div class="arch__node arch__node--lazy">
            <span class="arch__icon">${icon('layers')}</span>
            <b>Ленивый модуль</b>
            <small>import() + mount()</small>
          </div>

          <div class="arch__split">
            <div class="arch__leaf"><span>${icon('palette')}</span>Canvas / SVG</div>
            <div class="arch__leaf"><span>${icon('globe')}</span>Public APIs</div>
            <div class="arch__leaf"><span>${icon('lock')}</span>localStorage</div>
          </div>
        </div>

        <div class="arch__notes">
          <p><b>Почему hash?</b> GitHub Pages не умеет отдавать 404 на вложенные пути, зато отлично работает с <code>#/app/sky</code>.</p>
          <p><b>Почему без фреймворка?</b> Хотелось показать платформу: DOM, Canvas, события и CSS без прослойки.</p>
          <p><b>Что с размерами?</b> Главная не тянет код приложений: каждый модуль — отдельный чанк.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">стек</span>
            <h2 class="h2">Инструменты <span class="grad-text">по делу</span></h2>
          </div>
        </div>
        <div class="stack-grid">
          ${stack
            .map(
              (item) => `
            <article class="stack-card reveal">
              <span class="stack-card__icon">${icon(item.icon)}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              <div class="stack-card__tags">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
            </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap about-split">
        <div>
          <span class="eyebrow">навыки</span>
          <h2 class="h2" style="margin-bottom:26px">Что здесь <span class="grad-text">проверяется</span></h2>
          <ul class="checklist">
            ${skills.map((s) => `<li>${icon('check')}<span>${s}</span></li>`).join('')}
          </ul>
        </div>
        <aside class="honesty">
          <span class="eyebrow">честность</span>
          <h3>Ограничения, о которых стоит знать</h3>
          <ul>
            <li><b>Демо-данные.</b> Оценки фильмов и книг приблизительны и собраны для визуализации.</li>
            <li><b>Погода и города.</b> Зависят от Open-Meteo; без сети покажется кеш или ошибка.</li>
            <li><b>Архив.</b> Старые игры встроены как есть — их код не переписывался под витрину.</li>
            <li><b>Python-проекты.</b> Не запускаются на Pages; открыты как исходники в репозитории.</li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <div class="cta about-cta">
          <div class="cta__content">
            <span class="eyebrow eyebrow--pill">ссылки</span>
            <h2>Код, демо и <span class="grad-text">контакты</span></h2>
            <p>Репозиторий открыт. Если что-то сломалось — issue или pull request приветствуются.</p>
          </div>
          <div class="cta__actions">
            <a class="btn btn--primary" href="${REPO_URL}" target="_blank" rel="noopener">${icon('github')} GitHub</a>
            <a class="btn btn--ghost" href="${PAGES_URL}" target="_blank" rel="noopener">${icon('external')} Pages</a>
            <a class="btn btn--ghost" href="${REPO_URL}/blob/main/README.md" target="_blank" rel="noopener">${icon('notes')} README</a>
          </div>
        </div>
      </div>
    </section>
  `;

  observeReveals(root);
}

