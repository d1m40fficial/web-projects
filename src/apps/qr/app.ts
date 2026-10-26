import QRCode from 'qrcode';
import { $, contrastRatio, copyText, debounce, download, plural } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';

type QrType = 'url' | 'text' | 'wifi' | 'email';
type Ecc = 'L' | 'M' | 'Q' | 'H';

interface State {
  type: QrType;
  url: string;
  text: string;
  ssid: string;
  wifiPass: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
  email: string;
  subject: string;
  emailBody: string;
  fg: string;
  bg: string;
  margin: number;
  ecc: Ecc;
}

const PRESETS = [
  { name: 'Классика', fg: '#0a0a12', bg: '#ffffff' },
  { name: 'Космос', fg: '#3b2f6b', bg: '#e9e5ff' },
  { name: 'Неон', fg: '#0b3b3f', bg: '#c4f56a' },
  { name: 'Закат', fg: '#5c1030', bg: '#ffd9e8' },
  { name: 'Инверсия', fg: '#f4f4ff', bg: '#101018' },
];

const escWifi = (value: string): string => value.replace(/([\\;,:"])/g, '\\$1');

export function mount(root: HTMLElement): () => void {
  const state: State = {
    type: 'url',
    url: 'https://d1m40fficial.github.io/web-projects/',
    text: 'Привет из web/lab — живой витрины веб-проектов.',
    ssid: 'web-lab',
    wifiPass: 'cosmos-2048',
    encryption: 'WPA',
    hidden: false,
    email: 'hello@example.com',
    subject: 'Привет из QR-студии',
    emailBody: 'Это письмо собрано в браузере и закодировано в QR.',
    fg: '#0a0a12',
    bg: '#ffffff',
    margin: 2,
    ecc: 'M',
  };

  root.innerHTML = `
    <div class="qr">
      <div class="qr__controls">
        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${icon('qr')} содержимое</span>
            <span class="qr__hint mono">4 формата</span>
          </div>
          <div class="panel__body">
            <div class="segmented qr-tabs" role="tablist" aria-label="Тип QR-кода">
              <button type="button" data-type="url" class="is-active">Ссылка</button>
              <button type="button" data-type="text">Текст</button>
              <button type="button" data-type="wifi">Wi-Fi</button>
              <button type="button" data-type="email">E-mail</button>
            </div>
            <div id="qr-fields" class="qr-fields"></div>
            <div class="qr-payload">
              <span class="section-label">payload</span>
              <code id="qr-payload-text">—</code>
              <button class="qr-payload__copy" type="button" id="qr-copy-payload" title="Скопировать payload">${icon('copy')}</button>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${icon('palette')} внешний вид</span>
            <span class="qr__hint mono" id="qr-contrast">—</span>
          </div>
          <div class="panel__body">
            <div class="qr-presets" id="qr-presets">
              ${PRESETS.map(
                (p, i) =>
                  `<button type="button" class="qr-preset ${i === 0 ? 'is-active' : ''}" data-fg="${p.fg}" data-bg="${p.bg}" title="${p.name}" aria-label="${p.name}" style="--pf:${p.fg};--pb:${p.bg}"><span></span><small>${p.name}</small></button>`,
              ).join('')}
            </div>

            <div class="qr-colors">
              <label class="qr-color">
                <span class="field__label">Модули</span>
                <span class="qr-color__input"><input type="color" id="qr-fg" value="${state.fg}" /><code id="qr-fg-hex">${state.fg}</code></span>
              </label>
              <label class="qr-color">
                <span class="field__label">Фон</span>
                <span class="qr-color__input"><input type="color" id="qr-bg" value="${state.bg}" /><code id="qr-bg-hex">${state.bg}</code></span>
              </label>
            </div>

            <div class="qr-options">
              <div class="field">
                <label class="field__label" for="qr-ecc">Коррекция ошибок</label>
                <select class="select" id="qr-ecc">
                  <option value="L">L — 7%</option>
                  <option value="M" selected>M — 15%</option>
                  <option value="Q">Q — 25%</option>
                  <option value="H">H — 30%</option>
                </select>
              </div>
              <div class="range-row">
                <div class="range-row__head">
                  <label for="qr-margin">Поля</label>
                  <span class="range-row__value" id="qr-margin-val">${state.margin}</span>
                </div>
                <input class="range" id="qr-margin" type="range" min="0" max="6" step="1" value="${state.margin}" />
              </div>
            </div>
            <p class="help qr-warning" id="qr-warning" hidden>${icon('warning')} Низкий контраст: сканеры могут не прочитать код.</p>
          </div>
        </section>
      </div>

      <section class="qr__preview panel">
        <div class="panel__head">
          <span class="panel__title">${icon('eye')} предпросмотр</span>
          <span class="qr__version mono" id="qr-version">—</span>
        </div>
        <div class="panel__body">
          <div class="qr-stage" id="qr-stage">
            <div class="qr-stage__glow"></div>
            <canvas id="qr-canvas" width="1024" height="1024" aria-label="Сгенерированный QR-код"></canvas>
          </div>
          <div class="qr-actions">
            <button class="btn btn--primary" type="button" id="qr-png">${icon('download')} PNG</button>
            <button class="btn" type="button" id="qr-svg">${icon('download')} SVG</button>
            <button class="btn btn--ghost" type="button" id="qr-copy-image" title="Скопировать как изображение">${icon('copy')}</button>
          </div>
          <div class="qr-stats">
            <span><b id="qr-modules">—</b> <span id="qr-modules-label">модулей</span></span>
            <span><b id="qr-bytes">—</b> <span id="qr-bytes-label">байт</span></span>
            <span><b id="qr-error">—</b></span>
          </div>
        </div>
      </section>
    </div>
  `;

  const fields = $('#qr-fields', root);
  const canvas = $<HTMLCanvasElement>('#qr-canvas', root);
  const stage = $('#qr-stage', root);
  const payloadText = $('#qr-payload-text', root);

  const fieldsMarkup = (): string => {
    switch (state.type) {
      case 'url':
        return `
          <div class="field">
            <label class="field__label" for="qr-url">Адрес</label>
            <input class="input" id="qr-url" type="url" value="${state.url.replace(/"/g, '&quot;')}" placeholder="https://…" />
          </div>
          <div class="qr-samples">
            ${['https://d1m40fficial.github.io/web-projects/', 'https://github.com/d1m40fficial'].map((u) => `<button type="button" class="tag" data-fill="${u}">${u.replace('https://', '')}</button>`).join('')}
          </div>`;
      case 'text':
        return `
          <div class="field">
            <label class="field__label" for="qr-text">Текст</label>
            <textarea class="textarea" id="qr-text" rows="4" placeholder="Что закодировать?">${state.text}</textarea>
          </div>`;
      case 'wifi':
        return `
          <div class="qr-two">
            <div class="field">
              <label class="field__label" for="qr-ssid">Имя сети</label>
              <input class="input" id="qr-ssid" value="${state.ssid}" />
            </div>
            <div class="field">
              <label class="field__label" for="qr-wifi-pass">Пароль</label>
              <input class="input" id="qr-wifi-pass" value="${state.wifiPass}" />
            </div>
          </div>
          <div class="qr-two" style="margin-top:12px">
            <div class="field">
              <label class="field__label" for="qr-enc">Шифрование</label>
              <select class="select" id="qr-enc">
                <option value="WPA" ${state.encryption === 'WPA' ? 'selected' : ''}>WPA / WPA2</option>
                <option value="WEP" ${state.encryption === 'WEP' ? 'selected' : ''}>WEP</option>
                <option value="nopass" ${state.encryption === 'nopass' ? 'selected' : ''}>Без пароля</option>
              </select>
            </div>
            <label class="switch" style="align-self:end;padding-bottom:10px">
              <input type="checkbox" id="qr-hidden" ${state.hidden ? 'checked' : ''} />
              <span class="switch__track"></span>
              <span class="switch__label">Скрытая сеть</span>
            </label>
          </div>`;
      case 'email':
        return `
          <div class="qr-two">
            <div class="field">
              <label class="field__label" for="qr-email">Кому</label>
              <input class="input" id="qr-email" type="email" value="${state.email}" />
            </div>
            <div class="field">
              <label class="field__label" for="qr-subject">Тема</label>
              <input class="input" id="qr-subject" value="${state.subject}" />
            </div>
          </div>
          <div class="field" style="margin-top:12px">
            <label class="field__label" for="qr-body">Сообщение</label>
            <textarea class="textarea" id="qr-body" rows="3">${state.emailBody}</textarea>
          </div>`;
    }
  };

  const buildPayload = (): string => {
    switch (state.type) {
      case 'url': {
        const raw = state.url.trim();
        if (!raw) return '';
        return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
      }
      case 'text':
        return state.text;
      case 'wifi':
        return `WIFI:T:${state.encryption};S:${escWifi(state.ssid)};${state.encryption !== 'nopass' ? `P:${escWifi(state.wifiPass)};` : ''}${state.hidden ? 'H:true;' : ''};`;
      case 'email': {
        const params = new URLSearchParams();
        if (state.subject) params.set('subject', state.subject);
        if (state.emailBody) params.set('body', state.emailBody);
        const query = params.toString();
        return `mailto:${state.email}${query ? `?${query}` : ''}`;
      }
    }
  };

  let payload = '';

  const render = async () => {
    payload = buildPayload();
    payloadText.textContent = payload || '—';

    if (!payload) {
      stage.classList.add('is-empty');
      canvas.style.opacity = '0';
      $('#qr-version', root)!.textContent = 'пусто';
      return;
    }

    try {
      const options = {
        errorCorrectionLevel: state.ecc,
        margin: state.margin,
        width: 1024,
        color: { dark: state.fg, light: state.bg },
      } as const;

      await QRCode.toCanvas(canvas, payload, options);
      stage.classList.remove('is-empty');
      canvas.style.opacity = '1';
      const qr = QRCode.create(payload, { errorCorrectionLevel: state.ecc });
      const modules = qr.modules.size;
      $('#qr-modules', root)!.textContent = String(modules);
      $('#qr-modules-label', root)!.textContent = plural(modules, 'модуль', 'модуля', 'модулей');
      const bytes = new TextEncoder().encode(payload).length;
      $('#qr-bytes', root)!.textContent = String(bytes);
      $('#qr-bytes-label', root)!.textContent = plural(bytes, 'байт', 'байта', 'байт');
      $('#qr-version', root)!.textContent = `version ${Math.round((modules - 21) / 4)} · ${state.ecc}`;
      $('#qr-error', root)!.textContent = `коррекция ${state.ecc}`;
      stage.style.setProperty('--qr-bg', state.bg);

      const ratio = contrastRatio(state.fg, state.bg);
      const contrast = $('#qr-contrast', root)!;
      contrast.textContent = `${ratio.toFixed(1)}:1`;
      contrast.style.color = ratio >= 4.5 ? 'var(--green)' : ratio >= 3 ? 'var(--amber)' : 'var(--red)';
      $('#qr-warning', root)!.hidden = ratio >= 3;
    } catch (error) {
      stage.classList.add('is-empty');
      canvas.style.opacity = '0';
      $('#qr-version', root)!.textContent = 'слишком много данных';
      toast((error as Error).message.includes('too big') ? 'Текст слишком длинный для QR' : 'Не удалось построить QR', 'error');
    }
  };

  const debouncedRender = debounce(() => void render(), 140);

  const syncStateFromFields = () => {
    switch (state.type) {
      case 'url':
        state.url = $<HTMLInputElement>('#qr-url', root)?.value ?? '';
        break;
      case 'text':
        state.text = $<HTMLTextAreaElement>('#qr-text', root)?.value ?? '';
        break;
      case 'wifi':
        state.ssid = $<HTMLInputElement>('#qr-ssid', root)?.value ?? '';
        state.wifiPass = $<HTMLInputElement>('#qr-wifi-pass', root)?.value ?? '';
        state.encryption = ($<HTMLSelectElement>('#qr-enc', root)?.value ?? 'WPA') as State['encryption'];
        state.hidden = $<HTMLInputElement>('#qr-hidden', root)?.checked ?? false;
        break;
      case 'email':
        state.email = $<HTMLInputElement>('#qr-email', root)?.value ?? '';
        state.subject = $<HTMLInputElement>('#qr-subject', root)?.value ?? '';
        state.emailBody = $<HTMLTextAreaElement>('#qr-body', root)?.value ?? '';
        break;
    }
  };

  const renderFields = () => {
    fields.innerHTML = fieldsMarkup();
    fields.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => {
        syncStateFromFields();
        debouncedRender();
      });
      field.addEventListener('change', () => {
        syncStateFromFields();
        debouncedRender();
      });
    });
    fields.querySelectorAll<HTMLElement>('[data-fill]').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.url = chip.dataset.fill ?? '';
        const input = $<HTMLInputElement>('#qr-url', root);
        if (input) input.value = state.url;
        void render();
      });
    });
  };

  root.querySelectorAll<HTMLButtonElement>('[data-type]').forEach((button) => {
    button.addEventListener('click', () => {
      state.type = button.dataset.type as QrType;
      root.querySelectorAll('[data-type]').forEach((b) => b.classList.toggle('is-active', b === button));
      renderFields();
      void render();
    });
  });

  const fg = $<HTMLInputElement>('#qr-fg', root);
  const bg = $<HTMLInputElement>('#qr-bg', root);
  fg?.addEventListener('input', () => {
    state.fg = fg.value;
    $('#qr-fg-hex', root)!.textContent = fg.value;
    root.querySelectorAll('.qr-preset').forEach((p) => p.classList.remove('is-active'));
    debouncedRender();
  });
  bg?.addEventListener('input', () => {
    state.bg = bg.value;
    $('#qr-bg-hex', root)!.textContent = bg.value;
    root.querySelectorAll('.qr-preset').forEach((p) => p.classList.remove('is-active'));
    debouncedRender();
  });

  $('#qr-presets', root)?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-fg]');
    if (!button) return;
    state.fg = button.dataset.fg ?? '#0a0a12';
    state.bg = button.dataset.bg ?? '#ffffff';
    if (fg) fg.value = state.fg;
    if (bg) bg.value = state.bg;
    $('#qr-fg-hex', root)!.textContent = state.fg;
    $('#qr-bg-hex', root)!.textContent = state.bg;
    root.querySelectorAll('.qr-preset').forEach((p) => p.classList.toggle('is-active', p === button));
    void render();
  });

  $('#qr-ecc', root)?.addEventListener('change', (event) => {
    state.ecc = (event.target as HTMLSelectElement).value as Ecc;
    void render();
  });

  const margin = $<HTMLInputElement>('#qr-margin', root);
  margin?.addEventListener('input', () => {
    state.margin = Number(margin.value);
    margin.style.setProperty('--fill', `${(state.margin / 6) * 100}%`);
    $('#qr-margin-val', root)!.textContent = String(state.margin);
    debouncedRender();
  });
  margin?.dispatchEvent(new Event('input'));

  $('#qr-copy-payload', root)?.addEventListener('click', async () => {
    const ok = await copyText(payload);
    toast(ok ? 'Payload скопирован' : 'Не удалось скопировать', ok ? 'success' : 'error');
  });

  $('#qr-png', root)?.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      download('qr-code.png', blob, 'image/png');
      toast('PNG сохранён', 'success');
    }, 'image/png');
  });

  $('#qr-svg', root)?.addEventListener('click', async () => {
    if (!payload) return;
    try {
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        errorCorrectionLevel: state.ecc,
        margin: state.margin,
        color: { dark: state.fg, light: state.bg },
      });
      download('qr-code.svg', svg, 'image/svg+xml');
      toast('SVG сохранён', 'success');
    } catch {
      toast('Не удалось собрать SVG', 'error');
    }
  });

  $('#qr-copy-image', root)?.addEventListener('click', async () => {
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('no blob');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('QR скопирован как изображение', 'success');
    } catch {
      toast('Браузер не разрешил копирование изображения', 'error');
    }
  });

  renderFields();
  void render();

  return () => {
    // no global listeners
  };
}
