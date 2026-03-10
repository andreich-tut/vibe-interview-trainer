export const cicdTheory = [
  {
    title: "Основы CI/CD",
    content: `
<h3>CI — Continuous Integration</h3>
<p>Автоматизированная интеграция кода в репозиторий:</p>
<ul>
  <li>Раннее обнаружение конфликтов</li>
  <li>Автоматические тесты при каждом коммите</li>
  <li>Качество кода проверяется машинально</li>
</ul>

<h3>CD — Continuous Deployment/Delivery</h3>
<ul>
  <li><strong>Continuous Delivery</strong> — код готов к деплою, но человек нажимает кнопку</li>
  <li><strong>Continuous Deployment</strong> — полностью автоматический деплой в продакшн</li>
</ul>

<h3>Типичный pipeline</h3>
<pre>Коммит → Тесты → Build → Deploy → Мониторинг</pre>
    `,
  },
  {
    title: "Инструменты CI/CD",
    content: `
<h3>GitHub Actions</h3>
<p>Встроенный CI/CD в GitHub:</p>
<pre>name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test</pre>

<h3>GitLab CI</h3>
<p>Встроенный CI/CD в GitLab через .gitlab-ci.yml</p>

<h3>Jenkins</h3>
<p>Мощный, самостоятельный инструмент автоматизации</p>

<h3>CircleCI, Travis CI</h3>
<p>Облачные сервисы CI/CD для GitHub/GitLab</p>
    `,
  },
  {
    title: "Стратегии тестирования",
    content: `
<h3>Unit тесты</h3>
<p>Тестирование отдельных функций и компонентов:</p>
<pre>test('add function', () => {
  expect(add(2, 3)).toBe(5);
});</pre>

<h3>Integration тесты</h3>
<p>Тестирование взаимодействия между компонентами</p>

<h3>E2E тесты</h3>
<p>Полное тестирование пользовательского сценария через браузер (Cypress, Playwright)</p>

<h3>Стратегия тестовой пирамиды</h3>
<pre>      /\\
     /E2E\\
    /------\\
   /Интеграция\\
  /----------\\
 /    Unit    \\
/______________\\</pre>

<p>Много unit тестов, меньше интеграции, минимум E2E</p>
    `,
  },
  {
    title: "Версионирование и деплой",
    content: `
<h3>Семантическое версионирование (Semver)</h3>
<pre>MAJOR.MINOR.PATCH
1.2.3
^ — патч версия
^ — минор версия
^ — мажор версия</pre>

<h3>Стратегии деплоя</h3>
<ul>
  <li><strong>Blue-Green Deploy</strong> — две идентичные среды, переключение трафика</li>
  <li><strong>Canary Deploy</strong> — новая версия на 5% трафика, потом постепенно увеличиваем</li>
  <li><strong>Rolling Deploy</strong> — постепенное обновление инстансов</li>
  <li><strong>Feature Flags</strong> — новую функцию можно включать/выключать без деплоя</li>
</ul>

<h3>Среды</h3>
<pre>Development   → Staging   → Production
разработка     тестирование   боевой сервер</pre>
    `,
  },
  {
    title: "Мониторинг и логирование",
    content: `
<h3>Логирование</h3>
<p>Записываем события приложения для анализа:</p>
<pre>console.log('info', message);       /* информационные события */
console.error('error', error);        /* ошибки */
console.warn('warning', message);    /* предупреждения */</pre>

<h3>Инструменты логирования</h3>
<ul>
  <li><strong>Winston</strong> — популярная библиотека для Node.js</li>
  <li><strong>Bunyan</strong> — структурированное логирование</li>
  <li><strong>ELK Stack</strong> — Elasticsearch + Logstash + Kibana</li>
</ul>

<h3>Мониторинг производительности</h3>
<ul>
  <li><strong>New Relic</strong> — APM (Application Performance Monitoring)</li>
  <li><strong>DataDog</strong> — полный стек мониторинга</li>
  <li><strong>Prometheus + Grafana</strong> — метрики и визуализация</li>
</ul>

<h3>Алёрты и оповещения</h3>
<p>Отправляем уведомления при проблемах (Slack, Email, PagerDuty)</p>
    `,
  },
];
