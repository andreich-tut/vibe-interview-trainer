export const testingTheory = [
  {
    title: "Unit тестирование",
    content: `
<h3>Jest — популярный фреймворк</h3>
<pre>// sum.js
export const sum = (a, b) => a + b;

// sum.test.js
import { sum } from './sum';

test('sums two numbers correctly', () => {
  expect(sum(2, 3)).toBe(5);
});</pre>

<h3>Утверждения (assertions)</h3>
<pre>expect(result).toBe(5);              /* ===  */
expect(result).toEqual({ id: 1 });   /* глубокое сравнение */
expect(array).toContain(3);           /* содержит */
expect(fn).toThrow();                 /* выбрасывает ошибку */
expect(spy).toHaveBeenCalled();       /* функция вызвана */</pre>

<h3>Тестирование асинхронного кода</h3>
<pre>test('fetches data', async () => {
  const data = await fetchData();
  expect(data.id).toBe(1);
});

test('promise resolves', () => {
  return promise.then(data => {
    expect(data).toBeDefined();
  });
});</pre>

<h3>Мокирование</h3>
<pre>jest.mock('./api');
import { fetchUser } from './api';

test('uses mocked api', async () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});</pre>
    `,
  },
  {
    title: "Тестирование компонентов React",
    content: `
<h3>React Testing Library</h3>
<p>Тестируем компоненты как пользователь их видит:</p>
<pre>import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('button is clickable', () => {
  render(<Button label="Click me" />);
  const btn = screen.getByRole('button');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
});</pre>

<h3>Поиск элементов</h3>
<pre>screen.getByRole('button');              /* поиск по role */
screen.getByLabelText('Username');        /* поиск по label */
screen.getByPlaceholderText('Enter...');  /* поиск по placeholder */
screen.getByTestId('submit-btn');         /* поиск по data-testid */
screen.queryByText('Not found');          /* null если не найдено */</pre>

<h3>User interactions</h3>
<pre>import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'Hello');</pre>

<h3>Async тестирование</h3>
<pre>test('loads and displays data', async () => {
  render(<UserProfile id={1} />);
  await screen.findByText('Alice'); /* ждёт появления текста */
});</pre>
    `,
  },
  {
    title: "Enzyme — альтернатива RTL",
    content: `
<h3>Enzyme для React</h3>
<p>Более низкоуровневое тестирование компонентов:</p>
<pre>import { shallow } from 'enzyme';
import Button from './Button';

test('button renders correctly', () => {
  const wrapper = shallow(<Button label="Click" />);
  expect(wrapper.find('button')).toHaveLength(1);
});</pre>

<h3>Методы Enzyme</h3>
<ul>
  <li><strong>shallow()</strong> — рендер компонента без детей (быстро)</li>
  <li><strong>mount()</strong> — полный рендер со всеми дочерними компонентами</li>
  <li><strong>render()</strong> — рендер в статический HTML</li>
</ul>

<h3>Тестирование props и state</h3>
<pre>const wrapper = shallow(<Counter initialCount={5} />);
expect(wrapper.prop('initialCount')).toBe(5);
expect(wrapper.state('count')).toBe(5);</pre>
    `,
  },
  {
    title: "Snapshot тестирование",
    content: `
<h3>Сохранение снимка компонента</h3>
<p>Jest сохраняет HTML компонента и проверяет изменения:</p>
<pre>test('component renders correctly', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});</pre>

<h3>Обновление snapshots</h3>
<pre>npm test -- -u  /* обновить все snapshots */</pre>

<h3>Когда использовать</h3>
<ul>
  <li>✅ Проверка визуальных изменений компонентов</li>
  <li>❌ Не для логики (используй точные assertions)</li>
  <li>⚠️ Не забывай ревьюить обновления snapshots</li>
</ul>
    `,
  },
  {
    title: "E2E тестирование",
    content: `
<h3>Cypress — браузерное тестирование</h3>
<pre>describe('Login flow', () => {
  it('logs in successfully', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Welcome').should('be.visible');
  });
});</pre>

<h3>Playwrigh</h3>
<p>Современная альтернатива Cypress, быстрее:</p>
<pre>import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveTitle('Dashboard');
});</pre>

<h3>Лучшие практики E2E</h3>
<ul>
  <li>Тестируй пользовательские сценарии, а не детали реализации</li>
  <li>Используй selectors, которые не часто меняются</li>
  <li>Избегай случайных ошибок — используй явные waits</li>
  <li>Пиши мало E2E тестов, много Unit тестов</li>
</ul>
    `,
  },
  {
    title: "Мокирование и stubs",
    content: `
<h3>Мокирование функций</h3>
<pre>const mockFn = jest.fn();
mockFn('arg1');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1');
expect(mockFn).toHaveReturnedWith(42);</pre>

<h3>Мокирование модулей</h3>
<pre>jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1 })
}));

import { fetchUser } from './api';
/* теперь fetchUser это мок */</pre>

<h3>Spy (шпион)</h3>
<p>Оборачивает реальную функцию и отслеживает её вызовы:</p>
<pre>const spy = jest.spyOn(api, 'fetchUser');
api.fetchUser(1);
expect(spy).toHaveBeenCalledWith(1);
spy.mockRestore(); /* восстановить оригинальную функцию */</pre>

<h3>Stub (заглушка)</h3>
<p>Полностью заменяет функцию/модуль для тестирования:</p>
<pre>const stub = jest.fn().mockResolvedValue({ data: 'test' });
/* используем stub вместо реальной функции */</pre>
    `,
  },
];
