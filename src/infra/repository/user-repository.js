const knex = require('../../main/config/database/knex')

class UserRepository {
  createOne (user) {
    return knex('users').insert(user, ['id', 'email'])
  }

  findByEmail (email) {
    return knex('users').where({ email }).first()
  }
}

module.exports = UserRepository
