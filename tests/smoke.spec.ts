import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the synthetic leaderboard and model detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Investment judgement, benchmarked." })).toBeVisible();
  await expect(page.getByRole("table", { name: "Synthetic model leaderboard" })).toContainText("GPT-5.5");
  await page.goto("/models/gpt-5-5");
  await expect(page.getByRole("heading", { name: "GPT-5.5", level: 1 })).toBeVisible();
  await expect(page.getByLabel("GPT-5.5 dimension radar")).toBeVisible();
});

test("persists the theme and passes a serious accessibility scan", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
