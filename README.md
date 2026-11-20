# Get Contest Votes Online

Production static files are in `public/`. Cloudflare Workers deploys only this directory using `wrangler.jsonc`; source and original assets are not public deployment files.

Canonical domain: https://getcontestvotesonline.com
Sitemap: https://getcontestvotesonline.com/sitemap.xml
Quote form: Formspree xyeweyzz.

Deploy with `npx wrangler deploy` after authenticating to the owning Cloudflare account and confirming the domain zone is active. Configure www to redirect to the canonical apex domain. Verify HTTPS and the sitemap before submitting it in Search Console.

The `source/` folder retains the original preview builder. Its release helper writes a sibling production-package directory; copy its checked output into `public/` for deployment. Root HTML files are an initial snapshot; `public/` is the deployment authority.
