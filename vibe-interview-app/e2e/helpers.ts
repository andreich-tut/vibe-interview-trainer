import { type Page, type Route } from "@playwright/test";

/** Mock Groq API response with a given score and feedback */
export function mockGroqApi(
  page: Page,
  score: 0 | 1 | 2 | 3,
  feedback: string,
) {
  return page.route("https://api.groq.com/**", (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({ score, feedback }),
            },
          },
        ],
      }),
    });
  });
}

/** Mock Groq API to return 429 rate limit */
export function mockGroqRateLimit(page: Page) {
  return page.route("https://api.groq.com/**", (route: Route) => {
    route.fulfill({ status: 429, body: "Rate limited" });
  });
}

/** Set API key in localStorage before navigating */
export async function setApiKey(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("groq-api-key", "gsk_test_fake_key_1234");
  });
}

/** Set progress data in localStorage */
export async function setProgress(
  page: Page,
  data: Record<string, unknown>,
) {
  await page.addInitScript(
    (d: string) => {
      localStorage.setItem("progress", d);
    },
    JSON.stringify(data),
  );
}

/** Clear all localStorage before test */
export async function clearStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear();
  });
}
