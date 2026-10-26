import { icon } from '../core/icons';
import { projects } from '../data/projects';
import { navigate } from '../core/router';
import { $, $$ } from '../core/dom';

interface Item {
  label: string;
  hint?: string;
  group: string;
  icon: string;
  run: () => void;
  keywords?: string;
}

let open = false;

function buildItems(): Item[] {
  const appItems: Item[] = projects.map((p) => ({
    label: p.title,
    hint: p.tags[0],
    group: 'Приложения',
    icon: p.icon,
    keywords: `${p.tags.join(' ')} ${p.tagline} ${p.slug}`,
    run: () => navigate(`/app/${p.slug}`),
  }));

  const pages: Item[] = [
    { label: 'Главная', hint: 'landing', group: 'Навигация', icon: 'sparkles', run: () => navigate('/') },
    { label: 'Все проекты', hint: 'сетка', group: 'Навигация', icon: 'layers', run: () => goToProjects() },
    { label: 'Локальный архив', hint: 'C:\\Projects\\WEB', group: 'Навигация', icon: 'archive', run: () => navigate('/archive') },
    { label: 'О проекте', hint: 'стек и принципы', group: 'Навигация', icon: 'info', run: () => navigate('/about') },
    {
      label: 'Случайный проект',
      hint: 'dice',
      group: 'Действия',
      icon: 'dice',
      run: () => navigate(`/app/${projects[Math.floor(Math.random() * projects.length)].slug}`),
    },
    {
      label: 'Переключить тему',
      hint: 'dark / light',
      group: 'Действия',
      icon: 'sun',
      keywords: 'theme light dark тёмная светлая',
      run: () => document.getElementById('theme-toggle')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
    },
    {
      label: 'Открыть GitHub репозиторий',
      hint: '↗',
      group: 'Действия',
      icon: 'github',
      keywords: 'source code исходники',
      run: () => window.open('https://github.com/d1m40fficial/web-projects', '_blank', 'noopener'),
    },
  ];

  return [...appItems, ...pages];
}

function goToProjects(): void {
  if (location.hash === '#/' || location.hash === '') {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  navigate('/');
  setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 260);
}

function score(item: Item, query: string): number {
  if (!query) return 1;
  const haystack = `${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`.toLowerCase();
  const q = query.toLowerCase().trim();
  if (haystack.includes(q)) {
    const idx = haystack.indexOf(q);
    return 100 - idx + (item.label.toLowerCase().startsWith(q) ? 50 : 0);
  }
  // subsequence match keeps "sky" -> "Карта звёздного неба" impossible, but
  // lets latin slug prefixes match even with typos in spacing.
  let qi = 0;
  for (const ch of haystack) {
    if (ch === q[qi]) qi++;
    if (qi === q.length) return 20;
  }
  return 0;
}

export function openCommandPalette(): void {
  if (open) return;
  open = true;

  const host = document.getElementById('modal-root');
  if (!host) return;
  const previousFocus = document.activeElement as HTMLElement | null;

  const root = document.createElement('div');
  root.className = 'cmdk';
  root.innerHTML = `
    <div class="cmdk__box" role="dialog" aria-modal="true" aria-label="Поиск по проектам">
      <div class="cmdk__input-wrap">
        ${icon('search')}
        <input class="cmdk__input" type="text" placeholder="Найти приложение, страницу или действие…" autocomplete="off" spellcheck="false" aria-label="Поиск" />
        <kbd class="tag">Esc</kbd>
      </div>
      <div class="cmdk__list" role="listbox"></div>
      <div class="cmdk__foot">
        <span><kbd>↑</kbd> <kbd>↓</kbd> навигация</span>
        <span><kbd>Enter</kbd> открыть</span>
        <span><kbd>Esc</kbd> закрыть</span>
        <span style="margin-left:auto">${projects.length} приложений</span>
      </div>
    </div>
  `;
  host.appendChild(root);
  document.body.classList.add('is-locked');

  const input = $<HTMLInputElement>('.cmdk__input', root);
  const list = $<HTMLElement>('.cmdk__list', root);
  let active = 0;
  let current: Item[] = [];

  const close = () => {
    root.remove();
    document.body.classList.remove('is-locked');
    open = false;
    document.removeEventListener('keydown', onKey, true);
    previousFocus?.focus?.({ preventScroll: true });
  };

  const render = () => {
    const q = input.value.trim();
    current = buildItems()
      .map((item) => ({ item, s: score(item, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);

    active = Math.min(active, Math.max(0, current.length - 1));
    if (!current.length) {
      list.innerHTML = `<p style="padding:28px 16px;color:var(--dim);text-align:center">Ничего не найдено</p>`;
      return;
    }

    let html = '';
    let group = '';
    current.forEach((item, index) => {
      if (item.group !== group) {
        group = item.group;
        html += `<div class="cmdk__group">${group}</div>`;
      }
      html += `
        <button class="cmdk__item ${index === active ? 'is-active' : ''}" data-index="${index}" role="option" aria-selected="${index === active}">
          <span class="cmdk__icon">${icon(item.icon)}</span>
          <span class="cmdk__label">${item.label}</span>
          ${item.hint ? `<span class="cmdk__hint">${item.hint}</span>` : ''}
        </button>`;
    });
    list.innerHTML = html;
    list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  };

  const runActive = () => {
    const item = current[active];
    if (!item) return;
    close();
    item.run();
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      active = (active + 1) % Math.max(1, current.length);
      render();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active - 1 + current.length) % Math.max(1, current.length);
      render();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runActive();
    } else if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  input.addEventListener('input', () => {
    active = 0;
    render();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (!button) return;
    active = Number(button.dataset.index);
    runActive();
  });

  list.addEventListener('pointermove', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (!button) return;
    const idx = Number(button.dataset.index);
    if (idx !== active) {
      active = idx;
      $$('.cmdk__item', list).forEach((n, i) => n.classList.toggle('is-active', i === idx));
    }
  });

  root.addEventListener('click', (event) => {
    if (event.target === root) close();
  });

  document.addEventListener('keydown', onKey, true);
  render();
  input.focus();
}
