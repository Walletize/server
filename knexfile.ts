import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'walletize',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'walletize',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: ['./src/migrations'],
    },
    seeds: {
      directory: './src/seeds',
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    }
  }

};

module.exports = config;
