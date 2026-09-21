import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../../src/data/site';

/** Structural checks on the content file — no browser needed. */

test('identity fields are filled in', () => {
  for (const key of ['name', 'role', 'tagline', 'location', 'email', 'url', 'description'] as const) {
    expect(site[key], `site.${key} must not be empty`).not.toBe('');
  }
  expect(site.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  expect(site.url).toMatch(/^https?:\/\//);
});

test('about has 2–4 paragraphs and no lorem', () => {
  expect(site.about.length).toBeGreaterThanOrEqual(2);
  expect(site.about.length).toBeLessThanOrEqual(4);
  for (const p of site.about) {
    expect(p.length).toBeGreaterThan(40);
    expect(p.toLowerCase()).not.toContain('lorem');
  }
});

test('stack rows are non-empty', () => {
  expect(site.stack.length).toBeGreaterThan(0);
  for (const row of site.stack) {
    expect(row.key).not.toBe('');
    expect(row.items.length).toBeGreaterThan(0);
  }
});

test('every project has a valid link, year and existing thumbnail', () => {
  expect(site.projects.length).toBeGreaterThan(0);
  for (const p of site.projects) {
    expect(p.title, 'project title').not.toBe('');
    expect(p.description.length, `${p.title}: description too short`).toBeGreaterThan(20);
    expect(p.href, `${p.title}: href`).toMatch(/^(https?:\/\/|\/)/);
    expect(p.year, `${p.title}: year`).toMatch(/^\d{4}$/);
    expect(p.imageAlt, `${p.title}: imageAlt`).not.toBe('');
    expect(existsSync(join('public', p.image)), `${p.image} missing in public/`).toBe(true);
  }
});

test('profile links are unique, labelled and resolvable', () => {
  const hrefs = site.links.map((l) => l.href);
  expect(new Set(hrefs).size, 'duplicate link hrefs').toBe(hrefs.length);

  for (const l of site.links) {
    expect(l.label).not.toBe('');
    expect(l.handle).not.toBe('');
    expect(l.href).toMatch(/^(https?:\/\/|mailto:|\/)/);
  }
  expect(site.links.some((l) => l.icon === 'mail'), 'an email link is required').toBe(true);
});

test('nav anchors are unique and lowercase hashes', () => {
  const hrefs = site.nav.map((n) => n.href);
  expect(new Set(hrefs).size).toBe(hrefs.length);
  for (const n of site.nav) expect(n.href).toMatch(/^#[a-z-]+$/);
});

test('avatar and favicon exist', () => {
  expect(existsSync(join('public', site.avatar)), `${site.avatar} missing`).toBe(true);
  expect(existsSync(join('public', 'favicon.svg'))).toBe(true);
});
