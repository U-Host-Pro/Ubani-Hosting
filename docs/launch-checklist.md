# Launch Checklist

1. Create Cloudflare Worker resources.
1. Create a Turso database and set `TURSO_DATABASE_URL` in `services/api/wrangler.toml`.
1. Add Turso auth token:
   - `wrangler secret put TURSO_AUTH_TOKEN`
1. (Optional for now) `wrangler r2 bucket create ubani-sites`
1. Set Worker secrets:
   - `wrangler secret put JWT_SECRET`
   - `wrangler secret put PASSWORD_SALT`
   - `wrangler secret put YOCO_SECRET_KEY`
   - `wrangler secret put ZOHO_ACCESS_TOKEN`
   - `wrangler secret put ZOHO_MAIL_ACCOUNT_ID`
   - `wrangler secret put ZOHO_FROM_EMAIL`
   - `wrangler secret put OPENAI_API_KEY`
1. Apply `database/schema.sql` to Turso using Turso CLI or dashboard SQL editor.
1. Deploy API Worker:
   - `npm run deploy:api`
1. Connect domain routes and DNS in Cloudflare.
1. Configure GitHub secret `CLOUDFLARE_API_TOKEN` for CI deploy.

If R2 is not configured, all non-deployment features still work. The deploy endpoint returns `503 deployment_unavailable` until R2 is enabled.
