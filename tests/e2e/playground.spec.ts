import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("sample app renders its design system controls accessibly", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Design system starter" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Workspace name" })).toHaveValue("Acme Design");
  await expect(page).toHaveScreenshot("playground.png", { fullPage: true });
});

test("sample app has no axe accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("open modal has no axe accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open accessible dialog" }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("modal supports keyboard dismissal and focus restoration", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open accessible dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Invite your team" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
