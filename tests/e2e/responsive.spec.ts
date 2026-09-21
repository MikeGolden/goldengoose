import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'phone', width: 360, height: 780 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'wide', width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test(`no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0);
  });
}

test('the nav collapses below the breakpoint and returns above it', async ({ page }) => {
  await page.goto('/');

  await page.setViewportSize({ width: 360, height: 780 });
  await expect(page.locator('.topbar__nav')).toBeHidden();

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.topbar__nav')).toBeVisible();
});

test('project cards stack on a phone and sit side by side on a laptop', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#work .card').first();

  await page.setViewportSize({ width: 360, height: 780 });
  const stacked = await card.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
  expect(stacked.split(' ').length).toBe(1);

  await page.setViewportSize({ width: 1280, height: 800 });
  const side = await card.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
  expect(side.split(' ').length).toBe(2);
});

test('tap targets in the links grid are at least 40px tall', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');

  const links = page.locator('#links .link');
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const box = await links.nth(i).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(40);
  }
});
