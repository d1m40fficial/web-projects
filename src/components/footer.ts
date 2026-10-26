import { icon } from '../core/icons';
import { projects } from '../data/projects';
import { PAGES_URL, REPO_URL } from '../core/env';

export function renderFooter(): void {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const topProjects = projects.slice(0, 6);

  footer.innerHTML = `
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <a class="logo" href="#/">
            <span class="logo__mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad-f)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <defs><linearGradient id="logo-grad-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/></linearGradient></defs>
                <path d="M4 7l3.6 10L12 9.5 16.4 17 20 7"/>
              </svg>
            </span>
            <span>web<span class="logo__slash">/</span>lab</span>
          </a>
          <p>Один репозиторий — двенадцать живых приложений. TypeScript, Canvas, Web APIs и ноль бэкенда. Собрано как витрина фронтенд-навыков.</p>
          <span class="footer__status"><span class="status-dot"></span> Все системы работают · статический хостинг</span>
        </div>

        <div>
          <h3 class="footer__title">Приложения</h3>
          <div class="footer__list">
            ${topProjects.map((p) => `<a href="#/app/${p.slug}">${p.title}</a>`).join('')}
          </div>
        </div>

        <div>
          <h3 class="footer__title">Разделы</h3>
          <div class="footer__list">
            <a href="#/archive">Локальный архив</a>
            <a href="#/about">О проекте</a>
            <a href="${REPO_URL}" target="_blank" rel="noopener">README на GitHub</a>
            <a href="${REPO_URL}/issues" target="_blank" rel="noopener">Сообщить о баге</a>
            <a href="${PAGES_URL}" target="_blank" rel="noopener">GitHub Pages</a>
          </div>
        </div>

        <div>
          <h3 class="footer__title">На связи</h3>
          <div class="footer__list">
            <a href="https://github.com/d1m40fficial" target="_blank" rel="noopener">github.com/d1m40fficial</a>
            <a href="${REPO_URL}/blob/main/README.md" target="_blank" rel="noopener">README проекта</a>
          </div>
          <div class="footer__clock" data-clock>
            <span class="status-dot" style="background:var(--cyan);box-shadow:0 0 0 4px rgba(56,224,242,.12)"></span>
            <span class="mono">--:--:-- MSK</span>
          </div>
          <div class="footer__badges">
            <span class="tag">${icon('code')} TypeScript</span>
            <span class="tag">${icon('layers')} Vite</span>
            <span class="tag">${icon('globe')} GitHub Pages</span>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} web/lab · сделано вручную, без конструкторов</span>
        <span class="footer__meta">
          <span>${projects.length} приложений · 0 бэкенда</span>
          <a href="#/" class="footer__top">Наверх ↑</a>
        </span>
      </div>
    </div>
  `;

  const clock = footer.querySelector<HTMLElement>('[data-clock] span:last-child');
  const tick = () => {
    if (!clock) return;
    clock.textContent = `${new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())} MSK`;
  };
  tick();
  setInterval(tick, 1000);

  footer.querySelector<HTMLAnchorElement>('.footer__top')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.hash !== '#/') location.hash = '#/';
  });
}
