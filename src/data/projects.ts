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
    slug: '2048',
    index: '02',
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
    index: '03',
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
    slug: 'palette',
    index: '04',
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
    index: '05',
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
    index: '06',
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
    index: '07',
    title: 'Локальный архив',
    tagline: 'Старые проекты, новая витрина',
    description:
      'Девять играбельных HTML-проектов из локальной папки — от Raft Survival до Nohea — с запуском прямо в модальном окне.',
    tags: ['HTML', 'JavaScript', 'iframe'],
    category: 'games',
    icon: 'archive',
    c1: '#8b6bff',
    c2: '#ffcb5c',
    preview: 'archive',
    notes: [
      { title: 'Iframe без сборки', text: 'Каждый архивный проект — самостоятельный HTML, встроенный через iframe с изоляцией.' },
      { title: 'Что внутри', text: 'Raft Survival, Neon Pinball, Snake, Sudoku, Pomodoro, звёздное небо, «Быки и коровы», Space Club и Nohea.' },
      { title: 'Nohea в браузере', text: 'Японский тренажёр памяти переписан с Python/Tkinter на HTML, CSS и vanilla JS — теперь он запускается прямо здесь.' },
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
    slug: 'japanese-math',
    title: 'Nohea — математика на память',
    description: 'Браузерный тренажёр устного счёта: 5, 10 или 15 минут, растущая сложность, серии и история результатов.',
    emoji: '🧮',
    tech: ['HTML', 'JavaScript', 'localStorage'],
    href: 'legacy/japanese-math/index.html',
    playable: true,
    c1: '#b33a2b',
    c2: '#f2ede3',
    meta: '5–15 мин · браузер',
  },
];

