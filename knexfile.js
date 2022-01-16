// Update with your config settings.

require('dotenv').config()

const { DB_CLIENT, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_USER, DB_PORT } = process.env

module.exports = {

  development: {
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      database: DB_DATABASE,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      // tableName: 'migrations',
      directory: 'src/migrations'
    }
  }

}
