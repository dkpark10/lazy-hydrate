import { test, expect } from '@playwright/test';

test.describe('lazy hydration test', () => {
  test('react lazy', async ({ page }) => {
    await page.goto('/?visible=true');

    expect(await page.getByRole('heading', { level: 1 }).textContent()).toBe(
      'event: intersect'
    );

    let requestCall = false;
    await page.route('**/*', async (route) => {
      const url = route.request().url();

      if (/lazy-hydration/g.test(url)) {
        requestCall = true;
      }
      await route.continue();
      return;
    });

    expect(requestCall).toBeFalsy();

    await page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (let i = 0; i < document.body.scrollHeight; i += 100) {
        window.scrollTo(0, i);
        await delay(100);
      }
    });

    // hydration 과정중 깜빡임 현상이 없어야 한다.
    expect(
      await page.getByTestId('lazy-container').innerHTML()
    ).not.toBeFalsy();

    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (/lazy-hydration/g.test(url)) {
        requestCall = true;
      }
      await route.continue();
      return;
    });

    expect(requestCall).toBeTruthy();
  });

  test('next dynamic', async ({ page }) => {
    let requestCall = false;
    await page.route('**/*', async (route) => {
      const url = route.request().url();

      if (/lazy-hydration/g.test(url)) {
        requestCall = true;
      }
      await route.continue();
      return;
    });

    await page.goto('/dynamic?visible=true');

    expect(await page.getByRole('heading', { level: 1 }).textContent()).toBe(
      'event: intersect'
    );
    expect(requestCall).toBeTruthy();

    // hydration 과정중 깜빡임 현상이 없어야 한다.
    expect(
      await page.getByTestId('lazy-container').innerHTML()
    ).not.toBeFalsy();
  });
});
