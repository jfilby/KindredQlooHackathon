## Inspiration

Information overload is a real problem today, many people want to stay
up-to-date with the latest tech news but can't.

Modern LLMs have made it possible to summarize information at scale with a very
high level of quality.


## What it does

Kindred summaries HackerNews posts and their related information. These
summaries are then displayed on a web page, make it fast and easy to stay
up-to-date with the latest HN posts.

Each post summary includes links to both the story's URL if present and the
original post on HN. A list of key insights is presented per post. Clicking an
insight shows its most relevant comments in-line, each clickable to view the
original on HN.

You can also chat with Kindred about a post summary to ask any questions you
may have about the story, the post and its comments.

Easily specify your interests and tastes, which can be related to or
independent of the social media site summarized. The system uses this
information to rerank the post summaries according to each user's interests.

Tastes include books, movies, podcasts and more. Recommendedations for tastes
are also sourced once any tastes are initially added, via Qloo's insights API.


## How we built it

The tech stack consists of:
- Next.js + TypeScript
- Apollo GraphQL and Prisma (Node libraries)
- Serene Core (Node/TS basics library I wrote myself)
- Serene AI (Node/TS AI library I wrote myself)
- PostgreSQL (+pgvector)

Integrations:
- Algolia HN API
- Qloo (Tastes AI platform)
- LLMs (configurable)


## Installing

See the [install doc](docs/install.md).

