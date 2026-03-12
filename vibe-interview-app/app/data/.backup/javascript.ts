export const javascriptTheory = [
  {
    title: "Область видимости (Scope)",
    content: `
<h3>Что такое scope?</h3>
<p>Область видимости — это правило, определяющее, где переменная доступна. В JavaScript есть несколько типов:</p>

<h4>Глобальный scope</h4>
<p>Переменные, объявленные вне функций и блоков, доступны везде:</p>
<pre>const global = 'доступна везде';</pre>

<h4>Функциональный scope</h4>
<p>var имеет функциональный scope — видна только внутри функции:</p>
<pre>function test() {
  var local = 'видна только в функции';
}
// Ошибка: local не определена</pre>

<h4>Блочный scope</h4>
<p>let и const имеют блочный scope — видны только в блоке {} (if, for, while):</p>
<pre>if (true) {
  let block = 'видна только в блоке if';
}
// Ошибка: block не определена</pre>

<h3>Замыкание (Closure)</h3>
<p>Функция, которая помнит переменные из своего внешнего scope. Очень полезно для инкапсуляции:</p>
<pre>function createCounter() {
  let count = 0;  // приватная переменная
  return function() {
    count++;
    return count;
  };
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2</pre>
    `,
  },
  {
    title: "Асинхронное программирование",
    content: `
<h3>Promise</h3>
<p>Promise — это объект, который представляет будущий результат операции. Может быть в трёх состояниях:</p>
<ul>
  <li><strong>Pending</strong> — ожидание результата</li>
  <li><strong>Fulfilled</strong> — успешно выполнено (resolve)</li>
  <li><strong>Rejected</strong> — ошибка (reject)</li>
</ul>

<h3>async/await</h3>
<p>Синтаксический сахар над Promise, делает код более читаемым:</p>
<pre>async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}</pre>

<h3>setTimeout vs setInterval</h3>
<ul>
  <li><strong>setTimeout</strong> — выполняет функцию один раз через N миллисекунд</li>
  <li><strong>setInterval</strong> — повторяет функцию каждые N миллисекунд</li>
</ul>
    `,
  },
  {
    title: "Прототипное наследование",
    content: `
<h3>Что такое прототип?</h3>
<p>Каждый объект в JavaScript имеет внутреннюю ссылку на другой объект — его прототип. Это используется для поиска свойств и методов:</p>
<pre>const person = { name: 'John' };
console.log(person.toString()); // наследуется из Object.prototype</pre>

<h3>Цепочка прототипов</h3>
<p>Поиск свойства идёт вверх по цепочке: объект → его прототип → прототип прототипа → Object.prototype</p>

<h3>Constructor функции</h3>
<pre>function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return 'Привет, ' + this.name;
};
const john = new Person('John');
console.log(john.greet()); // Привет, John</pre>
    `,
  },
  {
    title: "this в JavaScript",
    content: `
<h3>Что такое this?</h3>
<p>this — это ключевое слово, которое ссылается на объект, вызвавший функцию. Его значение зависит от контекста вызова:</p>

<h3>В методе объекта</h3>
<pre>const obj = {
  name: 'Object',
  getName: function() {
    return this.name; // this = obj
  }
};
console.log(obj.getName()); // Object</pre>

<h3>call, apply, bind</h3>
<p>Позволяют явно указать, что будет this:</p>
<pre>function greet(greeting) {
  return greeting + ', ' + this.name;
}
const person = { name: 'Alice' };

greet.call(person, 'Привет');    // явный контекст
greet.apply(person, ['Hi']);      // аргументы как массив
const bound = greet.bind(person); // возвращает новую функцию
bound('Hello');                    // Привет, Alice</pre>
    `,
  },
  {
    title: "ES6+ функции",
    content: `
<h3>Стрелочные функции (Arrow Functions)</h3>
<p>Компактный синтаксис, но не имеют своего this:</p>
<pre>const add = (a, b) => a + b;

const obj = {
  value: 10,
  method: function() {
    const arrow = () => this.value; // this = obj
    const regular = function() { return this.value; }; // this = undefined
  }
};</pre>

<h3>Деструктуризация</h3>
<p>Быстрый способ извлечь значения из объектов и массивов:</p>
<pre>// Объект
const { name, age } = { name: 'John', age: 30 };

// Массив
const [first, second] = [1, 2, 3];

// С переименованием
const { name: fullName } = { name: 'John' };</pre>

<h3>Остаточные параметры (...rest)</h3>
<pre>function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
console.log(sum(1, 2, 3, 4)); // 10</pre>
    `,
  },
  {
    title: "Модули в JavaScript",
    content: `
<h3>import vs require</h3>

<h4>require (CommonJS) — в Node.js</h4>
<pre>const module = require('./file.js');
module.exports = { someFunction };</pre>

<h4>import (ES6 modules) — современный стандарт</h4>
<pre>import { someFunction } from './file.js';
export function someFunction() { }</pre>

<h3>Типы экспорта</h3>
<pre>// Named exports
export const func1 = () => {};
export const func2 = () => {};
import { func1, func2 } from './module';

// Default export
export default MyComponent;
import MyComponent from './module';</pre>
    `,
  },
];
