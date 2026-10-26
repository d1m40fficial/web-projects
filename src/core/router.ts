export type Cleanup = () => void;

export interface RouteResult {
  title: string;
  render: (view: HTMLElement) => Cleanup | void | Promise<Cleanup | void>;
}

export interface RouterOptions {
  view: HTMLElement;
  resolve: (path: string) => RouteResult | null;
  fallback: RouteResult;
  onChange?: (path: string) => void;
}

let cleanup: Cleanup | void;
let token = 0;

export function currentPath(): string {
  const raw = location.hash.replace(/^#/, '');
  if (!raw || raw === '/') return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  const target = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  if (opts.replace) {
    history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = target;
  }
}

export function startRouter(opts: RouterOptions): void {
  const run = async () => {
    const ticket = ++token;
    const path = currentPath();
    const route = opts.resolve(path) ?? opts.fallback;

    try {
      cleanup?.();
    } catch (error) {
      console.error('cleanup failed', error);
    }
    cleanup = undefined;

    opts.view.classList.add('is-swapping');
    opts.view.setAttribute('aria-busy', 'true');

    let result: Cleanup | void = undefined;
    try {
      result = await route.render(opts.view);
    } catch (error) {
      console.error('route failed', error);
      opts.view.innerHTML = `
        <section class="section">
          <div class="wrap">
            <span class="eyebrow">ошибка</span>
            <h1 class="h2">Страница не загрузилась</h1>
            <p class="lead" style="margin-top:16px">${(error as Error).message ?? 'Неизвестная ошибка'}</p>
            <a class="btn btn--primary" href="#/" style="margin-top:24px">На главную</a>
          </div>
        </section>`;
      document.title = 'Ошибка — web/lab';
    }

    if (ticket !== token) {
      if (typeof result === 'function') result();
      return;
    }

    cleanup = result;
    opts.view.classList.remove('is-swapping');
    opts.view.removeAttribute('aria-busy');
    opts.view.style.animation = 'none';
    void opts.view.offsetWidth;
    opts.view.style.animation = '';
    document.title = `${route.title} — web/lab`;
    opts.onChange?.(path);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  window.addEventListener('hashchange', run);
  if (!location.hash) history.replaceState(null, '', '#/');
  void run();
}
