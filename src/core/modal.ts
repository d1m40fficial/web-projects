import { el } from './dom';
import { icon } from './icons';

export interface ModalOptions {
  title: string;
  subtitle?: string;
  body: string;
  wide?: boolean;
  flush?: boolean;
  footer?: string;
  onMount?: (body: HTMLElement, dialog: HTMLElement, close: () => void) => void;
}

export interface ModalHandle {
  close: () => void;
  root: HTMLElement;
  body: HTMLElement;
}

let activeModal: ModalHandle | null = null;

export function closeModal(): void {
  activeModal?.close();
}

export function openModal(opts: ModalOptions): ModalHandle {
  closeModal();

  const host = document.getElementById('modal-root');
  if (!host) throw new Error('modal root missing');

  const previousFocus = document.activeElement as HTMLElement | null;
  const root = el(`
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeAttr(opts.title)}">
      <div class="modal__dialog ${opts.wide ? 'modal__dialog--wide' : ''}">
        <div class="modal__head">
          <h2 class="modal__title">${opts.title}</h2>
          ${opts.subtitle ? `<span class="modal__sub">${opts.subtitle}</span>` : ''}
          <button class="modal__close" type="button" aria-label="Закрыть">${icon('close')}</button>
        </div>
        <div class="modal__body ${opts.flush ? 'modal__body--flush' : ''}">${opts.body}</div>
        ${opts.footer ? `<div class="modal__foot">${opts.footer}</div>` : ''}
      </div>
    </div>
  `);

  const dialog = root.querySelector<HTMLElement>('.modal__dialog')!;
  const body = root.querySelector<HTMLElement>('.modal__body')!;

  const close = () => {
    root.remove();
    document.body.classList.remove('is-locked');
    document.removeEventListener('keydown', onKey, true);
    previousFocus?.focus?.({ preventScroll: true });
    if (activeModal?.root === root) activeModal = null;
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ).filter((n) => n.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  root.addEventListener('click', (event) => {
    if (event.target === root) close();
  });
  root.querySelector('.modal__close')?.addEventListener('click', close);
  document.addEventListener('keydown', onKey, true);

  host.appendChild(root);
  document.body.classList.add('is-locked');
  activeModal = { close, root, body };

  opts.onMount?.(body, dialog, close);
  requestAnimationFrame(() => {
    const focusable = dialog.querySelector<HTMLElement>(
      'input, textarea, select, button:not(.modal__close), a[href], [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? dialog).focus({ preventScroll: true });
  });

  return activeModal;
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
