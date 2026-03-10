export const reactCards = [
  {
    id: "1",
    category: "Компоненты",
    question: "Что такое функциональный компонент в React?",
    answer:
      "Функциональный компонент — это обычная JavaScript функция, возвращающая JSX (разметку). Это современный подход (с хуками). Пример: function Button(props) { return <button>{props.label}</button>; }. Предпочтительнее классовых компонентов.",
  },
  {
    id: "2",
    category: "Компоненты",
    question: "В чем разница между функциональными и классовыми компонентами?",
    answer:
      "Функциональные компоненты — обычные функции, используют хуки (useState, useEffect). Классовые компоненты наследуют React.Component, используют методы (componentDidMount и т.д.). Функциональные проще, быстрее, современнее. Классовые всё ещё работают, но устаревают.",
  },
  {
    id: "3",
    category: "Props и State",
    question: "Что такое props в React, и как их передавать?",
    answer:
      "Props — это аргументы, передаваемые компоненту. Передаются как атрибуты: <Button label='Click' onClick={...} />. Компонент получает их как параметр: function Button({ label, onClick }) или Button(props). Props доступны для чтения, но не изменяются внутри компонента (read-only).",
  },
  {
    id: "4",
    category: "Props и State",
    question: "Объясните useState хук и как управлять состоянием компонента.",
    answer:
      "useState(initialValue) возвращает массив [value, setValue]. value — текущее значение, setValue — функция обновления. Пример: const [count, setCount] = useState(0); <button onClick={() => setCount(count + 1)}>. setState вызывает перерендер компонента с новым значением.",
  },
  {
    id: "5",
    category: "Жизненный цикл",
    question: "Как использовать useEffect для управления побочными эффектами?",
    answer:
      "useEffect(callback, dependencies) выполняет функцию после рендера. Без зависимостей — каждый рендер. С [] — один раз при монтировании. С [dep] — когда dep изменился. Возвращает cleanup функцию (отписка от событий, очистка). Используется для fetch, подписок, таймеров.",
  },
  {
    id: "6",
    category: "Жизненный цикл",
    question: "Какие фазы жизненного цикла компонента вы знаете?",
    answer:
      "Монтирование (componentDidMount) — компонент создан, добавлен в DOM. Обновление (componentDidUpdate) — props или state изменились. Размонтирование (componentWillUnmount) — компонент удаляется. В функциональных компонентах это реализуется через useEffect с разными зависимостями.",
  },
  {
    id: "7",
    category: "Оптимизация",
    question: "Что такое React.memo и когда его использовать?",
    answer:
      "React.memo — wrapper, пропускающий перерендер, если props не изменились. const Button = React.memo(({ label }) => ...); Используется для дорогих компонентов, которые рендерятся с теми же props. Подходит для оптимизации производительности.",
  },
  {
    id: "8",
    category: "Оптимизация",
    question: "Объясните useMemo и useCallback.",
    answer:
      "useMemo(compute, [deps]) кэширует результат функции, пересчитывает только если deps изменились. useCallback(fn, [deps]) кэширует функцию, возвращает ту же ссылку если deps не изменились. Оба улучшают производительность для дорогих операций и React.memo.",
  },
  {
    id: "9",
    category: "API интеграция",
    question: "Как загружать данные с API в React компоненте?",
    answer:
      "Используй useEffect с fetch или library. useEffect(() => { fetch('/api/data').then(res => res.json()).then(data => setState(data)).catch(err => setError(err)); }, []); Правильно: обработка ошибок, loading state, cleanup для отписки.",
  },
  {
    id: "10",
    category: "API интеграция",
    question: "Как правильно обработать ошибки при загрузке данных?",
    answer:
      "Используй try/catch с async/await или .catch(). Создай state для ошибки: const [error, setError] = useState(null). Показывай пользователю: if (error) return <p>Ошибка: {error}</p>. Логируй ошибки для отладки. Предусмотри retry кнопку для повторной попытки.",
  },
];
