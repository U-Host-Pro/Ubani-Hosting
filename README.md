# Ubani Hosting

Production-ready starter for a Cloudflare-first hosting platform:

- Marketing site, client portal, admin panel app scaffolds
- API Worker with auth, deployment, billing, referral rewards
- D1 schema and R2 object storage integration
- Yoco, Zoho, and OpenAI service adapters
- GitHub Actions and Cloudflare deployment docs

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure Worker secrets and bindings in `services/api/wrangler.toml`.
3. Apply database schema:
   - `wrangler d1 execute ubani-db --file ../../database/schema.sql`
4. Run locally:
   - `npm run dev:api`
5. Deploy:
   - `npm run deploy:api`

See `docs/launch-checklist.md` for full production setup.
