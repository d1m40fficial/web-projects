import { asset, REPO_URL } from '../../core/env';
import { icon } from '../../core/icons';
import { escapeHtml } from '../../core/dom';
import { openModal } from '../../core/modal';
import { legacyProjects, type LegacyProject } from '../../data/projects';

function play(project: LegacyProject): void {
  if (!project.href) return;
  const src = asset(project.href);
  const dialog = openModal({
    title: project.title,
    subtitle: project.meta,
    wide: true,
    flush: true,
    body: `<iframe class="legacy-frame" src="${src}" title="${escapeHtml(project.title)}" allow="fullscreen; autoplay; gamepad; clipboard-write; pointer-lock"></iframe>`,
    footer: `
      <a class="btn btn--sm btn--ghost" href="${src}" target="_blank" rel="noopener">${icon('external')} Новая вкладка</a>
      <button class="btn btn--sm" type="button" data-close-modal>Закрыть · Esc</button>
    `,
  });
  dialog.body.querySelector('iframe')?.focus();
  dialog.root.querySelector('[data-close-modal]')?.addEventListener('click', () => dialog.close());
}

export function galleryMarkup(): string {
  const playable = legacyProjects.filter((p) => p.playable).length;
  const python = legacyProjects.length - playable;

  return `
    <div class="archive-intro">
      <span class="pill">${icon('play')} ${playable} запускаются здесь</span>
      <span class="pill">${icon('code')} ${python} python-проекта в исходниках</span>
      <span class="pill">${icon('archive')} ${legacyProjects.length} всего</span>
    </div>

    <div class="legacy-tabs segmented" role="tablist" aria-label="Категории архива">
      <button class="is-active" type="button" data-legacy-filter="all">Все <span class="chip__count">${legacyProjects.length}</span></button>
      <button type="button" data-legacy-filter="playable">Играбельные <span class="chip__count">${playable}</span></button>
      <button type="button" data-legacy-filter="python">Python <span class="chip__count">${python}</span></button>
    </div>

    <div class="legacy-grid">
      ${legacyProjects
        .map((p) => {
          const search = `${p.title} ${p.description} ${p.tech.join(' ')}`.toLowerCase();
          return `
            <article class="lgcard" data-legacy-card data-kind="${p.playable ? 'playable' : 'python'}" data-search="${escapeHtml(search)}" style="--c1:${p.c1};--c2:${p.c2}">
              <div class="lgcard__art">
                <span class="lgcard__emoji">${p.emoji}</span>
                <span class="lgcard__meta">${p.meta}</span>
                <span class="lgcard__kind">${p.playable ? 'run in browser' : 'source only'}</span>
              </div>
              <div class="lgcard__body">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="lgcard__tags">${p.tech.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
                <div class="lgcard__actions">
                  ${
                    p.playable
                      ? `<button class="btn btn--sm btn--primary" type="button" data-play="${p.slug}">${icon('play')} Запустить</button>
                         <a class="btn btn--sm btn--ghost" href="${asset(p.href!)}" target="_blank" rel="noopener" title="Открыть в новой вкладке">${icon('external')}</a>`
                      : `<a class="btn btn--sm" href="${REPO_URL}/tree/main/${p.source}" target="_blank" rel="noopener">${icon('code')} Исходники</a>`
                  }
                </div>
              </div>
            </article>`;
        })
        .join('')}
      <a class="lgcard lgcard--cta" href="${REPO_URL}" target="_blank" rel="noopener" data-cta>
        <span class="lgcard__cta-icon">${icon('plus')}</span>
        <span class="lgcard__cta-title">Здесь может быть ваш проект</span>
        <span class="lgcard__cta-text">Репозиторий открыт для форков и pull request. Весь архив лежит в <code>public/legacy</code>.</span>
        <span class="lgcard__cta-link">${icon('github')} Открыть GitHub</span>
      </a>
    </div>
  `;
}

export function bindGallery(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-legacy-card]'));
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-legacy-filter]'));
  const cta = root.querySelector<HTMLElement>('[data-cta]');

  const onClick = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-play]');
    if (!button) return;
    const project = legacyProjects.find((p) => p.slug === button.dataset.play);
    if (project) play(project);
  };
  root.addEventListener('click', onClick);

  const tabHandlers = tabs.map((tab) => {
    const handler = () => {
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      const filter = tab.dataset.legacyFilter;
      cards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.kind !== filter;
      });
      if (cta) cta.hidden = filter !== 'all';
    };
    tab.addEventListener('click', handler);
    return () => tab.removeEventListener('click', handler);
  });

  return () => {
    root.removeEventListener('click', onClick);
    tabHandlers.forEach((off) => off());
  };
}

export function mountArchiveGallery(root: HTMLElement): () => void {
  root.innerHTML = `
    <div class="archive-app">
      ${galleryMarkup()}
      <p class="help archive-app__note">
        ${icon('info')} Игры встроены через iframe и работают изолированно. Python-проекты не исполняются на GitHub Pages —
        откройте их исходники в репозитории.
      </p>
    </div>
  `;
  return bindGallery(root);
}
