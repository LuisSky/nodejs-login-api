const bcrypt = require('bcrypt')

class EncryptHelper {
  hash (noHashString) {
    return bcrypt.hashSync(noHashString, 10)
  }

  compare (noHashString, hashString) {
    return bcrypt.compare(noHashString, hashString)
  }
}

module.exports = EncryptHelper
