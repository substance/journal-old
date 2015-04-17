# Substance Journal

Run simple journals based on Substance. This for now is just a place for brainstorming on how a full-fledged Substance document hub could look like.

# Features

- Write and publish articles on an integrated web-platform
- Users can comment on each piece
- collaboration (write together, esp. review stuff)
- Integrate Lens Browser as an interface for listing articles
- allow subject tagging for articles (ala archivist), so we can have different channels in the search interface

# Requirements

- easy to deploy (Heroku should do it)
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

For example: there are 20 different substance journals hosted by different people, they also run different versions. can there be a public index about 
