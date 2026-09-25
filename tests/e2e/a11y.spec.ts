import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// scan the settled page, not reveal animations caught mid-fade
test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('no detectable WCAG 2 A/AA violations', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(
    violations.map((v) => `${v.id} (${v.impact}) → ${v.nodes.map((n) => n.target).join(', ')}`),
  ).toEqual([]);
});

test('exactly one h1 and no skipped heading levels', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);

  const levels = await page
    .locator('h1, h2, h3, h4')
    .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));

  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1], `heading jump at index ${i}`).toBeLessThanOrEqual(1);
  }
});

test('every image has alt text and explicit dimensions', async ({ page }) => {
  const images = page.locator('img');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await expect(img).toHaveAttribute('alt', /.+/);
    await expect(img).toHaveAttribute('width', /\d+/);
    await expect(img).toHaveAttribute('height', /\d+/);
  }
});

test('decorative svgs are hidden from screen readers', async ({ page }) => {
  const svgs = page.locator('svg');
  const count = await svgs.count();
  for (let i = 0; i < count; i++) {
    await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
  }
});

test('keyboard focus is visible and reaches the first link', async ({ page }) => {
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toBeVisible();

  const outline = await focused.evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(parseFloat(outline)).toBeGreaterThan(0);
});

test('body text meets the contrast floor on the dark background', async ({ page }) => {
  // axe covers this, but pin the tokens so a palette tweak fails loudly
  const { bg, fg } = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return { bg: s.getPropertyValue('--bg').trim(), fg: s.getPropertyValue('--fg').trim() };
  });
  expect(bg).toBe('#0d0c0a');
  expect(fg).toBe('#efe9dd');
});
