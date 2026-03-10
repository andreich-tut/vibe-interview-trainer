export const nodejsCards = [
  {
    id: "1",
    category: "Основы",
    question: "Что такое Node.js?",
    answer:
      "Node.js — JavaScript runtime для выполнения JS вне браузера. Используется для создания серверов, CLI инструментов, ботов, скриптов. Использует V8 движок Chrome. Имеет встроенные модули (fs, http, path). Экосистема npm с миллионами пакетов.",
  },
  {
    id: "2",
    category: "Основы",
    question: "Как работает асинхронная модель Node.js?",
    answer:
      "Node.js использует Event Loop для асинхронной обработки. Неблокирующий I/O — операции выполняются в фоне. Callbacks, Promises, async/await для работы с результатами. Event Emitter для системы событий. Позволяет обрабатывать тысячи соединений одновременно.",
  },
  {
    id: "3",
    category: "Модули",
    question: "Что такое CommonJS и как работает require/module.exports?",
    answer:
      "CommonJS — стандарт модулей в Node.js. require('./file.js') импортирует модуль. module.exports = { func } экспортирует. Синхронный импорт. Каждый файл — отдельный модуль. Переменные модуля приватны, не видны снаружи. Старый формат, но всё ещё популярен.",
  },
  {
    id: "4",
    category: "Модули",
    question: "В чем разница между require и import?",
    answer:
      "require (CommonJS) — синхронный, динамический, для Node.js. import (ES6) — асинхронный, статический, стандартный. import может быть проанализирован при сборке. require позволяет динамические пути. Современный Node.js поддерживает import с 'type': 'module' в package.json.",
  },
  {
    id: "5",
    category: "Встроенные модули",
    question: "Какие встроенные модули Node.js вы знаете?",
    answer:
      "fs — работа с файлами и папками. http — HTTP сервер. https — HTTPS. path — работа с путями. events — Event Emitter. stream — потоки данных. os — информация об OS. util — утилиты. child_process — запуск подпроцессов. crypto — криптография.",
  },
  {
    id: "6",
    category: "Серверы",
    question: "Как создать простой HTTP сервер на Node.js?",
    answer:
      "const http = require('http'); const server = http.createServer((req, res) => { res.end('Hello'); }); server.listen(3000); Используй фреймворки для реальных приложений: Express, Fastify, Hapi, Koa. Обработка маршрутов, middleware, аутентификация — всё есть в фреймворках.",
  },
  {
    id: "7",
    category: "Серверы",
    question: "Какой фреймворк выбрать для Node.js сервера?",
    answer:
      "Express — самый популярный, простой, большое сообщество. Fastify — быстрее, современнее. Hapi — enterprise, много встроенного. Koa — компактный, использует async/await. Выбирай в зависимости от проекта. Для начинающих: Express. Для production: Fastify или Hapi.",
  },
  {
    id: "8",
    category: "Боты",
    question: "Как создать Telegram бот на Node.js?",
    answer:
      "Используй библиотеку node-telegram-bot-api. const TelegramBot = require('node-telegram-bot-api'); const bot = new TelegramBot(token, { polling: true }); bot.onText(/\\/start/, (msg) => {...}); bot.sendMessage(chatId, 'text'); Polling или webhook для получения сообщений.",
  },
  {
    id: "9",
    category: "Боты",
    question: "Как создать Discord бот на Node.js?",
    answer:
      "Используй discord.js. const { Client, Events } = require('discord.js'); const client = new Client(); client.on(Events.MessageCreate, (msg) => { msg.reply('Привет!'); }); client.login(token); Или используй djs v14+ с slash commands для современного подхода.",
  },
  {
    id: "10",
    category: "Задачи",
    question: "Как запланировать периодические задачи в Node.js?",
    answer:
      "Используй node-cron для расписаний. const cron = require('node-cron'); cron.schedule('0 12 * * *', () => { /* выполнить */}); Формат как в Linux cron. Или setInterval для простых интервалов. Для production используй Bull для очередей с Redis.",
  },
];
