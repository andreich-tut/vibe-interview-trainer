export const cssCards = [
  {
    id: "1",
    category: "Селекторы",
    question: "Что такое селектор и какие типы селекторов существуют?",
    answer:
      "Селектор — шаблон для выбора HTML элементов. Типы: элемент (p), класс (.class), ID (#id), атрибут ([type]), комбинаторы (div > p, div p, p + span, p ~ span), псевдокласс (:hover, :active, :first-child), псевдоэлемент (::before, ::after).",
    keyPoints: [
      "Шаблон для выбора HTML элементов для стилизации",
      "Базовые: элемент, класс (.class), ID (#id), атрибут ([attr])",
      "Комбинаторы: потомок (A B), дочерний (A > B), соседний (A + B), общий (A ~ B)",
      "Псевдоклассы (:hover, :nth-child) и псевдоэлементы (::before, ::after)",
    ],
  },
  {
    id: "2",
    category: "Селекторы",
    question: "Что такое специфичность CSS селектора?",
    answer:
      "Специфичность определяет приоритет правила при конфликте. Считается как кортеж (inline, ID, class, element): inline стиль > ID > класс/атрибут/псевдокласс > элемент/псевдоэлемент. Это НЕ десятичная система: 11 классов не перевешивают 1 ID. !important переопределяет любую специфичность. При равной специфичности побеждает последнее правило (каскад).",
    keyPoints: [
      "Кортеж (inline, ID, class, element) — НЕ десятичная система баллов",
      "inline стиль > ID > класс/атрибут/псевдокласс > элемент",
      "11 классов НЕ перевешивают 1 ID (распространённое заблуждение)",
      "!important переопределяет любую специфичность",
      "При равной специфичности побеждает последнее правило (каскад)",
    ],
  },
  {
    id: "3",
    category: "Flexbox",
    question: "Как работает Flexbox и его основные свойства?",
    answer:
      "Flexbox выравнивает элементы в одномерную строку или столбец. Контейнер: display: flex, flex-direction, justify-content (по оси), align-items (поперек). Элементы: flex (grow/shrink/basis), align-self. gap — расстояние. Идеален для навигации, карточек, выравнивания.",
    keyPoints: [
      "Одномерная раскладка (строка ИЛИ столбец)",
      "Контейнер: display: flex, flex-direction, justify-content, align-items",
      "Элементы: flex (grow/shrink/basis), align-self, order",
      "gap для расстояния между элементами",
    ],
  },
  {
    id: "4",
    category: "Flexbox",
    question: "В чем разница между justify-content и align-items?",
    answer:
      "justify-content выравнивает по главной оси (обычно горизонталь). align-items выравнивает по поперечной оси (обычно вертикаль). Если flex-direction: column, то оси меняются. flex-start, center, space-between, space-around и т.д. — значения для обоих.",
    keyPoints: [
      "justify-content — выравнивание по главной оси",
      "align-items — выравнивание по поперечной оси",
      "При flex-direction: column оси меняются местами",
      "Значения: flex-start, center, space-between, space-around, stretch",
    ],
  },
  {
    id: "5",
    category: "Grid",
    question: "Как работает CSS Grid?",
    answer:
      "Grid выравнивает элементы в двумерную таблицу (строки И столбцы). display: grid, grid-template-columns, grid-template-rows. Элементы: grid-column, grid-row. Автоматическая раскладка. Мощнее Flexbox для сложных макетов. Vs Flexbox: Grid для 2D, Flexbox для 1D.",
    keyPoints: [
      "Двумерная раскладка (строки И столбцы одновременно)",
      "grid-template-columns/rows для определения сетки",
      "grid-column/row для размещения элементов",
      "Grid для 2D-макетов, Flexbox для 1D-выравнивания",
    ],
  },
  {
    id: "6",
    category: "Отзывчивость",
    question: "Как использовать media queries для адаптивного дизайна?",
    answer:
      "@media (max-width: 768px) { } — для экранов меньше 768px. @media (min-width: 1024px) { } — для больше 1024px. @media (prefers-color-scheme: dark) { } — для тёмной темы. Mobile-first подход: сначала стили для мобильных, потом расширяем через min-width. Desktop-first использует max-width.",
    keyPoints: [
      "@media (max-width: N) и @media (min-width: N) для breakpoints",
      "Mobile-first: базовые стили для мобильных, расширяем через min-width",
      "prefers-color-scheme: dark для тёмной темы",
      "Типичные breakpoints: 768px (планшет), 1024px (десктоп)",
    ],
  },
  {
    id: "7",
    category: "Анимации",
    question: "Что такое transition в CSS?",
    answer:
      "transition плавно изменяет одно свойство. transition: background 0.3s ease; Изменяется фоновый цвет за 0.3s с функцией ease. Можно на одном свойстве: transition: all 0.3s; Используется при :hover, :focus. Лучше всего для простых переходов.",
    keyPoints: [
      "Плавное изменение CSS свойства между двумя состояниями",
      "Синтаксис: transition: property duration timing-function delay",
      "Срабатывает при изменении свойства (hover, focus, class toggle)",
      "Для простых переходов, @keyframes — для сложных анимаций",
    ],
  },
  {
    id: "8",
    category: "Анимации",
    question: "Как создать CSS анимацию с @keyframes?",
    answer:
      "@keyframes slidein { from { transform: translateX(-100%); } to { transform: translateX(0); } } .item { animation: slidein 0.5s ease-out; } Более сложные анимации чем transition. Можно указать multiple steps (0%, 50%, 100%). animation-delay для задержки.",
    keyPoints: [
      "@keyframes определяет шаги анимации (from/to или проценты)",
      "animation: name duration timing-function на элементе",
      "Поддерживает множество шагов (0%, 25%, 50%, 100%)",
      "animation-iteration-count: infinite для зацикливания",
    ],
  },
  {
    id: "9",
    category: "Преобразования",
    question: "Какие трансформации можно применить к элементу?",
    answer:
      "transform: rotate(45deg), scale(1.5), translateX(50px), skew(10deg), perspective(1000px). Можно комбинировать: transform: rotate(45deg) scale(1.5). Не влияют на другие элементы (не меняют flow). Эффективны для анимаций (GPU ускорение).",
    keyPoints: [
      "rotate, scale, translate, skew — основные трансформации",
      "Можно комбинировать в одном свойстве transform",
      "Не влияют на layout других элементов (не меняют document flow)",
      "Используют GPU ускорение — эффективны для анимаций",
    ],
  },
  {
    id: "10",
    category: "Препроцессоры",
    question: "Что такое SASS/SCSS и его преимущества?",
    answer:
      "SASS — препроцессор CSS с переменными, вложенностью, миксинами, функциями. $color: red; .button { background: $color; } Вложенность: .button { &:hover { } }. Лучше организация кода. Компилируется в обычный CSS. Альтернатива: PostCSS, Styled-components, CSS Modules.",
    keyPoints: [
      "CSS препроцессор с переменными ($var), вложенностью, миксинами",
      "Компилируется в обычный CSS",
      "& для обращения к родительскому селектору",
      "Альтернативы: PostCSS, CSS Modules, CSS-in-JS (styled-components)",
    ],
  },
];
