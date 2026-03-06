# Ubani Hosting Architecture

## Platform

- Domain: `ubanihosting.co.za`
- Core compute: Cloudflare Workers
- Database: Cloudflare D1 (`ubani-db`)
- Asset storage: Cloudflare R2 (`ubani-sites`)
- Payments: Yoco
- Transactional email: Zoho Mail API
- AI support: OpenAI Responses API

## Core Services

- `services/api`: auth, deploy, invoice checkout, support chat
- `services/wordpress`: one-click WordPress installer flow
- `services/growth`: referral and SEO generation utilities
- Additional service folders are scaffolds for later extraction

## Security Baseline

- Password hashing with per-environment salt
- Signed bearer token auth with expiry
- CORS and strict JSON API responses
- Cloudflare WAF, DDoS, bot protection at edge
