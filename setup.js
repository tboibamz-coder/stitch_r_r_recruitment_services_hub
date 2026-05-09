const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'stitch_r_r_recruitment_services_hub');
const DEST = __dirname;

const pages = [
  { src: 'homepage_r_r_recruitment/code.html',           dest: 'index.html' },
  { src: 'about_us_r_r_recruitment/code.html',           dest: 'about.html' },
  { src: 'our_services_r_r_recruitment/code.html',       dest: 'services.html' },
  { src: 'jobs_board_r_r_recruitment/code.html',         dest: 'jobs.html' },
  { src: 'find_a_job_candidate_hub/code.html',           dest: 'find-a-job.html' },
  { src: 'hire_talent_employer_hub/code.html',           dest: 'hire-talent.html' },
  { src: 'contact_us_r_r_recruitment/code.html',         dest: 'contact.html' },
  { src: 'resources_insights_r_r_recruitment/code.html', dest: 'resources.html' },
];

// Nav text → page file mapping
const navMap = {
  'Home':     'index.html',
  'Services': 'services.html',
  'Jobs':     'jobs.html',
  'About':    'about.html',
  'Blog':     'resources.html',
  'Contact':  'contact.html',
};

for (const { src, dest } of pages) {
  let html = fs.readFileSync(path.join(SRC, src), 'utf8');

  // Fix nav anchor links: href="#">{Text}</a>
  for (const [text, href] of Object.entries(navMap)) {
    html = html.replace(
      new RegExp(`href="#">${text}</a>`, 'g'),
      `href="${href}">${text}</a>`
    );
  }

  // Fix brand logo <a> links (pages where logo is an <a href="#">)
  html = html.replace(
    /(<a [^>]*?)href="#">(R&amp;R Recruitment)/g,
    `$1href="index.html">$2`
  );

  // Fix brand logo <div> (homepage) → wrap in <a>
  html = html.replace(
    /(<div class="[^"]*font-display-lg[^"]*font-bold[^"]*text-primary[^"]*">)(\s*R&amp;R Recruitment\s*)(<\/div>)/,
    '<a href="index.html" style="text-decoration:none;" class="font-display-lg text-headline-sm font-bold text-primary dark:text-primary-fixed">$2</a>'
  );

  // Inject nav.js before </body>
  html = html.replace('</body>', '<script src="nav.js"></script>\n</body>');

  fs.writeFileSync(path.join(DEST, dest), html, 'utf8');
  console.log(`✓ ${dest}`);
}

console.log('\nAll pages built. Run: node server.js');
