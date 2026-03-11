export const testingCards = [
  {
    id: "1",
    category: "Unit тесты",
    question: "Что такое unit тест и какой инструмент использовать?",
    answer:
      "Unit тест — проверка отдельной функции или компонента. Jest — самый популярный фреймворк для JavaScript. test('name', () => { expect(result).toBe(expected); }). Другие: Mocha, Vitest. Unit тесты должны быть быстрыми, независимыми, повторяемыми.",
    keyPoints: [
      "Тестирование отдельной функции/модуля в изоляции",
      "Jest — самый популярный, Vitest — быстрый для Vite проектов",
      "Должны быть быстрыми, независимыми, повторяемыми",
      "Формат: test('name', () => { expect(result).toBe(expected) })",
    ],
  },
  {
    id: "2",
    category: "Unit тесты",
    question:
      "Какие утверждения (assertions) часто используются в Jest?",
    answer:
      "toBe() === сравнение. toEqual() глубокое сравнение. toContain() есть ли элемент. toThrow() выбрасывает ошибку. toHaveBeenCalled() функция вызвана. toBeDefined(), toBeNull(), toBeTruthy(). Для async: await expect().resolves / rejects.",
    keyPoints: [
      "toBe() — строгое сравнение (===), toEqual() — глубокое сравнение объектов",
      "toContain() — проверка наличия элемента в массиве/строке",
      "toThrow() — проверка выброса ошибки",
      "toHaveBeenCalled/CalledWith — проверка вызовов мок-функций",
    ],
  },
  {
    id: "3",
    category: "Unit тесты",
    question: "Как тестировать асинхронный код в Jest?",
    answer:
      "test('async', async () => { const result = await func(); expect(result).toBe(5); }). Или возвращать Promise: test('promise', () => { return promise.then(r => expect(r).toBe(5)); }). Использовать jest.resolves / jest.rejects для Promise в expect.",
    keyPoints: [
      "async/await в тестовой функции: async () => { await ... }",
      "Возврат Promise из теста для ожидания результата",
      "expect(promise).resolves.toBe() / .rejects.toThrow()",
      "Тест должен дождаться завершения асинхронной операции",
    ],
  },
  {
    id: "4",
    category: "Мокирование",
    question: "Что такое мокирование и когда его использовать?",
    answer:
      "Mock — замена реальной функции для тестирования. const mock = jest.fn(); mock('arg'); expect(mock).toHaveBeenCalledWith('arg'). Используй для: внешних API, базы данных, сложных функций. jest.mock() мокирует весь модуль. Изолирует тест от зависимостей.",
    keyPoints: [
      "Замена реальных зависимостей контролируемыми подменами",
      "jest.fn() — создание мок-функции с отслеживанием вызовов",
      "jest.mock('module') — мокирование всего модуля",
      "Используется для изоляции от внешних API, БД, файловой системы",
    ],
  },
  {
    id: "5",
    category: "Мокирование",
    question: "Что такое spy и чем он отличается от mock?",
    answer:
      "Spy оборачивает реальную функцию, отслеживает вызовы, но выполняет оригинальную функцию. jest.spyOn(obj, 'method'). Можно переопределить: spy.mockReturnValue(value). Отличие: mock полностью заменяет, spy оборачивает. Используй spy когда нужно отследить но сохранить функциональность.",
    keyPoints: [
      "Spy оборачивает реальную функцию, сохраняя оригинальное поведение",
      "jest.spyOn(obj, 'method') — создание spy",
      "Mock полностью заменяет, spy — отслеживает + опционально заменяет",
      "spy.mockReturnValue() для переопределения возвращаемого значения",
    ],
  },
  {
    id: "6",
    category: "React тестирование",
    question: "Как тестировать React компоненты?",
    answer:
      "React Testing Library — рекомендуемый инструмент. render(<Component />). screen.getByRole('button'). fireEvent.click() или userEvent.click(). Тестируй поведение, не деталии реализации. Используй data-testid для элементов без role. Проверяй что видит пользователь.",
    keyPoints: [
      "React Testing Library — стандарт, тестирует поведение пользователя",
      "render() для рендера, screen для поиска элементов",
      "userEvent предпочтительнее fireEvent (ближе к реальному взаимодействию)",
      "Тестируй поведение, а не детали реализации (не тестируй state напрямую)",
    ],
  },
  {
    id: "7",
    category: "React тестирование",
    question: "Как искать элементы в React Testing Library?",
    answer:
      "getByRole('button') по роли. getByLabelText('Username') по label. getByPlaceholderText('Enter') по placeholder. getByTestId('element') по data-testid. getByText('text') по текстовому содержимому. queryBy вместо getBy возвращает null если не найдено. findBy для async поиска.",
    keyPoints: [
      "getByRole — приоритетный способ (по ARIA роли)",
      "getByLabelText, getByPlaceholderText, getByText — по содержимому",
      "getByTestId — последний выбор (data-testid)",
      "queryBy возвращает null (не бросает), findBy ждёт асинхронно",
    ],
  },
  {
    id: "8",
    category: "React тестирование",
    question: "Как тестировать асинхронное поведение компонента?",
    answer:
      "screen.findByText('loaded') — ждёт появления текста. waitFor(() => expect(...).toBe(...)). Используй для fetch, таймеров. test('loads data', async () => { render(<Component />); const element = await screen.findByText('Alice'); expect(element).toBeInTheDocument(); }).",
    keyPoints: [
      "findBy* — ожидает появления элемента (возвращает Promise)",
      "waitFor() — ожидает выполнения assertion",
      "render → findBy/waitFor → expect — типичный паттерн",
      "Мокировать fetch/API для контроля над данными",
    ],
  },
  {
    id: "9",
    category: "E2E тестирование",
    question: "Что такое E2E тесты и какие инструменты есть?",
    answer:
      "E2E (End-to-End) тесты тестируют полный пользовательский сценарий через браузер. Cypress — популярный, удобный, быстрый. Playwright — современный, быстрее Cypress. WebDriver — стандартный. E2E медленнее unit тестов, используй их для критичных сценариев.",
    keyPoints: [
      "Тестирование полного пользовательского сценария через реальный браузер",
      "Playwright — современный, быстрый, мультибраузерный",
      "Cypress — популярный, удобный, отличный DevX",
      "E2E медленные и хрупкие — только для критичных путей",
    ],
  },
  {
    id: "10",
    category: "Тестовая пирамида",
    question: "Что такое тестовая пирамида?",
    answer:
      "Пирамида показывает соотношение типов тестов. Низ (много) — Unit тесты (быстрые, дешёвые). Средина — Integration тесты. Верх (мало) — E2E тесты (медленные, дорогие). Должно быть: много unit, меньше integration, минимум E2E. Это оптимальная стратегия.",
    keyPoints: [
      "Низ (много): Unit тесты — быстрые, дешёвые, изолированные",
      "Середина: Integration тесты — проверка взаимодействия компонентов",
      "Верх (мало): E2E тесты — медленные, дорогие, хрупкие",
      "Оптимальное соотношение: много unit > меньше integration > минимум E2E",
    ],
  },
];
