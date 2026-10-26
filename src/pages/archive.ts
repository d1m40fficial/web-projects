import { icon } from '../core/icons';
import { observeReveals, bindTilt } from '../core/motion';
import { mountArchiveGallery } from '../apps/archive/gallery';
import { legacyProjects } from '../data/projects';
import { REPO_URL } from '../core/env';
import '../styles/apps.css';
import '../styles/archive.css';

export function mountArchivePage(root: HTMLElement): () => void {
  const playable = legacyProjects.filter((p) => p.playable).length;

  root.innerHTML = `
    <section class="archive-page">
      <div class="wrap">
        <nav class="crumbs" aria-label="Хлебные крошки">
          <a href="#/">web/lab</a><span>/</span><span class="crumbs__current">локальный архив</span>
        </nav>

        <header class="archive-head">
          <div>
            <span class="eyebrow">из папки C:\\Projects\\WEB</span>
            <h1 class="archive-title">Локальный <span class="grad-text">архив</span></h1>
            <p class="archive-lead">
              Проекты, написанные до этой витрины: canvas-игры, судоку, таймер и звёздное поле.
              Девять из них запускаются прямо в браузере, Python-инструменты открыты как исходники.
            </p>
            <div class="archive-head__meta">
              <span class="pill">${icon('archive')} ${legacyProjects.length} проектов</span>
              <span class="pill">${icon('play')} ${playable} играбельных</span>
              <span class="pill">${icon('code')} vanilla JS & Python</span>
            </div>
          </div>
          <a class="btn btn--ghost" href="${REPO_URL}/tree/main/legacy-src" target="_blank" rel="noopener">
            ${icon('github')} legacy-src
          </a>
        </header>

        <div class="archive-body" id="archive-gallery"></div>

        <div class="archive-foot">
          <p class="help">
            ${icon('info')} Оригинальные файлы лежат в <code>public/legacy</code> без изменений.
            Python-проекты — в <code>legacy-src</code>.
          </p>
          <a class="link-arrow" href="#/app/archive">Открыть как приложение ${icon('arrow')}</a>
        </div>
      </div>
    </section>
  `;

  const gallery = root.querySelector<HTMLElement>('#archive-gallery');
  const cleanup = gallery ? mountArchiveGallery(gallery) : undefined;

  observeReveals(root);
  bindTilt(root);

  return () => cleanup?.();
}
