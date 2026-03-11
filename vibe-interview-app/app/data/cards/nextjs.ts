export const nextjsCards = [
  {
    id: "1",
    category: "Основы",
    question: "Что такое Next.js и его основные возможности?",
    answer:
      "Next.js — React фреймворк для полнофункциональных веб-приложений. Основные возможности: App Router с файловой маршрутизацией, Server Components по умолчанию, серверный рендеринг (SSR), статическая генерация (SSG), Server Actions, Middleware, встроенная оптимизация (Image, Font, Script). Использует React Server Components для снижения размера клиентского бандла.",
    keyPoints: [
      "React фреймворк для fullstack веб-приложений",
      "App Router с файловой маршрутизацией",
      "Server Components по умолчанию",
      "Поддержка SSR, SSG, ISR",
      "Встроенная оптимизация (Image, Font, Script)",
    ],
  },
  {
    id: "2",
    category: "Рендеринг",
    question:
      "Что такое Server Components и Client Components в Next.js? В чём разница?",
    answer:
      "Server Components рендерятся на сервере, не отправляют JS на клиент, имеют прямой доступ к БД и файловой системе. По умолчанию все компоненты — серверные. Client Components помечаются директивой 'use client', рендерятся на клиенте, могут использовать useState, useEffect, обработчики событий. Серверные компоненты уменьшают размер бандла. Клиентские нужны для интерактивности.",
    keyPoints: [
      "Server Components рендерятся на сервере, не отправляют JS клиенту",
      "По умолчанию все компоненты — серверные",
      "Client Components помечаются директивой 'use client'",
      "Client Components нужны для интерактивности (хуки, обработчики событий)",
      "Server Components могут напрямую обращаться к БД и файловой системе",
    ],
  },
  {
    id: "3",
    category: "Рендеринг",
    question: "Какие стратегии рендеринга поддерживает Next.js App Router?",
    answer:
      "Static Rendering (по умолчанию) — страница генерируется при сборке и кэшируется. Dynamic Rendering — рендер при каждом запросе (если используются cookies(), headers(), searchParams). Streaming — постепенная отправка HTML с loading.tsx и Suspense. ISR — revalidate через time-based (export const revalidate = 60) или on-demand (revalidatePath/revalidateTag).",
    keyPoints: [
      "Static Rendering — генерация при сборке, кэширование (по умолчанию)",
      "Dynamic Rendering — рендер при каждом запросе (cookies, headers, searchParams)",
      "Streaming — постепенная отправка HTML через Suspense и loading.tsx",
      "ISR — revalidate по времени или on-demand (revalidatePath/revalidateTag)",
    ],
  },
  {
    id: "4",
    category: "Маршрутизация",
    question: "Как работает App Router в Next.js?",
    answer:
      "App Router использует директорию app/. Маршруты определяются папками, а не файлами. Каждая папка = сегмент URL. page.tsx — страница маршрута, layout.tsx — общий layout (сохраняет состояние при навигации), loading.tsx — UI загрузки (Suspense), error.tsx — обработка ошибок, not-found.tsx — 404. Layouts вложенные и не перерендериваются при навигации.",
    keyPoints: [
      "Директория app/ вместо pages/",
      "Маршруты определяются папками, page.tsx — страница",
      "layout.tsx — общий layout, сохраняет состояние при навигации",
      "loading.tsx для Suspense, error.tsx для обработки ошибок",
      "Layouts вложенные и не перерендериваются",
    ],
  },
  {
    id: "5",
    category: "Маршрутизация",
    question: "Как работают динамические маршруты в App Router?",
    answer:
      "Динамические сегменты в квадратных скобках: app/blog/[slug]/page.tsx. Параметры приходят как props: ({ params }) => params.slug. Для SSG используется generateStaticParams() для указания всех путей. Catch-all: [...slug] (обязательный) и [[...slug]] (опциональный). Параллельные маршруты: @modal. Перехватывающие: (.)photo.",
    keyPoints: [
      "Квадратные скобки для динамических сегментов: [slug]",
      "generateStaticParams() вместо getStaticPaths для SSG",
      "Catch-all сегменты: [...slug] и [[...slug]]",
      "Параметры приходят через props компонента",
    ],
  },
  {
    id: "6",
    category: "Загрузка данных",
    question: "Как загружать данные в Server Components?",
    answer:
      "В Server Components можно использовать async/await прямо в компоненте: export default async function Page() { const data = await fetch(url); }. Не нужны getServerSideProps/getStaticProps. Next.js автоматически дедуплицирует одинаковые fetch-запросы. Кэширование настраивается через fetch options: { cache: 'force-cache' } (статика) или { next: { revalidate: 60 } } (ISR).",
    keyPoints: [
      "async/await прямо в компоненте (без getServerSideProps/getStaticProps)",
      "Next.js автоматически дедуплицирует fetch-запросы",
      "cache: 'force-cache' для статического кэширования",
      "next: { revalidate: N } для ISR",
      "Данные загружаются на сервере, не увеличивают клиентский бандл",
    ],
  },
  {
    id: "7",
    category: "Server Actions",
    question: "Что такое Server Actions в Next.js?",
    answer:
      "Server Actions — асинхронные функции, выполняемые на сервере. Помечаются директивой 'use server'. Могут вызываться из клиентских компонентов через form action или напрямую. Заменяют API маршруты для мутаций данных. Автоматически интегрируются с revalidation. Поддерживают progressive enhancement — формы работают без JS.",
    keyPoints: [
      "Асинхронные функции с директивой 'use server'",
      "Выполняются на сервере, вызываются из клиента",
      "Заменяют API routes для мутаций данных",
      "Работают через form action (progressive enhancement без JS)",
      "Интегрируются с revalidatePath/revalidateTag",
    ],
  },
  {
    id: "8",
    category: "Оптимизация",
    question: "Какие встроенные инструменты оптимизации есть в Next.js?",
    answer:
      "next/image — автоматическая оптимизация изображений (lazy loading, WebP/AVIF, responsive sizes). next/font — оптимизация шрифтов (self-hosted, без layout shift). next/script — контроль загрузки скриптов (beforeInteractive, afterInteractive, lazyOnload). Автоматический code splitting по маршрутам. Prefetching ссылок через Link. Streaming SSR.",
    keyPoints: [
      "next/image — оптимизация изображений (lazy loading, modern formats, responsive)",
      "next/font — self-hosted шрифты без layout shift",
      "next/script — контроль приоритета загрузки скриптов",
      "Автоматический code splitting по маршрутам",
      "Prefetching через Link компонент",
    ],
  },
  {
    id: "9",
    category: "Middleware",
    question: "Что такое Middleware в Next.js и как его использовать?",
    answer:
      "Middleware выполняется до обработки запроса. Файл middleware.ts в корне app/. Используется для: редиректов, rewrite, аутентификации, A/B тестирования, i18n. Работает на Edge Runtime (быстро, ограниченный API). Настраивается через matcher: export const config = { matcher: '/dashboard/:path*' }.",
    keyPoints: [
      "Выполняется до обработки каждого запроса",
      "Файл middleware.ts в корне проекта",
      "Работает на Edge Runtime (быстро, ограниченный API)",
      "Применения: редиректы, аутентификация, A/B тесты, i18n",
      "Настройка через matcher для фильтрации маршрутов",
    ],
  },
  {
    id: "10",
    category: "Развертывание",
    question: "Как развернуть Next.js приложение и какие варианты хостинга?",
    answer:
      "Vercel — нативная платформа (автодеплой, Edge Functions, Analytics). Self-hosted: npm run build && npm start на любом сервере. Docker — контейнеризация (output: 'standalone' в next.config). Статический экспорт: output: 'export' для CDN без сервера. AWS (Amplify, Lambda@Edge), Cloudflare Pages. Выбор зависит от: нужен ли SSR, бюджет, инфраструктура.",
    keyPoints: [
      "Vercel — нативная платформа, автодеплой из git",
      "Self-hosted: build + start на любом Node.js сервере",
      "Docker с output: 'standalone' для контейнеризации",
      "Статический экспорт (output: 'export') для CDN без сервера",
      "Выбор зависит от потребности в SSR и бюджета",
    ],
  },
];
