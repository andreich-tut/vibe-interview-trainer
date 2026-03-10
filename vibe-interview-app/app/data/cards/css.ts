export const cssCards = [
  {
    id: "1",
    category: "Селекторы",
    question: "Что такое селектор и какие типы селекторов существуют?",
    answer:
      "Селектор — шаблон для выбора HTML элементов. Типы: элемент (p), класс (.class), ID (#id), атрибут ([type]), комбинаторы (div > p, div p, p + span, p ~ span), псевдокласс (:hover, :active, :first-child), псевдоэлемент (::before, ::after).",
  },
  {
    id: "2",
    category: "Селекторы",
    question: "Что такое специфичность CSS селектора?",
    answer:
      "Специфичность определяет приоритет правила. Считается: элемент = 1, класс = 10, ID = 100, inline = 1000. !important = выше всех. Если две правила конфликтуют, побеждает более специфичное. Каскадность — последнее правило побеждает при равной специфичности.",
  },
  {
    id: "3",
    category: "Flexbox",
    question: "Как работает Flexbox и его основные свойства?",
    answer:
      "Flexbox выравнивает элементы в одномерную строку или столбец. Контейнер: display: flex, flex-direction, justify-content (по оси), align-items (поперек). Элементы: flex (grow/shrink/basis), align-self. gap — расстояние. Идеален для навигации, карточек, выравнивания.",
  },
  {
    id: "4",
    category: "Flexbox",
    question: "В чем разница между justify-content и align-items?",
    answer:
      "justify-content выравнивает по главной оси (обычно горизонталь). align-items выравнивает по поперечной оси (обычно вертикаль). Если flex-direction: column, то оси меняются. flex-start, center, space-between, space-around и т.д. — значения для обоих.",
  },
  {
    id: "5",
    category: "Grid",
    question: "Как работает CSS Grid?",
    answer:
      "Grid выравнивает элементы в двумерную таблицу (строки И столбцы). display: grid, grid-template-columns, grid-template-rows. Элементы: grid-column, grid-row. Автоматическая раскладка. Мощнее Flexbox для сложных макетов. Vs Flexbox: Grid для 2D, Flexbox для 1D.",
  },
  {
    id: "6",
    category: "Отзывчивость",
    question: "Как использовать media queries для адаптивного дизайна?",
    answer:
      "@media (max-width: 768px) { } — для экранов меньше 768px. @media (min-width: 1024px) { } — для больше 1024px. @media (prefers-dark-scheme) { } — для тёмной темы. Mobile-first подход: сначала стили для мобильных, потом расширяем. Или desktop-first (не рекомендуется).",
  },
  {
    id: "7",
    category: "Анимации",
    question: "Что такое transition в CSS?",
    answer:
      "transition плавно изменяет одно свойство. transition: background 0.3s ease; Изменяется фоновый цвет за 0.3s с функцией ease. Можно на одном свойстве: transition: all 0.3s; Используется при :hover, :focus. Лучше всего для простых переходов.",
  },
  {
    id: "8",
    category: "Анимации",
    question: "Как создать CSS анимацию с @keyframes?",
    answer:
      "@keyframes slidein { from { transform: translateX(-100%); } to { transform: translateX(0); } } .item { animation: slidein 0.5s ease-out; } Более сложные анимации чем transition. Можно указать multiple steps (0%, 50%, 100%). animation-delay для задержки.",
  },
  {
    id: "9",
    category: "Преобразования",
    question: "Какие трансформации можно применить к элементу?",
    answer:
      "transform: rotate(45deg), scale(1.5), translateX(50px), skew(10deg), perspective(1000px). Можно комбинировать: transform: rotate(45deg) scale(1.5). Не влияют на другие элементы (не меняют flow). Эффективны для анимаций (GPU ускорение).",
  },
  {
    id: "10",
    category: "Препроцессоры",
    question: "Что такое SASS/SCSS и его преимущества?",
    answer:
      "SASS — препроцессор CSS с переменными, вложенностью, миксинами, функциями. $color: red; .button { background: $color; } Вложенность: .button { &:hover { } }. Лучше организация кода. Компилируется в обычный CSS. Альтернатива: PostCSS, Styled-components, CSS Modules.",
  },
];
