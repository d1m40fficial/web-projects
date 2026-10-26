import { icon } from '../core/icons';
import { bindTilt, observeReveals } from '../core/motion';
import { projects, type Project } from '../data/projects';
import { REPO_URL } from '../core/env';
import { escapeHtml } from '../core/dom';
import type { Cleanup } from '../core/router';
import '../styles/apps.css';

const categoryLabel: Record<string, string> = {
  tools: 'инструменты',
  games: 'игры',
  data: 'данные',
  experiments: 'эксперименты',
};

export async function renderProjectPage(view: HTMLElement, project: Project): Promise<Cleanup | void> {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  view.innerHTML = `
    <section class="app-page" style="--ac1:${project.c1};--ac2:${project.c2}">
      <div class="wrap">
        <nav class="crumbs" aria-label="Хлебные крошки">
          <a href="#/">web/lab</a>
          <span>/</span>
          <a href="#/">проекты</a>
          <span>/</span>
          <span class="crumbs__current">${project.title}</span>
        </nav>

        <header class="app-head">
          <div class="app-head__icon">${icon(project.icon)}</div>
          <div class="app-head__text">
            <span class="eyebrow">приложение ${project.index} · ${categoryLabel[project.category]}</span>
            <h1 class="app-title">${project.title}</h1>
            <p class="app-lead">${project.description}</p>
            <div class="app-head__tags">
              ${project.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
              <a class="tag tag--link" href="${REPO_URL}/tree/main/src/apps/${project.slug}" target="_blank" rel="noopener">
                ${icon('github')} исходники
              </a>
            </div>
          </div>
          <div class="app-head__num" aria-hidden="true">${project.index}</div>
        </header>

        <div class="app-frame" id="app-frame" aria-busy="true">
          <div class="app-loading">
            <span class="app-loading__spinner"></span>
            <span>загружаем ${project.title.toLowerCase()}…</span>
          </div>
        </div>

        <section class="under-hood">
          <div class="under-hood__head">
            <span class="eyebrow">под капотом</span>
            <h2 class="h2" style="font-size:clamp(1.4rem,2.4vw,2rem)">Как это устроено</h2>
          </div>
          <div class="note-grid">
            ${project.notes
              .map(
                (note, i) => `
              <article class="note-card reveal">
                <span class="note-card__num">0${i + 1}</span>
                <h3>${note.title}</h3>
                <p>${note.text}</p>
              </article>`,
              )
              .join('')}
          </div>
        </section>

        <nav class="app-pager" aria-label="Другие проекты">
          <a class="pager-card" href="#/app/${prev.slug}">
            <span class="pager-card__dir">${icon('arrowLeft')} предыдущий</span>
            <span class="pager-card__title">${prev.title}</span>
            <span class="tag">${prev.tags[0]}</span>
          </a>
          <a class="pager-card pager-card--next" href="#/app/${next.slug}">
            <span class="pager-card__dir">следующий ${icon('arrow')}</span>
            <span class="pager-card__title">${next.title}</span>
            <span class="tag">${next.tags[0]}</span>
          </a>
        </nav>
      </div>
    </section>
  `;

  const frame = view.querySelector<HTMLElement>('#app-frame');
  if (!frame) return;

  try {
    const module = await project.load();
    frame.innerHTML = '';
    frame.removeAttribute('aria-busy');
    const cleanup = module.mount(frame);

    observeReveals(view);
    bindTilt(frame);

    return () => {
      try {
        cleanup?.();
      } catch (error) {
        console.error('app cleanup failed', error);
      }
    };
  } catch (error) {
    console.error(error);
    frame.classList.add('app-frame--error');
    frame.removeAttribute('aria-busy');
    frame.innerHTML = `
      <div class="app-error">
        <span class="app-error__icon">${icon('warning')}</span>
        <h2>Приложение не загрузилось</h2>
        <p>${escapeHtml((error as Error).message || 'Неизвестная ошибка')}</p>
        <button class="btn" type="button" onclick="location.reload()">Перезагрузить</button>
      </div>
    `;
  }
}
