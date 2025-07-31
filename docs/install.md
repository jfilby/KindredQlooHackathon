# Install

## Enable pgvector for the kindred db

1. Switch to the postgres user.
2. Connect to kindred DB as superuser: `psql -U postgres -d kindred`
3. Enable the pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`


## Install packages required by Puppeteer

This is OS and distro specific.


## App setup

1. Go to the server path and run the env script, e.g. `. scripts/dev.sh`.
2. Run the general setup: `npm run ts-script setup`
3. Load API keys for LLMs: `npm run ts-script load-tech-provider-api-keys`
   When prompted enter the directory containing the JSON containing API keys.

