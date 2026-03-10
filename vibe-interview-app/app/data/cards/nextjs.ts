export const nextjsCards = [
  {
    id: "1",
    category: "Основы",
    question: "Что такое Next.js и его основные возможности?",
    answer:
      "Next.js — React фреймворк для полнофункциональных веб-приложений. Основные возможности: file-based маршрутизация, серверный рендеринг (SSR), статическая генерация (SSG), API маршруты, встроенная оптимизация. Упрощает разработку и улучшает производительность.",
  },
  {
    id: "2",
    category: "Рендеринг",
    question: "Что такое SSR (Server-Side Rendering) в Next.js?",
    answer:
      "SSR — страница рендерится на сервере при каждом запросе. Используется для часто изменяющихся данных. В getServerSideProps() функция вызывается при каждом запросе, данные передаются в компонент. Плюсы: актуальные данные, SEO. Минус: медленнее чем SSG.",
  },
  {
    id: "3",
    category: "Рендеринг",
    question: "Что такое SSG (Static Site Generation) и ISR?",
    answer:
      "SSG — генерирует статические HTML страницы при сборке. getStaticProps() вызывается только один раз. Очень быстро. ISR (Incremental Static Regeneration) — комбинация SSG и SSR. Страница регенерируется в фоне каждые N секунд (revalidate). Сочетает скорость и актуальность.",
  },
  {
    id: "4",
    category: "Маршрутизация",
    question: "Как работает маршрутизация в Next.js?",
    answer:
      "Файловая система = маршруты. pages/index.tsx → /, pages/about.tsx → /about, pages/blog/[id].tsx → /blog/1. Динамические маршруты в квадратных скобках. pages/api/users.ts → POST /api/users. Встроенная маршрутизация без конфигурации.",
  },
  {
    id: "5",
    category: "Маршрутизация",
    question: "Как работают динамические маршруты в Next.js?",
    answer:
      "Используй квадратные скобки: pages/blog/[id].tsx. Параметр доступен в props: export async function getStaticProps({ params }) { return { props: { id: params.id } }; }. Для SSG нужно getStaticPaths() для указания всех возможных путей.",
  },
  {
    id: "6",
    category: "API маршруты",
    question: "Как создать API endpoint в Next.js?",
    answer:
      "Файлы в pages/api/ становятся API маршрутами. pages/api/users.ts → /api/users. Функция получает req (запрос) и res (ответ). Обработка методов: if (req.method === 'GET') { res.json(data); } else if (req.method === 'POST') { ... }. Нет необходимости в отдельном бэкенде.",
  },
  {
    id: "7",
    category: "Оптимизация",
    question: "Какие встроенные инструменты оптимизации есть в Next.js?",
    answer:
      "Image компонент — автоматическая оптимизация, lazy loading, разные размеры. next/font для оптимизации шрифтов. Code splitting — автоматическое разделение кода по маршрутам. Link префетчинг. Сжатие. Все эти оптимизации встроены и работают по умолчанию.",
  },
  {
    id: "8",
    category: "Компоненты",
    question: "Когда использовать Image компонент вместо обычного <img>?",
    answer:
      "Всегда используй Image из next/image. Автоматически оптимизирует размер и формат (WebP), ленивую загрузку, поддержку разных размеров для экранов. Требует width и height. Улучшает Core Web Vitals. Обычный <img> может замедлить сайт.",
  },
  {
    id: "9",
    category: "Развертывание",
    question: "Как развернуть Next.js приложение?",
    answer:
      "Рекомендуется Vercel (создатель Next.js) — одна команда git push и деплой готов. Или: npm run build, затем npm start на сервере. Docker контейнер. AWS, Google Cloud, Netlify. Vercel проще всего, автоматически оптимизирует Edge Functions.",
  },
  {
    id: "10",
    category: "Разработка",
    question: "Как структурировать проект Next.js?",
    answer:
      "pages/ — маршруты и страницы. public/ — статические файлы. styles/ — стили. components/ — переиспользуемые компоненты. lib/ — утилиты и helper функции. api/ — внутри pages/. .env.local — переменные окружения. Структурируй логично, не переусложняй.",
  },
];
