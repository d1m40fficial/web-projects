import { icon } from './icons';

export const themeToggleMarkup = (): string => `
  <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Переключить тему" title="Переключить тему">
    ${icon('sun', 'icon-sun')}
    ${icon('moon', 'icon-moon')}
  </button>
`;

export function applyTheme(theme: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#f5f3ee' : '#07070c';
}

export function initTheme(): void {
  const saved = (() => {
    try {
      return localStorage.getItem('wl.theme') as 'dark' | 'light' | null;
    } catch {
      return null;
    }
  })();
  if (saved) applyTheme(saved);

  const button = document.getElementById('theme-toggle');
  button?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem('wl.theme', next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('wl:theme', { detail: next }));
  });
}
