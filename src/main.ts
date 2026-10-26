import '@fontsource-variable/manrope';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/jetbrains-mono';
import './styles/base.css';

import { $, $$ } from './core/dom';
import { icon } from './core/icons';
import { startRouter, type RouteResult } from './core/router';
import { initCursor, initScene } from './core/scene';
import { ambientParallax, initScrollFx, observeCounters, observeReveals, bindTilt } from './core/motion';
import { initGlobalKeys, renderNav, setActiveNav } from './components/nav';
import { renderFooter } from './components/footer';
import { mountHome } from './pages/home';
import { projectBySlug } from './data/projects';

const notFound: RouteResult = {
  title: '404',
  render: (view) => {
    view.innerHTML = `
      <section class="section not-found">
        <div class="wrap not-found__inner">
          <span class="not-found__code">404</span>
          <span class="eyebrow">потерялись в пространстве</span>
          <h1 class="h2">Такой страницы нет</h1>
          <p class="lead">Возможно, ссылка устарела. Вернитесь к коллекции — там всегда что-то движется.</p>
          <div class="hero__actions" style="margin-top:24px">
            <a class="btn btn--primary" href="#/">${icon('arrowLeft')} На главную</a>
            <a class="btn btn--ghost" href="#/archive">Архив</a>
          </div>
        </div>
      </section>
    `;
    observeReveals(view);
  },
};

const resolve = (path: string): RouteResult | null => {
  if (path === '/') {
    return {
      title: 'интерактивная витрина',
      render: (view) => mountHome(view),
    };
  }

  if (path === '/about') {
    return {
      title: 'О проекте',
      render: async (view) => {
        const { mountAbout } = await import('./pages/about');
        return mountAbout(view);
      },
    };
  }

  if (path === '/archive') {
    return {
      title: 'Локальный архив',
      render: async (view) => {
        const { mountArchivePage } = await import('./pages/archive');
        return mountArchivePage(view);
      },
    };
  }

  const appMatch = path.match(/^\/app\/([a-z0-9-]+)$/i);
  if (appMatch) {
    const project = projectBySlug(appMatch[1]);
    if (!project) return null;
    return {
      title: project.title,
      render: async (view) => {
        const { renderProjectPage } = await import('./pages/appPage');
        return renderProjectPage(view, project);
      },
    };
  }

  return null;
};

function boot(): void {
  renderNav();
  renderFooter();
  initScene();
  initCursor();
  initScrollFx();
  ambientParallax();
  initGlobalKeys();

  document.querySelector('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    $('#view')?.focus({ preventScroll: false });
  });

  const view = $('#view');
  if (!view) return;

  startRouter({
    view,
    resolve,
    fallback: notFound,
    onChange: (path) => {
      setActiveNav(path);
      $('#nav')?.classList.remove('is-open');
      observeReveals(view);
      if (!path.startsWith('/app/')) {
        // app pages are observed after their dynamic module mounts
        observeCounters(view);
        bindTilt(view);
      }
    },
  });

  // hide the boot screen once the first route painted
  requestAnimationFrame(() => {
    setTimeout(() => {
      $('#boot')?.classList.add('is-done');
      document.body.classList.add('is-ready');
    }, 320);
  });

  // keep the scene in sync with light/dark theme
  window.addEventListener('wl:theme', () => {
    $$('.scene__orb').forEach((orb) => orb.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' }));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
