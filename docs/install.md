# Install

## Requirements

Install required software:
- PostgreSQL v17+
- Node.js v22+


## Enable pgvector for the kindred db

1. Switch to the postgres user.
2. Connect to kindred DB as superuser: `psql -U postgres -d kindred`
3. Enable the pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`


## Install packages required by Puppeteer

This is OS and distro specific.


## Env file setup

Tempalte env files are available:
src/client/config/template.env.development
src/server/config/template.env.development

Copy these to the required env files, e.g.:
src/client/.env.development
src/server/.env.development

Then configure them as desired.


## App setup

1. Go to the server path and run the env script, e.g. `. scripts/dev.sh`.
2. Run the general setup: `npm run ts-script setup`
3. Load API keys for LLMs: `npm run ts-script load-tech-provider-api-keys`
   When prompted enter the directory containing the JSON containing API keys.
   The expected format of the key JSON files is in the next section.


### Example JSON API keys file format

```json
[
  {
    "techProviderName": "Google Gemini",
    "status": "A",
    "name": "Gemini free-tier API key",
    "accountEmail": "..",
    "apiKey": "..",
    "pricingTier": "free"
  },
  {
    "techProviderName": "Google Gemini",
    "status": "A",
    "name": "Gemini paid-tier API key",
    "accountEmail": "..",
    "apiKey": "..",
    "pricingTier": "paid"
  }
]
```

