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

      // ---- ДОСТИЖЕНИЯ (КАРУСЕЛЬ) ----
      {
        id: 'achievements-carousel', name: 'Секция «Достижения» — заголовок',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text',
            default: 'Победы, которые говорят за нас.' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'multiline',
            default: 'Научные премии, победы в соревнованиях и признание индустрии — результат совместной работы студентов и преподавателей.' },
        ],
      },
      { id: 'achieve-card-1', name: 'Достижение 1 · Олимпиада', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Олимпиада' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2025' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: '1 место на Всероссийской олимпиаде по ИИ' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Команда факультета заняла первое место среди 47 вузов страны в категории «Машинное обучение».' },
      ]},
      { id: 'achieve-card-2', name: 'Достижение 2 · Публикация', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Публикация' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2025' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'Статья в Nature Machine Intelligence' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Исследование по интерпретируемости нейронных сетей принято в один из ведущих журналов мира.' },
      ]},
      { id: 'achieve-card-3', name: 'Достижение 3 · Хакатон', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Хакатон' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2025' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'Победа на международном HackAI' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Студенческая команда обошла участников из 23 стран с решением для медицинской диагностики на основе CV.' },
      ]},
      { id: 'achieve-card-4', name: 'Достижение 4 · Рейтинг', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Рейтинг' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2025' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'ТОП-3 по направлению ИИ в России' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Факультет вошёл в тройку лучших по подготовке специалистов в области искусственного интеллекта по версии Эксперт РА.' },
      ]},
      { id: 'achieve-card-5', name: 'Достижение 5 · Грант', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Грант' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2024' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'Грант РНФ на 12 млн рублей' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Научная группа получила финансирование на трёхлетнее исследование в области генеративных мультимодальных моделей.' },
      ]},
      { id: 'achieve-card-6', name: 'Достижение 6 · Партнёрство', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Партнёрство' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2024' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'Стратегическое соглашение со Сбером' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Подписано соглашение о целевой подготовке студентов и совместных R&D-проектах в области FinTech AI.' },
      ]},
      { id: 'achieve-card-7', name: 'Достижение 7 · Стартап', fields: [
          { id: 'tag',   label: 'Категория', selector: '.achieve-card__tag',   type: 'text', default: 'Стартап' },
          { id: 'year',  label: 'Год',       selector: '.achieve-card__year',  type: 'text', default: '2024' },
          { id: 'title', label: 'Заголовок', selector: '.achieve-card__title', type: 'text',
            default: 'Выпускник основал стартап MedAI' },
          { id: 'desc',  label: 'Описание',  selector: '.achieve-card__desc',  type: 'multiline',
            default: 'Компания привлекла $2 млн инвестиций для разработки ИИ-ассистента для врачей первичного звена.' },
      ]},

      // ---- ПРЕПОДАВАТЕЛИ (КАРУСЕЛЬ) ----
      {
        id: 'teachers-carousel', name: 'Секция «Преподаватели» — заголовок',
        fields: [
          { id: 'title',    label: 'Заголовок',    selector: '.section__title',    type: 'text',
            default: 'Учёные, которые передают знания.' },
          { id: 'subtitle', label: 'Подзаголовок', selector: '.section__subtitle', type: 'multiline',
            default: 'Каждый преподаватель — действующий исследователь с публикациями, грантами и опытом работы в индустрии.' },
        ],
      },
      { id: 'teacher-card-1', name: 'Преподаватель 1 · Иванов', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'АИ' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Иванов Алексей Петрович' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'д.т.н., профессор' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Заведующий кафедрой машинного обучения' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: '20 лет в академической науке. Автор 80+ публикаций, лауреат премии Правительства РФ в области образования.' },
      ]},
      { id: 'teacher-card-2', name: 'Преподаватель 2 · Смирнова', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'СЕ' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Смирнова Елена Викторовна' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'к.ф.-м.н., доцент' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Специалист по компьютерному зрению' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: 'Работала в лаборатории Samsung AI. Под её руководством защищены 12 кандидатских диссертаций.' },
      ]},
      { id: 'teacher-card-3', name: 'Преподаватель 3 · Козлов', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'КД' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Козлов Дмитрий Андреевич' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'PhD, доцент' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Эксперт в области NLP и LLM' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: 'Стажировался в Stanford NLP Group. Соавтор открытой языковой модели RuBERT-2, используемой в 300+ проектах.' },
      ]},
      { id: 'teacher-card-4', name: 'Преподаватель 4 · Петрова', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'ПО' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Петрова Ольга Николаевна' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'д.т.н., профессор' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Научный руководитель лаборатории робототехники' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: 'Руководит грантом РНФ. Соавтор патентов на алгоритмы управления автономными системами.' },
      ]},
      { id: 'teacher-card-5', name: 'Преподаватель 5 · Новиков', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'НС' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Новиков Сергей Михайлович' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'к.т.н., старший преподаватель' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Специалист по обучению с подкреплением' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: 'Экс-ML инженер Яндекса. Разрабатывает RL-агентов для промышленной автоматизации совместно с Росатомом.' },
      ]},
      { id: 'teacher-card-6', name: 'Преподаватель 6 · Захарова', fields: [
          { id: 'avatar', label: 'Инициалы',      selector: '.teacher-card__avatar', type: 'text', default: 'ЗМ' },
          { id: 'name',   label: 'ФИО',           selector: '.teacher-card__name',   type: 'text', default: 'Захарова Мария Дмитриевна' },
          { id: 'rank',   label: 'Учёная степень', selector: '.teacher-card__rank',  type: 'text', default: 'PhD, доцент' },
          { id: 'role',   label: 'Должность',     selector: '.teacher-card__role',   type: 'text', default: 'Исследователь в области генеративных моделей' },
          { id: 'bio',    label: 'Биография',     selector: '.teacher-card__bio',    type: 'multiline',
            default: 'Публикации на NeurIPS и ICML. Читает авторский курс «Диффузионные модели» — один из первых в России.' },
      ]},
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
  {
    key: 'grant',
    title: 'Грант РНФ',
    file: 'grant.html',
    tiles: [
      {
        id: 'grant-hero', name: 'Hero — заголовок страницы',
        fields: [
          { id: 'badge', label: 'Бейдж',         selector: '.grant-hero__badge', type: 'text',
            default: 'Научный грант · РНФ · 2024–2026' },
          { id: 'lead',  label: 'Вводный текст', selector: '.grant-hero__lead',  type: 'multiline',
            default: 'Факультет искусственного интеллекта РУДН получил финансирование Российского научного фонда на трёхлетнюю исследовательскую программу в области генеративных мультимодальных моделей. Проект реализуется научной группой под руководством проф. Захаровой М.Д.' },
        ],
      },
      {
        id: 'grant-goals-section', name: 'Секция «Цели проекта» — заголовок',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.grant-section__title', type: 'text',
            default: 'Что мы исследуем.' },
          { id: 'intro', label: 'Введение',  selector: '.grant-section__intro', type: 'multiline',
            default: 'Проект направлен на создание нового класса генеративных моделей, способных работать одновременно с текстом, изображениями и звуком.' },
        ],
      },
      { id: 'grant-goal-1', name: 'Цель 1 · Унифицированная архитектура', fields: [
          { id: 'title', label: 'Заголовок', selector: '.goal-item__title', type: 'text',
            default: 'Унифицированная мультимодальная архитектура' },
          { id: 'text',  label: 'Описание',  selector: '.goal-item__text',  type: 'multiline',
            default: 'Разработка единой архитектуры трансформерного типа, обрабатывающей текст, изображения, аудио и структурированные данные в общем скрытом пространстве без модальностно-специфических энкодеров.' },
      ]},
      { id: 'grant-goal-2', name: 'Цель 2 · Обучение при ограниченных данных', fields: [
          { id: 'title', label: 'Заголовок', selector: '.goal-item__title', type: 'text',
            default: 'Эффективное обучение при ограниченных данных' },
          { id: 'text',  label: 'Описание',  selector: '.goal-item__text',  type: 'multiline',
            default: 'Разработка методов few-shot и zero-shot адаптации мультимодальных моделей для русскоязычного домена, где аннотированных данных значительно меньше, чем в английском.' },
      ]},
      { id: 'grant-goal-3', name: 'Цель 3 · Контролируемая генерация', fields: [
          { id: 'title', label: 'Заголовок', selector: '.goal-item__title', type: 'text',
            default: 'Контролируемая генерация и выравнивание' },
          { id: 'text',  label: 'Описание',  selector: '.goal-item__text',  type: 'multiline',
            default: 'Исследование методов RLHF и Constitutional AI для выравнивания генеративных моделей с предпочтениями пользователей, обеспечения фактической точности и снижения галлюцинаций.' },
      ]},
      { id: 'grant-goal-4', name: 'Цель 4 · Интерпретируемость', fields: [
          { id: 'title', label: 'Заголовок', selector: '.goal-item__title', type: 'text',
            default: 'Интерпретируемость и безопасность' },
          { id: 'text',  label: 'Описание',  selector: '.goal-item__text',  type: 'multiline',
            default: 'Разработка инструментов объяснения решений мультимодальных моделей и методов обнаружения нежелательных или вредоносных паттернов генерации на этапе инференса.' },
      ]},
      {
        id: 'grant-team-section', name: 'Секция «Команда» — заголовок',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.grant-section__title', type: 'text',
            default: 'Исследовательская группа.' },
          { id: 'intro', label: 'Введение',  selector: '.grant-section__intro', type: 'multiline',
            default: 'Восемь специалистов — преподаватели, аспиранты и студенты магистратуры — объединились для работы над проектом.' },
        ],
      },
      {
        id: 'grant-milestones-section', name: 'Секция «План» — заголовок',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.grant-section__title', type: 'text',
            default: 'Этапы и ожидаемые результаты.' },
          { id: 'intro', label: 'Введение',  selector: '.grant-section__intro', type: 'multiline',
            default: 'Трёхлетняя программа разбита на последовательные этапы с публикацией промежуточных результатов на ведущих конференциях.' },
        ],
      },
      { id: 'grant-milestone-1', name: 'Этап 2024 · Базовая архитектура', fields: [
          { id: 'title', label: 'Название', selector: '.milestone__title', type: 'text',
            default: 'Базовая архитектура и датасеты' },
          { id: 'desc',  label: 'Описание', selector: '.milestone__desc',  type: 'multiline',
            default: 'Проектирование унифицированной архитектуры, сбор и разметка русскоязычного мультимодального датасета объёмом 2 млн пар. Первая публикация на AIST 2024.' },
      ]},
      { id: 'grant-milestone-2', name: 'Этап 2025 · Предобучение', fields: [
          { id: 'title', label: 'Название', selector: '.milestone__title', type: 'text',
            default: 'Предобучение и выравнивание' },
          { id: 'desc',  label: 'Описание', selector: '.milestone__desc',  type: 'multiline',
            default: 'Предобучение модели на кластере РУДН, fine-tuning с использованием RLHF. Публикации на NeurIPS 2025 и ACL 2025.' },
      ]},
      { id: 'grant-milestone-3', name: 'Этап 2026 · Открытый выпуск', fields: [
          { id: 'title', label: 'Название', selector: '.milestone__title', type: 'text',
            default: 'Открытый выпуск и внедрение' },
          { id: 'desc',  label: 'Описание', selector: '.milestone__desc',  type: 'multiline',
            default: 'Публикация модели в открытом доступе под лицензией Apache 2.0. Демонстрация применения в медицинской диагностике. Итоговый отчёт в РНФ.' },
      ]},
      {
        id: 'grant-cta', name: 'CTA «Сотрудничество»',
        fields: [
          { id: 'title', label: 'Заголовок', selector: '.grant-cta__title', type: 'text',
            default: 'Хотите участвовать в исследовании?' },
          { id: 'text',  label: 'Описание',  selector: '.grant-cta__text',  type: 'multiline',
            default: 'Мы приглашаем студентов магистратуры и аспирантов присоединиться к команде проекта. Также открыты к партнёрству с компаниями, заинтересованными в применении мультимодальных моделей.' },
          { id: 'btn',   label: 'Кнопка',    selector: '.btn--white',       type: 'text',
            default: 'Связаться с командой' },
        ],
      },
    ],
  },
];
