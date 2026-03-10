import { test, expect } from "@playwright/test";
import { setProgress, clearStorage } from "./helpers";

test.describe("Home page", () => {
  test("displays all 7 topics and event loop trainer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Подготовка к собеседованию" })).toBeVisible();

    const topics = ["JavaScript", "React", "Next.js", "Node.js", "CSS", "CI/CD", "Тестирование"];
    for (const topic of topics) {
      await expect(page.getByRole("heading", { name: topic })).toBeVisible();
    }

    await expect(page.getByRole("heading", { name: "Event Loop Тренажёр" })).toBeVisible();
  });

  test("each topic has theory and practice links", async ({ page }) => {
    await page.goto("/");
    const theoryLinks = page.getByRole("link", { name: "Теория" });
    const practiceLinks = page.getByRole("link", { name: "Практика" });
    await expect(theoryLinks).toHaveCount(7);
    await expect(practiceLinks).toHaveCount(7);
  });

  test("shows progress bar for topics with saved progress", async ({ page }) => {
    await setProgress(page, {
      topics: {
        javascript: {
          "1": { lastScore: 3, reviewCount: 1, lastReviewed: "2026-01-01" },
          "2": { lastScore: 2, reviewCount: 1, lastReviewed: "2026-01-01" },
          "3": { lastScore: 1, reviewCount: 1, lastReviewed: "2026-01-01" },
        },
      },
      totalSessions: 1,
    });

    await page.goto("/");
    // JavaScript topic should show "2/3" (cards with score >= 2 are mastered)
    await expect(page.getByText("2/3")).toBeVisible();
  });

  test("topics without progress show no progress bar", async ({ page }) => {
    await clearStorage(page);
    await page.goto("/");
    // No "X/Y" text should be visible
    await expect(page.getByText(/^\d+\/\d+$/)).not.toBeVisible();
  });

  test("navigation to practice page works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Практика" }).first().click();
    await expect(page).toHaveURL(/\/javascript\/practice/);
  });

  test("navigation to theory page works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Теория" }).first().click();
    await expect(page).toHaveURL(/\/javascript\/theory/);
  });
});
