/**
 * Applies real company details from the R&R Recruitment flier across all pages.
 * Run: node update_details.js
 */
const fs = require('fs');
const path = require('path');

const WA_NUMBER  = '2347040950515';
const WA_URL     = `https://wa.me/${WA_NUMBER}`;
const PHONE      = '+234 903 541 1252';
const PHONE_TEL  = 'tel:+2349035411252';
const WA_PHONE   = '+234 704 095 0515';
const EMAIL      = 'r2recruitmentservices@gmail.com';
const ADDRESS_L1 = '10, Apata-Idiorogbo,';
const ADDRESS_L2 = 'Ayobo, Lagos,';
const ADDRESS_L3 = 'Nigeria';
const TAGLINE    = 'Building Strong Teams. Empowering Careers.';

const pages = [
  'index.html','about.html','services.html','jobs.html',
  'find-a-job.html','hire-talent.html','contact.html','resources.html',
];

// ─── 1. contact.html — full contact detail replacement ───────────────────────
let contact = fs.readFileSync(path.join(__dirname, 'contact.html'), 'utf8');

// Address
contact = contact.replace(
  /15 Macarthy Street, Onikan,<br\/>[\s\S]*?Lagos Island, Lagos,<br\/>[\s\S]*?Nigeria/,
  `${ADDRESS_L1}<br/>${ADDRESS_L2}<br/>${ADDRESS_L3}`
);

// Phone number — text and href
contact = contact.replace(
  /href="tel:\+23412345678">\+234 \(1\) 234 5678/,
  `href="${PHONE_TEL}">${PHONE}`
);

// Email — text and href
contact = contact.replace(
  /href="mailto:contact@rrrecruitment\.com">contact@rrrecruitment\.com/,
  `href="mailto:${EMAIL}">${EMAIL}`
);

// Insert WhatsApp number row after the phone row
contact = contact.replace(
  /(<div class="flex items-center gap-4 mb-stack-sm">[\s\S]*?<\/span>\s*<a [^>]*href="tel:[^"]*"[^>]*>[^<]*<\/a>\s*<\/div>)/,
  `$1
<div class="flex items-center gap-4 mb-stack-sm">
<span class="material-symbols-outlined text-secondary-fixed" data-icon="chat">chat</span>
<a class="font-body-md text-body-md text-on-primary/90 hover:text-white transition-colors" href="${WA_URL}" target="_blank" rel="noopener noreferrer">${WA_PHONE} (WhatsApp)</a>
</div>`
);

// WhatsApp chat button in contact card
contact = contact.replace(
  /href="#">[\s\S]*?Chat on WhatsApp/,
  `href="${WA_URL}" target="_blank" rel="noopener noreferrer">Chat on WhatsApp`
);

fs.writeFileSync(path.join(__dirname, 'contact.html'), contact, 'utf8');
console.log('✓ contact.html — address, phone, email, WhatsApp');

// ─── 2. All pages — floating WhatsApp button href + aria ──────────────────────
pages.forEach(p => {
  let html = fs.readFileSync(path.join(__dirname, p), 'utf8');

  // Fix <a> floating WhatsApp buttons that have href="#"
  html = html.replace(
    /(<a [^>]*aria-label="Chat with a Consultant"[^>]*)href="#"/g,
    `$1href="${WA_URL}" target="_blank" rel="noopener noreferrer"`
  );
  // Fix about.html variant (no aria-label on the <a> directly)
  html = html.replace(
    /(<!-- Floating WhatsApp -->[\s\S]*?<a [^>]*)href="#">/,
    `$1href="${WA_URL}" target="_blank" rel="noopener noreferrer">`
  );

  // ─── 3. Footer updates ──────────────────────────────────────────────────────

  // Copyright year
  html = html.replace(/© 2024 R&amp;R Recruitment/g, '© 2025 R&amp;R Recruitment');

  // Footer tagline (short version on some pages)
  html = html.replace(
    /Building Lagos&#x27;s professional landscape through strategic talent acquisition and management\./g,
    TAGLINE
  );
  html = html.replace(
    /Built for the Lagos professional landscape\./g,
    TAGLINE
  );

  // Footer services list — align with flier service names
  html = html.replace(/>Executive Search<\/a>/g,        '>Recruitment &amp; Onboarding</a>');
  html = html.replace(/>Contract Staffing<\/a>/g,       '>Staff Management</a>');
  html = html.replace(/>HR Consulting<\/a>/g,           '>Training &amp; Development</a>');

  // Footer company links — wire up href="#" to real pages
  html = html.replace(/>About Us<\/a>/g,  '>About Us</a>'.replace('href="#"', `href="about.html"`));

  fs.writeFileSync(path.join(__dirname, p), html, 'utf8');
  console.log(`✓ ${p} — WhatsApp link, footer`);
});

// ─── 4. index.html — hero label tagline ──────────────────────────────────────
let index = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// The gold label above the hero h1
index = index.replace(
  /R&amp;R Recruitment Services Limited<\/span>/,
  `${TAGLINE}</span>`
);
fs.writeFileSync(path.join(__dirname, 'index.html'), index, 'utf8');
console.log('✓ index.html — hero tagline updated');

// ─── 5. nav.js — WhatsApp click handler ──────────────────────────────────────
let navjs = fs.readFileSync(path.join(__dirname, 'nav.js'), 'utf8');
if (!navjs.includes('wa.me')) {
  const waHandler = `
  // WhatsApp floating button handler (for pages where button is not an <a>)
  document.querySelectorAll('[aria-label="Chat on WhatsApp"], [aria-label="Chat with a Consultant"]').forEach(function (el) {
    if (el.tagName === 'BUTTON' || !el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.open('${WA_URL}', '_blank', 'noopener,noreferrer');
      });
    }
  });
`;
  navjs = navjs.replace('})();', waHandler + '})();');
  fs.writeFileSync(path.join(__dirname, 'nav.js'), navjs, 'utf8');
  console.log('✓ nav.js — WhatsApp click handler added');
}

console.log('\nAll details updated.');
