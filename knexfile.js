// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.substance.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './server/db/seeds'
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: './test.substance.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './production.substance.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};