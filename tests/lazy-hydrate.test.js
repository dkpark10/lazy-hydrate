import { test, expect } from "@playwright/test";

test("lazy hydrated", async ({ page }) => {
  await page.goto("/?visible=true");

  let notRequestCall = false;
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (/lazy-hydration/g.test(url)) {
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

  // hydration 과정중 깜빡임 현상이 없어야 한다.
  expect(await page.getByTestId('lazy-container').innerHTML()).not.toBeFalsy();

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (/lazy-hydration/g.test(url)) {
      notRequestCall = true;
    }
    await route.continue();
    return;
  });

  expect(notRequestCall).toBeTruthy();
});
