const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Ты — строгий экзаменатор по программированию.

Тебе дают:
- Вопрос
- Эталонный ответ
- Ключевые моменты (checklist) — то, что ДОЛЖНО быть в хорошем ответе
- Ответ пользователя

Оцени ответ пользователя по ключевым моментам:
3 — раскрыты все или почти все ключевые моменты
2 — раскрыта основная идея, но упущены важные моменты
1 — упомянуто что-то верное, но большая часть ключевых моментов не раскрыта
0 — ответ неверный, не по теме или пустой

Правила оценки:
- Оценивай СМЫСЛ, а не точность формулировки. Пользователь может выражаться своими словами.
- Если пользователь упоминает концепцию другими словами — это засчитывается.
- Не снижай оценку за отсутствие примеров кода, если смысл передан.
- Будь строгим к фактическим ошибкам — они снижают оценку.

Если ключевые моменты не предоставлены, оставь matchedPoints и missedPoints пустыми массивами.

Ответь строго в формате JSON:
{"score": <0-3>, "feedback": "<на русском: что раскрыто хорошо + какие ключевые моменты упущены, 1-3 предложения>", "matchedPoints": ["<раскрытые ключевые моменты>"], "missedPoints": ["<упущенные ключевые моменты>"]}`;

export interface LLMResult {
  score: 0 | 1 | 2 | 3;
  feedback: string;
  matchedPoints: string[];
  missedPoints: string[];
}

export async function checkAnswer(
  question: string,
  referenceAnswer: string,
  userAnswer: string,
  keyPoints?: string[],
): Promise<LLMResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");

  let userPrompt = `Вопрос: ${question}\n\nЭталонный ответ: ${referenceAnswer}`;

  if (keyPoints?.length) {
    userPrompt += `\n\nКлючевые моменты:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
  }

  userPrompt += `\n\nОтвет пользователя: ${userAnswer}`;

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
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMITED");
    throw new Error(`LLM_ERROR_${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(text) as Record<string, unknown>;
  return {
    score: parsed.score as LLMResult["score"],
    feedback: parsed.feedback as string,
    matchedPoints: Array.isArray(parsed.matchedPoints)
      ? (parsed.matchedPoints as string[])
      : [],
    missedPoints: Array.isArray(parsed.missedPoints)
      ? (parsed.missedPoints as string[])
      : [],
  };
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
