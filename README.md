# Substance Journal

Run simple journals based on Substance. This is a work in progress.

# Install

Clone the repository.

```bash
$ git clone https://github.com/substance/journal.git
```

Navigate to the source directory.

```bash
$ cd journal
```

Install via npm

```bash
$ npm install
```

Seed the SQLite database.

```bash
$ npm run seed
```

Start your journal.

```bash
$ npm run start
```

Open `http://localhost:5000` in your browser to see the journa's front end.

In order to edit and create articles navigate to `http://localhost:5000/substance`.

Login with the user `admin` and password `123456`.

# Features

- Write and publish articles on an integrated web-platform using Subtance editing technology
- Collaboration (write together, esp. review stuff)
- very easy to deploy (runs on every linux system)
- no dependencies on external services (no facebook, twitter integration, yes you heard right)

# A blog engine?

No. Substance Journal is intended to create professional web-first publication rather than smaller timely pieces (blog). Here are some differences.

- Table of contents during editing and for your readers
- Collaborate during editing and make notes to point out problems and make suggestions
- Reader comments

## Future Challenges

- How can we combine individually owned instances but still can announce some articles to be globally available. 
- Decentralized search index / routing?

For example: there are 20 different substance journals hosted by different people, they also run different versions. can there be a public index about 

## Roadmap

This roadmap is not final, and may change.

### 0.1.0

- Basic editing (text, headings)
- Comments (for editors and readers)
  - Readers authenticate via Twitter
- User management
  - no public signup
  - new users are created from the control panel
  - everybody is an admin
- SQLite only (using Knex.js query builder, so we can switch to other SQL databases)
- Simple Reader view (non-interactive -> mobile friendly)
- Server-side rendering so google can easily index the page

### 0.2.0

- Support for Images
- Control about publishing changes (See Issue #2)
- Invite collaborators via email
- More fine grained permisison system

### 0.3.0

- Full Text Search on text fragment level using Elastic Search
- Integration of [Lens Browser](https://medium.com/@_mql/self-host-a-scientific-journal-with-elife-lens-f420afb678aa) interface

### 0.4.0

- Subject tagging based on selections in the doc
- Expose subjects in the browser interface