# DeepTrics Project Structure

## Overview

Static website for **DeepTrics, a software development company** (products & services), with a free student internship program. No build step—served as-is from root.

## Clean URLs (folder-based)

Every page except the homepage lives in its own folder as `index.html`, so it
serves at a trailing-slash URL with no `.html`:

| File | URL |
|------|-----|
| `index.html` | `/` |
| `products/index.html` | `/products/` |
| `services/index.html` | `/services/` |
| `contact/index.html` | `/contact/` |
| …and so on | |

**Because pages live in subfolders, all asset and cross-page links must be
ROOT-ABSOLUTE** (start with `/`): `/assets/css/style.css`, `/services/`,
`/contact/?type=quote`. Relative paths (`assets/...`, `services.html`) will break.

## Folder Structure

```
Deeptrics/
├── index.html                    # Homepage → "/"
├── products/index.html           # → /products/  (products showcase)
├── services/index.html           # → /services/  (6 services)
├── about/index.html              # → /about/
├── internships/index.html        # → /internships/  (overview + roles + embedded apply form)
├── careers/index.html            # → /careers/
├── college-partnership/index.html# → /college-partnership/
├── contact/index.html            # → /contact/  (context-aware via ?type=, Google Sheets)
├── web-development/index.html     # → /web-development/  (service detail)
├── AI-solutions/index.html        # → /AI-solutions/   (service detail)
├── Mobile-app/index.html          # → /Mobile-app/     (service detail)
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
| `/assets/css/style.css` | Main stylesheet (all pages) |
| `/assets/css/variables.css` | Design tokens (imported by style.css) |
| `/assets/js/main.js` | Nav toggle (accessible), contact form, apply form, footer year, honeypot, contact `?type=` context |
| `/assets/js/modules/apply-form-payload.js` | Builds payload for the Apply form → Google Sheets |
| `internships/index.html` | Single internships page; the application form is embedded here (`/internships/#apply`) |

## Forms (Google Apps Script + Sheets)

- **Contact** (`#myForm` on `/contact/`) → `CONTACT_FORM_SCRIPT_URL` in `main.js`.
  The page is **context-aware**: a `?type=` query (quote/project/notify/partnership/
  internship) sets the heading, intro, and pre-selects the "What's this about?" subject.
- **Apply** (`#globalApplicationForm` on `/internships/`) → Apps Script URL in `main.js`,
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

1. Create a folder + file: `new-page/index.html` (serves at `/new-page/`)
2. Copy the `<head>` SEO block (canonical + OG/Twitter) from an existing page and set URLs to `https://www.deeptrics.com/new-page/`
3. Include the same header (with `<a class="skip-link">`, accessible `<button class="burger">`) and footer (with `<span class="footer-year">`)
4. Wrap page content in `<main id="main">…</main>`
5. Link **root-absolute** assets: `/assets/css/style.css` and `/assets/js/main.js`
6. Use **root-absolute, trailing-slash** internal links: `/services/`, `/contact/?type=quote`
7. Add the page to `sitemap.xml`

> ⚠️ Always use root-absolute paths (`/assets/...`, `/page/`). Relative paths break because pages live in subfolders.

## Adding New JS Modules

1. Put in `assets/js/modules/`
2. Export for Node (Jest): `if (typeof module !== 'undefined' && module.exports) { module.exports = { buildX }; }`
3. Attach to window for browser: `if (typeof window !== 'undefined') { window.buildX = buildX; }`
4. Load script before `main.js` in HTML that needs it
