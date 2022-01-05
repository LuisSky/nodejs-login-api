const bcrypt = require('bcrypt')

class EncryptHelper {
  static hash(password) {
    return bcrypt.hashSync(password, 10)
  }
}

module.exports = EncryptHelper