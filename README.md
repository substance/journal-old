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

## Roadmap

### 0.1.0

- Basic editing (text, headings)
- Remarks (make Notes during editing)
- User management
  - no public signup
  - invite new people from the control panel (using email)
  - everybody is an admin
- SQLLite only (but with little abstraction so we can connect Postgres et. al in future versions)

### 0.2.0

- Support for Images
- Reader comments (how do they authenticate? maybe it makes sense to user twitter/facebook auth here)

### 0.3.0

- Full Text Search on text fragment level using Elastic Search
- Integration of [Lens Browser](https://medium.com/@_mql/self-host-a-scientific-journal-with-elife-lens-f420afb678aa) interface

### 0.4.0

- Definition of subjects
