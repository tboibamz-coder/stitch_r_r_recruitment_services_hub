(function () {
  // --- CTA button navigation ---
  document.querySelectorAll('button').forEach(function (btn) {
    var t = btn.textContent.trim();
    if (t === 'Find a Job' || t === "I'm Looking for Work") {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function () { window.location.href = 'find-a-job.html'; });
    }
    if (t === 'Hire Talent' || t === "I'm Hiring Talent") {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function () { window.location.href = 'hire-talent.html'; });
    }
  });

  // --- Logo div click (homepage) ---
  var header = document.querySelector('header');
  if (header) {
    var logoDiv = Array.from(header.querySelectorAll('div')).find(function (el) {
      return el.textContent.trim().startsWith('R&R') || el.textContent.trim().startsWith('R&amp;R');
    });
    if (logoDiv) {
      logoDiv.style.cursor = 'pointer';
      logoDiv.addEventListener('click', function () { window.location.href = 'index.html'; });
    }
  }

  // --- Mobile menu ---
  var menuBtn = document.querySelector('header button.md\\:hidden, header button[class*="md:hidden"]');
  var desktopNav = document.querySelector('header nav');

  if (menuBtn && desktopNav) {
    var mobileMenu = document.createElement('div');
    mobileMenu.style.cssText = [
      'display:none',
      'position:fixed',
      'top:80px',
      'left:0',
      'right:0',
      'background:#000a1e',
      'z-index:999',
      'padding:24px 16px',
      'flex-direction:column',
      'gap:0',
      'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
    ].join(';');

    desktopNav.querySelectorAll('a').forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      a.style.cssText = 'color:#ffffff;font-family:Montserrat,sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08);display:block;';
      mobileMenu.appendChild(a);
    });

    // Add Find a Job / Hire Talent to mobile menu
    var ctaRow = document.createElement('div');
    ctaRow.style.cssText = 'display:flex;gap:12px;padding-top:20px;';

    var findJobA = document.createElement('a');
    findJobA.href = 'find-a-job.html';
    findJobA.textContent = 'Find a Job';
    findJobA.style.cssText = 'flex:1;text-align:center;border:2px solid #D4AF37;color:#D4AF37;font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;text-decoration:none;padding:11px 8px;text-transform:uppercase;letter-spacing:0.1em;';

    var hireTalentA = document.createElement('a');
    hireTalentA.href = 'hire-talent.html';
    hireTalentA.textContent = 'Hire Talent';
    hireTalentA.style.cssText = 'flex:1;text-align:center;background:#D4AF37;color:#000a1e;font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;text-decoration:none;padding:11px 8px;text-transform:uppercase;letter-spacing:0.1em;';

    ctaRow.appendChild(findJobA);
    ctaRow.appendChild(hireTalentA);
    mobileMenu.appendChild(ctaRow);

    document.body.appendChild(mobileMenu);

    var isOpen = false;
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen = !isOpen;
      mobileMenu.style.display = isOpen ? 'flex' : 'none';
    });

    document.addEventListener('click', function () {
      if (isOpen) {
        isOpen = false;
        mobileMenu.style.display = 'none';
      }
    });
  }
})();
