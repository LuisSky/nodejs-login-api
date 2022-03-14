// Update with your config settings.
const env = require('./src/config/env')

const { DB_CLIENT, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_USER, DB_PORT } = env

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
