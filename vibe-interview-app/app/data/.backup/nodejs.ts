export const nodejsTheory = [
  {
    title: "Node.js основы",
    content: `
<h3>Что такое Node.js?</h3>
<p>Node.js — это JavaScript runtime для выполнения JavaScript вне браузера. Используется для серверов, CLI инструментов, ботов.</p>

<h3>Асинхронная модель Node.js</h3>
<p>Node.js использует Event Loop — асинхронный паттерн обработки операций:</p>
<ul>
  <li>Неблокирующий I/O — операции выполняются в фоне</li>
  <li>Callbacks, Promises, async/await — способы работать с асинхронностью</li>
  <li>Event Emitter — система событий</li>
</ul>

<h3>Первый скрипт</h3>
<pre>console.log('Hello, Node.js!');
setTimeout(() => console.log('После 1 сек'), 1000);</pre>
    `,
  },
  {
    title: "Модульная система",
    content: `
<h3>CommonJS (require/exports)</h3>
<p>Традиционный формат модулей в Node.js:</p>
<pre>// math.js
module.exports = {
  add: (a, b) => a + b
};

// app.js
const math = require('./math.js');
console.log(math.add(2, 3)); // 5</pre>

<h3>ES6 Modules (import/export)</h3>
<p>Современный стандарт (добавить "type": "module" в package.json):</p>
<pre>// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';
console.log(add(2, 3)); // 5</pre>

<h3>Встроенные модули</h3>
<ul>
  <li><strong>fs</strong> — работа с файловой системой</li>
  <li><strong>http</strong> — создание HTTP серверов</li>
  <li><strong>path</strong> — работа с путями</li>
  <li><strong>events</strong> — Event Emitter</li>
  <li><strong>stream</strong> — работа с потоками</li>
</ul>
    `,
  },
  {
    title: "Создание HTTP сервера",
    content: `
<h3>Базовый сервер</h3>
<pre>const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});</pre>

<h3>Выбор фреймворка</h3>
<p>Популярные фреймворки упрощают создание сложных серверов:</p>
<ul>
  <li><strong>Express</strong> — минималистичный, популярный</li>
  <li><strong>Fastify</strong> — быстрый, современный</li>
  <li><strong>Hapi</strong> — мощный, enterprise</li>
  <li><strong>Koa</strong> — компактный, использует async/await</li>
</ul>

<h3>Express пример</h3>
<pre>const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

app.listen(3000);</pre>
    `,
  },
  {
    title: "Создание ботов",
    content: `
<h3>Telegram бот с node-telegram-bot-api</h3>
<pre>const TelegramBot = require('node-telegram-bot-api');
const token = 'ВАШ_ТОКЕН';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Я бот.');
});

bot.on('message', (msg) => {
  console.log('Сообщение:', msg.text);
});</pre>

<h3>Discord бот с discord.js</h3>
<pre>const { Client, Events } = require('discord.js');
const client = new Client();

client.on(Events.ClientReady, () => {
  console.log('Бот готов!');
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  message.reply('Привет!');
});

client.login('ВАШЕ_ТОКЕН');</pre>

<h3>Расписание задач (cron)</h3>
<pre>const cron = require('node-cron');

// Каждый день в 12:00
cron.schedule('0 12 * * *', () => {
  console.log('Ежедневная задача');
});</pre>
    `,
  },
];
