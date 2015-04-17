# Substance Journal

Run simple journals based on Substance. This for now is just a place for brainstorming on how a full-fledged Substance document hub could look like.

# Features

- Write and publish articles on an integrated web-platform
- Users can comment on each piece
- collaboration (write together, esp. review stuff)

# Requirements

- easy to deploy
- authentication / authorization (who can create, edit, co-edit, delete articles etc.)
- Can we use an existing infrastructure for sign in (Twitter, Facebook etc. I would avoid because they are not open, is there a reasonable open alternative that)

## Server options

- Node.js

## Database options

- Postgres vs. MongoDB vs. Rethinkdb
- ElasticSearch for full text search

## Challenges

- How can we combine individually owned instances but still can announce some articles to be globally available. 
- Decentralized search index / routing?
