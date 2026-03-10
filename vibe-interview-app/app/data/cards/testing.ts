export const testingCards = [
  {
    id: "1",
    category: "Unit тесты",
    question: "Что такое unit тест и какой инструмент использовать?",
    answer:
      "Unit тест — проверка отдельной функции или компонента. Jest — самый популярный фреймворк для JavaScript. test('name', () => { expect(result).toBe(expected); }). Другие: Mocha, Vitest. Unit тесты должны быть быстрыми, независимыми, повторяемыми.",
  },
  {
    id: "2",
    category: "Unit тесты",
    question: "Какие утверждения (assertions) часто используются в Jest?",
    answer:
      "toBe() === сравнение. toEqual() глубокое сравнение. toContain() есть ли элемент. toThrow() выбрасывает ошибку. toHaveBeenCalled() функция вызвана. toBeDefined(), toBeNull(), toBeTruthy(). Для async: await expect().resolves / rejects.",
  },
  {
    id: "3",
    category: "Unit тесты",
    question: "Как тестировать асинхронный код в Jest?",
    answer:
      "test('async', async () => { const result = await func(); expect(result).toBe(5); }). Или возвращать Promise: test('promise', () => { return promise.then(r => expect(r).toBe(5)); }). Использовать jest.resolves / jest.rejects для Promise в expect.",
  },
  {
    id: "4",
    category: "Мокирование",
    question: "Что такое мокирование и когда его использовать?",
    answer:
      "Mock — замена реальной функции для тестирования. const mock = jest.fn(); mock('arg'); expect(mock).toHaveBeenCalledWith('arg'). Используй для: внешних API, базы данных, сложных функций. jest.mock() мокирует весь модуль. Изолирует тест от зависимостей.",
  },
  {
    id: "5",
    category: "Мокирование",
    question: "Что такое spy и чем он отличается от mock?",
    answer:
      "Spy оборачивает реальную функцию, отслеживает вызовы, но выполняет оригинальную функцию. jest.spyOn(obj, 'method'). Можно переопределить: spy.mockReturnValue(value). Отличие: mock полностью заменяет, spy оборачивает. Используй spy когда нужно отследить но сохранить функциональность.",
  },
  {
    id: "6",
    category: "React тестирование",
    question: "Как тестировать React компоненты?",
    answer:
      "React Testing Library — рекомендуемый инструмент. render(<Component />). screen.getByRole('button'). fireEvent.click() или userEvent.click(). Тестируй поведение, не деталии реализации. Используй data-testid для элементов без role. Проверяй что видит пользователь.",
  },
  {
    id: "7",
    category: "React тестирование",
    question: "Как искать элементы в React Testing Library?",
    answer:
      "getByRole('button') по роли. getByLabelText('Username') по label. getByPlaceholderText('Enter') по placeholder. getByTestId('element') по data-testid. getByText('text') по текстовому содержимому. queryBy вместо getBy возвращает null если не найдено. findBy для async поиска.",
  },
  {
    id: "8",
    category: "React тестирование",
    question: "Как тестировать асинхронное поведение компонента?",
    answer:
      "screen.findByText('loaded') — ждёт появления текста. waitFor(() => expect(...).toBe(...)). Используй для fetch, таймеров. test('loads data', async () => { render(<Component />); const element = await screen.findByText('Alice'); expect(element).toBeInTheDocument(); }).",
  },
  {
    id: "9",
    category: "E2E тестирование",
    question: "Что такое E2E тесты и какие инструменты есть?",
    answer:
      "E2E (End-to-End) тесты тестируют полный пользовательский сценарий через браузер. Cypress — популярный, удобный, быстрый. Playwright — современный, быстрее Cypress. WebDriver — стандартный. E2E медленнее unit тестов, используй их для критичных сценариев.",
  },
  {
    id: "10",
    category: "Тестовая пирамида",
    question: "Что такое тестовая пирамида?",
    answer:
      "Пирамида показывает соотношение типов тестов. Низ (много) — Unit тесты (быстрые, дешёвые). Средина — Integration тесты. Верх (мало) — E2E тесты (медленные, дорогие). Должно быть: много unit, меньше integration, минимум E2E. Это оптимальная стратегия.",
  },
];
