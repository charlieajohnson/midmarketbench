import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the observed leaderboard and model provenance", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Investment judgement, benchmarked." })).toBeVisible();
  await expect(page.getByLabel("Observed benchmark run provenance")).toContainText("Observed run");
  await expect(page.getByRole("table", { name: "Observed OpenRouter model leaderboard" })).toContainText("GPT-5.6 Sol");
  await page.goto("/models/gpt-5-6-sol");
  await expect(page.getByRole("heading", { name: "GPT-5.6 Sol", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Requested model and returned route." })).toBeVisible();
  await expect(page.getByLabel("GPT-5.6 Sol dimension radar")).toBeVisible();
  await expect(page.getByText("Representative outputs")).toHaveCount(0);
});

test("discloses the Kimi endpoint caveat", async ({ page }) => {
  await page.goto("/models/kimi-k3");
  await expect(page.getByRole("heading", { name: "Kimi K3", level: 1 })).toBeVisible();
  await expect(page.getByLabel("Route caveat")).toContainText("INT4");
  await expect(page.getByLabel("Route caveat")).toContainText("Mandatory max reasoning");
});

test("publishes the scored Norwyn case and labels the legacy example", async ({ page }) => {
  await page.goto("/cases");
  await expect(page.getByText("Scored on 18 July 2026")).toBeVisible();
  await expect(page.getByRole("link", { name: /Norwyn Controls/ })).toContainText("Observed run");
  await expect(page.getByRole("link", { name: /Veritalis Compliance Cloud/ })).toContainText("Unscored example");
  await page.getByRole("link", { name: /Norwyn Controls/ }).click();
  await expect(page.getByRole("heading", { name: "Norwyn Controls", level: 1 })).toBeVisible();
  await expect(page.getByText("D12  Untrusted portal footer")).toBeVisible();
  await expect(page.getByRole("heading", { name: "4 tasks, one structured decision." })).toBeVisible();
});

test("mobile navigation works and the page passes a serious accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByLabel("Mobile navigation").getByRole("link", { name: "Cases" })).toBeVisible();
  await page.getByLabel("Mobile navigation").getByRole("link", { name: "Cases" }).click();
  await expect(page).toHaveURL(/\/cases$/);
  await expect(page.getByRole("heading", { name: "Realistic enough to require judgement." })).toBeVisible();
  await expect(page).toHaveTitle("Cases | MidMarketBench");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
