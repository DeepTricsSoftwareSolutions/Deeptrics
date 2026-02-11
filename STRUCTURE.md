# DeepTrics Project Structure

## Overview

Static website for DeepTrics (free internships, services, careers). No build step—served as-is from root.

## Folder Structure

```
Deeptrics/
├── index.html              # Homepage
├── about.html              # About us
├── contact.html            # Contact form
├── services.html           # Services overview
├── careers.html            # Careers & jobs
├── internships.html        # Internships overview
├── apply.html              # Application form (Google Sheets)
├── college-partnership.html
├── web-development.html     # Service detail
├── ai-solutions.html       # Service detail
├── mobile-app.html         # Service detail
├── aiml-developer.html    # Internship role
├── frontend-developer.html # Internship role
├── backend-developer.html # Internship role
│
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (imports variables)
│   │   └── variables.css   # Design tokens (colors, etc.)
│   ├── js/
│   │   ├── main.js         # Global (nav, contact form, apply form handler)
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
├── favicon.ico
├── CNAME
├── package.json
├── jest.config.js
├── readme.md
└── STRUCTURE.md (this file)
```

## Key Paths

| Path | Purpose |
|------|---------|
| `assets/css/style.css` | Main stylesheet (all pages) |
| `assets/css/variables.css` | Design tokens (imported by style.css) |
| `assets/js/main.js` | Handles contact form, apply form, smooth scroll, nav |
| `assets/js/modules/apply-form-payload.js` | Builds payload for Apply form → Google Sheets |
| `docs/GOOGLE_SHEETS_SETUP.md` | Setup guide for Google Sheets integration |

## Naming Conventions

- **HTML**: Lowercase with hyphens (e.g. `ai-solutions.html`, `mobile-app.html`)
- **CSS**: Lowercase with hyphens
- **JS**: camelCase for functions, kebab-case for files

## Adding New Pages

1. Create HTML file in root (e.g. `new-page.html`)
2. Add favicon to `<head>`: `<link rel="icon" href="assets/images/logo/DeepTrics.png" type="image/png">`
3. Include same header/footer structure as other pages
4. Link `assets/css/style.css` and `assets/js/main.js`

## Adding New JS Modules

1. Put in `assets/js/modules/`
2. Export for Node (Jest): `if (typeof module !== 'undefined' && module.exports) { module.exports = { buildX }; }`
3. Attach to window for browser: `if (typeof window !== 'undefined') { window.buildX = buildX; }`
4. Load script before `main.js` in HTML that needs it
