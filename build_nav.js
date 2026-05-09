/**
 * Rebuilds the sticky navbar in all 8 pages with a dark Oxford Navy background
 * and white logo. Run: node build_nav.js
 */
const fs = require('fs');
const path = require('path');

const NAV_LINKS = [
  { text: 'Home',     href: 'index.html' },
  { text: 'Services', href: 'services.html' },
  { text: 'Jobs',     href: 'jobs.html' },
  { text: 'About',    href: 'about.html' },
  { text: 'Blog',     href: 'resources.html' },
  { text: 'Contact',  href: 'contact.html' },
];

const INACTIVE = 'font-headline-sm text-headline-sm text-white/70 hover:text-secondary transition-all';
const ACTIVE   = 'font-headline-sm text-headline-sm text-white font-bold border-b-2 border-secondary hover:text-secondary transition-all';

function navLinks(activePage) {
  return NAV_LINKS.map(l =>
    `<a class="${l.text === activePage ? ACTIVE : INACTIVE}" href="${l.href}">${l.text}</a>`
  ).join('\n');
}

const LOGO = `<a href="index.html" class="flex items-center shrink-0" aria-label="R&R Recruitment Services — Home"><img src="assets/logo.png" alt="R&R Recruitment Services" class="h-9 md:h-11 w-auto" width="2320" height="464" loading="eager"/></a>`;

const CTAS = `<div class="hidden lg:flex items-center gap-stack-md">
<button class="px-6 py-3 border-2 border-white/60 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-300 font-label-caps text-label-caps uppercase tracking-wider">Find a Job</button>
<button class="px-6 py-3 bg-secondary text-on-secondary hover:bg-secondary-fixed-dim transition-colors duration-300 font-label-caps text-label-caps uppercase tracking-wider">Hire Talent</button>
</div>`;

const HAMBURGER = `<button class="md:hidden text-white p-2"><span class="material-symbols-outlined">menu</span></button>`;

function buildHeader(activePage) {
  return `<header class="bg-primary backdrop-blur-md sticky top-0 w-full border-b border-white/10 shadow-md z-50 transition-all duration-300 ease-in-out">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-20">
${LOGO}
<nav class="hidden md:flex gap-gutter items-center">
${navLinks(activePage)}
</nav>
${CTAS}
${HAMBURGER}
</div>
</header>`;
}

// services.html uses <nav> not <header> for its sticky bar
function buildNavElement(activePage) {
  return `<nav class="sticky top-0 w-full bg-primary backdrop-blur-md border-b border-white/10 shadow-md z-50 transition-all duration-300 ease-in-out">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-20">
${LOGO}
<div class="hidden md:flex gap-gutter items-center">
${navLinks(activePage)}
</div>
${CTAS}
${HAMBURGER}
</div>
</nav>`;
}

const pages = [
  { file: 'index.html',       active: 'Home',     type: 'header' },
  { file: 'about.html',       active: 'About',    type: 'header' },
  { file: 'services.html',    active: 'Services', type: 'nav'    },
  { file: 'jobs.html',        active: 'Jobs',     type: 'header' },
  { file: 'find-a-job.html',  active: null,       type: 'header' },
  { file: 'hire-talent.html', active: 'Services', type: 'header' },
  { file: 'contact.html',     active: 'Contact',  type: 'header' },
  { file: 'resources.html',   active: 'Blog',     type: 'header' },
];

for (const { file, active, type } of pages) {
  let html = fs.readFileSync(path.join(__dirname, file), 'utf8');

  if (type === 'header') {
    // Replace <header>...</header>
    const start = html.indexOf('<header ');
    const end   = html.indexOf('</header>') + '</header>'.length;
    if (start === -1) { console.log(`✗ ${file}: no <header> found`); continue; }
    html = html.slice(0, start) + buildHeader(active) + html.slice(end);

  } else {
    // services.html: replace the sticky <nav>...</nav>
    // Find the nav that contains the logo (not inner navs in the page body)
    const navStart = html.indexOf('<nav class="docked');
    if (navStart === -1) { console.log(`✗ ${file}: no sticky <nav> found`); continue; }
    // Find matching </nav> — count depth
    let depth = 0, i = navStart, end = -1;
    while (i < html.length) {
      if (html.startsWith('<nav', i) && (html[i+4] === ' ' || html[i+4] === '>')) depth++;
      else if (html.startsWith('</nav>', i)) { depth--; if (depth === 0) { end = i + 6; break; } }
      i++;
    }
    if (end === -1) { console.log(`✗ ${file}: could not find end of <nav>`); continue; }
    html = html.slice(0, navStart) + buildNavElement(active) + html.slice(end);
  }

  fs.writeFileSync(path.join(__dirname, file), html, 'utf8');
  console.log(`✓ ${file}`);
}

console.log('\nNav rebuild complete.');
