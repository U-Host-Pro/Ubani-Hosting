# Launch Checklist

1. Create Cloudflare resources.
1. `wrangler d1 create ubani-db`
1. `wrangler r2 bucket create ubani-sites`
1. Update `services/api/wrangler.toml` with real D1 ID.
1. Set Worker secrets:
   - `wrangler secret put JWT_SECRET`
   - `wrangler secret put PASSWORD_SALT`
   - `wrangler secret put YOCO_SECRET_KEY`
   - `wrangler secret put ZOHO_ACCESS_TOKEN`
   - `wrangler secret put ZOHO_MAIL_ACCOUNT_ID`
   - `wrangler secret put ZOHO_FROM_EMAIL`
   - `wrangler secret put OPENAI_API_KEY`
1. Apply schema:
   - `wrangler d1 execute ubani-db --file ../../database/schema.sql`
1. Deploy API Worker:
   - `npm run deploy:api`
1. Connect domain routes and DNS in Cloudflare.
1. Configure GitHub secret `CLOUDFLARE_API_TOKEN` for CI deploy.
