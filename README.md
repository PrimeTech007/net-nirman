# Net Nirman

This is the codebase for the Net Nirman project, built with React, Vite, Firebase, and Tailwind/Tailwind-like styling.

## Development

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## Deployment Readiness

This project is ready to deploy and includes the following production-friendly assets:

- `vercel.json` — Vercel rewrite configuration for SPA routing
- `public/robots.txt` — search engine crawler directives
- `public/sitemap.xml` — static sitemap entries for SEO discovery
- `public/manifest.webmanifest` — PWA metadata for installed web app behavior
- `index.html` — canonical URL, Open Graph, Twitter card, structured JSON-LD schema, theme color, and mobile metadata

## SEO / Visibility Features

Key SEO and exposure improvements already included:

- static metadata for title, description, keywords, and canonical URL
- Open Graph tags for social sharing previews
- Twitter card tags for better sharing on social platforms
- JSON-LD organization schema for search engines
- `robots.txt` and `sitemap.xml` for crawler guidance
- PWA manifest to support mobile install behavior

## Hosting Notes

This project is suitable for hosting on platforms like Vercel, Netlify, or any static web host that supports a Vite build output.

Important deployment items:

- Build output is generated into `dist/`
- `npm run build` has been validated successfully
- The app uses client-side routing, so server rewrites are required for SPA support (already configured in `vercel.json`)
- Firebase backend support is used for admin uploads, contact form handling, and CMS content if configured

## What this project includes

- React single-page app with client-side navigation
- Dynamic content sections and admin-editable content patterns
- Firebase integration for authentication, Firestore, and storage
- Contact form with honeypot and Resend email support
- SEO metadata, social sharing meta, and crawler assets
- Responsive sections for Hero, Projects, Contact, Team, and more
- Production build support for domain hosting on `netnirman.com`

## Next steps for launch

- Verify Firebase environment variables are set in your deployment platform
- Confirm the domain `netnirman.com` points to your host
- Enable HTTPS/SSL on the host
- Consider adding analytics and search console verification after deployment
- Update content and metadata with live business details before going public
