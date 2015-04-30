var SCHEMA = {
  "users": {
    "username": "text PRIMARY KEY",
    "email": "text NOT NULL UNIQUE",
    "name": "text",
    "hash": "text",
    "data": "text",
    "created_at": "timestamp NOT NULL"
  },

  "documents": {
    "id": "text UNIQUE PRIMARY KEY",
    "data": "text"
  }
};

module.exports = SCHEMA;