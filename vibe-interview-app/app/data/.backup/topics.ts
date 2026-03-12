export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export const topics: Topic[] = [
  {
    id: "javascript",
    title: "JavaScript",
    icon: "📜",
    description: "Основы языка, асинхронность, замыкания",
  },
  {
    id: "react",
    title: "React",
    icon: "⚛️",
    description: "Компоненты, хуки, состояние, оптимизация",
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "▲",
    description: "SSR, SSG, ISR, маршрутизация, оптимизация",
  },
  {
    id: "nodejs",
    title: "Node.js",
    icon: "🟢",
    description: "Модули, асинхронная модель, серверы",
  },
  {
    id: "css",
    title: "CSS",
    icon: "🎨",
    description: "Селекторы, Flexbox, Grid, анимации",
  },
  {
    id: "cicd",
    title: "CI/CD",
    icon: "🔄",
    description: "Автоматизация, деплой, мониторинг",
  },
  {
    id: "testing",
    title: "Тестирование",
    icon: "✅",
    description: "Unit тесты, компоненты, E2E",
  },
];
