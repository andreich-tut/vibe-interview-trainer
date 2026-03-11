export const nodejsCards = [
  {
    id: "1",
    category: "Основы",
    question: "Что такое Node.js?",
    answer:
      "Node.js — JavaScript runtime для выполнения JS вне браузера. Используется для создания серверов, CLI инструментов, ботов, скриптов. Использует V8 движок Chrome. Имеет встроенные модули (fs, http, path). Экосистема npm с миллионами пакетов.",
    keyPoints: [
      "JavaScript runtime вне браузера (на основе V8 движка Chrome)",
      "Однопоточный с неблокирующим I/O и Event Loop",
      "Используется для серверов, CLI, скриптов",
      "Экосистема npm — крупнейший реестр пакетов",
    ],
  },
  {
    id: "2",
    category: "Основы",
    question: "Как работает асинхронная модель Node.js?",
    answer:
      "Node.js использует Event Loop для асинхронной обработки. Неблокирующий I/O — операции выполняются в фоне. Callbacks, Promises, async/await для работы с результатами. Event Emitter для системы событий. Позволяет обрабатывать тысячи соединений одновременно.",
    keyPoints: [
      "Event Loop — цикл обработки событий (однопоточный)",
      "Неблокирующий I/O — операции выполняются в фоне (libuv)",
      "Callbacks, Promises, async/await для обработки результатов",
      "Позволяет обрабатывать тысячи соединений одновременно",
    ],
  },
  {
    id: "3",
    category: "Модули",
    question: "Что такое CommonJS и как работает require/module.exports?",
    answer:
      "CommonJS — стандарт модулей в Node.js. require('./file.js') импортирует модуль. module.exports = { func } экспортирует. Синхронный импорт. Каждый файл — отдельный модуль. Переменные модуля приватны, не видны снаружи. Старый формат, но всё ещё популярен.",
    keyPoints: [
      "require() — синхронный импорт модуля",
      "module.exports — экспорт из модуля",
      "Каждый файл — отдельный модуль с приватной областью видимости",
      "Модули кэшируются после первого require",
    ],
  },
  {
    id: "4",
    category: "Модули",
    question: "В чем разница между require и import?",
    answer:
      "require (CommonJS) — синхронный, динамический, для Node.js. import (ES6) — асинхронный, статический, стандартный. import может быть проанализирован при сборке. require позволяет динамические пути. Современный Node.js поддерживает import с 'type': 'module' в package.json.",
    keyPoints: [
      "require — синхронный, динамический (CommonJS)",
      "import — статически анализируется, стандарт ES Modules",
      "import позволяет tree-shaking при сборке",
      "Node.js поддерживает ESM через type: 'module' в package.json",
    ],
  },
  {
    id: "5",
    category: "Встроенные модули",
    question: "Какие встроенные модули Node.js вы знаете?",
    answer:
      "fs — работа с файлами и папками. http — HTTP сервер. https — HTTPS. path — работа с путями. events — Event Emitter. stream — потоки данных. os — информация об OS. util — утилиты. child_process — запуск подпроцессов. crypto — криптография.",
    keyPoints: [
      "fs — работа с файловой системой (синхронный и асинхронный API)",
      "http/https — создание HTTP серверов и запросов",
      "path — безопасная работа с путями файловой системы",
      "events — Event Emitter, stream — потоковая обработка данных",
      "child_process — запуск подпроцессов, crypto — криптография",
    ],
  },
  {
    id: "6",
    category: "Серверы",
    question: "Как создать простой HTTP сервер на Node.js?",
    answer:
      "const http = require('http'); const server = http.createServer((req, res) => { res.end('Hello'); }); server.listen(3000); Используй фреймворки для реальных приложений: Express, Fastify, Hapi, Koa. Обработка маршрутов, middleware, аутентификация — всё есть в фреймворках.",
    keyPoints: [
      "http.createServer() с callback (req, res)",
      "server.listen(port) для запуска",
      "Для реальных приложений — фреймворки (Express, Fastify)",
      "Фреймворки добавляют маршрутизацию, middleware, обработку ошибок",
    ],
  },
  {
    id: "7",
    category: "Серверы",
    question: "Какой фреймворк выбрать для Node.js сервера?",
    answer:
      "Express — самый популярный, простой, большое сообщество. Fastify — быстрее, современнее. Hapi — enterprise, много встроенного. Koa — компактный, использует async/await. Выбирай в зависимости от проекта. Для начинающих: Express. Для production: Fastify или Hapi.",
    keyPoints: [
      "Express — самый популярный, простой, огромная экосистема",
      "Fastify — высокая производительность, schema validation, современный",
      "Koa — минимальный, async/await, от создателей Express",
      "Выбор зависит от требований проекта и команды",
    ],
  },
  {
    id: "8",
    category: "Потоки",
    question:
      "Что такое потоки (Streams) в Node.js и какие типы существуют?",
    answer:
      "Streams — способ обработки данных порциями (chunks), не загружая всё в память. 4 типа: Readable (чтение, fs.createReadStream), Writable (запись, fs.createWriteStream), Duplex (чтение и запись, net.Socket), Transform (преобразование, zlib.createGzip). Используют pipe() для соединения: readable.pipe(transform).pipe(writable).",
    keyPoints: [
      "Обработка данных порциями (chunks), не загружая всё в память",
      "4 типа: Readable, Writable, Duplex, Transform",
      "pipe() для соединения потоков в цепочку",
      "Эффективны для больших файлов и сетевых данных",
    ],
  },
  {
    id: "9",
    category: "Обработка ошибок",
    question:
      "Как правильно обрабатывать ошибки в Node.js? Что такое uncaughtException?",
    answer:
      "Синхронные ошибки — try/catch. Асинхронные — .catch() для промисов, error event для потоков. process.on('uncaughtException') ловит необработанные исключения — нужно логировать и завершать процесс. process.on('unhandledRejection') для промисов. В Express — middleware обработки ошибок (err, req, res, next). Всегда логируй ошибки, не глотай молча.",
    keyPoints: [
      "try/catch для синхронного кода, .catch() для промисов",
      "process.on('uncaughtException') — ловит необработанные исключения",
      "process.on('unhandledRejection') — необработанные отклонения промисов",
      "При uncaughtException нужно логировать и завершать процесс (graceful shutdown)",
      "В Express — error middleware с 4 аргументами (err, req, res, next)",
    ],
  },
  {
    id: "10",
    category: "Масштабирование",
    question:
      "Что такое Worker Threads и child_process? В чём разница?",
    answer:
      "child_process.fork() создаёт новый процесс Node.js с отдельной памятью — общение через IPC (message passing). Worker Threads (worker_threads) — потоки внутри одного процесса с общей памятью (SharedArrayBuffer). Workers легковеснее, подходят для CPU-задач (парсинг, вычисления). child_process для изоляции и запуска внешних команд. Cluster модуль использует fork для масштабирования HTTP сервера на все ядра.",
    keyPoints: [
      "child_process.fork() — новый процесс с отдельной памятью, общение через IPC",
      "Worker Threads — потоки в одном процессе, общая память (SharedArrayBuffer)",
      "Workers легковеснее, подходят для CPU-интенсивных задач",
      "Cluster модуль — масштабирование HTTP сервера на все ядра CPU",
    ],
  },
];
