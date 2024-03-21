import { test, expect } from "@playwright/test";

test("lazy hydrated", async ({ page }) => {
  await page.goto("/");

  let notRequestCall = false;
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("lazy")) {
      notRequestCall = true;
    }
    await route.continue();
    return;
  });

  expect(notRequestCall).toBeFalsy();

  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await delay(100);
    }
  });

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("lazy")) {
      notRequestCall = true;
    }
    await route.continue();
    return;
  });

  expect(notRequestCall).toBeTruthy();
});
