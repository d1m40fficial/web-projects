export type Kind = 'movie' | 'book';

export interface RatedTitle {
  id: string;
  title: string;
  creator: string;
  year: number;
  genre: string;
  rating: number;
  votes: number; // thousands of ratings
  kind: Kind;
}

/**
 * Curated demo catalogue. Ratings are rounded approximations of public
 * averages (IMDb / Goodreads / Лаборатория Фантастики) and exist purely to
 * power the dashboard. They are not an official dataset.
 */
export const titles: RatedTitle[] = [
  { id: 'shawshank', title: 'Побег из Шоушенка', creator: 'Фрэнк Дарабонт', year: 1994, genre: 'Драма', rating: 9.3, votes: 2900, kind: 'movie' },
  { id: 'godfather', title: 'Крёстный отец', creator: 'Фрэнсис Форд Коппола', year: 1972, genre: 'Драма', rating: 9.2, votes: 2000, kind: 'movie' },
  { id: 'dark-knight', title: 'Тёмный рыцарь', creator: 'Кристофер Нолан', year: 2008, genre: 'Триллер', rating: 9.0, votes: 2900, kind: 'movie' },
  { id: 'pulp-fiction', title: 'Криминальное чтиво', creator: 'Квентин Тарантино', year: 1994, genre: 'Триллер', rating: 8.9, votes: 2200, kind: 'movie' },
  { id: 'lotr-return', title: 'Властелин колец: Возвращение короля', creator: 'Питер Джексон', year: 2003, genre: 'Фэнтези', rating: 9.0, votes: 2000, kind: 'movie' },
  { id: 'forrest', title: 'Форрест Гамп', creator: 'Роберт Земекис', year: 1994, genre: 'Драма', rating: 8.8, votes: 2200, kind: 'movie' },
  { id: 'inception', title: 'Начало', creator: 'Кристофер Нолан', year: 2010, genre: 'Фантастика', rating: 8.8, votes: 2500, kind: 'movie' },
  { id: 'matrix', title: 'Матрица', creator: 'Лана и Лилли Вачовски', year: 1999, genre: 'Фантастика', rating: 8.7, votes: 2100, kind: 'movie' },
  { id: 'interstellar', title: 'Интерстеллар', creator: 'Кристофер Нолан', year: 2014, genre: 'Фантастика', rating: 8.7, votes: 2100, kind: 'movie' },
  { id: 'fight-club', title: 'Бойцовский клуб', creator: 'Дэвид Финчер', year: 1999, genre: 'Триллер', rating: 8.8, votes: 2300, kind: 'movie' },
  { id: 'goodfellas', title: 'Славные парни', creator: 'Мартин Скорсезе', year: 1990, genre: 'Драма', rating: 8.7, votes: 1200, kind: 'movie' },
  { id: 'seven', title: 'Семь', creator: 'Дэвид Финчер', year: 1995, genre: 'Детектив', rating: 8.6, votes: 1700, kind: 'movie' },
  { id: 'lambs', title: 'Молчание ягнят', creator: 'Джонатан Демме', year: 1991, genre: 'Триллер', rating: 8.6, votes: 1500, kind: 'movie' },
  { id: 'leon', title: 'Леон', creator: 'Люк Бессон', year: 1994, genre: 'Триллер', rating: 8.5, votes: 1200, kind: 'movie' },
  { id: 'lion-king', title: 'Король Лев', creator: 'Роджер Аллерс', year: 1994, genre: 'Анимация', rating: 8.5, votes: 1100, kind: 'movie' },
  { id: 'back-future', title: 'Назад в будущее', creator: 'Роберт Земекис', year: 1985, genre: 'Фантастика', rating: 8.5, votes: 1200, kind: 'movie' },
  { id: 'whiplash', title: 'Одержимость', creator: 'Дэмьен Шазелл', year: 2014, genre: 'Драма', rating: 8.5, votes: 900, kind: 'movie' },
  { id: 'shutter', title: 'Остров проклятых', creator: 'Мартин Скорсезе', year: 2010, genre: 'Детектив', rating: 8.2, votes: 1400, kind: 'movie' },
  { id: 'azkaban', title: 'Гарри Поттер и узник Азкабана', creator: 'Альфонсо Куарон', year: 2004, genre: 'Фэнтези', rating: 7.9, votes: 700, kind: 'movie' },
  { id: 'parasite', title: 'Паразиты', creator: 'Пон Джун Хо', year: 2019, genre: 'Триллер', rating: 8.5, votes: 900, kind: 'movie' },
  { id: 'dune', title: 'Дюна', creator: 'Дени Вильнёв', year: 2021, genre: 'Фантастика', rating: 8.0, votes: 900, kind: 'movie' },
  { id: 'eeaao', title: 'Всё везде и сразу', creator: 'Дэниелс', year: 2022, genre: 'Фантастика', rating: 7.8, votes: 500, kind: 'movie' },
  { id: 'oppenheimer', title: 'Оппенгеймер', creator: 'Кристофер Нолан', year: 2023, genre: 'Биография', rating: 8.3, votes: 800, kind: 'movie' },
  { id: 'spiderverse', title: 'Человек-паук: Через вселенные', creator: 'Боб Персикетти', year: 2018, genre: 'Анимация', rating: 8.4, votes: 600, kind: 'movie' },
  { id: 'spirited', title: 'Унесённые призраками', creator: 'Хаяо Миядзаки', year: 2001, genre: 'Анимация', rating: 8.6, votes: 800, kind: 'movie' },
  { id: 'up', title: 'Вверх', creator: 'Пит Доктер', year: 2009, genre: 'Анимация', rating: 8.3, votes: 1100, kind: 'movie' },
  { id: 'social', title: 'Социальная сеть', creator: 'Дэвид Финчер', year: 2010, genre: 'Биография', rating: 7.8, votes: 700, kind: 'movie' },
  { id: 'django', title: 'Джанго освобождённый', creator: 'Квентин Тарантино', year: 2012, genre: 'Драма', rating: 8.5, votes: 1600, kind: 'movie' },
  { id: 'blade2049', title: 'Бегущий по лезвию 2049', creator: 'Дени Вильнёв', year: 2017, genre: 'Фантастика', rating: 8.0, votes: 600, kind: 'movie' },
  { id: 'budapest', title: 'Отель «Гранд Будапешт»', creator: 'Уэс Андерсон', year: 2014, genre: 'Комедия', rating: 8.1, votes: 800, kind: 'movie' },

  { id: 'master-margarita', title: 'Мастер и Маргарита', creator: 'Михаил Булгаков', year: 1967, genre: 'Роман', rating: 9.4, votes: 400, kind: 'book' },
  { id: 'crime-punishment', title: 'Преступление и наказание', creator: 'Фёдор Достоевский', year: 1866, genre: 'Классика', rating: 9.2, votes: 700, kind: 'book' },
  { id: 'war-peace', title: 'Война и мир', creator: 'Лев Толстой', year: 1869, genre: 'Классика', rating: 9.0, votes: 300, kind: 'book' },
  { id: 'idiot', title: 'Идиот', creator: 'Фёдор Достоевский', year: 1869, genre: 'Классика', rating: 9.0, votes: 250, kind: 'book' },
  { id: 'dune-book', title: 'Дюна', creator: 'Фрэнк Герберт', year: 1965, genre: 'Фантастика', rating: 8.8, votes: 300, kind: 'book' },
  { id: '1984', title: '1984', creator: 'Джордж Оруэлл', year: 1949, genre: 'Фантастика', rating: 9.0, votes: 500, kind: 'book' },
  { id: 'we', title: 'Мы', creator: 'Евгений Замятин', year: 1920, genre: 'Фантастика', rating: 8.4, votes: 100, kind: 'book' },
  { id: 'hp-stone', title: 'Гарри Поттер и философский камень', creator: 'Джоан Роулинг', year: 1997, genre: 'Фэнтези', rating: 8.9, votes: 800, kind: 'book' },
  { id: 'lotr-book', title: 'Властелин колец', creator: 'Джон Толкин', year: 1954, genre: 'Фэнтези', rating: 9.1, votes: 500, kind: 'book' },
  { id: 'hobbit', title: 'Хоббит', creator: 'Джон Толкин', year: 1937, genre: 'Фэнтези', rating: 8.7, votes: 400, kind: 'book' },
  { id: 'mockingbird', title: 'Убить пересмешника', creator: 'Харпер Ли', year: 1960, genre: 'Классика', rating: 9.0, votes: 400, kind: 'book' },
  { id: 'three-comrades', title: 'Три товарища', creator: 'Эрих Мария Ремарк', year: 1936, genre: 'Роман', rating: 9.2, votes: 300, kind: 'book' },
  { id: 'rye', title: 'Над пропастью во ржи', creator: 'Джером Сэлинджер', year: 1951, genre: 'Роман', rating: 8.3, votes: 250, kind: 'book' },
  { id: 'algernon', title: 'Цветы для Элджернона', creator: 'Дэниел Киз', year: 1966, genre: 'Фантастика', rating: 9.2, votes: 300, kind: 'book' },
  { id: 'solaris', title: 'Солярис', creator: 'Станислав Лем', year: 1961, genre: 'Фантастика', rating: 8.7, votes: 150, kind: 'book' },
  { id: 'roadside', title: 'Пикник на обочине', creator: 'Аркадий и Борис Стругацкие', year: 1972, genre: 'Фантастика', rating: 8.9, votes: 200, kind: 'book' },
  { id: 'hard-god', title: 'Трудно быть богом', creator: 'Аркадий и Борис Стругацкие', year: 1964, genre: 'Фантастика', rating: 8.8, votes: 180, kind: 'book' },
  { id: 'martian', title: 'Марсианин', creator: 'Энди Вейер', year: 2011, genre: 'Фантастика', rating: 8.6, votes: 300, kind: 'book' },
  { id: 'got', title: 'Игра престолов', creator: 'Джордж Мартин', year: 1996, genre: 'Фэнтези', rating: 9.0, votes: 400, kind: 'book' },
  { id: 'witcher', title: 'Ведьмак. Последнее желание', creator: 'Анджей Сапковский', year: 1993, genre: 'Фэнтези', rating: 8.6, votes: 250, kind: 'book' },
  { id: 'holmes', title: 'Приключения Шерлока Холмса', creator: 'Артур Конан Дойл', year: 1892, genre: 'Детектив', rating: 8.9, votes: 300, kind: 'book' },
  { id: 'orient-express', title: 'Убийство в «Восточном экспрессе»', creator: 'Агата Кристи', year: 1934, genre: 'Детектив', rating: 8.7, votes: 200, kind: 'book' },
  { id: 'dragon-tattoo', title: 'Девушка с татуировкой дракона', creator: 'Стиг Ларссон', year: 2005, genre: 'Детектив', rating: 8.3, votes: 200, kind: 'book' },
  { id: 'sapiens', title: 'Sapiens. Краткая история человечества', creator: 'Юваль Ной Харари', year: 2011, genre: 'Нон-фикшн', rating: 8.8, votes: 300, kind: 'book' },
  { id: 'brief-time', title: 'Краткая история времени', creator: 'Стивен Хокинг', year: 1988, genre: 'Наука', rating: 8.7, votes: 200, kind: 'book' },
  { id: 'thinking', title: 'Думай медленно… решай быстро', creator: 'Даниэль Канеман', year: 2011, genre: 'Наука', rating: 8.6, votes: 150, kind: 'book' },
  { id: 'jobs', title: 'Стив Джобс', creator: 'Уолтер Айзексон', year: 2011, genre: 'Биография', rating: 8.5, votes: 150, kind: 'book' },
  { id: 'breath', title: 'Когда дыхание растворяется в воздухе', creator: 'Пол Каланити', year: 2016, genre: 'Биография', rating: 9.0, votes: 100, kind: 'book' },
  { id: 'solitude', title: 'Сто лет одиночества', creator: 'Габриэль Гарсиа Маркес', year: 1967, genre: 'Роман', rating: 9.1, votes: 300, kind: 'book' },
  { id: 'cuckoo', title: 'Над кукушкиным гнездом', creator: 'Кен Кизи', year: 1962, genre: 'Роман', rating: 8.9, votes: 200, kind: 'book' },
  { id: 'fahrenheit', title: '451° по Фаренгейту', creator: 'Рэй Брэдбери', year: 1953, genre: 'Фантастика', rating: 8.5, votes: 250, kind: 'book' },
];
