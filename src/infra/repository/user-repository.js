const knex = require('../../main/config/database/knex')

class UserRepository {
  createOne (user) {
    return knex('users').insert(user, ['id', 'email'])
  }

  findOne (findUser) {
    return knex('users').where({ email: findUser.email }).first()
  }

  findAll () {
    return knex('users').select(['id', 'email'])
  }
}

module.exports = UserRepository
