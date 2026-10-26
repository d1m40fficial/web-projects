import { icon } from '../core/icons';
import { themeToggleMarkup, initTheme } from '../core/theme';
import { $, $$ } from '../core/dom';
import { navigate } from '../core/router';
import { openCommandPalette } from './commandPalette';

export function renderNav(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav__inner">
      <a class="logo" href="#/" aria-label="web/lab — на главную">
        <span class="logo__mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/>
              </linearGradient>
            </defs>
            <path d="M4 7l3.6 10L12 9.5 16.4 17 20 7"/>
          </svg>
        </span>
        <span>web<span class="logo__slash">/</span>lab</span>
        <span class="logo__ver">v1.0</span>
      </a>

      <nav class="nav__links" aria-label="Основная навигация">
        <a class="nav__link" href="#/" data-nav="/">Главная</a>
        <a class="nav__link" href="#/" data-scroll="projects" data-nav="projects">Проекты</a>
        <a class="nav__link" href="#/archive" data-nav="/archive">Архив</a>
        <a class="nav__link" href="#/about" data-nav="/about">О проекте</a>
        <a class="nav__link nav__ext" href="https://github.com/d1m40fficial/web-projects" target="_blank" rel="noopener">GitHub ${icon('arrowUpRight')}</a>
      </nav>

      <div class="nav__actions">
        <button class="kbd-btn" id="open-cmdk" type="button" aria-label="Открыть поиск">
          ${icon('search')}<span>Поиск</span><kbd>Ctrl K</kbd>
        </button>
        ${themeToggleMarkup()}
        <button class="nav__burger" id="nav-burger" type="button" aria-label="Меню" aria-expanded="false"><span></span></button>
      </div>
    </div>
  `;

  initTheme();

  nav.querySelector('.logo')?.addEventListener('click', (event) => {
    if (location.hash === '#/' || location.hash === '') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const burger = $('#nav-burger');
  burger?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  $('#open-cmdk')?.addEventListener('click', openCommandPalette);

  $$<HTMLAnchorElement>('[data-scroll="projects"]', nav).forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      nav.classList.remove('is-open');
      if (location.hash === '#/' || location.hash === '') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate('/');
        setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    });
  });

  $$<HTMLAnchorElement>('.nav__link[href^="#/"]', nav).forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

export function setActiveNav(path: string): void {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const root = path === '/';
  const app = path.startsWith('/app/');
  $$<HTMLElement>('[data-nav]', nav).forEach((link) => {
    let active = false;
    if (root) active = link.dataset.nav === '/';
    else if (app) active = link.dataset.nav === 'projects';
    else active = link.dataset.nav === path;
    link.classList.toggle('is-active', active);
  });
}

export function initGlobalKeys(): void {
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    const typing = target.matches('input, textarea, [contenteditable="true"], select');
    const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (commandK) {
      event.preventDefault();
      openCommandPalette();
      return;
    }
    if (typing) return;
    if (event.key === '/') {
      event.preventDefault();
      openCommandPalette();
    }
  });
}
