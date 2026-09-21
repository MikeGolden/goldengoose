import { test, expect } from '@playwright/test';
import { site } from '../../src/data/site';

// the nav bar is desktop-only by design.
// reducedMotion makes the CSS smooth-scroll instant (see global.css), so anchor
// jumps land deterministically instead of racing the animation.
test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the top bar lists every nav entry', async ({ page }) => {
  const links = page.locator('.topbar__nav a');
  await expect(links).toHaveCount(site.nav.length);
  await expect(links).toHaveText(site.nav.map((n) => n.label));
});

test('each nav link jumps to its section', async ({ page }) => {
  for (const item of site.nav) {
    await page.locator('.topbar__nav a', { hasText: item.label }).click();
    await expect(page).toHaveURL(new RegExp(`${item.href}$`));
    await expect(page.locator(item.href)).toBeInViewport();
  }
});

test('the header gains its border once the page is scrolled', async ({ page }) => {
  await expect(page.locator('#topbar')).toHaveAttribute('data-scrolled', 'false');
  await page.mouse.wheel(0, 400);
  await expect(page.locator('#topbar')).toHaveAttribute('data-scrolled', 'true');
});

test('the wordmark returns to the top', async ({ page }) => {
  await page.mouse.wheel(0, 2000);
  await page.locator('.topbar__mark').click();
  await expect(page.locator('h1')).toBeInViewport();
});
