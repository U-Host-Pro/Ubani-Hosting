# Ubani Hosting

Production-ready starter for a Cloudflare-first hosting platform:

- Marketing site, client portal, admin panel app scaffolds
- API Worker with auth, deployment, billing, referral rewards
- Turso SQL database integration and optional R2 object storage integration
- Yoco, Zoho, and OpenAI service adapters
- GitHub Actions and Cloudflare deployment docs

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure Worker vars/secrets in `services/api/wrangler.toml`:
   - `TURSO_DATABASE_URL` in `wrangler.toml`
c   - `wrangler secret put TURSO_AUTH_TOKEN`
3. Apply `database/schema.sql` to your Turso database.
4. Run locally:
   - `npm run dev:api`
5. Deploy:
   - `npm run deploy:api`

See `docs/launch-checklist.md` for full production setup.
