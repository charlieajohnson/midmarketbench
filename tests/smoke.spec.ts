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

test("mobile navigation works and the page passes a serious accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByLabel("Mobile navigation").getByRole("link", { name: "Cases" })).toBeVisible();
  await page.getByLabel("Mobile navigation").getByRole("link", { name: "Cases" }).click();
  await expect(page).toHaveURL(/\/cases$/);
  await expect(page.getByRole("heading", { name: "Realistic enough to require judgement." })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
