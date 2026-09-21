/**
 * Single source of truth for the page.
 * Everything you need to edit lives here — the components never hardcode content.
 * Anything in CAPS is a placeholder waiting for your real data.
 */

export interface ProjectLink {
  title: string;
  description: string;
  href: string;
  year: string;
  /** path under /public — 16:10 works best */
  image: string;
  imageAlt: string;
}

export interface ProfileLink {
  label: string;
  handle: string;
  href: string;
  /** key in src/components/Icon.astro */
  icon: 'github' | 'linkedin' | 'mail' | 'telegram' | 'file';
}

export const site = {
  /* ── identity ─────────────────────────────────────────────── */
  name: 'Mykhailo',                       // TODO: add your surname
  initials: 'M',
  role: 'Backend engineer',
  tagline: 'I build the parts of systems nobody sees and everybody depends on.',
  location: 'Füssen, Germany',
  availability: 'Open to backend roles',  // set to '' to hide the green dot
  avatar: '/img/avatar.svg',              // TODO: drop a real photo in public/img/ and point here
  email: 'msg0687@gmail.com',

  /* ── SEO ──────────────────────────────────────────────────── */
  url: 'https://example.com',             // TODO: your domain, must match astro.config.mjs
  description:
    'Mykhailo — backend engineer based in Füssen, Germany. Services, APIs, data pipelines.',

  /* ── about: 2–3 short paragraphs, concrete over polished ──── */
  about: [
    'Backend engineer with mid/senior experience: services, APIs, databases, and the unglamorous glue that keeps them running in production.',
    'Currently running the day-to-day at a bike rental station in Füssen — scheduling, fleet, customers — which turned out to be a better lesson in systems under load than most of my code reviews.',
    'Russian and English daily, German up to B2. Based in Bavaria, working on things that ship.',
  ],

  /* ── stack ────────────────────────────────────────────────── */
  stack: [
    { key: 'Languages', items: ['LANGUAGE 1', 'LANGUAGE 2', 'SQL', 'Bash'] },
    { key: 'Backend',   items: ['FRAMEWORK 1', 'REST', 'gRPC', 'Queues'] },
    { key: 'Data',      items: ['PostgreSQL', 'Redis', 'DATABASE 3'] },
    { key: 'Infra',     items: ['Docker', 'CI/CD', 'Linux', 'CLOUD PROVIDER'] },
  ],

  /* ── projects ─────────────────────────────────────────────── */
  projects: [
    {
      title: 'PROJECT ONE',
      description:
        'One sentence on what it does and one on what was hard about it. No adjectives — numbers if you have them.',
      href: 'https://github.com/YOUR-HANDLE/project-one',
      year: '2026',
      image: '/img/project-1.svg',
      imageAlt: 'Screenshot of PROJECT ONE',
    },
    {
      title: 'PROJECT TWO',
      description:
        'What it does, who uses it, what it replaced. Keep it under two lines.',
      href: 'https://github.com/YOUR-HANDLE/project-two',
      year: '2025',
      image: '/img/project-2.svg',
      imageAlt: 'Screenshot of PROJECT TWO',
    },
    {
      title: 'PROJECT THREE',
      description:
        'The scrappy one. Say what broke and how you fixed it.',
      href: 'https://github.com/YOUR-HANDLE/project-three',
      year: '2025',
      image: '/img/project-3.svg',
      imageAlt: 'Screenshot of PROJECT THREE',
    },
  ],

  /* ── links ────────────────────────────────────────────────── */
  links: [
    {
      label: 'GitHub',
      handle: '@YOUR-HANDLE',
      href: 'https://github.com/YOUR-HANDLE',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: '/in/YOUR-HANDLE',
      href: 'https://www.linkedin.com/in/YOUR-HANDLE',
      icon: 'linkedin',
    },
    {
      label: 'Email',
      handle: 'msg0687@gmail.com',
      href: 'mailto:msg0687@gmail.com',
      icon: 'mail',
    },
    {
      label: 'Telegram',
      handle: '@YOUR-HANDLE',
      href: 'https://t.me/YOUR-HANDLE',
      icon: 'telegram',
    },
    {
      label: 'CV',
      handle: 'PDF · updated 2026',
      href: '/cv.pdf', // TODO: drop your CV at public/cv.pdf
      icon: 'file',
    },
  ],

  /* ── nav anchors ──────────────────────────────────────────── */
  nav: [
    { label: 'about', href: '#about' },
    { label: 'stack', href: '#stack' },
    { label: 'work', href: '#work' },
    { label: 'links', href: '#links' },
  ],
} satisfies {
  name: string; initials: string; role: string; tagline: string; location: string;
  availability: string; avatar: string; email: string; url: string; description: string;
  about: string[]; stack: { key: string; items: string[] }[];
  projects: ProjectLink[]; links: ProfileLink[];
  nav: { label: string; href: string }[];
};
