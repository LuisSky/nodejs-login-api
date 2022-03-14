const bcrypt = require('bcrypt')

class EncryptHelper {
  hash (nonHashString) {
    return bcrypt.hashSync(nonHashString, 10)
  }

  compare (nonHashString, hashString) {
    return bcrypt.compare(nonHashString, hashString)
  }
}

module.exports = EncryptHelper
