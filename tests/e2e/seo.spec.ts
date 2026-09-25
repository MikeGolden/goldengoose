import { test, expect } from '@playwright/test';
import { site } from '../../src/data/site';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('title and description are set', async ({ page }) => {
  await expect(page).toHaveTitle(`${site.name} — ${site.role}`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', site.description);
});

test('canonical, favicon and theme colour are present', async ({ page }) => {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0d0c0a');
});

test('open graph tags are complete', async ({ page }) => {
  for (const [property, expected] of [
    ['og:type', 'website'],
    ['og:title', `${site.name} — ${site.role}`],
    ['og:description', site.description],
  ] as const) {
    await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute('content', expected);
  }
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\//);
});

test('Person JSON-LD is valid and links out', async ({ page }) => {
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(raw).toBeTruthy();

  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe(site.name);
  expect(data.jobTitle).toBe(site.role);
  expect(data.email).toBe(`mailto:${site.email}`);
  expect(Array.isArray(data.sameAs)).toBe(true);
  expect(data.sameAs.length).toBeGreaterThan(0);
  for (const url of data.sameAs) expect(url).toMatch(/^https?:\/\//);
});

test('the document declares a language', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
