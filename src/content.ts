// All copy, links and image references live here. The person, projects and links below are
// this template's demo data, not real content: Jordan Ellis is a fictional, permanent demo
// persona, and every link points to the reserved example.com domain. Each demo block is
// marked with DEMO-CONTENT; replace or remove all of them with your own content.

export type Profile = {
  name: string;
  greeting: string;
  headline: string;
  bio: string;
  portraitAlt: string;
  projectsCta: string;
  contactCta: string;
};

export type ThumbnailKind = 'kanban' | 'dashboard' | 'components';

export type Project = {
  title: string;
  description: string;
  tags: readonly string[];
  demoUrl: string;
  sourceUrl: string;
  thumbnail: ThumbnailKind;
  thumbnailAlt: string;
};

export type SkillGroup = {
  name: string;
  items: readonly string[];
};

export type Contact = {
  email: string;
  mailtoHref: string;
  intro: string;
};

export type Social = {
  label: string;
  href: string;
};

export type Seo = {
  title: string;
  description: string;
};

// DEMO-CONTENT: replace with your own content
export const profile = {
  name: 'Jordan Ellis',
  greeting: 'Hi, I am Jordan Ellis',
  headline: 'Frontend engineer building fast, accessible web apps',
  bio: 'I design and build web products with React and TypeScript. Right now I am focused on performance, accessibility and clean design systems that teams enjoy using.',
  portraitAlt: 'Portrait of Jordan Ellis',
  projectsCta: 'View projects',
  contactCta: 'Contact me',
} satisfies Profile;

// DEMO-CONTENT: replace with your own content
export const projects = [
  {
    title: 'Task Flow',
    description:
      'A kanban board with drag and drop, keyboard shortcuts and offline sync. I built the whole frontend.',
    tags: ['React', 'TypeScript', 'Vite'],
    demoUrl: 'https://example.com/demo/task-flow',
    sourceUrl: 'https://example.com/source/task-flow',
    thumbnail: 'kanban',
    thumbnailAlt: 'Task Flow kanban board with three columns of task cards',
  },
  {
    title: 'Weather Now',
    description:
      'A fast weather dashboard with hourly charts and a clean mobile layout. Scores 100 on Lighthouse.',
    tags: ['Next.js', 'Tailwind', 'Charts'],
    demoUrl: 'https://example.com/demo/weather-now',
    sourceUrl: 'https://example.com/source/weather-now',
    thumbnail: 'dashboard',
    thumbnailAlt: 'Weather Now dashboard with a bar chart of the coming hours',
  },
  {
    title: 'Kit UI',
    description:
      'An open source component library focused on accessibility, with full keyboard support and dark mode.',
    tags: ['Design system', 'a11y', 'Storybook'],
    demoUrl: 'https://example.com/demo/kit-ui',
    sourceUrl: 'https://example.com/source/kit-ui',
    thumbnail: 'components',
    thumbnailAlt:
      'Kit UI components: two cards, two buttons, a toggle switch and a text field',
  },
] satisfies readonly Project[];

// DEMO-CONTENT: replace with your own content
export const skillGroups = [
  {
    name: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Accessibility'],
  },
  {
    name: 'Tooling',
    items: ['Git', 'Vite', 'Jest', 'Playwright', 'Figma'],
  },
] satisfies readonly SkillGroup[];

// DEMO-CONTENT: replace with your own content
export const contact = {
  // Display text only. Build the mailto: link from mailtoHref, never from email.
  email: 'jordan.ellis@example.com',
  // Must be a valid, percent-encoded mailto: URI, e.g. ?subject=Hello%20there.
  mailtoHref: 'mailto:jordan.ellis@example.com?subject=Hello%20Jordan',
  intro: 'Have a project in mind or just want to say hi? Send me an email.',
} satisfies Contact;

// DEMO-CONTENT: replace with your own content
export const socials = [
  {
    label: 'GitHub',
    href: 'https://example.com/github/jordan-ellis',
  },
  {
    label: 'LinkedIn',
    href: 'https://example.com/linkedin/jordan-ellis',
  },
] satisfies readonly Social[];

// DEMO-CONTENT: replace with your own content
export const seo = {
  title: 'Jordan Ellis - Frontend Engineer',
  description:
    'Personal portfolio of Jordan Ellis, a frontend engineer: projects, skills and contact details.',
} satisfies Seo;

export type ProjectsSection = {
  title: string;
  intro: string;
  demoLabel: string;
  sourceLabel: string;
};

export const projectsSection = {
  title: 'Projects',
  // DEMO-CONTENT: replace with your own content
  intro: 'A few things I have built recently.',
  demoLabel: 'Live demo',
  sourceLabel: 'Source',
} satisfies ProjectsSection;

export type ContactSection = {
  title: string;
  emailLabel: string;
};

export const contactSection = {
  title: 'Contact',
  emailLabel: 'Email',
} satisfies ContactSection;

export type SkillsSection = {
  title: string;
  intro: string;
};

export const skillsSection = {
  title: 'Skills',
  // DEMO-CONTENT: replace with your own content
  intro: 'The tools and practices I reach for every day.',
} satisfies SkillsSection;

export type Footer = {
  builtWith: string;
  demoNotice: string;
  templateLabel: string;
  templateHref: string;
  separator: string;
};

export const footer = {
  builtWith: 'Built with Next.js',
  // DEMO-CONTENT: replace or remove when this template becomes a real portfolio
  demoNotice: 'Demo content',
  templateLabel: 'Use this template',
  templateHref: 'https://github.com/toinguyen-agilityio/my-portfolio',
  separator: '·',
} satisfies Footer;

export type NotFound = {
  eyebrow: string;
  title: string;
  text: string;
  backLabel: string;
};

export const notFound = {
  eyebrow: 'Error 404',
  title: 'Page not found',
  text: 'The page you are looking for does not exist or has moved.',
  backLabel: 'Back to home',
} satisfies NotFound;

// DEMO-CONTENT: replace with your own content
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  // Root-relative. The header adds the base path when the site is served from a subpath.
  { label: 'My Story', href: '/story' },
  { label: 'Contact', href: '#contact' },
] satisfies readonly NavLink[];

export type NavLink = {
  label: string;
  href: string;
};

export type StoryImageKind = 'graduation' | 'travel' | 'sport' | 'photography';

export type StoryImage = {
  kind: StoryImageKind;
  alt: string;
};

export type StoryEntry = {
  year: string;
  title: string;
  text: string;
  image?: StoryImage;
};

export type Hobby = {
  title: string;
  text: string;
  tags: readonly string[];
  image?: StoryImage;
};

export type StoryJourney = {
  eyebrow: string;
  title: string;
  intro: string;
  entries: readonly StoryEntry[];
};

export type StoryHobbies = {
  title: string;
  intro: string;
  items: readonly Hobby[];
};

export type StoryCta = {
  title: string;
  text: string;
  contactLabel: string;
  projectsLabel: string;
};

export type StorySection = {
  eyebrow: string;
  title: string;
  lead: string;
  portraitAlt: string;
  backLabel: string;
  journey: StoryJourney;
  hobbies: StoryHobbies;
  cta: StoryCta;
  seo: Seo;
};

// DEMO-CONTENT: replace with your own content
export const storySection = {
  eyebrow: 'My story',
  title: 'How I got here',
  lead: 'I started by drawing interfaces on paper and never stopped. Here is the road from my first computer to shipping products with a team.',
  portraitAlt: 'Portrait of Jordan Ellis',
  backLabel: '← Back to home',
  journey: {
    eyebrow: 'Journey',
    title: 'The road so far',
    intro: 'The moments that shaped how I build software today.',
    entries: [
      {
        year: '2015',
        title: 'First steps in code',
        text: 'I finished school with a design degree and taught myself HTML and CSS on a secondhand laptop. My first site was a fan page with a very slow photo gallery.',
        image: {
          kind: 'graduation',
          alt: 'Illustration of a graduation cap and a laptop',
        },
      },
      {
        year: '2018',
        title: 'Joining my first product team',
        text: 'I joined a small agency as a junior frontend developer. I learned React, code review and what it takes to ship a feature every week.',
      },
      {
        year: '2021',
        title: 'Owning the frontend',
        text: 'I led the frontend of a booking app used by a few thousand people. I set up a shared design system and cut the page load time in half.',
        image: {
          kind: 'travel',
          alt: 'Illustration of a suitcase and a paper plane',
        },
      },
      {
        year: '2024',
        title: 'Building for everyone',
        text: 'Today I focus on performance and accessibility. I mentor junior developers and help teams make their interfaces usable with a keyboard and a screen reader.',
        image: {
          kind: 'photography',
          alt: 'Illustration of a camera with a lens and a flash',
        },
      },
    ],
  },
  hobbies: {
    title: 'Beyond work',
    intro: 'Away from the keyboard, these are the things I do to recharge.',
    items: [
      {
        title: 'Travel',
        text: 'I plan trips around local food and slow train rides. Every new city gives me ideas for the next interface I build.',
        tags: ['City walks', 'Local food', 'Trains'],
        image: {
          kind: 'travel',
          alt: 'Illustration of a suitcase and a map pin',
        },
      },
      {
        title: 'Sport',
        text: 'I run three mornings a week and play badminton on weekends. Sport teaches me to keep going when a problem is hard.',
        tags: ['Running', 'Badminton'],
        image: {
          kind: 'sport',
          alt: 'Illustration of running shoes and a badminton racket',
        },
      },
      {
        title: 'Photography',
        text: 'I take photos on a film camera and love the slow process of waiting for prints. It keeps me focused on light and framing.',
        tags: ['Film', 'Street'],
        image: {
          kind: 'photography',
          alt: 'Illustration of a film camera',
        },
      },
    ],
  },
  cta: {
    title: 'Let us build something together',
    text: 'I am open to frontend roles and to projects where accessibility and performance matter.',
    contactLabel: 'Contact me',
    projectsLabel: 'View projects',
  },
  seo: {
    title: 'My Story - Jordan Ellis',
    description:
      'The story of Jordan Ellis, a frontend engineer: the journey so far and the hobbies that keep them going.',
  },
} satisfies StorySection;
