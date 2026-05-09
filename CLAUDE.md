# R&R Recruitment Services Limited — Project Brief

## What this project is
A static, multi-page recruitment website for **R&R Recruitment Services Limited**, a premium Lagos-based firm that connects Nigerian professionals with employers. Brand personality: **"The Connected Authority"** — expert, localized, deeply invested in Nigerian professional growth.

---

## Tech Stack
- **HTML** — vanilla, no framework, no build step required
- **Tailwind CSS** — loaded via CDN (`https://cdn.tailwindcss.com?plugins=forms,container-queries`). Custom design tokens are embedded in a `<script id="tailwind-config">` block inside every HTML file.
- **Google Fonts** — Montserrat (headings), Open Sans (body), loaded via `<link>` in `<head>`
- **Material Symbols Outlined** — icon font, loaded via Google Fonts CDN
- **nav.js** — shared vanilla JS for mobile menu, CTA button routing, and logo click
- No npm, no bundler, no framework

---

## File Map

| File | Page | Notes |
|------|------|-------|
| `index.html` | Homepage | Hero, stats bar, service highlights, job listings preview |
| `about.html` | About Us | Company story, team, values |
| `services.html` | Our Services | Service cards grid |
| `jobs.html` | Jobs Board | Full job listings |
| `find-a-job.html` | Candidate Hub | Job search interface for candidates |
| `hire-talent.html` | Employer Hub | Hiring interface for employers |
| `contact.html` | Contact Us | Contact form + office info |
| `resources.html` | Resources & Insights | Blog/articles section |
| `nav.js` | — | Mobile menu toggle, CTA button → page routing, logo click handler |
| `server.js` | — | Local dev server. Run: `node server.js` → http://localhost:3000 |
| `setup.js` | — | One-time script: reads raw design exports from `../stitch_r_r_recruitment_services_hub/`, patches nav links, writes output HTML. Only re-run when rebuilding from design exports. |

---

## Design System — Heritage & Horizon

### Brand Colours
| Role | Name | Hex | Tailwind token |
|------|------|-----|----------------|
| Primary | Oxford Navy | `#000a1e` | `primary` |
| Primary container | Deep Navy | `#002147` | `primary-container` |
| Secondary | Heritage Gold | `#735c00` | `secondary` |
| Secondary container | Gold | `#fed65b` | `secondary-container` |
| Accent CTA / WhatsApp | Vibrant Amber | `#FFBF00` | `tertiary-fixed-dim` |
| Body text | Charcoal | `#1c1b1b` | `on-surface` |
| Page background | Warm White | `#fcf9f8` | `background` |
| Section backgrounds | Soft Grey | `#f6f3f2` | `surface-container-low` |

### Typography
| Style | Font | Size | Weight | Use |
|-------|------|------|--------|-----|
| `display-lg` | Montserrat | 48px | 700 | Hero headlines (desktop) |
| `display-lg-mobile` | Montserrat | 32px | 700 | Hero headlines (mobile) |
| `headline-md` | Montserrat | 32px | 600 | Section titles |
| `headline-sm` | Montserrat | 24px | 600 | Card titles, nav |
| `body-lg` | Open Sans | 18px | 400 | Lead paragraphs |
| `body-md` | Open Sans | 16px | 400 | General body text (minimum for mobile) |
| `label-caps` | Montserrat | 12px | 700 | Uppercase tags, CTA buttons, category labels |

**Rule:** Never go below 16px body text. Use `clamp()` or Tailwind responsive variants for fluid sizing. Line height must be 1.5–1.6x for body text.

### Spacing Scale (base-8)
- `stack-sm`: 8px | `stack-md`: 16px | `stack-lg`: 32px
- `gutter`: 24px | `section-gap`: 80px
- Container max-width: 1280px | Mobile margin: 16px

### Shapes
- Default radius: `0.25rem` (buttons, inputs — crisp corporate feel)
- Cards: `rounded-xl` (`0.5rem`) — slightly softer
- WhatsApp FAB: full pill (`rounded-full`)

### Shadows — Navy-tinted (on-brand)
- Card (rest): `shadow-[0px_4px_20px_rgba(0,33,71,0.05)]`
- Card (hover): `shadow-[0px_8px_30px_rgba(0,33,71,0.08)]` + `-translate-y-0.5`

### Elevation
- Sticky nav: `bg-surface/80 backdrop-blur-md` (glassmorphism on scroll)
- Cards lift 2px on hover (`hover:-translate-y-0.5`)

---

## Component Patterns

### Dual CTA (used in heroes)
- Primary: `bg-primary text-on-primary` — "I'm Hiring Talent"
- Secondary: Ghost — `border-2 border-on-primary text-on-primary` — "I'm Looking for Work"
- Always pair these two in hero sections

### Floating WhatsApp Button
- Fixed bottom-right, amber background (`#FFBF00`), white icon
- Full pill shape
- Tooltip: "Chat with a Consultant"
- Present on every page

### Job Cards
- Title in Montserrat, location icon, subtle navy shadow
- "View Details" button — hover-reveal on desktop, always visible on mobile

### Service Cards
- Top-aligned gold icon (`text-secondary`)
- Bold headline, short description
- "Learn More →" text link

### Trust-builder stats
- Bold metric + `label-caps` label
- Gold colour for the number, muted for label

### Forms
- Single-column, clean labels
- `border-primary` focus rings (2px gold)
- Navy submit button

---

## Mobile-First Rules (apply to every change)

Write CSS/Tailwind mobile-first: base classes = mobile, `md:` / `lg:` = enhancement.

### Layout
- Single column on mobile, multi-column on `md:` and above
- Touch targets minimum **44×44px** (buttons, links, nav items)
- No horizontal overflow — every element must fit within the viewport width
- Test at 375px (iPhone SE), 390px (iPhone 14), and 768px (tablet) widths

### Images
- Always set explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS)
- Use `loading="lazy"` on all below-the-fold images
- Prefer WebP format for new images
- Use `object-fit: cover` with explicit container dimensions

### Typography (mobile)
- Body text: minimum 16px (`text-body-md`)
- Line height: 1.5–1.6 (already in Tailwind config)
- Max line length: ~35–45 characters on mobile
- Use `md:text-display-lg` pattern to step up sizes on desktop

### Navigation
- Hamburger menu handled by `nav.js` — keep it working
- Mobile menu links: minimum 48px tap height with padding
- No hover-only states on mobile — interactive elements must be tappable

### Performance (Core Web Vitals targets)
| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP | < 2.0s | Largest element paint time |
| INP | < 200ms | Interaction responsiveness |
| CLS | < 0.1 | Layout shift during load |

To avoid regressions:
- Set `width` and `height` on all `<img>` tags (prevents CLS)
- Don't add heavy third-party scripts without `defer` or `async`
- Keep total page weight under 1MB where possible
- Inline only critical CSS; everything else via CDN (already the pattern)

### Accessibility
- Colour contrast: minimum **4.5:1** for body text, **3:1** for large text / UI components
- The Oxford Navy `#000a1e` on white `#fcf9f8` meets AAA — maintain this
- All interactive elements need visible focus states
- Images need descriptive `alt` text
- Form inputs need `<label>` elements or `aria-label`
- Don't use colour alone to convey meaning

---

## Content Rules

- **Never use lorem ipsum** — write realistic Nigerian business/recruitment copy
- Tone: authoritative, warm, professional — not stiff corporate, not overly casual
- Use authentic Lagos/Nigerian context: sectors (oil & gas, fintech, FMCG), real job titles, local cadence
- Statistics on the site (500+ placed, 15+ years, 250+ clients, 98% retention) are brand claims — keep them consistent
- Category labels use `label-caps` style: ALL CAPS, 12px, Montserrat 700, wide letter-spacing

---

## Git & Deploy Workflow

```
Working branch : dev
Production     : main  → auto-deploys to Vercel
```

- **All changes go on `dev`** — never commit directly to `main`
- Push `dev` to GitHub → Vercel creates a **preview URL** (not the live site)
- To publish: `git checkout main && git merge dev && git push origin main && git checkout dev`
- Commit in logical batches — one feature/fix per commit, not one giant dump

### Remote
```
https://github.com/tboibamz-coder/stitch_r_r_recruitment_services_hub.git
```

---

## What NOT to do

- Don't add `package.json`, npm, or a bundler — this is intentionally zero-build
- Don't modify the Tailwind config `<script>` inside HTML files unless changing design tokens globally (and do it in all files consistently)
- Don't re-run `setup.js` unless rebuilding from raw design exports — it overwrites built pages
- Don't use `href="#"` for navigation links — every link must point to a real page
- Don't use fixed pixel widths on containers — use `max-w-container-max mx-auto` pattern
- Don't add features or refactor beyond what the task asks for
- Don't add code comments unless the WHY is genuinely non-obvious
