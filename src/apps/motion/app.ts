import { $, copyText, prefersReducedMotion } from '../../core/dom';
import { fireConfetti } from '../../core/confetti';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';

const EASINGS = [
  { label: 'ease-out', value: 'cubic-bezier(.22,.61,.36,1)' },
  { label: 'spring', value: 'cubic-bezier(.34,1.56,.64,1)' },
  { label: 'anticipate', value: 'cubic-bezier(.36,-0.3,.66,1.4)' },
  { label: 'linear', value: 'linear' },
  { label: 'ease-in-out', value: 'ease-in-out' },
];

export function mount(root: HTMLElement): () => void {
  const reduced = prefersReducedMotion();
  const timers = new Set<number>();
  let disposed = false;
  let typeTimer = 0;
  let scrambleTimer = 0;

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!disposed) fn();
    }, ms);
    timers.add(id);
    return id;
  };

  root.innerHTML = `
    <div class="mo">
      <section class="mo-hero">
        <div class="mo-hero__bg"></div>
        <div class="mo-hero__content">
          <span class="eyebrow">motion lab · ${reduced ? 'reduced motion' : 'full motion'}</span>
          <h2>Движение — это <span class="grad-text">язык</span> интерфейса</h2>
          <p>Микровзаимодействия, которые объясняют переход, дают обратную связь и не мешают. Всё — на CSS и Web Animations API.</p>
          <div class="mo-hero__actions">
            <button class="btn btn--primary" type="button" id="mo-confetti">${icon('sparkles')} Конфетти</button>
            <span class="pill">${icon('heart')} ${reduced ? 'анимации сокращены системой' : 'prefers-reduced-motion учтён'}</span>
          </div>
        </div>
        <div class="mo-hero__orb" aria-hidden="true"></div>
      </section>

      <div class="mo-grid">
        <section class="panel mo-play">
          <div class="panel__head">
            <span class="panel__title">${icon('motion')} easing playground</span>
            <button class="mo-mini" type="button" id="mo-copy">${icon('copy')} CSS</button>
          </div>
          <div class="panel__body">
            <div class="mo-track" id="mo-track">
              <span class="mo-track__mark" style="left:12px"></span>
              <span class="mo-track__mark" style="right:12px"></span>
              <div class="mo-box" id="mo-box">◆</div>
            </div>
            <div class="mo-controls">
              <div class="range-row">
                <div class="range-row__head"><label for="mo-duration">длительность</label><span class="range-row__value" id="mo-duration-val">700ms</span></div>
                <input class="range" id="mo-duration" type="range" min="150" max="2000" step="50" value="700" />
              </div>
              <div class="range-row">
                <div class="range-row__head"><label for="mo-delay">задержка</label><span class="range-row__value" id="mo-delay-val">0ms</span></div>
                <input class="range" id="mo-delay" type="range" min="0" max="800" step="50" value="0" />
              </div>
              <div class="field">
                <label class="field__label" for="mo-easing">кривая</label>
                <select class="select" id="mo-easing">
                  ${EASINGS.map((e) => `<option value="${e.value}">${e.label}</option>`).join('')}
                </select>
              </div>
              <button class="mo-play-btn" type="button" id="mo-run" aria-label="Запустить анимацию">${icon('play')}</button>
            </div>
            <pre class="mo-code" id="mo-code"><code>transition: transform 700ms cubic-bezier(.22,.61,.36,1) 0ms;</code></pre>
          </div>
        </section>

        <section class="panel mo-toggles">
          <div class="panel__head">
            <span class="panel__title">${icon('filter')} элементы управления</span>
          </div>
          <div class="panel__body">
            <div class="mo-toggle-list">
              <label class="switch">
                <input type="checkbox" checked />
                <span class="switch__track"></span>
                <span class="switch__label">Автосохранение</span>
              </label>
              <label class="switch">
                <input type="checkbox" />
                <span class="switch__track"></span>
                <span class="switch__label">Звук интерфейса</span>
              </label>
              <label class="switch">
                <input type="checkbox" checked />
                <span class="switch__track"></span>
                <span class="switch__label">Анимации</span>
              </label>
            </div>

            <div class="mo-seg" id="mo-seg" role="group" aria-label="Тема">
              <span class="mo-seg__indicator" id="mo-seg-indicator"></span>
              <button type="button" class="is-active">Тёмная</button>
              <button type="button">Светлая</button>
              <button type="button">Авто</button>
            </div>

            <label class="mo-check">
              <input type="checkbox" id="mo-check" />
              <span class="mo-check__box">${icon('check')}</span>
              <span>Согласен с условиями демо</span>
            </label>

            <div class="range-row">
              <div class="range-row__head"><label for="mo-volume">громкость</label><span class="range-row__value" id="mo-volume-val">64%</span></div>
              <input class="range" id="mo-volume" type="range" min="0" max="100" value="64" />
            </div>
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel__head">
          <span class="panel__title">${icon('key')} кнопки</span>
          <span class="mo-panel-hint">наведите и нажмите</span>
        </div>
        <div class="panel__body mo-buttons">
          <div class="mo-button-cell">
            <button class="mo-btn mo-btn--ripple" type="button" id="mo-ripple">Ripple</button>
            <span>волна от курсора</span>
          </div>
          <div class="mo-button-cell">
            <span class="mo-magnet" id="mo-magnet-wrap"><button class="mo-btn mo-btn--magnet" type="button" id="mo-magnet">Магнит</button></span>
            <span>тянется к курсору</span>
          </div>
          <div class="mo-button-cell">
            <button class="mo-btn mo-grad-btn" type="button"><span>Gradient</span></button>
            <span>вращающаяся рамка</span>
          </div>
          <div class="mo-button-cell">
            <button class="mo-btn mo-btn--load" type="button" id="mo-load">${icon('arrow')} Отправить</button>
            <span>состояние загрузки</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel__head">
          <span class="panel__title">${icon('layers')} карточки</span>
          <span class="mo-panel-hint">spotlight · 3D · zoom</span>
        </div>
        <div class="panel__body mo-cards">
          <article class="mo-card mo-spot" id="mo-spot">
            <span class="mo-card__icon">${icon('sparkles')}</span>
            <h3>Spotlight</h3>
            <p>Свет follows the cursor. Наведите, чтобы увидеть пятно и рамку.</p>
          </article>
          <button class="mo-flip" type="button" id="mo-flip" aria-label="Перевернуть карточку">
            <span class="mo-flip__inner">
              <span class="mo-flip__face mo-flip__front"><b>3D</b><small>нажмите</small></span>
              <span class="mo-flip__face mo-flip__back"><b>${icon('check')}</b><small>перевёрнуто</small></span>
            </span>
          </button>
          <article class="mo-zoom">
            <div class="mo-zoom__img"><span>${icon('mountain')}</span></div>
            <div class="mo-zoom__body"><h3>Zoom</h3><p>Масштаб изображения на hover, без layout shift.</p></div>
          </article>
        </div>
      </section>

      <div class="mo-grid">
        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${icon('clock')} загрузка</span>
            <button class="mo-mini" type="button" id="mo-reload">${icon('refresh')} заново</button>
          </div>
          <div class="panel__body">
            <div class="mo-skel" id="mo-skel">
              <div class="mo-skel__skeleton">
                <div class="mo-sk-line mo-sk-line--title"></div>
                <div class="mo-sk-line"></div>
                <div class="mo-sk-line" style="width:82%"></div>
                <div class="mo-sk-line" style="width:64%"></div>
                <div class="mo-sk-row"><div></div><div></div><div></div></div>
              </div>
              <div class="mo-skel__content" hidden>
                <span class="mo-skel__icon">${icon('check')}</span>
                <div><b>Данные загружены</b><p>Скелетон исчез, контент появился без скачка layout.</p></div>
              </div>
            </div>
            <div class="mo-spinners">
              <span class="mo-spinner"></span>
              <span class="mo-spinner mo-spinner--dual"></span>
              <span class="mo-dots"><i></i><i></i><i></i></span>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${icon('code')} текст</span>
          </div>
          <div class="panel__body mo-text">
            <span class="mo-shimmer">SHIMMER</span>
            <span class="mo-scramble" id="mo-scramble">ДВИЖЕНИЕ</span>
            <p class="mo-type"><span id="mo-type"></span><span class="mo-caret"></span></p>
            <p class="help">Наведите на «ДВИЖЕНИЕ» — буквы соберутся заново.</p>
          </div>
        </section>
      </div>

      <p class="mo-note">${icon('info')} Анимируются только transform и opacity. Предпочтения reduced motion проверяются на старте и в CSS.</p>
    </div>
  `;

  /* ---------------- easing playground ---------------- */
  const track = $('#mo-track', root) as HTMLElement;
  const box = $('#mo-box', root) as HTMLElement;
  const duration = $<HTMLInputElement>('#mo-duration', root)!;
  const delay = $<HTMLInputElement>('#mo-delay', root)!;
  const easing = $<HTMLSelectElement>('#mo-easing', root)!;
  const durationVal = $('#mo-duration-val', root)!;
  const delayVal = $('#mo-delay-val', root)!;
  const code = $('#mo-code code', root)!;

  const updateCode = () => {
    code.textContent = `transition: transform ${duration.value}ms ${easing.value} ${delay.value}ms;`;
    duration.style.setProperty('--fill', `${((Number(duration.value) - 150) / 1850) * 100}%`);
    delay.style.setProperty('--fill', `${(Number(delay.value) / 800) * 100}%`);
  };

  const runAnimation = () => {
    const distance = Math.max(0, track.clientWidth - box.offsetWidth - 24);
    box.getAnimations().forEach((animation) => animation.cancel());
    box.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${distance}px)` }], {
      duration: Number(duration.value),
      delay: Number(delay.value),
      easing: easing.value,
      fill: 'both',
    });
  };

  duration.addEventListener('input', () => {
    durationVal.textContent = `${duration.value}ms`;
    updateCode();
  });
  delay.addEventListener('input', () => {
    delayVal.textContent = `${delay.value}ms`;
    updateCode();
  });
  easing.addEventListener('change', updateCode);
  $('#mo-run', root)?.addEventListener('click', runAnimation);
  duration.dispatchEvent(new Event('input'));
  delay.dispatchEvent(new Event('input'));

  $('#mo-copy', root)?.addEventListener('click', async () => {
    const ok = await copyText(`.element {\n  ${code.textContent}\n}`);
    toast(ok ? 'CSS скопирован' : 'Не удалось скопировать', ok ? 'success' : 'error');
  });

  /* ---------------- ripple button ---------------- */
  $('#mo-ripple', root)?.addEventListener('pointerdown', (event) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const ripple = document.createElement('span');
    ripple.className = 'mo-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    later(() => ripple.remove(), 650);
  });

  /* ---------------- magnetic button ---------------- */
  const magnetWrap = $('#mo-magnet-wrap', root);
  const magnet = $('#mo-magnet', root);
  if (magnetWrap && magnet && !reduced) {
    magnetWrap.addEventListener('pointermove', (event) => {
      const rect = magnetWrap.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      magnet.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
    });
    magnetWrap.addEventListener('pointerleave', () => {
      magnet.style.transform = '';
    });
  }

  /* ---------------- loading button ---------------- */
  const loadButton = $<HTMLButtonElement>('#mo-load', root);
  loadButton?.addEventListener('click', () => {
    if (loadButton.dataset.loading === '1') return;
    loadButton.dataset.loading = '1';
    loadButton.classList.add('is-loading');
    loadButton.innerHTML = `<span class="mo-spinner mo-spinner--tiny"></span> Отправляем…`;
    later(() => {
      loadButton.classList.remove('is-loading');
      loadButton.classList.add('is-done');
      loadButton.innerHTML = `${icon('check')} Готово`;
      later(() => {
        loadButton.classList.remove('is-done');
        loadButton.dataset.loading = '0';
        loadButton.innerHTML = `${icon('arrow')} Отправить`;
      }, 1400);
    }, 1200);
  });

  /* ---------------- spotlight card ---------------- */
  const spot = $('#mo-spot', root);
  if (spot && !reduced) {
    spot.addEventListener('pointermove', (event) => {
      const rect = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      spot.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  /* ---------------- flip card ---------------- */
  $('#mo-flip', root)?.addEventListener('click', (event) => {
    (event.currentTarget as HTMLElement).classList.toggle('is-flipped');
  });

  /* ---------------- segmented control ---------------- */
  const seg = $('#mo-seg', root);
  const segIndicator = $('#mo-seg-indicator', root);
  if (seg && segIndicator) {
    const buttons = Array.from(seg.querySelectorAll<HTMLButtonElement>('button'));
    const update = (active: number) => {
      buttons.forEach((button, index) => {
        button.classList.toggle('is-active', index === active);
        button.setAttribute('aria-pressed', String(index === active));
      });
      segIndicator.style.transform = `translateX(${active * 100}%)`;
    };
    buttons.forEach((button, index) => button.addEventListener('click', () => update(index)));
    update(0);
  }

  /* ---------------- volume ---------------- */
  const volume = $<HTMLInputElement>('#mo-volume', root);
  const volumeVal = $('#mo-volume-val', root);
  volume?.addEventListener('input', () => {
    if (volumeVal) volumeVal.textContent = `${volume.value}%`;
    volume.style.setProperty('--fill', `${volume.value}%`);
  });
  volume?.dispatchEvent(new Event('input'));

  /* ---------------- skeleton reload ---------------- */
  const skel = $('#mo-skel', root);
  const skelSkeleton = $('.mo-skel__skeleton', skel ?? root);
  const skelContent = $('.mo-skel__content', skel ?? root);
  $('#mo-reload', root)?.addEventListener('click', () => {
    if (!skelSkeleton || !skelContent) return;
    skelSkeleton.hidden = false;
    skelContent.hidden = true;
    later(() => {
      skelSkeleton.hidden = true;
      skelContent.hidden = false;
    }, 1300);
  });

  /* ---------------- scramble text ---------------- */
  const scrambleEl = $('#mo-scramble', root);
  const finalWord = 'ДВИЖЕНИЕ';
  const chars = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ#%*+';
  scrambleEl?.addEventListener('pointerenter', () => {
    if (reduced) return;
    window.clearInterval(scrambleTimer);
    let step = 0;
    scrambleTimer = window.setInterval(() => {
      scrambleEl.textContent = finalWord
        .split('')
        .map((char, index) => (index < step ? char : chars[Math.floor(Math.random() * chars.length)]))
        .join('');
      step++;
      if (step > finalWord.length) {
        window.clearInterval(scrambleTimer);
        scrambleEl.textContent = finalWord;
      }
    }, 45);
  });

  /* ---------------- typewriter ---------------- */
  const typeEl = $('#mo-type', root);
  const phrases = ['объясняет переход', 'даёт обратную связь', 'не отвлекает от задачи'];
  if (typeEl) {
    let phrase = 0;
    let index = 0;
    let deleting = false;
    const type = () => {
      if (disposed) return;
      const current = phrases[phrase];
      if (!deleting) {
        index++;
        typeEl.textContent = current.slice(0, index);
        if (index >= current.length) {
          deleting = true;
          typeTimer = later(type, 1700) ?? 0;
          return;
        }
      } else {
        index--;
        typeEl.textContent = current.slice(0, index);
        if (index <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
        }
      }
      typeTimer = later(type, deleting ? 35 : 65) ?? 0;
    };
    typeTimer = later(type, 300) ?? 0;
    void typeTimer;
  }

  /* ---------------- confetti ---------------- */
  $('#mo-confetti', root)?.addEventListener('click', () => fireConfetti(120));

  return () => {
    disposed = true;
    window.clearInterval(scrambleTimer);
    window.clearTimeout(typeTimer);
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
  };
}
