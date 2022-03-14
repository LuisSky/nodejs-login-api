const bcrypt = require('bcrypt')

class EncryptHelper {
  static hash (nonHashString) {
    return bcrypt.hashSync(nonHashString, 10)
  }

  static compare (nonHashString, hashString) {
    return bcrypt.compare(nonHashString, hashString)
  }
}

module.exports = EncryptHelper
