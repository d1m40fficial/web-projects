import { $, debounce, download, escapeHtml, plural, store, timeAgo } from '../../core/dom';
import { icon } from '../../core/icons';
import { toast } from '../../core/toast';
import { renderMarkdown } from './markdown';

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  updated: number;
  created: number;
}

const KEY = 'wl.notes.v1';

const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const SEED: Note[] = [
  {
    id: 'welcome',
    title: 'Старт: блокнот, который всё помнит',
    tags: ['старт', 'markdown'],
    pinned: true,
    created: Date.now(),
    updated: Date.now(),
    body: `# Привет, это локальный блокнот

Всё, что вы напишете, остаётся **в этом браузере** — в \`localStorage\`. Никаких аккаунтов и серверов.

## Что умеет

- **Markdown** — заголовки, списки, ссылки, код
- *теги* и закрепление заметок
- поиск по тексту
- автосохранение и экспорт в \`.md\`

> Подсказка: нажмите \`Ctrl + S\`, чтобы сохранить сразу.

- [x] открыть блокнот
- [ ] написать первую мысль
- [ ] нажать на звёздочку и закрепить её

\`\`\`ts
const idea = "маленькие инструменты тоже могут быть красивыми";
console.log(idea);
\`\`\`

[Ссылка на репозиторий](https://github.com/d1m40fficial/web-projects)`,
  },
  {
    id: 'ideas',
    title: 'Идеи для новых приложений',
    tags: ['идеи', 'frontend'],
    pinned: false,
    created: Date.now() - 86400000,
    updated: Date.now() - 3600000,
    body: `## Что ещё хочется попробовать

1. Синтезатор на Web Audio
2. Таймлайн истории браузера в виде графа
3. Генератор блюд из того, что есть в холодильнике
4. Визуализатор алгоритмов сортировки

**Критерий:** приложение должно объяснять одну идею лучше, чем скриншот.`,
  },
  {
    id: 'release',
    title: 'Чек-лист релиза витрины',
    tags: ['проект'],
    pinned: false,
    created: Date.now() - 172800000,
    updated: Date.now() - 7200000,
    body: `# Перед публикацией

- [x] собрать 12 приложений
- [x] проверить мобильную вёрстку
- [x] добавить README
- [ ] прогнать Lighthouse
- [ ] проверить все ссылки
- [ ] рассказать о проекте

> GitHub Pages не умеет серверный код — держим всё статикой.`,
  },
];

export function mount(root: HTMLElement): () => void {
  const stored = store<Note[]>(KEY, []);
  let notes: Note[] = stored.get();
  if (!Array.isArray(notes) || !notes.length) {
    notes = SEED.map((n) => ({ ...n }));
    stored.set(notes);
  }

  let activeId = notes[0]?.id ?? '';
  let query = '';
  let preview = true;
  let saveTimer = 0;
  let deleted: { note: Note; index: number } | null = null;

  root.innerHTML = `
    <div class="nt" id="nt">
      <aside class="nt-side">
        <div class="nt-side__head">
          <span class="panel__title">${icon('notes')} заметки <span class="nt-count" id="nt-count">${notes.length}</span></span>
          <button class="btn btn--sm btn--primary nt-new" type="button" id="nt-new" title="Новая заметка">${icon('plus')}</button>
        </div>
        <label class="nt-search">
          ${icon('search')}
          <input type="search" id="nt-search" placeholder="Поиск по заметкам" aria-label="Поиск по заметкам" />
        </label>
        <ul class="nt-list" id="nt-list"></ul>
        <div class="nt-side__foot">
          <button class="nt-mini" type="button" id="nt-export-all" title="Скачать все заметки в JSON">${icon('download')} JSON</button>
          <button class="nt-mini" type="button" id="nt-import" title="Импортировать .md или .json">${icon('archive')} Импорт</button>
          <input type="file" id="nt-file" accept=".md,.json,.txt" hidden />
        </div>
      </aside>

      <section class="nt-editor" id="nt-editor">
        <div class="nt-editor__head">
          <input class="nt-title" id="nt-title" type="text" placeholder="Заголовок заметки" aria-label="Заголовок заметки" />
          <div class="nt-editor__actions">
            <button class="nt-icon ${preview ? 'is-on' : ''}" id="nt-preview" type="button" title="Предпросмотр">${icon('eye')}</button>
            <button class="nt-icon" id="nt-pin" type="button" title="Закрепить">${icon('pin')}</button>
            <button class="nt-icon nt-icon--danger" id="nt-delete" type="button" title="Удалить">${icon('trash')}</button>
          </div>
        </div>

        <div class="nt-tools" role="toolbar" aria-label="Форматирование">
          <button type="button" data-md="bold" title="Полужирный (Ctrl+B)"><b>B</b></button>
          <button type="button" data-md="italic" title="Курсив"><i>I</i></button>
          <button type="button" data-md="h2" title="Заголовок">H2</button>
          <button type="button" data-md="list" title="Список">${icon('filter')}</button>
          <button type="button" data-md="task" title="Чек-лист">☑</button>
          <button type="button" data-md="code" title="Код">&lt;/&gt;</button>
          <button type="button" data-md="link" title="Ссылка">↗</button>
          <span class="nt-tools__spacer"></span>
          <span class="nt-status" id="nt-status">${icon('check')} сохранено</span>
        </div>

        <div class="nt-meta">
          <input class="nt-tags" id="nt-tags" type="text" placeholder="теги через запятую" aria-label="Теги" />
          <span class="nt-meta__item" id="nt-words">0 слов</span>
          <span class="nt-meta__item" id="nt-updated">—</span>
        </div>

        <div class="nt-split">
          <textarea class="nt-body" id="nt-body" placeholder="Пишите в Markdown…" spellcheck="false" aria-label="Текст заметки"></textarea>
          <article class="nt-preview md" id="nt-preview-pane" aria-label="Предпросмотр"></article>
        </div>
      </section>

      <div class="nt-empty" id="nt-empty" hidden>
        <span class="nt-empty__icon">${icon('notes')}</span>
        <h3>Пока пусто</h3>
        <p>Создайте первую заметку — она сохранится в браузере.</p>
        <button class="btn btn--primary" type="button" id="nt-empty-new">${icon('plus')} Новая заметка</button>
      </div>
    </div>
  `;

  const listNode = $('#nt-list', root);
  const titleInput = $<HTMLInputElement>('#nt-title', root);
  const bodyInput = $<HTMLTextAreaElement>('#nt-body', root);
  const tagsInput = $<HTMLInputElement>('#nt-tags', root);
  const previewPane = $('#nt-preview-pane', root);
  const status = $('#nt-status', root);
  const empty = $('#nt-empty', root);
  const editor = $('#nt-editor', root);

  const activeNote = (): Note | undefined => notes.find((n) => n.id === activeId);

  const persist = () => {
    try {
      stored.set(notes);
    } catch {
      toast('Не удалось сохранить: хранилище переполнено', 'error');
    }
  };

  const filtered = (): Note[] => {
    const q = query.trim().toLowerCase();
    const list = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.body.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q)),
        )
      : notes;
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated - a.updated);
  };

  const listItemMarkup = (note: Note): string => {
    const snippet = note.body.replace(/[#>*_`\-\[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
    const active = note.id === activeId;
    return `
      <li>
        <button class="nt-item ${active ? 'is-active' : ''}" type="button" data-note="${note.id}">
          <span class="nt-item__top">
            <span class="nt-item__title">${escapeHtml(note.title || 'Без названия')}</span>
            ${note.pinned ? `<span class="nt-item__pin">${icon('pin')}</span>` : ''}
          </span>
          <span class="nt-item__snippet">${escapeHtml(snippet || 'Пустая заметка')}</span>
          <span class="nt-item__meta">
            <span>${timeAgo(note.updated)}</span>
            ${note.tags.length ? `<span class="nt-item__tags">${note.tags.slice(0, 2).map((t) => `#${escapeHtml(t)}`).join(' ')}</span>` : ''}
          </span>
        </button>
      </li>`;
  };

  const renderList = () => {
    const items = filtered();
    listNode.innerHTML = items.length
      ? items.map(listItemMarkup).join('')
      : `<li class="nt-list__empty">Ничего не найдено</li>`;
    $('#nt-count', root)!.textContent = String(notes.length);
  };

  const updateListMeta = () => {
    const note = activeNote();
    if (!note) return;
    const item = listNode.querySelector<HTMLElement>(`[data-note="${note.id}"]`);
    if (!item) {
      renderList();
      return;
    }
    const title = item.querySelector('.nt-item__title');
    if (title) title.textContent = note.title || 'Без названия';
    const snippet = item.querySelector('.nt-item__snippet');
    if (snippet) snippet.textContent = note.body.replace(/[#>*_`\-\[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || 'Пустая заметка';
    const meta = item.querySelector('.nt-item__meta > span:first-child');
    if (meta) meta.textContent = timeAgo(note.updated);
  };

  const renderPreview = () => {
    const note = activeNote();
    previewPane.innerHTML = note ? renderMarkdown(note.body) : '';
    const words = note ? note.body.trim().split(/\s+/).filter(Boolean).length : 0;
    $('#nt-words', root)!.textContent = `${words} ${plural(words, 'слово', 'слова', 'слов')}`;
    if (note) $('#nt-updated', root)!.textContent = `изменено ${timeAgo(note.updated)}`;
  };

  const showEmpty = (isEmpty: boolean) => {
    empty.hidden = !isEmpty;
    editor.style.display = isEmpty ? 'none' : '';
  };

  const renderEditor = () => {
    const note = activeNote();
    if (!note) {
      showEmpty(true);
      titleInput.value = '';
      bodyInput.value = '';
      tagsInput.value = '';
      previewPane.innerHTML = '';
      return;
    }
    showEmpty(false);
    titleInput.value = note.title;
    bodyInput.value = note.body;
    tagsInput.value = note.tags.join(', ');
    previewPane.innerHTML = renderMarkdown(note.body);
    $('#nt-pin', root)!.classList.toggle('is-on', note.pinned);
    $('#nt-pin', root)!.setAttribute('aria-pressed', String(note.pinned));
    renderPreview();
  };

  const selectNote = (id: string) => {
    if (id === activeId) return;
    window.clearTimeout(saveTimer);
    saveNow(false);
    activeId = id;
    renderList();
    renderEditor();
  };

  const saveNow = (notify = true) => {
    window.clearTimeout(saveTimer);
    const note = activeNote();
    if (!note) return;
    note.updated = Date.now();
    persist();
    updateListMeta();
    if (notify) {
      $('#nt-updated', root)!.textContent = `изменено только что`;
      status.innerHTML = `${icon('check')} сохранено`;
      status.classList.remove('is-saving');
    }
  };

  const scheduleSave = () => {
    window.clearTimeout(saveTimer);
    status.innerHTML = `${icon('refresh')} сохраняем…`;
    status.classList.add('is-saving');
    saveTimer = window.setTimeout(() => saveNow(true), 420);
    renderPreview();
  };

  titleInput.addEventListener('input', () => {
    const note = activeNote();
    if (!note) return;
    note.title = titleInput.value;
    scheduleSave();
    updateListMeta();
  });

  bodyInput.addEventListener('input', () => {
    const note = activeNote();
    if (!note) return;
    note.body = bodyInput.value;
    scheduleSave();
  });

  tagsInput.addEventListener('input', () => {
    const note = activeNote();
    if (!note) return;
    note.tags = tagsInput.value
      .split(/[,;]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
      .slice(0, 8);
    scheduleSave();
    renderList();
  });

  titleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      bodyInput.focus();
    }
  });

  const keyHandler = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      saveNow(true);
      toast('Заметка сохранена', 'success');
    }
  };
  root.addEventListener('keydown', keyHandler);

  listNode.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-note]');
    if (button?.dataset.note) selectNote(button.dataset.note);
  });

  $('#nt-search', root)?.addEventListener('input', (event) => {
    query = (event.target as HTMLInputElement).value;
    renderList();
  });

  const createNote = () => {
    window.clearTimeout(saveTimer);
    saveNow(false);
    const note: Note = {
      id: uid(),
      title: '',
      body: '',
      tags: [],
      pinned: false,
      created: Date.now(),
      updated: Date.now(),
    };
    notes.unshift(note);
    activeId = note.id;
    persist();
    renderList();
    renderEditor();
    titleInput.focus();
    toast('Новая заметка создана', 'success');
  };

  $('#nt-new', root)?.addEventListener('click', createNote);
  $('#nt-empty-new', root)?.addEventListener('click', createNote);

  $('#nt-pin', root)?.addEventListener('click', () => {
    const note = activeNote();
    if (!note) return;
    note.pinned = !note.pinned;
    note.updated = Date.now();
    persist();
    renderList();
    renderEditor();
    toast(note.pinned ? 'Заметка закреплена' : 'Заметка откреплена', 'success');
  });

  $('#nt-delete', root)?.addEventListener('click', () => {
    const note = activeNote();
    if (!note) return;
    const index = notes.findIndex((n) => n.id === note.id);
    deleted = { note: { ...note }, index };
    notes = notes.filter((n) => n.id !== note.id);
    activeId = notes[0]?.id ?? '';
    persist();
    renderList();
    renderEditor();
    toast('Заметка удалена', 'info', 5000, {
      label: 'Отменить',
      onClick: () => {
        if (!deleted) return;
        notes.splice(deleted.index, 0, deleted.note);
        activeId = deleted.note.id;
        persist();
        renderList();
        renderEditor();
        deleted = null;
      },
    });
  });

  $('#nt-preview', root)?.addEventListener('click', () => {
    preview = !preview;
    $('#nt', root)?.classList.toggle('is-preview-off', !preview);
    $('#nt-preview', root)?.classList.toggle('is-on', preview);
    $('#nt-preview', root)?.setAttribute('aria-pressed', String(preview));
  });

  root.querySelectorAll<HTMLButtonElement>('[data-md]').forEach((button) => {
    button.addEventListener('click', () => {
      const note = activeNote();
      if (!note) return;
      const start = bodyInput.selectionStart;
      const end = bodyInput.selectionEnd;
      const selection = bodyInput.value.slice(start, end);
      const kind = button.dataset.md;
      let before = '';
      let after = '';
      let text = selection;

      if (kind === 'bold') {
        before = after = '**';
        text = selection || 'текст';
      } else if (kind === 'italic') {
        before = after = '*';
        text = selection || 'текст';
      } else if (kind === 'code') {
        before = after = '`';
        text = selection || 'код';
      } else if (kind === 'h2') {
        before = '## ';
        text = selection || 'Заголовок';
      } else if (kind === 'list') {
        before = '- ';
        text = selection || 'пункт';
      } else if (kind === 'task') {
        before = '- [ ] ';
        text = selection || 'задача';
      } else if (kind === 'link') {
        before = '[';
        after = '](https://)';
        text = selection || 'ссылка';
      }

      bodyInput.setRangeText(before + text + after, start, end, 'end');
      note.body = bodyInput.value;
      bodyInput.focus();
      bodyInput.dispatchEvent(new Event('input'));
      bodyInput.setSelectionRange(start + before.length, start + before.length + text.length);
    });
  });

  const slug = (value: string): string =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'note';

  $('#nt-export-all', root)?.addEventListener('click', () => {
    download('web-lab-notes.json', JSON.stringify(notes, null, 2), 'application/json');
    toast('Все заметки выгружены в JSON', 'success');
  });

  const exportCurrent = () => {
    const note = activeNote();
    if (!note) return;
    download(`${slug(note.title)}.md`, `# ${note.title || 'Без названия'}\n\n${note.body}\n`, 'text/markdown');
    toast('Заметка экспортирована в .md', 'success');
  };
  // Ctrl/⌘ + Shift + S exports the current note
  const exportHandler = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      exportCurrent();
    }
  };
  root.addEventListener('keydown', exportHandler);

  $('#nt-import', root)?.addEventListener('click', () => $('#nt-file', root)?.click());

  $('#nt-file', root)?.addEventListener('change', async (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let imported: Note[] = [];
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text) as unknown;
        const list = Array.isArray(parsed) ? parsed : [parsed];
        imported = list
          .filter((n): n is Partial<Note> => Boolean(n) && typeof n === 'object')
          .map((n) => ({
            id: uid(),
            title: String(n.title ?? 'Импортированная заметка'),
            body: String(n.body ?? ''),
            tags: Array.isArray(n.tags) ? n.tags.map(String) : [],
            pinned: Boolean(n.pinned),
            created: Number(n.created) || Date.now(),
            updated: Number(n.updated) || Date.now(),
          }));
      } else {
        imported = [
          {
            id: uid(),
            title: file.name.replace(/\.(md|txt)$/i, ''),
            body: text,
            tags: ['импорт'],
            pinned: false,
            created: Date.now(),
            updated: Date.now(),
          },
        ];
      }

      if (!imported.length) throw new Error('empty');
      notes = [...imported, ...notes];
      activeId = imported[0].id;
      persist();
      renderList();
      renderEditor();
      toast(`Импортировано: ${imported.length}`, 'success');
    } catch {
      toast('Не удалось прочитать файл', 'error');
    } finally {
      input.value = '';
    }
  });

  const visibilityHandler = () => {
    if (document.hidden) saveNow(false);
  };
  document.addEventListener('visibilitychange', visibilityHandler);

  renderList();
  renderEditor();

  // initial preview state
  $('#nt', root)?.classList.toggle('is-preview-off', !preview);

  return () => {
    window.clearTimeout(saveTimer);
    saveNow(false);
    document.removeEventListener('visibilitychange', visibilityHandler);
  };
}
