/**
 * One-time patch script — applies performance, SEO, and accessibility fixes
 * to all 8 built HTML pages. Safe to re-run (idempotent on most changes).
 * Run: node patch.js
 */
const fs   = require('fs');
const path = require('path');
const DEST = __dirname;

// ─── Meta descriptions ───────────────────────────────────────────────────────
const metaDescs = {
  'index.html':       "R&R Recruitment Services Limited — Lagos's premier recruitment firm connecting Nigerian professionals with top employers. Executive search, permanent placement & HR consulting.",
  'about.html':       "About R&R Recruitment — Over 15 years building careers and strengthening organisations across Lagos and Nigeria. Meet the team behind 500+ successful placements.",
  'services.html':    "Recruitment services tailored for Lagos — executive search, permanent placement, contract staffing, HR consulting and outplacement from R&R Recruitment Services Limited.",
  'jobs.html':        "Browse the latest jobs in Lagos across finance, technology, FMCG, oil & gas and more. Find your next career move with R&R Recruitment Services Limited.",
  'find-a-job.html':  "Looking for work in Lagos? Search and apply for executive and professional roles across Nigeria with R&R Recruitment — your career partner in the Lagos job market.",
  'hire-talent.html': "Hire skilled professionals in Lagos with R&R Recruitment. Trusted by 250+ clients across Nigeria for executive search, volume hiring, and talent acquisition.",
  'contact.html':     "Contact R&R Recruitment Services Limited. Reach our Lagos office to discuss hiring needs, career opportunities, or partnership enquiries.",
  'resources.html':   "Insights and resources for Nigerian professionals and employers — hiring trends, career advice, leadership tips and the latest Lagos job market analysis from R&R Recruitment.",
};

// ─── Image dimension / loading rules ────────────────────────────────────────
// Matched against the alt attribute. Order matters: first match wins.
const IMG_RULES = [
  { match: 'Hero Background',                  w: 1440, h: 870,  lazy: false },
  { match: 'Professionals in Lagos office',    w: 800,  h: 600,  lazy: false },
  { match: 'Consultation',                     w: 900,  h: 600,  lazy: true  },
  { match: 'Team Collaboration',               w: 600,  h: 600,  lazy: true  },
  { match: 'Team Member',                      w: 400,  h: 400,  lazy: true  },
  { match: 'Map of Lagos',                     w: 800,  h: 400,  lazy: true  },
  { match: 'modern office space in Lagos',     w: 900,  h: 500,  lazy: true  },
  { match: 'navy blue suit',                   w: 40,   h: 40,   lazy: true  },
];
const IMG_DEFAULT = { w: 800, h: 500, lazy: true };

function imgRule(alt) {
  for (const rule of IMG_RULES) {
    if (alt.includes(rule.match)) return rule;
  }
  return IMG_DEFAULT;
}

// ─── Focus-visible style injected into every page ────────────────────────────
const FOCUS_STYLE = `<style>
:focus-visible{outline:2px solid #D4AF37;outline-offset:2px;border-radius:2px;}
</style>`;

// ─── Process pages ───────────────────────────────────────────────────────────
const pages = [
  'index.html','about.html','services.html','jobs.html',
  'find-a-job.html','hire-talent.html','contact.html','resources.html',
];

for (const page of pages) {
  let html = fs.readFileSync(path.join(DEST, page), 'utf8');

  // 1. Meta description (insert after <title>...</title>)
  if (!html.includes('name="description"')) {
    html = html.replace(
      /(<\/title>)/,
      `$1\n<meta name="description" content="${metaDescs[page]}"/>`
    );
  }

  // 2. Focus-visible style (insert before </head>)
  if (!html.includes(':focus-visible')) {
    html = html.replace('</head>', `${FOCUS_STYLE}\n</head>`);
  }

  // 3. Patch every <img> tag — add width/height and loading
  let imgIdx = 0;
  html = html.replace(/<img ([^>]+?)(\s*\/?>)/g, (_match, attrs) => {
    imgIdx++;
    const altM = attrs.match(/alt="([^"]*)"/);
    const alt  = altM ? altM[1] : '';
    const { w, h, lazy } = imgRule(alt);

    let a = attrs;
    if (!a.includes('width='))   a += ` width="${w}" height="${h}"`;
    if (!a.includes('loading=')) a += lazy
      ? ' loading="lazy"'
      : ' loading="eager" fetchpriority="high"';

    return `<img ${a.trim()}/>`;
  });

  // 4. target="_blank" safety
  html = html.replace(
    /target="_blank"(?![^>]*rel=)/g,
    'target="_blank" rel="noopener noreferrer"'
  );

  // 5. Page-specific accessibility fixes
  if (page === 'resources.html') {
    // Search input
    html = html.replace(
      /(<input )([^>]*placeholder="Search articles\.\.\.")/,
      '$1aria-label="Search articles" $2'
    );
    // Newsletter email input
    html = html.replace(
      /(<input )([^>]*placeholder="Your corporate email")/,
      '$1aria-label="Your corporate email address" $2'
    );
  }

  fs.writeFileSync(path.join(DEST, page), html, 'utf8');
  console.log(`✓ ${page}`);
}

console.log('\nPatch complete.');
