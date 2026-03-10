export const reactTheory = [
  {
    title: "Компоненты в React",
    content: `
<h3>Функциональные компоненты</h3>
<p>Современный подход — обычные функции, возвращающие JSX:</p>
<pre>function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}</pre>

<h3>Классовые компоненты</h3>
<p>Старый подход, всё ещё используется:</p>
<pre>class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}</pre>

<h3>Props</h3>
<p>Способ передать данные в компонент:</p>
<pre>const Greeting = ({ name }) => <h1>Привет, {name}!</h1>;

<Greeting name="Alice" /></pre>
    `,
  },
  {
    title: "State и Hooks",
    content: `
<h3>useState — управление состоянием</h3>
<pre>function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}</pre>

<h3>useEffect — побочные эффекты</h3>
<p>Выполняет код при монтировании, обновлении или размонтировании:</p>
<pre>useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(timer); // cleanup
}, []); // зависимости</pre>

<h3>Другие основные хуки</h3>
<ul>
  <li><strong>useContext</strong> — доступ к контексту</li>
  <li><strong>useReducer</strong> — сложное состояние</li>
  <li><strong>useRef</strong> — прямая ссылка на DOM</li>
</ul>
    `,
  },
  {
    title: "Жизненный цикл компонента",
    content: `
<h3>В функциональных компонентах</h3>
<p>Жизненный цикл реализуется через useEffect:</p>
<pre>// Монтирование (первый рендер)
useEffect(() => {
  console.log('Компонент смонтирован');
}, []);

// Обновление (любые изменения)
useEffect(() => {
  console.log('Компонент обновлён');
});

// Размонтирование
useEffect(() => {
  return () => console.log('Компонент размонтирован');
}, []);</pre>

<h3>В классовых компонентах</h3>
<ul>
  <li><strong>componentDidMount</strong> — после монтирования</li>
  <li><strong>componentDidUpdate</strong> — после обновления</li>
  <li><strong>componentWillUnmount</strong> — перед удалением</li>
</ul>
    `,
  },
  {
    title: "Оптимизация производительности",
    content: `
<h3>React.memo — пропустить ненужный рендер</h3>
<pre>const Button = React.memo(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
});</pre>

<h3>useMemo — кэширование значений</h3>
<pre>const expensiveValue = useMemo(() => {
  return compute(data);
}, [data]); // пересчитывается только если data изменилась</pre>

<h3>useCallback — кэширование функций</h3>
<pre>const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);</pre>

<h3>Ключи в списках</h3>
<p>Используй уникальные ключи, а не индексы:</p>
<pre><ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul></pre>
    `,
  },
  {
    title: "API интеграция",
    content: `
<h3>Fetch в useEffect</h3>
<pre>useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  };
  fetchData();
}, []);</pre>

<h3>Обработка ошибок</h3>
<pre>useEffect(() => {
  fetch('/api/data')
    .then(res => {
      if (!res.ok) throw new Error('Ошибка сервера');
      return res.json();
    })
    .then(data => setData(data))
    .catch(error => setError(error.message));
}, []);</pre>

<h3>Loading и Error states</h3>
<pre>const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

if (loading) return <p>Загрузка...</p>;
if (error) return <p>Ошибка: {error}</p>;
return <div>{/* данные */}</div>;</pre>
    `,
  },
];
