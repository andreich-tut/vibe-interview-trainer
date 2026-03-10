import { test, expect } from "@playwright/test";
import { clearStorage, setApiKey } from "./helpers";

test.describe("API key management", () => {
  test("cannot start practice without API key", async ({ page }) => {
    await clearStorage(page);
    await page.goto("/javascript/practice");

    const startBtn = page.getByRole("button", { name: /Введите API ключ/ });
    await expect(startBtn).toBeDisabled();
  });

  test("can enter and save API key", async ({ page }) => {
    await clearStorage(page);
    await page.goto("/javascript/practice");

    await page.getByRole("textbox", { name: "gsk_..." }).fill("gsk_test_key_abc");
    await page.getByRole("button", { name: "Сохранить" }).click();

    // Key should be masked
    await expect(page.getByText("gsk_..._abc")).toBeVisible();
    // Start button should be enabled
    await expect(page.getByRole("button", { name: "Начать" })).toBeEnabled();
  });

  test("saved API key persists across page loads", async ({ page }) => {
    await setApiKey(page);
    await page.goto("/javascript/practice");

    // Should show masked key and enabled start button
    await expect(page.getByText("Groq API:")).toBeVisible();
    await expect(page.getByRole("button", { name: "Начать" })).toBeEnabled();
  });

  test("can remove API key", async ({ page }) => {
    await setApiKey(page);
    await page.goto("/javascript/practice");

    await page.getByRole("button", { name: "Удалить ключ" }).click();

    // Should show input form again
    await expect(page.getByRole("textbox", { name: "gsk_..." })).toBeVisible();
    // Start button should be disabled
    await expect(page.getByRole("button", { name: /Введите API ключ/ })).toBeDisabled();
  });

  test("Groq API key link points to console", async ({ page }) => {
    await clearStorage(page);
    await page.goto("/javascript/practice");

    const link = page.getByRole("link", { name: "Groq API ключ" });
    await expect(link).toHaveAttribute("href", "https://console.groq.com/keys");
    await expect(link).toHaveAttribute("target", "_blank");
  });
});
