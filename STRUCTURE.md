# DeepTrics Project Structure

## Overview

Static website for **DeepTrics, a software development company** (products & services), with a free student internship program. No build step—served as-is from root.

## Folder Structure

```
Deeptrics/
├── index.html              # Homepage (software company: services, products, process)
├── products.html           # Products showcase (currently placeholder cards — see TODO below)
├── services.html           # 6 services: web, mobile, AI/ML, cloud/DevOps, UI/UX, custom software
├── about.html              # About the company
├── internships.html        # Internships overview + roles + embedded application form
├── careers.html            # Careers & company values
├── college-partnership.html# Institution partnerships
├── contact.html            # Contact form (Google Sheets)
│
├── web-development.html     # Service detail (linked from services.html)
├── AI-solutions.html        # Service detail (linked from services.html)
├── Mobile-app.html          # Service detail (linked from services.html)
│
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (imports variables)
│   │   └── variables.css   # Design tokens (colors, etc.)
│   ├── js/
│   │   ├── main.js         # Global (nav, contact form, apply form, footer year, honeypot)
│   │   └── modules/
│   │       └── apply-form-payload.js  # Apply form → Google Sheets payload
│   └── images/
│       ├── logo/
│       ├── background/
│       └── ...
│
├── docs/
│   └── GOOGLE_SHEETS_SETUP.md
│
├── __tests__/
│   ├── apply-form-payload.test.js
│   └── apply-form-handler.test.js
│
├── robots.txt              # SEO: allows crawling, points to sitemap
├── sitemap.xml             # SEO: lists all pages
├── favicon.ico
├── CNAME                   # www.deeptrics.com
├── package.json
├── jest.config.js
├── readme.md
└── STRUCTURE.md (this file)
```

## Navigation

All pages share one header/footer. Primary nav:
`Home · Products · Services · About · Internships · Careers · Contact`
(College Partnership is linked from the footer.) The active link is set
automatically by `setActiveNavLink()` in `main.js` based on the filename.

## Key Paths

| Path | Purpose |
|------|---------|
| `assets/css/style.css` | Main stylesheet (all pages) |
| `assets/css/variables.css` | Design tokens (imported by style.css) |
| `assets/js/main.js` | Nav toggle (accessible), contact form, apply form, footer year, honeypot |
| `assets/js/modules/apply-form-payload.js` | Builds payload for the Apply form → Google Sheets |
| `internships.html` | Single internships page; the application form is embedded here (`#apply`) |

## Forms (Google Apps Script + Sheets)

- **Contact** (`#myForm` on `contact.html`) → `CONTACT_FORM_SCRIPT_URL` in `main.js`.
- **Apply** (`#globalApplicationForm` on `internships.html`) → Apps Script URL in `main.js`,
  payload built by `apply-form-payload.js` (loaded **before** `main.js`).
- Both use `mode: 'no-cors'`, which returns an opaque response — the success
  callback runs even if the script rejects the data. Treat the success message
  as "sent", not "confirmed stored".
- Both forms include a hidden **honeypot** input (`name="website"`). If filled,
  the submit is treated as spam and dropped.

## Products

`products.html` and the Products section on `index.html` feature three products,
all currently **"Coming soon"**: **SaaradhiGo** (ride-hailing), **BhojanGo**
(food delivery), and **Data Migration & Analysis Expert**. Update the status
badges (`.product-badge soon|beta|live`) and the "Notify me" links as each one
launches.

## Naming Conventions

- **HTML**: Lowercase with hyphens (note: `AI-solutions.html` / `Mobile-app.html` keep their original capitalization for link stability)
- **CSS**: Lowercase with hyphens
- **JS**: camelCase for functions, kebab-case for files

## Adding New Pages

1. Create HTML file in root (e.g. `new-page.html`)
2. Copy the `<head>` SEO block (canonical + OG/Twitter) from an existing page and update URLs/text
3. Include the same header (with `<a class="skip-link">`, accessible `<button class="burger">`) and footer (with `<span class="footer-year">`)
4. Wrap page content in `<main id="main">…</main>`
5. Link `assets/css/style.css` and `assets/js/main.js`
6. Add the page to `sitemap.xml`

## Adding New JS Modules

1. Put in `assets/js/modules/`
2. Export for Node (Jest): `if (typeof module !== 'undefined' && module.exports) { module.exports = { buildX }; }`
3. Attach to window for browser: `if (typeof window !== 'undefined') { window.buildX = buildX; }`
4. Load script before `main.js` in HTML that needs it
