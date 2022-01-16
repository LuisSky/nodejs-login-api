const knex = require('knex')
const knexFile = require('../../../knexfile.js')
const db = knex(knexFile.development)

module.exports = db
