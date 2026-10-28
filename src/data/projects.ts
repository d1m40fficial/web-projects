import type { Cleanup } from '../core/router';

export type Category = 'games' | 'tools' | 'data' | 'experiments';

export interface Project {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  category: Category;
  icon: string;
  c1: string;
  c2: string;
  preview: string;
  layout?: 'wide' | 'full';
  sourcePath?: string;
  notes: { title: string; text: string }[];
  load: () => Promise<{ mount: (root: HTMLElement) => Cleanup | void }>;
}

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'tools', label: 'Инструменты' },
  { id: 'games', label: 'Игры' },
  { id: 'data', label: 'Данные' },
  { id: 'experiments', label: 'Эксперименты' },
];

export const projects: Project[] = [
  {
    slug: 'password',
    index: '01',
    title: 'Генератор паролей',
    tagline: 'Криптостойкость с человеческим лицом',
    description:
      'Пароли и passphrase на crypto.getRandomValues, честная энтропия, оценка времени взлома и история в localStorage.',
    tags: ['TypeScript', 'Web Crypto', 'CSS'],
    category: 'tools',
    icon: 'key',
    c1: '#8b6bff',
    c2: '#38e0f2',
    preview: 'password',
    notes: [
      { title: 'Не Math.random', text: 'Для генерации используется crypto.getRandomValues с rejection sampling — без смещения по модулю.' },
      { title: 'Энтропия, а не «сложность»', text: 'Сила считается как log₂(алфавит^длина). Для passphrase — log₂(словарь^слов).' },
      { title: 'Всё локально', text: 'История не покидает браузер. Отключённые символы сразу исключаются из алфавита.' },
    ],
    load: () => import('../apps/password/app'),
  },
  {
    slug: 'qr',
    index: '02',
    title: 'QR-студия',
    tagline: 'Ссылки, Wi-Fi и контакты в одном квадрате',
    description:
      'Живой генератор QR-кодов с четырьмя форматами, уровнями коррекции, кастомными цветами и экспортом в PNG и SVG.',
    tags: ['TypeScript', 'QR encoder', 'Canvas'],
    category: 'tools',
    icon: 'qr',
    c1: '#38e0f2',
    c2: '#c4f56a',
    preview: 'qr',
    notes: [
      { title: 'Четыре сценария', text: 'Ссылка, текст, Wi-Fi и e-mail собираются в корректные payload-строки по стандарту.' },
      { title: 'Вектор и растр', text: 'SVG собирается из модулей QR-матрицы, PNG — через canvas с масштабированием без мыла.' },
      { title: 'Контроль контраста', text: 'Проверка цветов предупреждает, если код станет трудночитаемым для сканера.' },
    ],
    load: () => import('../apps/qr/app'),
  },
  {
    slug: 'weather',
    index: '03',
    title: 'Погода',
    tagline: 'Любой город, живое небо',
    description:
      'Поиск города, текущая погода с анимированными иконками, почасовой график и прогноз на неделю. Gismeteo, без ключей.',
    tags: ['TypeScript', 'Gismeteo', 'SVG'],
    category: 'data',
    icon: 'weather',
    c1: '#38e0f2',
    c2: '#8b6bff',
    preview: 'weather',
    notes: [
      { title: 'Без API-ключей', text: 'Погоду и города отдаёт публичный виджет Gismeteo; вероятность осадков оценивается по их количеству, а Open-Meteo подстраховывает.' },
      { title: 'Свои иконки', text: 'Погодные коды превращаются в SVG-сцены с CSS-анимацией солнца, облаков и дождя.' },
      { title: 'Офлайн-память', text: 'Последний успешный ответ кешируется, а ошибки сети не ломают интерфейс.' },
    ],
    load: () => import('../apps/weather/app'),
  },
  {
    slug: 'sky',
    index: '04',
    title: 'Карта звёздного неба',
    tagline: 'Настоящая астрономия в 120 строках расчётов',
    description:
      'Интерактивная карта неба для любой точки Земли: 100+ звёзд, созвездия, Млечный Путь, Солнце и Луна с фазой.',
    tags: ['TypeScript', 'Canvas 2D', 'Astronomy'],
    category: 'data',
    icon: 'stars',
    c1: '#8b6bff',
    c2: '#ff6aa8',
    preview: 'sky',
    notes: [
      { title: 'Реальные координаты', text: 'RA/Dec каталога переводятся в alt/az через звёздное время, широту и долготу наблюдателя.' },
      { title: 'Небо как оно есть', text: 'Положение Солнца задаёт сумерки, Луна рисуется с фазой, Млечный Путь — по галактическим координатам.' },
      { title: 'Панорама по умолчанию', text: 'Широкий обзор горизонта с подписями азимутов; кнопка «купол» возвращает вид сверху, а город, дату и скорость неба можно менять.' },
    ],
    load: () => import('../apps/sky/app'),
  },
  {
    slug: 'notes',
    index: '05',
    title: 'Блокнот',
    tagline: 'Markdown, теги и автосохранение',
    description:
      'Быстрые заметки с поиском, тегами, закреплением и живым preview. Всё хранится в localStorage и экспортируется в .md.',
    tags: ['TypeScript', 'localStorage', 'Markdown'],
    category: 'tools',
    icon: 'notes',
    c1: '#ffcb5c',
    c2: '#ff6aa8',
    preview: 'notes',
    notes: [
      { title: 'Свой mini-markdown', text: 'Парсер экранирует HTML и поддерживает заголовки, списки, код, ссылки и чекбоксы.' },
      { title: 'Автосохранение', text: 'Изменения пишутся с debounce и подтверждаются индикатором. Ctrl+S сохраняет мгновенно.' },
      { title: 'Импорт и экспорт', text: 'Одна заметка выгружается в Markdown, весь блокнот — в JSON для переноса.' },
    ],
    load: () => import('../apps/notes/app'),
  },
  {
    slug: '2048',
    index: '06',
    title: '2048',
    tagline: 'Клон с честной анимацией плиток',
    description:
      'Полноценный 2048: свайпы, отмена хода, рекорд, победа и продолжение. Плитки двигаются через CSS transforms.',
    tags: ['TypeScript', 'CSS transforms', 'Game logic'],
    category: 'games',
    icon: 'grid',
    c1: '#ffcb5c',
    c2: '#ff6aa8',
    preview: '2048',
    sourcePath: 'src/apps/game2048',
    notes: [
      { title: 'Плитки с идентичностью', text: 'Каждая плитка — объект с id, поэтому DOM переиспользуется и переходы не «прыгают».' },
      { title: 'Слияние без багов', text: 'За ход каждая плитка сливается не более одного раза — классическое правило 2048.' },
      { title: 'Управление', text: 'Стрелки, WASD, свайпы и кнопка отмены. Состояние рекорда живёт в localStorage.' },
    ],
    load: () => import('../apps/game2048/app'),
  },
  {
    slug: 'memory',
    index: '07',
    title: 'Memory',
    tagline: 'Три сложности и идеальный ход',
    description:
      'Игра на память с 3D-переворотом карточек, таймером, счётчиком ходов и рекордами для каждого размера поля.',
    tags: ['TypeScript', 'CSS 3D', 'localStorage'],
    category: 'games',
    icon: 'cards',
    c1: '#ff6aa8',
    c2: '#8b6bff',
    preview: 'memory',
    notes: [
      { title: 'Настоящий 3D', text: 'Карточки переворачиваются через rotateY с preserve-3d и двумя гранями.' },
      { title: 'Честный таймер', text: 'Отсчёт начинается с первого переворота и останавливается на последней паре.' },
      { title: 'Рекорды', text: 'Лучшее время и минимум ходов хранятся отдельно для 4×4, 4×5 и 5×6.' },
    ],
    load: () => import('../apps/memory/app'),
  },
  {
    slug: 'tracks',
    index: '08',
    title: 'Визуализатор треков',
    tagline: 'GPX, GeoJSON и CSV — на один холст',
    description:
      'Загрузите трек и получите карту маршрута, профиль высоты, скорости и анимированное воспроизведение с расчётом дистанции.',
    tags: ['TypeScript', 'Canvas 2D', 'GPX/GeoJSON'],
    category: 'data',
    icon: 'route',
    c1: '#6ee7a8',
    c2: '#38e0f2',
    preview: 'tracks',
    notes: [
      { title: 'Три парсера', text: 'GPX разбирается через DOMParser, GeoJSON — напрямую, CSV — с автоопределением колонок.' },
      { title: 'Геодезия', text: 'Дистанция считается по haversine, набор высоты — по положительным дельтам, темп — по времени точек.' },
      { title: 'Синхронный плеер', text: 'Курсор на профиле и точка на карте двигаются вместе; скорость можно ускорить в 100 раз.' },
    ],
    load: () => import('../apps/tracks/app'),
  },
  {
    slug: 'palette',
    index: '09',
    title: 'Палитры',
    tagline: 'Цвет, который можно примерить',
    description:
      'Генератор гармоничных палитр с блокировкой цветов, проверкой контраста WCAG и примеркой на интерфейс сайта.',
    tags: ['TypeScript', 'Color science', 'CSS vars'],
    category: 'experiments',
    icon: 'palette',
    c1: '#c4f56a',
    c2: '#38e0f2',
    preview: 'palette',
    notes: [
      { title: 'Пять гармоний', text: 'Аналоговая, комплементарная, триадная, монохромная и свободная схемы на HSL-колесе.' },
      { title: 'Контраст по делу', text: 'Для каждого swatch считается WCAG-контраст с белым и чёрным и выставляются бейджи AA/AAA.' },
      { title: 'Живая примерка', text: 'Палитра применяется к CSS-переменным всего сайта — акценты меняются без перезагрузки.' },
    ],
    load: () => import('../apps/palette/app'),
  },
  {
    slug: 'ratings',
    index: '10',
    title: 'Дашборд рейтингов',
    tagline: 'Кино и книги в цифрах',
    description:
      'Интерактивный дашборд: распределение оценок, топ жанров, динамика по годам и сквозной поиск. Все графики — свой SVG.',
    tags: ['TypeScript', 'SVG charts', 'Data viz'],
    category: 'data',
    icon: 'chart',
    c1: '#ffcb5c',
    c2: '#6ee7a8',
    preview: 'ratings',
    notes: [
      { title: 'Без chart-библиотек', text: 'Оси, бары, донат и скэттер строятся вручную на SVG с анимацией и hover-подсказками.' },
      { title: 'Один фильтр — весь дашборд', text: 'Тип, жанр и поиск синхронно пересчитывают KPI и все визуализации.' },
      { title: 'Демо-данные', text: 'Коллекция фильмов и книг собрана для демонстрации; оценки округлены и не являются официальными.' },
    ],
    load: () => import('../apps/ratings/app'),
  },
  {
    slug: 'motion',
    index: '11',
    title: 'Motion Lab',
    tagline: 'Микровзаимодействия, которые чувствуются',
    description:
      'Песочница анимаций: tilt-карточки, магнитные кнопки, ripple, скелетоны, easing-плейграунд и генератор CSS.',
    tags: ['TypeScript', 'CSS animation', 'UX'],
    category: 'experiments',
    icon: 'motion',
    c1: '#ff6aa8',
    c2: '#c4f56a',
    preview: 'motion',
    notes: [
      { title: 'Только transform и opacity', text: 'Анимации не трогают layout, поэтому остаются плавными даже на слабых машинах.' },
      { title: 'Easing-плейграунд', text: 'Кривая, длительность и задержка настраиваются ползунками, CSS можно скопировать.' },
      { title: 'Уважение к настройкам', text: 'prefers-reduced-motion отключает декоративное движение, но сохраняет обратную связь.' },
    ],
    load: () => import('../apps/motion/app'),
  },
  {
    slug: 'archive',
    index: '12',
    title: 'Локальный архив',
    tagline: 'Старые проекты, новая витрина',
    description:
      'Шесть играбельных HTML-проектов из локальной папки и Python-инструменты — с запуском прямо в модальном окне.',
    tags: ['HTML', 'JavaScript', 'Python'],
    category: 'games',
    icon: 'archive',
    c1: '#8b6bff',
    c2: '#ffcb5c',
    preview: 'archive',
    notes: [
      { title: 'Еслиrame без сборки', text: 'Каждый архивный проект — самостоятельный HTML, встроенный через iframe с изоляцией.' },
      { title: 'Что внутри', text: 'Raft Survival, Neon Pinball, Snake, Sudoku, Pomodoro, звёздное небо и «Быки и коровы».' },
      { title: 'Python тоже здесь', text: 'Flask-загрузчик, парсер расписания и консольные эксперименты лежат в исходниках репозитория.' },
    ],
    load: () => import('../apps/archive/app'),
  },
];

export const projectBySlug = (slug: string): Project | undefined => projects.find((p) => p.slug === slug);

export interface LegacyProject {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  tech: string[];
  href?: string;
  source?: string;
  playable: boolean;
  c1: string;
  c2: string;
  meta: string;
}

export const legacyProjects: LegacyProject[] = [
  {
    slug: 'raft',
    title: 'Raft Survival',
    description: 'Фанатская реконструкция выживания на плоту: ресурсы, крафт, акулы и день/ночь на canvas.',
    emoji: '🪵',
    tech: ['Canvas', 'Vanilla JS', 'Game loop'],
    href: 'legacy/raft/index.html',
    playable: true,
    c1: '#8b6bff',
    c2: '#38e0f2',
    meta: '1280×720 · canvas',
  },
  {
    slug: 'pinball',
    title: 'Neon Pinball',
    description: 'Неоновый пинбол с физикой шарика, флипперами и подсчётом очков в одном файле.',
    emoji: '🕹️',
    tech: ['Canvas', 'Physics', 'Neon'],
    href: 'legacy/pinball/index.html',
    playable: true,
    c1: '#ff6aa8',
    c2: '#ffcb5c',
    meta: 'one-file build',
  },
  {
    slug: 'snake',
    title: 'Змейка',
    description: 'Классическая змейка с ускорением, стенами и аккуратной тёмной темой.',
    emoji: '🐍',
    tech: ['Canvas', 'JavaScript'],
    href: 'legacy/snake/index.html',
    playable: true,
    c1: '#6ee7a8',
    c2: '#38e0f2',
    meta: 'keyboard',
  },
  {
    slug: 'sudoku',
    title: 'Судоку',
    description: 'Генератор и решатель судоку с подсказками, проверкой и светлой/тёмной темой.',
    emoji: '🔢',
    tech: ['JavaScript', 'Recursion', 'CSS'],
    href: 'legacy/sudoku/index.html',
    playable: true,
    c1: '#38e0f2',
    c2: '#8b6bff',
    meta: '9×9',
  },
  {
    slug: 'timer',
    title: 'Pomodoro Timer',
    description: 'Таймер фокуса с режимами работы и отдыха, звуком и минималистичным интерфейсом.',
    emoji: '⏱️',
    tech: ['JavaScript', 'Web Audio', 'CSS'],
    href: 'legacy/timer/index.html',
    playable: true,
    c1: '#ffcb5c',
    c2: '#ff6aa8',
    meta: '25/5',
  },
  {
    slug: 'starfield',
    title: 'Starfield',
    description: 'Гипнотическое звёздное поле на canvas — ранний эксперимент с частицами и параллаксом.',
    emoji: '✨',
    tech: ['Canvas', 'Particles'],
    href: 'legacy/starfield/index.html',
    playable: true,
    c1: '#8b6bff',
    c2: '#ff6aa8',
    meta: 'fullscreen',
  },
  {
    slug: 'bulls',
    title: 'Быки и коровы',
    description: 'Логическая игра на угадывание числа: быки, коровы и минималистичная вёрстка.',
    emoji: '🐂',
    tech: ['HTML', 'JavaScript'],
    href: 'legacy/bulls/index.html',
    playable: true,
    c1: '#c4f56a',
    c2: '#ffcb5c',
    meta: 'logic',
  },
  {
    slug: 'space-club',
    title: 'Space Club',
    description: 'Аркадный шутер про ленивых космических рейнджеров: canvas, магазин, рекорды и сохранения.',
    emoji: '🚀',
    tech: ['Canvas', 'Game loop', 'localStorage'],
    href: 'legacy/space-club/index.html',
    source: 'legacy-src/space_club_web/',
    playable: true,
    c1: '#8b6bff',
    c2: '#38e0f2',
    meta: 'canvas · 60fps',
  },
  {
    slug: 'schedule-parser',
    title: 'Расписание преподавателей',
    description: 'Загружает Excel с расписанием, разбирает пары и собирает аккуратную таблицу прямо в браузере.',
    emoji: '📅',
    tech: ['HTML', 'SheetJS', 'JavaScript'],
    href: 'legacy/schedule/index.html',
    source: 'legacy-src/schedule_parser/',
    playable: true,
    c1: '#38e0f2',
    c2: '#ffcb5c',
    meta: 'xlsx in browser',
  },
  {
    slug: 'youtube-downloader',
    title: 'YouTube Downloader',
    description: 'Flask-приложение для скачивания видео и аудио с простым интерфейсом.',
    emoji: '▶️',
    tech: ['Python', 'Flask', 'JS'],
    source: 'legacy-src/Youtube_downloader/',
    playable: false,
    c1: '#ff6aa8',
    c2: '#ffcb5c',
    meta: 'flask',
  },
  {
    slug: 'japanese-math',
    title: 'Japanese Memory Math',
    description: 'Консольный тренажёр памяти и счёта в японской традиции — маленький эксперимент на Python.',
    emoji: '🧮',
    tech: ['Python', 'CLI'],
    source: 'legacy-src/japanese_math/',
    playable: false,
    c1: '#c4f56a',
    c2: '#38e0f2',
    meta: 'python cli',
  },
];

