const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Ты — ассистент для проверки знаний по программированию.
Тебе дают вопрос, эталонный ответ и ответ пользователя.
Оцени ответ пользователя по шкале 0-3:
3 — точно знал (все ключевые моменты раскрыты)
2 — примерно знал (основная идея верна, упущены детали)
1 — с трудом (частично верно, много пробелов)
0 — не знал (ответ неверный или пустой)

Ответь строго в формате JSON:
{"score": <0-3>, "feedback": "<краткий комментарий на русском, 1-2 предложения>"}`;

export interface LLMResult {
  score: 0 | 1 | 2 | 3;
  feedback: string;
}

export async function checkAnswer(
  question: string,
  referenceAnswer: string,
  userAnswer: string,
): Promise<LLMResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");

  const userPrompt = `Вопрос: ${question}\n\nЭталонный ответ: ${referenceAnswer}\n\nОтвет пользователя: ${userAnswer}`;

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMITED");
    throw new Error(`LLM_ERROR_${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return JSON.parse(text);
}

const STORAGE_KEY = "groq-api-key";

export function hasApiKey(): boolean {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}
