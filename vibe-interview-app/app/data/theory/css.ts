export const cssTheory = [
  {
    title: "Селекторы и специфичность",
    content: `
<h3>Типы селекторов</h3>
<pre>/* Элемент */
p { color: blue; }

/* Класс */
.container { width: 100%; }

/* ID */
#header { background: black; }

/* Атрибут */
input[type="text"] { border: 1px solid gray; }

/* Комбинаторы */
div > p { margin: 0; }       /* прямой потомок */
div p { color: red; }         /* любой потомок */
p + span { margin-left: 5px; } /* соседний */
p ~ span { color: green; }   /* все соседи</pre>

<h3>Специфичность</h3>
<p>Высший приоритет: !important > inline > ID > class > элемент</p>
<pre>p { color: blue; }           /* 1 */
.text { color: red; }         /* 10 */
#main { color: green; }       /* 100 */
<p style="color: yellow;">   /* 1000 */</pre>

<h3>Каскадность</h3>
<p>Последний правило побеждает, если специфичность одинакова:</p>
<pre>p { color: blue; }
p { color: red; } /* этот победит */</pre>
    `,
  },
  {
    title: "Flexbox",
    content: `
<h3>Основные свойства</h3>
<pre>.container {
  display: flex;
  flex-direction: row;          /* row, column, row-reverse, column-reverse */
  justify-content: center;      /* align по главной оси */
  align-items: center;          /* align по поперечной оси */
  gap: 10px;                    /* расстояние между элементами */
}</pre>

<h3>Свойства элементов</h3>
<pre>.item {
  flex: 1;                      /* flex-grow: 1, flex-shrink: 1, flex-basis: auto */
  flex-grow: 2;                 /* занимает в 2 раза больше свободного места */
  flex-shrink: 0;               /* не сжимается */
  align-self: flex-end;         /* переопределить align-items */
  order: 2;                      /* визуальный порядок */
}</pre>

<h3>Пример</h3>
<pre><div style="display: flex; gap: 10px;">
  <div style="flex: 1;">Левая</div>
  <div style="flex: 2;">Центр (в 2 раза шире)</div>
  <div style="flex: 1;">Правая</div>
</div></pre>
    `,
  },
  {
    title: "CSS Grid",
    content: `
<h3>Основы</h3>
<pre>.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 равных колонки */
  grid-template-rows: 100px auto;      /* высота рядов */
  gap: 10px;                            /* расстояние между ячейками */
}</pre>

<h3>Автоматическая раскладка</h3>
<pre>.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* Адаптивная сетка: столько столбцов, сколько поместится */
}</pre>

<h3>Размещение элементов</h3>
<pre>.item {
  grid-column: 1 / 3;            /* от 1 до 3 столбца */
  grid-row: 1 / 2;               /* от 1 до 2 ряда */
}</pre>

<h3>Vs Flexbox</h3>
<ul>
  <li><strong>Flexbox</strong> — для одномерных макетов (строки или столбцы)</li>
  <li><strong>Grid</strong> — для двумерных макетов (строки И столбцы)</li>
</ul>
    `,
  },
  {
    title: "Отзывчивый дизайн",
    content: `
<h3>Media queries</h3>
<pre>@media (max-width: 768px) {
  .container { flex-direction: column; }
  .sidebar { display: none; }
}

@media (prefers-dark-scheme) {
  body { background: black; color: white; }
}</pre>

<h3>Mobile-first подход</h3>
<p>Сначала стили для мобильных, потом добавляем для больших экранов:</p>
<pre>/* Мобильный (по умолчанию) */
.container { width: 100%; }

/* Планшет и выше */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Десктоп и выше */
@media (min-width: 1024px) {
  .container { width: 960px; }
}</pre>

<h3>Viewport метатег</h3>
<pre><meta name="viewport" content="width=device-width, initial-scale=1.0"></pre>
    `,
  },
  {
    title: "Анимации и переходы",
    content: `
<h3>Transitions (переходы)</h3>
<p>Гладкое изменение одного свойства:</p>
<pre>.button {
  background: blue;
  transition: background 0.3s ease;
}
.button:hover {
  background: red;
}</pre>

<h3>Animations (анимации)</h3>
<p>Более сложные анимации с несколькими этапами:</p>
<pre>@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.item {
  animation: slideIn 0.5s ease-out;
}</pre>

<h3>Transform</h3>
<pre>.item {
  transform: rotate(45deg);           /* поворот */
  transform: scale(1.5);              /* масштаб */
  transform: translateX(50px);        /* сдвиг */
  transform: skew(10deg);             /* перекос */
}</pre>
    `,
  },
  {
    title: "CSS-in-JS и препроцессоры",
    content: `
<h3>Styled-components (CSS-in-JS)</h3>
<pre>import styled from 'styled-components';

const Button = styled.button\`
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;

  &:hover {
    background: darkblue;
  }
\`;

export default function App() {
  return <Button>Кнопка</Button>;
}</pre>

<h3>SASS (SCSS)</h3>
<p>Препроцессор CSS с переменными, вложенностью, миксинами:</p>
<pre>$primary-color: #7c6aff;

.button {
  background: $primary-color;

  &:hover {
    background: darken($primary-color, 10%);
  }

  &.disabled {
    opacity: 0.5;
  }
}</pre>

<h3>CSS Modules</h3>
<p>Локальная область видимости для классов:</p>
<pre>/* Button.module.css */
.button {
  background: blue;
}

/* Button.tsx */
import styles from './Button.module.css';
<button className={styles.button}>Click</button></pre>
    `,
  },
];
