import { test, expect } from '@playwright/test';
import { site } from '../../src/data/site';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero shows name, role, location and availability', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.name);
  await expect(page.locator('.hero__role')).toContainText(site.role);
  await expect(page.locator('.hero__role')).toContainText(site.tagline);
  await expect(page.locator('.hero__meta')).toContainText(site.location);
  if (site.availability) {
    await expect(page.locator('.hero__meta')).toContainText(site.availability);
    await expect(page.locator('.hero__meta .dot')).toBeVisible();
  }
});

test('hero CTAs point at the mailbox and the CV', async ({ page }) => {
  await expect(page.locator('.btn--primary')).toHaveAttribute('href', `mailto:${site.email}`);
  const cv = site.links.find((l) => l.icon === 'file');
  if (cv) {
    await expect(page.locator('.hero__cta a', { hasText: 'CV' })).toHaveAttribute('href', cv.href);
  }
});

test('all sections render, in order', async ({ page }) => {
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['about', 'experience', 'stack', 'work', 'links']);
  for (const id of ids) await expect(page.locator(`#${id} .label`)).toBeVisible();
});

test('about paragraphs are rendered verbatim', async ({ page }) => {
  const paragraphs = page.locator('#about .prose p');
  await expect(paragraphs).toHaveCount(site.about.length);
  await expect(paragraphs).toHaveText(site.about.map((p) => p));
});

test('every role renders with its org, period, place and bullet points', async ({ page }) => {
  const roles = page.locator('#experience .role');
  await expect(roles).toHaveCount(site.experience.length);

  for (const [i, role] of site.experience.entries()) {
    const el = roles.nth(i);
    await expect(el.locator('.role__title')).toContainText(role.title);
    await expect(el.locator('.role__org')).toHaveText(role.org);
    await expect(el.locator('.role__period')).toHaveText(role.period);
    await expect(el.locator('.role__place')).toHaveText(role.place);
    await expect(el.locator('.role__points li')).toHaveText(role.points.map((p) => p));
  }
});

test('the education line is rendered', async ({ page }) => {
  await expect(page.locator('#experience .education')).toHaveText(site.education);
});

test('stack rows and tags match the data file', async ({ page }) => {
  const rows = page.locator('#stack .stack-row');
  await expect(rows).toHaveCount(site.stack.length);
  for (const [i, row] of site.stack.entries()) {
    await expect(rows.nth(i).locator('.stack-row__key')).toHaveText(row.key);
    await expect(rows.nth(i).locator('.tag')).toHaveText(row.items.map((t) => t));
  }
});

test('each project card carries title, year, description and thumbnail', async ({ page }) => {
  const cards = page.locator('#work .card');
  await expect(cards).toHaveCount(site.projects.length);

  for (const [i, project] of site.projects.entries()) {
    const card = cards.nth(i);
    await expect(card).toHaveAttribute('href', project.href);
    await expect(card.locator('.card__title')).toContainText(project.title);
    await expect(card.locator('.card__year')).toHaveText(project.year);
    await expect(card.locator('.card__desc')).toHaveText(project.description);

    const thumb = card.locator('.card__thumb');
    await card.scrollIntoViewIfNeeded(); // the thumbs are lazy-loaded
    await expect(thumb).toHaveAttribute('alt', project.imageAlt);
    await expect(thumb).toHaveAttribute('loading', 'lazy');
    // the image actually resolved, rather than rendering a broken-image box
    await expect
      .poll(() => thumb.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  }
});

test('every profile link is present with the right href', async ({ page }) => {
  const links = page.locator('#links .link');
  await expect(links).toHaveCount(site.links.length);

  for (const [i, link] of site.links.entries()) {
    const el = links.nth(i);
    await expect(el).toHaveAttribute('href', link.href);
    await expect(el.locator('.link__label')).toHaveText(link.label);
    await expect(el.locator('.link__handle')).toHaveText(link.handle);
    await expect(el.locator('svg')).toBeVisible();
  }
});

test('external links open in a new tab and drop the opener', async ({ page }) => {
  const external = page.locator('a[href^="http"]');
  const count = await external.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = external.nth(i);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
  }
});

test('footer shows the current year and location', async ({ page }) => {
  await expect(page.locator('footer')).toContainText(String(new Date().getFullYear()));
  await expect(page.locator('footer')).toContainText(site.location);
});

test('page loads without console errors or failed requests', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));

  await page.goto('/', { waitUntil: 'networkidle' });
  expect(problems).toEqual([]);
});

test('unknown routes return the 404 page', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
});
