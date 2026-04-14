/* =========================================================
   Shared tile registry (описание страниц, плашек и их полей)
   Используется и админ-панелью (admin.js), и публичными
   страницами (script.js) — чтобы было единое место для
   перечня data-tile и их редактируемых полей.
   ========================================================= */
window.PAGE_REGISTRY = [
  {
    key: 'index',
    title: 'Главная',
    file: 'index.html',
    tiles: [
      {
        id: 'hero', name: 'Hero-блок (заголовок + CTA)',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.hero__title',    type: 'html',
            default: 'Твоё будущее<br>начинается здесь' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.hero__subtitle', type: 'multiline',
            default: 'Искусственный интеллект меняет мир прямо сейчас. Стань тем, кто создаёт технологии завтрашнего дня — начни с лучшего факультета страны.' },
          { id: 'btn-primary', label: 'Основная кнопка', selector: '.hero__actions .btn--primary', type: 'text',
            default: 'Узнать шансы поступления' },
          { id: 'btn-outline', label: 'Кнопка справа',   selector: '.hero__actions .btn--outline', type: 'text',
            default: 'Программы обучения' },
        ],
      },
      {
        id: 'about-section', name: 'Секция «О факультете» (целиком)',
        fields: [
          { id: 'title',    label: 'Заголовок секции', selector: '.section__title',    type: 'text',
            default: 'О факультете' },
          { id: 'subtitle', label: 'Подзаголовок',     selector: '.section__subtitle', type: 'text',
            default: 'Цифры, которые говорят сами за себя' },
        ],
      },
      {
        id: 'about-card-1', name: 'Карточка · 10+ лабораторий',
        fields: [
          { id: 'icon',   label: 'Иконка (эмодзи)', selector: '.card__icon',   type: 'text', default: '🔬' },
          { id: 'number', label: 'Число',           selector: '.card__number', type: 'text', default: '10+' },
          { id: 'text',   label: 'Подпись',         selector: '.card__text',   type: 'multiline',
            default: 'Лабораторий с оборудованием мирового уровня' },
        ],
      },
      {
        id: 'about-card-2', name: 'Карточка · Стажировки с 1 курса',
        fields: [
          { id: 'icon',   label: 'Иконка (эмодзи)', selector: '.card__icon',   type: 'text', default: '🚀' },
          { id: 'number', label: 'Число',           selector: '.card__number', type: 'text', default: '1 курс' },
          { id: 'text',   label: 'Подпись',         selector: '.card__text',   type: 'multiline',
            default: 'Стажировки в IT-компаниях уже с первого курса' },
        ],
      },
      {
        id: 'about-card-3', name: 'Карточка · 95% трудоустройства',
        fields: [
          { id: 'icon',   label: 'Иконка (эмодзи)', selector: '.card__icon',   type: 'text', default: '🏆' },
          { id: 'number', label: 'Число',           selector: '.card__number', type: 'text', default: '95%' },
          { id: 'text',   label: 'Подпись',         selector: '.card__text',   type: 'multiline',
            default: 'Выпускников трудоустраиваются в первый год' },
        ],
      },
      {
        id: 'about-card-4', name: 'Карточка · 50+ проектов',
        fields: [
          { id: 'icon',   label: 'Иконка (эмодзи)', selector: '.card__icon',   type: 'text', default: '🤖' },
          { id: 'number', label: 'Число',           selector: '.card__number', type: 'text', default: '50+' },
          { id: 'text',   label: 'Подпись',         selector: '.card__text',   type: 'multiline',
            default: 'Проектов с реальными заказчиками ежегодно' },
        ],
      },
      {
        id: 'programs-section', name: 'Секция «Программы обучения» (целиком)',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Программы обучения' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Выбери свой путь в мире ИИ' },
        ],
      },
      {
        id: 'program-1', name: 'Программа · ИИ и машинное обучение',
        fields: [
          { id: 'badge',   label: 'Бейдж',    selector: '.card__badge',   type: 'text', default: 'Бакалавриат' },
          { id: 'heading', label: 'Название', selector: '.card__heading', type: 'text', default: 'Искусственный интеллект и машинное обучение' },
          { id: 'desc',    label: 'Описание', selector: '.card__desc',    type: 'multiline',
            default: '4 года обучения. Python, нейросети, компьютерное зрение, NLP и работа с большими данными.' },
          { id: 'btn',     label: 'Кнопка',   selector: '.btn--primary',  type: 'text', default: 'Подробнее' },
        ],
      },
      {
        id: 'program-2', name: 'Программа · Робототехника',
        fields: [
          { id: 'badge',   label: 'Бейдж',    selector: '.card__badge',   type: 'text', default: 'Бакалавриат' },
          { id: 'heading', label: 'Название', selector: '.card__heading', type: 'text', default: 'Робототехника и интеллектуальные системы' },
          { id: 'desc',    label: 'Описание', selector: '.card__desc',    type: 'multiline',
            default: '4 года обучения. Автономные системы, сенсоры, управление роботами и встраиваемый ИИ.' },
          { id: 'btn',     label: 'Кнопка',   selector: '.btn--primary',  type: 'text', default: 'Подробнее' },
        ],
      },
      {
        id: 'program-3', name: 'Программа · Генеративный ИИ (магистратура)',
        fields: [
          { id: 'badge',   label: 'Бейдж',    selector: '.card__badge',   type: 'text', default: 'Магистратура' },
          { id: 'heading', label: 'Название', selector: '.card__heading', type: 'text', default: 'Генеративный ИИ и большие языковые модели' },
          { id: 'desc',    label: 'Описание', selector: '.card__desc',    type: 'multiline',
            default: '2 года обучения. Архитектуры трансформеров, RLHF, деплой моделей и этика ИИ.' },
          { id: 'btn',     label: 'Кнопка',   selector: '.btn--primary',  type: 'text', default: 'Подробнее' },
        ],
      },
      {
        id: 'reviews-section', name: 'Секция «Отзывы студентов» (целиком)',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Отзывы студентов' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Те, кто уже выбрал будущее' },
        ],
      },
      {
        id: 'review-1', name: 'Отзыв · Анна Климова',
        fields: [
          { id: 'avatar', label: 'Инициалы',     selector: '.review__avatar', type: 'text', default: 'АК' },
          { id: 'name',   label: 'Имя',          selector: '.review__name',   type: 'text', default: 'Анна Климова' },
          { id: 'role',   label: 'Роль',         selector: '.review__role',   type: 'text', default: '3 курс, ИИ и МО' },
          { id: 'text',   label: 'Текст отзыва', selector: '.review__text',   type: 'multiline',
            default: '«Здесь не просто учат программировать — тебя реально погружают в науку. На втором курсе я уже работала над проектом с Яндексом. Это лучшее решение в моей жизни.»' },
        ],
      },
      {
        id: 'review-2', name: 'Отзыв · Дмитрий Морозов',
        fields: [
          { id: 'avatar', label: 'Инициалы',     selector: '.review__avatar', type: 'text', default: 'ДМ' },
          { id: 'name',   label: 'Имя',          selector: '.review__name',   type: 'text', default: 'Дмитрий Морозов' },
          { id: 'role',   label: 'Роль',         selector: '.review__role',   type: 'text', default: 'Выпускник 2025' },
          { id: 'text',   label: 'Текст отзыва', selector: '.review__text',   type: 'multiline',
            default: '«Факультет дал мне не только хард-скиллы, но и комьюнити. Хакатоны, митапы, стартап-инкубатор — всё это здесь. Сейчас работаю ML-инженером в Сбере.»' },
        ],
      },
      {
        id: 'review-3', name: 'Отзыв · Елена Сидорова',
        fields: [
          { id: 'avatar', label: 'Инициалы',     selector: '.review__avatar', type: 'text', default: 'ЕС' },
          { id: 'name',   label: 'Имя',          selector: '.review__name',   type: 'text', default: 'Елена Сидорова' },
          { id: 'role',   label: 'Роль',         selector: '.review__role',   type: 'text', default: '2 курс, Робототехника' },
          { id: 'text',   label: 'Текст отзыва', selector: '.review__text',   type: 'multiline',
            default: '«Я думала, что ИИ — это что-то далёкое и сложное. А тут уже на первом курсе мы собирали роботов и учили их распознавать объекты. Это было нереально круто!»' },
        ],
      },
      {
        id: 'apply-section', name: 'CTA «Готов сделать первый шаг?»',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Готов сделать первый шаг?' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'multiline',
            default: 'Оставь заявку, и мы расскажем всё о поступлении — баллы ЕГЭ, олимпиады и бюджетные места.' },
          { id: 'btn',      label: 'Кнопка',       selector: '.btn--white',        type: 'text', default: 'Оставить заявку' },
        ],
      },
    ],
  },
  {
    key: 'about',
    title: 'О факультете',
    file: 'about.html',
    tiles: [
      {
        id: 'about-hero', name: 'Hero-блок',
        fields: [
          { id: 'badge', label: 'Бейдж',      selector: '.about-hero__badge', type: 'text', default: 'Факультет будущего' },
          { id: 'title', label: 'Заголовок',  selector: '.about-hero__title', type: 'text', default: 'Факультет искусственного интеллекта' },
          { id: 'lead',  label: 'Вступление', selector: '.about-hero__lead',  type: 'multiline',
            default: 'Готовим специалистов в сфере анализа данных, машинного обучения и глубокого обучения нового уровня. Выпускники факультета смогут успешно реализовать себя как в работе в государственных корпорациях, так и в рамках частного бизнеса, решать практические задачи по развитию, созданию и усовершенствованию технологий искусственного интеллекта.' },
          { id: 'btn-primary', label: 'Основная кнопка', selector: '.about-hero__actions .btn--primary', type: 'text', default: 'Поступить' },
          { id: 'btn-outline', label: 'Кнопка справа',   selector: '.about-hero__actions .btn--outline', type: 'text', default: 'Узнать больше' },
        ],
      },
      {
        id: 'infrastructure-section', name: 'Секция «Инфраструктура и технологии»',
        fields: [
          { id: 'eyebrow', label: 'Надзаголовок', selector: '.about-section__eyebrow', type: 'text', default: 'Инфраструктура' },
          { id: 'title',   label: 'Заголовок',    selector: '.about-section__title',   type: 'text', default: 'Инфраструктура и технологии' },
          { id: 'intro',   label: 'Вступление',   selector: '.about-section__intro',   type: 'multiline',
            default: 'Факультет оснащён современным техническим оборудованием. Студентам доступна лаборатория ИИ, менторство ведущих разработчиков и вычислительные мощности суперкомпьютера РУДН.' },
        ],
      },
      {
        id: 'infra-card-1', name: 'Карточка · Современное оборудование',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.infra-card__title', type: 'text', default: 'Современное оборудование' },
          { id: 'text',  label: 'Текст',     selector: '.infra-card__text',  type: 'multiline',
            default: 'Факультет оснащён современным техническим оборудованием — передовая база для практической подготовки на уровне индустриальных стандартов.' },
        ],
      },
      {
        id: 'infra-card-2', name: 'Карточка · Лаборатория ИИ',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.infra-card__title', type: 'text', default: 'Лаборатория искусственного интеллекта' },
          { id: 'text',  label: 'Текст',     selector: '.infra-card__text',  type: 'multiline',
            default: 'Открыта лаборатория ИИ, в которой студенты и преподаватели реализуют самые смелые проекты под менторством ведущих разработчиков отрасли.' },
        ],
      },
      {
        id: 'infra-card-3', name: 'Карточка · Суперкомпьютер РУДН',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.infra-card__title', type: 'text', default: 'Суперкомпьютер РУДН' },
          { id: 'text',  label: 'Текст',     selector: '.infra-card__text',  type: 'multiline',
            default: 'Обучающимся предоставляется доступ к суперкомпьютеру РУДН — для расчётов, обучения нейросетей и масштабных научных задач.' },
        ],
      },
      {
        id: 'partners-section', name: 'Секция «Партнёры и практика»',
        fields: [
          { id: 'eyebrow', label: 'Надзаголовок', selector: '.about-section__eyebrow', type: 'text', default: 'Партнёры' },
          { id: 'title',   label: 'Заголовок',    selector: '.about-section__title',   type: 'text', default: 'Партнёры и практика' },
          { id: 'text',    label: 'Описание',     selector: '.partners-text p',        type: 'html',
            default: 'Образовательные программы факультета реализуются совместно с компаниями-партнёрами — <strong>Сбер</strong> и <strong>Альфа-Банк</strong> — IT-гигантами, признанными не только в России. Обучение направлено на развитие конкретных практических навыков в области искусственного интеллекта, необходимых для работы в крупнейших компаниях отрасли.' },
        ],
      },
      {
        id: 'partner-sber', name: 'Партнёр · Сбер',
        fields: [
          { id: 'logo',    label: 'Логотип/Название', selector: '.partner-card__logo',    type: 'text', default: 'Сбер' },
          { id: 'caption', label: 'Подпись',          selector: '.partner-card__caption', type: 'text', default: 'Технологический партнёр' },
        ],
      },
      {
        id: 'partner-alfa', name: 'Партнёр · Альфа-Банк',
        fields: [
          { id: 'logo',    label: 'Логотип/Название', selector: '.partner-card__logo',    type: 'text', default: 'Альфа-Банк' },
          { id: 'caption', label: 'Подпись',          selector: '.partner-card__caption', type: 'text', default: 'Технологический партнёр' },
        ],
      },
      {
        id: 'career-cta', name: 'CTA «Карьера ещё до диплома»',
        fields: [
          { id: 'eyebrow', label: 'Надзаголовок', selector: '.career-cta__eyebrow', type: 'text', default: 'Карьерные перспективы' },
          { id: 'title',   label: 'Заголовок',    selector: '.career-cta__title',   type: 'text', default: 'Карьера ещё до диплома' },
          { id: 'text',    label: 'Описание',     selector: '.career-cta__text',    type: 'multiline',
            default: 'Большинство студентов могут получить предложение о работе ещё до окончания обучения в бакалавриате и имеют возможность продолжить учёбу в магистратуре за счёт работодателя.' },
          { id: 'item-1',  label: 'Пункт 1',      selector: '.career-cta__item:nth-child(1) .career-cta__item-text', type: 'text',
            default: 'Оффер до окончания бакалавриата' },
          { id: 'item-2',  label: 'Пункт 2',      selector: '.career-cta__item:nth-child(2) .career-cta__item-text', type: 'text',
            default: 'Магистратура за счёт работодателя' },
          { id: 'btn',     label: 'Кнопка',       selector: '.btn--white',          type: 'text', default: 'Узнать об условиях поступления' },
        ],
      },
    ],
  },
  {
    key: 'achievements',
    title: 'Достижения',
    file: 'achievements.html',
    tiles: [
      {
        id: 'stub-content', name: 'Основной контент страницы',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Достижения' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Страница находится в разработке' },
          { id: 'btn',      label: 'Кнопка',       selector: '.btn',               type: 'text', default: 'Назад на главную' },
        ],
      },
    ],
  },
  {
    key: 'news',
    title: 'Новости',
    file: 'news.html',
    tiles: [
      {
        id: 'stub-content', name: 'Основной контент страницы',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Новости' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Страница находится в разработке' },
          { id: 'btn',      label: 'Кнопка',       selector: '.btn',               type: 'text', default: 'Назад на главную' },
        ],
      },
    ],
  },
  {
    key: 'reviews',
    title: 'Отзывы',
    file: 'reviews.html',
    tiles: [
      {
        id: 'stub-content', name: 'Основной контент страницы',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Отзывы' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Страница находится в разработке' },
          { id: 'btn',      label: 'Кнопка',       selector: '.btn',               type: 'text', default: 'Назад на главную' },
        ],
      },
    ],
  },
  {
    key: 'admission',
    title: 'Поступление',
    file: 'admission.html',
    tiles: [
      {
        id: 'stub-content', name: 'Основной контент страницы',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text', default: 'Поступление' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'text', default: 'Страница находится в разработке' },
          { id: 'btn',      label: 'Кнопка',       selector: '.btn',               type: 'text', default: 'Назад на главную' },
        ],
      },
    ],
  },
];
