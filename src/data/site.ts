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

export interface Role {
  title: string;
  org: string;
  period: string;
  place: string;
  points: string[];
}

export const site = {
  /* ── identity ─────────────────────────────────────────────── */
  name: 'Mykhailo Goldenberg',
  initials: 'MG',
  role: 'Senior software engineer',
  tagline: 'Python backends, React on top, a decade of both in production.',
  location: 'Füssen, Germany',
  availability: 'Open to senior backend roles in Europe',
  avatar: '/img/avatar.jpg',
  email: 'msg0687@gmail.com',

  /* ── SEO ──────────────────────────────────────────────────── */
  url: 'https://example.com',             // TODO: your domain, must match astro.config.mjs
  description:
    'Mykhailo Goldenberg — senior software engineer in Füssen, Germany. Python, FastAPI, React, PostgreSQL.',

  /* ── about: 2–3 short paragraphs, concrete over polished ──── */
  about: [
    'Ten years of backend Python, most of it at CloudLinux: a customer self-service portal on APIs serving ~500k requests a day, a cluster-monitoring platform with hundreds of tunable metrics, and the Python 2→3 migration of a large production codebase that shipped without a functional regression.',
    'Now senior engineer at id4web in Füssen — FastAPI, React and PostgreSQL for business clients, end to end: requirements, architecture, tests, deploy. I lead the dev team and own the client conversation on three accounts.',
    'In between I ran a 200+ asset rental fleet for two seasons: ~€350k revenue, 85% availability, purchasing and pricing driven off utilisation data. Best education in systems under load I have had, and the reason I reach for numbers before opinions.',
  ],

  /* ── experience ───────────────────────────────────────────── */
  experience: [
    {
      title: 'Senior Software Engineer',
      org: 'id4web',
      period: 'Oct 2025 — now',
      place: 'Füssen · hybrid',
      points: [
        'Full-stack delivery for business clients in Python/FastAPI, React and PostgreSQL — owning features from requirements through architecture, tests and deployment.',
        'Lead the development team and run client communication on three accounts.',
      ],
    },
    {
      title: 'Operations & Technical Manager',
      org: 'Bike Füssen',
      period: 'Feb 2024 — Oct 2025',
      place: 'Füssen · on-site',
      points: [
        '200+ asset rental fleet, ~€350k seasonal revenue, 85% availability sustained through capacity planning and preventive maintenance.',
        'Purchasing, pricing and resource allocation decided on utilisation and seasonality data; reporting to the owner.',
      ],
    },
    {
      title: 'Senior Backend Developer',
      org: 'CloudLinux',
      period: 'Sep 2016 — Sep 2023',
      place: 'Kyiv · remote',
      points: [
        'Built a client self-service portal with subscription monitoring for ~30 customers; platform APIs served ~500k requests/day.',
        'Co-built a cluster-monitoring platform for the whole server fleet: hundreds of customisable metrics, alerting and visualisation.',
        'Led the Python 2→3 migration of a large production codebase — dependency analysis, refactoring, release management, no functional regressions.',
        'Cut deployment time 40% with custom Bash automation; added OAuth 2.0 and role-based access control across the API surface; provisioning with Ansible.',
      ],
    },
    {
      title: 'Software Developer',
      org: 'CloudLinux',
      period: 'Mar 2013 — Aug 2016',
      place: 'Kyiv · remote',
      points: [
        'Intern to mid-level in three years, starting with authentication and role-based access control.',
        'Designed a modular Flask REST API with versioning and request/response validation; Flask-SQLAlchemy; deployment tooling in Bash.',
      ],
    },
  ] satisfies Role[],

  education: 'MSc, Informatics and Computer Engineering — Igor Sikorsky Kyiv Polytechnic Institute, 2004–2009',

  /* ── stack ────────────────────────────────────────────────── */
  stack: [
    { key: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'Bash'] },
    { key: 'Backend', items: ['FastAPI', 'Flask', 'SQLAlchemy', 'REST', 'OAuth 2.0'] },
    { key: 'Data', items: ['PostgreSQL', 'Caching at scale', 'Monitoring & alerting'] },
    { key: 'Frontend', items: ['React', 'Astro'] },
    { key: 'Infra', items: ['Linux', 'Ansible', 'Docker', 'CI/CD'] },
    { key: 'Spoken', items: ['Ukrainian', 'Russian', 'English', 'German (B1)'] },
  ],

  /* ── projects ─────────────────────────────────────────────── */
  projects: [
    {
      title: 'elcorix.de',
      description:
        'Bilingual DE/RU site for a laser hair removal studio in Kempten: treatment catalogue by body area, booking enquiry flow, map and WhatsApp contact.',
      href: 'https://elcorix.de',
      year: '2026',
      image: '/img/elcorix.png',
      imageAlt: 'elcorix.de — laser hair removal studio site',
    },
  ],

  /* ── links ────────────────────────────────────────────────── */
  links: [
    {
      label: 'GitHub',
      handle: '@MikeGolden',
      href: 'https://github.com/MikeGolden',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: '/in/mykhailo-goldenberg',
      href: 'https://www.linkedin.com/in/mykhailo-goldenberg',
      icon: 'linkedin',
    },
    {
      label: 'Email',
      handle: 'msg0687@gmail.com',
      href: 'mailto:msg0687@gmail.com',
      icon: 'mail',
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
    { label: 'experience', href: '#experience' },
    { label: 'stack', href: '#stack' },
    { label: 'work', href: '#work' },
    { label: 'links', href: '#links' },
  ],
} satisfies {
  name: string; initials: string; role: string; tagline: string; location: string;
  availability: string; avatar: string; email: string; url: string; description: string;
  about: string[]; experience: Role[]; education: string;
  stack: { key: string; items: string[] }[];
  projects: ProjectLink[]; links: ProfileLink[];
  nav: { label: string; href: string }[];
};
