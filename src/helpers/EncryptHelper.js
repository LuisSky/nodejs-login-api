const bcrypt = require('bcrypt')

class EncryptHelper {
  static hash(nonHashPassword) {
    return bcrypt.hashSync(nonHashPassword, 10)
  }
  static compare(nonHashPassword, userHashPassword) {
    return bcrypt.compare(nonHashPassword, userHashPassword)
  }
}

module.exports = EncryptHelper