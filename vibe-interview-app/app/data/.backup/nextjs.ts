export const nextjsTheory = [
  {
    title: "Что такое Next.js?",
    content: `
<h3>Next.js — это React фреймворк</h3>
<p>Фреймворк поверх React для быстрой разработки полнофункциональных веб-приложений с встроенной оптимизацией.</p>

<h3>Основные возможности</h3>
<ul>
  <li><strong>Маршрутизация на основе файловой системы</strong> — файлы в pages/ = маршруты</li>
  <li><strong>Серверный рендеринг (SSR)</strong> — рендер на сервере для лучшего SEO</li>
  <li><strong>Статическая генерация (SSG)</strong> — сборка статических HTML страниц</li>
  <li><strong>API маршруты</strong> — создание API без отдельного бэкенда</li>
  <li><strong>Оптимизация образов и шрифтов</strong> — встроенные компоненты Image и Font</li>
</ul>
    `,
  },
  {
    title: "Режимы рендеринга",
    content: `
<h3>SSR (Server-Side Rendering)</h3>
<p>Страница рендерится на сервере при каждом запросе. Нужно для часто изменяющихся данных:</p>
<pre>export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data }, revalidate: 10 };
}</pre>

<h3>SSG (Static Site Generation)</h3>
<p>Страницы генерируются один раз при сборке и кэшируются. Быстро, но нужно пересобирать:</p>
<pre>export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return { props: { posts }, revalidate: 3600 };
}</pre>

<h3>ISR (Incremental Static Regeneration)</h3>
<p>Комбинация SSG и SSR. Страница регенерируется в фоне, пока она кэшируется:</p>
<pre>export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 60 // пересчитать каждые 60 сек
  };
}</pre>

<h3>CSR (Client-Side Rendering)</h3>
<p>Обычный React — рендеринг в браузере. Используется редко в Next.js:</p>
<pre>export default function Page({ data }) {
  return <div>{data}</div>;
}</pre>
    `,
  },
  {
    title: "Маршрутизация",
    content: `
<h3>Основная маршрутизация</h3>
<p>Структура папок в pages/ определяет маршруты:</p>
<pre>pages/
  index.tsx           → /
  about.tsx           → /about
  blog/
    index.tsx         → /blog
    [id].tsx          → /blog/1, /blog/hello
  api/
    users.ts          → POST /api/users</pre>

<h3>Динамические маршруты</h3>
<p>Квадратные скобки [] для динамических сегментов:</p>
<pre>// pages/blog/[id].tsx
export default function Post({ post }) {
  return <h1>{post.title}</h1>;
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: true
  };
}</pre>

<h3>Перехват маршрутов (Catch-all routes)</h3>
<pre>// pages/docs/[...slug].tsx  → /docs/a/b/c
export default function Docs({ slug }) {
  // slug = ['a', 'b', 'c']
}</pre>
    `,
  },
  {
    title: "API маршруты",
    content: `
<h3>Создание API эндпоинтов</h3>
<p>Файлы в pages/api/ становятся API маршрутами:</p>
<pre>// pages/api/users.ts
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json([{ id: 1, name: 'Alice' }]);
  } else if (req.method === 'POST') {
    res.status(201).json({ success: true });
  }
}</pre>

<h3>Использование в компонентах</h3>
<pre>const response = await fetch('/api/users');
const users = await response.json();</pre>
    `,
  },
  {
    title: "Оптимизация",
    content: `
<h3>Оптимизированный компонент Image</h3>
<pre>import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}</pre>

<h3>Оптимизированные шрифты</h3>
<pre>import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App() {
  return <div className={inter.className}>...</div>;
}</pre>

<h3>Code splitting</h3>
<p>Next.js автоматически делит код по маршрутам. Для динамического импорта:</p>
<pre>import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Загрузка...</p>
});</pre>
    `,
  },
];
